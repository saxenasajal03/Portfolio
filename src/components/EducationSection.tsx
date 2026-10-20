import React from 'react';
import { GraduationCap, BookOpen, Award, CheckCircle } from 'lucide-react';
import { MotionCard3D } from './MotionCard3D';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="relative py-24 px-4 sm:px-6 bg-[#0d0905] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff9a3c] uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
              <span>04 // Academic Foundation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              EDUCATION & LEADERSHIP
            </h2>
          </div>
          <p className="text-sm text-neutral-400 font-mono max-w-md">
            Formal Computer Science engineering training combined with university leadership and UGC educational initiatives.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Degree */}
          <MotionCard3D maxTilt={7} depth={20} className="md:col-span-2 h-full">
            <div className="bg-[#140e09] border border-white/10 hover:border-white/20 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold text-[#ff9a3c] bg-[#ff9a3c]/15 border border-[#ff9a3c]/30">
                Undergraduate Degree
              </span>
              <span className="text-xs font-mono text-neutral-400">2021 – 2025</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <GraduationCap size={22} className="text-[#ff9a3c]" />
                Bachelor of Technology (B.Tech.)
              </h3>
              <p className="text-sm font-mono text-[#ff9a3c]">
                Computer Science and Engineering
              </p>
              <p className="text-xs font-mono text-neutral-400">
                Dev Bhoomi Uttarakhand University, Dehradun
              </p>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed pt-2">
              Comprehensive coursework covering Data Structures & Algorithms, Object-Oriented System Design, Database Management Systems (DBMS), Operating Systems, Computer Networks, and Artificial Intelligence.
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-neutral-300">
                Data Structures & Algorithms
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-neutral-300">
                Relational DB Systems
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-neutral-300">
                Artificial Intelligence
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-neutral-300">
                Distributed Software Design
              </span>
            </div>
            </div>
          </MotionCard3D>

          {/* Schooling & UGC Leadership */}
          <div className="space-y-6">
            <MotionCard3D maxTilt={8} depth={18} className="w-full">
              <div className="bg-[#140e09] border border-white/10 rounded-xl p-6 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#ff9a3c] font-semibold">Higher Secondary</span>
                  <span className="text-neutral-500">CBSE</span>
                </div>
                <h4 className="text-base font-bold text-white">Class XII & Class X (Science, PCM)</h4>
                <p className="text-xs text-neutral-400 font-mono">
                  Children’s Academy Senior Secondary School, Gola
                </p>
                <div className="text-[11px] font-mono text-neutral-500 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span>Class XII: 2019 – 2020</span>
                  <span>Class X: 2017 – 2018</span>
                </div>
              </div>
            </MotionCard3D>

            <MotionCard3D maxTilt={8} depth={18} className="w-full">
              <div className="bg-[#140e09] border border-white/10 rounded-xl p-6 space-y-2 shadow-xl">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ff9a3c]">
                  <Award size={14} />
                  <span>UGC Initiative</span>
                </div>
                <h4 className="text-base font-bold text-white">NEP Saarthi</h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Appointed student ambassador for the University Grants Commission (UGC) National Education Policy implementation, facilitating student awareness and modern educational reforms.
                </p>
              </div>
            </MotionCard3D>
          </div>
        </div>
      </div>
    </section>
  );
};
