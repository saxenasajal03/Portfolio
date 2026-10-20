import React, { useState } from 'react';
import { Mail, Phone, MapPin, Download, Send, CheckCircle2, Copy, ArrowUp, ExternalLink, Sparkles, MessageSquare, Linkedin } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { MotionCard3D } from './MotionCard3D';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const quickTopics = [
    { label: 'Full-Stack Engineering Role', subject: 'Opportunity: Full-Stack Engineering Role' },
    { label: 'Generative AI / ML Project', subject: 'Inquiry: Generative AI / ML Initiative' },
    { label: 'Urban Company QA / Operations', subject: 'Discussion: Operations & SLA Quality Engineering' },
    { label: 'Consulting / Freelance', subject: 'Project Proposal: Web Architecture & Systems' },
  ];

  const handleCopyEmail = () => {
    soundEngine.playTick();
    navigator.clipboard.writeText('sajalsaxenagola@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickTopic = (topic: { label: string; subject: string }) => {
    soundEngine.playTick();
    setFormState((prev) => ({
      ...prev,
      subject: topic.subject,
      message: prev.message || `Hi Sajal,\n\nI came across your portfolio and wanted to discuss an opportunity regarding ${topic.label.toLowerCase()}.\n\nLet's schedule a brief conversation.\n\nBest regards,`,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playResonance();
    setIsSubmitted(true);

    const subjectText = formState.subject.trim() || `Portfolio Inquiry from ${formState.name.trim() || 'Recruiter / Client'}`;
    const bodyText = `Hi Sajal,\n\nName: ${formState.name}\nEmail: ${formState.email}\nTopic: ${subjectText}\n\nMessage:\n${formState.message}\n\nBest regards,\n${formState.name}`;

    const mailtoUrl = `mailto:sajalsaxenagola@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

    // Direct mailto trigger - immediately launches default mail client (Apple Mail, Outlook, Thunderbird, iOS Mail, Android Gmail)
    window.location.href = mailtoUrl;
  };

  const openGmailWeb = () => {
    soundEngine.playTick();
    const subjectText = formState.subject.trim() || 'Connecting via Portfolio';
    const bodyText = formState.message ? `Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}` : 'Hi Sajal, I saw your portfolio and would like to connect.';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sajalsaxenagola@gmail.com&su=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
    window.open(gmailUrl, '_blank');
  };

  const scrollToTop = () => {
    soundEngine.playTick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 bg-[#0a0704] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff9a3c] uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
              <span>05 // Direct Communication</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              CONNECT & COLLABORATE
            </h2>
          </div>
          <p className="text-sm text-neutral-400 font-mono max-w-md">
            Currently at Urban Company Central SBC Quality Team. Open to high-impact software engineering, full-stack systems, and AI initiatives.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Coordinates & Resume */}
          <div className="lg:col-span-2">
            <MotionCard3D maxTilt={7} depth={20} className="w-full">
              <div className="bg-[#140e09] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                    Direct Coordinates
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Click to mail directly, copy address, or call.
                  </p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  {/* Primary Direct Mail Action */}
                  <div className="p-4 rounded-lg bg-[#ff9a3c]/10 border border-[#ff9a3c]/30 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Mail size={18} className="text-[#ff9a3c]" />
                        <span className="text-white font-bold tracking-tight">Direct Email</span>
                      </div>
                      <button
                        onClick={handleCopyEmail}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-neutral-200 flex items-center gap-1 transition-colors"
                        title="Copy email address"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 size={12} className="text-green-400" />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <a
                      href="mailto:sajalsaxenagola@gmail.com"
                      className="block text-sm sm:text-base font-bold text-[#ff9a3c] hover:underline truncate"
                    >
                      sajalsaxenagola@gmail.com
                    </a>

                    {/* Dual Action: Native Mailto & Web Gmail */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href="mailto:sajalsaxenagola@gmail.com"
                        className="flex-1 py-2 px-3 rounded bg-[#ff9a3c] hover:bg-[#ffaa55] text-[#130e09] font-bold text-center text-xs transition-colors shadow-sm"
                      >
                        Open Email App
                      </a>
                      <button
                        type="button"
                        onClick={openGmailWeb}
                        className="py-2 px-3 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-center text-xs transition-colors flex items-center justify-center gap-1 border border-white/10"
                      >
                        <span>Gmail Web</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="p-3.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-[#ff9a3c] shrink-0" />
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase block">Phone / WhatsApp</span>
                        <a href="tel:+918840810386" className="text-white hover:underline text-sm font-semibold">
                          +91 88408 10386
                        </a>
                      </div>
                    </div>
                    <a
                      href="tel:+918840810386"
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300 text-xs transition-colors"
                    >
                      Call
                    </a>
                  </div>

                  {/* Location */}
                  <div className="p-3.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-3">
                    <MapPin size={16} className="text-[#ff9a3c] shrink-0" />
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Base & Headquarters</span>
                      <span className="text-neutral-200 text-xs">
                        Ghitorni, New Delhi / Gola Gokarannath, UP – 262802
                      </span>
                    </div>
                  </div>

                  {/* LinkedIn Profile Direct Link */}
                  <div className="p-3.5 rounded-lg bg-[#0077b5]/10 border border-[#0077b5]/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Linkedin size={18} className="text-[#38bdf8] shrink-0" />
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase block">Professional Network</span>
                        <span className="text-white text-xs font-semibold">LinkedIn Profile</span>
                      </div>
                    </div>
                    <a
                      href="https://www.linkedin.com/in/sajal-saxena-cse/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.playTick()}
                      className="px-3 py-1.5 rounded bg-[#0077b5] hover:bg-[#0088cc] text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <span>Connect</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                {/* Verified Resume Download */}
                <div className="pt-4 border-t border-white/10">
                  <a
                    href="/assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Sajal_Saxena_Resume.pdf"
                    onClick={() => soundEngine.playTick()}
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs font-mono transition-all shadow-md active:scale-98"
                  >
                    <Download size={15} className="text-[#ff9a3c]" />
                    <span>Download Verified Resume (PDF)</span>
                  </a>
                </div>
              </div>
            </MotionCard3D>
          </div>

          {/* Direct Proposal Form */}
          <div className="lg:col-span-3">
            <MotionCard3D maxTilt={6} depth={18} className="w-full">
              <div className="bg-[#140e09] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Submitting directly opens your email client with your message drafted.
                  </p>
                </div>

              {/* Quick Topic Chips */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Quick Select Topic:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickTopics.map((topic, tIdx) => (
                    <button
                      key={tIdx}
                      type="button"
                      onClick={() => handleQuickTopic(topic)}
                      className="px-2.5 py-1 rounded text-[11px] font-mono bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-white/10 transition-colors text-left"
                    >
                      + {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase tracking-wider block">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff9a3c] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase tracking-wider block">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff9a3c] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 uppercase tracking-wider block">Subject / Role Scope</label>
                  <input
                    type="text"
                    required
                    placeholder="Full-Stack Engineering / Urban Company Quality / AI Initiative"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff9a3c] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 uppercase tracking-wider block">Message Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your initiative, project requirements, or opportunity..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff9a3c] transition-colors font-sans"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full sm:flex-1 py-3.5 rounded bg-[#ff9a3c] hover:bg-[#ffaa55] text-[#130e09] font-bold border border-transparent transition-all shadow-md active:scale-98 text-xs font-mono"
                  >
                    <Send size={15} />
                    <span>Send Message to sajalsaxenagola@gmail.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={openGmailWeb}
                    className="w-full sm:w-auto px-4 py-3.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-xs font-mono border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Open in Gmail</span>
                    <ExternalLink size={13} />
                  </button>
                </div>

                {isSubmitted && (
                  <div className="p-3 rounded bg-green-500/15 border border-green-500/30 text-green-300 text-xs flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>Your mail client has been opened to send this message directly to Sajal Saxena!</span>
                  </div>
                )}
              </form>
            </div>
            </MotionCard3D>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff9a3c]" />
            <span>Sajal Saxena · Urban Company Central SBC Quality · B.Tech CSE</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors p-1"
          >
            <span>Back to 3D Hero</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </section>
  );
};
