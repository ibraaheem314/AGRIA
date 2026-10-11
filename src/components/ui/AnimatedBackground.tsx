import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Fade in and out
        const lifeCycle = this.life / this.maxLife;
        if (lifeCycle < 0.1) {
          this.opacity = lifeCycle * 10 * 0.3;
        } else if (lifeCycle > 0.9) {
          this.opacity = (1 - lifeCycle) * 10 * 0.3;
        }

        // Reset particle when it goes off screen or dies
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life >= this.maxLife) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = 0;
          this.maxLife = Math.random() * 200 + 100;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#10b981'; // Green color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connecting lines between nearby particles
      particles.forEach((particle, index) => {
        for (let j = index + 1; j < particles.length; j++) {
          const other = particles[j];
          const distance = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          );

          if (distance < 100) {
            ctx.save();
            ctx.strokeStyle = '#10b981';
            ctx.globalAlpha = (1 - distance / 100) * 0.1;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Canvas pour les particules */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Formes géométriques statiques animées */}
      <div className="absolute inset-0">
        {/* Cercles flottants */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-green-200/20 rounded-full"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Lignes ondulantes */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={i}
              d={`M0,${200 + i * 150} Q400,${150 + i * 150} 800,${200 + i * 150} T1600,${200 + i * 150}`}
              stroke="url(#waveGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        {/* Gradient overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
        
        {/* Points lumineux */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/60 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground; 