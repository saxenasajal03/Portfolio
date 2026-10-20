import React from 'react';
import { Award, Code2, Database, ShieldCheck, Terminal, Cpu, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { MotionCard3D } from './MotionCard3D';

export const SkillsSection: React.FC = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Terminal,
      skills: [
        { name: 'JavaScript (ES6+)', level: 'Advanced' },
        { name: 'TypeScript', level: 'Advanced' },
        { name: 'Python', level: 'Proficient' },
        { name: 'Java', level: 'Proficient' },
        { name: 'PHP 8', level: 'Proficient' },
        { name: 'HTML5 & CSS3', level: 'Expert' },
      ],
    },
    {
      title: 'Frameworks & Real-Time',
      icon: Code2,
      skills: [
        { name: 'React.js', level: 'Expert' },
        { name: 'Node.js & Express', level: 'Advanced' },
        { name: 'Tailwind CSS', level: 'Expert' },
        { name: 'Three.js / WebGL', level: 'Advanced' },
        { name: 'TensorFlow / Keras', level: 'Proficient' },
        { name: 'WebRTC & Socket.io', level: 'Advanced' },
      ],
    },
    {
      title: 'Databases & Analytics',
      icon: Database,
      skills: [
        { name: 'MySQL (Relational)', level: 'Expert' },
        { name: 'MongoDB (NoSQL)', level: 'Advanced' },
        { name: 'Microsoft SQL Server', level: 'Advanced' },
        { name: 'Jarvis Analytics (UC)', level: 'Expert' },
        { name: 'Stored Procedures & Triggers', level: 'Advanced' },
        { name: 'Advanced Excel & Telemetry', level: 'Expert' },
      ],
    },
    {
      title: 'Operations, QA & Methods',
      icon: ShieldCheck,
      skills: [
        { name: 'Tier 1/2 Escalation Management', level: 'Specialist' },
        { name: 'Root-Cause Analysis (RCA)', level: 'Specialist' },
        { name: 'SLA Monitoring & Compliance', level: 'Specialist' },
        { name: 'Functional & API Testing', level: 'Advanced' },
        { name: 'SDLC & Agile / Scrum', level: 'Proficient' },
        { name: 'Cross-Functional Collaboration', level: 'Expert' },
      ],
    },
  ];

  const certifications = [
    {
      title: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
      issuer: 'Oracle University (OCI)',
      year: '2025',
      badge: 'Certified Generative AI',
      desc: 'Mastery over large language model architectures, RAG pipelines, fine-tuning methodologies, and enterprise deployment on Oracle Cloud Infrastructure.',
      accent: '#ff9a3c',
    },
    {
      title: 'Python and SQL Certification',
      issuer: 'HackerRank',
      year: 'Certified',
      badge: 'Verified Assessment',
      desc: 'Demonstrated mastery in complex relational joins, data aggregation, algorithmic problem solving, and Python data structure optimizations.',
      accent: '#38bdf8',
    },
    {
      title: 'Java Certification',
      issuer: 'Infosys & ICT Academy',
      year: 'Certified',
      badge: 'Enterprise Core',
      desc: 'Comprehensive training in Object-Oriented Programming (OOP), multi-threading, JVM memory management, and JDBC database connectivity.',
      accent: '#10b981',
    },
    {
      title: 'ESG Virtual Experience Program',
      issuer: 'Tata Consultancy Services (TCS)',
      year: 'Completed',
      badge: 'TCS Industry',
      desc: 'Corporate governance analysis, operational sustainability compliance frameworks, and corporate ESG metrics.',
      accent: '#a855f7',
    },
    {
      title: 'Finalist – Lakshagriha Hackathon 1.0',
      issuer: 'Dev Bhoomi Uttarakhand University (DBUU)',
      year: 'Finalist',
      badge: 'Hackathon Top Team',
      desc: 'Competed in rapid 36-hour sprint prototyping practical software applications under rigorous judging criteria.',
      accent: '#f59e0b',
    },
    {
      title: 'Flipkart GRiD 6.0 Track Participant',
      issuer: 'Flipkart',
      year: 'Participant',
      badge: 'National Tech Challenge',
      desc: 'Software development track participant tackling large-scale e-commerce algorithmic challenge problems.',
      accent: '#ec4899',
    },
  ];

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 bg-[#0f0a06] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff9a3c] uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
              <span>03 // Technical Matrix & Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              ARSENAL & CERTIFICATIONS
            </h2>
          </div>
          <p className="text-sm text-neutral-400 font-mono max-w-md">
            Rigorous technical foundations spanning web development, distributed relational databases, and enterprise Generative AI engineering.
          </p>
        </div>

        {/* Certifications Spotlight Grid */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#ff9a3c] mb-6 flex items-center gap-2">
            <Award size={15} />
            <span>Honors & Professional Accreditations</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <MotionCard3D key={idx} maxTilt={9} depth={22} className="h-full">
                <div className="bg-[#140e09] border border-white/10 hover:border-white/25 rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-xl transition-all h-full">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold"
                        style={{
                          color: cert.accent,
                          backgroundColor: `${cert.accent}15`,
                          border: `1px solid ${cert.accent}30`,
                        }}
                      >
                        {cert.badge}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">{cert.year}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug mb-1">
                      {cert.title}
                    </h4>
                    <div className="text-xs font-mono text-[#ff9a3c]">{cert.issuer}</div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed mt-3">
                      {cert.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 pt-3 border-t border-white/10">
                    <CheckCircle2 size={13} className="text-[#ff9a3c]" />
                    <span>Credential Verified</span>
                  </div>
                </div>
              </MotionCard3D>
            ))}
          </div>
        </div>

        {/* Technical Domain Matrix */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#ff9a3c] mb-6 flex items-center gap-2">
            <Layers size={15} />
            <span>Core Competencies by Engineering Layer</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <MotionCard3D key={idx} maxTilt={8} depth={18} className="h-full">
                  <div className="bg-[#140e09] border border-white/10 rounded-xl p-5 space-y-4 h-full">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                      <Icon size={16} className="text-[#ff9a3c]" />
                      <h4 className="text-sm font-bold text-white font-mono">{cat.title}</h4>
                    </div>

                    <div className="space-y-2.5">
                      {cat.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-xs font-mono">
                          <span className="text-neutral-200">{skill.name}</span>
                          <span className="text-[10px] text-neutral-500 bg-white/5 px-2 py-0.5 rounded">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionCard3D>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
