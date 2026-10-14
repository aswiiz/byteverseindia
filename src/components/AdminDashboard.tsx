import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Send,
  Download,
  RotateCcw,
  Search,
  ExternalLink,
  Github,
  Mail,
  Phone,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  ShieldAlert,
  Database,
  X
} from 'lucide-react';
import { Project, Enquiry, AdminStats } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onPreviewProject: (project: Project) => void;
  onRefreshPublicProjects: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onPreviewProject,
  onRefreshPublicProjects
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'enquiries' | 'integrations'>('projects');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search in Admin projects
  const [adminSearch, setAdminSearch] = useState('');

  // Modal / Form state for Create / Edit Project
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: 'Web Applications' as Project['category'],
    technologies: '',
    features: '',
    mainImage: '',
    screenshots: '',
    githubUrl: '',
    demoUrl: '',
    status: 'Production' as Project['status'],
    isFeatured: false,
    isPublished: true
  });

  // Delete confirmation modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<Enquiry | null>(null);

  // Telegram test loading state
  const [testingTelegram, setTestingTelegram] = useState(false);

  // Load all admin data
  const loadData = async () => {
    try {
      setLoading(true);
      const [projList, enqList, statsData] = await Promise.all([
        api.getProjects(undefined, token),
        api.getEnquiries(token),
        api.getAdminStats(token)
      ]);
      setProjects(projList);
      setEnquiries(enqList);
      setStats(statsData);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to load dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4500);
  };

  // Open Form to Add New Project
  const handleAddNew = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: 'Web Applications',
      technologies: 'React, TypeScript, Node.js, Tailwind CSS',
      features: 'High performance rendering\nReal-time responsive state\nModular component hierarchy',
      mainImage: '/src/assets/images/project_cloudflow_platform_1791985097329.jpg',
      screenshots: '',
      githubUrl: 'https://github.com/byteverse-org',
      demoUrl: 'https://byteverse.dev',
      status: 'Production',
      isFeatured: false,
      isPublished: true
    });
    setIsFormOpen(true);
  };

  // Open Form to Edit Existing Project
  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: p.description,
      category: p.category,
      technologies: p.technologies.join(', '),
      features: p.features.join('\n'),
      mainImage: p.mainImage,
      screenshots: (p.screenshots || []).join('\n'),
      githubUrl: p.githubUrl || '',
      demoUrl: p.demoUrl || '',
      status: p.status,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished
    });
    setIsFormOpen(true);
  };

  // Auto-slugify when title changes (if adding new project)
  const handleTitleChange = (val: string) => {
    if (!editingProject) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, title: val, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, title: val }));
    }
  };

  // Image Upload handler (validates format, limits to 3MB, converts to data URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME type check
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Only valid image files (JPG, PNG, WebP) are allowed.');
      return;
    }

    // 3MB limit check
    if (file.size > 3 * 1024 * 1024) {
      showNotification('error', 'Image size must be smaller than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setFormData(prev => ({ ...prev, mainImage: dataUri }));
      showNotification('success', 'Image preview loaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  // Submit Project Form (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription || !formData.description || !formData.mainImage) {
      showNotification('error', 'Please fill in all required fields.');
      return;
    }

    const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
    const featureArray = formData.features.split('\n').map(f => f.trim()).filter(Boolean);
    const screenshotArray = formData.screenshots.split('\n').map(s => s.trim()).filter(Boolean);

    const payload: Partial<Project> = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: formData.shortDescription,
      description: formData.description,
      category: formData.category,
      technologies: techArray,
      features: featureArray,
      mainImage: formData.mainImage,
      screenshots: screenshotArray,
      githubUrl: formData.githubUrl,
      demoUrl: formData.demoUrl,
      status: formData.status,
      isFeatured: formData.isFeatured,
      isPublished: formData.isPublished
    };

    try {
      if (editingProject) {
        await api.updateProject(editingProject._id || editingProject.slug, payload, token);
        showNotification('success', `Project "${formData.title}" updated successfully.`);
      } else {
        await api.createProject(payload, token);
        showNotification('success', `Project "${formData.title}" created successfully.`);
      }

      setIsFormOpen(false);
      await loadData();
      onRefreshPublicProjects();
    } catch (err: any) {
      showNotification('error', err.message || 'Operation failed.');
    }
  };

  // Delete project
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await api.deleteProject(projectToDelete._id || projectToDelete.slug, token);
      showNotification('success', `Project "${projectToDelete.title}" deleted.`);
      setProjectToDelete(null);
      await loadData();
      onRefreshPublicProjects();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete project.');
    }
  };

  // Quick toggle featured status
  const handleToggleFeatured = async (p: Project) => {
    try {
      await api.updateProject(p._id || p.slug, { isFeatured: !p.isFeatured }, token);
      showNotification('success', `Updated featured status for "${p.title}".`);
      await loadData();
      onRefreshPublicProjects();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update status.');
    }
  };

  // Quick toggle published status
  const handleTogglePublished = async (p: Project) => {
    try {
      await api.updateProject(p._id || p.slug, { isPublished: !p.isPublished }, token);
      showNotification('success', `Updated publish status for "${p.title}".`);
      await loadData();
      onRefreshPublicProjects();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update status.');
    }
  };

  // Restore seed default projects
  const handleResetSeed = async () => {
    if (!window.confirm('Reset all projects to default ByteVerse showcase set? Any custom projects will be replaced.')) {
      return;
    }
    try {
      await api.seedProjects(token);
      showNotification('success', 'Projects successfully restored to default showcase set.');
      await loadData();
      onRefreshPublicProjects();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to reset projects.');
    }
  };

  // Test Telegram Bot
  const handleTestTelegram = async () => {
    try {
      setTestingTelegram(true);
      const res = await api.testTelegram(token);
      showNotification('success', res.message || 'Telegram test message delivered!');
    } catch (err: any) {
      showNotification('error', err.message || 'Telegram delivery failed.');
    } finally {
      setTestingTelegram(false);
    }
  };

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateEnquiryStatus(id, newStatus, token);
      showNotification('success', `Enquiry marked as ${newStatus}.`);
      await loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update enquiry status.');
    }
  };

  // Delete Enquiry
  const handleConfirmDeleteEnquiry = async () => {
    if (!enquiryToDelete) return;
    try {
      await api.deleteEnquiry(enquiryToDelete._id || enquiryToDelete.id!, token);
      showNotification('success', 'Enquiry deleted.');
      setEnquiryToDelete(null);
      await loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete enquiry.');
    }
  };

  const filteredAdminProjects = projects.filter(p => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="py-8 md:py-12 bg-[#020617] min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Bar: Title & Global Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Admin Console: Authenticated Session Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ByteVerse Management Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMsg && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-fade-in ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                : 'bg-red-950/60 border border-red-800 text-red-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400">Total Projects</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {stats.totalProjects}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {stats.publishedProjects} published · {stats.featuredProjects} featured
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400">Total Enquiries</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {stats.totalEnquiries}
              </div>
              <div className="text-[11px] text-blue-400 mt-1">
                {stats.unreadEnquiries} new unread submissions
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400">Database Engine</div>
              <div className="text-sm font-bold text-white font-mono mt-2 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>{stats.databaseConnected ? 'MongoDB Atlas' : 'Resilient Store'}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {stats.databaseConnected ? 'Active connection' : 'Local fallback active'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400">Telegram Bot Webhook</div>
              <div className="text-sm font-bold text-white font-mono mt-2 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-blue-400" />
                <span>{stats.telegramConfigured ? 'Ready' : 'Not Set in .env'}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {stats.telegramConfigured ? 'Auto-dispatches alerts' : 'Configure token in .env'}
              </div>
            </div>

          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Project Management ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>Visitor Enquiries</span>
            {enquiries.filter(e => e.status === 'new').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'integrations'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            System & Deployment Tools
          </button>
        </div>

        {/* TAB 1: Projects Table & Management */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter admin projects..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSeed}
                  className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
                  title="Reset projects to default showcase"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restore Seed Projects</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredAdminProjects.map(proj => (
                    <tr key={proj._id || proj.slug} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={proj.mainImage}
                            alt=""
                            className="w-10 h-7 rounded object-cover bg-slate-950"
                          />
                          <div>
                            <div className="font-bold text-white">{proj.title}</div>
                            <div className="text-[11px] text-slate-500 font-mono">/{proj.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {proj.category}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-slate-400">
                          {proj.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(proj)}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                            proj.isFeatured
                              ? 'bg-blue-900/60 text-blue-300 border border-blue-700/80'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {proj.isFeatured ? 'Yes' : 'No'}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublished(proj)}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                            proj.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {proj.isPublished ? 'Live' : 'Draft'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreviewProject(proj)}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Preview Project"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(proj)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 rounded hover:bg-slate-800"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProjectToDelete(proj)}
                            className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-slate-800"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAdminProjects.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No projects match the current search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: Enquiries Table */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{enquiries.length} contact enquiries received via website</span>
            </div>

            <div className="space-y-3">
              {enquiries.map(enq => (
                <div
                  key={enq._id || enq.id}
                  className={`p-5 rounded-xl border transition-all ${
                    enq.status === 'new'
                      ? 'bg-slate-900/90 border-blue-900/60 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{enq.fullName}</h3>
                        {enq.status === 'new' && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono font-semibold">
                            NEW
                          </span>
                        )}
                        {enq.telegramDelivered && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                            <Send className="w-3 h-3" /> Telegram Sent
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <a href={`mailto:${enq.email}`} className="text-blue-400 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{enq.email}</span>
                        </a>
                        {enq.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{enq.phone}</span>
                          </span>
                        )}
                        <span className="text-slate-500">·</span>
                        <span className="font-mono text-slate-400">{enq.projectType}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateEnquiryStatus(enq._id || enq.id!, e.target.value)}
                        className="text-xs bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>

                      <button
                        onClick={() => setEnquiryToDelete(enq)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                        title="Delete enquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {enq.message}
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Submitted: {new Date(enq.createdAt || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
              ))}

              {enquiries.length === 0 && (
                <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No enquiries recorded yet. Submissions from the public Contact page will appear here.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: Integrations & Tools */}
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Telegram Integration Diagnostics */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Telegram Notification Bot</h3>
                  <div className="text-xs text-slate-400">Server-side instant enquiry alerts</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                When a visitor submits the contact form, ByteVerse securely sends an HTML-formatted message to your configured Telegram channel or chat.
              </p>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
                <div>TELEGRAM_BOT_TOKEN: {stats?.telegramConfigured ? 'Configured in server' : 'Not configured'}</div>
                <div>TELEGRAM_CHAT_ID: {stats?.telegramConfigured ? 'Configured in server' : 'Not configured'}</div>
              </div>

              <button
                onClick={handleTestTelegram}
                disabled={testingTelegram}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow transition-colors disabled:opacity-50"
              >
                {testingTelegram ? <span>Sending Test Packet...</span> : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Diagnostic Telegram Message</span>
                  </>
                )}
              </button>
            </div>

            {/* Vercel & GitHub Full Package Export */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Export Vercel Package</h3>
                  <div className="text-xs text-slate-400">Ready-to-deploy ZIP archive</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Download the complete standalone deployment bundle containing <code>vercel.json</code>, <code>api/index.js</code>, <code>.env.example</code>, and <code>README.md</code> for immediate GitHub commit or Vercel import.
              </p>

              <a
                href="/api/admin/export-zip"
                download="byteverse-production-deployment.zip"
                className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Deployment ZIP</span>
              </a>
            </div>

          </div>
        )}

        {/* Modal: Project Add / Edit Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Distributed Vector Store"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. distributed-vector-store"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="Web Applications">Web Applications</option>
                      <option value="Mobile & AI">Mobile & AI</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Enterprise Tools">Enterprise Tools</option>
                      <option value="Open Source">Open Source</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Development Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="Production">Production</option>
                      <option value="Beta">Beta</option>
                      <option value="In Development">In Development</option>
                      <option value="Completed">Completed</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Short description */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-sentence summary..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                {/* Full description */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Full Description & Problem Solved *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Explain the background, architectural design, and problem being solved..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                {/* Technologies */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, TypeScript, Go, Docker, Kubernetes"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>

                {/* Key Features */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">Key Features (one per line)</label>
                  <textarea
                    rows={3}
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                {/* Image Upload & URL */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium">Main Project Image *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.mainImage}
                      onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                      placeholder="Image URL or choose file below..."
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                    <label className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap">
                      <span>Upload &lt;3MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.mainImage && (
                    <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                      <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* GitHub & Demo URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">GitHub Repository URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">Live Demo URL</label>
                    <input
                      type="url"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Checkboxes: Featured & Published */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                    />
                    <span>Mark as Featured Project</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                    />
                    <span>Publish Immediately (Publicly Visible)</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md"
                  >
                    {editingProject ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* Delete Project Confirmation Dialog */}
        {projectToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <Trash2 className="w-6 h-6" />
                <h3 className="text-base font-bold text-white">Delete Project?</h3>
              </div>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete <strong className="text-white">"{projectToDelete.title}"</strong>? This action will remove it from the database.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteProject}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Enquiry Confirmation Dialog */}
        {enquiryToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <Trash2 className="w-6 h-6" />
                <h3 className="text-base font-bold text-white">Delete Enquiry?</h3>
              </div>
              <p className="text-xs text-slate-300">
                Permanently delete enquiry from <strong className="text-white">"{enquiryToDelete.fullName}"</strong>?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setEnquiryToDelete(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteEnquiry}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
