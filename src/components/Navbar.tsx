import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'projects' | 'about' | 'contact' | 'admin') => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'projects' | 'about' | 'contact' | 'admin') => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#030712]/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element Brand wordmark with subtle glyph */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="group flex items-center gap-2.5 text-left text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap"
              aria-label="ByteVerse Home"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="font-extrabold tracking-tight text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                ByteVerse
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'home' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'projects' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'about' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'contact' ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <a
              href="https://instagram.com/byteverse.in"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              title="ByteVerse Instagram @byteverse.in"
            >
              <span>@byteverse.in</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => handleNavClick('contact')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1d] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-md hover:bg-slate-800/60 ${
                currentView === 'home' ? 'text-blue-400 bg-slate-800/40' : 'text-slate-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('projects')}
              className={`text-left px-3 py-2 rounded-md hover:bg-slate-800/60 ${
                currentView === 'projects' ? 'text-blue-400 bg-slate-800/40' : 'text-slate-300'
              }`}
            >
              Projects Showcase
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left px-3 py-2 rounded-md hover:bg-slate-800/60 ${
                currentView === 'about' ? 'text-blue-400 bg-slate-800/40' : 'text-slate-300'
              }`}
            >
              About ByteVerse
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left px-3 py-2 rounded-md hover:bg-slate-800/60 ${
                currentView === 'contact' ? 'text-blue-400 bg-slate-800/40' : 'text-slate-300'
              }`}
            >
              Contact & Enquiries
            </button>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <a
                href="https://instagram.com/byteverse.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 px-3 py-1.5 flex items-center justify-between"
              >
                <span>Instagram @byteverse.in</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full text-center py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Start a Project
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
