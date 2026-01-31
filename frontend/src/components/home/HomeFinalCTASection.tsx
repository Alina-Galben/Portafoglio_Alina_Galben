import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import CtaSection from '../common/CtaSection';


const HomeFinalCTASection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <CtaSection
      id="cta-title"
      title="Hai un’idea da realizzare?"
      description="Raccontami il tuo progetto e costruiamo insieme una soluzione su misura."
      gradient="from-violet-600 via-purple-600 to-blue-600"
      actions={[
        {
          label: 'Contattami',
          onClick: () => navigate('/contact'),
          icon: Mail,
          className:
            'px-7 py-4 rounded-full bg-white text-violet-700 border-2 border-white hover:bg-violet-50 transition-all shadow-sm',
        },
        {
          label: 'Chiama ora',
          href: 'tel:+393793250179',
          icon: Phone,
          className:
            'px-7 py-4 rounded-full bg-white/20 text-white border-2 border-white hover:bg-white/30 transition-all shadow-sm',
        },
      ]}
    />
  );
};

export default React.memo(HomeFinalCTASection);