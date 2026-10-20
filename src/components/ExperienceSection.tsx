import React from 'react';
import { Briefcase, Building2, Calendar, MapPin, CheckCircle, TrendingUp, Cpu, Database } from 'lucide-react';
import { MotionCard3D } from './MotionCard3D';

export const ExperienceSection: React.FC = () => {
  const experiences = [
    {
      company: 'Urban Company',
      role: 'Business Development Associate – Central SBC Quality Team',
      location: 'Ghitorni, New Delhi',
      period: 'Apr 2026 – Present',
      badge: 'Current Role',
      badgeColor: '#ff9a3c',
      impact: 'Tier 1/2 Escalations & SLA Quality Engineering',
      bullets: [
        'Resolve Tier 1 and Tier 2 operational bottlenecks and partner escalations through structured investigation and data-driven root-cause analysis.',
        'Leverage proprietary Jarvis analytics, complex SQL queries, and advanced Excel modeling to continuously monitor service-level agreements (SLAs), compliance metrics, and partner performance.',
        'Sustain and elevate service-cohort operational performance against rigorous Real-Time (RT) Attendance thresholds exceeding 80%.',
        'Spearhead cross-functional coordination for Partner Upgrades Training and participate in cutting-edge AI Handholding pilot initiatives to automate process diagnostics.',
      ],
      skills: ['Jarvis Analytics', 'SQL Queries', 'SLA Monitoring', 'Root-Cause Analysis', 'AI Handholding Pilot', 'Tier 1/2 Escalations'],
    },
    {
      company: 'themrgamer.com',
      role: 'Web Developer',
      location: 'Remote',
      period: 'Jan 2025 – Mar 2025',
      badge: '-30% Latency',
      badgeColor: '#38bdf8',
      impact: 'Gaming Infrastructure & Backend Tuning',
      bullets: [
        'Architected and deployed full-stack modules for an active online gaming platform utilizing React.js, PHP 8, and MySQL.',
        'Designed normalized relational database schemas and indexed critical foreign keys to ensure uninterrupted site reliability and uptime.',
        'Conducted rigorous end-to-end functional testing, bottleneck profiling, and API optimizations, achieving a reported 30% reduction in response latency.',
      ],
      skills: ['React.js', 'PHP 8', 'MySQL', 'cPanel', 'API Optimization', 'Functional Testing'],
    },
    {
      company: 'Feynn Labs',
      role: 'AI / Machine Learning Intern',
      location: 'Remote',
      period: 'Aug 2024 – Oct 2024',
      badge: 'AI & ETL',
      badgeColor: '#10b981',
      impact: 'Data Pipelines & Predictive Modeling',
      bullets: [
        'Formulated and trained machine learning models for predictive classification and pattern recognition using Python, TensorFlow, and Pandas.',
        'Engineered automated ETL (Extract, Transform, Load) data pipelines, applying systematic data preprocessing, cleaning, and outlier pruning.',
        'Established quantitative validation benchmarks and iterative quality checks during model hyperparameter tuning.',
      ],
      skills: ['Python', 'TensorFlow', 'NumPy', 'Pandas', 'ETL Automation', 'Data Preprocessing'],
    },
    {
      company: 'CollegeDesire',
      role: 'Web Developer',
      location: 'Remote',
      period: 'Jan 2024 – Jun 2024',
      badge: '+25% Organic Growth',
      badgeColor: '#f59e0b',
      impact: 'Web Engineering & Technical SEO Optimization',
      bullets: [
        'Developed interactive, user-facing web application modules and administrative dashboards using React.js and PHP/MySQL.',
        'Streamlined legacy SQL queries, reducing database load during high-traffic academic release cycles.',
        'Executed deep technical SEO improvements and semantic schema optimizations correlated with a reported 25% increase in organic site visibility.',
      ],
      skills: ['React.js', 'PHP', 'MySQL', 'Technical SEO', 'Query Tuning', 'Semantic Web'],
    },
  ];

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 bg-[#0d0905] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff9a3c] uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
              <span>02 // Professional Trajectory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              OPERATIONS & ENGINEERING
            </h2>
          </div>
          <p className="text-sm text-neutral-400 font-mono max-w-md">
            From troubleshooting high-stakes service escalations at Urban Company to tuning low-latency APIs and machine learning pipelines.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-8 border-l border-white/15 space-y-12">
          {experiences.map((exp, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Pin */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-[#130e09] transition-transform duration-300 group-hover:scale-125"
                style={{ backgroundColor: exp.badgeColor }}
              />

              {/* 3D Motion Card Container */}
              <MotionCard3D maxTilt={7} depth={20} className="w-full">
                <div className="bg-[#140e09] border border-white/10 group-hover:border-white/25 rounded-xl p-6 sm:p-8 space-y-4 transition-all duration-300 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                          style={{
                            color: exp.badgeColor,
                            backgroundColor: `${exp.badgeColor}18`,
                            border: `1px solid ${exp.badgeColor}35`,
                          }}
                        >
                          {exp.badge}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">{exp.impact}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#ff9a3c] mt-1">
                        <span className="flex items-center gap-1">
                          <Building2 size={13} />
                          <strong>{exp.company}</strong>
                        </span>
                        <span className="text-neutral-500">·</span>
                        <span className="flex items-center gap-1 text-neutral-400">
                          <MapPin size={13} />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-neutral-300 self-start md:self-auto">
                      <Calendar size={13} className="text-[#ff9a3c]" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed pt-2">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c] shrink-0 mt-2" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skills tags */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                    {exp.skills.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono bg-white/5 text-neutral-400 px-2.5 py-1 rounded border border-white/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </MotionCard3D>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
