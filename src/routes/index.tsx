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
    <div className="mx-auto max-w-md min-h-screen relative">
      <TopBar />
      <main className="space-y-6 pb-12">
        <HeroIdentity />
        <AtlasMap />
        <NexusCard />
        <OpnHub />
      </main>
    </div>
  );
}
