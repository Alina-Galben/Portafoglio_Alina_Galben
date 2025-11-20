import React from 'react';
import { motion } from 'framer-motion';

interface ElegantStatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: 'violet' | 'blue' | 'green' | 'red' | 'yellow' | 'pink';
}

const ElegantStatCard: React.FC<ElegantStatCardProps> = ({ value, label, icon, color = 'violet' }) => {
  
  const colorClasses = {
    violet: {
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      text: 'text-violet-600',
      iconBg: 'bg-violet-100',
      gradient: 'from-violet-500 to-purple-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
      gradient: 'from-blue-500 to-cyan-600'
    },
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      gradient: 'from-emerald-500 to-green-600'
    },
    red: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-600',
      iconBg: 'bg-rose-100',
      gradient: 'from-rose-500 to-red-600'
    },
    yellow: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
      iconBg: 'bg-amber-100',
      gradient: 'from-amber-500 to-orange-600'
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      text: 'text-pink-600',
      iconBg: 'bg-pink-100',
      gradient: 'from-pink-500 to-rose-600'
    },
  };

  const theme = colorClasses[color];

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className={`relative overflow-hidden bg-white rounded-xl p-4 border ${theme.border} shadow-sm hover:shadow-md transition-all duration-300`}
    >
      {/* Sfondo decorativo ridotto */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-linear-to-br ${theme.gradient} opacity-10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none`} />

      <div className="flex items-center space-x-4 relative z-10">
        {/* Icona più piccola a sinistra */}
        {icon && (
          <div className={`flex-shrink-0 p-2 rounded-lg ${theme.iconBg} ${theme.text}`}>
            {/* Clona l'icona per forzare una dimensione piccola (w-5 h-5) */}
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })
              : icon
            }
          </div>
        )}

        {/* Testo e Valore allineati a sinistra */}
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