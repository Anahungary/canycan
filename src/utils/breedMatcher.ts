// src/utils/breedMatcher.ts - VERSIÓN LIMPIA SIN DUPLICADOS
import type { 
  BreedCharacteristics, 
  UserProfile, 
  BreedCompatibilityResult,
  QuizResults,
  EnhancedQuizResults,
  Level,
  ExperienceLevel,
  CompatibilityCategory
} from '../types/breeds';

import { 
  calculateTotalBudgetImpact, 
  addBudgetChallenges, 
  addBudgetStrengths,
  generateBudgetCompatibilityAnalysis 
} from './budgetCalculator';

import { COLOMBIAN_BREED_IDS, isAvailableInColombia } from './colombianBreeds';

// 🇨🇴 TIPO PARA RESULTADO DUAL
export interface DualBreedRecommendationResult {
  // Mejor opción disponible en Colombia
  colombianRecommendation: BreedCompatibilityResult;
  // Mejor opción global (puede no estar en Colombia)
  globalRecommendation: BreedCompatibilityResult;
  // Alternativas colombianas
  colombianAlternatives: BreedCompatibilityResult[];
  // Información de disponibilidad
  availability: {
    isColombianSameAsGlobal: boolean;    // ¿La colombiana ES la global?
    colombianRank: number;               // Posición de la colombiana en ranking global
    globalRank: number;                  // Siempre 1 (es la #1)
    scoreDifference: number;             // Diferencia de puntaje
    message: string;                     // Mensaje explicativo
  };
}

// 🔧 TIPO TEMPORAL PARA CÁLCULOS INTERNOS
interface BreedCompatibilityResultWithAvailability extends BreedCompatibilityResult {
  isColombianAvailable: boolean;
}

// ✅ PESOS OPTIMIZADOS DEL ALGORITMO
export const getDefaultWeights = () => ({
  size: 5,
  energyLevel: 8,
  independence: 7,
  noiseLevel: 6,
  grooming: 5,
  training: 5,
  goodWith: 9,
  healthIssues: 4,
  budget: 7,        // 🆕 Peso incrementado para presupuesto COP
  costLevel: 3
});

// 🧮 ALGORITMO PRINCIPAL DE COMPATIBILIDAD (MEJORADO)
export function calculateCompatibilityScore(breed: BreedCharacteristics, userProfile: UserProfile): number {
  let score = 0;
  let maxScore = 0;
  
  const weights = getDefaultWeights();
  
  // 🏠 COMPATIBILIDAD DE TAMAÑO (Mejorada)
  const sizeScore = calculateSizeCompatibility(breed.size, userProfile.sizePreference, userProfile.homeType);
  score += sizeScore * weights.size;
  maxScore += weights.size;
  
  // ⚡ COMPATIBILIDAD DE NIVEL DE ENERGÍA (Mejorada)
  const energyScore = calculateEnergyCompatibility(breed.energyLevel, userProfile.activityLevel, userProfile.hoursAway);
  score += energyScore * weights.energyLevel;
  maxScore += weights.energyLevel;
  
  // ⏰ COMPATIBILIDAD DE INDEPENDENCIA
  const independenceScore = calculateIndependenceScore((breed as any).independenceLevel || 3, userProfile.hoursAway);
  score += independenceScore * weights.independence;
  maxScore += weights.independence;
  
  // 🔊 COMPATIBILIDAD DE NIVEL DE RUIDO (Mejorada)
  const noiseScore = calculateNoiseCompatibility(breed, userProfile);
  score += noiseScore * weights.noiseLevel;
  maxScore += weights.noiseLevel;
  
  // 💅 COMPATIBILIDAD DE NECESIDADES DE ASEO (Mejorada)
  const groomingScore = calculateGroomingCompatibility(breed.grooming, userProfile.groomingWillingness, userProfile.budgetLevel);
  score += groomingScore * weights.grooming;
  maxScore += weights.grooming;
  
  // 🎓 COMPATIBILIDAD DE ENTRENAMIENTO (Mejorada)
  const trainingScore = calculateTrainingCompatibility(breed, userProfile);
  score += trainingScore * weights.training;
  maxScore += weights.training;
  
  // 👨‍👩‍👧‍👦 COMPATIBILIDAD CON HOGAR (Mejorada)
  const goodWithScore = calculateFamilyCompatibility(breed, userProfile);
  score += goodWithScore * weights.goodWith;
  maxScore += weights.goodWith;
  
  // 🏥 COMPATIBILIDAD DE SALUD (Mejorada)
  const healthScore = calculateHealthCompatibility((breed as any).healthIssues || 3, userProfile.budgetLevel);
  score += healthScore * weights.healthIssues;
  maxScore += weights.healthIssues;
  
  // 💰 COMPATIBILIDAD DE PRESUPUESTO COP (Nueva y mejorada)
  const budgetScore = calculateBudgetCompatibilityScore(breed, userProfile);
  score += budgetScore * weights.budget;
  maxScore += weights.budget;
  
  // 💵 COMPATIBILIDAD DE COSTO GENERAL (Mantenido para compatibilidad)
  const costScore = calculateCostCompatibility((breed as any).costLevel || 3, userProfile.budgetLevel);
  score += costScore * weights.costLevel;
  maxScore += weights.costLevel;
  
  return Math.round((score / maxScore) * 100);
}

