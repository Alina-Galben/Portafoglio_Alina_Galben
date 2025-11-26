import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import useDeviceOptimization from '../hooks/useDeviceOptimization';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  isScrolled?: boolean;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  children, 
  icon: Icon, 
  onClick, 
  isScrolled, 
  isMobile 
}) => {
  const { shouldReduceAnimations } = useDeviceOptimization();
  const enableEffects = !isMobile && !shouldReduceAnimations;

  const getClasses = (isActive: boolean) => {
    const base = "group relative flex items-center gap-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap";
    const size = isMobile ? "px-4 py-3 text-base w-full touch-manipulation" : "px-3 py-1 text-xs";
    
    if (isActive) {
      return `${base} ${size} text-white bg-linear-to-r from-violet-600 to-purple-700 shadow-lg`;
    }
    
    if (isScrolled || isMobile) {
      return `${base} ${size} text-gray-800 hover:text-violet-600 hover:bg-violet-50`;
    }

    return `${base} ${size} text-white hover:text-yellow-300 hover:bg-black/20 drop-shadow-2xl font-bold border border-white/30 backdrop-blur-sm shadow-lg`;
  };

  return (
    <RouterLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => getClasses(isActive)}
      style={isMobile ? { minHeight: '48px' } : undefined}
    >
      {({ isActive }) => (
        <>
          {Icon && <Icon className={isMobile ? "w-5 h-5" : "w-4 h-4"} />}
          <span>{children}</span>
          
          {enableEffects && (
            <>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-violet-600 to-purple-700"
                initial={{ width: 0 }}
                animate={{ width: isActive ? '100%' : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-violet-600/10 to-purple-700/10 rounded-lg opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </>
          )}
        </>
      )}
    </RouterLink>
  );
};

export default NavLink;