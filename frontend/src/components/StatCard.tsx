import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface StatCardProps {
  icon: string;
  title: string;
  value: number;
  suffix?: string;
  description?: string;
  gradient?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  suffix = '',
  description,
  gradient = 'from-violet-500 to-purple-600',
  trend,
  onClick
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  const Icon = (LucideIcons as any)[icon] ?? LucideIcons.BarChart3;
  const TrendIcon = trend?.isPositive ? LucideIcons.TrendingUp : LucideIcons.TrendingDown;

  useEffect(() => {
    let start = 0;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const val = Math.floor((1 - Math.pow(1 - progress, 4)) * value);
      
      setDisplayValue(val);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:border-violet-200 hover:shadow-xl ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`bg-linear-to-r ${gradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="rounded-xl bg-white/20 p-3 backdrop-blur-sm"
          >
            <Icon className="h-6 w-6" />
          </motion.div>
          
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-100' : 'text-red-100'}`}>
              <TrendIcon className="h-4 w-4" />
              <span>{trend.isPositive && '+'}{trend.value}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="mb-4">
          <div className="mb-1 text-3xl font-bold text-gray-900">
            {displayValue.toLocaleString()}{suffix}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        {description && (
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        )}

        {trend && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{trend.period}</span>
            <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive && '+'}{trend.value}% vs prev
            </span>
          </div>
        )}

        {onClick && (
          <div className="mt-4 flex items-center text-sm font-medium text-violet-600 group-hover:text-violet-700">
            <span>Visualizza dettagli</span>
            <LucideIcons.ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>

      <div className={`pointer-events-none absolute inset-0 bg-linear-to-r ${gradient}/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
    </motion.div>
  );
};

export default StatCard;