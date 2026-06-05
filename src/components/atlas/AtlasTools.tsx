import { useState } from "react";
import {
  Bot,
  Cpu,
  Network,
  ShieldCheck,
  Sparkles,
  Plus,
  CheckCircle2,
  Loader2,
  Zap,
  Lock,
  Info,
} from "lucide-react";
import { useOPNChain } from "@/hooks/useOPNChain";

type Tab = "agent" | "gpu" | "depin" | "zk";

const NEXUS_TIER = 4; // mocked Tier IV

const GPU_REGIONS = [
  { region: "US-East", load: 81, color: "from-warning/70 to-warning/10" },
  { region: "EU-West", load: 67, color: "from-success/70 to-success/10" },
  { region: "APAC-SG", load: 92, color: "from-destructive/70 to-destructive/10" },
];

const DEPIN_NODES = [
  { type: "EV Charging", count: 3, uptime: "78%", location: "Berlin · Oslo · Paris" },
  { type: "Telecom Relay", count: 2, uptime: "94%", location: "Singapore · Tokyo" },
  { type: "Edge Compute", count: 4, uptime: "88%", location: "US-East · EU-West" },
];

export function AtlasTools() {
  const [tab, setTab] = useState<Tab>("agent");

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/80">
            ATLAS Tools
          </div>
          <h3 className="font-display text-base font-semibold">
            Sovereign Infrastructure Suite
          </h3>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">DePIN · ZK · AI</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1.5">
        <TabBtn active={tab === "agent"} onClick={() => setTab("agent")} icon={Bot} label="Agent" />
        <TabBtn active={tab === "gpu"} onClick={() => setTab("gpu")} icon={Cpu} label="GPU" />
        <TabBtn active={tab === "depin"} onClick={() => setTab("depin")} icon={Network} label="DePIN" />
        <TabBtn active={tab === "zk"} onClick={() => setTab("zk")} icon={ShieldCheck} label="ZK Proof" />
      </div>

      <div className="border-t border-border/60 pt-4">
        {tab === "agent" && <AgentBuilder />}
        {tab === "gpu" && <GpuMonitor />}
        {tab === "depin" && <DepinOrchestrator />}
        {tab === "zk" && <ZkProofGenerator />}
      </div>

      {/* Footer philosophy */}
      <div className="pt-3 border-t border-border/60 text-center">
        <p className="text-[11px] italic text-muted-foreground">
          “Privacy in machine systems is not optional — it’s existential.”
        </p>
      </div>
    </div>
  );
}

// ─── Tab Button ──────────────────────────────────────────────────────────
function TabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-mono uppercase tracking-wider transition ${
        active
          ? "bg-primary/15 border border-primary/40 text-primary"
          : "bg-background/40 border border-border/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ─── 1. AI Agent Builder ─────────────────────────────────────────────────
function AgentBuilder() {
  const [task, setTask] = useState("");
  const [level, setLevel] = useState<"L1" | "L2" | "L3">("L3");
  const [status, setStatus] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);

  const build = async () => {
    if (!task.trim()) {
      setStatus("⚠ Please describe your agent's task.");
      return;
    }
    setBuilding(true);
    setStatus(null);
    await new Promise((r) => setTimeout(r, 900));
    setBuilding(false);
    setStatus(`Agent created · Secure (${level}) · 24h uptime · +12 REP earned`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold">Digital Clone Studio</span>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
          What should your agent do?
        </label>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. Analyze DePIN data every 6h"
          className="w-full rounded-lg bg-background/40 border border-border/60 px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
        />
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
          Sovereignty level
        </label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as "L1" | "L2" | "L3")}
          className="w-full rounded-lg bg-background/40 border border-border/60 px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
        >
          <option value="L1">L1 · Standard</option>
          <option value="L2">L2 · Encrypted</option>
          <option value="L3">L3 · Zero-Knowledge Verified</option>
        </select>
      </div>

      <button
        onClick={build}
        disabled={building}
        className="w-full rounded-lg bg-gradient-to-r from-primary to-primary/60 text-primary-foreground font-display text-sm font-semibold py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {building ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Building agent…
          </>
        ) : (
          <>
            <Bot className="h-4 w-4" /> Build Agent
          </>
        )}
      </button>

      {status && (
        <div className="rounded-lg bg-success/10 border border-success/30 px-3 py-2 text-[11px] font-mono text-success flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {status}
        </div>
      )}
    </div>
  );
}

