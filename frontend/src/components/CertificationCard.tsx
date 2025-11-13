import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Calendar, Building, ExternalLink, Mail, FileText } from 'lucide-react';

interface CertificationCardProps {
  id: number;
  icon: string;
  title: string;
  date: string;
  institution: string;
  description: string;
  file: string;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  icon,
  title,
  date,
  institution,
  description,
  file
}) => {
  // Dynamic icon loading with fallback
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Award;

  const handleViewPDF = () => {
    window.open(file, '_blank');
  };

  const handleRequestByEmail = () => {
    // Scroll to contact section or navigate to contact page
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/contact';
    }
  };

  // Category-based gradient colors
  const getCategoryGradient = () => {
    if (icon === 'GraduationCap') {
      return 'from-purple-500 to-pink-500';
    }
    return 'from-violet-500 to-rose-500';
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
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building className="w-4 h-4" />
                  <span>{institution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 leading-relaxed mb-6">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewPDF}
            className={`flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r ${getCategoryGradient()} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/30`}
          >
            <FileText className="w-5 h-5 mr-2" />
            📄 Visualizza PDF
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRequestByEmail}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contattami
          </motion.button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default CertificationCard;