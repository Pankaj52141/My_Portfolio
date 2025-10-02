import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Home, User, Briefcase, Code, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'redlab', label: 'Dark Lab', icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'redlab') {
      navigate('/redlab');
      setIsOpen(false);
    } else {
      onNavigate(sectionId);
      // Add delay before closing menu for mobile scroll
      if (window.innerWidth < 768) {
        setTimeout(() => setIsOpen(false), 400);
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/Pankaj_Jaiswal_Resume.pdf';
    link.download = 'Pankaj_Jaiswal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-card backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl font-bold gradient-text">PJ</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-primary-glow bg-primary/10'
                      : 'text-foreground hover:text-primary-glow hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Download CV Button - Desktop */}
          <div className="hidden md:block">
            <Button
              onClick={handleDownloadCV}
              variant="outline"
              className="glass-card-hover border-primary/30 text-primary-glow hover:bg-primary/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="glass-card-hover p-2 rounded-md text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-primary-glow bg-primary/10'
                      : 'text-foreground hover:text-primary-glow hover:bg-white/5'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </motion.button>
              ))}
              
              {/* Mobile Download CV Button */}
              <motion.div className="pt-2 border-t border-white/10">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    onClick={handleDownloadCV}
                    variant="outline"
                    className="w-full glass-card-hover border-primary/30 text-primary-glow hover:bg-primary/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;