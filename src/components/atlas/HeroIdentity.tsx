import { ArrowUpRight, Fingerprint } from "lucide-react";

export function HeroIdentity() {
  return (
    <section className="relative overflow-hidden px-5 pt-6 pb-8">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-primary/80">
          <Fingerprint className="h-3 w-3" />
          Sovereign Identity Layer
        </div>
        <h1 className="mt-3 font-display text-[2rem] leading-[1.05] font-bold tracking-tight">
          Your identity<br />
          <span className="text-glow bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
            follows every transaction.
          </span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xs">
          Real-time access to ATLAS data centers, Nexus reputation, and OPN Hub — all anchored to NeoID.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/70 px-4 py-2 text-xs font-semibold glow-ring">
            Enter the Network
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <span className="text-[11px] text-muted-foreground font-mono">on OPN Chain</span>
        </div>
      </div>
    </section>
  );
}
