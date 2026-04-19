import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navLinks, contactInfo } from '../constants';
import { Button } from './ui/Button';
import { useBooking } from '../context/BookingContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const { openBookingModal } = useBooking();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // ScrollSpy logic
      const sections = navLinks.map(link => link.href.substring(1));
      let currentSection = sections[0];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/85 backdrop-blur-md py-4 border-b border-line shadow-sm' 
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        <a href="#home" className="font-display text-xl sm:text-2xl font-bold italic text-primary">
          Daniele Alves.
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-[13px] uppercase tracking-[1px] font-medium transition-colors relative
                    ${activeSection === link.href.substring(1) ? 'text-primary' : 'text-text hover:text-primary'}`}
                >
                  {link.name}
                  {activeSection === link.href.substring(1) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <Button onClick={openBookingModal} size="md">
            Agendar Consulta
          </Button>

          <div className="flex items-center gap-5 border-l border-line pl-6 ml-2">
            <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="text-text hover:text-primary transition-colors">
              <Instagram size={18} />
            </a>
            <button onClick={toggleTheme} className="text-text hover:text-primary transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={toggleTheme} className="text-text hover:text-primary transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="text-text"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-surface shadow-lg border-t border-background md:hidden"
          >
            <ul className="flex flex-col py-4 px-6 gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-[13px] uppercase tracking-[1px] font-medium transition-colors
                      ${activeSection === link.href.substring(1) ? 'text-primary' : 'text-text hover:text-primary'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <Button 
                  onClick={() => {
                     setIsMobileMenuOpen(false);
                     openBookingModal();
                  }}
                  fullWidth 
                  size="md" 
                >
                  Agendar Consulta
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
