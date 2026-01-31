import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ShieldCheck,
  HeartHandshake,
  Code2,
} from 'lucide-react';

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

const points = [
  {
    icon: CheckCircle,
    title: 'Esperienza full‑stack',
    description:
      'Sviluppo soluzioni end‑to‑end, dal design del database al frontend responsivo.',
  },
  {
    icon: ShieldCheck,
    title: 'Affidabilità & qualità',
    description:
      'Codice pulito, testato e manutenibile che pone al centro performance e sicurezza.',
  },
  {
    icon: HeartHandshake,
    title: 'Focus sull’utente',
    description:
      'Progetti cuciti su misura sulle tue esigenze, con un’esperienza d’uso intuitiva.',
  },
  {
    icon: Code2,
    title: 'Aggiornamento continuo',
    description:
      'Tecnologie all’avanguardia e best practices per garantire risultati moderni.',
  },
] as const;

const HomeWhyChooseMeSection: React.FC = () => {
  return (
    <section className="bg-[#f6f3ee]" aria-labelledby="why-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-3xl shadow-xl p-6 sm:p-10"
        >
          <motion.div variants={item} className="text-center max-w-3xl mx-auto mb-10">
            <h2
              id="why-title"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 font-bold text-2xl"
            >
             ✨ Perché scegliere me
            </h2>
            <h3 className="mt-6 text-2xl sm:text-4xl font-extrabold text-gray-900">
              Un mix di competenze, passione&nbsp;&amp;&nbsp;dedizione
            </h3>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Ecco alcuni motivi per cui potremmo essere il team perfetto per il tuo prossimo progetto
              digitale.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {points.map(({ icon: Icon, title, description }, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-violet-100 border border-violet-200 mb-4">
                  <Icon className="w-7 h-7 text-violet-800" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(HomeWhyChooseMeSection);