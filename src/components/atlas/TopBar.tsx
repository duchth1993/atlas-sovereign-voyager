import { useState } from "react";
import { Shield, Wifi, ChevronDown } from "lucide-react";

export function TopBar() {
  const [connected, setConnected] = useState(false);

  return (
    <header className="sticky top-0 z-30 glass border-b border-border/60">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/40 grid place-items-center">
            <span className="font-mono text-[10px] font-bold tracking-tighter">IO</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success animate-pulse-glow" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">IOPn</div>
            <div className="font-display text-sm font-semibold">ATLAS Explorer</div>
          </div>
        </div>

        <button
          onClick={() => setConnected((c) => !c)}
          className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            connected
              ? "border-success/40 bg-success/10 text-success"
              : "border-primary/40 bg-primary/15 text-foreground glow-ring"
          }`}
        >
          {connected ? <Shield className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
          {connected ? "neo.0x9F..A4D2" : "Connect NeoID"}
          <ChevronDown className="h-3 w-3 opacity-60 transition group-hover:translate-y-0.5" />
        </button>
      </div>
    </header>
  );
}
