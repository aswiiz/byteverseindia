import React from 'react';
import { Mail, Instagram, ShieldCheck, Clock, MapPin, Terminal } from 'lucide-react';
import { ContactSection } from '../components/ContactSection';

interface ContactPageProps {
  prefilledProjectType?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ prefilledProjectType }) => {
  return (
    <div className="bg-[#030712] min-h-screen">
      {/* Top Banner */}
      <div className="py-12 md:py-16 border-b border-slate-800/80 bg-[#02050e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-xs font-semibold text-blue-400">
            ByteVerse Communications
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Let's Engineer Your Next Architecture
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            Reach out directly for software architecture consulting, enterprise full-stack development, distributed cloud engineering, or custom platform inquiries.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <ContactSection prefilledProjectType={prefilledProjectType} />

      {/* Technical Engagement Workflow */}
      <div className="py-16 border-t border-slate-800/80 bg-[#02050e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Engagement Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              What happens after you submit your requirements through ByteVerse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-blue-400">Step 01</div>
              <h3 className="text-base font-bold text-white">Instant Alert & Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your enquiry is instantly transmitted to our engineering team via server-side Telegram webhooks and stored in MongoDB Atlas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-indigo-400">Step 02</div>
              <h3 className="text-base font-bold text-white">Architecture Scoping</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We review technical constraints, tech stack suitability, security protocols, and timeline feasibility.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-cyan-400">Step 03</div>
              <h3 className="text-base font-bold text-white">Direct Technical Response</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You receive a concise, actionable roadmap and proposed implementation strategy without corporate friction.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
