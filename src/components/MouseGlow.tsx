import React, { useEffect, useRef } from 'react';

const MouseGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="mouse-glow"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1,
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.15s ease, top 0.15s ease',
      }}
    />
  );
};

export default MouseGlow;