// 🏠 COMPATIBILIDAD DE TAMAÑO MEJORADA
function calculateSizeCompatibility(breedSize: string, userPreference: string, homeType: string): number {
  if (userPreference === 'any') return 1.0;
  
  // Coincidencia exacta
  if (userPreference === breedSize) return 1.0;
  
  // 🚨 PENALIZACIONES CRÍTICAS
  // Perro grande en apartamento pequeño = problema serio
  if (homeType === 'apartment_small' && breedSize === 'large') {
    return 0.1;
  }
  
  // Perro grande en apartamento grande = posible pero no ideal
  if (homeType === 'apartment_large' && breedSize === 'large') {
    return 0.5;
  }
  
  // Compatibilidades parciales
  if ((userPreference === 'medium' && breedSize === 'small') ||
      (userPreference === 'small' && breedSize === 'medium')) {
    return 0.7;
  }
  
  if ((userPreference === 'large' && breedSize === 'medium') ||
      (userPreference === 'medium' && breedSize === 'large')) {
    return 0.6;
  }
  
  return 0.3;
}

// ⚡ COMPATIBILIDAD DE ENERGÍA MEJORADA
function calculateEnergyCompatibility(breedEnergy: Level, userActivity: Level, hoursAway: number): number {
  const energyDifference = Math.abs(userActivity - breedEnergy);
  
  // Coincidencia perfecta
  if (energyDifference === 0) return 1.0;
  
  // 🚨 INCOMPATIBILIDADES CRÍTICAS
  // Usuario sedentario + perro muy activo = desastre
  if (userActivity <= 2 && breedEnergy >= 4) {
    return 0.1;
  }
  
  // Usuario muy activo + mascota sedentaria = aburrimiento
  if (userActivity >= 4 && breedEnergy <= 2) {
    return 0.3;
  }
  
  // ⏰ FACTOR TIEMPO DISPONIBLE
  // Si pasa muchas horas fuera, mejor mascota menos enérgica
  if (hoursAway >= 8 && breedEnergy >= 4) {
    return 0.2;
  }
  
  // Diferencias tolerables
  if (energyDifference === 1) return 0.8;
  if (energyDifference === 2) return 0.5;
  
  return 0.2;
}

// 🔊 COMPATIBILIDAD DE RUIDO MEJORADA
function calculateNoiseCompatibility(breed: BreedCharacteristics, userProfile: UserProfile): number {
  // Los gatos son naturalmente más silenciosos
  if (breed.type === 'cat') {
    return userProfile.noiseToleranceLevel >= 2 ? 1.0 : 0.8;
  }
  
  const breedNoise = (breed as any).noiseLevel || 3;
  const userTolerance = userProfile.noiseToleranceLevel;
  
  // 🚨 INCOMPATIBILIDADES CRÍTICAS
  // Apartamento + perro muy ladrador = problemas con vecinos
  if ((userProfile.homeType === 'apartment_small' || userProfile.homeType === 'apartment_large') 
      && breedNoise >= 4 && userTolerance <= 2) {
    return 0.1;
  }
  
  const noiseDifference = userTolerance - breedNoise;
  
  if (noiseDifference >= 0) return 1.0;
  if (noiseDifference === -1) return 0.6;
  if (noiseDifference === -2) return 0.3;
  
  return 0.1;
}

