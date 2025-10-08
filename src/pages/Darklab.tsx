import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Zap, Eye, Waves, Sparkles, Heart, Star, Flower2, Palette, Camera, Music, Skull, Ghost, Flame } from "lucide-react";

const DarkLab = () => {
  const [activeEffect, setActiveEffect] = useState("aesthetic");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;

    const animate = () => {
      if (!isPlaying) return;
      
      time += 0.01;
      ctx.fillStyle = "rgba(10, 10, 15, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (activeEffect === "spiral") {
        drawHypnoticSpiral(ctx, centerX, centerY, time);
      } else if (activeEffect === "waves") {
        drawPsychedelicWaves(ctx, centerX, centerY, time);
      } else if (activeEffect === "particles") {
        drawParticleField(ctx, centerX, centerY, time);
      } else if (activeEffect === "tunnel") {
        drawTunnel(ctx, centerX, centerY, time);
      } else if (activeEffect === "kaleidoscope") {
        drawKaleidoscope(ctx, centerX, centerY, time);
      } else if (activeEffect === "hearts") {
        drawFloatingHearts(ctx, centerX, centerY, time);
      } else if (activeEffect === "aurora") {
        drawAurora(ctx, centerX, centerY, time);
      } else if (activeEffect === "flowers") {
        drawFloralPattern(ctx, centerX, centerY, time);
      } else if (activeEffect === "aesthetic") {
        drawAestheticVibes(ctx, centerX, centerY, time);
      } else if (activeEffect === "neon") {
        drawNeonCity(ctx, centerX, centerY, time);
      } else if (activeEffect === "dreamy") {
        drawDreamyGradients(ctx, centerX, centerY, time);
      } else if (activeEffect === "horror") {
        drawHorrorScene(ctx, centerX, centerY, time);
      } else if (activeEffect === "blood") {
        drawBloodMoon(ctx, centerX, centerY, time);
      } else if (activeEffect === "shadow") {
        drawShadowRealm(ctx, centerX, centerY, time);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeEffect, isPlaying]);

  const drawHypnoticSpiral = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    for (let i = 0; i < 200; i++) {
      const angle = i * 0.1 + time * 3;
      const radius = i * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const hue = (i * 2 + time * 100) % 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawPsychedelicWaves = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    for (let x = 0; x < ctx.canvas.width; x += 5) {
      for (let y = 0; y < ctx.canvas.height; y += 5) {
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const wave = Math.sin(distance * 0.01 + time * 5) * 127 + 128;
        const hue = (wave + time * 50) % 360;
        
        ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
        ctx.fillRect(x, y, 4, 4);
      }
    }
  };

  const drawParticleField = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.1 + time;
      const radius = 100 + Math.sin(time + i * 0.1) * 200;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const size = Math.sin(time + i * 0.1) * 5 + 5;
      const hue = (i * 10 + time * 100) % 360;
      
      ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  const drawTunnel = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    for (let i = 0; i < 50; i++) {
      const radius = i * 20 + (time * 100) % 1000;
      const hue = (i * 20 + time * 100) % 360;
      
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawKaleidoscope = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 4);
      
      for (let j = 0; j < 20; j++) {
        const x = j * 20;
        const y = Math.sin(time + j * 0.5) * 50;
        const hue = (j * 20 + time * 100) % 360;
        
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  };

  const drawFloatingHearts = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    for (let i = 0; i < 30; i++) {
      const x = centerX + Math.sin(time + i * 0.5) * (100 + i * 10);
      const y = centerY + Math.cos(time + i * 0.3) * (80 + i * 8);
      const size = Math.sin(time + i * 0.2) * 10 + 15;
      
      // Heart colors - pinks, reds, purples
      const colors = ['#ff69b4', '#ff1493', '#dc143c', '#ba55d3', '#ff6347'];
      const color = colors[i % colors.length];
      
      ctx.fillStyle = color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      // Draw heart shape
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 20, size / 20);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10, -10, -20, -5, -10, 5);
      ctx.bezierCurveTo(0, 15, 0, 15, 0, 5);
      ctx.bezierCurveTo(0, 15, 0, 15, 10, 5);
      ctx.bezierCurveTo(20, -5, 10, -10, 0, 0);
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    }
  };

  const drawAurora = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    // Beautiful aurora borealis effect
    for (let i = 0; i < 8; i++) {
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      const colors = [
        ['#00ff87', '#60efff'], // Green to cyan
        ['#ff0080', '#ff8c00'], // Pink to orange  
        ['#8a2be2', '#00bfff'], // Purple to blue
        ['#ff69b4', '#00ff7f'], // Pink to green
      ];
      
      const colorPair = colors[i % colors.length];
      gradient.addColorStop(0, colorPair[0] + '40');
      gradient.addColorStop(1, colorPair[1] + '20');
      
      ctx.fillStyle = gradient;
      
      // Create flowing aurora waves
      ctx.beginPath();
      for (let x = 0; x < ctx.canvas.width; x += 5) {
        const wave1 = Math.sin(x * 0.01 + time + i) * 50;
        const wave2 = Math.sin(x * 0.005 + time * 0.5 + i) * 100;
        const y = centerY + wave1 + wave2 + (i - 4) * 40;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
      ctx.lineTo(0, ctx.canvas.height);
      ctx.fill();
    }
  };

  const drawFloralPattern = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    // Beautiful mandala-like floral patterns
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let ring = 0; ring < 6; ring++) {
      const petals = 8 + ring * 2;
      const radius = 50 + ring * 30;
      
      for (let i = 0; i < petals; i++) {
        const angle = (i * 2 * Math.PI) / petals + time * 0.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + time);
        
        // Flower colors - pastels and vibrant florals
        const flowerColors = ['#ffb6c1', '#ffd1dc', '#e6e6fa', '#f0e68c', '#98fb98', '#ffa07a'];
        const color = flowerColors[ring % flowerColors.length];
        
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        
        // Draw petal
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle effect
        ctx.fillStyle = '#ffffff80';
        ctx.beginPath();
        ctx.arc(0, -10, 2, 0, Math.PI * 2);
        ctx.fill();
        
      }
    }
    ctx.restore();
  };

  const drawAestheticVibes = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    // Modern aesthetic with trendy color palettes
    const aestheticColors = [
      '#ff9a9e', '#fecfef', '#fecfef', // Pink gradient
      '#a8edea', '#fed6e3', '#d299c2', // Mint to pink
      '#ffecd2', '#fcb69f', '#ff8a80', // Peach sunset
      '#667eea', '#764ba2', '#f093fb', // Purple aesthetic
      '#4facfe', '#00f2fe', '#43e97b', // Ocean vibes
    ];

    // Create floating aesthetic elements
    for (let i = 0; i < 50; i++) {
      const angle = (i * 0.1) + time * 0.5;
      const radius = 80 + Math.sin(time + i * 0.1) * 150;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Create gradient circles
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
      const color1 = aestheticColors[i % aestheticColors.length];
      const color2 = aestheticColors[(i + 1) % aestheticColors.length];
      
      gradient.addColorStop(0, color1 + 'AA');
      gradient.addColorStop(1, color2 + '22');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 20 + Math.sin(time + i) * 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Add sparkle overlay
      if (i % 3 === 0) {
        ctx.fillStyle = '#ffffffCC';
        ctx.beginPath();
        ctx.arc(x + 5, y - 5, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawNeonCity = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    // Cyberpunk neon city aesthetic
    const neonColors = ['#ff0080', '#00ffff', '#ff3030', '#8a2be2', '#00ff00', '#ffff00'];
    
    // Background grid (retro vibe)
    ctx.strokeStyle = '#ff008040';
    ctx.lineWidth = 1;
    for (let i = -10; i < 10; i++) {
      const x = centerX + i * 40 + Math.sin(time) * 10;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
      
      const y = centerY + i * 40 + Math.cos(time) * 10;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
    
    // Neon geometric shapes
    for (let i = 0; i < 15; i++) {
      const x = centerX + Math.sin(time + i * 0.5) * 200;
      const y = centerY + Math.cos(time + i * 0.3) * 150;
      const size = 30 + Math.sin(time + i) * 20;
      const color = neonColors[i % neonColors.length];
      
      ctx.strokeStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.lineWidth = 3;
      
      if (i % 3 === 0) {
        // Neon triangles
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size, y + size);
        ctx.lineTo(x + size, y + size);
        ctx.closePath();
        ctx.stroke();
      } else if (i % 3 === 1) {
        // Neon circles
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Neon squares
        ctx.strokeRect(x - size/2, y - size/2, size, size);
      }
      ctx.shadowBlur = 0;
    }
  };

  const drawDreamyGradients = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    // Instagram-worthy dreamy gradient waves
    const dreamyPalettes = [
      ['#ff9a9e', '#fecfef', '#fecfef'], // Sunset pink
      ['#a8edea', '#fed6e3'], // Mint dream
      ['#d299c2', '#fef9d7'], // Purple morning
      ['#89f7fe', '#66a6ff'], // Sky dreams
      ['#fdbb2d', '#22c1c3'], // Golden ocean
      ['#ee9ca7', '#ffdde1'], // Rose gold
    ];
    
    // Create flowing gradient waves
    for (let layer = 0; layer < 6; layer++) {
      const palette = dreamyPalettes[layer % dreamyPalettes.length];
      const gradient = ctx.createLinearGradient(
        0, 0, 
        ctx.canvas.width, ctx.canvas.height
      );
      
      palette.forEach((color, index) => {
        gradient.addColorStop(index / (palette.length - 1), color + '40');
      });
      
      ctx.fillStyle = gradient;
      
      // Create organic wave shapes
      ctx.beginPath();
      for (let x = 0; x <= ctx.canvas.width; x += 10) {
        const wave1 = Math.sin(x * 0.005 + time + layer * 0.5) * 100;
        const wave2 = Math.sin(x * 0.008 + time * 1.2 + layer) * 60;
        const wave3 = Math.sin(x * 0.003 + time * 0.8 + layer * 1.5) * 40;
        
        const y = centerY + wave1 + wave2 + wave3 + (layer - 3) * 50;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Complete the shape
      ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
      ctx.lineTo(0, ctx.canvas.height);
      ctx.closePath();
      ctx.fill();
    }
    
    // Add floating dreamy particles
    for (let i = 0; i < 25; i++) {
      const x = Math.sin(time * 0.5 + i * 0.3) * 300 + centerX;
      const y = Math.cos(time * 0.3 + i * 0.4) * 200 + centerY;
      const size = Math.sin(time + i) * 3 + 5;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      gradient.addColorStop(0, '#ffffff88');
      gradient.addColorStop(1, '#ffffff00');
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawHorrorScene = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    // Creepy horror atmosphere with moving shadows and eyes
    
    // Dark, ominous background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 400);
    gradient.addColorStop(0, '#1a0000');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Creepy glowing eyes
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + time * 0.5;
      const radius = 150 + Math.sin(time + i) * 50;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Eye glow
      const eyeGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
      eyeGradient.addColorStop(0, '#ff0000');
      eyeGradient.addColorStop(0.5, '#ff4444');
      eyeGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = eyeGradient;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye pupil
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Blinking effect
      if (Math.sin(time * 3 + i * 2) > 0.8) {
        ctx.fillStyle = '#220000';
        ctx.fillRect(x - 10, y - 2, 20, 4);
      }
    }
    
    // Moving shadows
    for (let i = 0; i < 15; i++) {
      const x = Math.sin(time * 0.3 + i * 0.5) * 300 + centerX;
      const y = Math.cos(time * 0.2 + i * 0.7) * 200 + centerY;
      
      const shadowGradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
      shadowGradient.addColorStop(0, '#000000AA');
      shadowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.arc(x, y, 30 + Math.sin(time + i) * 10, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Lightning flashes
    if (Math.random() < 0.02) {
      ctx.fillStyle = '#ffffff22';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  const drawBloodMoon = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    // Blood moon with dripping effect
    
    // Dark sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    skyGradient.addColorStop(0, '#000000');
    skyGradient.addColorStop(0.3, '#220000');
    skyGradient.addColorStop(1, '#440000');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Blood moon
    const moonGradient = ctx.createRadialGradient(centerX, centerY - 100, 0, centerX, centerY - 100, 80);
    moonGradient.addColorStop(0, '#ff6666');
    moonGradient.addColorStop(0.7, '#cc0000');
    moonGradient.addColorStop(1, '#660000');
    
    ctx.fillStyle = moonGradient;
    ctx.shadowBlur = 50;
    ctx.shadowColor = '#ff0000';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 100, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Blood drips from moon
    for (let i = 0; i < 8; i++) {
      const x = centerX + (i - 4) * 15 + Math.sin(time + i) * 5;
      const dripLength = 50 + Math.sin(time * 2 + i) * 30;
      
      const dripGradient = ctx.createLinearGradient(x, centerY - 30, x, centerY - 30 + dripLength);
      dripGradient.addColorStop(0, '#cc0000');
      dripGradient.addColorStop(1, '#660000');
      
      ctx.fillStyle = dripGradient;
      ctx.fillRect(x - 2, centerY - 30, 4, dripLength);
      
      // Drip drops
      ctx.fillStyle = '#cc0000';
      ctx.beginPath();
      ctx.arc(x, centerY - 30 + dripLength, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Floating blood particles
    for (let i = 0; i < 20; i++) {
      const x = Math.sin(time * 0.5 + i * 0.3) * 400 + centerX;
      const y = Math.cos(time * 0.3 + i * 0.4) * 300 + centerY;
      const size = Math.sin(time + i) * 2 + 3;
      
      ctx.fillStyle = '#aa0000';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff0000';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  const drawShadowRealm = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
    // Dark realm with ghostly figures and portals
    
    // Deep darkness with subtle purple tint
    const realmGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 500);
    realmGradient.addColorStop(0, '#0a0010');
    realmGradient.addColorStop(1, '#000000');
    ctx.fillStyle = realmGradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Dark portals
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + time * 0.2;
      const x = centerX + Math.cos(angle) * 200;
      const y = centerY + Math.sin(angle) * 150;
      
      // Portal swirl
      for (let j = 0; j < 15; j++) {
        const spiralAngle = j * 0.4 + time * 3;
        const spiralRadius = j * 3;
        const spiralX = x + Math.cos(spiralAngle) * spiralRadius;
        const spiralY = y + Math.sin(spiralAngle) * spiralRadius;
        
        ctx.fillStyle = `hsl(270, 50%, ${20 + j * 2}%)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#6600ff';
        ctx.beginPath();
        ctx.arc(spiralX, spiralY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    
    // Ghostly figures
    for (let i = 0; i < 6; i++) {
      const x = Math.sin(time * 0.2 + i * 1.2) * 250 + centerX;
      const y = Math.cos(time * 0.15 + i * 0.8) * 200 + centerY;
      const opacity = (Math.sin(time + i) + 1) * 0.15;
      
      // Ghost body
      const ghostGradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
      ghostGradient.addColorStop(0, `rgba(200, 200, 255, ${opacity})`);
      ghostGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = ghostGradient;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.fill();
      
      // Ghost trail
      for (let j = 1; j < 8; j++) {
        const trailX = x - Math.sin(time * 0.2 + i * 1.2) * j * 8;
        const trailY = y - Math.cos(time * 0.15 + i * 0.8) * j * 6;
        const trailOpacity = opacity * (1 - j * 0.15);
        
        ctx.fillStyle = `rgba(150, 150, 200, ${trailOpacity})`;
        ctx.beginPath();
        ctx.arc(trailX, trailY, 35 - j * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Eerie floating orbs
    for (let i = 0; i < 12; i++) {
      const x = Math.sin(time * 0.4 + i * 0.5) * 300 + centerX;
      const y = Math.cos(time * 0.3 + i * 0.7) * 250 + centerY;
      const pulse = Math.sin(time * 4 + i) * 0.5 + 0.5;
      
      ctx.fillStyle = `rgba(100, 0, 200, ${pulse * 0.6})`;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#6600cc';
      ctx.beginPath();
      ctx.arc(x, y, 4 + pulse * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  const effects = [
    { id: "aesthetic", name: "Aesthetic Vibes", icon: Palette },
    { id: "dreamy", name: "Dreamy Gradients", icon: Camera },
    { id: "neon", name: "Neon City", icon: Music },
    { id: "horror", name: "Horror Eyes", icon: Skull },
    { id: "blood", name: "Blood Moon", icon: Flame },
    { id: "shadow", name: "Shadow Realm", icon: Ghost },
    { id: "aurora", name: "Aurora Dreams", icon: Star },
    { id: "hearts", name: "Floating Hearts", icon: Heart },
    { id: "flowers", name: "Floral Mandala", icon: Flower2 },
    { id: "spiral", name: "Hypnotic Spiral", icon: Eye },
    { id: "kaleidoscope", name: "Kaleidoscope", icon: Zap },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "radial-gradient(circle, #0a0a0f 0%, #000000 100%)" }}
      />

      {/* Control Panel */}
      <div className="absolute top-6 left-6 z-10">
        <Card className="glass-card p-6 backdrop-blur-xl bg-black/30 border border-white/10">
          <h1 className="text-2xl font-bold gradient-text mb-4 text-center">
            🌀 DARK LAB 🌀
          </h1>
          
          <div className="space-y-3 mb-4">
            {effects.map((effect) => {
              const Icon = effect.icon;
              return (
                <Button
                  key={effect.id}
                  onClick={() => setActiveEffect(effect.id)}
                  variant={activeEffect === effect.id ? "default" : "outline"}
                  className={`w-full justify-start gap-2 ${
                    activeEffect === effect.id 
                      ? "btn-hero" 
                      : "glass-card-hover border-primary/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {effect.name}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-hero flex-1"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-6 right-6 z-10">
        <Card className="glass-card p-4 backdrop-blur-xl bg-black/30 border border-white/10 max-w-xs">
          <h3 className="text-lg font-semibold text-primary mb-2">⚠️ WARNING ⚠️</h3>
          <p className="text-sm text-white/80">
            These effects may cause dizziness or discomfort. 
            Take breaks if needed. Not recommended for those with epilepsy.
          </p>
        </Card>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 text-primary/40 floating">
        <Eye className="w-8 h-8" />
      </div>
      <div className="absolute bottom-20 left-20 text-secondary/40 floating-delayed">
        <Sparkles className="w-10 h-10" />
      </div>

      {/* Secret Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-5">
        <h2 className="text-6xl font-bold text-white">
          ENTER THE VOID
        </h2>
      </div>
    </div>
  );
};

export default DarkLab;
