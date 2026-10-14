import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, Instagram, ShieldCheck, Clock, Phone } from 'lucide-react';
import { api } from '../services/api';

interface ContactSectionProps {
  prefilledProjectType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ prefilledProjectType }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: prefilledProjectType || 'Web Applications',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; telegramNotice?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessInfo(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (formData.message.trim().length < 10) {
      setErrorMsg('Please enter a project description of at least 10 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.submitEnquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        projectType: formData.projectType,
        message: formData.message.trim()
      });

      setSuccessInfo({
        message: res.message || 'Enquiry submitted successfully!',
        telegramNotice: res.telegramNotice
      });

      // Clear form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        projectType: 'Web Applications',
        message: ''
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-[#030712]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Information & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-semibold text-blue-400">
              Get in Touch
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              Start a Project with ByteVerse
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Have an architecture to discuss, an MVP to build, or a digital transformation initiative? Submit your requirements and our team will review the scope promptly.
            </p>

            {/* Direct Channel Cards */}
            <div className="space-y-3 pt-4">
              
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Public Contact Email</div>
                  <a
                    href="mailto:byteverseindia.in@gmail.com"
                    className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    byteverseindia.in@gmail.com
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-pink-600/10 border border-pink-500/20 text-pink-400 shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Official Instagram</div>
                  <a
                    href="https://instagram.com/byteverse.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    @byteverse.in
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Notification Pipeline</div>
                  <div className="text-xs font-medium text-slate-300">
                    Real-time Telegram Bot webhook alerts dispatched directly to the admin.
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Typical response window: 12–24 business hours.</span>
            </div>

          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-xl">
              
              <h3 className="text-xl font-bold text-white mb-6">
                Project Enquiry Form
              </h3>

              {/* Success Notification Alert */}
              {successInfo && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-xs sm:text-sm space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{successInfo.message}</span>
                  </div>
                  {successInfo.telegramNotice && (
                    <p className="text-emerald-300/80 text-xs pl-6">
                      {successInfo.telegramNotice}
                    </p>
                  )}
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Full Name <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Email Address <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Project Type <span className="text-blue-400">*</span>
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      <option value="Web Applications">Web Applications & SaaS</option>
                      <option value="Mobile & AI">Mobile & AI Workflows</option>
                      <option value="Cloud & DevOps">Cloud & DevOps Architecture</option>
                      <option value="Enterprise Tools">Enterprise Software</option>
                      <option value="Open Source">Open Source Contribution</option>
                      <option value="UI/UX Redesign">UI/UX & Frontend Optimization</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Project Requirements / Message <span className="text-blue-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your project objectives, timeline, key technologies, or specific challenges..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-y"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Send Project Enquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center">
                  Your enquiry will be securely stored in MongoDB and transmitted to Telegram Bot. We respect your privacy.
                </p>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