// 💅 COMPATIBILIDAD DE GROOMING MEJORADA
function calculateGroomingCompatibility(breedGrooming: Level, userWillingness: Level, userBudget: Level): number {
  const groomingDifference = userWillingness - breedGrooming;
  
  // 🚨 INCOMPATIBILIDAD CRÍTICA
  // Raza muy demandante + usuario sin tiempo/dinero = descuido
  if (breedGrooming >= 4 && userWillingness <= 2 && userBudget <= 2) {
    return 0.1;
  }
  
  // Compensación con presupuesto alto (puede pagar grooming profesional)
  if (groomingDifference < 0 && userBudget >= 4) {
    return 0.7;
  }
  
  if (groomingDifference >= 0) return 1.0;
  if (groomingDifference === -1) return 0.6;
  if (groomingDifference === -2) return 0.3;
  
  return 0.1;
}

// 🎓 COMPATIBILIDAD DE ENTRENAMIENTO MEJORADA
function calculateTrainingCompatibility(breed: BreedCharacteristics, userProfile: UserProfile): number {
  // Los gatos requieren menos entrenamiento formal
  if (breed.type === 'cat') {
    return 0.9;
  }
  
  const breedTrainingNeeds = breed.training;
  const userTrainingWillingness = userProfile.trainingWillingness;
  
  // 🎯 USUARIO CON NIVEL PROFESIONAL puede manejar cualquier raza
  if (userTrainingWillingness === 5) {
    return 1.0;
  }
  
  // 🚨 INCOMPATIBILIDADES CRÍTICAS
  // Principiante + raza muy difícil = frustración y abandono
  if (userProfile.experience === 'first_time' && breedTrainingNeeds >= 4) {
    return 0.1;
  }
  
  const trainingDifference = userTrainingWillingness - breedTrainingNeeds;
  
  if (trainingDifference >= 0) return 1.0;
  if (trainingDifference === -1) return 0.6;
  if (trainingDifference === -2) return 0.3;
  
  return 0.1;
}

// 👨‍👩‍👧‍👦 COMPATIBILIDAD FAMILIAR MEJORADA
function calculateFamilyCompatibility(breed: BreedCharacteristics, userProfile: UserProfile): number {
  let score = 0;
  let factors = 0;
  
  // 👶 COMPATIBILIDAD CON NIÑOS
  if (userProfile.hasChildren) {
    factors++;
    
    if (breed.goodWith && breed.goodWith.includes('children')) {
      score += 1.0;
    } else {
      // 🚨 CRÍTICO: Razas no recomendadas con niños pequeños
      if (userProfile.childrenAge === 'young_children') {
        score += 0.1;  // Muy peligroso
      } else if (userProfile.childrenAge === 'older_children') {
        score += 0.4;  // Posible con supervisión
      } else {
        score += 0.6;  // Adolescentes pueden manejar mejor
      }
    }
  }
  
  // 🐕🐱 COMPATIBILIDAD CON OTRAS MASCOTAS
  if (userProfile.hasOtherPets && userProfile.otherPets !== 'no_pets') {
    factors++;
    
    const otherPetsArray = Array.isArray(userProfile.otherPets) 
      ? userProfile.otherPets 
      : [userProfile.otherPets];
    
    let petCompatibilityScore = 0;
    
    for (const otherPet of otherPetsArray) {
      if (breed.goodWith && otherPet === 'dogs' && breed.goodWith.includes('dogs')) {
        petCompatibilityScore += 1.0;
      } else if (breed.goodWith && otherPet === 'cats' && breed.goodWith.includes('cats')) {
        petCompatibilityScore += 1.0;
      } else if (otherPet === 'small_pets') {
        // Gatos y perros tranquilos pueden convivir con mascotas pequeñas
        petCompatibilityScore += breed.type === 'cat' ? 0.4 : 
                               breed.energyLevel <= 2 ? 0.6 : 0.2;
      } else {
        petCompatibilityScore += 0.3; // Posible con socialización
      }
    }
    
    score += petCompatibilityScore / otherPetsArray.length;
  }
  
  // 🏠 COMPATIBILIDAD CON TIPO DE HOGAR
  factors++;
  if (userProfile.homeType === 'apartment_small' || userProfile.homeType === 'apartment_large') {
    if (breed.goodWith && breed.goodWith.includes('apartments')) {
      score += 1.0;
    } else if (breed.size === 'small' || (breed.size === 'medium' && breed.energyLevel <= 3)) {
      score += 0.7;
    } else {
      score += 0.2;
    }
  } else {
    score += 1.0; // Casas son más flexibles
  }
  
  return factors > 0 ? score / factors : 1.0;
}

// Funciones auxiliares existentes (mejoradas)
function calculateIndependenceScore(breedIndependence: Level, userHoursAway: number): number {
  if (userHoursAway <= 4) return 1.0;
  
  // 🚨 CRÍTICO: Razas dependientes + muchas horas solas = ansiedad severa
  if (userHoursAway >= 10 && breedIndependence <= 2) {
    return 0.1;
  }
  
  if (userHoursAway > 8) {
    return breedIndependence >= 4 ? 1.0 : 
           breedIndependence === 3 ? 0.5 : 
           breedIndependence === 2 ? 0.2 : 0.1;
  }
  
  return breedIndependence >= 3 ? 1.0 : 
         breedIndependence === 2 ? 0.7 : 0.4;
}

function calculateHealthCompatibility(healthIssues: Level, userBudget: Level): number {
  // Invertir: menos problemas = mejor puntuación
  const baseScore = (6 - healthIssues) / 5;
  
  // 🚨 CRÍTICO: Razas con muchos problemas + presupuesto bajo = descuido médico
  if (healthIssues >= 4 && userBudget <= 2) {
    return baseScore * 0.3;
  }
  
  // Compensación con presupuesto alto
  if (healthIssues >= 3 && userBudget >= 4) {
    return Math.min(baseScore * 1.2, 1.0);
  }
  
  return baseScore;
}

function calculateCostCompatibility(breedCostLevel: Level, userBudget: Level): number {
  const costDifference = userBudget - breedCostLevel;
  
  if (costDifference >= 0) return 1.0;
  if (costDifference === -1) return 0.6;
  if (costDifference === -2) return 0.3;
  
  return 0.1;
}

// 💰 COMPATIBILIDAD DE PRESUPUESTO COP MEJORADA (CON VALIDACIONES)
function calculateBudgetCompatibilityScore(breed: BreedCharacteristics, userProfile: UserProfile): number {
  try {
    // Validar que tenemos datos mínimos
    if (!breed || !userProfile) {
      console.warn('Datos insuficientes para calcular compatibilidad de presupuesto');
      return 0.5; // Valor neutral
    }

    // Normalizar feedingPreference si no existe
    const feedingPreference = (userProfile as any).feedingPreference || 'standard';
    
    const budgetAnalysis = generateBudgetCompatibilityAnalysis(
      userProfile, 
      breed, 
      feedingPreference
    );
    
    // Convertir riesgo a puntuación con penalizaciones más severas
    switch (budgetAnalysis.analysis.riskLevel) {
      case 'low':       return 1.0;
      case 'moderate':  return 0.8;
      case 'high':      return 0.4;  // Más severo
      case 'very_high': return 0.1;  // Crítico
      default:          return 0.5;
    }
  } catch (error) {
    console.warn('Error calculando compatibilidad de presupuesto, usando valor por defecto:', error);
    return 0.5; // Valor neutral cuando hay errores
  }
}

