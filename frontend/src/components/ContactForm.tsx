import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle, User, Mail, MessageSquare, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitContactForm } from '../services/api';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  _hp: string;
}

const INITIAL_DATA: FormData = { name: '', email: '', subject: '', message: '', _hp: '' };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SUBJECT_OPTS = [
  { value: '', label: 'Seleziona un argomento...' },
  { value: 'Preventivo', label: '💰 Preventivo' },
  { value: 'Collaborazione', label: '🤝 Collaborazione' },
  { value: 'Informazioni', label: '💡 Informazioni' }
];

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [isTouched, setIsTouched] = useState(false);

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome obbligatorio';
    else if (formData.name.trim().length < 2) newErrors.name = 'Minimo 2 caratteri';

    if (!formData.email.trim()) newErrors.email = 'Email obbligatoria';
    else if (!EMAIL_REGEX.test(formData.email)) newErrors.email = 'Email non valida';

    if (!formData.subject) newErrors.subject = 'Argomento richiesto';

    if (!formData.message.trim()) newErrors.message = 'Messaggio obbligatorio';
    else if (formData.message.trim().length < 20) newErrors.message = 'Minimo 20 caratteri';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  useEffect(() => {
    if (isTouched) validate();
  }, [formData, isTouched, validate]);

  useEffect(() => {
    const handleExternalChange = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      if (target.id === 'subject') {
        setFormData(prev => ({ ...prev, subject: target.value }));
      }
    };
    
    const el = document.getElementById('subject');
    el?.addEventListener('change', handleExternalChange);
    return () => el?.removeEventListener('change', handleExternalChange);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouched(true);

    if (formData._hp) return toast.error('Spam rilevato');
    if (!validate()) return toast.error('Correggi gli errori nel modulo');

    setStatus('sending');

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        honeypot: formData._hp
      });

      setStatus('success');
      toast.success('Messaggio inviato con successo!');
      
      setTimeout(() => {
        setFormData(INITIAL_DATA);
        setIsTouched(false);
        setStatus('idle');
      }, 3000);

    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Si è verificato un errore. Riprova.');
    }
  };

  const getInputClass = (hasError: boolean) => `
    w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white 
    focus:ring-2 focus:ring-purple-500 focus:border-transparent 
    transition-all placeholder-gray-400 outline-none
    ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'}
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot invisibile */}
      <input 
        type="text" 
        name="_hp" 
        value={formData._hp} 
        onChange={handleChange} 
        className="hidden" 
        tabIndex={-1} 
        autoComplete="off" 
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" /> Nome completo *
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={getInputClass(!!errors.name)}
            placeholder="Il tuo nome"
            disabled={status === 'sending'}
          />
          <ErrorMessage message={errors.name} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" /> Email *
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={getInputClass(!!errors.email)}
            placeholder="tuo@email.com"
            disabled={status === 'sending'}
          />
          <ErrorMessage message={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          <Tag className="w-4 h-4 inline mr-2" /> Argomento *
        </label>
        <div className="relative">
          <motion.select
            whileFocus={{ scale: 1.01 }}
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`${getInputClass(!!errors.subject)} appearance-none`}
            disabled={status === 'sending'}
          >
            {SUBJECT_OPTS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </motion.select>
        </div>
        <ErrorMessage message={errors.subject} />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2" /> Messaggio *
        </label>
        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className={getInputClass(!!errors.message)}
          placeholder="Scrivi qui il tuo messaggio... (min 20 caratteri)"
          disabled={status === 'sending'}
        />
        <div className="flex justify-between mt-2">
          <ErrorMessage message={errors.message} />
          <span className={`text-xs ${formData.message.length < 20 ? 'text-gray-400' : 'text-green-600'}`}>
            {formData.message.length} / 20 min
          </span>
        </div>
      </div>

      <div className="pt-4">
        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.div 
              key="error" 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="text-red-600 text-sm flex items-center justify-center gap-2 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" /> Si è verificato un errore durante l'invio.
              </div>
              <SubmitButton onClick={() => setStatus('idle')} variant="error">
                🔄 Riprova
              </SubmitButton>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              key="success" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-6 bg-green-50 rounded-xl border border-green-100"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Messaggio Inviato!</h3>
              <p className="text-gray-600 text-sm">Ti risponderò entro 24 ore lavorative.</p>
            </motion.div>
          )}

          {(status === 'idle' || status === 'sending') && (
            <SubmitButton 
              key="submit" 
              type="submit" 
              disabled={status === 'sending'}
              variant="primary"
            >
              {status === 'sending' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Invio in corso...</>
              ) : (
                <><Send className="w-5 h-5" /> Invia Messaggio</>
              )}
            </SubmitButton>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-gray-400 text-center pt-6 border-t border-gray-100">
        🔒 I tuoi dati sono al sicuro. Non verranno mai condivisi con terze parti.
      </p>
    </form>
  );
};

const ErrorMessage = ({ message }: { message?: string }) => (
  <AnimatePresence>
    {message && (
      <motion.div 
        initial={{ opacity: 0, y: -5 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -5 }} 
        className="text-sm text-red-600 flex items-center gap-1 mt-1.5 font-medium"
      >
        <AlertCircle className="w-3.5 h-3.5" /> {message}
      </motion.div>
    )}
  </AnimatePresence>
);

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant: 'primary' | 'error';
}

const SubmitButton = ({ children, className, variant, ...props }: ButtonProps) => {
  const baseClass = "w-full py-3.5 px-6 text-white rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg";
  const variantClass = variant === 'primary' 
    ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-violet-200" 
    : "bg-red-600 hover:bg-red-700 shadow-red-200";

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClass} ${variantClass} ${className || ''}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default ContactForm;