// src/utils/breedMatcher.ts - Con corrección del error de tipos
import type { 
  BreedCharacteristics, 
  UserProfile, 
  BreedCompatibilityResult,
  QuizResults,
  EnhancedQuizResults, // 🆕 Agregar import
  Level,
  ExperienceLevel,
  CompatibilityCategory,
  EnhancedBreedCharacteristics,
  EnhancedUserProfile
} from '../types/breeds';

import { 
  calculateTotalBudgetImpact, 
  addBudgetChallenges, 
  addBudgetStrengths,
  generateBudgetCompatibilityAnalysis 
} from './budgetCalculator';

// ✅ PESOS ACTUALIZADOS CON PRESUPUESTO COP (ÚNICA DEFINICIÓN)
export const getDefaultWeights = () => ({
  size: 5,
  energyLevel: 8,
  independence: 7,
  noiseLevel: 6,
  grooming: 5,
  training: 5,
  goodWith: 9,
  healthIssues: 4,
  budget: 6,        // 🆕 NUEVO peso para presupuesto COP
  costLevel: 3      // Mantener para compatibilidad
});

// Pesos para el algoritmo mejorado
function getEnhancedWeights() {
  return {
    exercise: 10,
    homeAlone: 8,
    children: 9,
    budget: 7,
    noise: 6,
    grooming: 5,
    otherPets: 8,
    guardian: 4,
    size: 5,
    training: 6,
    health: 5
  };
}

// ALGORITMO BÁSICO (mantener para compatibilidad)

// Aplicar filtros excluyentes
export function applyFilters(breeds: BreedCharacteristics[], userProfile: UserProfile): BreedCharacteristics[] {
  let filteredBreeds = [...breeds];
  
  if (userProfile.petTypePreference !== 'any') {
    filteredBreeds = filteredBreeds.filter(breed => breed.type === userProfile.petTypePreference);
  }
  
  if (userProfile.allergies && userProfile.allergyLevel === 'yes_severe') {
    filteredBreeds = filteredBreeds.filter(breed => breed.hypoallergenic);
  }
  
  if (userProfile.homeType === 'apartment_small' && userProfile.petTypePreference === 'dog') {
    filteredBreeds = filteredBreeds.filter(breed => 
      breed.size === 'small' || 
      (breed.size === 'medium' && breed.energyLevel <= 3)
    );
  }
  
  if (userProfile.hoursAway >= 8 && userProfile.petTypePreference === 'dog') {
    filteredBreeds = filteredBreeds.filter(breed => 
      (breed as any).independenceLevel >= 3 || 
      breed.type === 'cat'
    );
  }
  
  return filteredBreeds;
}

// Calcular puntuación de compatibilidad (algoritmo básico)
export function calculateCompatibilityScore(breed: BreedCharacteristics, userProfile: UserProfile): number {
  let score = 0;
  let maxScore = 0;
  
  const weights = getDefaultWeights();
  
  // 🏠 COMPATIBILIDAD DE TAMAÑO
  if (userProfile.sizePreference === 'any' || userProfile.sizePreference === breed.size) {
    score += weights.size;
  } else if (
    (userProfile.sizePreference === 'medium' && breed.size === 'small') ||
    (userProfile.sizePreference === 'small' && breed.size === 'medium')
  ) {
    score += weights.size * 0.5;
  }
  maxScore += weights.size;
  
  // ⚡ COMPATIBILIDAD DE NIVEL DE ENERGÍA
  const energyDifference = Math.abs(userProfile.activityLevel - breed.energyLevel);
  if (energyDifference === 0) {
    score += weights.energyLevel;
  } else if (energyDifference === 1) {
    score += weights.energyLevel * 0.7;
  } else if (energyDifference === 2) {
    score += weights.energyLevel * 0.3;
  }
  maxScore += weights.energyLevel;
  
  // ⏰ COMPATIBILIDAD DE INDEPENDENCIA CON HORAS FUERA DE CASA
  const independenceScore = calculateIndependenceScore((breed as any).independenceLevel || 3, userProfile.hoursAway);
  score += independenceScore * weights.independence;
  maxScore += weights.independence;
  
  
  // 🔊 COMPATIBILIDAD DE NIVEL DE RUIDO
  const noiseScore = calculateNoiseScore((breed as any).noiseLevel || 3, userProfile.noiseToleranceLevel);
  score += noiseScore * weights.noiseLevel;
  maxScore += weights.noiseLevel;
  
  // 💅 COMPATIBILIDAD DE NECESIDADES DE ASEO
  const groomingScore = calculateGroomingScore(breed.grooming, userProfile.groomingWillingness);
  score += groomingScore * weights.grooming;
  maxScore += weights.grooming;
  
  // 🎓 COMPATIBILIDAD DE ENTRENAMIENTO CON EXPERIENCIA
  const trainingScore = calculateTrainingScore(breed.training, mapExperienceToLevel(userProfile.experience));
  score += trainingScore * weights.training;
  maxScore += weights.training;
  
  // 👨‍👩‍👧‍👦 COMPATIBILIDAD CON OTROS MIEMBROS DEL HOGAR
  const goodWithScore = calculateGoodWithScore(breed, userProfile);
  score += goodWithScore * weights.goodWith;
  maxScore += weights.goodWith;
  
  // 🏥 COMPATIBILIDAD DE PROBLEMAS DE SALUD
  const healthScore = calculateHealthScore((breed as any).healthIssues || 3);
  score += healthScore * weights.healthIssues;
  maxScore += weights.healthIssues;
  
  // 💰 NUEVA: Compatibilidad de presupuesto mejorada con COP
  const budgetScore = calculateBudgetCompatibilityScore(breed, userProfile);
  score += budgetScore * weights.budget;
  maxScore += weights.budget;
  
  // 💵 COMPATIBILIDAD DE COSTO GENERAL (mantener para compatibilidad)
  if ((breed as any).costLevel <= userProfile.budgetLevel) {
    score += weights.costLevel;
  } else if ((breed as any).costLevel - userProfile.budgetLevel === 1) {
    score += weights.costLevel * 0.5;
  }
  maxScore += weights.costLevel;
  
  return Math.round((score / maxScore) * 100);
}

