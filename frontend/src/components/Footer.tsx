import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, ArrowUp, Phone } from 'lucide-react';
import PolicyLinks from "./legal/PolicyLinks";

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com/Alina-Galben', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/alina-galben/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:alina@alinadev.com', label: 'Email' },
  { icon: Phone, href: 'https://wa.me/393793250179', label: 'WhatsApp' }
];

const NAV_LINKS = [
  { name: 'Chi Sono', href: '/about' },
  { name: 'Progetti', href: '/projects' },
  { name: 'Servizi', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contatti', href: '/contact' }
];

const SERVICES = [
  'Sviluppo Frontend',
  'Sviluppo Backend',
  'Full-Stack Development',
  'Consulenza Tecnica',
  'UI/UX Design'
];

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
};

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-linear-to-br from-gray-900 via-violet-900 to-purple-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            variants={FADE_UP}
            viewport={{ once: true }}
            className="col-span-1 lg:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">AG</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Alina Galben</span>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Full-Stack Web Developer appassionata di tecnologie moderne. 
              Creo esperienze digitali innovative e soluzioni scalabili per 
              trasformare le tue idee in realtà.
            </p>
            
            <div className="flex space-x-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/5"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            variants={FADE_UP}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Link Rapidi</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <Link 
                    to={href} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            variants={FADE_UP}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 tracking-wide">Servizi</h3>
            <ul className="space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service} className="text-gray-300 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-gray-300 text-sm flex items-center"
          >
            © {new Date().getFullYear()} Alina Galben. Realizzato con
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="mx-1.5 text-red-400"
            >
              <Heart className="w-4 h-4 fill-current" />
            </motion.span>
            e React + TypeScript
          </motion.p>
          <div className=" opacity-80">
            <PolicyLinks
            className="justify-center md:justify-end"
            linkClassName="underline hover:opacity-90 text-gray-300 hover:text-white"
            />
          </div>
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium">Torna su</span>
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>


    </footer>
  );
};

export default Footer;