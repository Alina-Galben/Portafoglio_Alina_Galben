import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Hammer,
  Rocket,
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

const steps = [
  {
    icon: Search,
    title: 'Analisi&nbsp;&amp;&nbsp;ricerca',
    description:
      'Comprendo i tuoi obiettivi e studio la soluzione migliore per il tuo business.',
  },
  {
    icon: LayoutDashboard,
    title: 'Design&nbsp;&amp;&nbsp;prototyping',
    description:
      'Progetto layout e interazioni con un occhio di riguardo per la UX e l’accessibilità.',
  },
  {
    icon: Hammer,
    title: 'Sviluppo agile',
    description:
      'Codifico con cura utilizzando metodologie moderne e revisioni continue.',
  },
  {
    icon: Rocket,
    title: 'Test&nbsp;&amp;&nbsp;deploy',
    description:
      'Verifico le performance e pubblico in produzione, accompagnandoti anche dopo il lancio.',
  },
] as const;

const HomeMethodApproachSection: React.FC = () => {
  return (
    <section className="bg-[#f6f3ee]" aria-labelledby="method-title">
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
              id="method-title"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-700 font-bold text-2xl"
            >
              Metodo &amp; approccio
            </h2>
            <h3 className="mt-6 text-2xl sm:text-4xl font-extrabold text-gray-900">
              Un processo strutturato, dalla visione al lancio
            </h3>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Ogni progetto segue fasi ben definite che garantiscono chiarezza, tempi certi e
              risultati di qualità.
            </p>
          </motion.div>
          <motion.div
            variants={container}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map(({ icon: Icon, title, description }, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-amber-100 border border-amber-200 mb-4">
                  <Icon className="w-7 h-7 text-amber-800" />
                </div>
                <h4
                  className="text-lg font-semibold text-gray-900 mb-2"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(HomeMethodApproachSection);