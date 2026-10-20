import React, { useState, useRef } from 'react';
import { ExternalLink, Github, Code, CheckCircle2, Layers, Cpu, Database, ArrowUpRight, Search } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ProjectItem {
  id: string;
  title: string;
  category: 'fullstack' | 'ai' | 'systems';
  role: string;
  stack: string[];
  metrics: string;
  description: string;
  architectureDetails: string[];
  liveLink?: string;
  githubLink?: string;
  accent: string;
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'elexoplus',
    title: 'Elexoplus Commerce & ERP Suite',
    category: 'fullstack',
    role: 'Lead Full-Stack Architect',
    stack: ['React.js', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'REST APIs'],
    metrics: 'Dual D2C & B2B Architecture',
    description:
      'Engineered an enterprise-grade commerce ecosystem comprising a high-converting direct-to-consumer storefront (elexoplus.com) and a robust B2B wholesale portal (b2b.elexoplus.com). Implemented granular role-based access control (RBAC), multi-tier inventory synchronization, and automated order-dispatch workflows.',
    architectureDetails: [
      'Engineered relational schema with indexing on high-frequency order and customer lookup tables',
      'Developed administrative analytics dashboard for warehouse dispatch and inventory velocity',
      'Implemented secure JWT-based role authorization for distinct wholesale and retail customer cohorts',
      'Architected resilient checkout pipeline with automated inventory reconciliation and invoice generation',
    ],
    liveLink: 'https://elexoplus.com',
    accent: '#ff9a3c',
  },
  {
    id: 'connectx',
    title: 'ConnectX – Real-Time Chat & Video Calling',
    category: 'fullstack',
    role: 'Real-Time Communications Engineer',
    stack: ['React.js', 'Node.js', 'Socket.io', 'WebRTC', 'MongoDB', 'STUN/TURN'],
    metrics: '<100ms Media Latency',
    description:
      'Architected a distributed real-time communication platform supporting encrypted peer-to-peer WebRTC video streaming and sub-second Socket.io bidirectional text messaging. Rigorously tested under multi-room concurrent loads with seamless ICE candidate renegotiation.',
    architectureDetails: [
      'Configured WebRTC mesh topologies for low-latency peer-to-peer audio and video transmission',
      'Engineered Socket.io room orchestration with heartbeat monitors and automatic reconnect logic',
      'Optimized MongoDB document schemas for rapid room state caching and message history pagination',
      'Built reactive UI with dynamic media device switching (camera, microphone, screen sharing)',
    ],
    liveLink: '#',
    accent: '#38bdf8',
  },
  {
    id: 'plant-disease',
    title: 'Plant Leaf Disease Identifier (CNN)',
    category: 'ai',
    role: 'AI / Computer Vision Developer',
    stack: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'React.js', 'Flask'],
    metrics: '95%+ Validation Accuracy',
    description:
      'Developed a deep learning convolutional neural network (CNN) model for automated crop foliar disease diagnosis. Trained on diverse botanical pathology datasets with OpenCV augmentation pipelines, delivering instantaneous inference through an intuitive React interface.',
    architectureDetails: [
      'Trained deep convolutional feature extractors with Dropout and Batch Normalization to prevent overfitting',
      'Built automated image preprocessing pipeline including Gaussian filtering, thresholding, and normalization',
      'Exceeded 95% classification accuracy across diverse foliar bacterial, fungal, and viral infections',
      'Exported optimized model weights for low-latency web serving via lightweight REST inference endpoints',
    ],
    liveLink: '#',
    accent: '#10b981',
  },
  {
    id: 'electricity-billing',
    title: 'Electricity Bill Management System',
    category: 'systems',
    role: 'Database & Systems Developer',
    stack: ['Java Swing/AWT', 'SQL Server', 'JDBC', 'Stored Procedures', 'T-SQL'],
    metrics: 'ACID Transactional Consistency',
    description:
      'Developed an enterprise desktop utility billing application using Java Swing/AWT and Microsoft SQL Server. Utilized complex multi-table relational joins, stored procedures, and triggers to streamline tariff calculations, bill generation, and customer account ledgers.',
    architectureDetails: [
      'Designed normalized 3NF database schema with foreign key cascades and audit logging',
      'Implemented transactional stored procedures to prevent race conditions during bulk monthly meter posting',
      'Created intuitive desktop administrative interface for meter readers and billing officers',
      'Generated automated PDF/print-ready utility bills with calculated tiered slab tariffs',
    ],
    accent: '#a855f7',
  },
  {
    id: 'themrgamer',
    title: 'themrgamer.com Online Gaming Platform',
    category: 'fullstack',
    role: 'Web Developer',
    stack: ['React.js', 'PHP 8', 'MySQL', 'REST APIs', 'cPanel', 'Apache'],
    metrics: '30% Latency Reduction',
    description:
      'Developed and maintained an interactive online gaming platform. Implemented scalable relational database structures, executed functional quality assurance tests, and optimized backend API query pipelines to reduce response latency by 30%.',
    architectureDetails: [
      'Refactored legacy database queries and indexed foreign keys to eliminate bottlenecks',
      'Conducted end-to-end API stress tests and implemented caching layers',
      'Built responsive gaming interface with real-time scoreboards and user session security',
      'Maintained 99.9% uptime during peak tournament traffic through continuous server monitoring',
    ],
    liveLink: 'https://themrgamer.com',
    accent: '#f59e0b',
  },
];

