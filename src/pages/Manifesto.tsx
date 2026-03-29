import React from 'react';
import { motion } from 'motion/react';
import { Zap, Skull, Flame, Wind, Terminal, Anchor, HeartPulse } from 'lucide-react';

export default function Manifesto() {
  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 space-y-24">
        <header className="text-center space-y-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 inline-block px-4 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]"
          >
            BEHIND THE STATIC
          </motion.div>
          <h1 className="relative z-10 font-headline text-6xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-none mx-auto max-w-4xl">
            THE <span className="fire-gradient-text">ORIGIN</span>
          </h1>
          <p className="relative z-10 text-xl md:text-2xl text-outline font-light max-w-2xl mx-auto mt-8">
            "Late diagnosis... but there were clues." 
          </p>
        </header>

        {/* The Founder Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-32">
          <div className="space-y-8 bg-surface-container p-8 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Anchor className="w-64 h-64 text-primary" />
            </div>
            <div className="relative z-10">
              <h2 className="font-headline text-4xl font-black uppercase italic border-l-4 border-primary pl-6">01. THE VETERAN</h2>
              <p className="text-lg text-outline leading-relaxed mt-6">
                Trained in discipline, structure, and accountability. This brand is built by someone who lives in two completely different systems at the same time. I am not chaotic because I lack discipline. <strong className="text-white">I am disciplined in spite of chaos.</strong> That distinction matters.
              </p>
            </div>
          </div>

          <div className="space-y-8 bg-surface-container p-8 border border-white/5 relative overflow-hidden group hover:border-secondary/30 transition-colors">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Terminal className="w-64 h-64 text-secondary" />
            </div>
            <div className="relative z-10">
              <h2 className="font-headline text-4xl font-black uppercase italic border-l-4 border-secondary pl-6">02. THE DEVELOPER</h2>
              <p className="text-lg text-outline leading-relaxed mt-6">
                Senior application developer at a children's hospital—building real systems that matter, where failure has actual consequences. High competence in structured environments, strong problem-solving ability under pressure, and the capacity to hyperfocus deeply to push high-quality code.
              </p>
            </div>
          </div>

          <div className="space-y-8 bg-surface-container p-8 border border-white/5 relative overflow-hidden group hover:border-primary-container/30 transition-colors md:col-span-2">
            <div className="absolute -left-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity flex gap-8">
              <Zap className="w-64 h-64 text-primary-container" />
            </div>
            <div className="relative z-10 md:w-2/3 md:ml-auto text-right">
              <h2 className="font-headline text-4xl font-black uppercase italic border-r-4 border-primary-container pr-6">03. THE NEUROLOGICAL REALITY</h2>
              <p className="text-lg text-outline leading-relaxed mt-6">
                Late-diagnosed ADHD in my late 30s. I spent decades thinking the inconsistency was a personal failure instead of a neurological reality. Along with the hyperfocus comes constant internal fragmentation, context switching, and static noise. 
                <br/><br/>
                I have learned to build rigid systems externally because internally, things are wild. This brand was built for those who understand exactly what that contrast feels like.
              </p>
            </div>
          </div>
        </div>

        {/* The Why */}
        <div className="mt-32 border-t border-white/10 pt-32">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <h3 className="font-headline text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
              WHY THE <span className="text-primary">SQUIRREL?</span>
            </h3>
            <p className="text-xl md:text-2xl font-light text-outline leading-relaxed">
              Why a heavy metal squirrel spinning solos in a wall of flames? Because that's exactly what my brain feels like on a Tuesday afternoon. 
            </p>
            <p className="text-lg font-light text-white/50 leading-relaxed mb-16">
              ADHD Squirrel isn't just an apparel company. It's a massive, unapologetic celebration of the neurospicy mind. It's for the veterans, the developers, and the late-diagnosed adults. 
            </p>
            
            <div className="py-12 bg-surface-container-highest/20 border-l-4 border-primary pl-8 text-left flex items-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-1/2 -right-20 -translate-y-1/2 opacity-5 scale-150 group-hover:opacity-10 transition-opacity duration-1000 ease-out">
                <Flame className="w-96 h-96 text-primary" />
              </div>
              <div className="relative z-10">
                <h4 className="font-headline text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white drop-shadow-md mb-2">
                  FOR THOSE WHO <span className="text-primary">REFUSE</span><br/>TO TURN DOWN<br/>THEIR VOLUME.
                </h4>
                <p className="font-headline text-xs font-black text-white/20 tracking-[0.3em] uppercase">
                  (AND COULDN'T IF THEY WANTED TO)
                </p>
              </div>
            </div>
            
            <div className="pt-24 flex justify-center gap-8 text-white/20">
              <Flame className="w-12 h-12" />
              <Zap className="w-12 h-12" />
              <Skull className="w-12 h-12" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
