import React from 'react';
import { motion } from 'framer-motion';

interface LegendPillProps {
  label: string;
  count: number;
  color?: string;
  isActive?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const LegendPill: React.FC<LegendPillProps> = ({
  label,
  count,
  color = 'violet',
  isActive = true,
  onClick,
  size = 'md'
}) => {
  const getColorClasses = () => {
    const colors = {
      violet: 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
    };
    
    return colors[color as keyof typeof colors] || colors.violet;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };
    
    return sizes[size];
  };

  const inactiveClasses = !isActive ? 'opacity-50 saturate-50' : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center space-x-2 rounded-full border font-medium transition-all duration-200
        ${getColorClasses()}
        ${getSizeClasses()}
        ${onClick ? 'cursor-pointer select-none' : ''}
        ${inactiveClasses}
      `}
    >
      <span className="truncate max-w-[120px]">{label}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center min-w-[20px] h-5 bg-white/50 rounded-full text-xs font-bold"
      >
        {count}
      </motion.span>
    </motion.div>
  );
};

export default LegendPill;