// 🇨🇴 FUNCIÓN PRINCIPAL: RECOMENDACIÓN DUAL COLOMBIA/GLOBAL
export function getDualBreedRecommendations(
  userProfile: UserProfile, 
  allBreeds: BreedCharacteristics[]
): DualBreedRecommendationResult {
  
  console.log('🇨🇴 Iniciando recomendación dual Colombia/Global...');
  
  // 1️⃣ CALCULAR TODAS LAS COMPATIBILIDADES
  const allCompatibilities: BreedCompatibilityResultWithAvailability[] = allBreeds.map(breed => {
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
      userProfile,
      isColombianAvailable: isAvailableInColombia(breed.id)
    };
  });
  
  // 2️⃣ SEPARAR RAZAS COLOMBIANAS Y GLOBALES
  const colombianBreeds = allCompatibilities
    .filter(result => result.isColombianAvailable)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
  const globalBreeds = allCompatibilities
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
  console.log(`📊 Razas analizadas: ${globalBreeds.length} globales, ${colombianBreeds.length} colombianas`);
  
  // 3️⃣ OBTENER MEJORES RECOMENDACIONES
  const globalRecommendation = globalBreeds[0];
  const colombianRecommendation = colombianBreeds[0];
  
  if (!globalRecommendation || !colombianRecommendation) {
    throw new Error('No se encontraron razas compatibles');
  }
  
  // 4️⃣ CALCULAR RANKING DE LA RAZA COLOMBIANA EN LISTA GLOBAL
  const colombianRankInGlobal = globalBreeds.findIndex(
    result => result.breed.id === colombianRecommendation.breed.id
  ) + 1;
  
  // 5️⃣ DETERMINAR SI SON LA MISMA RAZA
  const isColombianSameAsGlobal = globalRecommendation.breed.id === colombianRecommendation.breed.id;
  
  // 6️⃣ CALCULAR DIFERENCIA DE PUNTAJE
  const scoreDifference = globalRecommendation.compatibilityScore - colombianRecommendation.compatibilityScore;
  
  // 7️⃣ GENERAR MENSAJE EXPLICATIVO
  const message = generateAvailabilityMessage(
    isColombianSameAsGlobal,
    scoreDifference,
    colombianRankInGlobal,
    colombianRecommendation.breed.name,
    globalRecommendation.breed.name
  );
  
  // 8️⃣ OBTENER ALTERNATIVAS COLOMBIANAS
  const colombianAlternatives = colombianBreeds
    .slice(1, 4) // Las siguientes 3 mejores
    .filter(result => result.compatibilityScore >= 60); // Solo si son razonablemente compatibles
  
  // 9️⃣ FUNCIÓN AUXILIAR PARA LIMPIAR PROPIEDADES TEMPORALES
  const cleanResult = (result: BreedCompatibilityResultWithAvailability): BreedCompatibilityResult => {
    const { isColombianAvailable, ...cleanedResult } = result;
    return cleanedResult;
  };
  
  console.log('✅ Recomendación dual generada exitosamente');
  
  return {
    colombianRecommendation: cleanResult(colombianRecommendation),
    globalRecommendation: cleanResult(globalRecommendation),
    colombianAlternatives: colombianAlternatives.map(result => cleanResult(result)),
    availability: {
      isColombianSameAsGlobal,
      colombianRank: colombianRankInGlobal,
      globalRank: 1,
      scoreDifference,
      message
    }
  };
}

// 📝 GENERAR MENSAJE EXPLICATIVO
function generateAvailabilityMessage(
  isSame: boolean,
  scoreDiff: number,
  colombianRank: number,
  colombianName: string,
  globalName: string
): string {
  if (isSame) {
    return `🎯 ¡Perfecto! ${colombianName} es tu raza ideal y está disponible en Colombia. No necesitas buscar alternativas.`;
  }
  
  if (scoreDiff <= 5) {
    return `✅ Excelente noticia: ${colombianName} está muy cerca de ser tu raza ideal (solo ${scoreDiff}% de diferencia). Te recomendamos esta opción disponible en Colombia.`;
  }
  
  if (scoreDiff <= 15) {
    return `👍 ${colombianName} es una muy buena opción disponible en Colombia, aunque ${globalName} sería ${scoreDiff}% más compatible. La diferencia es manejable.`;
  }
  
  if (scoreDiff <= 25) {
    return `⚖️ Tienes que decidir: ${colombianName} está disponible localmente pero ${globalName} sería significativamente más compatible (${scoreDiff}% más). Considera tus prioridades.`;
  }
  
  return `🤔 Hay una diferencia considerable: ${globalName} sería mucho más compatible (${scoreDiff}% más) que ${colombianName}. Evalúa si vale la pena la búsqueda especializada.`;
}

// Funciones auxiliares existentes
function getCompatibilityCategory(score: number): CompatibilityCategory {
  if (score >= 85) return 'excelente';
  if (score >= 70) return 'muy buena';
  if (score >= 55) return 'buena';
  if (score >= 40) return 'moderada';
  return 'baja';
}

