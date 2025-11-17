import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  MessageCircle, 
  HandHeart, 
  FolderOpen, 
  Github, 
  Linkedin, 
  Mail, 
  Download,
  ChevronDown,
  Code,
  Sparkles,
  Heart
} from 'lucide-react';
import CollaborationModal from './CollaborationModal';
import QuickQuoteModal from './QuickQuoteModal';

const Hero = () => {
  const navigate = useNavigate();
  
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  // Handle email click
  const handleEmailClick = (e) => {
    e.preventDefault();
    const email = 'ciao@alinagalben.com';
    
    // Try to open email client
    window.location.href = `mailto:${email}`;
    
    // Also copy email to clipboard if possible
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        console.log('Email copied to clipboard');
      }).catch(() => {
        console.log('Failed to copy email');
      });
    }
  };

  // Typewriter effect
  useEffect(() => {
    const roles = ['Full-Stack Developer', 'Creator', 'Innovator', 'Problem Solver'];
    const currentRole = roles[currentRoleIndex];
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= currentRole.length) {
        setTypewriterText(currentRole.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }, 2000);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentRoleIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const skills = ['React', 'Node.js', 'MongoDB', 'TailwindCSS', 'Express', 'JavaScript'];

  return (
    <section className="min-h-screen bg-linear-to-br from-violet-50 via-yellow-50 to-rose-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Code Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-violet-300 text-sm font-mono opacity-20"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {`<${['div', 'span', 'h1', 'section', 'article'][i]}>`}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div variants={itemVariants} className="mb-6">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Ciao, sono{' '}
                <span className="bg-linear-to-r from-violet-600 via-rose-500 to-yellow-500 bg-clip-text text-transparent">
                  Alina Galben
                </span>{' '}
                <motion.span
                  className="inline-block"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  👋
                </motion.span>
              </motion.h1>
              
              <div className="h-16 flex items-center justify-center lg:justify-start">
                <motion.p 
                  className="text-2xl md:text-3xl font-semibold text-violet-600"
                  key={currentRoleIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {typewriterText}
                  <motion.span
                    className="inline-block ml-1 w-1 h-8 bg-violet-600"
                    animate={{ opacity: [1, 0] }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    |
                  </motion.span>
                </motion.p>
              </div>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Costruisco esperienze digitali moderne, scalabili e intuitive. 
              Appassionata di tecnologia e innovazione, trasformo idee in soluzioni 
              funzionali che connettono persone e tecnologia.
            </motion.p>

            {/* Skills Tags */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-violet-200 rounded-full text-sm font-medium text-violet-700 shadow-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  delay={index * 0.1}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <motion.button
                onClick={() => setIsQuoteModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-linear-to-r from-violet-600 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chiedi Preventivo
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>

              <motion.button
                onClick={() => setIsCollaborationModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-white text-violet-600 font-semibold rounded-full border-2 border-violet-600 hover:bg-violet-50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <HandHeart className="w-5 h-5 mr-2" />
                Collabora con me
              </motion.button>

              <motion.button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center px-8 py-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FolderOpen className="w-5 h-5 mr-2" />
                Guarda i miei progetti
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: Github, href: 'https://github.com/Alina-Galben', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/alina-galben/', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:ciao@alinagalben.com', label: 'Email' },
                { icon: Download, href: './pdf/CV - Alina Galben.pdf', label: 'CV Download' }
              // eslint-disable-next-line no-unused-vars
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  onClick={label === 'Email' ? handleEmailClick : undefined}
                  target={href.startsWith('http') || label === 'CV Download' ? '_blank' : '_self'} // Apri CV in new tab
                  rel={href.startsWith('http') ? 'noopener noreferrer' : ''}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 hover:text-violet-600"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                  title={label === 'Email' ? 'ciao@alinagalben.com - Clicca per inviare email' : label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Avatar */}
          <motion.div 
            variants={itemVariants}
            className="relative order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Avatar */}
              <motion.div
                className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {/* Static Border - No Animation */}
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-violet-500 via-rose-500 to-violet-500 p-1">
                  <div className="w-full h-full rounded-full bg-white p-3">
                    <div className="w-full h-full rounded-full bg-linear-to-br from-violet-100 to-rose-100 flex items-center justify-center overflow-hidden">
                      {/* Avatar di Alina */}
                      <img 
                        src="/alina-avatar.png" 
                        alt="Alina Galben" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-yellow-400 p-3 rounded-full shadow-lg"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-rose-400 p-3 rounded-full shadow-lg"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -right-8 bg-violet-400 p-3 rounded-full shadow-lg"
                  animate={{ 
                    x: [0, 10, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Code className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center text-violet-600 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={() => {
              window.scrollTo({ 
                top: window.innerHeight, 
                behavior: 'smooth' 
              });
            }}
          >
            <span className="text-sm mb-2 font-medium">Scopri di più</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <CollaborationModal 
        isOpen={isCollaborationModalOpen}
        onClose={() => setIsCollaborationModalOpen(false)}
      />
      
      <QuickQuoteModal 
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </section>
  );
};

export default Hero;