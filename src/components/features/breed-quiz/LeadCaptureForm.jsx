// src/components/features/breed-quiz/LeadCaptureForm.jsx
import React, { useState } from 'react';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError('Por favor ingresa tu nombre');
      return false;
    }
    
    if (!formData.apellido.trim()) {
      setError('Por favor ingresa tu apellido');
      return false;
    }
    
    if (!formData.correo.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return false;
    }
    
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }
    
    return true;
  };

  const submitToAirtable = async (data) => {
    try {
      const airtablePayload = {
        records: [
          {
            fields: {
              "fldr9O0y5r5qlTuZD": `${data.nombre} ${data.apellido}`, // Nombre y apellido
              "fld8tclUxPeoaU20S": data.correo, // Correo electronico
              "fldDbuBpfjA0rbbjh": new Date().toISOString().split('T')[0], // Fecha (solo fecha, no hora)
              // "Origen": "Quiz Tu Raza Ideal", // ❌ Campo removido temporalmente
              // "Respuestas Cuestionario": JSON.stringify(userAnswers, null, 2) // ❌ Campo removido temporalmente
            }
          }
        ]
      };

      const response = await fetch('/api/airtable-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(airtablePayload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting to Airtable:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await submitToAirtable(formData);
      
      // Mostrar notificación de éxito
      setShowSuccess(true);
      
      // Esperar un momento antes de continuar
      setTimeout(() => {
        onSubmit({
          ...formData,
          fullName: `${formData.nombre} ${formData.apellido}`
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error al enviar datos:', error);
      setError('Hubo un error al procesar tu información. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Notificación de éxito */}
      <SuccessNotification
        show={showSuccess}
        title="¡Datos guardados exitosamente!"
        message={`Hola ${formData.nombre}, preparando tu recomendación personalizada...`}
        duration={3000}
        onClose={() => setShowSuccess(false)}
      />

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">🎯</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Ya casi tienes tu raza ideal!
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Solo necesitamos unos datos para personalizar mejor tu recomendación y enviarte consejos útiles.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Tu nombre"
            required
          />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Tu apellido"
            required
          />
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Beneficios */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
          <h4 className="font-medium text-green-800 mb-2">✨ Qué recibirás:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </span>
              Tu recomendación personalizada al instante
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </span>
              Consejos exclusivos para tu futura mascota
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs">✓</span>
              </span>
              Newsletter con tips de cuidado (opcional)
            </li>
          </ul>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg'
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Procesando...
              </div>
            ) : (
              '🎯 Ver mi raza ideal'
            )}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 text-sm transition-colors"
          >
            Continuar sin registrarme
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 Tus datos están seguros. No spam, solo contenido útil.
        </p>
      </div>
    </div>
    </>
  );
};

export default LeadCaptureForm;