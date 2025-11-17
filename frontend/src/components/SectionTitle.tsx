import { motion } from 'framer-motion';

interface SectionTitleProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  emoji, 
  title, 
  subtitle, 
  className = "" 
}) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <motion.h1 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
      >
        {emoji && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 150 }}
            className="inline-block mr-3 text-5xl md:text-6xl"
          >
            {emoji}
          </motion.span>
        )}
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-linear-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent"
        >
          {title}
        </motion.span>
      </motion.h1>
      
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
      
      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mx-auto mt-6 h-1 w-24 bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
      />
    </div>
  );
};

export default SectionTitle;