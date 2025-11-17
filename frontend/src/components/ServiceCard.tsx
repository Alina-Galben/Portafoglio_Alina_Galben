import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface ServiceCardProps {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  cta: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  id, 
  icon, 
  title, 
  description, 
  category, 
  cta 
}) => {
  const navigate = useNavigate();
  
  // Dinamicamente importa l'icona da Lucide React
  const IconComponent = (Icons as any)[icon] || Icons.Code;

  // Colori per le categorie
  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      'frontend': 'from-purple-500 to-pink-500',
      'backend': 'from-blue-500 to-cyan-500',
      'fullstack': 'from-violet-500 to-purple-500',
      'automation': 'from-green-500 to-emerald-500',
      'webapp': 'from-indigo-500 to-blue-500',
      'consulting': 'from-orange-500 to-yellow-500',
      'ai': 'from-pink-500 to-rose-500',
      'seo': 'from-teal-500 to-cyan-500',
      'design': 'from-purple-500 to-violet-500',
      'maintenance': 'from-gray-500 to-slate-500'
    };
    return gradients[category] || 'from-purple-500 to-pink-500';
  };

  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Naviga alla pagina contatti passando il servizio come parametro
    navigate(`/contact?service=${encodeURIComponent(title)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full flex flex-col"
    >
      {/* Gradient Header */}
      <div className={`h-2 bg-linear-to-r ${getCategoryGradient(category)}`} />
      
      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Icon */}
        <div className="mb-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${getCategoryGradient(category)} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <IconComponent className="w-7 h-7 text-gray-700" />
              </div>
            </div>
            {/* Decorative blur */}
            <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-linear-to-r ${getCategoryGradient(category)} opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4 flex-1">
          {description}
        </p>

        {/* CTA Button */}
        <button
          onClick={handleCTAClick}
          className={`w-full py-3 px-4 rounded-xl bg-linear-to-r ${getCategoryGradient(category)} text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
        >
          {cta}
        </button>
      </div>

      {/* Decorative bottom gradient */}
      <div className={`h-1 bg-linear-to-r ${getCategoryGradient(category)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
};

export default ServiceCard;