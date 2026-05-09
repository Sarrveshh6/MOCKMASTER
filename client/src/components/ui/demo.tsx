import { GlowCard } from "./spotlight-card";
import { Camera, Gamepad2, Headphones } from "lucide-react";

export function Default(){
  return(
    <div className="w-full min-h-screen bg-zinc-950 flex flex-col md:flex-row items-center justify-center gap-10 p-10 custom-cursor">
      <GlowCard glowColor="blue">
        <div className="flex flex-col h-full items-center justify-between text-white z-10 w-full">
          <Camera className="w-12 h-12 mb-4 text-blue-400" />
          <h3 className="text-xl font-bold mb-2 text-center">Photography</h3>
          <p className="text-sm text-neutral-300 text-center flex-grow">Capture the best moments with high quality.</p>
          <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop" alt="Photography" className="w-full h-32 object-cover rounded-xl mt-4" />
        </div>
      </GlowCard>

      <GlowCard glowColor="purple">
        <div className="flex flex-col h-full items-center justify-between text-white z-10 w-full">
          <Gamepad2 className="w-12 h-12 mb-4 text-purple-400" />
          <h3 className="text-xl font-bold mb-2 text-center">Gaming</h3>
          <p className="text-sm text-neutral-300 text-center flex-grow">Experience immersive worlds and epic adventures.</p>
          <img src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400&auto=format&fit=crop" alt="Gaming" className="w-full h-32 object-cover rounded-xl mt-4" />
        </div>
      </GlowCard>

      <GlowCard glowColor="green">
        <div className="flex flex-col h-full items-center justify-between text-white z-10 w-full">
          <Headphones className="w-12 h-12 mb-4 text-green-400" />
          <h3 className="text-xl font-bold mb-2 text-center">Music</h3>
          <p className="text-sm text-neutral-300 text-center flex-grow">Listen to millions of tracks in sheer clarity.</p>
          <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop" alt="Music" className="w-full h-32 object-cover rounded-xl mt-4" />
        </div>
      </GlowCard>
    </div>
  );
};
