// src/utils/budgetCalculator.ts - VERSIÓN CORREGIDA SIN NaN
import type { 
  BreedCharacteristics, 
  UserProfile, 
  Level
} from '../types/breeds';

import { 
  calculateMonthlyFeedingCost, 
  compareFeedingCosts 
} from './feedingCostCalculator';

// Tipos específicos para el calculador - SIMPLIFICADOS
interface CostBreakdown {
  food: number;
  veterinary: number;
  accessories: number;
  grooming: number;
  total: number;
}

interface MonthlyCostResult {
  total: number;
  breakdown: CostBreakdown;
  feedingDetails: {
    type: 'premium' | 'standard';
    explanation: string;
    alternatives?: {
      premium: number;
      standard: number;
      difference: number;
    };
  };
}

interface BudgetAnalysisResult {
  currentMonthlyCost: number;
  newPetCost: number;
  newPetBreakdown: CostBreakdown;
  totalWithNewPet: number;
  userBudget: number;
  isOverBudget: boolean;
  budgetDifference: number;
  affordabilityPercentage: number;
  feedingAnalysis: {
    recommendedOption: 'premium' | 'standard';
    budgetCompatibility: 'excellent' | 'good' | 'tight' | 'over_budget';
    advice: string;
  };
}

// 💰 COSTOS BASE CORREGIDOS Y VALIDADOS
const getBaseCosts = (breed: BreedCharacteristics) => {
  // ✅ VALIDAR TIPO DE MASCOTA
  if (!breed || !breed.type) {
    console.warn('⚠️ Raza sin tipo, usando costos por defecto');
    return { veterinary: 70000, accessories: 40000, grooming: 50000 };
  }

  if (breed.type === 'cat') {
    return {
      veterinary: 70000,
      accessories: 40000, // Arena, arenero, juguetes, rascador
      grooming: 30000     // Menos grooming que perros
    };
  }
  
  // Para perros, costos según tamaño
  if (breed.type === 'dog') {
    const size = breed.size || 'medium'; // Valor por defecto
    
    switch (size.toLowerCase()) {
      case 'tiny':      // 🔧 AÑADIDO: Soporte para "tiny"
      case 'small':
        return {
          veterinary: 80000,
          accessories: 50000,
          grooming: 60000
        };
      case 'medium':
        return {
          veterinary: 100000,
          accessories: 60000,
          grooming: 80000
        };
      case 'large':
      case 'giant':     // 🔧 AÑADIDO: Soporte para "giant"
        return {
          veterinary: 120000,
          accessories: 80000,
          grooming: 100000
        };
      default:
        console.warn(`⚠️ Tamaño de perro desconocido: ${size}, usando mediano`);
        return {
          veterinary: 100000,
          accessories: 60000,
          grooming: 80000
        };
    }
  }
  
  // Caso por defecto
  return { veterinary: 70000, accessories: 40000, grooming: 50000 };
};

// 🏥 MULTIPLICADORES POR PROBLEMAS DE SALUD - SEGUROS
const getHealthMultiplier = (healthLevel: any): number => {
  if (!healthLevel || typeof healthLevel !== 'number') {
    return 1.0; // Sin multiplicador si no hay datos
  }
  
  const multipliers: Record<number, number> = {
    1: 1.0,    // Sin problemas
    2: 1.1,    // Problemas menores
    3: 1.2,    // Problemas moderados  
    4: 1.4,    // Problemas frecuentes
    5: 1.6     // Problemas severos/crónicos
  };
  
  return multipliers[healthLevel] || 1.0;
};

// 💅 MULTIPLICADORES POR GROOMING - SEGUROS
const getGroomingMultiplier = (groomingLevel: any): number => {
  if (!groomingLevel || typeof groomingLevel !== 'number') {
    return 1.0; // Sin multiplicador si no hay datos
  }
  
  const multipliers: Record<number, number> = {
    1: 0.5,    // Grooming mínimo
    2: 0.7,    // Grooming bajo
    3: 1.0,    // Grooming normal
    4: 1.5,    // Grooming alto
    5: 2.0     // Grooming muy alto
  };
  
  return multipliers[groomingLevel] || 1.0;
};

