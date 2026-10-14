import React, { useState, useMemo } from 'react';
import { Search, Filter, Layers, X, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';

interface ProjectsPageProps {
  projects: Project[];
  loading: boolean;
  onSelectProject: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  loading,
  onSelectProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const categories = [
    'All',
    'Cloud & DevOps',
    'Mobile & AI',
    'Web Applications',
    'Enterprise Tools',
    'Open Source'
  ];

  // Filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Must be published for public view
      if (!p.isPublished) return false;

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Featured filter
      if (onlyFeatured && !p.isFeatured) {
        return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesShort = p.shortDescription.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTech = p.technologies.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesShort && !matchesDesc && !matchesTech) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedCategory, onlyFeatured, searchQuery]);

  return (
    <div className="py-12 md:py-20 bg-[#030712] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold text-blue-400">
            ByteVerse Directory
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Engineering Project Showcase
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Discover software platforms, developer frameworks, cloud infrastructures, and AI workflows created by ByteVerse. Filter by tech stack or category below.
          </p>
        </div>

        {/* Filter Bar & Search Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center pt-2">
          
          {/* Category Tabs (Segmented control) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Featured Toggle */}
          <div className="flex items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or stack..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Featured toggle button */}
            <button
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                onlyFeatured
                  ? 'bg-blue-950/80 border-blue-600 text-blue-300 font-semibold'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Only</span>
            </button>

          </div>

        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-4">
          <div>
            Showing <span className="text-white font-mono">{filteredProjects.length}</span> projects
            {selectedCategory !== 'All' && <span> in <strong className="text-blue-400">{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<span className="text-white">{searchQuery}</span>"</span>}
          </div>

          {(selectedCategory !== 'All' || searchQuery || onlyFeatured) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setOnlyFeatured(false);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-slate-800/60 rounded-xl" />
                <div className="h-4 bg-slate-800/60 rounded w-1/3" />
                <div className="h-6 bg-slate-800/60 rounded w-3/4" />
                <div className="h-16 bg-slate-800/40 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-lg mx-auto">
            <Layers className="w-10 h-10 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Matching Projects</h3>
            <p className="text-sm text-slate-400 mb-6">
              We couldn't find any projects matching your current search criteria. Try selecting another category or resetting the search filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setOnlyFeatured(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Loaded Projects */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project._id || project.slug}
                project={project}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