// 🆕 NUEVA FUNCIÓN: Calcular compatibilidad de presupuesto COP
function calculateBudgetCompatibilityScore(breed: BreedCharacteristics, userProfile: UserProfile): number {
  const feedingPreference = (userProfile as any).feedingPreference || 'normal';
  
  try {
    const budgetAnalysis = generateBudgetCompatibilityAnalysis(userProfile, breed, feedingPreference);
    
    // Convertir nivel de riesgo a puntuación
    switch (budgetAnalysis.analysis.riskLevel) {
      case 'low':       return 1.0;  // 100% compatible
      case 'moderate':  return 0.8;  // 80% compatible  
      case 'high':      return 0.5;  // 50% compatible
      case 'very_high': return 0.2;  // 20% compatible
      default:          return 0.6;  // Por defecto
    }
  } catch (error) {
    console.warn('Error calculando compatibilidad de presupuesto:', error);
    return 0.6; // Valor por defecto
  }
}

// 🔧 ALGORITMO DE COMPATIBILIDAD MEJORADO PARA ENTRENAMIENTO

function calculateTrainingCompatibilityScore(breed: BreedCharacteristics, userProfile: UserProfile): number {
  // Si es gato, el entrenamiento es menos relevante
  if (breed.type === 'cat') {
    return 0.9; // Los gatos son naturalmente más independientes
  }
  
  // Para perros, evaluar nivel de entrenamiento vs disposición del usuario
  const userTrainingLevel = userProfile.trainingWillingness;
  const breedTrainingNeeds = breed.training;
  
  // 🆕 FALTA - Si el usuario puede pagar colegio canino (professional = 5)
  if (userTrainingLevel === 5) {
    return 1.0; // Puede manejar cualquier raza, incluso las más difíciles
  }
  
  // Si el usuario tiene disposición alta (4) y la raza necesita mucho (4-5)
  if (userTrainingLevel >= 4 && breedTrainingNeeds >= 4) {
    return 0.9; // Muy buena compatibilidad
  }
  
  // Cálculo estándar basado en diferencia
  const difference = userTrainingLevel - breedTrainingNeeds;
  
  if (difference >= 0) return 1.0;
  if (difference === -1) return 0.7;
  if (difference === -2) return 0.4;
  
  return 0.1;
}


