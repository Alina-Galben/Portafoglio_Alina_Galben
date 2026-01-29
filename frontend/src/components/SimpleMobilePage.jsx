import useDeviceOptimization from '../hooks/useDeviceOptimization';

const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-32 bg-gray-200 rounded" />
    </div>
  </div>
);

const SimpleMobilePage = ({ title, children, className = "" }) => {
  const { isMobile } = useDeviceOptimization();

  if (!isMobile) return children;

  return (
    <div className={`min-h-screen bg-[#f6f3ee] ${className}`}>
      <div className="bg-linear-to-r from-violet-600 to-purple-700 text-white p-6 text-center shadow-md">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      <div className="p-6 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">Ottimizzazione mobile in corso...</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 active:scale-95 transition-all"
          >
            Ricarica
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleMobilePage;