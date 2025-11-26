import React from 'react';
import { motion } from 'framer-motion';

interface ElegantStatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'pink';
}

const COLOR_THEMES = {
  violet: { border: 'border-violet-100', iconBg: 'bg-violet-100', text: 'text-violet-600', gradient: 'from-violet-500 to-purple-600' },
  blue: { border: 'border-blue-100', iconBg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-cyan-600' },
  green: { border: 'border-emerald-100', iconBg: 'bg-emerald-100', text: 'text-emerald-600', gradient: 'from-emerald-500 to-green-600' },
  red: { border: 'border-rose-100', iconBg: 'bg-rose-100', text: 'text-rose-600', gradient: 'from-rose-500 to-red-600' },
  yellow: { border: 'border-amber-100', iconBg: 'bg-amber-100', text: 'text-amber-600', gradient: 'from-amber-500 to-orange-600' },
  pink: { border: 'border-pink-100', iconBg: 'bg-pink-100', text: 'text-pink-600', gradient: 'from-pink-500 to-rose-600' }
} as const;

const ElegantStatCard: React.FC<ElegantStatCardProps> = ({ value, label, icon, color = 'violet' }) => {
  const theme = COLOR_THEMES[color];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className={`relative overflow-hidden bg-white rounded-xl p-4 border ${theme.border} shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className={`absolute top-0 right-0 w-16 h-16 bg-linear-to-br ${theme.gradient} opacity-10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none`} />

      <div className="flex items-center space-x-4 relative z-10">
        {icon && (
          <div className={`shrink-0 p-2 rounded-lg ${theme.iconBg} ${theme.text}`}>
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })
              : icon
            }
          </div>
        )}

        <div className="flex flex-col">
          <div className={`text-2xl md:text-3xl font-bold bg-linear-to-r ${theme.gradient} bg-clip-text text-transparent leading-tight`}>
            {value}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-0.5">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ElegantStatCard;