// ─── 2. GPU Resource Monitor ─────────────────────────────────────────────
function GpuMonitor() {
  const [msg, setMsg] = useState<string | null>(null);
  const canRequest = NEXUS_TIER >= 4;

  const request = () => {
    if (!canRequest) {
      setMsg("⚠ GPU requests require Nexus Tier IV+");
      return;
    }
    setMsg(`GPU request queued · Priority: Tier ${"I".repeat(NEXUS_TIER)} · ETA 2m`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold">GPU Load by Region</span>
      </div>

      <div className="space-y-2">
        {GPU_REGIONS.map((r) => (
          <div key={r.region} className="rounded-lg bg-background/40 border border-border/60 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-semibold">{r.region}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{r.load}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-background/60 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${r.color} rounded-full transition-all`}
                style={{ width: `${r.load}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={request}
        className="w-full rounded-lg bg-gradient-to-r from-primary to-primary/60 text-primary-foreground font-display text-sm font-semibold py-2.5 flex items-center justify-center gap-2"
      >
        <Zap className="h-4 w-4" /> Request GPU
      </button>

      {msg && (
        <div
          className={`rounded-lg border px-3 py-2 text-[11px] font-mono flex items-center gap-2 ${
            msg.startsWith("⚠")
              ? "bg-warning/10 border-warning/30 text-warning"
              : "bg-success/10 border-success/30 text-success"
          }`}
        >
          {msg.startsWith("⚠") ? <Info className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          {msg}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground/70 text-center">
        Only Nexus Tier IV+ identities can reserve sovereign GPU capacity.
      </p>
    </div>
  );
}

// ─── 3. DePIN Orchestrator ───────────────────────────────────────────────
function DepinOrchestrator() {
  const { blockNumber } = useOPNChain(5000);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "EV Charging",
    location: "Berlin",
    level: "L3" as "L1" | "L2" | "L3",
  });

  const confirm = () => {
    setMsg(
      `Node registered · ${form.type} · ${form.location} · ${form.level} · Block #${
        blockNumber?.toLocaleString() ?? "…"
      }`,
    );
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-primary" />
          <span className="font-display text-sm font-semibold">Active DePIN Nodes</span>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1 rounded-md bg-primary/15 border border-primary/40 px-2 py-1 text-[10px] font-mono text-primary"
        >
          <Plus className="h-3 w-3" /> Add Node
        </button>
      </div>

      <div className="space-y-2">
        {DEPIN_NODES.map((n) => (
          <div
            key={n.type}
            className="rounded-lg bg-background/40 border border-border/60 p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-mono text-xs font-semibold">{n.type}</div>
              <div className="text-[10px] text-muted-foreground">{n.location}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs">{n.count} nodes</div>
              <div className="text-[10px] text-success">{n.uptime} uptime</div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="rounded-lg bg-background/60 border border-primary/40 p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-primary">Register new node</div>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-md bg-background/40 border border-border/60 px-2 py-1.5 text-xs font-mono"
          >
            <option>EV Charging</option>
            <option>Telecom Relay</option>
            <option>Edge Compute</option>
          </select>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location"
            className="w-full rounded-md bg-background/40 border border-border/60 px-2 py-1.5 text-xs font-mono"
          />
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value as "L1" | "L2" | "L3" })}
            className="w-full rounded-md bg-background/40 border border-border/60 px-2 py-1.5 text-xs font-mono"
          >
            <option value="L1">L1 · Standard</option>
            <option value="L2">L2 · Encrypted</option>
            <option value="L3">L3 · ZK Verified</option>
          </select>
          <button
            onClick={confirm}
            className="w-full rounded-md bg-primary text-primary-foreground py-1.5 text-xs font-semibold"
          >
            Confirm on OPN Chain
          </button>
        </div>
      )}

      {msg && (
        <div className="rounded-lg bg-success/10 border border-success/30 px-3 py-2 text-[11px] font-mono text-success flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {msg}
        </div>
      )}
    </div>
  );
}

// ─── 4. ZK Proof Generator ───────────────────────────────────────────────
function ZkProofGenerator() {
  const [txHash, setTxHash] = useState("");
  const [proof, setProof] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [popup, setPopup] = useState(false);

  const generate = async () => {
    if (!txHash.trim()) {
      setProof("⚠ Enter a transaction hash.");
      return;
    }
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 700));
    setVerifying(false);
    const short = txHash.length > 10 ? `${txHash.slice(0, 8)}…${txHash.slice(-6)}` : txHash;
    setProof(`ZK proof generated for ${short} · Verified on-chain · L3 security`);
  };

  return (
    <div className="space-y-3 relative">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold">Zero-Knowledge Proof Generator</span>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
          Transaction hash
        </label>
        <input
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="0x..."
          className="w-full rounded-lg bg-background/40 border border-border/60 px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={generate}
          disabled={verifying}
          className="rounded-lg bg-gradient-to-r from-primary to-primary/60 text-primary-foreground font-display text-sm font-semibold py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate
        </button>
        <button
          onClick={() => setPopup(true)}
          disabled={!proof || proof.startsWith("⚠")}
          className="rounded-lg bg-background/40 border border-primary/40 text-primary font-display text-sm font-semibold py-2.5 flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <ShieldCheck className="h-4 w-4" /> Verify
        </button>
      </div>

      {proof && (
        <div
          className={`rounded-lg border px-3 py-2 text-[11px] font-mono flex items-center gap-2 ${
            proof.startsWith("⚠")
              ? "bg-warning/10 border-warning/30 text-warning"
              : "bg-success/10 border-success/30 text-success"
          }`}
        >
          {proof.startsWith("⚠") ? <Info className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          {proof}
        </div>
      )}

      {popup && (
        <div
          onClick={() => setPopup(false)}
          className="absolute inset-0 -m-4 bg-background/80 backdrop-blur-sm grid place-items-center rounded-xl z-10 cursor-pointer"
        >
          <div className="glass rounded-xl p-5 max-w-xs text-center space-y-2 border border-primary/40">
            <ShieldCheck className="h-8 w-8 text-success mx-auto" />
            <div className="font-display text-sm font-semibold">Proof Valid</div>
            <p className="text-[11px] text-muted-foreground">
              No data leakage · Sovereignty enforced · L3 verified
            </p>
            <button className="text-[10px] font-mono text-primary">tap to close</button>
          </div>
        </div>
      )}
    </div>
  );
}
