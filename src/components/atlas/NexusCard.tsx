import { Trophy, Zap } from "lucide-react";

const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function NexusCard() {
  const rep = 14820;
  const next = 20000;
  const pct = (rep / next) * 100;

  return (
    <section id="nexus" className="px-5">
      <div className="glass rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary/80">Nexus Reputation</div>
              <div className="mt-1 font-display text-2xl font-bold">Tier IV · Architect</div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/30 grid place-items-center glow-ring">
              <Trophy className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span><span className="text-2xl font-bold font-display">{fmt(rep)}</span> REP</span>
              <span className="text-muted-foreground">{fmt(next)} → Tier V</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-background/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-foreground rounded-full transition-all"
                style={{ width: `${pct}%`, boxShadow: "0 0 12px var(--glow)" }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-background/40 border border-border/60 p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xs font-medium">Battle Pass · S2</div>
                <div className="text-[10px] text-muted-foreground">Level 27 / 50</div>
              </div>
            </div>
            <button className="text-[11px] font-semibold text-primary">Claim →</button>
          </div>
        </div>
      </div>
    </section>
  );
}
