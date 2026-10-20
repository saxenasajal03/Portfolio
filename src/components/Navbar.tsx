import React, { useState, useEffect } from 'react';
import { Download, Mail, Menu as MenuIcon, X, Sparkles, User, Briefcase, Code2, GraduationCap, Phone, Linkedin } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  onOpenDossier: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDossier }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Hero 3D', href: '#hero', icon: Sparkles },
    { label: 'Projects', href: '#projects', icon: Code2 },
    { label: 'Experience', href: '#experience', icon: Briefcase },
    { label: 'Skills & AI', href: '#skills', icon: User },
    { label: 'Education', href: '#education', icon: GraduationCap },
    { label: 'Contact', href: '#contact', icon: Mail },
  ];

  const handleLinkClick = (href: string) => {
    soundEngine.playTick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#120d09]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
            : 'bg-gradient-to-b from-[#130e09]/95 via-[#130e09]/75 to-transparent py-4 backdrop-blur-[2px]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#hero');
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded bg-[#ff9a3c] text-[#130e09] font-black flex items-center justify-center font-mono text-sm tracking-tighter shadow-md group-hover:scale-105 transition-transform">
              SS
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-sm sm:text-base block leading-none">
                SAJAL SAXENA
              </span>
              <span className="text-[10px] font-mono text-[#ff9a3c] tracking-widest uppercase block mt-1">
                Urban Company BDA · Full-Stack & AI
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-mono">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="px-3 py-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors uppercase tracking-wider"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/sajal-saxena-cse/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playTick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-[#0077b5]/20 hover:bg-[#0077b5]/35 border border-[#0077b5]/40 text-[#38bdf8] hover:text-white transition-all shadow-sm"
              title="Sajal Saxena on LinkedIn"
            >
              <Linkedin size={13} className="text-[#38bdf8]" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>

            <a
              href="Portfolio/assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Sajal_Saxena_Resume.pdf"
              onClick={() => soundEngine.playTick()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all shadow-sm"
            >
              <Download size={13} className="text-[#ff9a3c]" />
              <span>Resume PDF</span>
            </a>

            <button
              onClick={() => {
                soundEngine.playResonance();
                onOpenDossier();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#ff9a3c] hover:bg-[#ffaa55] text-[#130e09] font-semibold text-xs font-mono transition-all shadow-md active:scale-95"
            >
              <User size={13} />
              <span>Dossier</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col p-6 animate-fadeIn lg:hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff9a3c]" />
              <span className="font-bold text-white tracking-wider font-mono text-sm">
                SAJAL SAXENA PORTFOLIO
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex flex-col gap-3 py-8 text-base font-mono">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white transition-colors text-left"
                >
                  <Icon size={18} className="text-[#ff9a3c]" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto space-y-3 pt-4 border-t border-white/10 font-mono text-xs">
            <a
              href="https://www.linkedin.com/in/sajal-saxena-cse/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#0077b5]/20 text-[#38bdf8] font-medium border border-[#0077b5]/40"
            >
              <Linkedin size={15} />
              <span>Connect on LinkedIn</span>
            </a>
            <a
              href="/Portfolio/assets/resource/SAJAL_SAXENA_RESUME_3b56c39e.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Sajal_Saxena_Resume.pdf"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white/10 text-white font-medium border border-white/10"
            >
              <Download size={15} className="text-[#ff9a3c]" />
              <span>Download Resume PDF</span>
            </a>
            <div className="flex items-center justify-center gap-4 text-neutral-400 pt-2">
              <a href="mailto:sajalsaxenagola@gmail.com" className="hover:text-white flex items-center gap-1">
                <Mail size={13} /> sajalsaxenagola@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
