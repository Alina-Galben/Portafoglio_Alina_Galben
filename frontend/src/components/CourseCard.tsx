import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Clock, Building, Award } from 'lucide-react';

interface CourseCardProps {
  id: number;
  icon: string;
  title: string;
  institution: string;
  duration: string;
  description: string;
  certificate: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  icon,
  title,
  institution,
  duration,
  description,
  certificate
}) => {
  // Dynamic icon loading with fallback
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.BookOpen;

  // Category-based gradient colors
  const getCategoryGradient = () => {
    switch (icon) {
      case 'BookOpen':
        return 'from-blue-500 to-cyan-500';
      case 'MonitorCheck':
        return 'from-purple-500 to-pink-500';
      case 'Code':
        return 'from-green-500 to-emerald-500';
      case 'Database':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-violet-500 to-rose-500';
    }
  };

  const getCategoryBadgeColor = () => {
    switch (icon) {
      case 'BookOpen':
        return 'bg-blue-100 text-blue-700';
      case 'MonitorCheck':
        return 'bg-purple-100 text-purple-700';
      case 'Code':
        return 'bg-green-100 text-green-700';
      case 'Database':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-violet-100 text-violet-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-violet-200 transition-all duration-300 overflow-hidden group"
    >
      {/* Header with Icon */}
      <div className={`bg-gradient-to-r ${getCategoryGradient()} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <IconComponent className="w-6 h-6" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold mb-1">{title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm opacity-90">
                <div className="flex items-center space-x-1">
                  <Building className="w-4 h-4" />
                  <span>{institution}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 leading-relaxed mb-4">
          {description}
        </p>

        {/* Certificate Badge */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getCategoryBadgeColor()}`}>
            <Award className="w-4 h-4 mr-2" />
            {certificate}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            {duration.includes('Ongoing') || duration.includes('Continuous') ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-600 text-sm font-medium">In corso</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-600 text-sm font-medium">Completato</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryGradient().replace('from-', 'from-').replace('to-', 'to-')}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
    </motion.div>
  );
};

export default CourseCard;