const Project3DCard: React.FC<{ project: ProjectItem; onClick: () => void }> = ({ project, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glintX: 50, glintY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;
    setTilt({
      rotX,
      rotY,
      glintX: (x / rect.width) * 100,
      glintY: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotX: 0, rotY: 0, glintX: 50, glintY: 50 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-[#150f0a] border border-white/10 hover:border-[#ff9a3c]/60 rounded-xl p-6 flex flex-col justify-between cursor-pointer overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(900px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) translateZ(0px)`,
        transition: 'transform 0.12s ease-out, border-color 0.25s, box-shadow 0.25s',
        boxShadow: tilt.rotX !== 0 ? `0 16px 36px rgba(0,0,0,0.6), 0 0 20px ${project.accent}20` : 'none',
      }}
    >
      {/* 3D Specular Light Sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.glintX}% ${tilt.glintY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
        }}
      />

      <div style={{ transform: 'translateZ(20px)' }}>
        {/* Metric Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className="text-[11px] font-mono px-2.5 py-1 rounded border font-semibold shadow-sm"
            style={{
              color: project.accent,
              borderColor: `${project.accent}40`,
              backgroundColor: `${project.accent}15`,
            }}
          >
            {project.metrics}
          </span>
          <span className="text-xs font-mono text-neutral-500 uppercase">{project.role}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#ff9a3c] transition-colors mb-3 flex items-center justify-between">
          <span>{project.title}</span>
          <ArrowUpRight size={18} className="text-neutral-500 group-hover:text-[#ff9a3c] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed mb-6 font-sans">
          {project.description}
        </p>
      </div>

      {/* Stack Tags & CTA */}
      <div className="space-y-4 pt-4 border-t border-white/10" style={{ transform: 'translateZ(15px)' }}>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech, tIdx) => (
            <span
              key={tIdx}
              className="text-[10px] font-mono bg-white/5 text-neutral-400 px-2 py-0.5 rounded border border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="text-[10px] font-mono text-[#ff9a3c] px-1.5 py-0.5">
              +{project.stack.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
          <span>Click to view technical breakdown</span>
          <span className="text-[#ff9a3c]">Explore &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'fullstack' | 'ai' | 'systems'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects =
    filter === 'all' ? PROJECTS_DATA : PROJECTS_DATA.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 bg-[#0f0a06] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff9a3c] uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
              <span>01 // Selected Engineering Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              PROVEN SYSTEMS & APPS
            </h2>
          </div>
          <p className="text-sm text-neutral-400 font-mono max-w-md">
            Production-tested architectures spanning enterprise ERPs, sub-second WebRTC media channels, and high-accuracy CNN neural networks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xs">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'fullstack', label: 'Full-Stack & ERP' },
            { id: 'ai', label: 'AI & Neural Networks' },
            { id: 'systems', label: 'Enterprise Systems & SQL' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playTick();
                setFilter(tab.id as typeof filter);
              }}
              className={`px-4 py-2 rounded-full uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#ff9a3c] text-[#130e09] font-bold shadow-lg shadow-[#ff9a3c]/15'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid with 3D Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Project3DCard
              key={project.id}
              project={project}
              onClick={() => {
                soundEngine.playResonance();
                setSelectedProject(project);
              }}
            />
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-[#150f0a] border border-white/20 rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div
                    className="inline-block text-[11px] font-mono px-2.5 py-1 rounded mb-2 border font-semibold"
                    style={{
                      color: selectedProject.accent,
                      borderColor: `${selectedProject.accent}40`,
                      backgroundColor: `${selectedProject.accent}15`,
                    }}
                  >
                    {selectedProject.metrics}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">{selectedProject.title}</h3>
                  <p className="text-xs font-mono text-neutral-400 mt-1">{selectedProject.role}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#ff9a3c] mb-2">Executive Overview</h4>
                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#ff9a3c] mb-3">Architectural Highlights & Engineering</h4>
                <div className="space-y-2">
                  {selectedProject.architectureDetails.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded bg-white/5 border border-white/5 text-xs text-neutral-200">
                      <CheckCircle2 size={14} className="text-[#ff9a3c] shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#ff9a3c] mb-2">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.stack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2.5 py-1 rounded bg-white/10 text-xs font-mono text-neutral-200 border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Authored by Sajal Saxena</span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
