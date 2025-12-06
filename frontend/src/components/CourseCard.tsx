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

const STYLE_MAP = {
  BookOpen: { gradient: 'from-blue-500 to-cyan-500', badge: 'bg-blue-100 text-blue-700' },
  MonitorCheck: { gradient: 'from-purple-500 to-pink-500', badge: 'bg-purple-100 text-purple-700' },
  Code: { gradient: 'from-green-500 to-emerald-500', badge: 'bg-green-100 text-green-700' },
  Database: { gradient: 'from-orange-500 to-red-500', badge: 'bg-orange-100 text-orange-700' },
  default: { gradient: 'from-violet-500 to-rose-500', badge: 'bg-violet-100 text-violet-700' }
};

const CourseCard: React.FC<CourseCardProps> = ({ icon, title, institution, duration, description, certificate }) => {
  const IconComponent = (LucideIcons as any)[icon] ?? LucideIcons.BookOpen;
  const { gradient, badge } = STYLE_MAP[icon as keyof typeof STYLE_MAP] ?? STYLE_MAP.default;
  const isActive = duration.includes('Ongoing') || duration.includes('Continuous');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-violet-200 overflow-hidden group relative"
    >
      <div className={`bg-linear-to-r ${gradient} p-6 text-white`}>
        <div className="flex items-start gap-4">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <IconComponent className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <div className="flex flex-wrap gap-3 text-sm opacity-90">
              <div className="flex items-center gap-1"><Building className="w-4 h-4" />{institution}</div>
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{duration}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${badge}`}>
            <Award className="w-4 h-4 mr-2" />{certificate}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-blue-400'}`} />
            <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-blue-600'}`}>
              {isActive ? 'In corso' : 'Completato'}
            </span>
          </div>
        </div>
      </div>

      <div className={`absolute inset-0 bg-linear-to-r ${gradient}/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
    </motion.div>
  );
};

export default CourseCard;