// Algoritmo mejorado para cálculo de compatibilidad
export function enhancedCompatibilityScore(breed: EnhancedBreedCharacteristics, profile: EnhancedUserProfile): number {
  let score = 0;
  let maxScore = 0;
  
  const weights = getEnhancedWeights();
  
  // Compatibilidad de ejercicio
  const exerciseCompatibility = calculateExerciseCompatibility(breed, profile);
  score += exerciseCompatibility * weights.exercise;
  maxScore += weights.exercise;
  
  // Compatibilidad con tiempo solo en casa
  const homeAloneCompatibility = calculateHomeAloneCompatibility(breed, profile);
  score += homeAloneCompatibility * weights.homeAlone;
  maxScore += weights.homeAlone;
  
  // Compatibilidad con niños según edades específicas
  const childrenCompatibility = calculateDetailedChildrenCompatibility(breed, profile);
  score += childrenCompatibility * weights.children;
  maxScore += weights.children;
  
  // Compatibilidad de presupuesto con necesidades de mantenimiento
  const budgetCompatibility = calculateBudgetCompatibility(breed, profile);
  score += budgetCompatibility * weights.budget;
  maxScore += weights.budget;
  
  // Compatibilidad de vocalizaciones/ladridos
  const noiseCompatibility = calculateNoiseCompatibility(breed.barkingFrequency, profile.noisePreference);
  score += noiseCompatibility * weights.noise;
  maxScore += weights.noise;
  
  // Compatibilidad de cuidados del pelaje
  const groomingCompatibility = calculateDetailedGroomingCompatibility(breed, profile);
  score += groomingCompatibility * weights.grooming;
  maxScore += weights.grooming;
  
  // Compatibilidad con otras mascotas
  const petCompatibility = calculateDetailedPetCompatibility(breed, profile);
  score += petCompatibility * weights.otherPets;
  maxScore += weights.otherPets;
  
  // Compatibilidad de necesidades de guardián
  const guardianCompatibility = calculateGuardianCompatibility(breed.guardInstinct, profile.guardianNeeds);
  score += guardianCompatibility * weights.guardian;
  maxScore += weights.guardian;
  
  // Compatibilidad de tamaño
  const sizeCompatibility = calculateSizeCompatibility(breed.size, profile.sizePreference, profile.homeType);
  score += sizeCompatibility * weights.size;
  maxScore += weights.size;
  
  // Compatibilidad de entrenamiento
  const trainingCompatibility = calculateTrainingCompatibility(breed.training, profile.experience);
  score += trainingCompatibility * weights.training;
  maxScore += weights.training;
  
  return Math.round((score / maxScore) * 100);
}

// FUNCIONES AUXILIARES BÁSICAS



function calculateIndependenceScore(breedIndependence: Level, userHoursAway: number): number {
  if (userHoursAway <= 4) {
    return 1;
  }
  
  if (userHoursAway > 8) {
    return breedIndependence >= 4 ? 1 : 
           breedIndependence === 3 ? 0.6 : 
           breedIndependence === 2 ? 0.3 : 0;
  }
  
  return breedIndependence >= 3 ? 1 : 
         breedIndependence === 2 ? 0.7 : 0.4;
}

function calculateNoiseScore(breedNoise: Level, userTolerance: Level): number {
  const difference = userTolerance - breedNoise;
  
  if (difference >= 0) return 1;
  if (difference === -1) return 0.7;
  if (difference === -2) return 0.4;
  if (difference === -3) return 0.2;
  
  return 0;
}

function calculateGroomingScore(breedGrooming: Level, userWillingness: Level): number {
  const difference = userWillingness - breedGrooming;
  
  if (difference >= 0) return 1;
  if (difference === -1) return 0.7;
  if (difference === -2) return 0.3;
  
  return 0;
}

function calculateTrainingScore(breedTrainingNeeds: Level, userExperienceLevel: Level): number {
  const difference = userExperienceLevel - breedTrainingNeeds;
  
  if (difference >= 0) return 1;
  if (difference === -1) return 0.7;
  if (difference === -2) return 0.4;
  
  return 0.1;
}

function calculateHealthScore(healthIssues: Level): number {
  // Invertir: menos problemas de salud = mejor puntuación
  return (6 - healthIssues) / 5;
}

function mapExperienceToLevel(experience: ExperienceLevel): Level {
  switch (experience) {
    case 'experienced': return 5;
    case 'some_experience': return 3;
    case 'first_time':
    default: return 1;
  }
}

function calculateGoodWithScore(breed: BreedCharacteristics, userProfile: UserProfile): number {
  let score = 0;
  let factors = 0;
  
  if (userProfile.hasChildren) {
    factors++;
    const childrenAge = userProfile.childrenAge;
    if (breed.goodWith.includes('children')) {
      score += 1;
    } else if (childrenAge === 'teens' || childrenAge === 'older_children') {
      score += 0.5;
    }
  }
  
  if (userProfile.hasOtherPets) {
    factors++;
    const otherPets = userProfile.otherPets;
    
    if (otherPets === 'dogs' && breed.goodWith.includes('dogs')) {
      score += 1;
    } else if (otherPets === 'cats' && breed.goodWith.includes('cats')) {
      score += 1;
    } else if (otherPets === 'small_pets') {
      score += breed.type === 'cat' ? 0.3 : 
               breed.type === 'dog' && breed.energyLevel <= 2 ? 0.6 : 0.2;
    }
  }
  
  factors++;
  if (
    (userProfile.homeType === 'apartment_small' && breed.goodWith.includes('apartments')) ||
    (userProfile.homeType === 'apartment_large' && breed.goodWith.includes('apartments')) ||
    userProfile.homeType.includes('house')
  ) {
    score += 1;
  } else if (userProfile.homeType === 'apartment_large' && !breed.goodWith.includes('apartments')) {
    score += 0.5;
  }
  
  return factors > 0 ? score / factors : 1;
}

