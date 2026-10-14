import React, { useState, useEffect } from 'react';
import { Project } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProjects } from './components/FeaturedProjects';
import { TechStack } from './components/TechStack';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'about' | 'contact' | 'admin'>('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  // Selected project for modal view
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Admin state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('byteverse_admin_token');
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Pre-filled project type for enquiry
  const [prefilledProjectType, setPrefilledProjectType] = useState<string>('Web Applications');

  // Load public projects
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const data = await api.getProjects();
      setProjects(data);

      // Check URL parameters for project deep-link
      const params = new URLSearchParams(window.location.search);
      const projectSlug = params.get('project');
      if (projectSlug) {
        const found = data.find(p => p.slug === projectSlug);
        if (found) {
          setSelectedProject(found);
        }
      }
    } catch (err) {
      console.error('Failed to load ByteVerse projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Check direct /admin/login access in URL or hash
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
      if (adminToken) {
        setCurrentView('admin');
      } else {
        setIsAdminLoginOpen(true);
      }
    }

    // Verify existing token validity
    if (adminToken) {
      api.checkAdminSession(adminToken).then(valid => {
        if (!valid) {
          localStorage.removeItem('byteverse_admin_token');
          setAdminToken(null);
          if (currentView === 'admin') {
            setCurrentView('home');
          }
        }
      });
    }
  }, []);

  const handleAdminLoginSuccess = (token: string) => {
    localStorage.setItem('byteverse_admin_token', token);
    setAdminToken(token);
    setCurrentView('admin');
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      await api.adminLogout(adminToken);
    }
    localStorage.removeItem('byteverse_admin_token');
    setAdminToken(null);
    setCurrentView('home');
  };

  const handleEnquireAboutProject = (projectTitle: string) => {
    setPrefilledProjectType(projectTitle);
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-300">
      
      {/* 3-Zone Contract Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        isAdminLoggedIn={Boolean(adminToken)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* 1. HOME VIEW */}
        {currentView === 'home' && (
          <>
            <Hero
              onExploreProjects={() => {
                setCurrentView('projects');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartProject={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <FeaturedProjects
              projects={projects}
              loading={loadingProjects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onViewAllProjects={() => {
                setCurrentView('projects');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <TechStack />

            <AboutSection
              onLearnMore={() => {
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onContactClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <ContactSection prefilledProjectType={prefilledProjectType} />
          </>
        )}

        {/* 2. ALL PROJECTS SHOWCASE VIEW */}
        {currentView === 'projects' && (
          <ProjectsPage
            projects={projects}
            loading={loadingProjects}
            onSelectProject={(proj) => setSelectedProject(proj)}
          />
        )}

        {/* 3. ABOUT BRAND VIEW */}
        {currentView === 'about' && (
          <AboutPage
            onStartProject={() => {
              setCurrentView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreProjects={() => {
              setCurrentView('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 4. CONTACT & ENQUIRY VIEW */}
        {currentView === 'contact' && (
          <ContactPage prefilledProjectType={prefilledProjectType} />
        )}

        {/* 5. PROTECTED ADMIN DASHBOARD */}
        {currentView === 'admin' && adminToken && (
          <AdminDashboard
            token={adminToken}
            onLogout={handleAdminLogout}
            onPreviewProject={(proj) => setSelectedProject(proj)}
            onRefreshPublicProjects={fetchProjects}
          />
        )}

        {currentView === 'admin' && !adminToken && (
          <div className="py-24 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Admin Session Required</h2>
            <p className="text-sm text-slate-400 mb-4">Please log in to access the ByteVerse management portal.</p>
            <button
              onClick={() => setIsAdminLoginOpen(true)}
              className="px-4 py-2 bg-blue-600 rounded-lg text-xs font-semibold text-white"
            >
              Open Login Portal
            </button>
          </div>
        )}

      </main>

      {/* Global Project Details Lightbox Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          allProjects={projects}
          onClose={() => setSelectedProject(null)}
          onSelectRelated={(p) => setSelectedProject(p)}
          onEnquire={handleEnquireAboutProject}
        />
      )}

      {/* Global Admin Login Modal (Triggered by 5 clicks on BYTEVERSE wordmark or direct link) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Footer with 5-Click Easter Egg Admin Trigger and Instagram Link */}
      <Footer
        onNavigate={(view) => setCurrentView(view)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={Boolean(adminToken)}
      />

    </div>
  );
}
