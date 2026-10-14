import React from 'react';
import { ArrowRight, Compass, Shield, Zap, Instagram, Mail } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore?: () => void;
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore, onContactClick }) => {
  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-[#040816]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold text-blue-400">
              About ByteVerse
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Architecting Digital Experiences with Engineering Precision
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Founded on the belief that ideas should translate seamlessly into robust digital software, ByteVerse designs and delivers production-grade web systems, distributed cloud platforms, and developer-centric utilities.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Every project in our portfolio is engineered for real-world resilience—incorporating verified database schemas, secure session workflows, zero-latency feedback loops, and automated incident notifications via Telegram.
            </p>

            {/* Core Values / Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <Zap className="w-5 h-5 text-blue-400 mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">Performance First</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Zero extraneous bloat, optimized rendering, and fast serverless execution.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <Shield className="w-5 h-5 text-indigo-400 mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">Strict Security</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Protected admin routes, rate-limited auth, and sanitized database transactions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <Compass className="w-5 h-5 text-cyan-400 mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">Modern Stack</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  MongoDB Atlas, React 19, TypeScript, and native Telegram Bot webhooks.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onContactClick}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
              >
                Discuss a Project
              </button>
              
              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Full About Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Community & Instagram Spotlight */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Community & Updates</div>
                  <div className="text-xs text-slate-400">@byteverse.in on Instagram</div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join our growing engineering community on Instagram for weekly technology teardowns, live coding highlights, architectural diagrams, and project launch updates.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href="https://instagram.com/byteverse.in"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-between border border-slate-700/80 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Follow @byteverse.in</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="mailto:byteverseindia.in@gmail.com"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between border border-slate-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>byteverseindia.in@gmail.com</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
