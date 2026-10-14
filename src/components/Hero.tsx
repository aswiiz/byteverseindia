import React from 'react';
import { ArrowRight, Code2, Sparkles, Terminal } from 'lucide-react';

interface HeroProps {
  onExploreProjects: () => void;
  onStartProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProjects, onStartProject }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background ambient glow highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Hero: Left Column Typography, Right Column Visual Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-blue-400 font-semibold">ByteVerse Engineering</span>
              <span aria-hidden="true">·</span>
              <span>Software & Cloud Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Portfolio 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] [text-wrap:balance]">
              Ideas Into <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                Digital Reality.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              ByteVerse is a premier technology brand and engineering portfolio showcasing cutting-edge web applications, autonomous AI workflows, distributed cloud architectures, and developer tooling. Explore our live production demos, source repositories, and technical breakdowns.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreProjects}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all rounded-lg shadow-lg shadow-blue-600/25 flex items-center gap-2 whitespace-nowrap"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onStartProject}
                className="px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 hover:text-white border border-slate-700/80 active:scale-[0.98] transition-all rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <span>Start a Project</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Meta details */}
            <div className="flex items-center gap-6 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>MongoDB & Cloud Native</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Full-Stack TypeScript</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-950 group">
              <img
                src="/src/assets/images/byteverse_hero_banner_1791985096991.jpg"
                alt="ByteVerse Digital Architecture"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-white">ByteVerse Core Suite</span>
                  <span className="text-slate-400 font-mono">v2026.1</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  High-throughput, reactive software engineered for modern enterprise scale.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width Metrics & Proof points row below hero split */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              15+
            </div>
            <div className="text-xs text-slate-400">Production Deployments</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              99.9%
            </div>
            <div className="text-xs text-slate-400">Target Infrastructure Uptime</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              12+
            </div>
            <div className="text-xs text-slate-400">Languages & Frameworks</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              &lt; 5m
            </div>
            <div className="text-xs text-slate-400">Telegram Enquiry Dispatch</div>
          </div>
        </div>

      </div>
    </section>
  );
};
