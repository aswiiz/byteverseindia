import React, { useState } from 'react';
import { Cpu, Database, Globe, Server, Terminal, Shield } from 'lucide-react';

interface TechCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  skills: { name: string; proficiency: string; role: string }[];
}

export const TechStack: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fullstack');

  const categories: TechCategory[] = [
    {
      id: 'fullstack',
      name: 'Frontend & UI',
      icon: <Globe className="w-4 h-4" />,
      description: 'Modern, reactive interfaces with zero-jank performance and strict accessibility.',
      skills: [
        { name: 'React 19 & TypeScript', proficiency: 'Advanced', role: 'Core Framework' },
        { name: 'Tailwind CSS v4', proficiency: 'Advanced', role: 'Design System' },
        { name: 'Next.js & Vite', proficiency: 'Advanced', role: 'Build Tooling' },
        { name: 'Motion / Canvas', proficiency: 'Specialized', role: 'Micro-interactions' }
      ]
    },
    {
      id: 'backend',
      name: 'Backend & APIs',
      icon: <Server className="w-4 h-4" />,
      description: 'High-throughput microservices, serverless handlers, and resilient event streaming.',
      skills: [
        { name: 'Node.js & Express.js', proficiency: 'Advanced', role: 'Core Runtime' },
        { name: 'Go & Python', proficiency: 'Proficient', role: 'Microservices & AI' },
        { name: 'REST & GraphQL', proficiency: 'Advanced', role: 'API Contracts' },
        { name: 'Telegram Bot API', proficiency: 'Specialized', role: 'Real-time Alerts' }
      ]
    },
    {
      id: 'database',
      name: 'Data & Persistence',
      icon: <Database className="w-4 h-4" />,
      description: 'Document databases, distributed caches, and vector indexing.',
      skills: [
        { name: 'MongoDB Atlas & Mongoose', proficiency: 'Advanced', role: 'Primary Store' },
        { name: 'PostgreSQL & SQL', proficiency: 'Advanced', role: 'Relational Data' },
        { name: 'Redis Cache', proficiency: 'Advanced', role: 'Session & Queues' },
        { name: 'Vector Embeddings', proficiency: 'Specialized', role: 'Semantic Retrieval' }
      ]
    },
    {
      id: 'devops',
      name: 'Cloud & Infrastructure',
      icon: <Cpu className="w-4 h-4" />,
      description: 'Continuous deployment pipelines, containerization, and edge serverless nodes.',
      skills: [
        { name: 'Vercel Serverless', proficiency: 'Advanced', role: 'Edge Deployment' },
        { name: 'Docker & Kubernetes', proficiency: 'Proficient', role: 'Container Orchestration' },
        { name: 'GitHub Actions', proficiency: 'Advanced', role: 'Automated CI/CD' },
        { name: 'Prometheus & Grafana', proficiency: 'Proficient', role: 'Telemetry' }
      ]
    }
  ];

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-[#030712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="text-xs font-semibold text-blue-400">
            Technical Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Technology Stack & Capabilities
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            ByteVerse leverages a verified modern stack engineered for high velocity, fault tolerance, and multi-platform scale.
          </p>
        </div>

        {/* Category Segmented Tabs (Functional filter controls) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 max-w-2xl overflow-x-auto mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === cat.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Active Category Skills Panel */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1">
              {currentCategory.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {currentCategory.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentCategory.skills.map((skill, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="text-xs text-blue-400 font-mono mb-1">
                  {skill.role}
                </div>
                <div className="text-sm font-semibold text-white">
                  {skill.name}
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Proficiency</span>
                  <span className="text-slate-300">{skill.proficiency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
