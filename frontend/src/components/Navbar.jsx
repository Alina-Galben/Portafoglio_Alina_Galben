import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Briefcase, 
  BookOpen, 
  Lightbulb, 
  Settings, 
  Award, 
  BarChart3, 
  Mail 
} from 'lucide-react';
import NavLink from './NavLink';
import useDeviceOptimization from '../hooks/useDeviceOptimization';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isMobile } = useDeviceOptimization();

  // DEBUG
  console.log('📱 Navbar render:', {
    isMobile,
    clientWidth: document.documentElement.clientWidth,
    innerWidth: window.innerWidth
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change or when switching between mobile/desktop
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, isMobile]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isMenuOpen]);

  // Navigation items with icons
  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'Chi Sono', icon: User },
    { path: '/projects', label: 'Progetti', icon: Briefcase },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/services', label: 'Servizi', icon: Lightbulb },
    { path: '/skills', label: 'Competenze', icon: Settings },
    { path: '/certifications', label: 'Certificazioni', icon: Award },
    { path: '/statistics', label: 'Statistiche', icon: BarChart3 },
    { path: '/contact', label: 'Contattami', icon: Mail },
  ];

  // Animation variants per desktop
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut' 
      }
    }
  };

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 0.6,
        ease: 'easeOut'
      }
    },
    hover: { 
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  // Animation variants per mobile (più leggere)
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const mobileLogoVariants = {
    initial: { scale: 0.8 },
    animate: { 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  if (isMobile) {
    // Versione MOBILE con animazioni leggere
    return (
      <div data-testid="mobile-navbar">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`fixed top-0 left-0 right-0 z-9999 transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-md shadow-lg' 
              : 'bg-linear-to-r from-violet-600 via-purple-700 to-indigo-800'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo Mobile con animazione */}
              <motion.div
                variants={mobileLogoVariants}
                initial="initial"
                animate="animate"
              >
                <Link
                  to="/"
                  className="flex items-center space-x-2 group"
                  aria-label="Torna alla homepage"
                >
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center ${
                      isScrolled 
                        ? 'bg-linear-to-br from-violet-600 to-purple-700' 
                        : 'bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <span className="font-bold text-lg text-white">AG</span>
                  </motion.div>
                  <div className="flex flex-col">
                    <h1 className={`text-base font-bold transition-colors duration-300 ${
                      isScrolled ? 'text-gray-900' : 'text-white'
                    }`}>
                      Alina Galben
                    </h1>
                    <p className={`text-xs font-medium transition-colors duration-300 ${
                      isScrolled ? 'text-violet-600' : 'text-yellow-200'
                    }`}>
                      Full-Stack Developer
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Mobile Menu Button con animazione - FIXED per stare sempre sopra */}
              <motion.button
                data-testid="mobile-menu-button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-colors duration-300 touch-manipulation w-12 h-12 flex items-center justify-center fixed right-4 top-2 z-10001 font-bold ${
                  isScrolled 
                    ? 'text-gray-900 bg-gray-200 hover:bg-gray-300' 
                    : 'text-white bg-white/40 hover:bg-white/50 backdrop-blur-md border border-white/60'
                }`}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu con AnimatePresence */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop animato */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/40 z-9998"
                  onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Menu Panel animato */}
                <motion.div
                  data-testid="mobile-menu"
                  variants={mobileMenuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white/98 backdrop-blur-md border-t border-violet-100 shadow-xl relative z-9999"
                >
                  <div className="px-4 py-6 space-y-1 max-h-[80vh] overflow-y-auto">
                    {navigationItems.map(({ path, label, icon: Icon }, index) => (
                      <motion.div
                        key={path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { 
                            delay: index * 0.1,
                            duration: 0.3
                          }
                        }}
                      >
                        <NavLink
                          to={path}
                          icon={Icon}
                          onClick={() => setIsMenuOpen(false)}
                          isScrolled={true}
                          isMobile={true}
                        >
                          {label}
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Mobile Spacer */}
        <div className="h-16" />
      </div>
    );
  }

  // Versione DESKTOP con animazioni
  return (
    <div data-testid="desktop-navbar">
      <motion.nav
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-9999 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg' 
            : 'bg-linear-to-r from-violet-600 via-purple-700 to-indigo-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-8">
            {/* Logo Desktop */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="shrink-0"
            >
              <Link
                to="/"
                className="flex items-center space-x-2 group"
                aria-label="Torna alla homepage"
              >
                <div className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg ${
                  isScrolled 
                    ? 'bg-violet-600 group-hover:shadow-violet-500/50' 
                    : 'bg-white/20 backdrop-blur-sm group-hover:bg-white/30'
                }`}>
                  <span className={`font-bold text-lg transition-colors duration-300 ${
                    isScrolled ? 'text-white' : 'text-white'
                  }`}>
                    AG
                  </span>
                </div>
                <div className="flex flex-col">
                  <h1 className={`text-base font-bold transition-colors duration-300 ${
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}>
                    Alina Galben
                  </h1>
                  <p className={`text-xs font-medium transition-colors duration-300 ${
                    isScrolled ? 'text-violet-600' : 'text-yellow-200'
                  }`}>
                    Full-Stack Developer
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-1 ml-auto">
              {navigationItems.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  icon={icon}
                  isScrolled={isScrolled}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </motion.nav>

      {/* Desktop Spacer */}
      <div className={`transition-all duration-500 ${
        isScrolled ? 'h-20' : 'h-12'
      }`} />
    </div>
  );
};

export default Navbar;