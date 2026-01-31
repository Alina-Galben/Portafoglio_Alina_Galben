import React from 'react';
import { motion } from 'framer-motion';

export interface CtaAction {
  
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export interface CtaSectionProps {
  title: string;
  description: string;
  actions: CtaAction[];
  gradient?: string;
  containerClass?: string;
  cardClass?: string;
  id?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.15, staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 14 },
  },
};

const CtaSection: React.FC<CtaSectionProps> = ({
  title,
  description,
  actions,
  gradient = 'from-violet-600 via-purple-600 to-blue-600',
  containerClass = 'py-16',
  cardClass = 'p-8 sm:p-12 text-center text-white',
  id,
}) => {
  
  const gradientClass = `bg-linear-to-r ${gradient}`;

  return (
    <section className="bg-[#f6f3ee]" aria-labelledby={id}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClass}`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={`${gradientClass} rounded-3xl shadow-xl ${cardClass}`}
        >
          <motion.h2
            variants={itemVariants}
            id={id}
            className="text-3xl sm:text-4xl font-extrabold mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90"
          >
            {description}
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {actions.map((action, index) => {
              const { label, onClick, href, icon: Icon, className = '' } = action;
              const baseClasses =
                'inline-flex items-center justify-center font-bold rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-white/30';
              return onClick ? (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClick}
                  className={`${baseClasses} ${className}`}
                >
                  {Icon && <Icon className="w-5 h-5 mr-2" />}
                  {label}
                </motion.button>
              ) : (
                <motion.a
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={href}
                  className={`${baseClasses} ${className}`}
                >
                  {Icon && <Icon className="w-5 h-5 mr-2" />}
                  {label}
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(CtaSection);