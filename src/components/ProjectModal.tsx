import React, { useState } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, ArrowRight, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  allProjects: Project[];
  onClose: () => void;
  onSelectRelated: (project: Project) => void;
  onEnquire: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  allProjects,
  onClose,
  onSelectRelated,
  onEnquire
}) => {
  if (!project) return null;

  const [activeImage, setActiveImage] = useState<string>(project.mainImage);

  // Related projects in the same category or other featured
  const related = allProjects
    .filter(p => (p._id !== project._id && p.slug !== project.slug))
    .filter(p => p.category === project.category || p.isFeatured)
    .slice(0, 2);

  const allImages = [project.mainImage, ...(project.screenshots || [])].filter(
    (img, index, self) => Boolean(img) && self.indexOf(img) === index
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/80 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Viewer */}
        <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
          <img
            src={activeImage}
            alt={project.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          
          {/* Status & Category overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <span className="font-semibold text-blue-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-sm">
                {project.category}
              </span>
              <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-sm font-mono text-emerald-400">
                {project.status}
              </span>
            </div>

            {/* Quick Demo & GitHub links */}
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs text-white border border-slate-700/80 flex items-center gap-1.5 backdrop-blur-sm transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs text-white flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Screenshot thumbnails selector if multiple */}
        {allImages.length > 1 && (
          <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center gap-3 overflow-x-auto">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img ? 'border-blue-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Screenshot" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Main Content Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              {project.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Full Description & Problem Solved */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-400">
              Overview & Problem Architecture
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-400">
                Key Technical Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Used (Zero-pill text tags) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-400">
              Technologies & Infrastructure
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Enquiry CTA Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-bold text-white">
                Interested in a system like {project.title}?
              </div>
              <p className="text-xs text-slate-400">
                We design and build bespoke software tailored to your production requirements.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onEnquire(project.title);
              }}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap shadow-md transition-colors"
            >
              Enquire About This Project
            </button>
          </div>

          {/* Related Projects */}
          {related.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-400">
                Related Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(rel => (
                  <button
                    key={rel._id || rel.slug}
                    onClick={() => onSelectRelated(rel)}
                    className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 text-left transition-all group flex items-start gap-3"
                  >
                    <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                      <img src={rel.mainImage} alt={rel.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                        {rel.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {rel.category}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0 self-center" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