// FUNCIONES AUXILIARES MEJORADAS

// Compatibilidad con ejercicio
function calculateExerciseCompatibility(breed: EnhancedBreedCharacteristics, profile: EnhancedUserProfile): number {
  const userAvailableMinutes = mapWalkingTimeToMinutes(profile.walkingTime);
  const breedNeeds = breed.minimumExercise;
  
  if (userAvailableMinutes < breedNeeds * 0.7) {
    return 0.2;
  }
  
  if (userAvailableMinutes >= breedNeeds) {
    const intensityDiff = Math.abs(breed.exerciseIntensity - profile.activityLevel);
    if (intensityDiff <= 1) return 1;
    if (intensityDiff === 2) return 0.7;
    return 0.4;
  }
  
  return 0.5;
}

// Compatibilidad con tiempo solo
function calculateHomeAloneCompatibility(breed: EnhancedBreedCharacteristics, profile: EnhancedUserProfile): number {
  const hoursAlone = profile.hoursAway;
  
  if (breed.separationAnxietyProne >= 4 && hoursAlone > 6) {
    return 0.2;
  }
  
  if (breed.separationAnxietyProne === 3 && hoursAlone > 8) {
    return 0.4;
  }
  
  if (breed.separationAnxietyProne <= 2) {
    return 1;
  }
  
  return 0.7;
}

// Compatibilidad detallada con niños
function calculateDetailedChildrenCompatibility(breed: EnhancedBreedCharacteristics, profile: EnhancedUserProfile): number {
  if (!profile.childrenAges.includes('no_children')) {
    if (profile.childrenAges.includes('babies') || profile.childrenAges.includes('preschool')) {
      if (breed.energyLevel >= 4 && breed.size === 'large') {
        return 0.4;
      }
      
      if (breed.goodWith.includes('children')) {
        return 0.9;
      }
      
      return 0.5;
    }
    
    if (breed.goodWith.includes('children')) {
      return 1;
    }
    
    return 0.7;
  }
  
  return 1;
}

// Compatibilidad de presupuesto
function calculateBudgetCompatibility(breed: EnhancedBreedCharacteristics, profile: EnhancedUserProfile): number {
  let foodScore = 0;
  let healthScore = 0;
  
  // Puntuación de comida
  const foodNeedScore = mapSizeToFoodNeed(breed.size) * (breed.foodConsumption / 5);
  const userFoodBudgetScore = mapFoodBudgetToScore(profile.foodBudget);
  
  if (userFoodBudgetScore >= foodNeedScore) {
    foodScore = 1;
  } else if (userFoodBudgetScore >= foodNeedScore * 0.8) {
    foodScore = 0.8;
  } else if (userFoodBudgetScore >= foodNeedScore * 0.6) {
    foodScore = 0.5;
  } else {
    foodScore = 0.3;
  }
  
  // Puntuación de salud
  const healthNeedScore = breed.healthIssues / 5;
  const userHealthBudgetScore = mapHealthBudgetToScore(profile.healthcareBudget);
  
  if (userHealthBudgetScore >= healthNeedScore) {
    healthScore = 1;
  } else if (userHealthBudgetScore >= healthNeedScore * 0.7) {
    healthScore = 0.7;
  } else {
    healthScore = 0.4;
  }
  
  const hasCostlyIssues = breed.commonHealthIssues.some(issue => 
    ['displasia', 'cardiopatía', 'alergias crónicas'].includes(issue.toLowerCase())
  );
  
  if (hasCostlyIssues && profile.healthcareBudget === 'basic') {
    healthScore *= 0.6;
  }
  
  return (healthScore * 0.6) + (foodScore * 0.4);
}

// Compatibilidad de ruido/vocalizaciones
function calculateNoiseCompatibility(breedBarkingLevel: Level, userPreference: string): number {
  if (userPreference === 'silent' && breedBarkingLevel >= 4) {
    return 0.2;
  }
  
  if (userPreference === 'vocal_ok') {
    return 1;
  }
  
  if (userPreference === 'moderate_alert' && breedBarkingLevel <= 3) {
    return 1;
  }
  
  if (userPreference === 'moderate_alert' && breedBarkingLevel >= 4) {
    return 0.6;
  }
  
  if (userPreference === 'silent' && breedBarkingLevel <= 2) {
    return 1;
  }
  
  return 0.5;
}

