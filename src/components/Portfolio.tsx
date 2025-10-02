import { useRef } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

const Portfolio = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleNavigation = (section: string) => {
    const refs = {
      home: heroRef,
      about: aboutRef,
      projects: projectsRef,
      skills: skillsRef,
      contact: contactRef,
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen dark">
      <Navbar onNavigate={handleNavigation} />
      <div ref={heroRef}>
        <HeroSection onScrollToProjects={scrollToProjects} />
      </div>
      <div ref={aboutRef}>
        <AboutSection />
      </div>
      <div ref={projectsRef}>
        <ProjectsSection />
      </div>
      <div ref={skillsRef}>
        <SkillsSection />
      </div>
      <div ref={contactRef}>
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Portfolio;