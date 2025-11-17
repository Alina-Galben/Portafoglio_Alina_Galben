import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Mail, 
  MessageSquare,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { submitContactForm } from '../services/api';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  _hp: string; // honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type FormState = 'idle' | 'sending' | 'success' | 'error';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    _hp: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const subjectOptions = [
    { value: '', label: 'Seleziona un argomento...' },
    { value: 'Preventivo', label: '💰 Preventivo' },
    { value: 'Collaborazione', label: '🤝 Collaborazione' },
    { value: 'Informazioni', label: '💡 Informazioni' }
  ];

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation function
  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Il nome è obbligatorio';
        if (value.trim().length < 2) return 'Il nome deve essere di almeno 2 caratteri';
        return undefined;
      
      case 'email':
        if (!value.trim()) return 'L\'email è obbligatoria';
        if (!emailRegex.test(value)) return 'Inserisci un\'email valida';
        return undefined;
      
      case 'subject':
        if (!value) return 'Seleziona un argomento';
        return undefined;
      
      case 'message':
        if (!value.trim()) return 'Il messaggio è obbligatorio';
        if (value.trim().length < 20) return 'Il messaggio deve essere di almeno 20 caratteri';
        return undefined;
      
      default:
        return undefined;
    }
  };

  // Real-time validation
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate field if form was already submitted
    if (submitAttempted) {
      const error = validateField(name as keyof FormData, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Check honeypot
    if (formData._hp) {
      toast.error('⚠️ Rilevato comportamento spam');
      return false;
    }

    // Validate each field
    (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
      if (field !== '_hp') {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      toast.error('⚠️ Correggi gli errori nel form');
      return;
    }

    setFormState('sending');

    try {
      const data = await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        honeypot: formData._hp
      });
      
      setFormState('success');
      toast.success('✅ Messaggio inviato con successo!');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          _hp: ''
        });
        setErrors({});
        setSubmitAttempted(false);
        setFormState('idle');
      }, 3000);

    } catch (error) {
      console.error('Contact form error:', error);
      setFormState('error');
      
      // Check if it's a network error (backend not available)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error(
          '🚫 Server non disponibile. Contattami direttamente: galben.alina@gmail.com'
        );
      } else {
        toast.error('⚠️ Errore durante l\'invio — riprova.');
      }
    }
  };

  // Retry function
  const handleRetry = () => {
    setFormState('idle');
  };

  const inputVariants = {
    focus: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Listen for subject changes from parent component
  useEffect(() => {
    const handleSubjectChange = () => {
      const subjectSelect = document.getElementById('subject') as HTMLSelectElement;
      if (subjectSelect && subjectSelect.value && subjectSelect.value !== formData.subject) {
        setFormData(prev => ({ ...prev, subject: subjectSelect.value }));
      }
    };

    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
      subjectSelect.addEventListener('change', handleSubjectChange);
      return () => subjectSelect.removeEventListener('change', handleSubjectChange);
    }
  }, [formData.subject]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot field */}
      <input
        type="text"
        name="_hp"
        value={formData._hp}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Name Field */}
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          <User className="w-4 h-4 inline mr-2" />
          Nome completo *
        </label>
        <motion.input
          variants={inputVariants}
          whileFocus="focus"
          whileTap="tap"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`
            w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white 
            focus:ring-2 focus:ring-purple-500 focus:border-transparent 
            transition-all duration-200 placeholder-gray-400
            ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          `}
          placeholder="Il tuo nome e cognome"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={formState === 'sending'}
        />
        <AnimatePresence>
          {errors.name && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="name-error"
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Field */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Email *
        </label>
        <motion.input
          variants={inputVariants}
          whileFocus="focus"
          whileTap="tap"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`
            w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white 
            focus:ring-2 focus:ring-purple-500 focus:border-transparent 
            transition-all duration-200 placeholder-gray-400
            ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          `}
          placeholder="la-tua-email@esempio.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={formState === 'sending'}
        />
        <AnimatePresence>
          {errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="email-error"
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subject Field */}
      <div>
        <label 
          htmlFor="subject" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          <Tag className="w-4 h-4 inline mr-2" />
          Argomento *
        </label>
        <motion.select
          variants={inputVariants}
          whileFocus="focus"
          whileTap="tap"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className={`
            w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white 
            focus:ring-2 focus:ring-purple-500 focus:border-transparent 
            transition-all duration-200
            ${errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          `}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          disabled={formState === 'sending'}
        >
          {subjectOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </motion.select>
        <AnimatePresence>
          {errors.subject && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="subject-error"
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.subject}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message Field */}
      <div>
        <label 
          htmlFor="message" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Messaggio *
        </label>
        <motion.textarea
          variants={inputVariants}
          whileFocus="focus"
          whileTap="tap"
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={6}
          className={`
            w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white 
            focus:ring-2 focus:ring-purple-500 focus:border-transparent 
            transition-all duration-200 placeholder-gray-400 resize-vertical
            ${errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'}
          `}
          placeholder="Scrivi qui il tuo messaggio... (minimo 20 caratteri)"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          disabled={formState === 'sending'}
        />
        <div className="mt-2 flex justify-between items-center">
          <AnimatePresence>
            {errors.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="message-error"
                className="text-sm text-red-600 flex items-center gap-1"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="text-sm text-gray-500">
            {formData.message.length}/20 min
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <AnimatePresence mode="wait">
          {formState === 'error' ? (
            <motion.div
              key="error-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-red-600 text-sm flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4" />
                Si è verificato un errore durante l'invio
              </div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="button"
                onClick={handleRetry}
                className="w-full py-3 px-6 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
              >
                🔄 Riprova
              </motion.button>
            </motion.div>
          ) : formState === 'success' ? (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ✅ Messaggio inviato!
              </h3>
              <p className="text-gray-600">
                Ti risponderò entro 24 ore lavorative
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="submit-button"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              disabled={formState === 'sending'}
              className="w-full py-3 px-6 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              aria-live="polite"
            >
              {formState === 'sending' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Invio in corso...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  📧 Invia messaggio
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Privacy Note */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
        🔒 I tuoi dati sono protetti e utilizzati solo per rispondere al tuo messaggio.
        <br />
        Non condividiamo le tue informazioni con terze parti.
      </div>
    </form>
  );
};

export default ContactForm;