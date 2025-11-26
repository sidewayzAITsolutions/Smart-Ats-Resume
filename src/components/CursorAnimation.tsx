'use client';

import React, { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const CursorAnimation: React.FC = () => {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<CursorPosition[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show cursor on desktop (not touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);
    
    // Add class to body to hide default cursor
    document.body.classList.add('cursor-animation-active');
    
    return () => {
      document.body.classList.remove('cursor-animation-active');
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Update trail
      setTrail((prev) => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY }];
        return newTrail.slice(-8); // Keep last 8 positions
      });

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      const isInteractive = Boolean(
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[onclick]') ||
        target.closest('[onClick]') ||
        computedStyle.cursor === 'pointer' ||
        target.classList.contains('cursor-pointer') ||
        target.hasAttribute('href')
      );
      
      setIsHovering(isInteractive);

      // Create particles occasionally
      if (Math.random() > 0.7) {
        createParticles(e.clientX, e.clientY, isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Particle animation loop
    const particleInterval = setInterval(() => {
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16); // ~60fps

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      clearInterval(particleInterval);
    };
  }, []);

  const createParticles = (x: number, y: number, isHovering: boolean) => {
    const newParticles: Particle[] = [];
    const count = isHovering ? 5 : 2;
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 30,
        maxLife: 30,
        size: Math.random() * 3 + 1,
      });
    }
    
    setParticles((prev) => [...prev, ...newParticles].slice(-50)); // Keep max 50 particles
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999] transition-all duration-200 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) ${isHovering ? 'scale(1.5)' : 'scale(1)'}`,
          willChange: 'transform',
        }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isHovering
              ? 'w-4 h-4 bg-gradient-to-br from-teal-400 via-amber-400 to-orange-400 shadow-lg'
              : 'w-3 h-3 bg-gradient-to-br from-teal-500 to-amber-500'
          }`}
          style={{
            boxShadow: isHovering
              ? '0 0 20px rgba(56, 178, 172, 0.8), 0 0 40px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 146, 60, 0.4)'
              : '0 0 10px rgba(56, 178, 172, 0.5), 0 0 20px rgba(251, 191, 36, 0.3)',
          }}
        />
      </div>

      {/* Outer ring */}
      <div
        className="fixed pointer-events-none z-[9998] transition-all duration-300 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: 'translate(-50%, -50%)',
          width: isHovering ? '48px' : '28px',
          height: isHovering ? '48px' : '28px',
          border: `2px solid ${isHovering ? 'rgba(251, 191, 36, 0.6)' : 'rgba(56, 178, 172, 0.4)'}`,
          borderRadius: '50%',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform, width, height',
          boxShadow: isHovering
            ? '0 0 20px rgba(251, 191, 36, 0.4), inset 0 0 20px rgba(56, 178, 172, 0.2)'
            : '0 0 10px rgba(56, 178, 172, 0.2)',
        }}
      />

      {/* Trail dots */}
      {trail.map((pos, index) => {
        const size = Math.max(2, 5 - index * 0.4);
        const opacity = Math.max(0.1, 0.9 - index * 0.12);
        return (
          <div
            key={`trail-${index}`}
            className="fixed pointer-events-none z-[9997] transition-all duration-100 ease-out"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -50%)',
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(56, 178, 172, ${opacity}), rgba(251, 191, 36, ${opacity * 0.7}))`,
              opacity,
              boxShadow: `0 0 ${size * 2}px rgba(56, 178, 172, ${opacity * 0.5})`,
              willChange: 'transform',
            }}
          />
        );
      })}

      {/* Particles */}
      {particles.map((particle) => {
        const opacity = particle.life / particle.maxLife;
        return (
          <div
            key={particle.id}
            className="fixed pointer-events-none z-[9996]"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              transform: 'translate(-50%, -50%)',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(251, 191, 36, ${opacity}), rgba(56, 178, 172, ${opacity * 0.5}))`,
              opacity,
              boxShadow: `0 0 ${particle.size * 2}px rgba(251, 191, 36, ${opacity * 0.5})`,
            }}
          />
        );
      })}

      {/* Glow effect on hover */}
      {isHovering && (
        <>
          <div
            className="fixed pointer-events-none z-[9995] transition-all duration-300"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3), rgba(56, 178, 172, 0.2), transparent 70%)',
              animation: 'pulse-glow 1.5s ease-in-out infinite',
              willChange: 'transform, opacity',
            }}
          />
          <div
            className="fixed pointer-events-none z-[9994] transition-all duration-300"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.15), transparent 60%)',
              animation: 'pulse-glow 2s ease-in-out infinite',
              animationDelay: '0.5s',
              willChange: 'transform, opacity',
            }}
          />
        </>
      )}
    </>
  );
};

export default CursorAnimation;

