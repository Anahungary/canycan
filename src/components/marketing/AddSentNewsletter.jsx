// src/components/marketing/AddSentNewsletter.jsx - NEWSLETTER OPTIMIZADO
import React, { useState } from 'react';
import { useAddSent } from '../hooks/useAddSent';
import { useEmailValidation } from '../hooks/useEmailValidation';

const AddSentNewsletter = ({ 
  variant = 'default',
  source = 'newsletter',
  tags = [],
  className = '',
  title = 'Recibe consejos de mascotas',
  description = 'Tips semanales para cuidar mejor a tu compañero peludo',
  buttonText = 'Suscribirme',
  incentive = null
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    acceptTerms: false
  });

  const { subscribe, isSubmitting, error, success } = useAddSent();
  const { validateEmail, emailError } = useEmailValidation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) return;
    
    try {
      await subscribe({
        email: formData.email,
        firstName: formData.firstName,
        tags: [source, ...tags],
        customFields: {
          leadSource: source,
          subscriptionDate: new Date().toISOString(),
          variant: variant,
          hasIncentive: !!incentive
        }
      });
      
      // Reset form on success
      setFormData({ email: '', firstName: '', acceptTerms: false });
      
    } catch (err) {
      console.error('Error subscribing:', err);
    }
  };

  if (success) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-bold text-green-900 mb-2">
            ¡Suscripción exitosa!
          </h3>
          <p className="text-green-700">
            Revisa tu email para confirmar y recibir tu primer consejo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        
        {incentive && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">🎁 {incentive}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Tu nombre"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              emailError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            required
          />
          {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="accept-terms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            required
          />
          <label htmlFor="accept-terms" className="ml-3 text-sm text-gray-600">
            Acepto recibir emails y la{' '}
            <a href="/privacidad" className="text-blue-600 hover:underline">
              política de privacidad
            </a>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !formData.acceptTerms}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Enviando...' : buttonText}
        </button>
      </form>
    </div>
  );
};

export default AddSentNewsletter;