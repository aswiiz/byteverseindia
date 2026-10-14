import React from 'react';
import { ExternalLink, Github, ArrowRight, Layers } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <article className="group relative flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/20">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={project.mainImage}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant CSS fallback container on image error
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />

        {/* Featured tag if applicable */}
        {project.isFeatured && (
          <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm shadow-md">
            Featured
          </div>
        )}

        {/* Status indicator */}
        <div className="absolute top-3 right-3 bg-slate-900/90 text-slate-300 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-800">
          {project.status}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-5 sm:p-6 space-y-4">
        
        {/* Unboxed Metadata (Zero-pill compliance: unboxed text with separators) */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-blue-400 font-medium">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span>{project.technologies.slice(0, 3).join(', ')}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors [text-wrap:balance]">
          {project.title}
        </h3>

        {/* Short description */}
        <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Technology tags inline text */}
        <div className="pt-1 flex flex-wrap gap-1.5 text-xs text-slate-400">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-[11px] px-1.5 py-0.5 text-slate-500 font-mono">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Actions bar at bottom */}
        <div className="pt-4 mt-auto border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          
          <button
            onClick={() => onSelect(project)}
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition-colors group/btn py-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label={`GitHub repository for ${project.title}`}
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label={`Live demo for ${project.title}`}
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>

      </div>

    </article>
  );
};
