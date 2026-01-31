import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 14 },
  },
};

const HomeMiniAboutSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#f6f3ee]" aria-labelledby="mini-about-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl shadow-xl p-6 sm:p-10"
        >
          <motion.div variants={item} className="text-center mb-10">
            <h2
              id="mini-about-title"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 font-bold text-2xl"
            >
              Chi sono
            </h2>
          </motion.div>
          <motion.div
            variants={item}
            className="flex flex-col md:flex-row items-center md:items-start gap-8"
          >
            <div className="shrink-0">
              <picture>
                <source srcSet="/alina-avatar.webp" type="image/webp" />
                <img
                  src="/alina-avatar.webp"
                  width={208}
                  height={208}
                  loading="lazy"
                  decoding="async"
                  alt="Alina Galben"
                  className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-full border-4 border-white shadow-lg"
                />
              </picture>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Piacere, sono&nbsp;<span className="bg-linear-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">Alina</span>
              </h3>
              <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                Sviluppatrice full‑stack con passione per la tecnologia, l’innovazione e il design.
                Amo trasformare idee in esperienze digitali intuitive e performanti.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/about')}
                className="mt-6 inline-flex items-center justify-center px-7 py-4 rounded-full font-bold
                  bg-linear-to-r from-violet-600 to-violet-800 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Scopri di più
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(HomeMiniAboutSection);