function mapExperienceToLevel(experience: ExperienceLevel): Level {
  switch (experience) {
    case 'experienced': return 5;
    case 'some_experience': return 3;
    case 'first_time':
    default: return 1;
  }
}

// Funciones principales de recomendación
export function identifyStrengths(breed: BreedCharacteristics, userProfile: UserProfile): string[] {
  const strengths: string[] = [];
  
  // Validaciones básicas
  if (!breed || !userProfile) {
    console.warn('Datos insuficientes para identificar fortalezas');
    return ['Información de raza disponible'];
  }
  
  try {
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
    
    if (userProfile.hasChildren && breed.goodWith && breed.goodWith.includes('children')) {
      strengths.push('Excelente con niños, paciente y tolerante');
    }
    
    if (userProfile.hasOtherPets) {
      if (Array.isArray(userProfile.otherPets)) {
        userProfile.otherPets.forEach(petType => {
          if (breed.goodWith && ((petType === 'dogs' && breed.goodWith.includes('dogs')) ||
              (petType === 'cats' && breed.goodWith.includes('cats')))) {
            strengths.push(`Se lleva bien con otros ${petType === 'dogs' ? 'perros' : 'gatos'}`);
          }
        });
      } else {
        if (breed.goodWith && ((userProfile.otherPets === 'dogs' && breed.goodWith.includes('dogs')) ||
            (userProfile.otherPets === 'cats' && breed.goodWith.includes('cats')))) {
          strengths.push(`Se lleva bien con otros ${userProfile.otherPets === 'dogs' ? 'perros' : 'gatos'}`);
        }
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
    
    // 💰 INTEGRAR ANÁLISIS DE PRESUPUESTO COP (CON VALIDACIÓN)
    try {
      return addBudgetStrengths(breed, userProfile, strengths);
    } catch (budgetError) {
      console.warn('Error añadiendo fortalezas de presupuesto:', budgetError);
      return strengths; // Retornar lo que tenemos sin análisis presupuestario
    }
  } catch (error) {
    console.error('Error identificando fortalezas:', error);
    // Retornar al menos una fortaleza básica
    return [`${breed.name} es una raza ${breed.type === 'dog' ? 'canina' : 'felina'} con características únicas`];
  }
}

export function identifyChallenges(breed: BreedCharacteristics, userProfile: UserProfile): string[] {
  const challenges: string[] = [];
  
  // Validaciones básicas
  if (!breed || !userProfile) {
    console.warn('Datos insuficientes para identificar desafíos');
    return ['Consulta información adicional sobre esta raza'];
  }
  
  try {
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
    
    if (userProfile.hasChildren && breed.goodWith && !breed.goodWith.includes('children')) {
      challenges.push('Requiere supervisión con niños, ya que no es su punto fuerte');
    }
    
    if (userProfile.hasOtherPets) {
      const otherPetsArray = Array.isArray(userProfile.otherPets) 
        ? userProfile.otherPets 
        : [userProfile.otherPets];
      
      otherPetsArray.forEach(petType => {
        if (breed.goodWith && ((petType === 'dogs' && !breed.goodWith.includes('dogs')) ||
            (petType === 'cats' && !breed.goodWith.includes('cats')))) {
          challenges.push(`Puede necesitar socialización para convivir con tus ${petType === 'dogs' ? 'perros' : 'gatos'}`);
        }
      });
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
    
    // 💰 INTEGRAR ANÁLISIS DE PRESUPUESTO COP (CON VALIDACIÓN)
    try {
      return addBudgetChallenges(breed, userProfile, challenges);
    } catch (budgetError) {
      console.warn('Error añadiendo desafíos de presupuesto:', budgetError);
      return challenges; // Retornar lo que tenemos sin análisis presupuestario
    }
  } catch (error) {
    console.error('Error identificando desafíos:', error);
    // Retornar al menos un desafío básico
    return ['Consulta con expertos sobre las necesidades específicas de esta raza'];
  }
}

// 🇨🇴 FUNCIÓN AUXILIAR: Aplicar filtros manteniendo compatibilidad
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

// 🔄 MANTENER COMPATIBILIDAD: Función original para resultados simples
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

// 🔄 FUNCIÓN RELAJADA PARA CASOS SIN COINCIDENCIAS
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