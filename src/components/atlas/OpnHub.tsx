/**
 * OpnHub.tsx — updated với live OPN Chain data
 * Thay thế file src/components/atlas/OpnHub.tsx
 */
import { Coins, Vault, Server, ArrowUpRight, Wifi, WifiOff, Loader2 } from "lucide-react";
import { useOPNChain, OPN_CHAIN } from "@/hooks/useOPNChain";

const TILES = [
  { icon: Coins, label: "Staking", meta: "12.4% APY", accent: "from-primary/80 to-primary/20" },
  { icon: Vault, label: "RWA Vault", meta: "$2.1M TVL", accent: "from-success/70 to-success/10" },
  { icon: Server, label: "ATLAS Tools", meta: "5 active", accent: "from-warning/70 to-warning/10" },
];

export function OpnHub() {
  const { blockNumber, latencyMs, gasPrice, isConnected, isFetching, error } = useOPNChain(4000);

  const latencyDisplay = latencyMs !== null ? `${latencyMs}ms` : "…";
  const blockDisplay = blockNumber !== null
    ? `#${blockNumber.toLocaleString()}`
    : "…";
  const gasPriceDisplay = gasPrice !== null ? `${gasPrice} Gwei` : "…";

  return (
    <section id="hub" className="px-5 pb-8">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/80">OPN Hub</div>
          <h2 className="font-display text-lg font-semibold">One Gateway</h2>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">decentralized</span>
      </div>

      <div className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-3">
        {TILES.map(({ icon: Icon, label, meta, accent }) => (
          <button
            key={label}
            className="group w-full glass rounded-xl p-4 flex items-center gap-3 hover:border-primary/60 transition-all"
          >
            <div className={`h-11 w-11 rounded-lg bg-gradient-to-br ${accent} grid place-items-center`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-display text-sm font-semibold">{label}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{meta}</div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>

      {/* ── Live Chain Status ─────────────────────────────────────── */}
      <div className="mt-6 glass rounded-xl p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-3.5 w-3.5 text-success" />
            ) : isFetching ? (
              <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
            )}
            <span className="font-mono text-[11px] font-semibold">
              {OPN_CHAIN.name}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              · Chain {OPN_CHAIN.chainId}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected ? "bg-success animate-pulse-glow" : "bg-muted-foreground"
              }`}
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              {isConnected ? "live" : error ? "offline" : "connecting…"}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <ChainStat label="Block" value={blockDisplay} highlight={isConnected} />
          <ChainStat label="Latency" value={latencyDisplay} highlight={isConnected} />
          <ChainStat label="Gas" value={gasPriceDisplay} highlight={isConnected} />
        </div>

        {/* Error */}
        {error && !isConnected && (
          <p className="mt-2 text-[10px] text-destructive/80 font-mono">
            ⚠ {error}
          </p>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/70">
            No centralized APIs · Data sovereignty enforced
          </span>
          <a
            href={OPN_CHAIN.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-primary font-medium hover:underline"
          >
            Explorer →
          </a>
        </div>
      </div>
    </section>
  );
}

function ChainStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight: boolean;
}) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/60 px-3 py-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </div>
      <div
        className={`font-mono text-xs font-semibold truncate transition-colors ${
          highlight ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