// Compatibilidad de cuidados del pelaje
function calculateDetailedGroomingCompatibility(breed: EnhancedBreedCharacteristics, profile: EnhancedUserProfile): number {
  let groomingScore = 0;
  let shedScore = 0;
  
  // Compatibilidad de cuidados básicos
  const groomingDiff = profile.groomingWillingness - breed.grooming;
  if (groomingDiff >= 0) {
    groomingScore = 1;
  } else if (groomingDiff === -1) {
    groomingScore = 0.7;
  } else {
    groomingScore = 0.3;
  }
  
  // Compatibilidad con caída de pelo
  const shedDiff = profile.shedTolerance - breed.shedLevel;
  if (shedDiff >= 0) {
    shedScore = 1;
  } else if (shedDiff === -1) {
    shedScore = 0.6;
  } else {
    shedScore = 0.2;
  }
  
  return (groomingScore * 0.6) + (shedScore * 0.4);
}

// Compatibilidad con otras mascotas
function calculateDetailedPetCompatibility(breed: EnhancedBreedCharacteristics, profile: EnhancedUserProfile): number {
  if (!profile.hasOtherPets) {
    return 1;
  }
  
  if (profile.otherPets === 'dogs' && breed.goodWith.includes('dogs')) {
    return 1;
  }
  
  if (profile.otherPets === 'cats') {
    if (breed.goodWith.includes('cats') && breed.preyDrive <= 2) {
      return 1;
    } else if (breed.preyDrive >= 4) {
      return 0.2;
    } else {
      return 0.6;
    }
  }
  
  if (profile.otherPets === 'small_pets') {
    if (breed.preyDrive <= 2) {
      return 0.8;
    } else if (breed.preyDrive >= 4) {
      return 0.1;
    } else {
      return 0.4;
    }
  }
  
  return 0.5;
}

// Compatibilidad de necesidades de guardián
function calculateGuardianCompatibility(breedGuardInstinct: Level, userNeeds: string): number {
  if (userNeeds === 'not_important') {
    return breedGuardInstinct <= 3 ? 1 : 0.7;
  }
  
  if (userNeeds === 'moderate') {
    return breedGuardInstinct >= 2 && breedGuardInstinct <= 4 ? 1 : 0.6;
  }
  
  if (userNeeds === 'important') {
    return breedGuardInstinct >= 4 ? 1 : 0.4;
  }
  
  return 0.5;
}

// Compatibilidad de tamaño mejorada
function calculateSizeCompatibility(breedSize: string, userPreference: string, homeType: string): number {
  if (userPreference === 'any') return 1;
  
  if (userPreference === breedSize) {
    return 1;
  }
  
  // Penalizar perros grandes en apartamentos pequeños
  if (homeType === 'apartment_small' && breedSize === 'large') {
    return 0.2;
  }
  
  // Compatibilidad parcial para tamaños cercanos
  if ((userPreference === 'medium' && breedSize === 'small') ||
      (userPreference === 'small' && breedSize === 'medium')) {
    return 0.7;
  }
  
  return 0.4;
}

// Compatibilidad de entrenamiento mejorada
function calculateTrainingCompatibility(breedTraining: Level, userExperience: string): number {
  // Convertir string a ExperienceLevel usando mapExperienceToLevel
  const experienceLevel = mapExperienceToLevel(userExperience as ExperienceLevel);
  const diff = experienceLevel - breedTraining;
  
  if (diff >= 0) return 1;
  if (diff === -1) return 0.7;
  if (diff === -2) return 0.4;
  
  return 0.2;
}

// FUNCIONES DE MAPEO

function mapWalkingTimeToMinutes(walkingTime: string): number {
  switch (walkingTime) {
    case 'minimal': return 20;
    case 'moderate': return 45;
    case 'active': return 90;
    case 'very_active': return 150;
    default: return 30;
  }
}

function mapFoodBudgetToScore(budget: string): number {
  switch (budget) {
    case 'economic': return 1;
    case 'medium': return 2;
    case 'premium': return 3;
    case 'no_limit': return 5;
    default: return 2;
  }
}

function mapHealthBudgetToScore(budget: string): number {
  switch (budget) {
    case 'basic': return 1;
    case 'moderate': return 2;
    case 'significant': return 3;
    case 'unlimited': return 5;
    default: return 2;
  }
}

