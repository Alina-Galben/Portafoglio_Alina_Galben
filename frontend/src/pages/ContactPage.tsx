import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MessageCircle, 
  Heart,
  ExternalLink,
  Send,
  Phone
} from 'lucide-react';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  const formRef = useRef<HTMLElement>(null);

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/Alina-Galben',
      color: 'hover:text-gray-900',
      description: 'Esplora i miei progetti su GitHub'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/alina-galben/',
      color: 'hover:text-blue-600',
      description: 'Collegati con me su LinkedIn'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:ciao@alinagalben.com',
      color: 'hover:text-red-500',
      description: 'Scrivimi direttamente via email'
    },
    {
      name: 'WhatsApp',
      icon: Phone,
      url: 'https://wa.me/393347600899',
      color: 'hover:text-green-500',
      description: 'Contattami su WhatsApp'
    }
  ];

  const ctaButtons = [
    {
      id: 'preventivo',
      icon: MessageCircle,
      text: 'Chiedi un preventivo',
      emoji: '💬',
      subject: 'Preventivo',
      gradient: 'from-purple-600 to-pink-600',
      description: 'Per progetti web, sviluppo e consulenze'
    },
    {
      id: 'collaborazione',
      icon: Heart,
      text: 'Collabora con me',
      emoji: '🤝',
      subject: 'Collaborazione',
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Partnership e progetti condivisi'
    },
    {
      id: 'informazioni',
      icon: Send,
      text: 'Chiedi informazioni',
      emoji: '💡',
      subject: 'Informazioni',
      gradient: 'from-blue-600 to-purple-600',
      description: 'Domande generali e supporto'
    }
  ];

  const scrollToForm = (subject: string) => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Precompila il subject e focalizza il messaggio
      setTimeout(() => {
        const subjectSelect = document.getElementById('subject') as HTMLSelectElement;
        const messageTextarea = document.getElementById('message') as HTMLTextAreaElement;
        
        if (subjectSelect) {
          subjectSelect.value = subject;
          subjectSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        if (messageTextarea) {
          messageTextarea.focus();
        }
      }, 500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Helmet>
        <title>📩 Contattami — Alina Galben</title>
        <meta 
          name="description" 
          content="Scrivimi per preventivi, collaborazioni o informazioni. Form sicuro con risposta rapida, gestito tramite Resend (email API)." 
        />
        <meta name="keywords" content="contatti, preventivo, collaborazione, sviluppo web, consulenza" />
        <meta property="og:title" content="📩 Contattami — Alina Galben" />
        <meta 
          property="og:description" 
          content="Scrivimi per preventivi, collaborazioni o informazioni. Form sicuro con risposta rapida." 
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://alinagalben.com/contact" />
      </Helmet>

      <div className="min-h-screen bg-linear-to-br from-violet-50 via-yellow-50 to-rose-50 pt-16">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
            >
            {/* Left Column - Info & CTAs */}
            <div className="space-y-8">
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  📩 Contattami
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Hai un progetto in mente? Vuoi collaborare o semplicemente fare una chiacchierata? 
                  <span className="block mt-2 text-purple-600 font-medium">
                    Scrivimi e ti risponderò velocemente!
                  </span>
                </p>
              </motion.div>

              {/* Social Links */}
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                  🌐 Seguimi sui social
                </h2>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target={social.name === 'Email' ? undefined : '_blank'}
                        rel={social.name === 'Email' ? undefined : 'noopener noreferrer'}
                        className={`
                          flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-gray-200
                          shadow-sm hover:shadow-lg transition-all duration-300 group
                          ${social.color} hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:outline-none
                        `}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={social.description}
                      >
                        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-medium">{social.name}</span>
                        {social.name === 'Email' ? null : (
                          <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
                  🚀 Come posso aiutarti?
                </h2>
                <div className="space-y-6">
                  {ctaButtons.map((cta) => {
                    const Icon = cta.icon;
                    return (
                      <motion.button
                        key={cta.id}
                        onClick={() => scrollToForm(cta.subject)}
                        className={`
                          w-full p-8 bg-linear-to-r ${cta.gradient} text-white rounded-xl
                          shadow-lg hover:shadow-xl transition-all duration-300 group
                          focus:ring-2 focus:ring-purple-500 focus:outline-none
                        `}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`${cta.text}: ${cta.description}`}
                      >
                        <div className="flex items-center gap-6">
                          <div className="shrink-0">
                            <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-xl font-bold mb-2">
                              {cta.emoji} {cta.text}
                            </div>
                            <div className="text-white/80 text-lg">
                              {cta.description}
                            </div>
                          </div>
                          <div className="shrink-0">
                            <motion.div
                              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                              whileHover={{ rotate: 15 }}
                            >
                              <Send className="w-5 h-5 text-white" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div 
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      ⚡ Risposta veloce garantita
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Ti rispondo entro 24 ore lavorative. Per progetti urgenti, 
                      contattami direttamente via email per una risposta ancora più rapida.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Contact Form */}
            <motion.section
              ref={formRef}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  ✉️ Scrivimi ora
                </h2>
                <p className="text-white/80">
                  Compila il form e ti ricontatterò presto
                </p>
              </div>
              
              <div className="p-6">
                <ContactForm />
              </div>
            </motion.section>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;