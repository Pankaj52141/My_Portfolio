import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, AlertTriangle, ArrowLeft, Sparkles, Zap } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const NotAllowed = () => {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);
  const [scrambledText, setScrambledText] = useState("█████ ██████");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [droneAlert, setDroneAlert] = useState(false);
  const droneRef = useRef<HTMLDivElement>(null);

  // Glitch/Scramble animation for "ACCESS DENIED"
  useEffect(() => {
    const targetText = "ACCESS DENIED";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ█▓▒░!@#$%^&*";
    let iterations = 0;
    const maxIterations = 30;

    const interval = setInterval(() => {
      setScrambledText(
        targetText
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iterations += 1 / 3;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setScrambledText(targetText);
      }
    }, 80);

    // Show card with delay
    setTimeout(() => setShowCard(true), 100);

    return () => clearInterval(interval);
  }, []);

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate eye pupil position
  const calculatePupilPosition = (eyeX: number, eyeY: number) => {
    const angle = Math.atan2(cursorPos.y - eyeY, cursorPos.x - eyeX);
    const distance = Math.min(8, Math.hypot(cursorPos.x - eyeX, cursorPos.y - eyeY) / 50);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  // Drone follow cursor
  useEffect(() => {
    if (droneRef.current) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (cursorPos.x - centerX) * 0.05;
      const offsetY = (cursorPos.y - centerY) * 0.05;
      
      droneRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  }, [cursorPos]);

  // Vibration effect on alert
  useEffect(() => {
    if (droneAlert) {
      document.body.classList.add("security-alert-shake");
    } else {
      document.body.classList.remove("security-alert-shake");
    }
    
    return () => {
      document.body.classList.remove("security-alert-shake");
    };
  }, [droneAlert]);

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 text-foreground relative overflow-hidden">
      {/* Dual Image Layout - Split Screen Effect */}
      <div className="absolute inset-0 z-0 flex">
        {/* Left side - wow.jpg with red danger overlay */}
        <div className="w-1/2 relative">
          <img 
            src="/wow.jpg" 
            alt="Access Denied"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/30 via-destructive/50 to-background/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,0,0,0.2),transparent_50%)]"></div>
        </div>
        
        {/* Right side - wow.jpg mirrored with blue tech overlay */}
        <div className="w-1/2 relative">
          <img 
            src="/wow.jpg" 
            alt="Security"
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-primary/30 via-primary/50 to-background/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,100,255,0.2),transparent_50%)]"></div>
        </div>
      </div>

      {/* Animated scan lines */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_48%,rgba(255,255,255,0.03)_50%,transparent_52%)] bg-[length:100%_4px] animate-pulse"></div>
      </div>

      {/* Central glass panel with content */}
      <div className="h-full flex items-center justify-center relative z-10 px-4 py-6">
        <div className="max-w-3xl w-full">
          {/* Glass morphism card with entrance animation */}
          <div 
            className={`backdrop-blur-xl bg-background/15 rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-700 ${
              showCard 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-95"
            }`}
            style={{
              animation: showCard ? "glitch 0.5s ease-in-out 0.5s" : "none",
            }}
          >
            {/* Quantum wave border effects - multiple animated layers */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              {/* Wave 1 - Fast pulse */}
              <div 
                className={`absolute inset-0 rounded-3xl ${droneAlert ? 'quantum-wave-alert-1' : 'quantum-wave-1'}`}
                style={{
                  border: '3px solid',
                  borderImage: droneAlert 
                    ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.5), rgba(239, 68, 68, 0.9)) 1'
                    : 'linear-gradient(90deg, rgba(59, 130, 246, 0.9), rgba(96, 165, 250, 0.5), rgba(59, 130, 246, 0.9)) 1',
                }}
              />
              {/* Wave 2 - Medium pulse (delayed) */}
              <div 
                className={`absolute inset-0 rounded-3xl ${droneAlert ? 'quantum-wave-alert-2' : 'quantum-wave-2'}`}
                style={{
                  border: '3px solid',
                  borderImage: droneAlert
                    ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.7), rgba(220, 38, 38, 0.4), rgba(239, 68, 68, 0.7)) 1'
                    : 'linear-gradient(180deg, rgba(59, 130, 246, 0.7), rgba(96, 165, 250, 0.4), rgba(59, 130, 246, 0.7)) 1',
                }}
              />
              {/* Wave 3 - Slow rotating gradient */}
              <div 
                className={`absolute inset-0 rounded-3xl ${droneAlert ? 'quantum-wave-alert-3' : 'quantum-wave-3'}`}
                style={{
                  border: '4px solid transparent',
                  background: droneAlert
                    ? 'linear-gradient(45deg, rgba(239, 68, 68, 0.6), transparent, rgba(239, 68, 68, 0.6)) border-box'
                    : 'linear-gradient(45deg, rgba(59, 130, 246, 0.6), transparent, rgba(59, 130, 246, 0.6)) border-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              {/* Wave 4 - Opposite rotating gradient */}
              <div 
                className={`absolute inset-0 rounded-3xl ${droneAlert ? 'quantum-wave-alert-4' : 'quantum-wave-4'}`}
                style={{
                  border: '3px solid transparent',
                  background: droneAlert
                    ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.5), transparent, rgba(220, 38, 38, 0.5)) border-box'
                    : 'linear-gradient(135deg, rgba(96, 165, 250, 0.5), transparent, rgba(96, 165, 250, 0.5)) border-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              {/* Wave 5 - Diagonal sweep */}
              <div 
                className={`absolute inset-0 rounded-3xl ${droneAlert ? 'quantum-wave-alert-5' : 'quantum-wave-5'}`}
                style={{
                  border: '2px solid',
                  borderImage: droneAlert
                    ? 'linear-gradient(225deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.3), rgba(239, 68, 68, 0.8)) 1'
                    : 'linear-gradient(225deg, rgba(59, 130, 246, 0.8), rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.8)) 1',
                }}
              />
              {/* Particle trail effect */}
              <div 
                className={`absolute inset-0 rounded-3xl ${droneAlert ? 'particle-trail-alert' : 'particle-trail'}`}
              />
              {/* Energy ripple effect */}
              <div 
                className={`absolute inset-0 rounded-3xl ${droneAlert ? 'energy-ripple-alert' : 'energy-ripple'}`}
              />
            </div>
            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-destructive rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-destructive rounded-br-3xl"></div>

            {/* Glowing orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-destructive/20 blur-3xl animate-pulse delay-700"></div>

            {/* Content */}
            <div className="text-center relative z-10">
              {/* Compact header section */}
              <div className="mb-5">
                {/* Main icon with pulse effect - smaller */}
                <div className="relative mb-4 inline-block">
                  <div className="absolute inset-0 bg-destructive/30 rounded-full blur-xl scale-150 animate-ping"></div>
                  <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-destructive/40 to-primary/40 rounded-full flex items-center justify-center border-4 border-destructive/60 shadow-lg">
                    <Shield className="w-10 h-10 text-destructive animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 text-2xl animate-bounce">🚫</div>
                  <div className="absolute -bottom-1 -left-1 text-xl animate-bounce delay-300">⚠️</div>
                </div>

                {/* Main heading - compact with scramble effect */}
                <h1 
                  className="text-4xl md:text-5xl font-black gradient-text mb-2 tracking-tight leading-tight font-mono"
                  style={{
                    textShadow: "0 0 10px rgba(var(--primary-rgb), 0.5)",
                  }}
                >
                  {scrambledText}
                </h1>
                <div className="flex items-center justify-center gap-2 text-base md:text-lg font-bold text-destructive">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="animate-pulse">🧙‍♂️ You Shall Not Pass!</span>
                  <Zap className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              {/* Animated Eyes watching cursor */}
              <div className="flex justify-center gap-8 mb-5">
                <div className="relative">
                  <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center border-2 border-primary/40">
                    <div 
                      className="w-5 h-5 bg-destructive rounded-full transition-transform duration-100"
                      style={{
                        transform: `translate(${calculatePupilPosition(window.innerWidth / 2 - 30, window.innerHeight / 2).x}px, ${calculatePupilPosition(window.innerWidth / 2 - 30, window.innerHeight / 2).y}px)`,
                      }}
                    />
                  </div>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center border-2 border-primary/40">
                    <div 
                      className="w-5 h-5 bg-destructive rounded-full transition-transform duration-100"
                      style={{
                        transform: `translate(${calculatePupilPosition(window.innerWidth / 2 + 30, window.innerHeight / 2).x}px, ${calculatePupilPosition(window.innerWidth / 2 + 30, window.innerHeight / 2).y}px)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Message box - more compact */}
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-primary/20 to-destructive/20 rounded-xl blur-lg"></div>
                <div className="relative p-4 rounded-xl bg-background/50 border-2 border-primary/40">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0 animate-pulse" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-destructive mb-1">🚨 Security Alert!</p>
                      <p className="text-foreground/90 text-xs md:text-sm leading-snug">
                        This is the <span className="text-primary font-bold">Dark Lab</span> – protected by ancient magic & modern encryption! 🔮✨ Only Level Gandalf+ wizards may enter! 🛡️
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security badges - horizontal layout */}
              <div className="flex justify-center gap-3 mb-5">
                <div className="group flex-1 max-w-[140px] p-3 rounded-xl bg-gradient-to-br from-primary/30 to-transparent border-2 border-primary/40 hover:scale-110 hover:shadow-xl hover:shadow-primary/60 transition-all cursor-pointer">
                  <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">🔐</div>
                  <Sparkles className="w-5 h-5 text-primary mx-auto mb-0.5" />
                  <p className="text-xs font-bold text-primary">Encrypted</p>
                </div>
                <div className="group flex-1 max-w-[140px] p-3 rounded-xl bg-gradient-to-br from-destructive/30 to-transparent border-2 border-destructive/40 hover:scale-110 hover:shadow-xl hover:shadow-destructive/60 transition-all cursor-pointer">
                  <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">🛡️</div>
                  <Shield className="w-5 h-5 text-destructive mx-auto mb-0.5" />
                  <p className="text-xs font-bold text-destructive">Protected</p>
                </div>
                <div className="group flex-1 max-w-[140px] p-3 rounded-xl bg-gradient-to-br from-accent/30 to-transparent border-2 border-accent/40 hover:scale-110 hover:shadow-xl hover:shadow-accent/60 transition-all cursor-pointer">
                  <div className="text-4xl mb-1 group-hover:scale-110 transition-transform">🔑</div>
                  <Lock className="w-5 h-5 text-accent mx-auto mb-0.5" />
                  <p className="text-xs font-bold text-accent">Locked</p>
                </div>
              </div>

              {/* Action button - compact */}
              <Button 
                onClick={() => navigate('/')} 
                onMouseEnter={() => setDroneAlert(true)}
                onMouseLeave={() => setDroneAlert(false)}
                className="btn-hero px-6 py-5 flex items-center gap-2 mx-auto group hover:scale-105 transition-all shadow-xl"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Return to Safety</span>
                <span className="text-lg">🏠</span>
              </Button>

              {/* Footer quote - smaller */}
              <p className="text-xs text-muted-foreground mt-4 italic opacity-60">
                "With great power comes great passwords!" 🦸‍♂️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[8%] text-3xl opacity-40 floating">🔒</div>
        <div className="absolute top-[25%] right-[12%] text-4xl opacity-50 floating-delayed">🛡️</div>
        <div className="absolute bottom-[25%] left-[15%] text-3xl opacity-40 floating">⚡</div>
        <div className="absolute bottom-[35%] right-[8%] text-3xl opacity-45 floating-delayed">👁️</div>
        <div className="absolute top-[50%] left-[5%] text-2xl opacity-35 floating">🔐</div>
        <div className="absolute top-[70%] right-[20%] text-3xl opacity-40 floating-delayed">🔮</div>
      </div>

      {/* AI Security Drone */}
      <div 
        ref={droneRef}
        className="absolute top-[10%] right-[10%] z-[3] pointer-events-none transition-transform duration-300 ease-out"
      >
        <div className="relative">
          {/* Drone body */}
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-destructive/40 to-primary/40 border-2 ${droneAlert ? 'border-destructive' : 'border-primary/60'} flex items-center justify-center shadow-lg backdrop-blur-sm`}>
            {/* Eye/Lens */}
            <div className="relative w-10 h-10 rounded-full bg-background/80 flex items-center justify-center">
              <div 
                className={`w-6 h-6 rounded-full transition-all duration-200 ${droneAlert ? 'bg-destructive animate-ping' : 'bg-primary/60'}`}
              />
              {/* Pupil following cursor */}
              <div 
                className="absolute w-3 h-3 bg-destructive rounded-full transition-transform duration-100"
                style={{
                  transform: `translate(${calculatePupilPosition(window.innerWidth * 0.9, window.innerHeight * 0.1).x}px, ${calculatePupilPosition(window.innerWidth * 0.9, window.innerHeight * 0.1).y}px)`,
                }}
              />
            </div>
          </div>
          
          {/* Scanning ring */}
          <div className={`absolute inset-0 rounded-full border-2 ${droneAlert ? 'border-destructive' : 'border-primary/40'} animate-ping`} />
          
          {/* Alert light */}
          {droneAlert && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse shadow-lg shadow-destructive/50" />
          )}
          
          {/* Drone propellers */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-primary/60 rounded-full animate-spin" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-primary/60 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
        
        {/* Alert text */}
        {droneAlert && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <p className="text-xs font-mono text-destructive font-bold animate-pulse">⚠️ ALERT ⚠️</p>
          </div>
        )}
      </div>

      {/* Glitch animation styles */}
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          10% { transform: translate(-3px, 3px); }
          20% { transform: translate(-3px, -3px); }
          30% { transform: translate(3px, 3px); }
          40% { transform: translate(3px, -3px); }
          50% { transform: translate(-2px, 2px); }
          60% { transform: translate(2px, -2px); }
          70% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
          90% { transform: translate(-1px, 1px); }
          100% { transform: translate(0); }
        }

        @keyframes quantumPulse1 {
          0%, 100% {
            box-shadow: 
              0 0 30px rgba(59, 130, 246, 0.7),
              0 0 60px rgba(59, 130, 246, 0.5),
              inset 0 0 30px rgba(59, 130, 246, 0.4);
            filter: brightness(1.1);
          }
          50% {
            box-shadow: 
              0 0 60px rgba(59, 130, 246, 1),
              0 0 120px rgba(59, 130, 246, 0.8),
              0 0 180px rgba(59, 130, 246, 0.6),
              inset 0 0 60px rgba(59, 130, 246, 0.6);
            filter: brightness(1.5);
          }
        }

        @keyframes quantumPulse2 {
          0%, 100% {
            box-shadow: 
              0 0 25px rgba(96, 165, 250, 0.6),
              0 0 50px rgba(96, 165, 250, 0.4);
            filter: brightness(1.1);
          }
          50% {
            box-shadow: 
              0 0 50px rgba(96, 165, 250, 0.9),
              0 0 100px rgba(96, 165, 250, 0.7),
              0 0 150px rgba(96, 165, 250, 0.5);
            filter: brightness(1.4);
          }
        }

        @keyframes quantumRotate {
          0% { 
            transform: rotate(0deg);
            filter: hue-rotate(0deg) brightness(1.1);
          }
          100% { 
            transform: rotate(360deg);
            filter: hue-rotate(40deg) brightness(1.3);
          }
        }

        @keyframes quantumRotateReverse {
          0% { 
            transform: rotate(360deg);
            filter: hue-rotate(0deg) brightness(1.1);
          }
          100% { 
            transform: rotate(0deg);
            filter: hue-rotate(-40deg) brightness(1.3);
          }
        }

        @keyframes diagonalSweep {
          0%, 100% {
            box-shadow: 
              0 0 20px rgba(59, 130, 246, 0.6),
              30px -30px 40px rgba(59, 130, 246, 0.4);
            filter: brightness(1);
          }
          50% {
            box-shadow: 
              0 0 40px rgba(59, 130, 246, 0.8),
              -30px 30px 80px rgba(59, 130, 246, 0.6);
            filter: brightness(1.3);
          }
        }

        @keyframes particleFlow {
          0% {
            box-shadow: 
              0 0 15px rgba(59, 130, 246, 0.9),
              30px 0 25px rgba(59, 130, 246, 0.7),
              -30px 0 25px rgba(59, 130, 246, 0.7);
          }
          25% {
            box-shadow: 
              0 0 15px rgba(59, 130, 246, 0.9),
              0 30px 25px rgba(59, 130, 246, 0.7),
              0 -30px 25px rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 
              0 0 15px rgba(59, 130, 246, 0.9),
              -30px 0 25px rgba(59, 130, 246, 0.7),
              30px 0 25px rgba(59, 130, 246, 0.7);
          }
          75% {
            box-shadow: 
              0 0 15px rgba(59, 130, 246, 0.9),
              0 -30px 25px rgba(59, 130, 246, 0.7),
              0 30px 25px rgba(59, 130, 246, 0.7);
          }
          100% {
            box-shadow: 
              0 0 15px rgba(59, 130, 246, 0.9),
              30px 0 25px rgba(59, 130, 246, 0.7),
              -30px 0 25px rgba(59, 130, 246, 0.7);
          }
        }

        @keyframes energyRipple {
          0% {
            box-shadow: 
              0 0 10px rgba(59, 130, 246, 0.8),
              inset 0 0 20px rgba(59, 130, 246, 0.4);
            opacity: 1;
          }
          50% {
            box-shadow: 
              0 0 50px rgba(59, 130, 246, 0.9),
              0 0 100px rgba(59, 130, 246, 0.6),
              inset 0 0 50px rgba(59, 130, 246, 0.5);
            opacity: 0.7;
          }
          100% {
            box-shadow: 
              0 0 10px rgba(59, 130, 246, 0.8),
              inset 0 0 20px rgba(59, 130, 246, 0.4);
            opacity: 1;
          }
        }

        @keyframes quantumPulseAlert1 {
          0%, 100% {
            box-shadow: 
              0 0 40px rgba(239, 68, 68, 0.9),
              0 0 80px rgba(239, 68, 68, 0.7),
              inset 0 0 40px rgba(239, 68, 68, 0.5);
            filter: brightness(1.3);
          }
          50% {
            box-shadow: 
              0 0 80px rgba(239, 68, 68, 1),
              0 0 160px rgba(239, 68, 68, 0.9),
              0 0 240px rgba(239, 68, 68, 0.7),
              inset 0 0 80px rgba(239, 68, 68, 0.7);
            filter: brightness(1.7);
          }
        }

        @keyframes quantumPulseAlert2 {
          0%, 100% {
            box-shadow: 
              0 0 35px rgba(220, 38, 38, 0.8),
              0 0 70px rgba(220, 38, 38, 0.6);
            filter: brightness(1.3);
          }
          50% {
            box-shadow: 
              0 0 70px rgba(220, 38, 38, 1),
              0 0 140px rgba(220, 38, 38, 0.9),
              0 0 200px rgba(220, 38, 38, 0.7);
            filter: brightness(1.6);
          }
        }

        @keyframes diagonalSweepAlert {
          0%, 100% {
            box-shadow: 
              0 0 30px rgba(239, 68, 68, 0.8),
              40px -40px 60px rgba(239, 68, 68, 0.6);
            filter: brightness(1.2);
          }
          50% {
            box-shadow: 
              0 0 60px rgba(239, 68, 68, 1),
              -40px 40px 120px rgba(239, 68, 68, 0.8);
            filter: brightness(1.5);
          }
        }

        @keyframes particleFlowAlert {
          0% {
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 1),
              40px 0 35px rgba(239, 68, 68, 0.9),
              -40px 0 35px rgba(239, 68, 68, 0.9);
          }
          25% {
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 1),
              0 40px 35px rgba(239, 68, 68, 0.9),
              0 -40px 35px rgba(239, 68, 68, 0.9);
          }
          50% {
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 1),
              -40px 0 35px rgba(239, 68, 68, 0.9),
              40px 0 35px rgba(239, 68, 68, 0.9);
          }
          75% {
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 1),
              0 -40px 35px rgba(239, 68, 68, 0.9),
              0 40px 35px rgba(239, 68, 68, 0.9);
          }
          100% {
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 1),
              40px 0 35px rgba(239, 68, 68, 0.9),
              -40px 0 35px rgba(239, 68, 68, 0.9);
          }
        }

        @keyframes energyRippleAlert {
          0% {
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 1),
              inset 0 0 30px rgba(239, 68, 68, 0.6);
            opacity: 1;
          }
          50% {
            box-shadow: 
              0 0 80px rgba(239, 68, 68, 1),
              0 0 160px rgba(239, 68, 68, 0.8),
              inset 0 0 80px rgba(239, 68, 68, 0.7);
            opacity: 0.7;
          }
          100% {
            box-shadow: 
              0 0 20px rgba(239, 68, 68, 1),
              inset 0 0 30px rgba(239, 68, 68, 0.6);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-2px, -2px) rotate(-0.5deg); }
          20% { transform: translate(2px, -2px) rotate(0.5deg); }
          30% { transform: translate(-2px, 2px) rotate(-0.5deg); }
          40% { transform: translate(2px, 2px) rotate(0.5deg); }
          50% { transform: translate(-2px, -2px) rotate(-0.5deg); }
          60% { transform: translate(2px, -2px) rotate(0.5deg); }
          70% { transform: translate(-2px, 2px) rotate(-0.5deg); }
          80% { transform: translate(2px, 2px) rotate(0.5deg); }
          90% { transform: translate(-1px, -1px) rotate(-0.3deg); }
        }

        .quantum-wave-1 {
          animation: quantumPulse1 1.5s ease-in-out infinite;
        }

        .quantum-wave-2 {
          animation: quantumPulse2 2s ease-in-out infinite 0.3s;
        }

        .quantum-wave-3 {
          animation: quantumRotate 8s linear infinite;
        }

        .quantum-wave-4 {
          animation: quantumRotateReverse 6s linear infinite;
        }

        .quantum-wave-5 {
          animation: diagonalSweep 2.5s ease-in-out infinite 0.5s;
        }

        .particle-trail {
          animation: particleFlow 3s ease-in-out infinite;
        }

        .energy-ripple {
          animation: energyRipple 2.8s ease-in-out infinite 0.7s;
        }

        .quantum-wave-alert-1 {
          animation: quantumPulseAlert1 0.4s ease-in-out infinite;
        }

        .quantum-wave-alert-2 {
          animation: quantumPulseAlert2 0.5s ease-in-out infinite 0.1s;
        }

        .quantum-wave-alert-3 {
          animation: quantumRotate 2s linear infinite;
        }

        .quantum-wave-alert-4 {
          animation: quantumRotateReverse 1.5s linear infinite;
        }

        .quantum-wave-alert-5 {
          animation: diagonalSweepAlert 0.6s ease-in-out infinite 0.1s;
        }

        .particle-trail-alert {
          animation: particleFlowAlert 0.8s ease-in-out infinite;
        }

        .energy-ripple-alert {
          animation: energyRippleAlert 0.7s ease-in-out infinite 0.2s;
        }

        .security-alert-shake {
          animation: shake 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotAllowed;
