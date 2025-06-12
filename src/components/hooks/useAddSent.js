// src/components/hooks/useAddSent.js - HOOK PRINCIPAL PARA ADDSENT
import { useState, useCallback } from 'react';

export const useAddSent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useCallback(async (userData, options = {}) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/addsent/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          ...options
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error en la suscripción');
      }

      setSuccess(true);
      return result;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const sendQuizResults = useCallback(async (email, quizData, recommendations) => {
    return subscribe({
      email,
      firstName: quizData.firstName || '',
      lastName: quizData.lastName || '',
      tags: ['quiz_completed', `prefers_${quizData.petTypePreference}`],
      customFields: {
        leadSource: 'breed_quiz',
        quizCompletedAt: new Date().toISOString(),
        petTypePreference: quizData.petTypePreference,
        experienceLevel: quizData.experienceLevel,
        topRecommendation: recommendations[0]?.name || null,
        compatibilityScore: recommendations[0]?.score || null
      }
    }, {
      template: 'quizResults',
      templateData: {
        recommendations,
        userProfile: quizData
      }
    });
  }, [subscribe]);

  const sendBreedComparison = useCallback(async (email, userData, comparisonData) => {
    return subscribe({
      email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      tags: ['breed_comparison', 'engaged_user'],
      customFields: {
        leadSource: 'breed_comparison',
        comparedBreeds: comparisonData.breeds.map(b => b.name).join(', '),
        comparisonDate: new Date().toISOString(),
        topChoice: comparisonData.topChoice?.name || null
      }
    }, {
      template: 'breedComparison',
      templateData: comparisonData
    });
  }, [subscribe]);

  return {
    subscribe,
    sendQuizResults,
    sendBreedComparison,
    isSubmitting,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    }
  };
};