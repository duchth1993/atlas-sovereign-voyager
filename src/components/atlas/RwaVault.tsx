import { useState } from "react";
import {
  Vault,
  ShieldCheck,
  Eye,
  Lock,
  Unlock,
  FileCheck,
  Landmark,
  Home,
  Leaf,
  ArrowUpRight,
  AlertTriangle,
  Info,
} from "lucide-react";

// ─── Mock data ───────────────────────────────────────────────────────────
const TVL = "$4.7M";
const CATEGORIES = ["Government Bonds", "Real Estate", "Carbon Credits"];

interface Asset {
  id: string;
  name: string;
  value: string;
  status: "Fully Reserved" | "Partially Reserved" | "Pending";
  level: "L1" | "L2" | "L3";
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  attestUrl: string;
}

const ASSETS: Asset[] = [
  {
    id: "gov-001",
    name: "US Treasury Bond Q3 2026",
    value: "$1.2M",
    status: "Fully Reserved",
    level: "L3",
    category: "Government Bonds",
    icon: Landmark,
    attestUrl: "https://testnet.iopn.tech/tx/0xattest-gov-001",
  },
  {
    id: "re-001",
    name: "Sovereign Real Estate Fund I",
    value: "$2.8M",
    status: "Fully Reserved",
    level: "L3",
    category: "Real Estate",
    icon: Home,
    attestUrl: "https://testnet.iopn.tech/tx/0xattest-re-001",
  },
  {
    id: "cc-001",
    name: "Amazon Carbon Credit Q4 2025",
    value: "$0.7M",
    status: "Partially Reserved",
    level: "L2",
    category: "Carbon Credits",
    icon: Leaf,
    attestUrl: "https://testnet.iopn.tech/tx/0xattest-cc-001",
  },
];

const NEXUS_TIER = 4;
const TIER_REQUIRED = 4; // Tier IV+ unlocks full features

function statusColor(status: Asset["status"]) {
  switch (status) {
    case "Fully Reserved":
      return "text-success";
    case "Partially Reserved":
      return "text-warning";
    case "Pending":
      return "text-muted-foreground";
  }
}

function levelBadge(level: Asset["level"]) {
  switch (level) {
    case "L3":
      return "bg-success/15 text-success border-success/30";
    case "L2":
      return "bg-warning/15 text-warning border-warning/30";
    case "L1":
      return "bg-muted/30 text-muted-foreground border-border/60";
  }
}

export function RwaVault() {
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const canUnlock = NEXUS_TIER >= TIER_REQUIRED;

  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-success/15 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/80">
              RWA Vault
            </div>
            <h2 className="font-display text-2xl font-bold mt-1">
              Tokenized Real World Assets
            </h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success/80 to-success/20 grid place-items-center glow-ring">
            <Vault className="h-5 w-5" />
          </div>
        </div>

        {/* Overview strip */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <VaultStat label="Total TVL" value={TVL} />
          <VaultStat label="Assets" value={`${ASSETS.length}`} />
          <VaultStat label="Compliance" value="ZK-Verified" />
        </div>

        {/* Categories */}
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 rounded-lg bg-background/40 border border-border/60 px-2.5 py-1 text-[10px] font-medium"
            >
              <FileCheck className="h-3 w-3 text-primary" />
              {cat}
            </span>
          ))}
        </div>

        {/* Nexus gate banner */}
        {!canUnlock && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-warning/10 border border-warning/20 p-2.5">
            <Lock className="h-3.5 w-3.5 text-warning shrink-0" />
            <span className="text-[11px] text-warning/90">
              Tier IV required to view asset structure and propose new assets.
              Your tier: Tier {NEXUS_TIER}.
            </span>
          </div>
        )}
        {canUnlock && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 p-2.5">
            <Unlock className="h-3.5 w-3.5 text-success shrink-0" />
            <span className="text-[11px] text-success/90">
              Tier IV unlocked — full RWA Vault access active.
            </span>
          </div>
        )}

        {/* Asset cards */}
        <div className="mt-5 space-y-3">
          {ASSETS.map((asset) => {
            const Icon = asset.icon;
            return (
              <div
                key={asset.id}
                className="rounded-xl bg-background/40 border border-border/60 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/5 grid place-items-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-semibold truncate">
                      {asset.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs text-muted-foreground">
                        {asset.value}
                      </span>
                      <span className={`text-[10px] font-medium ${statusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* L3 tooltip */}
                  <div
                    className="relative"
                    onMouseEnter={() => setTooltipId(asset.level === "L3" ? asset.id : null)}
                    onMouseLeave={() => setTooltipId(null)}
                  >
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold ${levelBadge(asset.level)}`}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {asset.level}
                    </span>
                    {tooltipId === asset.id && asset.level === "L3" && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-background border border-border/80 p-3 shadow-lg z-10">
                        <div className="flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                          <p className="text-[11px] leading-relaxed text-foreground">
                            L3 = Zero-knowledge verified infrastructure. Your data never leaves sovereign boundaries.
                          </p>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-background border-r border-b border-border/80 rotate-45" />
                      </div>
                    )}
                  </div>

                  <a
                    href={asset.attestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/30 px-2.5 py-1.5 text-[10px] font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    View Attestation
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tier IV+ actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            disabled={!canUnlock}
            className="rounded-lg bg-background/60 border border-border/60 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-primary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Eye className="h-3.5 w-3.5" />
            View Asset Structure
          </button>
          <button
            disabled={!canUnlock}
            className="rounded-lg bg-primary text-primary-foreground py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Vault className="h-3.5 w-3.5" />
            Propose New Asset
          </button>
        </div>

        {/* Footer sovereignty message */}
        <div className="mt-5 rounded-lg bg-background/30 border border-border/40 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-medium leading-relaxed">
                “Your RWA exposure is tied to your identity — not a custodian.”
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                No centralized APIs · Data sovereignty enforced · On-chain attestations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VaultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/60 px-3 py-2">
      <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-base font-bold">{value}</div>
    </div>
  );
}
