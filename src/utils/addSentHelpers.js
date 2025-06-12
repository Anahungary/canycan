// src/utils/addSentHelpers.js - FUNCIONES HELPER PARA ADDSENT
export const prepareLeadData = (formData, userAnswers, source = 'website') => {
  const baseData = {
    email: formData.email?.toLowerCase().trim(),
    firstName: formData.firstName?.trim() || formData.nombre?.trim(),
    lastName: formData.lastName?.trim() || formData.apellido?.trim(),
    source: source,
    tags: [source],
    customFields: {
      leadSource: source,
      subscriptionDate: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      language: 'es',
      country: 'CO'
    }
  };

  // Agregar datos del quiz si existen
  if (userAnswers) {
    baseData.tags.push('quiz_completed');
    baseData.customFields = {
      ...baseData.customFields,
      petTypePreference: userAnswers.petTypePreference,
      experienceLevel: userAnswers.experienceLevel,
      livingSpace: userAnswers.livingSpace,
      activityLevel: userAnswers.activityLevel,
      budgetLevel: userAnswers.budgetLevel,
      quizCompletedAt: new Date().toISOString()
    };

    // Tags específicos basados en respuestas
    if (userAnswers.petTypePreference) {
      baseData.tags.push(`prefers_${userAnswers.petTypePreference}`);
    }
    
    if (userAnswers.experienceLevel) {
      baseData.tags.push(`experience_${userAnswers.experienceLevel}`);
    }
  }

  return baseData;
};

export const calculateLeadScore = (userData, interactions = []) => {
  let score = 0;

  // Puntuación base por completitud de datos
  if (userData.firstName) score += 10;
  if (userData.lastName) score += 5;
  if (userData.email) score += 15;

  // Puntuación por quiz completado
  if (userData.customFields?.quizCompletedAt) score += 25;

  // Puntuación por interacciones
  score += interactions.length * 5;

  // Puntuación por engagement
  if (interactions.some(i => i.type === 'email_open')) score += 10;
  if (interactions.some(i => i.type === 'email_click')) score += 15;
  if (interactions.some(i => i.type === 'breed_comparison')) score += 20;

  return Math.min(100, score);
};

export const segmentUser = (userData) => {
  const segments = [];

  // Segmentación por tipo de mascota
  if (userData.customFields?.petTypePreference === 'dog') {
    segments.push('dog_lovers');
  } else if (userData.customFields?.petTypePreference === 'cat') {
    segments.push('cat_lovers');
  }

  // Segmentación por experiencia
  if (userData.customFields?.experienceLevel === 'beginner') {
    segments.push('beginners');
  } else if (userData.customFields?.experienceLevel === 'experienced') {
    segments.push('experienced_owners');
  }

  // Segmentación por engagement
  const leadScore = calculateLeadScore(userData);
  if (leadScore >= 70) segments.push('high_engagement');
  else if (leadScore >= 40) segments.push('medium_engagement');
  else segments.push('low_engagement');

  return segments;
};