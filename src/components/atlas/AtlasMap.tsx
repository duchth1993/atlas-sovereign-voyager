import { useEffect, useState } from "react";
import { Activity, Cpu, Lock } from "lucide-react";

type Node = {
  id: string;
  name: string;
  region: string;
  x: number; y: number;
  status: "online" | "syncing" | "secure";
  load: number;
  security: "L1" | "L2" | "L3";
};

const NODES: Node[] = [
  { id: "atl-01", name: "ATLAS-Helios", region: "EU-North", x: 48, y: 28, status: "online", load: 62, security: "L3" },
  { id: "atl-02", name: "ATLAS-Orion", region: "US-East", x: 22, y: 40, status: "secure", load: 81, security: "L3" },
  { id: "atl-03", name: "ATLAS-Vega", region: "APAC", x: 78, y: 52, status: "syncing", load: 44, security: "L2" },
  { id: "atl-04", name: "ATLAS-Lyra", region: "MENA", x: 56, y: 66, status: "online", load: 38, security: "L2" },
  { id: "atl-05", name: "ATLAS-Pyxis", region: "LATAM", x: 30, y: 78, status: "online", load: 71, security: "L3" },
];

export function AtlasMap() {
  const [selected, setSelected] = useState<Node>(NODES[1]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(i);
  }, []);

  return (
    <section id="network" className="px-5">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/80">ATLAS Network</div>
          <h2 className="font-display text-lg font-semibold">Sovereign Data Centers</h2>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">
          {NODES.length} nodes · live
        </div>
      </div>

      <div className="glass rounded-2xl p-4 relative overflow-hidden">
        <div className="relative h-56 lg:h-[28rem] rounded-xl bg-background/40 overflow-hidden border border-border/60">
          <div className="absolute inset-0 bg-grid opacity-50" />
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />

          {NODES.map((n) => {
            const active = n.id === selected.id;
            return (
              <button
                key={n.id}
                onClick={() => setSelected(n)}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
              >
                <span className={`absolute inset-0 rounded-full ${active ? "bg-primary/40" : "bg-primary/20"} animate-ping-slow`} />
                <span className={`relative block h-2.5 w-2.5 rounded-full ${
                  n.status === "secure" ? "bg-success" : n.status === "syncing" ? "bg-warning" : "bg-primary"
                } ${active ? "ring-2 ring-foreground/80" : ""}`} />
                {active && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] text-foreground/90 bg-background/80 px-1.5 py-0.5 rounded border border-border">
                    {n.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat icon={<Activity className="h-3 w-3" />} label="Status" value={selected.status} />
          <Stat icon={<Cpu className="h-3 w-3" />} label="Load" value={`${Math.min(99, selected.load + (tick % 5))}%`} />
          <Stat icon={<Lock className="h-3 w-3" />} label="Security" value={selected.security} />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px]">
          <div className="font-mono text-muted-foreground">{selected.id} · {selected.region}</div>
          <button className="text-primary font-medium">Inspect →</button>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/60 px-3 py-2">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      <div className="mt-0.5 font-mono text-sm font-semibold capitalize">{value}</div>
    </div>
  );
}
