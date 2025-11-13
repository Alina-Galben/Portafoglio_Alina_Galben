import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calculator } from 'lucide-react';
import { submitContactForm } from '../services/api';

const QuickQuoteModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [quoteData, setQuoteData] = useState({
    name: '',
    email: '',
    projectType: '',
    description: '',
    timeline: '',
    budget: '',
    features: []
  });

  const projectTypes = [
    { value: 'website', label: 'Sito Web/Landing Page' },
    { value: 'webapp', label: 'Web Application' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'blog', label: 'Blog/CMS' },
    { value: 'api', label: 'API/Backend' },
    { value: 'other', label: 'Altro' }
  ];

  const commonFeatures = [
    'Design Responsive',
    'SEO Optimization',
    'Form di Contatto',
    'Integrazione Social',
    'Dashboard Admin',
    'Sistema Login',
    'Pagamenti Online',
    'Chat/Messaggistica',
    'Notifiche Email',
    'Analytics'
  ];

  const handleFeatureToggle = (feature) => {
    setQuoteData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitContactForm({
        name: quoteData.name,
        email: quoteData.email,
        subject: `Richiesta Preventivo: ${quoteData.projectType} - ${quoteData.name}`,
        message: `
RICHIESTA PREVENTIVO

Nome: ${quoteData.name}
Email: ${quoteData.email}
Tipo Progetto: ${quoteData.projectType}

Descrizione:
${quoteData.description}

Timeline: ${quoteData.timeline}
Budget Stimato: ${quoteData.budget}

Funzionalità Richieste:
${quoteData.features.length > 0 ? quoteData.features.join(', ') : 'Nessuna specifica'}

---
Inviato tramite form preventivo rapido del portfolio
        `.trim()
      });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setQuoteData({
          name: '',
          email: '',
          projectType: '',
          description: '',
          timeline: '',
          budget: '',
          features: []
        });
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Quote submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-violet-100 rounded-full mr-3">
                  <Calculator className="w-6 h-6 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Richiedi un Preventivo
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-800">
                    ✅ Richiesta inviata con successo! Ti invierò un preventivo dettagliato entro 24 ore.
                  </p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-800">
                    ❌ Errore nell'invio. Riprova o contattami direttamente.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={quoteData.name}
                      onChange={(e) => setQuoteData({ ...quoteData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={quoteData.email}
                      onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo di Progetto *
                  </label>
                  <select
                    required
                    value={quoteData.projectType}
                    onChange={(e) => setQuoteData({ ...quoteData, projectType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Seleziona il tipo di progetto</option>
                    {projectTypes.map(type => (
                      <option key={type.value} value={type.label}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrizione del Progetto *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={quoteData.description}
                    onChange={(e) => setQuoteData({ ...quoteData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Descrivi il tuo progetto, gli obiettivi e le funzionalità principali che hai in mente..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Funzionalità Desiderate
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonFeatures.map(feature => (
                      <label
                        key={feature}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={quoteData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="mr-2 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Timeline and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline Desiderata
                    </label>
                    <select
                      value={quoteData.timeline}
                      onChange={(e) => setQuoteData({ ...quoteData, timeline: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                      disabled={isSubmitting}
                    >
                      <option value="">Seleziona timeline</option>
                      <option value="1-2 settimane">1-2 settimane</option>
                      <option value="1 mese">1 mese</option>
                      <option value="2-3 mesi">2-3 mesi</option>
                      <option value="3+ mesi">3+ mesi</option>
                      <option value="Da concordare">Da concordare</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Stimato
                    </label>
                    <select
                      value={quoteData.budget}
                      onChange={(e) => setQuoteData({ ...quoteData, budget: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                      disabled={isSubmitting}
                    >
                      <option value="">Seleziona budget</option>
                      <option value="< 1000€">{"< 1.000€"}</option>
                      <option value="1000€ - 3000€">{"1.000€ - 3.000€"}</option>
                      <option value="3000€ - 5000€">{"3.000€ - 5.000€"}</option>
                      <option value="5000€ - 10000€">{"5.000€ - 10.000€"}</option>
                      <option value="10000€+">{"10.000€+"}</option>
                      <option value="Da discutere">Da discutere</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-linear-to-r from-violet-600 to-rose-500 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Richiedi Preventivo
                      </>
                    )}
                  </button>
                  
                  <div className="shrink-0 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      📧 Riceverai un preventivo dettagliato entro 24 ore
                    </p>
                  </div>
                </div>
              </form>

              <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <p className="text-sm text-violet-800">
                  💡 <strong>Hai domande specifiche?</strong>{' '}
                  <a 
                    href="/contact" 
                    className="text-violet-700 underline hover:text-violet-900"
                    onClick={() => onClose()}
                  >
                    Contattami direttamente
                  </a> per una consulenza gratuita.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickQuoteModal;