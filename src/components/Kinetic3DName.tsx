import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../utils/audio';

export const Kinetic3DName: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotX: 0, rotY: 0, shadowX: 0, shadowY: 8 });

  useEffect(() => {
    let animId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      // Normalized coordinates from center (-1 to 1)
      const nx = (clientX / window.innerWidth) * 2 - 1;
      const ny = (clientY / window.innerHeight) * 2 - 1;

      targetX = nx * 20; // Yaw (-20 to 20 deg)
      targetY = -ny * 16; // Pitch (-16 to 16 deg)
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Exponential smooth damping for silky momentum
      const ease = 1 - Math.exp(-8 * dt);
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      setTransform({
        rotX: currentY,
        rotY: currentX,
        shadowX: -currentX * 1.8,
        shadowY: currentY * 1.8 + 10,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  const line1Letters = ['S', 'A', 'J', 'A', 'L'];
  const line2Letters = ['S', 'A', 'X', 'E', 'N', 'A'];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center select-none pt-24 sm:pt-32 md:pt-40 translate-y-6 sm:translate-y-8 md:translate-y-10"
      style={{
        perspective: '1400px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        className="flex flex-col items-center justify-center text-center max-w-[94vw]"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${transform.rotX}deg) rotateY(${transform.rotY}deg)`,
          transition: 'transform 0.04s ease-out',
          willChange: 'transform',
        }}
      >
        {/* Line 1: SAJAL */}
        <div
          className="group pointer-events-auto"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(45px)',
          }}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2.5 md:gap-3.5">
            {line1Letters.map((char, idx) => (
              <span
                key={idx}
                onMouseEnter={() => soundEngine.playTick()}
                className="text-[clamp(52px,11.5vw,142px)] font-black tracking-[-0.035em] leading-[0.88] text-white hover:text-[#ff9a3c] transition-all duration-200 inline-block hover:-translate-y-2 hover:scale-105 active:scale-95 cursor-pointer select-none"
                style={{
                  fontFamily: '"AU Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  textShadow: `${transform.shadowX}px ${transform.shadowY}px 28px rgba(0,0,0,0.9), 0 0 35px rgba(255,154,60,0.22)`,
                  WebkitTextStroke: '0.015em rgba(255,255,255,0.25)',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Line 2: SAXENA */}
        <div
          className="group pointer-events-auto -mt-1 sm:-mt-2 md:-mt-3"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(75px)',
          }}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2.5 md:gap-3.5">
            {line2Letters.map((char, idx) => (
              <span
                key={idx}
                onMouseEnter={() => soundEngine.playTick()}
                className="text-[clamp(52px,11.5vw,142px)] font-black tracking-[-0.035em] leading-[0.88] text-white hover:text-[#ff9a3c] transition-all duration-200 inline-block hover:-translate-y-2 hover:scale-105 active:scale-95 cursor-pointer select-none"
                style={{
                  fontFamily: '"AU Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  textShadow: `${transform.shadowX}px ${transform.shadowY}px 32px rgba(0,0,0,0.92), 0 0 40px rgba(255,154,60,0.28)`,
                  WebkitTextStroke: '0.015em rgba(255,255,255,0.25)',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Line 3: 3D Badge Subtitle */}
        <div
          className="mt-4 sm:mt-6 pointer-events-auto"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(100px)',
          }}
        >
          <div
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-md shadow-2xl hover:border-[#ff9a3c]/60 transition-all duration-300"
            style={{
              boxShadow: `0 12px 30px rgba(0,0,0,0.8), 0 0 25px rgba(255,154,60,0.25)`,
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#ff9a3c] animate-pulse" />
            <span className="text-[11px] sm:text-xs md:text-sm font-mono tracking-widest text-neutral-200 uppercase font-semibold">
              Full-Stack <span className="text-[#ff9a3c]">·</span> AI Systems <span className="text-[#ff9a3c]">·</span> Operations
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-neutral-400 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
              Urban Company BDA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
