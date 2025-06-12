// src/components/features/breed-quiz/LeadCaptureForm.jsx - OPTIMIZADO PARA ADDSENT
import React, { useState, useCallback, useEffect, useRef } from 'react';
import SuccessNotification from '../../ui/SuccessNotification';

const LeadCaptureForm = ({ onSubmit, onSkip, userAnswers }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // ✅ NUEVO: Ref para cancelar requests
  const abortControllerRef = useRef(null);
  
  // ✅ NUEVO: Cleanup en unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ✅ MEJORADO: Validación robusta para AddSent
  const validateForm = useCallback(() => {
    const errors = {};
    
    // Validación de nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.trim().length > 50) {
      errors.nombre = 'El nombre no puede exceder 50 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.nombre.trim())) {
      errors.nombre = 'El nombre solo puede contener letras y espacios';
    }
    
    // Validación de apellido
    if (!formData.apellido.trim()) {
      errors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      errors.apellido = 'El apellido debe tener al menos 2 caracteres';
    } else if (formData.apellido.trim().length > 50) {
      errors.apellido = 'El apellido no puede exceder 50 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.apellido.trim())) {
      errors.apellido = 'El apellido solo puede contener letras y espacios';
    }
    
    // ✅ CORREGIDO: Validación de email robusta para AddSent
    if (!formData.correo.trim()) {
      errors.correo = 'El correo electrónico es requerido';
    } else {
      const email = formData.correo.trim().toLowerCase();
      // Regex más estricto para AddSent
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      
      if (!emailRegex.test(email)) {
        errors.correo = 'Por favor ingresa un correo electrónico válido';
      } else if (email.length > 254) {
        errors.correo = 'El correo electrónico es demasiado largo';
      }
      
      // ✅ NUEVO: Validaciones adicionales para AddSent
      const disposableEmailDomains = [
        '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 
        'tempmail.org', 'yopmail.com', 'throwaway.email'
      ];
      const domain = email.split('@')[1];
      if (disposableEmailDomains.includes(domain)) {
        errors.correo = 'Por favor usa un correo electrónico permanente';
      }
    }
    
    setValidationErrors(errors);
    
    // Si hay errores, mostrar el primero
    const firstError = Object.values(errors)[0];
    if (firstError) {
      setError(firstError);
      return false;
    }
    
    setError('');
    return true;
  }, [formData]);

  // ✅ MEJORADO: Manejo de cambios con validación en tiempo real
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error || validationErrors[name]) {
      setError('');
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [error, validationErrors]);

  // ✅ NUEVO: Preparar datos para AddSent con tags y segmentación
  const prepareAddSentData = useCallback((formData, userAnswers) => {
    const leadData = {
      // Datos básicos requeridos por AddSent
      email: formData.correo.trim().toLowerCase(),
      firstName: formData.nombre.trim(),
      lastName: formData.apellido.trim(),
      
      // ✅ NUEVO: Tags para segmentación en AddSent
      tags: extractTagsFromAnswers(userAnswers),
      
      // ✅ NUEVO: Campos personalizados para AddSent
      customFields: {
        petTypePreference: userAnswers?.petTypePreference || 'not_specified',
        experienceLevel: userAnswers?.experienceLevel || 'not_specified',
        livingSpace: userAnswers?.livingSpace || 'not_specified',
        activityLevel: userAnswers?.activityLevel || 'not_specified',
        budgetLevel: userAnswers?.budgetLevel || 'not_specified',
        familySituation: userAnswers?.familySituation || 'not_specified',
        quizCompletedAt: new Date().toISOString(),
        leadSource: 'breed_quiz',
        userAgent: navigator.userAgent,
        language: 'es',
        country: 'CO' // Ajustar según tu target
      },
      
      // ✅ NUEVO: Datos de contexto para personalización
      context: {
        pageUrl: window.location.href,
        referrer: document.referrer,
        quizProgress: calculateQuizProgress(userAnswers),
        topRecommendations: extractTopRecommendations(userAnswers)
      }
    };

    return leadData;
  }, []);

  // ✅ NUEVO: Extraer tags para segmentación
  const extractTagsFromAnswers = (answers) => {
    if (!answers) return ['quiz_incomplete'];
    
    const tags = ['quiz_completed'];
    
    // Tags basados en tipo de mascota
    if (answers.petTypePreference) {
      tags.push(`prefers_${answers.petTypePreference}`);
    }
    
    // Tags basados en experiencia
    if (answers.experienceLevel) {
      tags.push(`experience_${answers.experienceLevel}`);
    }
    
    // Tags basados en situación de vivienda
    if (answers.livingSpace) {
      tags.push(`living_${answers.livingSpace}`);
    }
    
    // Tags basados en presupuesto
    if (answers.budgetLevel) {
      tags.push(`budget_${answers.budgetLevel}`);
    }
    
    // Tags basados en situación familiar
    if (answers.hasChildren) {
      tags.push('has_children');
    }
    if (answers.hasOtherPets) {
      tags.push('has_other_pets');
    }
    
    // Tags basados en nivel de actividad
    const activityLevel = parseInt(answers.activityLevel) || 3;
    if (activityLevel <= 2) tags.push('low_activity');
    else if (activityLevel >= 4) tags.push('high_activity');
    else tags.push('medium_activity');
    
    return tags;
  };

  // ✅ NUEVO: Calcular progreso del quiz
  const calculateQuizProgress = (answers) => {
    if (!answers) return 0;
    
    const totalQuestions = 10; // Ajustar según tu quiz
    const answeredQuestions = Object.keys(answers).length;
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // ✅ NUEVO: Extraer top recomendaciones
  const extractTopRecommendations = (answers) => {
    // Esta función debería extraer las razas recomendadas del análisis
    // Placeholder por ahora
    return answers?.topRecommendations || [];
  };

  // ✅ MEJORADO: Submit optimizado para AddSent
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // ✅ NUEVO: Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      // ✅ NUEVO: Preparar datos para AddSent
      const addSentData = prepareAddSentData(formData, userAnswers);
      
      console.log('📧 Enviando datos a AddSent:', addSentData);
      
      // ✅ NUEVO: Envío a AddSent con retry logic
      const response = await submitToAddSent(addSentData, abortControllerRef.current.signal);
      
      if (response.success) {
        setShowSuccess(true);
        
        // ✅ NUEVO: Callback con datos de AddSent incluidos
        if (onSubmit) {
          onSubmit({
            ...formData,
            addSentData,
            addSentResponse: response
          });
        }
        
        // ✅ NUEVO: Tracking de evento exitoso
        trackSuccessfulSubmission(addSentData);
        
      } else {
        throw new Error(response.message || 'Error al procesar la suscripción');
      }
      
    } catch (error) {
      console.error('❌ Error en submit:', error);
      
      if (error.name !== 'AbortError') {
        if (error.message.includes('email already exists')) {
          setError('Este correo ya está registrado. ¿Quieres actualizar tus preferencias?');
        } else if (error.message.includes('network')) {
          setError('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
        } else {
          setError('Error al procesar la información. Inténtalo de nuevo en unos momentos.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, userAnswers, validateForm, onSubmit]);

  // ✅ NUEVO: Función para enviar a AddSent con retry
  const submitToAddSent = async (data, signal, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch('/api/addsent/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(data),
          signal
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
        
      } catch (error) {
        if (error.name === 'AbortError' || attempt === retries) {
          throw error;
        }
        
        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

  // ✅ NUEVO: Tracking de eventos
  const trackSuccessfulSubmission = (data) => {
    // Integrar con tu sistema de analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'lead_capture_success', {
        event_category: 'engagement',
        event_label: 'breed_quiz_completion',
        custom_parameters: {
          pet_preference: data.customFields.petTypePreference,
          experience_level: data.customFields.experienceLevel
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">📧</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ¡Recibe tu análisis personalizado!
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Te enviaremos tu recomendación detallada y consejos personalizados para tu nueva mascota.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              validationErrors.nombre 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
            }`}
            placeholder="Tu nombre"
            required
            maxLength={50}
            disabled={isSubmitting}
          />
          {validationErrors.nombre && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.nombre}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellido *
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              validationErrors.apellido 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
            }`}
            placeholder="Tu apellido"
            required
            maxLength={50}
            disabled={isSubmitting}
          />
          {validationErrors.apellido && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.apellido}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico *
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              validationErrors.correo 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
            }`}
            placeholder="ejemplo@correo.com"
            required
            maxLength={254}
            disabled={isSubmitting}
          />
          {validationErrors.correo && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.correo}</p>
          )}
        </div>

        {/* Error Message */}
        {error && !Object.keys(validationErrors).length && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Beneficios */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
          <h4 className="font-medium text-green-800 mb-2">✨ Qué recibirás:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>
              Análisis personalizado de compatibilidad
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>
              Guías de cuidado específicas para tu raza
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>
              Tips semanales adaptados a tu perfil
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>
              Ofertas exclusivas de productos para mascotas
            </li>
          </ul>
        </div>

        {/* Política de privacidad */}
        <div className="text-xs text-gray-500 text-center">
          Al enviar este formulario aceptas recibir emails con consejos y ofertas. 
          Puedes darte de baja en cualquier momento. 
          <a href="/privacidad" className="text-blue-600 hover:underline ml-1">
            Ver política de privacidad
          </a>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all transform ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Enviando...
              </div>
            ) : (
              '📬 Recibir mi análisis personalizado'
            )}
          </button>
          
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={isSubmitting}
              className="w-full py-2 px-4 text-gray-600 text-sm hover:text-gray-800 transition-colors"
            >
              Ver resultados sin suscribirse
            </button>
          )}
        </div>
      </form>

      {/* Success Notification */}
      <SuccessNotification
        show={showSuccess}
        title="¡Suscripción exitosa!"
        message="Revisa tu email para recibir tu análisis personalizado."
        duration={5000}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default LeadCaptureForm;