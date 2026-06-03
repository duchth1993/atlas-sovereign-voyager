import { useEffect, useMemo, useState } from "react";
import { Activity, Cpu, Lock, Server, Shield, Clock, Gauge, Info, Navigation } from "lucide-react";
import { useOPNChain } from "@/hooks/useOPNChain";
import { useWallet } from "@/hooks/useWallet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NodeStatus = "secure" | "degraded" | "offline";
type SecurityLevel = "L1" | "L2" | "L3";

type AtlasNode = {
  id: string;
  name: string;
  region: "US-East" | "EU-West" | "APAC-SG" | "EU-North" | "MENA";
  x: number;
  y: number;
  status: NodeStatus;
  load: number;
  security: SecurityLevel;
  uptimeSec: number;
};

const NODES: AtlasNode[] = [
  { id: "atl-01", name: "ATLAS-Helios", region: "EU-West",  x: 48, y: 32, status: "secure",   load: 62, security: "L3", uptimeSec: 60 * 60 * 24 * 41 + 3600 * 7 },
  { id: "atl-02", name: "ATLAS-Orion",  region: "US-East",  x: 22, y: 40, status: "secure",   load: 81, security: "L3", uptimeSec: 60 * 60 * 24 * 87 + 3600 * 2 },
  { id: "atl-03", name: "ATLAS-Vega",   region: "APAC-SG",  x: 78, y: 52, status: "degraded", load: 44, security: "L2", uptimeSec: 60 * 60 * 24 * 12 + 3600 * 19 },
  { id: "atl-04", name: "ATLAS-Lyra",   region: "MENA",     x: 56, y: 66, status: "secure",   load: 38, security: "L2", uptimeSec: 60 * 60 * 24 * 23 },
  { id: "atl-05", name: "ATLAS-Pyxis",  region: "EU-North", x: 30, y: 78, status: "secure",   load: 71, security: "L3", uptimeSec: 60 * 60 * 24 * 64 },
];

function fmtUptime(sec: number) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function statusColor(s: NodeStatus) {
  if (s === "secure") return "bg-success";
  if (s === "degraded") return "bg-warning";
  return "bg-destructive";
}

// Simple deterministic "nearest node" by hashing wallet address → region
function pickNearestNode(address: string | null): AtlasNode {
  if (!address) return NODES[1]; // default US-East
  let h = 0;
  for (let i = 2; i < address.length; i++) h = (h * 31 + address.charCodeAt(i)) | 0;
  return NODES[Math.abs(h) % NODES.length];
}