function mapSizeToFoodNeed(size: string): number {
  switch (size) {
    case 'small': return 1;
    case 'medium': return 2;
    case 'large': return 3;
    default: return 2;
  }
}

// FUNCIONES PRINCIPALES DE RECOMENDACIÓN

function getCompatibilityCategory(score: number): CompatibilityCategory {
  if (score >= 85) return 'excelente';
  if (score >= 70) return 'muy buena';
  if (score >= 55) return 'buena';
  if (score >= 40) return 'moderada';
  return 'baja';
}

// Función principal que retorna recomendaciones (algoritmo básico)
export function getBreedRecommendations(userProfile: UserProfile, allBreeds: BreedCharacteristics[]): QuizResults {
  const eligibleBreeds = applyFilters(allBreeds, userProfile);
  
  if (eligibleBreeds.length === 0) {
    return getRelaxedRecommendations(userProfile, allBreeds);
  }
  
  const scoredBreeds = eligibleBreeds.map(breed => {
    const compatibilityScore = calculateCompatibilityScore(breed, userProfile);
    const compatibilityCategory = getCompatibilityCategory(compatibilityScore);
    const strengths = identifyStrengths(breed, userProfile);
    const challenges = identifyChallenges(breed, userProfile);
    
    return {
      breed,
      compatibilityScore,
      compatibilityCategory,
      strengths,
      challenges,
      userProfile
    };
  });
  
  const recommendations = scoredBreeds
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 5);
  
  return {
    topMatch: recommendations[0],
    allRecommendations: recommendations
  };
}

// Función de recomendación mejorada
export function getEnhancedBreedRecommendations(userProfile: UserProfile, allBreeds: BreedCharacteristics[]): EnhancedQuizResults {
  const eligibleBreeds = applyFilters(allBreeds, userProfile);
  
  const scoredBreeds = eligibleBreeds.map(breed => {
    const compatibilityScore = calculateCompatibilityScore(breed, userProfile);
    const compatibilityCategory = getCompatibilityCategory(compatibilityScore);
    const strengths = identifyStrengths(breed, userProfile);
    const challenges = identifyChallenges(breed, userProfile);
    
    return {
      breed,
      compatibilityScore,
      compatibilityCategory,
      strengths,
      challenges,
      userProfile
    };
  });
  
  const sortedRecommendations = scoredBreeds.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
  return {
    topMatch: sortedRecommendations[0],           // 🎯 Recomendación principal
    alternativeMatches: sortedRecommendations.slice(1, 3), // 🔄 2 alternativas
    allRecommendations: sortedRecommendations.slice(0, 5),
    comparisonSuggestions: sortedRecommendations.slice(0, 3) // 🔍 Para comparador
  };
}

// Filtros mejorados
function applyEnhancedFilters(breeds: EnhancedBreedCharacteristics[], userProfile: EnhancedUserProfile): EnhancedBreedCharacteristics[] {
  let filteredBreeds = [...breeds];
  
  if (userProfile.petTypePreference !== 'any') {
    filteredBreeds = filteredBreeds.filter(breed => breed.type === userProfile.petTypePreference);
  }
  
  if (userProfile.allergies && userProfile.allergyLevel === 'yes_severe') {
    filteredBreeds = filteredBreeds.filter(breed => breed.hypoallergenic);
  }
  
  if (userProfile.homeType === 'apartment_small') {
    filteredBreeds = filteredBreeds.filter(breed => 
      breed.size === 'small' || 
      (breed.size === 'medium' && breed.energyLevel <= 3) ||
      breed.goodWith.includes('apartments')
    );
  }
  
  // Filtro crítico de ejercicio
  const userExerciseMinutes = mapWalkingTimeToMinutes(userProfile.walkingTime);
  filteredBreeds = filteredBreeds.filter(breed => 
    userExerciseMinutes >= breed.minimumExercise * 0.6
  );
  
  // Filtro de ansiedad por separación crítica
  if (userProfile.hoursAway >= 10) {
    filteredBreeds = filteredBreeds.filter(breed => 
      breed.separationAnxietyProne <= 3 || breed.type === 'cat'
    );
  }
  
  return filteredBreeds;
}

