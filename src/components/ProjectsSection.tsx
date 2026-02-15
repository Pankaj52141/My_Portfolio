import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";

import aiEcommerceImg from "@/assets/ai-ecommerce.jpg";
import energyDashboardImg from "@/assets/energy-dashboard.jpg";
import aiChatbotImg from "@/assets/ai-chatbot.jpg";
import invoiceGeneratorImg from "@/assets/invoice-generator.jpg";
import rideshareImg from "@/assets/rideshare.png";

const projects = [
  {
    title: "E-commerce Platform",
    description:
      "AI-powered e-commerce platform with recommendations, computer vision search, and ML shopping experience.",
    image: aiEcommerceImg,
    tech: ["React", "Node.js", "TensorFlow", "OpenCV", "MongoDB"],
    liveUrl: "https://pink-island.vercel.app/",
    githubUrl: "https://github.com/Pankaj52141/EliteCart",
  },
  {
    title: "Business Manager",
    description:
      "Real-time monitoring dashboard with interactive charts to analyse and manage business.",
    image: energyDashboardImg,
    tech: ["D3.js", "Highcharts", "Google Sheets", "React", "TypeScript"],
    liveUrl: "https://monexaa.vercel.app/",
    githubUrl: "https://github.com/Pankaj52141/Monexa",
  },
  {
    title: "AI Movie Recommender",
    description: "Advanced AI to recommend you best movies.",
    image: aiChatbotImg,
    tech: ["Python", "Hugging Face", "AI", "Hybrid"],
    liveUrl: "https://huggingface.co/spaces/Pankaj52141/AI-movie",
    githubUrl: "https://github.com/Pankaj52141/AI-movie",
  },
  {
    title: "Invoice Manager App",
    description:
      "Web app for generating invoices with PDF/Excel export and SQLite database.",
    image: invoiceGeneratorImg,
    tech: ["React", "SQLite", "PDF Export", "Excel", "Node.js"],
    liveUrl: "https://billmate1.vercel.app/",
    githubUrl: "https://github.com/Pankaj52141/billmate",
  },
  {
    title: "RideShare",
    description:
      "Ride-sharing platform with fare splitting, voice-command booking for PWD/blind users, real-time tracking,payments.",
    image: rideshareImg,
    tech: ["React", "TypeScript", "Stripe", "Voice API", "Accessibility"],
    liveUrl: "https://fj-fe-r2-pankaj-jaiswal-nit-delhi.vercel.app/",
    githubUrl: "https://github.com/Pankaj52141/RideShare",
  },
];

const ProjectsSection = () => {
  const controls = useAnimation();
  const cardWidth = 320; // Tailwind w-80 is 320px
  const gap = 32; // Tailwind space-x-8 is 32px

  useEffect(() => {
    const totalWidth = (cardWidth + gap) * projects.length;
    controls.start({
      x: -totalWidth,
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30, // Adjust duration for speed
          ease: "linear",
        },
      },
    });
  }, [controls, projects.length]);

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Featured <span className="gradient-text">Projects</span>
        </h2>
      </div>

      <div className="relative overflow-hidden w-full h-auto">
        <motion.div
          className="flex flex-nowrap space-x-8"
          animate={controls}
        >
          {/* Duplicate cards to create the infinite loop illusion */}
          {[...projects, ...projects].map((project, index) => (
            <motion.div
              key={index} // Use index here because projects array is duplicated
              className="flex-shrink-0 w-80 md:w-96 rounded-xl overflow-hidden shadow-xl bg-white/10 backdrop-blur-lg border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 md:h-48 object-cover"
              />
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 md:gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-primary text-white py-2 rounded-lg text-sm hover:bg-primary/80 transition"
                    >
                      <ExternalLink className="inline w-4 h-4 mr-1" />
                      Live Demo
                    </a>
                  )}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >
                      <Github className="w-5 h-5 text-gray-700" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;