// src/components/SkillsGrid.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const skills = [
  "React", "TypeScript", "Next.js", "Tailwind CSS", "D3.js",
  "Node.js", "Express.js", "Python", "REST APIs", "GraphQL",
  "MongoDB", "Firebase", "PostgreSQL", "Redis", "SQLite",
  "TensorFlow", "OpenCV", "GPT Integration", "Computer Vision", "Data Analysis",
  "Git/GitHub", "Docker", "Electron", "Vite", "Webpack",
  "Highcharts", "Chart.js", "Framer Motion", "Three.js",
];

const SkillsGrid = () => {
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  const containerRef3 = useRef(null);

  const skillItemWidth = 200;
  const gap = 24;

  const row1Skills = skills.slice(0, 10);
  const row2Skills = skills.slice(10, 20);
  const row3Skills = skills.slice(20, skills.length);

  useEffect(() => {
    const startAnimation = () => {
      const row1Width = (skillItemWidth + gap) * row1Skills.length;
      const row2Width = (skillItemWidth + gap) * row2Skills.length;
      const row3Width = (skillItemWidth + gap) * row3Skills.length;

      // Animate row 1 (right to left)
      controls1.start({
        x: -row1Width,
        transition: {
          x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" },
        },
      });

      // Animate row 2 (right to left)
      controls2.start({
        x: -row2Width,
        transition: {
          x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" },
        },
      });

      // Animate row 3 (right to left)
      controls3.start({
        x: -row3Width,
        transition: {
          x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" },
        },
      });
    };

    if (!isHovered) {
      startAnimation();
    } else {
      controls1.stop();
      controls2.stop();
      controls3.stop();
    }

    return () => {
      controls1.stop();
      controls2.stop();
      controls3.stop();
    };
  }, [controls1, controls2, controls3, isHovered, row1Skills.length, row2Skills.length, row3Skills.length]);

  const renderRow = (skillsToRender, controls, ref) => (
    <motion.div
      ref={ref}
      className="flex flex-nowrap space-x-6"
      animate={controls}
      style={{ x: 0 }}
    >
      {[...skillsToRender, ...skillsToRender].map((skill, index) => (
        <motion.div
          key={index}
          className="flex-shrink-0 w-[200px] flex items-center justify-center px-6 py-3 font-medium rounded-lg backdrop-blur-md bg-white/10 cursor-pointer text-white shadow-xl hover:shadow-2xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {skill}
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <section className="py-20 flex flex-col items-center text-center">
      <h2 className="text-4xl font-bold gradient-text text-shadow-glow tracking-wide mb-12">
        Skillsets
      </h2>
      
      <div 
        className="relative w-full overflow-hidden space-y-4 md:space-y-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderRow(row1Skills, controls1, containerRef1)}
        {renderRow(row2Skills, controls2, containerRef2)}
        {renderRow(row3Skills, controls3, containerRef3)}
      </div>
    </section>
  );
};

export default SkillsGrid;