// src/api/addsent/config.js - CONFIGURACIÓN CENTRAL
export const addSentConfig = {
  apiKey: import.meta.env.ADDSENT_API_KEY,
  apiUrl: import.meta.env.ADDSENT_API_URL || 'https://api.addsent.com/v1',
  
  // IDs de listas por segmento
  lists: {
    general: import.meta.env.ADDSENT_LIST_GENERAL,
    dogLovers: import.meta.env.ADDSENT_LIST_DOG_LOVERS,
    catLovers: import.meta.env.ADDSENT_LIST_CAT_LOVERS,
    beginners: import.meta.env.ADDSENT_LIST_BEGINNERS,
    experienced: import.meta.env.ADDSENT_LIST_EXPERIENCED
  },
  
  // Templates de email
  templates: {
    welcome: import.meta.env.ADDSENT_TEMPLATE_WELCOME,
    quizResults: import.meta.env.ADDSENT_TEMPLATE_QUIZ_RESULTS,
    breedComparison: import.meta.env.ADDSENT_TEMPLATE_BREED_COMPARISON
  },
  
  // Configuración de tags
  tags: {
    sources: ['quiz_completed', 'breed_comparison', 'newsletter_signup'],
    petTypes: ['prefers_dogs', 'prefers_cats', 'prefers_both'],
    experience: ['beginner', 'intermediate', 'experienced'],
    interests: ['training', 'health', 'nutrition', 'grooming']
  }
};