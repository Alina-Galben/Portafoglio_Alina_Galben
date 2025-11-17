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

const SkillCard: React.FC<SkillCardProps> = ({ 
  id, 
  icon, 
  title, 
  description, 
  category, 
  level 
}) => {
  // Dinamicamente importa l'icona da Lucide React
  const IconComponent = (Icons as any)[icon] || Icons.Code;

  // Colori per le categorie
  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      'frontend': 'from-blue-500 to-cyan-500',
      'backend': 'from-green-500 to-emerald-500',
      'database': 'from-purple-500 to-violet-500',
      'tools': 'from-orange-500 to-yellow-500',
      'cloud': 'from-indigo-500 to-blue-500',
      'design': 'from-pink-500 to-rose-500',
      'cognitive': 'from-purple-500 to-pink-500',
      'interpersonal': 'from-blue-500 to-indigo-500',
      'personal': 'from-green-500 to-teal-500',
      'professional': 'from-orange-500 to-red-500',
      'creative': 'from-pink-500 to-purple-500'
    };
    return gradients[category] || 'from-gray-500 to-slate-500';
  };

  // Colori accent per il testo
  const getCategoryTextColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'frontend': 'text-blue-600',
      'backend': 'text-green-600',
      'database': 'text-purple-600',
      'tools': 'text-orange-600',
      'cloud': 'text-indigo-600',
      'design': 'text-pink-600',
      'cognitive': 'text-purple-600',
      'interpersonal': 'text-blue-600',
      'personal': 'text-green-600',
      'professional': 'text-orange-600',
      'creative': 'text-pink-600'
    };
    return colors[category] || 'text-gray-600';
  };

  // Renderizza le stelle per il livello (solo per skills tecniche)
  const renderStars = (level?: number) => {
    if (!level) return null;
    
    return (
      <div className="flex items-center space-x-1 mt-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * star, duration: 0.3 }}
          >
            <Icons.Star 
              className={`w-4 h-4 ${
                star <= level 
                  ? `fill-yellow-400 text-yellow-400` 
                  : 'text-gray-300'
              }`}
            />
          </motion.div>
        ))}
        <span className="text-xs text-gray-500 ml-2">{level}/5</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
    >
      {/* Gradient Header */}
      <div className={`h-1.5 bg-linear-to-r ${getCategoryGradient(category)}`} />
      
      {/* Card Content */}
      <div className="p-6">
        {/* Icon */}
        <div className="mb-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${getCategoryGradient(category)} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <IconComponent className={`w-7 h-7 ${getCategoryTextColor(category)}`} />
              </div>
            </div>
            {/* Decorative blur */}
            <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-linear-to-r ${getCategoryGradient(category)} opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300`} />
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold mb-3 group-hover:${getCategoryTextColor(category)} transition-colors duration-300`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Level Stars (for technical skills) */}
        {renderStars(level)}

        {/* Category Badge */}
        <div className="mt-4 flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-linear-to-r ${getCategoryGradient(category)} text-white`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          
          {/* Decorative element */}
          <div className={`w-2 h-2 rounded-full bg-linear-to-r ${getCategoryGradient(category)} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className={`absolute inset-0 bg-linear-to-r ${getCategoryGradient(category)} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
    </motion.div>
  );
};

export default SkillCard;