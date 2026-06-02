/**
 * useWallet.ts — MetaMask connector with auto-add OPN Testnet.
 */
import { useCallback, useEffect, useState } from "react";
import { OPN_CHAIN } from "./useOPNChain";

const CHAIN_ID_HEX = "0x" + OPN_CHAIN.chainId.toString(16); // 984 → 0x3d8

const NETWORK_PARAMS = {
  chainId: CHAIN_ID_HEX,
  chainName: OPN_CHAIN.name,
  nativeCurrency: { name: OPN_CHAIN.symbol, symbol: OPN_CHAIN.symbol, decimals: 18 },
  rpcUrls: [OPN_CHAIN.rpcUrl],
  blockExplorerUrls: [OPN_CHAIN.explorerUrl],
};

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

function getProvider(): Eip1193 | null {
  if (typeof window === "undefined") return null;
  const eth = (window as unknown as { ethereum?: Eip1193 }).ethereum;
  return eth ?? null;
}

export interface WalletState {
  address: string | null;
  chainId: string | null;
  isCorrectChain: boolean;
  isConnecting: boolean;
  hasProvider: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isCorrectChain: false,
    isConnecting: false,
    hasProvider: false,
    error: null,
  });

  useEffect(() => {
    const eth = getProvider();
    if (!eth) {
      setState((s) => ({ ...s, hasProvider: false }));
      return;
    }
    setState((s) => ({ ...s, hasProvider: true }));

    eth.request({ method: "eth_accounts" }).then((accs) => {
      const list = accs as string[];
      if (list?.[0]) {
        eth.request({ method: "eth_chainId" }).then((cid) => {
          const chainId = cid as string;
          setState((s) => ({
            ...s,
            address: list[0],
            chainId,
            isCorrectChain: chainId === CHAIN_ID_HEX,
          }));
        });
      }
    }).catch(() => {});

    const onAccounts = (...args: unknown[]) => {
      const accs = args[0] as string[];
      setState((s) => ({ ...s, address: accs?.[0] ?? null }));
    };
    const onChain = (...args: unknown[]) => {
      const chainId = args[0] as string;
      setState((s) => ({ ...s, chainId, isCorrectChain: chainId === CHAIN_ID_HEX }));
    };
    eth.on?.("accountsChanged", onAccounts);
    eth.on?.("chainChanged", onChain);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const switchToOPN = useCallback(async () => {
    const eth = getProvider();
    if (!eth) throw new Error("No wallet provider");
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch (err) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4902 || /Unrecognized chain/i.test(e.message ?? "")) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [NETWORK_PARAMS],
        });
      } else {
        throw err;
      }
    }
  }, []);

  const connect = useCallback(async () => {
    const eth = getProvider();
    if (!eth) {
      setState((s) => ({ ...s, error: "MetaMask not detected. Please install MetaMask." }));
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      const accs = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      await switchToOPN();
      const chainId = (await eth.request({ method: "eth_chainId" })) as string;
      setState((s) => ({
        ...s,
        address: accs[0],
        chainId,
        isCorrectChain: chainId === CHAIN_ID_HEX,
        isConnecting: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: (err as Error).message ?? "Connection failed",
      }));
    }
  }, [switchToOPN]);

  const disconnect = useCallback(() => {
    setState((s) => ({ ...s, address: null }));
  }, []);

  return { ...state, connect, disconnect, switchToOPN };
}

export function shortAddress(addr: string | null): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
