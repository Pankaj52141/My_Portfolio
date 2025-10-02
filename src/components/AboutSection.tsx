import { motion } from 'framer-motion';
import { Brain, Code, Database, Zap } from 'lucide-react';

const AboutSection = () => {
  const expertise = [
    {
      icon: Code,
      title: "Frontend Development",
      skills: ["React", "Tailwind CSS", "TypeScript", "Next.js"]
    },
    {
      icon: Database,
      title: "Backend & Database",
      skills: ["Node.js", "Firebase", "MongoDB", "Express.js"]
    },
    {
      icon: Brain,
      title: "AI/ML Integration",
      skills: ["TensorFlow", "OpenCV", "GPT Integration", "Computer Vision"]
    },
    {
      icon: Zap,
      title: "Data Visualization",
      skills: ["D3.js", "Highcharts", "Chart.js", "Analytics"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            I'm a passionate Full Stack Developer and AI/ML enthusiast with expertise in creating 
            intelligent applications that solve real-world problems. I specialize in building 
            modern, scalable web applications with cutting-edge technologies.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {expertise.map((area, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card-hover p-6 text-center group"
            >
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <area.icon className="w-8 h-8 text-primary-glow" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {area.title}
              </h3>
              <div className="space-y-1">
                {area.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="inline-block text-sm text-muted-foreground"
                  >
                    {skill}
                    {skillIndex < area.skills.length - 1 && " • "}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="glass-card p-8 md:p-12"
        >
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 gradient-text">
                Featured Projects
              </h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-glow mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">AI E-commerce Platform</strong> - Built with React, Node.js, TensorFlow, and OpenCV for intelligent product recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary-glow mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">Unified Energy Dashboard</strong> - Advanced data visualization using D3.js and Highcharts with Google Sheets integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-glow mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">AI Chatbot</strong> - Next.js application with GPT integration and modern Tailwind CSS design</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative glass-card p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">1+</div>
                  <div className="text-muted-foreground">Years Experience</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-glow">5+</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-glow">30+</div>
                    <div className="text-sm text-muted-foreground">Technologies</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;