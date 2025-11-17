import { NavLink as RouterNavLink } from 'react-router-dom';
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
  isScrolled = false,
  isMobile = false
}) => {
  const { shouldReduceAnimations } = useDeviceOptimization();

  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center space-x-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
          isMobile ? 'px-4 py-3 text-base w-full touch-manipulation' : 'px-3 py-1 text-xs'
        } ${
          isActive
            ? 'text-white bg-linear-to-r from-violet-600 to-purple-700 shadow-lg'
            : isScrolled || isMobile
              ? 'text-gray-800 hover:text-violet-600 hover:bg-violet-50' 
              : 'text-white hover:text-yellow-300 hover:bg-black/20 drop-shadow-2xl font-bold text-shadow-xl border border-white/30 backdrop-blur-sm shadow-lg'
        }`
      }
      style={isMobile ? { minHeight: '48px' } : {}}
    >
      {({ isActive }) => (
        <>
          {Icon && <Icon className={isMobile ? "w-5 h-5" : "w-4 h-4"} />}
          <span>{children}</span>
          
          {/* Animated underline for active state - solo su desktop */}
          {!shouldReduceAnimations && !isMobile && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-violet-600 to-purple-700"
              initial={{ width: 0 }}
              animate={{ width: isActive ? '100%' : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          )}
          
          {/* Hover glow effect - solo su desktop */}
          {!shouldReduceAnimations && !isMobile && (
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-violet-600/10 to-purple-700/10 rounded-lg opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          )}
        </>
      )}
    </RouterNavLink>
  );
};

export default NavLink;