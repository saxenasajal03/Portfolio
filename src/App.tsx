/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { removeStudioBackground, ProcessedImageResult } from './utils/backgroundRemoval';
import { Sajal3DCanvas, DisplayMode } from './components/Sajal3DCanvas';
import { ProfileDossier } from './components/ProfileDossier';
import { Navbar } from './components/Navbar';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { SmartBot } from './components/SmartBot';
import { Kinetic3DName } from './components/Kinetic3DName';
import { soundEngine } from './utils/audio';
import { ArrowDown, ChevronRight } from 'lucide-react';

export default function App() {
  const [processedImage, setProcessedImage] = useState<ProcessedImageResult | null>(null);
  const [displayMode] = useState<DisplayMode>('studio');
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Entrance animation controller
  useEffect(() => {
    const rootEl = document.documentElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      rootEl.classList.add('is-entering');
      rootEl.style.setProperty('--au-state', 'paused');

      const startTimer = setTimeout(() => {
        rootEl.classList.add('is-playing');
        rootEl.style.setProperty('--au-state', 'running');
      }, 150);

      const cleanupTimer = setTimeout(() => {
        rootEl.classList.remove('is-entering', 'is-playing');
      }, 3500);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(cleanupTimer);
      };
    }
  }, []);

  // Track window scroll progress for top indicator bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Process user photo: remove studio neutral grey background & prepare transparent texture
  useEffect(() => {
    let isCancelled = false;
    const photoUrl = '/assets/resource/image_18e25f87.png';

    removeStudioBackground(photoUrl, { tolerance: 38, feather: 2 })
      .then((res) => {
        if (!isCancelled) {
          setProcessedImage(res);
        }
      })
      .catch((err) => {
        console.warn('Background removal fallback to direct image:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Keyboard shortcut: D for Dossier, M for mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'd' || e.key === 'D') {
        setIsDossierOpen((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        soundEngine.toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    soundEngine.playTick();
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#130e09] text-white">
      {/* Top Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-[#ff9a3c] via-[#ffc078] to-[#ff9a3c] z-50 transition-all duration-150 pointer-events-none shadow-[0_0_8px_rgba(255,154,60,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Navigation Bar (Single unified, no overlapping header) */}
      <Navbar onOpenDossier={() => setIsDossierOpen(true)} />

      {/* Hero Section: 3D Motion Canvas & Kinetic Identity */}
      <section id="hero" className="hero select-none overflow-hidden relative w-full h-[100vh] h-[100dvh]">
        {/* 48 Hairline Columns Grid */}
        <div className="hero__grid" aria-hidden="true">
          {Array.from({ length: 48 }).map((_, i) => (
            <i key={i} />
          ))}
        </div>


        {/* Interactive 3D Motion Object: Sajal Saxena */}
        <Sajal3DCanvas
          processedImage={processedImage}
          displayMode={displayMode}
          explodedOffset={0}
          autoRotate={false}
          rotationSpeed={0.8}
          glowIntensity={1.2}
          onObjectClick={() => {
            soundEngine.playResonance();
            setIsDossierOpen(true);
          }}
        />

        {/* Hero Quick-Jump Strip to Visit Different Sections */}
        <ul className="services small" aria-label="Portfolio Sections">
          <li>
            <button
              onClick={() => scrollToSection('#projects')}
              className="rv text-neutral-300 hover:text-[#ff9a3c] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 hover:border-[#ff9a3c]/50 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9a3c]" />
              <span>01. Projects & ERP</span>
              <ChevronRight size={13} className="text-[#ff9a3c]" />
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('#experience')}
              className="rv text-neutral-300 hover:text-[#ff9a3c] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 hover:border-[#ff9a3c]/50 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              <span>02. Urban Company Experience</span>
              <ChevronRight size={13} className="text-[#38bdf8]" />
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('#skills')}
              className="rv text-neutral-300 hover:text-[#ff9a3c] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 hover:border-[#ff9a3c]/50 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span>03. Skills & GenAI Certs</span>
              <ChevronRight size={13} className="text-[#10b981]" />
            </button>
          </li>
        </ul>

        {/* Hairline Rule */}
        <div className="rule" aria-hidden="true" />

        {/* Interactive 3D Motion Name for Sajal Saxena */}
        <Kinetic3DName />

        {/* Scroll Down Guide Button */}
        <button
          onClick={() => scrollToSection('#projects')}
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 border border-white/15 text-neutral-300 hover:text-white hover:bg-black/90 hover:border-[#ff9a3c] transition-all text-xs font-mono shadow-2xl group active:scale-95"
        >
          <span>Explore All Sections</span>
          <ArrowDown size={14} className="text-[#ff9a3c] group-hover:translate-y-1 transition-transform" />
        </button>
      </section>

      {/* Section 01: Projects */}
      <ProjectsSection />

      {/* Section 02: Experience */}
      <ExperienceSection />

      {/* Section 03: Skills & Certifications */}
      <SkillsSection />

      {/* Section 04: Education */}
      <EducationSection />

      {/* Section 05: Contact & Resume */}
      <ContactSection />

      {/* Interactive Dossier Modal */}
      <ProfileDossier
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        cutoutDataUrl={processedImage?.dataUrl}
      />

      {/* Smart AI Bot Floating in Bottom */}
      <SmartBot />
    </div>
  );
}
