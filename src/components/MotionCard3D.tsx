import React, { useRef, useState, useCallback } from 'react';

interface MotionCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  depth?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const MotionCard3D: React.FC<MotionCard3DProps> = ({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
  depth = 30,
  onClick,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1; // -1 to 1
      const normY = (y / rect.height) * 2 - 1; // -1 to 1

      const rotX = -normY * maxTilt;
      const rotY = normX * maxTilt;

      setTransform({
        rotateX: rotX,
        rotateY: rotY,
        glareX: (x / rect.width) * 100,
        glareY: (y / rect.height) * 100,
        glareOpacity: 0.18,
        isHovered: true,
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      isHovered: false,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: transform.isHovered
          ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(1.018, 1.018, 1.018)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        ...style,
      }}
    >
      {/* 3D Depth Content */}
      <div
        className="w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: transform.isHovered ? `translateZ(${depth}px)` : 'translateZ(0px)',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>

      {/* Dynamic Specular Glare Sheen */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden transition-opacity duration-300 z-30"
          style={{
            opacity: transform.glareOpacity,
            background: `radial-gradient(circle 320px at ${transform.glareX}% ${transform.glareY}%, rgba(255, 255, 255, 0.35), transparent 70%)`,
          }}
        />
      )}
    </div>
  );
};
