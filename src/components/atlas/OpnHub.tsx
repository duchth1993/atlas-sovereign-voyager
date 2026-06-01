import { Coins, Vault, Server, ArrowUpRight } from "lucide-react";

const TILES = [
  { icon: Coins, label: "Staking", meta: "12.4% APY", accent: "from-primary/80 to-primary/20" },
  { icon: Vault, label: "RWA Vault", meta: "$2.1M TVL", accent: "from-success/70 to-success/10" },
  { icon: Server, label: "ATLAS Tools", meta: "5 active", accent: "from-warning/70 to-warning/10" },
];

export function OpnHub() {
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

      <div className="mt-6 text-center">
        <div className="font-mono text-[10px] text-muted-foreground">
          OPN Chain · Block #8492019 · 0.4s
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground/70">
          No centralized APIs · Data sovereignty enforced
        </div>
      </div>
    </section>
  );
}
