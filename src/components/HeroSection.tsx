import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onScrollToProjects: () => void;
}

const HeroSection = ({ onScrollToProjects }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gradient-primary opacity-20"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-20 w-60 h-60 rounded-full bg-gradient-secondary opacity-20"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/4 w-40 h-40 rounded-full bg-accent opacity-30"
          animate={{ 
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 relative z-20"
        >
          <div className="w-36 h-36 md:w-48 md:h-48 mx-auto relative group">
            {/* Enhanced glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-60 blur-xl scale-110 group-hover:scale-125 transition-transform duration-500"></div>
            
            {/* Sharp border ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/60 group-hover:border-primary/80 transition-colors duration-300"></div>
            
            {/* Image container with enhanced visibility */}
            <motion.div 
              className="relative w-full h-full rounded-full overflow-hidden"
              whileHover={{ scale: 1.08, rotateY: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img 
                src="/pankaj.png"
                alt="Pankaj Jaiswal - Full Stack Developer"
                className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
              />
              
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 mix-blend-overlay"></div>
            </motion.div>
            
            {/* Floating particles effect */}
            <motion.div 
              className="absolute -inset-4 pointer-events-none"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary/40 rounded-full transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-secondary/40 rounded-full"></div>
              <div className="absolute left-0 top-1/3 w-1 h-1 bg-accent/40 rounded-full"></div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary-glow" />
            <span className="text-sm font-medium">Available for new opportunities</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-tight">
            <span className="gradient-text">Pankaj</span>
            <br />
            <span className="text-foreground">Jaiswal</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Crafting Modern Interfaces & Intelligent Apps
          <br />
          <span className="text-primary-glow">Full Stack Developer</span> • <span className="text-secondary-glow">AI/ML Enthusiast</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onScrollToProjects}
            className="btn-hero relative z-10 group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Projects
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </span>
          </button>
          
          <motion.a
            href="/Pankaj_Jaiswal_Resume.pdf"
            download="Pankaj_Jaiswal_Resume.pdf"
            className="glass-card-hover px-8 py-4 rounded-xl font-semibold text-foreground inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Resume
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;