import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, User, Send } from 'lucide-react';
import { submitContactForm } from '../services/api';

const CollaborationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('choice'); // 'choice', 'project', 'job'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [projectData, setProjectData] = useState({
    name: '',
    email: '',
    projectIdea: '',
    timeline: '',
    budget: ''
  });

  const [jobData, setJobData] = useState({
    name: '',
    email: '',
    company: '',
    position: '',
    jobDescription: '',
    requirements: ''
  });

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitContactForm({
        name: projectData.name,
        email: projectData.email,
        subject: `Proposta Progetto: ${projectData.projectIdea.substring(0, 50)}...`,
        message: `
PROPOSTA PROGETTO

Nome: ${projectData.name}
Email: ${projectData.email}

Idea Progetto:
${projectData.projectIdea}

Timeline: ${projectData.timeline}
Budget: ${projectData.budget}

---
Inviato tramite form collaborazione del portfolio
        `.trim()
      });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setStep('choice');
        setProjectData({ name: '', email: '', projectIdea: '', timeline: '', budget: '' });
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Project submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitContactForm({
        name: jobData.name,
        email: jobData.email,
        subject: `Offerta Lavoro: ${jobData.position} - ${jobData.company}`,
        message: `
OFFERTA DI LAVORO

Nome: ${jobData.name}
Email: ${jobData.email}
Azienda: ${jobData.company}
Posizione: ${jobData.position}

Descrizione Lavoro:
${jobData.jobDescription}

Requisiti:
${jobData.requirements}

---
Inviato tramite form collaborazione del portfolio
        `.trim()
      });

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setStep('choice');
        setJobData({ name: '', email: '', company: '', position: '', jobDescription: '', requirements: '' });
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Job submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setStep('choice');
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
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Come vuoi collaborare con me?
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {step === 'choice' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="text-gray-600 mb-6">
                    Scegli come preferisci collaborare con me:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      onClick={() => setStep('project')}
                      className="p-6 border-2 border-violet-200 rounded-xl hover:border-violet-400 hover:bg-violet-50 transition-all duration-300 text-left group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-3 bg-violet-100 rounded-full group-hover:bg-violet-200 transition-colors">
                          <Briefcase className="w-6 h-6 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">
                          Proponi un Progetto
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        Hai un'idea per un progetto? Raccontamela e sviluppiamola insieme.
                      </p>
                    </motion.button>

                    <motion.button
                      onClick={() => setStep('job')}
                      className="p-6 border-2 border-rose-200 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all duration-300 text-left group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-3 bg-rose-100 rounded-full group-hover:bg-rose-200 transition-colors">
                          <User className="w-6 h-6 text-rose-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">
                          Proponi un Lavoro
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        Cerchi una sviluppatrice per il tuo team? Parliamone!
                      </p>
                    </motion.button>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Preferisci un approccio più diretto?</strong>{' '}
                      <a 
                        href="/contact" 
                        className="text-yellow-700 underline hover:text-yellow-900"
                        onClick={() => onClose()}
                      >
                        Vai alla pagina Contatti
                      </a> per inviarmi un messaggio personalizzato.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 'project' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setStep('choice')}
                      className="p-2 hover:bg-gray-100 rounded-full mr-3"
                    >
                      ←
                    </button>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Proponi il tuo Progetto
                    </h3>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">
                        ✅ Progetto inviato con successo! Ti risponderò al più presto.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">
                        ❌ Errore nell'invio. Riprova o contattami direttamente.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          required
                          value={projectData.name}
                          onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
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
                          value={projectData.email}
                          onChange={(e) => setProjectData({ ...projectData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrivi la tua idea *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={projectData.projectIdea}
                        onChange={(e) => setProjectData({ ...projectData, projectIdea: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                        placeholder="Raccontami il tuo progetto, gli obiettivi e le funzionalità che hai in mente..."
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeline
                        </label>
                        <input
                          type="text"
                          value={projectData.timeline}
                          onChange={(e) => setProjectData({ ...projectData, timeline: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                          placeholder="es. 2-3 mesi, urgente, flessibile..."
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget (opzionale)
                        </label>
                        <input
                          type="text"
                          value={projectData.budget}
                          onChange={(e) => setProjectData({ ...projectData, budget: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                          placeholder="es. 5000€, da discutere..."
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Invio in corso...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Invia Progetto
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 'job' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setStep('choice')}
                      className="p-2 hover:bg-gray-100 rounded-full mr-3"
                    >
                      ←
                    </button>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Proponi un'Opportunità di Lavoro
                    </h3>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800">
                        ✅ Proposta inviata con successo! Ti risponderò al più presto.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">
                        ❌ Errore nell'invio. Riprova o contattami direttamente.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          required
                          value={jobData.name}
                          onChange={(e) => setJobData({ ...jobData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
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
                          value={jobData.email}
                          onChange={(e) => setJobData({ ...jobData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Azienda *
                        </label>
                        <input
                          type="text"
                          required
                          value={jobData.company}
                          onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Posizione *
                        </label>
                        <input
                          type="text"
                          required
                          value={jobData.position}
                          onChange={(e) => setJobData({ ...jobData, position: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrizione del Lavoro *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={jobData.jobDescription}
                        onChange={(e) => setJobData({ ...jobData, jobDescription: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Descrivi la posizione, le responsabilità e l'ambiente di lavoro..."
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requisiti
                      </label>
                      <textarea
                        rows={3}
                        value={jobData.requirements}
                        onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Competenze tecniche, esperienza richiesta, soft skills..."
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Invio in corso...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Invia Proposta
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollaborationModal;