import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/atlas/TopBar";
import { HeroIdentity } from "@/components/atlas/HeroIdentity";
import { AtlasMap } from "@/components/atlas/AtlasMap";
import { NexusCard } from "@/components/atlas/NexusCard";
import { OpnHub } from "@/components/atlas/OpnHub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATLAS Explorer — Sovereign AI for IOPn" },
      { name: "description", content: "Sovereign AI environment explorer for government data ownership and real-time analytics on OPN Chain." },
      { property: "og:title", content: "ATLAS Explorer — IOPn" },
      { property: "og:description", content: "Your identity follows every transaction. Built on OPN Chain." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen relative">
      <TopBar />

      {/* Mobile: stacked. Desktop: full bleed with grid */}
      <main className="mx-auto max-w-md lg:max-w-7xl px-0 lg:px-8 pb-12">
        <div className="lg:pt-4">
          <HeroIdentity />
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
          <div className="lg:col-span-2">
            <AtlasMap />
          </div>
          <div className="lg:col-span-1">
            <NexusCard />
          </div>
        </div>

        <div className="mt-6 lg:mt-8">
          <OpnHub />
        </div>
      </main>
    </div>
  );
}