// Funciones para identificar fortalezas y desafíos básicos
export function identifyStrengths(breed: BreedCharacteristics, userProfile: UserProfile): string[] {
  const strengths: string[] = [];
  
  if (breed.size === userProfile.sizePreference || userProfile.sizePreference === 'any') {
    if (breed.size === 'small') {
      strengths.push('Tamaño pequeño, ideal para espacios reducidos');
    } else if (breed.size === 'medium') {
      strengths.push('Tamaño mediano, equilibrado para diversos espacios');
    } else if (breed.size === 'large' && userProfile.homeType.includes('house')) {
      strengths.push('Tamaño grande, ideal para casas con espacio');
    }
  }
  
  if (Math.abs(breed.energyLevel - userProfile.activityLevel) <= 1) {
    if (breed.energyLevel >= 4 && userProfile.activityLevel >= 4) {
      strengths.push('Alta energía, perfecto para personas activas');
    } else if (breed.energyLevel <= 2 && userProfile.activityLevel <= 2) {
      strengths.push('Tranquilo y calmado, ideal para un estilo de vida relajado');
    } else {
      strengths.push('Nivel de energía equilibrado que se adapta a tu estilo de vida');
    }
  }
  
  if (userProfile.hasChildren && breed.goodWith.includes('children')) {
    strengths.push('Excelente con niños, paciente y tolerante');
  }
  
  if (userProfile.hasOtherPets) {
    if (
      (userProfile.otherPets === 'dogs' && breed.goodWith.includes('dogs')) ||
      (userProfile.otherPets === 'cats' && breed.goodWith.includes('cats'))
    ) {
      strengths.push(`Se lleva bien con otros ${userProfile.otherPets === 'dogs' ? 'perros' : 'gatos'}`);
    }
  }
  
  if (breed.training <= mapExperienceToLevel(userProfile.experience)) {
    if (breed.training <= 2) {
      strengths.push('Fácil de entrenar, ideal para dueños primerizos');
    } else if (breed.training <= 3) {
      strengths.push('Nivel de entrenamiento moderado, adecuado para tu experiencia');
    }
  }
  
  if (breed.grooming <= userProfile.groomingWillingness) {
    if (breed.grooming <= 2) {
      strengths.push('Bajo mantenimiento, necesita mínimos cuidados de aseo');
    }
  }
  
  if (userProfile.hoursAway >= 6 && (breed as any).independenceLevel >= 4) {
    strengths.push('Independiente, puede quedarse solo durante tus horas de trabajo');
  } else if (userProfile.hoursAway <= 4 && (breed as any).independenceLevel <= 2) {
    strengths.push('Disfruta de la compañía constante, perfecto para tu disponibilidad');
  }
  
  if (userProfile.allergies && breed.hypoallergenic) {
    strengths.push('Hipoalergénico, menos probabilidades de causar reacciones alérgicas');
  }
  
  if ((breed as any).noiseLevel <= userProfile.noiseToleranceLevel) {
    if ((breed as any).noiseLevel <= 2) {
      strengths.push('Tranquilo, no suele ser ruidoso');
    }
  }
  
  if ((breed as any).costLevel <= userProfile.budgetLevel) {
    if ((breed as any).costLevel <= 2) {
      strengths.push('Económico de mantener, se ajusta a tu presupuesto');
    }
  }
  
  // 💰 INTEGRAR ANÁLISIS DE PRESUPUESTO COP
  return addBudgetStrengths(breed, userProfile, strengths);
}

