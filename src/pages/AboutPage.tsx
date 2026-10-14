import React from 'react';
import { ArrowRight, Code2, Cpu, Globe, Instagram, Mail, Server, Shield, Sparkles, Terminal } from 'lucide-react';

interface AboutPageProps {
  onStartProject: () => void;
  onExploreProjects: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartProject, onExploreProjects }) => {
  return (
    <div className="py-12 md:py-20 bg-[#030712] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-semibold text-blue-400">
            About the Brand
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Ideas Into <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              Digital Reality.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            ByteVerse was established as a premier technology initiative dedicated to transforming ambitious conceptual designs into resilient, scalable digital reality.
          </p>
        </div>

        {/* Core Purpose & Brand Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Our Purpose & Vision
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                In an era where software often gets bogged down by excessive dependencies and superficial decoration, ByteVerse stands for engineering purity. We focus on low-latency interactions, clean separation of concerns, deterministic data flow, and serverless reliability.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Whether deploying a distributed Kubernetes cluster telemetry tool or engineering a visual neural orchestration canvas, every product in the ByteVerse portfolio is designed to withstand real-world production demands.
              </p>
            </div>

            {/* Development Methodology */}
            <div className="pt-4 space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Engineering Methodology
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                    <Terminal className="w-4 h-4" />
                    <span>01. Systematic Grounding</span>
                  </div>
                  <h3 className="text-base font-bold text-white">First-Principles Architecture</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We architect data models and API contracts before touching UI pixels. MongoDB Atlas schemas are carefully designed with indexing and uniqueness guarantees.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                    <Code2 className="w-4 h-4" />
                    <span>02. Full-Stack Fluidity</span>
                  </div>
                  <h3 className="text-base font-bold text-white">End-to-End TypeScript</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Shared types across API boundaries eliminate runtime contract mismatches, guaranteeing resilient and maintainable codebases.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Cpu className="w-4 h-4" />
                    <span>03. Zero-Jank Rendering</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Sub-100ms Micro-Interactions</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Our frontend design adheres to zero-pill discipline, WCAG AA legibility, and high-contrast dark surfaces designed for developer ergonomics.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Server className="w-4 h-4" />
                    <span>04. Automated Webhooks</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Real-Time Telegram Pipeline</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Enquiries and system alerts are instantaneously pushed to the administrator via secure server-side Telegram Bot webhooks.
                  </p>
                </div>
              </div>
            </div>

            {/* Areas of Technology Focus */}
            <div className="pt-4 space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Key Technology Focus Areas
              </h2>
              
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span><strong>Distributed Cloud & Edge Computing:</strong> Low-latency container orchestration, serverless function optimization, and automated health checks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span><strong>AI Systems & Vector Gateways:</strong> Interactive neural graphs, LLM agent workflow coordination, and high-throughput vector caching.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                  <span><strong>Modern Web Applications:</strong> Headless architectures, real-time WebSockets, and reactive single-page applications.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Contact & Social Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Instagram Spotlight Card */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Instagram Community</h3>
                  <div className="text-xs text-slate-400">@byteverse.in</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our tech community on Instagram. Discover technical infographics, design breakdowns, and upcoming open-source releases.
              </p>

              <a
                href="https://instagram.com/byteverse.in"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-between border border-slate-700 transition-colors"
              >
                <span>Visit Instagram @byteverse.in</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Public Contact Card */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Official Communications</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-slate-500">Public Contact Email</div>
                  <a href="mailto:byteverseindia.in@gmail.com" className="text-blue-400 hover:underline font-mono">
                    byteverseindia.in@gmail.com
                  </a>
                </div>
                <div>
                  <div className="text-slate-500">Typical Response Window</div>
                  <div className="text-slate-300">
                    Within 12–24 Business Hours
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Headquarters / Regional Base</div>
                  <div className="text-slate-300">
                    India (Global Remote Deployment)
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onStartProject}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors text-center"
                >
                  Start a Project
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
