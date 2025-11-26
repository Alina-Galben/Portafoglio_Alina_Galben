import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  category: string;
  cta: string;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  frontend: 'from-purple-500 to-pink-500',
  backend: 'from-blue-500 to-cyan-500',
  fullstack: 'from-violet-500 to-purple-500',
  automation: 'from-green-500 to-emerald-500',
  webapp: 'from-indigo-500 to-blue-500',
  consulting: 'from-orange-500 to-yellow-500',
  ai: 'from-pink-500 to-rose-500',
  seo: 'from-teal-500 to-cyan-500',
  design: 'from-purple-500 to-violet-500',
  maintenance: 'from-gray-500 to-slate-500'
};

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, category, cta }) => {
  const navigate = useNavigate();
  const IconComponent = (Icons as any)[icon] || Icons.Code;
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.frontend;

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/contact?service=${encodeURIComponent(title)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full flex flex-col"
    >
      <div className={`h-2 bg-linear-to-r ${gradient}`} />
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4 relative">
          <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
              <IconComponent className="w-7 h-7 text-gray-700" />
            </div>
          </div>
          <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-linear-to-r ${gradient} opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300`} />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4 flex-1">
          {description}
        </p>

        <button
          onClick={handleContact}
          className={`w-full py-3 px-4 rounded-xl bg-linear-to-r ${gradient} text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all duration-300 outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
        >
          {cta}
        </button>
      </div>

      <div className={`h-1 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
};

export default ServiceCard;