export function identifyChallenges(breed: BreedCharacteristics, userProfile: UserProfile): string[] {
  const challenges: string[] = [];
  
  if (userProfile.sizePreference !== 'any' && breed.size !== userProfile.sizePreference) {
    if (breed.size === 'large' && userProfile.sizePreference === 'small') {
      challenges.push('Más grande de lo que prefieres, necesitará más espacio');
    } else if (breed.size === 'small' && userProfile.sizePreference === 'large') {
      challenges.push('Más pequeño de lo que prefieres, aunque más adaptable a espacios reducidos');
    }
  }
  
  if (Math.abs(breed.energyLevel - userProfile.activityLevel) >= 2) {
    if (breed.energyLevel > userProfile.activityLevel) {
      challenges.push('Necesita más ejercicio del que normalmente realizas');
    } else {
      challenges.push('Podría no seguir tu ritmo de actividad física');
    }
  }
  
  if (userProfile.hasChildren && !breed.goodWith.includes('children')) {
    challenges.push('Requiere supervisión con niños, ya que no es su punto fuerte');
  }
  
  if (userProfile.hasOtherPets) {
    if (
      (userProfile.otherPets === 'dogs' && !breed.goodWith.includes('dogs')) ||
      (userProfile.otherPets === 'cats' && !breed.goodWith.includes('cats'))
    ) {
      challenges.push(`Puede necesitar socialización para convivir con tus ${userProfile.otherPets === 'dogs' ? 'perros' : 'gatos'}`);
    }
  }
  
  if (breed.training > mapExperienceToLevel(userProfile.experience)) {
    if (breed.training >= 4) {
      challenges.push('Requiere entrenamiento constante y experiencia, puede ser desafiante');
    } else {
      challenges.push('Necesitarás algo de paciencia durante el entrenamiento');
    }
  }
  
  if (breed.grooming > userProfile.groomingWillingness) {
    if (breed.grooming >= 4) {
      challenges.push('Necesita cuidados de aseo frecuentes, más de lo que habías considerado');
    } else {
      challenges.push('Requiere algo más de cuidados de los que prefieres');
    }
  }
  
  if (userProfile.hoursAway >= 8 && (breed as any).independenceLevel <= 2) {
    challenges.push('Puede sufrir ansiedad por separación si pasa muchas horas solo');
  }
  
  if (userProfile.allergies && !breed.hypoallergenic) {
    challenges.push('No es hipoalergénico, puede provocar reacciones alérgicas');
  }
  
  if ((breed as any).noiseLevel > userProfile.noiseToleranceLevel) {
    if ((breed as any).noiseLevel >= 4) {
      challenges.push('Tiende a ser vocal, puede ser más ruidoso de lo que prefieres');
    } else {
      challenges.push('Puede ser algo más ruidoso de lo ideal para ti');
    }
  }
  
  if ((breed as any).costLevel > userProfile.budgetLevel) {
    if ((breed as any).costLevel >= 4) {
      challenges.push('Mantenimiento costoso, superior a tu presupuesto ideal');
    } else {
      challenges.push('Puede requerir algo más de presupuesto del previsto');
    }
  }
  
  if ((breed as any).healthIssues >= 4) {
    challenges.push('Predisposición a ciertos problemas de salud, consulta con el veterinario');
  }
  
  // 💰 INTEGRAR ANÁLISIS DE PRESUPUESTO COP
  return addBudgetChallenges(breed, userProfile, challenges);
}

// Funciones de identificación de fortalezas y desafíos mejoradas
function identifyEnhancedStrengths(breed: EnhancedBreedCharacteristics, userProfile: EnhancedUserProfile): string[] {
  // Implementación simplificada para evitar errores
  return identifyStrengths(breed, userProfile);
}

function identifyEnhancedChallenges(breed: EnhancedBreedCharacteristics, userProfile: EnhancedUserProfile): string[] {
  // Implementación simplificada para evitar errores
  return identifyChallenges(breed, userProfile);
}

// Función para casos donde no hay coincidencias con criterios estrictos (básica)
function getRelaxedRecommendations(userProfile: UserProfile, allBreeds: BreedCharacteristics[]): QuizResults {
  const relaxedBreeds = allBreeds.filter(breed => {
    if (userProfile.petTypePreference !== 'any') {
      return breed.type === userProfile.petTypePreference;
    }
    return true;
  });
  
  const scoredBreeds = relaxedBreeds.map(breed => {
    const compatibilityScore = calculateCompatibilityScore(breed, userProfile);
    const compatibilityCategory = getCompatibilityCategory(compatibilityScore);
    const strengths = identifyStrengths(breed, userProfile);
    const challenges = identifyChallenges(breed, userProfile);
    
    challenges.unshift('Esta raza no cumple con todos tus criterios ideales, pero podría ser una opción a considerar');
    
    return {
      breed,
      compatibilityScore,
      compatibilityCategory,
      strengths,
      challenges,
      userProfile
    };
  });
  
  const recommendations = scoredBreeds
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 5);
  
  return {
    topMatch: recommendations[0],
    allRecommendations: recommendations
  };
}

// Función para casos donde no hay coincidencias con criterios estrictos (mejorada)
function getRelaxedEnhancedRecommendations(userProfile: EnhancedUserProfile, allBreeds: EnhancedBreedCharacteristics[]): QuizResults {
  const relaxedBreeds = allBreeds.filter(breed => {
    if (userProfile.petTypePreference !== 'any') {
      return breed.type === userProfile.petTypePreference;
    }
    return true;
  });
  
  const scoredBreeds = relaxedBreeds.map(breed => {
    const compatibilityScore = enhancedCompatibilityScore(breed, userProfile);
    const compatibilityCategory = getCompatibilityCategory(compatibilityScore);
    const strengths = identifyEnhancedStrengths(breed, userProfile);
    const challenges = identifyEnhancedChallenges(breed, userProfile);
    
    challenges.unshift('Esta raza no cumple con todos tus criterios ideales, pero con los cuidados adecuados podría funcionar');
    
    return {
      breed,
      compatibilityScore,
      compatibilityCategory,
      strengths,
      challenges,
      userProfile
    };
  });
  
  const recommendations = scoredBreeds
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 5);
  
  return {
    topMatch: recommendations[0],
    allRecommendations: recommendations
  };
}