/**
 * 💰 Calcular costo mensual REAL con validaciones - CORREGIDO
 */
export function calculateMonthlyCost(
  breed: BreedCharacteristics, 
  userProfile: UserProfile,
  feedingPreference?: 'premium' | 'standard' | 'flexible'
): MonthlyCostResult {
  try {
    console.log(`💰 Calculando costo mensual para: ${breed.name} (${breed.type}, ${breed.size})`);
    
    // 1. 🍖 CALCULAR ALIMENTACIÓN REAL
    let actualFeedingPreference: 'premium' | 'standard' = 'standard';
    
    if (feedingPreference === 'premium') {
      actualFeedingPreference = 'premium';
    } else if (feedingPreference === 'standard') {
      actualFeedingPreference = 'standard';
    } else if (userProfile.feedingPreference === 'premium') {
      actualFeedingPreference = 'premium';
    } else if (userProfile.feedingPreference === 'flexible') {
      // Decidir según presupuesto
      actualFeedingPreference = userProfile.budgetLevel >= 3 ? 'premium' : 'standard';
    }
    
    const feedingResult = calculateMonthlyFeedingCost(breed, actualFeedingPreference);
    
    // ✅ VALIDAR RESULTADO DE ALIMENTACIÓN
    if (!feedingResult || !isFinite(feedingResult.monthlyCost) || isNaN(feedingResult.monthlyCost)) {
      throw new Error('Error en cálculo de alimentación');
    }
    
    const feedingCost = feedingResult.monthlyCost;
    
    // 2. 📊 OBTENER COSTOS BASE SEGÚN TIPO/TAMAÑO
    const baseCosts = getBaseCosts(breed);
    
    // 3. ⚕️ APLICAR MULTIPLICADORES SEGUROS
    const healthMultiplier = getHealthMultiplier((breed as any).healthIssues);
    const groomingMultiplier = getGroomingMultiplier(breed.grooming);
    
    const adjustedVeterinaryCost = Math.round(baseCosts.veterinary * healthMultiplier);
    const adjustedGroomingCost = Math.round(baseCosts.grooming * groomingMultiplier);
    
    // 4. 🧮 CONSTRUIR DESGLOSE FINAL CON VALIDACIONES
    const breakdown: CostBreakdown = {
      food: feedingCost,
      veterinary: adjustedVeterinaryCost,
      grooming: adjustedGroomingCost,
      accessories: baseCosts.accessories,
      total: 0 // Se calcula abajo
    };
    
    // ✅ VALIDAR CADA COMPONENTE ANTES DE SUMAR
    const validatedBreakdown: CostBreakdown = {
      food: isFinite(breakdown.food) ? breakdown.food : 0,
      veterinary: isFinite(breakdown.veterinary) ? breakdown.veterinary : 0,
      grooming: isFinite(breakdown.grooming) ? breakdown.grooming : 0,
      accessories: isFinite(breakdown.accessories) ? breakdown.accessories : 0,
      total: 0
    };
    
    validatedBreakdown.total = validatedBreakdown.food + validatedBreakdown.veterinary + 
                               validatedBreakdown.grooming + validatedBreakdown.accessories;
    
    // ✅ VALIDAR TOTAL FINAL
    if (!isFinite(validatedBreakdown.total) || isNaN(validatedBreakdown.total)) {
      throw new Error('Total calculado es inválido');
    }
    
    // 5. 📋 GENERAR DETALLES DE ALIMENTACIÓN
    const comparison = compareFeedingCosts(breed);
    const alternativeCosts = {
      premium: comparison.premium.monthlyCost,
      standard: comparison.standard.monthlyCost,
      difference: comparison.difference
    };
    
    const feedingDetails = {
      type: actualFeedingPreference,
      explanation: feedingResult.explanation,
      alternatives: alternativeCosts
    };
    
    const result = {
      total: validatedBreakdown.total,
      breakdown: validatedBreakdown,
      feedingDetails
    };
    
    console.log(`✅ Costo mensual calculado: ${result.total.toLocaleString()}`);
    return result;
    
  } catch (error) {
    console.error('❌ Error calculating monthly cost:', error);
    
    // 🚨 VALORES DE EMERGENCIA SEGUROS
    const emergencyBreakdown: CostBreakdown = {
      food: breed.type === 'cat' ? 40000 : 
            breed.size === 'small' ? 70000 :
            breed.size === 'large' ? 150000 : 100000,
      veterinary: breed.type === 'cat' ? 70000 : 100000,
      accessories: breed.type === 'cat' ? 40000 : 60000,
      grooming: breed.type === 'cat' ? 30000 : 80000,
      total: 0
    };
    
    emergencyBreakdown.total = emergencyBreakdown.food + emergencyBreakdown.veterinary + 
                               emergencyBreakdown.grooming + emergencyBreakdown.accessories;
    
    return {
      total: emergencyBreakdown.total,
      breakdown: emergencyBreakdown,
      feedingDetails: {
        type: 'standard',
        explanation: `Estimación de emergencia para ${breed.name}`,
        alternatives: {
          premium: emergencyBreakdown.food * 1.5,
          standard: emergencyBreakdown.food,
          difference: emergencyBreakdown.food * 0.5
        }
      }
    };
  }
}

