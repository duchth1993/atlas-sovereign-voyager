import { Shield, Wifi, ChevronDown, AlertTriangle, Loader2 } from "lucide-react";
import { useOPNChain } from "@/hooks/useOPNChain";
import { useWallet, shortAddress } from "@/hooks/useWallet";
import logo from "@/assets/iopn-logo.webp";

export function TopBar() {
  const { blockNumber, latencyMs, isConnected } = useOPNChain(4000);
  const {
    address,
    isCorrectChain,
    isConnecting,
    hasProvider,
    error,
    connect,
    disconnect,
    switchToOPN,
  } = useWallet();

  const latencyDisplay = latencyMs !== null ? `${latencyMs}ms` : "…";
  const blockDisplay = blockNumber !== null ? `#${blockNumber.toLocaleString()}` : "syncing…";

  const handleClick = () => {
    if (!address) return connect();
    if (!isCorrectChain) return switchToOPN();
    disconnect();
  };

  const buttonLabel = (() => {
    if (isConnecting) return "Connecting…";
    if (!address) return hasProvider ? "Connect MetaMask" : "Install MetaMask";
    if (!isCorrectChain) return "Switch to OPN";
    return `neo.${shortAddress(address)}`;
  })();

  const buttonIcon = isConnecting
    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
    : !address
      ? <Wifi className="h-3.5 w-3.5" />
      : !isCorrectChain
        ? <AlertTriangle className="h-3.5 w-3.5" />
        : <Shield className="h-3.5 w-3.5" />;

  const buttonClass = address && isCorrectChain
    ? "border-success/40 bg-success/10 text-success"
    : address && !isCorrectChain
      ? "border-warning/40 bg-warning/10 text-warning"
      : "border-primary/40 bg-primary/15 text-foreground glow-ring";

  return (
    <header className="sticky top-0 z-30 glass border-b border-border/60">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-5 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-lg bg-background/60 grid place-items-center overflow-hidden glow-ring">
            <img src={logo} alt="IOPn logo" className="h-7 w-7 lg:h-8 lg:w-8 object-contain" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ${
                isConnected ? "bg-success animate-pulse-glow" : "bg-muted-foreground"
              }`}
            />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">IOPn</div>
            <div className="font-display text-sm lg:text-base font-semibold">ATLAS Explorer</div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 ml-8 text-xs font-medium text-muted-foreground">
            <a href="#network" className="hover:text-foreground transition">Network</a>
            <a href="#nexus" className="hover:text-foreground transition">Nexus</a>
            <a href="#hub" className="hover:text-foreground transition">OPN Hub</a>
            <a href="https://iopn.io/atlas" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">Docs</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected ? "bg-success animate-pulse-glow" : "bg-muted-foreground"
              }`}
            />
            <span>OPN Chain · {blockDisplay} · {latencyDisplay}</span>
          </div>

          <button
            onClick={handleClick}
            disabled={isConnecting}
            title={error ?? undefined}
            className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-60 ${buttonClass}`}
          >
            {buttonIcon}
            {buttonLabel}
            <ChevronDown className="h-3 w-3 opacity-60 transition group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
      {error && (
        <div className="px-5 lg:px-8 pb-2 text-[10px] text-destructive/80 font-mono">⚠ {error}</div>
      )}
    </header>
  );
}
