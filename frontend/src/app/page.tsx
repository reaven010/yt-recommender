"use client";

import Recommender from "@/components/Recommender";
import Galaxy from "@/components/Galaxy";
import Support from "@/components/Support";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30 relative overflow-hidden">
      {/* Background Galaxy Effect */}
      <div className="fixed inset-0 z-0">
        <Galaxy 
          mouseInteraction={true}
          mouseRepulsion={true}
          density={1.0}
          glowIntensity={0.5}
          saturation={1.0}
          hueShift={140}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pointer-events-none min-h-screen">
        <div className="pointer-events-auto flex flex-col gap-0">
          <Recommender />
          <Support />
        </div>
      </div>
    </main>
  );
}
