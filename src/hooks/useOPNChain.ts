/**
 * useOPNChain.ts
 * Live hook kết nối trực tiếp với OPN Chain RPC.
 * Không cần thư viện ngoài — dùng fetch thuần.
 *
 * Usage:
 *   const { blockNumber, latencyMs, gasPrice, isConnected, error } = useOPNChain();
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Config ────────────────────────────────────────────────────────────────
export const OPN_CHAIN = {
  name: "OPN Testnet",
  rpcUrl: "https://testnet-rpc.iopn.tech",
  chainId: 984,
  symbol: "OPN",
  explorerUrl: "https://testnet.iopn.tech",
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────
export interface OPNChainState {
  blockNumber: number | null;
  latencyMs: number | null;
  gasPrice: string | null;       // in Gwei, human-readable
  gasPriceRaw: bigint | null;    // raw wei value
  isConnected: boolean;
  isFetching: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface RPCResponse<T> {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

// ─── RPC helper ────────────────────────────────────────────────────────────
let _rpcId = 0;

async function rpcCall<T>(
  method: string,
  params: unknown[] = [],
  signal?: AbortSignal,
): Promise<T> {
  const id = ++_rpcId;
  const res = await fetch(OPN_CHAIN.rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id }),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json: RPCResponse<T> = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result as T;
}

// hex "0x..." → number
function hexToNumber(hex: string): number {
  return parseInt(hex, 16);
}

// hex "0x..." → bigint
function hexToBigInt(hex: string): bigint {
  return BigInt(hex);
}

// wei (bigint) → Gwei string, 2 decimals
function weiToGwei(wei: bigint): string {
  const gwei = Number(wei) / 1e9;
  return gwei < 0.01 ? "<0.01" : gwei.toFixed(2);
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useOPNChain(pollingIntervalMs = 4000): OPNChainState {
  const [state, setState] = useState<OPNChainState>({
    blockNumber: null,
    latencyMs: null,
    gasPrice: null,
    gasPriceRaw: null,
    isConnected: false,
    isFetching: false,
    error: null,
    lastUpdated: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchChainData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, isFetching: true }));

    try {
      const t0 = performance.now();

      const [blockHex, gasPriceHex] = await Promise.all([
        rpcCall<string>("eth_blockNumber", [], controller.signal),
        rpcCall<string>("eth_gasPrice", [], controller.signal),
      ]);

      const latencyMs = Math.round(performance.now() - t0);
      const blockNumber = hexToNumber(blockHex);
      const gasPriceRaw = hexToBigInt(gasPriceHex);
      const gasPrice = weiToGwei(gasPriceRaw);

      setState({
        blockNumber,
        latencyMs,
        gasPrice,
        gasPriceRaw,
        isConnected: true,
        isFetching: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setState((s) => ({
        ...s,
        isConnected: false,
        isFetching: false,
        error: (err as Error).message ?? "Connection failed",
      }));
    }
  }, []);

  useEffect(() => {
    fetchChainData();
    const timer = setInterval(fetchChainData, pollingIntervalMs);
    return () => {
      clearInterval(timer);
      abortRef.current?.abort();
    };
  }, [fetchChainData, pollingIntervalMs]);

  return state;
}

// ─── Utility functions (one-shot, outside hook) ───────────────────────────
export async function getChainId(): Promise<number> {
  const hex = await rpcCall<string>("eth_chainId");
  return hexToNumber(hex);
}

export async function getBalance(address: string): Promise<string> {
  const hex = await rpcCall<string>("eth_getBalance", [address, "latest"]);
  const wei = hexToBigInt(hex);
  const opn = Number(wei) / 1e18;
  return opn.toFixed(4);
}

export async function getTransactionCount(address: string): Promise<number> {
  const hex = await rpcCall<string>("eth_getTransactionCount", [address, "latest"]);
  return hexToNumber(hex);
}
