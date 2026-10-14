import React, { useState, useRef } from 'react';
import { Instagram, Mail, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'projects' | 'about' | 'contact' | 'admin') => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminLogin, isAdminLoggedIn }) => {
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hidden 5-click handler on BYTEVERSE wordmark
  const handleWordmarkClick = () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      setClickCount(0);
      if (isAdminLoggedIn) {
        onNavigate('admin');
      } else {
        onOpenAdminLogin();
      }
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  return (
    <footer className="relative bg-[#02050e] border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            
            {/* The BYTEVERSE Wordmark with 5-Click Hidden Admin Entry Trigger */}
            <div className="inline-block relative">
              <button
                type="button"
                onClick={handleWordmarkClick}
                className="group text-left focus:outline-none select-none transition-transform active:scale-95"
                title="ByteVerse — Ideas Into Digital Reality"
                aria-label="ByteVerse Wordmark"
              >
                <div className="text-2xl font-black tracking-widest text-white group-hover:text-blue-400 transition-colors uppercase font-mono">
                  BYTEVERSE
                </div>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Ideas Into Digital Reality. Engineering resilient web systems, distributed cloud platforms, and developer tooling with MongoDB Atlas and Telegram webhooks.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/byteverse.in"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 flex items-center gap-1.5 text-xs"
                title="ByteVerse Instagram"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>@byteverse.in</span>
              </a>

              <a
                href="mailto:byteverseindia.in@gmail.com"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 flex items-center gap-1.5 text-xs"
                title="ByteVerse Public Email"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>byteverseindia.in@gmail.com</span>
              </a>
            </div>

          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-white transition-colors"
                >
                  Project Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Domains */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Specializations
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Cloud & DevOps Automation</li>
              <li>Distributed Microservices</li>
              <li>Autonomous AI Agents</li>
              <li>Reactive Frontend Architecture</li>
              <li>Telegram Bot Real-time Webhooks</li>
            </ul>
          </div>

          {/* Contact & Communications */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Direct Contact
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                <a
                  href="mailto:byteverseindia.in@gmail.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  byteverseindia.in@gmail.com
                </a>
              </div>
              <div>
                <a
                  href="https://instagram.com/byteverse.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>@byteverse.in</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Encrypted & Verified
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} ByteVerse. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span>Vercel & MongoDB Atlas Ready</span>
            <span aria-hidden="true">·</span>
            <span>Telegram Webhooks</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
