import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface SkillCardProps {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  level?: number;
}

const THEMES: Record<string, { gradient: string; text: string }> = {
  frontend: { gradient: 'from-blue-500 to-cyan-500', text: 'text-blue-600' },
  backend: { gradient: 'from-green-500 to-emerald-500', text: 'text-green-600' },
  database: { gradient: 'from-purple-500 to-violet-500', text: 'text-purple-600' },
  tools: { gradient: 'from-orange-500 to-yellow-500', text: 'text-orange-600' },
  cloud: { gradient: 'from-indigo-500 to-blue-500', text: 'text-indigo-600' },
  design: { gradient: 'from-pink-500 to-rose-500', text: 'text-pink-600' },
  cognitive: { gradient: 'from-purple-500 to-pink-500', text: 'text-purple-600' },
  interpersonal: { gradient: 'from-blue-500 to-indigo-500', text: 'text-blue-600' },
  personal: { gradient: 'from-green-500 to-teal-500', text: 'text-green-600' },
  professional: { gradient: 'from-orange-500 to-red-500', text: 'text-orange-600' },
  creative: { gradient: 'from-pink-500 to-purple-500', text: 'text-pink-600' },
  default: { gradient: 'from-gray-500 to-slate-500', text: 'text-gray-600' }
};

const SkillCard: React.FC<SkillCardProps> = ({ icon, title, description, category, level }) => {
  const IconComponent = (Icons as any)[icon] ?? Icons.Code;
  const theme = THEMES[category] ?? THEMES.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl border border-gray-100"
    >
      <div className={`h-1.5 bg-linear-to-r ${theme.gradient}`} />
      
      <div className="p-6">
        <div className="mb-4 relative">
          <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${theme.gradient} p-0.5 transition-transform duration-300 group-hover:scale-110`}>
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
              <IconComponent className={`w-7 h-7 ${theme.text}`} />
            </div>
          </div>
          <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-linear-to-r ${theme.gradient} opacity-20 blur-lg transition-opacity duration-300 group-hover:opacity-40`} />
        </div>

        <h3 className={`mb-3 text-lg font-bold transition-colors duration-300 group-hover:${theme.text}`}>
          {title}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          {description}
        </p>

        {level && (
          <div className="mt-3 flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * (i + 1) }}
              >
                <Icons.Star className={`h-4 w-4 ${i < level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              </motion.div>
            ))}
            <span className="ml-2 text-xs text-gray-500">{level}/5</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white bg-linear-to-r ${theme.gradient} capitalize`}>
            {category}
          </span>
          <div className={`h-2 w-2 rounded-full bg-linear-to-r ${theme.gradient} opacity-60 transition-opacity duration-300 group-hover:opacity-100`} />
        </div>
      </div>

      <div className={`pointer-events-none absolute inset-0 bg-linear-to-r ${theme.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
    </motion.div>
  );
};

export default SkillCard;