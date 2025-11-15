import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Globe, Heart, Lightbulb, Settings, Monitor, Mail, ArrowRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0 }
  };

  const handleContactClick = () => {
    // Naviga direttamente alla pagina contatti (più veloce e pulito)
    navigate('/contact');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-violet-50 via-yellow-50 to-rose-50 relative overflow-hidden pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-violet-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-32 w-36 h-36 bg-rose-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Page Title */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-rose-500 to-yellow-500 bg-clip-text text-transparent mb-4">
              Chi Sono
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-rose-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:gap-16 lg:items-start space-y-8 lg:space-y-0">
            
            {/* Mobile Layout: Photo first, then Biography, then Info Cards */}
            <div className="lg:hidden space-y-8">
              {/* Mobile: Photo */}
              <motion.div 
                variants={imageVariants}
                className="relative"
              >
                <div className="bg-gradient-to-br from-violet-600 via-rose-500 to-yellow-500 p-1 rounded-2xl shadow-2xl">
                  <div className="bg-white rounded-2xl p-8 text-center">
                    {/* Avatar di Alina */}
                    <div className="w-60 h-60 mx-auto mb-6 bg-gradient-to-br from-violet-100 via-rose-100 to-yellow-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                      <img 
                        src="/alina-avatar.png" 
                        alt="Alina Galben" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Alina Galben</h3>
                    <p className="text-violet-600 font-semibold">Full Stack Developer</p>
                  </div>
                </div>
              </motion.div>

              {/* Mobile: Biography */}
              <motion.div variants={itemVariants} className="space-y-6">
              {/* Intro */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <span className="text-2xl md:text-3xl">👋</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Ciao!</h2>
                </div>
                
                <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed space-y-4 md:space-y-6">
                  <p className="text-lg md:text-xl">
                    Mi chiamo <span className="font-semibold text-violet-600">Alina Galben</span> e sono una <span className="font-semibold text-rose-600">Web Developer Full Stack</span> con una grande passione per la tecnologia, l'apprendimento continuo e la creatività.
                  </p>
                  
                  <p className="text-lg md:text-xl">
                    Mi piace costruire esperienze digitali che uniscono logica, design e semplicità, perché credo che il codice sia un linguaggio capace di connettere persone e idee.
                  </p>
                </div>
              </div>

              {/* Education & Skills */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <Lightbulb className="w-8 h-8 text-yellow-500" />
                  <h3 className="text-2xl font-bold text-gray-800">Formazione & Competenze</h3>
                </div>
                
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl">
                    Ho completato il corso <span className="font-semibold text-violet-600">Full Stack Web Developer con Epicode</span>, dove ho imparato a progettare e sviluppare applicazioni web moderne, lavorando sia sul frontend che sul backend.
                  </p>
                  
                  <p className="text-xl">
                    Durante la formazione ho utilizzato strumenti come <span className="font-semibold">HTML, CSS, JavaScript, React, Node.js, Express, MongoDB e Bootstrap</span>, consolidando le basi per creare interfacce funzionali e dinamiche.
                  </p>
                  
                  <p className="text-xl">
                    In questo periodo mi sto concentrando sull'apprendimento di strumenti creativi come <span className="font-semibold text-rose-600">TailwindCSS, Figma</span> per la progettazione UI/UX, lo sviluppo di chatbot intelligenti e sull'esplorazione di tecnologie che rendono il web più interattivo e umano.
                  </p>
                </div>
              </div>

              {/* Philosophy & Approach */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <Heart className="w-8 h-8 text-rose-500" />
                  <h3 className="text-2xl font-bold text-gray-800">La Mia Filosofia</h3>
                </div>
                
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl">
                    Ogni giorno approfondisco nuovi argomenti, ripasso ciò che ho imparato e cerco di migliorare le mie competenze per realizzare progetti sempre più completi e curati.
                  </p>
                  
                  <p className="text-xl">
                    Credo che un buon developer non si limiti a scrivere codice, ma sappia anche <span className="font-semibold text-violet-600">ascoltare, osservare e innovare</span>.
                  </p>
                  
                  <p className="text-xl">
                    Mi considero una persona <span className="font-semibold">curiosa, determinata, empatica e attenta ai dettagli</span>, con un approccio organizzato ma anche aperto alla sperimentazione.
                  </p>
                </div>
              </div>

              {/* Goals & Collaboration */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <Settings className="w-8 h-8 text-violet-500" />
                  <h3 className="text-2xl font-bold text-gray-800">Obiettivi & Collaborazioni</h3>
                </div>
                
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl">
                    Amo imparare, creare e trovare soluzioni che semplificano la vita delle persone.
                  </p>
                  
                  <p className="text-xl">
                    Il mio obiettivo è crescere come sviluppatrice, collaborare a progetti innovativi e contribuire con la mia creatività e sensibilità a costruire esperienze digitali significative.
                  </p>
                  
                  <p className="text-xl">
                    Se vuoi conoscermi meglio, <span className="font-semibold text-rose-600">scrivimi, collabora con me o chiedi un preventivo</span> — sono sempre aperta a nuove idee e collaborazioni che portano valore, ispirazione e crescita reciproca.
                  </p>
                </div>
              </div>

              {/* Mobile: Info Cards */}
              <div className="space-y-6">
                
                {/* Location */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-violet-100 rounded-lg flex-shrink-0">
                      <MapPin className="w-7 h-7 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-5 h-5 text-violet-600" />
                        <h4 className="text-lg font-semibold text-gray-800">Modalità di Lavoro</h4>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border border-green-200 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌍</span>
                          <div>
                            <span className="text-green-700 text-lg font-semibold block">Collaborazioni Remote</span>
                            <p className="text-base text-green-600 mt-1">Disponibile ovunque per progetti internazionali</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="w-5 h-5 text-gray-600" />
                          <span className="text-base font-medium text-gray-700">Basi operative locali:</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center justify-between py-3 px-4 bg-violet-50 rounded-xl border border-violet-100">
                            <span className="text-violet-700 text-base font-medium">🏖️ Catania</span>
                            <span className="text-violet-600 text-sm bg-white px-3 py-1 rounded-full font-medium">Sicilia</span>
                          </div>
                          <div className="flex items-center justify-between py-3 px-4 bg-rose-50 rounded-xl border border-rose-100">
                            <span className="text-rose-700 text-base font-medium">🛶 Venezia</span>
                            <span className="text-rose-600 text-sm bg-white px-3 py-1 rounded-full font-medium">Veneto</span>
                          </div>
                          <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-xl border border-yellow-100">
                            <span className="text-yellow-700 text-base font-medium">🎓 Padova</span>
                            <span className="text-yellow-600 text-sm bg-white px-3 py-1 rounded-full font-medium">Veneto</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Role */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-10 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center gap-8">
                    <div className="p-5 bg-rose-100 rounded-lg flex-shrink-0">
                      <Briefcase className="w-8 h-8 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-3">💼 Full Stack Developer</h4>
                      <p className="text-lg text-gray-600">Frontend & Backend Development</p>
                    </div>
                  </div>
                </motion.div>

                {/* Tech Stack Icons */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-10 shadow-lg border border-white/20"
                >
                  <h4 className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-4">
                    <Monitor className="w-7 h-7 text-violet-600" />
                    Stack Tecnologico
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {['React', 'Node.js', 'TypeScript', 'MongoDB', 'TailwindCSS', 'Express'].map((tech) => (
                      <span 
                        key={tech}
                        className="px-5 py-3 bg-gradient-to-r from-violet-100 to-rose-100 text-violet-700 rounded-full font-semibold text-base"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Mobile: Contact CTA Button */}
              <motion.div 
                variants={itemVariants}
                className="pt-8"
              >
                <button
                  onClick={handleContactClick}
                  className="w-full group bg-gradient-to-r from-violet-600 to-rose-500 text-white font-bold py-5 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 text-lg"
                >
                  <Mail className="w-6 h-6" />
                  📩 Contattami
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.div>
              </motion.div>
            </div>

            {/* Desktop Layout: Side by side - Original Structure */}
            {/* Biography Text - Desktop (Left Column) */}
            <motion.div variants={itemVariants} className="hidden lg:block space-y-6">
              {/* Intro */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-3xl">👋</span>
                  <h2 className="text-3xl font-bold text-gray-800">Ciao!</h2>
                </div>
                
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl">
                    Mi chiamo <span className="font-semibold text-violet-600">Alina Galben</span> e sono una <span className="font-semibold text-rose-600">Web Developer Full Stack</span> con una grande passione per la tecnologia, l'apprendimento continuo e la creatività.
                  </p>
                  
                  <p className="text-xl">
                    Mi piace costruire esperienze digitali che uniscono logica, design e semplicità, perché credo che il codice sia un linguaggio capace di connettere persone e idee.
                  </p>
                </div>
              </div>

              {/* Education & Skills */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <Lightbulb className="w-8 h-8 text-yellow-500" />
                  <h3 className="text-2xl font-bold text-gray-800">Formazione & Competenze</h3>
                </div>
                
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl">
                    Ho completato il corso <span className="font-semibold text-violet-600">Full Stack Web Developer con Epicode</span>, dove ho imparato a progettare e sviluppare applicazioni web moderne, lavorando sia sul frontend che sul backend.
                  </p>
                  
                  <p className="text-xl">
                    Durante la formazione ho utilizzato strumenti come <span className="font-semibold">HTML, CSS, JavaScript, React, Node.js, Express, MongoDB e Bootstrap</span>, consolidando le basi per creare interfacce funzionali e dinamiche.
                  </p>
                  
                  <p className="text-xl">
                    In questo periodo mi sto concentrando sull'apprendimento di strumenti creativi come <span className="font-semibold text-rose-600">TailwindCSS, Figma</span> per la progettazione UI/UX, lo sviluppo di chatbot intelligenti e sull'esplorazione di tecnologie che rendono il web più interattivo e umano.
                  </p>
                </div>
              </div>

              {/* Philosophy & Approach */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <Heart className="w-8 h-8 text-rose-500" />
                  <h3 className="text-2xl font-bold text-gray-800">La Mia Filosofia</h3>
                </div>
                
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl">
                    Ogni giorno approfondisco nuovi argomenti, ripasso ciò che ho imparato e cerco di migliorare le mie competenze per realizzare progetti sempre più completi e curati.
                  </p>
                  
                  <p className="text-xl">
                    Credo che un buon developer non si limiti a scrivere codice, ma sappia anche <span className="font-semibold text-violet-600">ascoltare, osservare e innovare</span>.
                  </p>
                  
                  <p className="text-xl">
                    Mi considero una persona <span className="font-semibold">curiosa, determinata, empatica e attenta ai dettagli</span>, con un approccio organizzato ma anche aperto alla sperimentazione.
                  </p>
                </div>
              </div>

              {/* Goals & Collaboration */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <Settings className="w-8 h-8 text-violet-500" />
                  <h3 className="text-2xl font-bold text-gray-800">Obiettivi & Collaborazioni</h3>
                </div>
                
                <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl">
                    Amo imparare, creare e trovare soluzioni che semplificano la vita delle persone.
                  </p>
                  
                  <p className="text-xl">
                    Il mio obiettivo è crescere come sviluppatrice, collaborare a progetti innovativi e contribuire con la mia creatività e sensibilità a costruire esperienze digitali significative.
                  </p>
                  
                  <p className="text-xl">
                    Se vuoi conoscermi meglio, <span className="font-semibold text-rose-600">scrivimi, collabora con me o chiedi un preventivo</span> — sono sempre aperta a nuove idee e collaborazioni che portano valore, ispirazione e crescita reciproca.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Desktop Photo + Info Cards */}
            <motion.div variants={itemVariants} className="hidden lg:block space-y-8">
              
              <motion.div 
                variants={imageVariants}
                className="relative"
              >
                <div className="bg-gradient-to-br from-violet-600 via-rose-500 to-yellow-500 p-1 rounded-2xl shadow-2xl">
                  <div className="bg-white rounded-2xl p-8 text-center">
                    {/* Avatar di Alina */}
                    <div className="w-60 h-60 mx-auto mb-6 bg-gradient-to-br from-violet-100 via-rose-100 to-yellow-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                      <img 
                        src="/alina-avatar.png" 
                        alt="Alina Galben" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Alina Galben</h3>
                    <p className="text-violet-600 font-semibold">Full Stack Developer</p>
                  </div>
                </div>
              </motion.div>

              {/* Info Cards */}
              <div className="space-y-6">
                
                {/* Location */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-violet-100 rounded-lg flex-shrink-0">
                      <MapPin className="w-7 h-7 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-5 h-5 text-violet-600" />
                        <h4 className="text-lg font-semibold text-gray-800">Modalità di Lavoro</h4>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border border-green-200 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌍</span>
                          <div>
                            <span className="text-green-700 text-lg font-semibold block">Collaborazioni Remote</span>
                            <p className="text-base text-green-600 mt-1">Disponibile ovunque per progetti internazionali</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="w-5 h-5 text-gray-600" />
                          <span className="text-base font-medium text-gray-700">Basi operative locali:</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center justify-between py-3 px-4 bg-violet-50 rounded-xl border border-violet-100">
                            <span className="text-violet-700 text-base font-medium">🏖️ Catania</span>
                            <span className="text-violet-600 text-sm bg-white px-3 py-1 rounded-full font-medium">Sicilia</span>
                          </div>
                          <div className="flex items-center justify-between py-3 px-4 bg-rose-50 rounded-xl border border-rose-100">
                            <span className="text-rose-700 text-base font-medium">🛶 Venezia</span>
                            <span className="text-rose-600 text-sm bg-white px-3 py-1 rounded-full font-medium">Veneto</span>
                          </div>
                          <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-xl border border-yellow-100">
                            <span className="text-yellow-700 text-base font-medium">🎓 Padova</span>
                            <span className="text-yellow-600 text-sm bg-white px-3 py-1 rounded-full font-medium">Veneto</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Role */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-10 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center gap-8">
                    <div className="p-5 bg-rose-100 rounded-lg flex-shrink-0">
                      <Briefcase className="w-8 h-8 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-3">💼 Full Stack Developer</h4>
                      <p className="text-lg text-gray-600">Frontend & Backend Development</p>
                    </div>
                  </div>
                </motion.div>

                {/* Tech Stack Icons */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-10 shadow-lg border border-white/20"
                >
                  <h4 className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-4">
                    <Monitor className="w-7 h-7 text-violet-600" />
                    Stack Tecnologico
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {['React', 'Node.js', 'TypeScript', 'MongoDB', 'TailwindCSS', 'Express'].map((tech) => (
                      <span 
                        key={tech}
                        className="px-5 py-3 bg-gradient-to-r from-violet-100 to-rose-100 text-violet-700 rounded-full font-semibold text-base"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Contact CTA Button */}
              <motion.div 
                variants={itemVariants}
                className="pt-8"
              >
                <button
                  onClick={handleContactClick}
                  className="w-full group bg-gradient-to-r from-violet-600 to-rose-500 text-white font-bold py-5 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 text-lg"
                >
                  <Mail className="w-6 h-6" />
                  📩 Contattami
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPage;