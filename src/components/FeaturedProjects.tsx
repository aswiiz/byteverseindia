import React from 'react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface FeaturedProjectsProps {
  projects: Project[];
  loading: boolean;
  onSelectProject: (project: Project) => void;
  onViewAllProjects: () => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  loading,
  onSelectProject,
  onViewAllProjects
}) => {
  const featured = projects.filter(p => p.isFeatured && p.isPublished);
  const displayProjects = featured.length > 0 ? featured : projects.filter(p => p.isPublished).slice(0, 4);

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-[#040816]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold text-blue-400">
              Curated Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              Featured Engineering Projects
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Explore highlighted software architectures, distributed cloud tools, and intelligent systems developed by ByteVerse.
            </p>
          </div>

          <button
            onClick={onViewAllProjects}
            className="self-start md:self-auto text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors py-2 group"
          >
            <span>View All Projects ({projects.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-slate-800/60 rounded-xl" />
                <div className="h-4 bg-slate-800/60 rounded w-1/3" />
                <div className="h-6 bg-slate-800/60 rounded w-3/4" />
                <div className="h-16 bg-slate-800/40 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Polished Empty State */}
        {!loading && displayProjects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-lg mx-auto">
            <Layers className="w-10 h-10 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-sm text-slate-400 mb-6">
              Projects are currently being updated in MongoDB Atlas. Check back shortly or view our complete archives.
            </p>
            <button
              onClick={onViewAllProjects}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              Browse Project Directory
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && displayProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
              <ProjectCard
                key={project._id || project.slug}
                project={project}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
