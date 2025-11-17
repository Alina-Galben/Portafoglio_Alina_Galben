import { useEffect, useState } from 'react';
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
  
  // Dynamic icon loading with fallback
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.BarChart3;

  // CountUp animation effect
  useEffect(() => {
    let startTime: number;
    const duration = 2000; // 2 seconds
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setDisplayValue(Math.floor(easeOutQuart * value));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 overflow-hidden group h-full flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Header with Gradient */}
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
          >
            <IconComponent className="w-6 h-6" />
          </motion.div>
          
          {trend && (
            <div className={`flex items-center space-x-1 text-sm ${trend.isPositive ? 'text-green-100' : 'text-red-100'}`}>
              {trend.isPositive ? (
                <LucideIcons.TrendingUp className="w-4 h-4" />
              ) : (
                <LucideIcons.TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {displayValue.toLocaleString()}{suffix}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        {description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {description}
          </p>
        )}

        {trend && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{trend.period}</span>
            <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% vs periodo precedente
            </span>
          </div>
        )}

        {onClick && (
          <div className="flex items-center text-violet-600 text-sm font-medium mt-4 group-hover:text-violet-700">
            <span>Visualizza dettagli</span>
            <LucideIcons.ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
    </motion.div>
  );
};

export default StatCard;