export function AtlasMap() {
  const [selected, setSelected] = useState<AtlasNode>(NODES[1]);
  const [tick, setTick] = useState(0);
  const { blockNumber } = useOPNChain(4000);
  const { address } = useWallet();

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(i);
  }, []);

  const nearest = useMemo(() => pickNearestNode(address), [address]);

  useEffect(() => {
    if (address) setSelected(nearest);
  }, [address, nearest]);

  const totalNodes = NODES.length;
  const avgLoad = Math.round(NODES.reduce((s, n) => s + n.load, 0) / totalNodes);
  const topSecurity: SecurityLevel = NODES.some((n) => n.security === "L3") ? "L3" : "L2";
  const lastBlock = blockNumber !== null ? `#${blockNumber.toLocaleString()}` : "#—";

  return (
    <TooltipProvider delayDuration={150}>
      <section id="network" className="px-5">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/80">ATLAS Network</div>
            <h2 className="font-display text-lg lg:text-xl font-semibold">Sovereign Data Centers</h2>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            {totalNodes} nodes · live
          </div>
        </div>

        {/* Routed gateway banner */}
        {address && (
          <div className="mb-3 glass rounded-xl px-3 py-2 flex items-center gap-2 border border-primary/30">
            <Navigation className="h-3.5 w-3.5 text-primary" />
            <div className="text-[11px] lg:text-xs">
              You're routed through{" "}
              <span className="font-mono font-semibold text-primary">{nearest.id}</span>{" "}
              <span className="text-muted-foreground">({nearest.region})</span>, your sovereign gateway
            </div>
          </div>
        )}

        <div className="glass rounded-2xl p-4 relative overflow-hidden">
          <div className="relative h-56 lg:h-[28rem] rounded-xl bg-background/40 overflow-hidden border border-border/60">
            <div className="absolute inset-0 bg-grid opacity-50" />
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />

            {NODES.map((n) => {
              const active = n.id === selected.id;
              const isGateway = n.id === nearest.id && !!address;
              return (
                <button
                  key={n.id}
                  onClick={() => setSelected(n)}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  title={`${n.name} · ${n.region}`}
                >
                  <span className={`absolute inset-0 rounded-full ${active ? "bg-primary/40" : "bg-primary/20"} animate-ping-slow`} />
                  <span className={`relative block h-2.5 w-2.5 rounded-full ${statusColor(n.status)} ${active ? "ring-2 ring-foreground/80" : ""} ${isGateway ? "ring-2 ring-primary" : ""}`} />
                  {(active || isGateway) && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] text-foreground/90 bg-background/80 px-1.5 py-0.5 rounded border border-border">
                      {n.id} {isGateway && <span className="text-primary">· gateway</span>}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected node detail */}
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
            <Stat icon={<Activity className="h-3 w-3" />} label="Status" value={selected.status} />
            <Stat icon={<Cpu className="h-3 w-3" />} label="Load" value={`${Math.min(99, selected.load + (tick % 5))}%`} />
            <SecurityStat level={selected.security} />
            <Stat icon={<Clock className="h-3 w-3" />} label="Uptime" value={fmtUptime(selected.uptimeSec + tick)} />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <div className="font-mono text-muted-foreground">{selected.id} · {selected.name} · {selected.region}</div>
            <button className="text-primary font-medium">Inspect →</button>
          </div>
        </div>

        {/* DePIN Health Dashboard */}
        <div className="mt-4 glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-primary" />
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">DePIN Health</h3>
            </div>
            <span className="font-mono text-[10px] text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" /> operational
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <HealthStat icon={<Server className="h-3 w-3" />} label="Total Nodes" value={String(totalNodes)} />
            <HealthStat icon={<Gauge className="h-3 w-3" />} label="Avg. Load" value={`${avgLoad}%`} />
            <HealthStatSecurity level={topSecurity} />
            <HealthStat icon={<Activity className="h-3 w-3" />} label="Last Block" value={lastBlock} mono />
          </div>
        </div>
      </section>
    </TooltipProvider>
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

function SecurityStat({ level }: { level: SecurityLevel }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/60 px-3 py-2">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        <Lock className="h-3 w-3" />Security
      </div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="font-mono text-sm font-semibold">{level}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-primary transition" aria-label="Why L3 matters">
              <Info className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[240px] text-[11px] leading-snug">
            <div className="flex items-center gap-1 mb-1 font-semibold">
              <Shield className="h-3 w-3" /> {level} · Zero-Knowledge Verified
            </div>
            L3 = Zero-knowledge verified infrastructure. Your data never leaves sovereign boundaries.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function HealthStat({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/60 px-3 py-2">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      <div className={`mt-0.5 text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function HealthStatSecurity({ level }: { level: SecurityLevel }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/60 px-3 py-2">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        <Lock className="h-3 w-3" />Security Level
      </div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="font-mono text-sm font-semibold">{level}</span>
        <span className="text-[10px] text-muted-foreground">· ZK Verified</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-primary transition" aria-label="Why L3 matters">
              <Info className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[240px] text-[11px] leading-snug">
            <div className="flex items-center gap-1 mb-1 font-semibold">
              <Shield className="h-3 w-3" /> L3 · Zero-Knowledge Verified
            </div>
            L3 = Zero-knowledge verified infrastructure. Your data never leaves sovereign boundaries.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
