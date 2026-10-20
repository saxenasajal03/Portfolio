import React, { useState } from 'react';
import { X, ExternalLink, Download, Mail, Phone, MapPin, Award, Briefcase, Code, GraduationCap, Cpu, CheckCircle2, Linkedin, Github } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ProfileDossierProps {
  isOpen: boolean;
  onClose: () => void;
  cutoutDataUrl?: string;
}

export const ProfileDossier: React.FC<ProfileDossierProps> = ({ isOpen, onClose, cutoutDataUrl }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'experience' | 'skills'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#120d09] border border-white/15 text-white flex flex-col shadow-2xl overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar / Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16100b]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#ff9a3c] rounded-full inline-block" />
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SAJAL SAXENA
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300 font-normal">
                  Urban Company BDA & AI Engineer
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Sajal Saxena Portfolio Archive · Ref: 2026-SAX-DEV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/Portfolio/assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Sajal_Saxena_Resume.pdf"
              onClick={() => soundEngine.playTick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Resume PDF</span>
            </a>
            <button
              onClick={() => {
                soundEngine.playTick();
                onClose();
              }}
              className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-[#140e09] overflow-x-auto text-xs font-mono">
          {[
            { id: 'overview', label: 'Overview & Bio' },
            { id: 'projects', label: 'Key Projects' },
            { id: 'experience', label: 'Experience' },
            { id: 'skills', label: 'Technical Stack & Certs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playTick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`pb-2.5 px-2 border-b-2 uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#ff9a3c] text-white font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-neutral-300 font-sans">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo & Quick Contact */}
              <div className="space-y-4">
                <div className="relative aspect-[3/4] bg-neutral-900 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center p-2 group">
                  <img
                    src="/Portfolio/assets/resource/image_18e25f87.png"
                    alt="Sajal Saxena"
                    className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(255,154,60,0.15)] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 border border-white/10 text-[#ff9a3c]">
                    3D SUBJECT
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-lg space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Mail size={13} className="text-[#ff9a3c]" />
                    <a href="mailto:sajalsaxenagola@gmail.com" className="hover:underline truncate">
                      sajalsaxenagola@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Phone size={13} className="text-[#ff9a3c]" />
                    <span>+91 88408 10386</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <MapPin size={13} className="text-[#ff9a3c]" />
                    <span>New Delhi / Uttar Pradesh, India</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300 pt-1 border-t border-white/5">
                    <Linkedin size={13} className="text-[#38bdf8]" />
                    <a
                      href="https://www.linkedin.com/in/sajal-saxena-cse/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#38bdf8] hover:underline"
                    >
                      linkedin.com/in/sajal-saxena-cse
                    </a>
                  </div>
                </div>
              </div>

              {/* Bio & Key Metrics */}
              <div className="md:col-span-2 space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                    Craftwork, Code & Data-Driven Operations
                  </h3>
                  <p className="leading-relaxed text-neutral-300 text-sm">
                    Computer Science graduate and Business Development Associate in Urban Company’s Central SBC Quality team. Combining full-stack engineering (React.js, Node.js, SQL), quality systems, and operational problem solving. Specialised in Tier 1 and Tier 2 escalations, root-cause investigation, Jarvis analytics, and modern AI-enabled workflows.
                  </p>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-[#ff9a3c] font-mono">&gt;80%</div>
                    <div className="text-[11px] font-mono text-neutral-400 uppercase mt-0.5">Real-Time Attendance SLA</div>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-white font-mono">-30%</div>
                    <div className="text-[11px] font-mono text-neutral-400 uppercase mt-0.5">API Latency Reduction</div>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-[#ff9a3c] font-mono">95%+</div>
                    <div className="text-[11px] font-mono text-neutral-400 uppercase mt-0.5">CNN Model Accuracy</div>
                  </div>
                </div>

                {/* Key Pillars */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-[#ff9a3c]">Core Capabilities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-start gap-2 p-2.5 rounded bg-white/5 border border-white/5">
                      <Cpu size={14} className="text-[#ff9a3c] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-medium">Generative AI & ML</strong>
                        <span className="text-neutral-400">OCI 2025 GenAI Certified, TensorFlow/Keras, ETL workflows.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded bg-white/5 border border-white/5">
                      <Code size={14} className="text-[#ff9a3c] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-medium">Full-Stack Architecture</strong>
                        <span className="text-neutral-400">React.js, Node.js, Express, Three.js, WebRTC, Socket.io, MySQL.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded bg-white/5 border border-white/5">
                      <Briefcase size={14} className="text-[#ff9a3c] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-medium">Urban Company Central SBC</strong>
                        <span className="text-neutral-400">Tier 1/2 escalations, Jarvis analytics, SLA compliance.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2.5 rounded bg-white/5 border border-white/5">
                      <GraduationCap size={14} className="text-[#ff9a3c] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-medium">B.Tech in Computer Science</strong>
                        <span className="text-neutral-400">Dev Bhoomi Uttarakhand University (2021–2025).</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {[
                {
                  title: 'Elexoplus Commerce and ERP Suite',
                  tech: 'React.js · Node.js · Express · MySQL',
                  desc: 'Developed a dual commerce ecosystem comprising a high-converting D2C Storefront (elexoplus.com) and comprehensive B2B Wholesale Portal (b2b.elexoplus.com). Features full administrative controls, granular role-based access control (RBAC), multi-warehouse inventory tracking, and automated order-management pipelines.',
                  highlights: ['D2C Storefront & B2B Portal', 'Role-Based Access Control', 'Real-Time Inventory Engine'],
                },
                {
                  title: 'ConnectX – Real-Time Chat & Video Calling',
                  tech: 'React.js · Node.js · Socket.io · WebRTC · MongoDB',
                  desc: 'High-concurrency communication platform supporting peer-to-peer WebRTC video streaming, sub-second encrypted text messaging, concurrent room orchestration, and dynamic bandwidth mesh fallback.',
                  highlights: ['Peer-to-peer WebRTC', 'Socket.io Bidirectional Stream', 'Tested Concurrent Channels'],
                },
                {
                  title: 'Plant Leaf Disease Identifier (AI/ML)',
                  tech: 'Python · TensorFlow/Keras · OpenCV · React.js',
                  desc: 'Deep learning convolutional neural network (CNN) pipeline trained on agricultural botanical datasets to identify botanical foliar pathologies in real-time, achieving >95% validation accuracy with integrated image preprocessing.',
                  highlights: ['95%+ Validation Accuracy', 'CNN Image Classification', 'Real-Time Inference UI'],
                },
                {
                  title: 'Electricity Bill Management System',
                  tech: 'Java Swing/AWT · SQL Server · JDBC',
                  desc: 'Desktop enterprise billing system utilizing complex relational SQL queries, multi-table joins, transactions, and stored procedures to automate utility metering and tariff calculation.',
                  highlights: ['Stored Procedures & Triggers', 'Transactional Consistency', 'Desktop GUI Application'],
                },
              ].map((proj, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#ff9a3c]/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="text-base font-bold text-white">{proj.title}</h4>
                    <span className="text-xs font-mono text-[#ff9a3c] bg-[#ff9a3c]/10 px-2.5 py-0.5 rounded border border-[#ff9a3c]/20">
                      {proj.tech}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 mb-3 leading-relaxed">{proj.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.highlights.map((h, hIdx) => (
                      <span key={hIdx} className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-[#ff9a3c]" />
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4">
              {[
                {
                  role: 'Business Development Associate – Central SBC Quality Team',
                  company: 'Urban Company',
                  location: 'Ghitorni, New Delhi',
                  period: 'Apr 2026 – Present',
                  bullets: [
                    'Resolve Tier 1 and Tier 2 operational bottlenecks and partner escalations through structured investigation and root-cause analysis.',
                    'Use Jarvis analytics, SQL queries, and advanced Excel to monitor service-level agreements (SLAs), compliance metrics, and partner performance.',
                    'Support service-cohort performance against Real-Time (RT) Attendance thresholds exceeding 80%.',
                    'Contribute to Partner Upgrades Training and AI Handholding pilot initiatives through cross-functional coordination and process improvement.',
                  ],
                },
                {
                  role: 'Web Developer',
                  company: 'themrgamer.com',
                  location: 'Remote',
                  period: 'Jan 2025 – Mar 2025',
                  bullets: [
                    'Developed an online gaming platform, implemented relational database structures, and supported website reliability and maintenance.',
                    'Implemented functional testing and API optimizations, achieving a reported 30% reduction in response latency.',
                  ],
                },
                {
                  role: 'AI/ML Intern',
                  company: 'Feynn Labs',
                  location: 'Remote',
                  period: 'Aug 2024 – Oct 2024',
                  bullets: [
                    'Developed machine learning models and automated ETL workflows; applied data preprocessing, testing, and quality checks during iterative development.',
                  ],
                },
                {
                  role: 'Web Developer',
                  company: 'CollegeDesire',
                  location: 'Remote',
                  period: 'Jan 2024 – Jun 2024',
                  bullets: [
                    'Developed web application modules, optimized SQL queries, and supported technical SEO improvements associated with a reported 25% increase in organic visibility.',
                  ],
                },
              ].map((exp, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div>
                      <h4 className="text-base font-bold text-white">{exp.role}</h4>
                      <div className="text-xs font-mono text-[#ff9a3c]">{exp.company} · {exp.location}</div>
                    </div>
                    <span className="text-xs font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300 leading-relaxed pt-1">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="marker:text-[#ff9a3c]">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Certifications */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-widest text-[#ff9a3c] flex items-center gap-1.5">
                  <Award size={14} />
                  Certifications & Recognitions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
                    'Python and SQL Certification – HackerRank',
                    'Java Certification – Infosys and ICT Academy',
                    'ESG Virtual Experience Program – Tata Consultancy Services',
                    'Finalist – Lakshagriha Hackathon 1.0, DBUU',
                    'Flipkart GRiD 6.0 – Software Development Track Participant',
                  ].map((cert, cIdx) => (
                    <div key={cIdx} className="p-2.5 rounded bg-white/5 border border-white/10 flex items-center gap-2 text-xs">
                      <CheckCircle2 size={14} className="text-[#ff9a3c] shrink-0" />
                      <span className="text-neutral-200">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Matrix */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-widest text-[#ff9a3c] flex items-center gap-1.5">
                  <Code size={14} />
                  Full Stack & Systems Matrix
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-white/5 border border-white/5 space-y-1">
                    <span className="font-mono text-[#ff9a3c] block font-semibold">Languages</span>
                    <p className="text-neutral-300">JavaScript (ES6+), TypeScript, Java, PHP, Python, HTML5, CSS3/Tailwind</p>
                  </div>
                  <div className="p-3 rounded bg-white/5 border border-white/5 space-y-1">
                    <span className="font-mono text-[#ff9a3c] block font-semibold">Frameworks & Libraries</span>
                    <p className="text-neutral-300">React.js, Node.js, Express.js, Three.js, Tailwind CSS, TensorFlow/Keras</p>
                  </div>
                  <div className="p-3 rounded bg-white/5 border border-white/5 space-y-1">
                    <span className="font-mono text-[#ff9a3c] block font-semibold">Databases & Analytics</span>
                    <p className="text-neutral-300">MySQL, MongoDB, Microsoft SQL Server, DB2, Jarvis Analytics, Advanced Excel</p>
                  </div>
                  <div className="p-3 rounded bg-white/5 border border-white/5 space-y-1">
                    <span className="font-mono text-[#ff9a3c] block font-semibold">Operations & Methodologies</span>
                    <p className="text-neutral-300">Tier 1/2 Escalations, Root-Cause Analysis, SLA Monitoring, Agile/Scrum</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#140e09] flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>Dev Bhoomi Uttarakhand University · B.Tech CSE (2021–2025)</span>
          <a
            href="mailto:sajalsaxenagola@gmail.com"
            className="text-[#ff9a3c] hover:underline flex items-center gap-1"
          >
            <span>Direct Inquiry</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};