/**
 * 📊 Calcular impacto total en presupuesto - CORREGIDO
 */
export function calculateTotalBudgetImpact(
  userProfile: UserProfile, 
  newBreed: BreedCharacteristics, 
  feedingPreference?: 'premium' | 'standard' | 'flexible'
): BudgetAnalysisResult {
  try {
    console.log(`📊 Calculando impacto presupuestario para: ${newBreed.name}`);
    
    // Estimar costo de mascotas actuales (simplificado)
    let currentMonthlyCost = 0;
    
    if (userProfile.hasOtherPets && userProfile.otherPets !== 'no_pets') {
      const otherPetsArray = Array.isArray(userProfile.otherPets) 
        ? userProfile.otherPets 
        : [userProfile.otherPets];
      
      otherPetsArray.forEach((petType) => {
        if (petType === 'dogs') {
          currentMonthlyCost += 350000; // Promedio perro
        } else if (petType === 'cats') {
          currentMonthlyCost += 180000; // Promedio gato
        } else if (petType === 'small_pets') {
          currentMonthlyCost += 100000; // Mascotas pequeñas
        }
      });
    }
    
    // Calcular costo de la nueva mascota
    const newPetCostDetails = calculateMonthlyCost(newBreed, userProfile, feedingPreference);
    
    // ✅ VALIDAR CÁLCULOS ANTES DE CONTINUAR
    if (!isFinite(newPetCostDetails.total) || isNaN(newPetCostDetails.total)) {
      throw new Error('Costo de nueva mascota inválido');
    }
    
    const totalWithNewPet = currentMonthlyCost + newPetCostDetails.total;
    const userBudget = mapBudgetToCOP(userProfile.budgetLevel);
    
    // ✅ VALIDAR TODOS LOS CÁLCULOS
    if (!isFinite(totalWithNewPet) || !isFinite(userBudget)) {
      throw new Error('Cálculos de presupuesto inválidos');
    }
    
    const budgetDifference = totalWithNewPet - userBudget;
    const affordabilityPercentage = userBudget > 0 ? Math.round((userBudget / totalWithNewPet) * 100) : 0;
    
    // Análisis de alimentación
    const feedingAnalysis = generateFeedingAnalysis(newBreed, userProfile, newPetCostDetails.feedingDetails.type);
    
    const result: BudgetAnalysisResult = {
      currentMonthlyCost,
      newPetCost: newPetCostDetails.total,
      newPetBreakdown: newPetCostDetails.breakdown,
      totalWithNewPet,
      userBudget,
      isOverBudget: totalWithNewPet > userBudget,
      budgetDifference,
      affordabilityPercentage,
      feedingAnalysis
    };
    
    console.log(`✅ Análisis presupuestario completado:`, {
      newPetCost: result.newPetCost,
      userBudget: result.userBudget,
      affordability: result.affordabilityPercentage + '%'
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Error calculating budget impact:', error);
    
    // Análisis de emergencia
    const emergencyCost = 250000; // Costo promedio
    const userBudget = mapBudgetToCOP(userProfile.budgetLevel);
    
    return {
      currentMonthlyCost: 0,
      newPetCost: emergencyCost,
      newPetBreakdown: {
        food: 80000,
        veterinary: 80000,
        accessories: 40000,
        grooming: 50000,
        total: emergencyCost
      },
      totalWithNewPet: emergencyCost,
      userBudget,
      isOverBudget: emergencyCost > userBudget,
      budgetDifference: emergencyCost - userBudget,
      affordabilityPercentage: userBudget > 0 ? Math.round((userBudget / emergencyCost) * 100) : 0,
      feedingAnalysis: {
        recommendedOption: 'standard',
        budgetCompatibility: 'good',
        advice: 'Estimación de emergencia - verifica cálculos'
      }
    };
  }
}

/**
 * 💵 Mapear nivel de presupuesto del usuario a COP - VALIDADO
 */
function mapBudgetToCOP(budgetLevel: Level): number {
  const budgetMap: Record<Level, number> = {
    1: 200000,   // Muy bajo
    2: 400000,   // Bajo
    3: 700000,   // Moderado
    4: 1200000,  // Alto
    5: 2000000   // Muy alto
  };
  
  const budget = budgetMap[budgetLevel];
  return isFinite(budget) ? budget : 700000; // Valor por defecto si hay error
}

/**
 * 🍖 Generar análisis de alimentación - NUEVO
 */
function generateFeedingAnalysis(
  breed: BreedCharacteristics,
  userProfile: UserProfile,
  recommendedOption: 'premium' | 'standard'
): {
  recommendedOption: 'premium' | 'standard';
  budgetCompatibility: 'excellent' | 'good' | 'tight' | 'over_budget';
  advice: string;
} {
  try {
    const userBudget = mapBudgetToCOP(userProfile.budgetLevel);
    const feedingCost = calculateMonthlyFeedingCost(breed, recommendedOption);
    
    if (!isFinite(feedingCost.monthlyCost)) {
      throw new Error('Costo de alimentación inválido');
    }
    
    const budgetPercentage = (feedingCost.monthlyCost / userBudget) * 100;
    
    let budgetCompatibility: 'excellent' | 'good' | 'tight' | 'over_budget';
    if (budgetPercentage <= 20) budgetCompatibility = 'excellent';
    else if (budgetPercentage <= 35) budgetCompatibility = 'good';
    else if (budgetPercentage <= 50) budgetCompatibility = 'tight';
    else budgetCompatibility = 'over_budget';
    
    let advice = `🍖 Alimentación ${recommendedOption}: ${formatCurrency(feedingCost.monthlyCost)}/mes `;
    
    switch (budgetCompatibility) {
      case 'excellent':
        advice += `✅ Excelente para tu presupuesto. `;
        break;
      case 'good':
        advice += `✅ Se ajusta bien a tu presupuesto. `;
        break;
      case 'tight':
        advice += `⚠️ Un poco ajustado para tu presupuesto. `;
        break;
      case 'over_budget':
        advice += `❌ Supera tu presupuesto mensual. `;
        break;
    }
    
    return {
      recommendedOption,
      budgetCompatibility,
      advice
    };
    
  } catch (error) {
    console.error('❌ Error generating feeding analysis:', error);
    return {
      recommendedOption: 'standard',
      budgetCompatibility: 'good',
      advice: 'Análisis de alimentación no disponible'
    };
  }
}

/**
 * ⚖️ Generar análisis de compatibilidad presupuestaria - CORREGIDO
 */
export function generateBudgetCompatibilityAnalysis(
  userProfile: UserProfile, 
  breed: BreedCharacteristics, 
  feedingPreference?: 'premium' | 'standard' | 'flexible'
): BudgetAnalysisResult & { 
  analysis: {
    isAffordable: boolean;
    riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
    recommendations: string[];
    warnings: string[];
    alternatives: string[];
  }
} {
  try {
    const budgetAnalysis = calculateTotalBudgetImpact(userProfile, breed, feedingPreference);
    
    const analysis = {
      isAffordable: !budgetAnalysis.isOverBudget,
      riskLevel: getRiskLevel(budgetAnalysis.affordabilityPercentage),
      recommendations: [] as string[],
      warnings: [] as string[],
      alternatives: [] as string[]
    };
    
    // Generar recomendaciones según affordabilidad
    if (budgetAnalysis.affordabilityPercentage >= 120) {
      analysis.recommendations.push(
        `✅ Presupuesto muy cómodo: Puedes mantener esta mascota sin problemas financieros`
      );
    } else if (budgetAnalysis.affordabilityPercentage >= 100) {
      analysis.recommendations.push(
        `✅ Presupuesto ajustado pero viable para ${breed.name}`
      );
    } else if (budgetAnalysis.affordabilityPercentage >= 80) {
      analysis.warnings.push(
        `⚠️ Presupuesto límite: Considera aumentar tu presupuesto o buscar alternativas más económicas`
      );
    } else {
      analysis.warnings.push(
        `❌ Presupuesto insuficiente: Los gastos superan significativamente tu presupuesto`
      );
      analysis.alternatives.push('Considera una raza de menor tamaño para reducir costos');
    }
    
    return {
      ...budgetAnalysis,
      analysis
    };
    
  } catch (error) {
    console.error('❌ Error generating budget compatibility analysis:', error);
    
    // Análisis de emergencia
    const emergencyAnalysis = calculateTotalBudgetImpact(userProfile, breed, feedingPreference);
    
    return {
      ...emergencyAnalysis,
      analysis: {
        isAffordable: true,
        riskLevel: 'moderate',
        recommendations: ['Análisis detallado no disponible'],
        warnings: ['Verifica los cálculos manualmente'],
        alternatives: []
      }
    };
  }
}

/**
 * 🚦 Determinar nivel de riesgo presupuestario - VALIDADO
 */
function getRiskLevel(affordabilityPercentage: number): 'low' | 'moderate' | 'high' | 'very_high' {
  if (!isFinite(affordabilityPercentage) || isNaN(affordabilityPercentage)) {
    return 'moderate'; // Valor por defecto seguro
  }
  
  if (affordabilityPercentage >= 120) return 'low';
  if (affordabilityPercentage >= 100) return 'moderate';
  if (affordabilityPercentage >= 80) return 'high';
  return 'very_high';
}

/**
 * 💰 Formatear cantidad en pesos colombianos - SEGURO
 */
function formatCurrency(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) {
    return '$0';
  }
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * 📋 Generar reporte detallado de costos - CORREGIDO
 */
export function generateCostReport(
  breed: BreedCharacteristics, 
  userProfile: UserProfile,
  feedingPreference?: 'premium' | 'standard' | 'flexible'
): {
  monthly: {
    total: number;
    breakdown: CostBreakdown;
    formatted: string;
  };
  annual: {
    total: number;
    formatted: string;
  };
  lifetime: {
    total: number;
    formatted: string;
    yearsEstimated: number;
  };
  feedingPreference: string;
} {
  try {
    console.log(`📋 Generando reporte de costos para: ${breed.name}`);
    
    const monthlyCost = calculateMonthlyCost(breed, userProfile, feedingPreference);
    
    // ✅ VALIDAR COSTO MENSUAL
    if (!isFinite(monthlyCost.total) || isNaN(monthlyCost.total)) {
      throw new Error('Costo mensual inválido para reporte');
    }
    
    const annualCost = monthlyCost.total * 12;
    
    // Estimar esperanza de vida
    let avgLifespan = 12;
    if (breed.type === 'cat') {
      avgLifespan = 15;
    } else if (breed.type === 'dog') {
      switch (breed.size) {
        case 'small': avgLifespan = 14; break;
        case 'medium': avgLifespan = 12; break;
        case 'large': avgLifespan = 10; break;
        default: avgLifespan = 12;
      }
    }
    
    const lifetimeCost = annualCost * avgLifespan;
    
    // ✅ VALIDAR TODOS LOS CÁLCULOS
    if (!isFinite(annualCost) || !isFinite(lifetimeCost)) {
      throw new Error('Cálculos de costos a largo plazo inválidos');
    }
    
    const result = {
      monthly: {
        total: monthlyCost.total,
        breakdown: monthlyCost.breakdown,
        formatted: formatCurrency(monthlyCost.total)
      },
      annual: {
        total: annualCost,
        formatted: formatCurrency(annualCost)
      },
      lifetime: {
        total: Math.round(lifetimeCost),
        formatted: formatCurrency(lifetimeCost),
        yearsEstimated: avgLifespan
      },
      feedingPreference: monthlyCost.feedingDetails.type
    };
    
    console.log(`✅ Reporte generado:`,{
      monthly: result.monthly.formatted,
      annual: result.annual.formatted,
      lifetime: result.lifetime.formatted
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Error generating cost report:', error);
    
    // Reporte de emergencia
    const emergencyCost = breed.type === 'cat' ? 180000 : 300000;
    const emergencyAnnual = emergencyCost * 12;
    const emergencyLifetime = emergencyAnnual * 12;
    
    return {
      monthly: {
        total: emergencyCost,
        breakdown: {
          food: Math.round(emergencyCost * 0.4),
          veterinary: Math.round(emergencyCost * 0.3),
          accessories: Math.round(emergencyCost * 0.1),
          grooming: Math.round(emergencyCost * 0.2),
          total: emergencyCost
        },
        formatted: formatCurrency(emergencyCost)
      },
      annual: {
        total: emergencyAnnual,
        formatted: formatCurrency(emergencyAnnual)
      },
      lifetime: {
        total: emergencyLifetime,
        formatted: formatCurrency(emergencyLifetime),
        yearsEstimated: 12
      },
      feedingPreference: 'standard'
    };
  }
}

/**
 * 🎯 INTEGRACIÓN CON ALGORITMO DE COMPATIBILIDAD - CORREGIDO
 */
export function addBudgetChallenges(
  breed: BreedCharacteristics, 
  userProfile: UserProfile, 
  existingChallenges: string[] = []
): string[] {
  try {
    const challenges = [...existingChallenges];
    
    const budgetAnalysis = generateBudgetCompatibilityAnalysis(userProfile, breed);
    
    // Agregar desafíos según nivel de riesgo
    if (budgetAnalysis.analysis.riskLevel === 'very_high') {
      challenges.push(
        `💸 PRESUPUESTO CRÍTICO: Esta raza costaría ${formatCurrency(budgetAnalysis.totalWithNewPet)}/mes, superando tu presupuesto`
      );
    } else if (budgetAnalysis.analysis.riskLevel === 'high') {
      challenges.push(
        `⚠️ PRESUPUESTO AJUSTADO: Los gastos mensuales están en el límite de tu presupuesto`
      );
    }
    
    // Agregar warnings específicos
    budgetAnalysis.analysis.warnings.forEach(warning => {
      if (!challenges.includes(warning)) {
        challenges.push(warning);
      }
    });
    
    return challenges;
    
  } catch (error) {
    console.error('❌ Error adding budget challenges:', error);
    return existingChallenges;
  }
}

/**
 * 🎯 INTEGRACIÓN CON ALGORITMO DE FORTALEZAS - CORREGIDO
 */
export function addBudgetStrengths(
  breed: BreedCharacteristics, 
  userProfile: UserProfile, 
  existingStrengths: string[] = []
): string[] {
  try {
    const strengths = [...existingStrengths];
    
    const budgetAnalysis = generateBudgetCompatibilityAnalysis(userProfile, breed);
    
    // Agregar fortalezas según nivel de riesgo
    if (budgetAnalysis.analysis.riskLevel === 'low') {
      strengths.push(
        `💰 MUY ECONÓMICO: Los gastos mensuales están muy por debajo de tu presupuesto`
      );
    }
    
    // Agregar recomendaciones como fortalezas
    budgetAnalysis.analysis.recommendations.forEach(recommendation => {
      if (!strengths.includes(recommendation)) {
        strengths.push(recommendation);
      }
    });
    
    return strengths;
    
  } catch (error) {
    console.error('❌ Error adding budget strengths:', error);
    return existingStrengths;
  }
}

// 🧪 FUNCIÓN DE TESTING PARA VALIDAR CÁLCULOS
export function testBudgetCalculations() {
  console.log('🧪 Iniciando tests de cálculos de presupuesto...');
  
  const testBreeds: BreedCharacteristics[] = [
    {
      id: 'test-dog-small', 
      name: 'Perro Pequeño', 
      image: '/test.jpg',
      type: 'dog', 
      size: 'small', 
      energyLevel: 3,
      friendliness: 4,
      grooming: 2, 
      training: 3,
      goodWith: ['children'],
      hypoallergenic: false,
      furLength: 'short',
      noiseLevel: 2,
      healthIssues: 2,
      costLevel: 2,
      independenceLevel: 3,
      suitableFor: ['family']
    },
    {
      id: 'test-dog-large', 
      name: 'Perro Grande', 
      image: '/test.jpg',
      type: 'dog', 
      size: 'large', 
      energyLevel: 4,
      friendliness: 4,
      grooming: 4, 
      training: 3,
      goodWith: ['children'],
      hypoallergenic: false,
      furLength: 'medium',
      noiseLevel: 3,
      healthIssues: 3,
      costLevel: 4,
      independenceLevel: 2,
      suitableFor: ['family']
    },
    {
      id: 'test-cat', 
      name: 'Gato', 
      image: '/test.jpg',
      type: 'cat', 
      size: 'medium', 
      energyLevel: 2,
      friendliness: 3,
      grooming: 3, 
      training: 2,
      goodWith: ['seniors'],
      hypoallergenic: false,
      furLength: 'medium',
      noiseLevel: 1,
      healthIssues: 2,
      costLevel: 3,
      independenceLevel: 4,
      suitableFor: ['companion']
    }
  ];
  
  const testProfile: UserProfile = {
    homeType: 'house_small_yard',
    hoursAway: 6,
    activityLevel: 3,
    hasChildren: false,
    childrenAge: 'no_children',
    hasOtherPets: false,
    otherPets: 'no_pets',
    experience: 'some_experience',
    petTypePreference: 'any',
    sizePreference: 'any',
    furLengthPreference: 'any',
    noiseToleranceLevel: 3,
    groomingWillingness: 3,
    trainingWillingness: 3,
    allergies: false,
    allergyLevel: 'no_allergies',
    budgetLevel: 3,
    feedingPreference: 'standard',
    purpose: ['companion']
  };
  
  testBreeds.forEach(breed => {
    try {
      console.log(`\n🔍 Testing budget for: ${breed.name}`);
      
      const monthlyCost = calculateMonthlyCost(breed, testProfile);
      const budgetAnalysis = calculateTotalBudgetImpact(testProfile, breed);
      const costReport = generateCostReport(breed, testProfile);
      
      console.log(`  Monthly: ${formatCurrency(monthlyCost.total)}`);
      console.log(`  Annual: ${costReport.annual.formatted}`);
      console.log(`  Affordability: ${budgetAnalysis.affordabilityPercentage}%`);
      
      // Verificar que no hay NaN
      if (isNaN(monthlyCost.total) || isNaN(costReport.annual.total)) {
        console.error(`  ❌ ERROR: NaN detectado en ${breed.name}`);
      } else {
        console.log(`  ✅ OK: Cálculos válidos para ${breed.name}`);
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`  ❌ ERROR en ${breed.name}:`, errorMessage);
    }
  });
  
  console.log('\n🧪 Tests de presupuesto completados');
}