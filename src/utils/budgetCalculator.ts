// 🇨🇴 CALCULADORA DE PRESUPUESTO EN PESOS COLOMBIANOS - VERSIÓN CORREGIDA
// src/utils/budgetCalculator.ts

import type { 
  BreedCharacteristics, 
  UserProfile, 
  Level,
  PetType 
} from '../types/breeds';

// Tipos específicos para el calculador
interface CostBreakdown {
  food_normal: number;
  food_premium: number;
  veterinary: number;
  accessories: number;
  grooming: number;
  base_total: number;
}

interface SizeCosts {
  small: CostBreakdown;
  medium: CostBreakdown;
  large: CostBreakdown;
}

interface PetTypeCosts {
  dogs: SizeCosts;
  cats: SizeCosts;
  small_pets: {
    small: CostBreakdown;
  };
}

interface MonthlyCostResult {
  total: number;
  breakdown: {
    food: number;
    veterinary: number;
    grooming: number;
    accessories: number;
  };
  foodPreference: string;
}



interface CurrentPetBreakdown {
  type: string;
  estimatedCost: number;
  count?: number; // 🆕 Cantidad de mascotas de este tipo
}


interface BudgetAnalysisResult {
  currentMonthlyCost: number;
  currentPetsBreakdown: CurrentPetBreakdown[];
  newPetCost: number;
  newPetBreakdown: {
    food: number;
    veterinary: number;
    grooming: number;
    accessories: number;
  };
  totalWithNewPet: number;
  userBudget: number;
  isOverBudget: boolean;
  budgetDifference: number;
  affordabilityPercentage: number;
}

interface BudgetAnalysis {
  isAffordable: boolean;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  recommendations: string[];
  warnings: string[];
  alternatives: string[];
}

interface CostReportResult {
  monthly: {
    total: number;
    breakdown: {
      food: number;
      veterinary: number;
      grooming: number;
      accessories: number;
    };
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
}

// 💰 COSTOS MENSUALES BASE EN COP
const BASE_COSTS_COP: PetTypeCosts = {
  // 🐕 PERROS
  dogs: {
    small: {
      food_normal: 100000,    // Comida normal pequeño
      food_premium: 200000,   // Comida premium pequeño
      veterinary: 80000,      // Veterinario
      accessories: 50000,     // Accesorios, juguetes
      grooming: 60000,        // Peluquería (según raza)
      base_total: 290000      // Total mínimo sin comida
    },
    medium: {
      food_normal: 150000,    
      food_premium: 300000,   
      veterinary: 100000,    
      accessories: 60000,     
      grooming: 80000,        
      base_total: 390000      
    },
    large: {
      food_normal: 250000,    
      food_premium: 450000,   
      veterinary: 120000,     
      accessories: 80000,     
      grooming: 100000,       
      base_total: 550000      
    }
  },
  
  // 🐱 GATOS
  cats: {
    small: {
      food_normal: 80000,     
      food_premium: 160000,   
      veterinary: 70000,      
      accessories: 40000,     // Arena, juguetes
      grooming: 40000,        // Menos grooming que perros
      base_total: 230000      
    },
    medium: {
      food_normal: 100000,    
      food_premium: 200000,   
      veterinary: 80000,      
      accessories: 50000,     
      grooming: 50000,        
      base_total: 280000      
    },
    large: {
      food_normal: 120000,    
      food_premium: 240000,   
      veterinary: 90000,      
      accessories: 60000,     
      grooming: 60000,        
      base_total: 330000      
    }
  },
  
  // 🐰 MASCOTAS PEQUEÑAS
  small_pets: {
    small: {
      food_normal: 50000,     
      food_premium: 100000,   
      veterinary: 40000,      
      accessories: 30000,     
      grooming: 20000,        
      base_total: 140000      
    }
  }
};

// 🏥 COSTOS ADICIONALES POR PROBLEMAS DE SALUD
const HEALTH_MULTIPLIERS: Record<Level, number> = {
  1: 1.0,    // Sin problemas de salud
  2: 1.1,    // Problemas menores
  3: 1.2,    // Problemas moderados  
  4: 1.4,    // Problemas frecuentes
  5: 1.6     // Problemas severos/crónicos
};

// 💅 MULTIPLICADORES POR NIVEL DE GROOMING
const GROOMING_MULTIPLIERS: Record<Level, number> = {
  1: 0.5,    // Grooming mínimo
  2: 0.7,    // Grooming bajo
  3: 1.0,    // Grooming normal
  4: 1.5,    // Grooming alto
  5: 2.0     // Grooming muy alto
};

/**
 * 💰 Calcular costo mensual estimado de una raza específica
 */
export function calculateMonthlyCost(breed: BreedCharacteristics, feedingPreference: string = 'normal'): MonthlyCostResult {
  const petType = breed.type as keyof PetTypeCosts; // 'dogs', 'cats'
  const size = breed.size as keyof SizeCosts;       // 'small', 'medium', 'large'
  
  // Obtener costos base
  let baseCosts: CostBreakdown;
  
  if (petType === 'dogs' || petType === 'cats') {
    baseCosts = BASE_COSTS_COP[petType][size];
  } else {
    // Para small_pets, solo hay tamaño small
    baseCosts = BASE_COSTS_COP.small_pets.small;
  }
  
  if (!baseCosts) {
    console.warn(`No se encontraron costos para ${petType} ${size}`);
    return { 
      total: 200000, 
      breakdown: { food: 100000, veterinary: 50000, grooming: 30000, accessories: 20000 },
      foodPreference: feedingPreference
    };
  }
  
  // Seleccionar tipo de comida
  const foodCost = feedingPreference === 'premium' 
    ? baseCosts.food_premium 
    : baseCosts.food_normal;
  
  // Aplicar multiplicadores
  const healthMultiplier = HEALTH_MULTIPLIERS[breed.healthIssues as Level] || 1.0;
  const groomingMultiplier = GROOMING_MULTIPLIERS[breed.grooming as Level] || 1.0;
  
  // Calcular costos ajustados
  const adjustedVeterinaryCost = baseCosts.veterinary * healthMultiplier;
  const adjustedGroomingCost = baseCosts.grooming * groomingMultiplier;
  
  // Desglose de costos
  const breakdown = {
    food: foodCost,
    veterinary: Math.round(adjustedVeterinaryCost),
    grooming: Math.round(adjustedGroomingCost), 
    accessories: baseCosts.accessories
  };
  
  // Total mensual
  const total = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
  
  return {
    total: Math.round(total),
    breakdown,
    foodPreference: feedingPreference
  };
}

/**
 * 📊 Calcular presupuesto total del usuario (mascotas actuales + nueva)
 */
export function calculateTotalBudgetImpact(
  userProfile: UserProfile, 
  newBreed: BreedCharacteristics, 
  feedingPreference: string = 'normal'
): BudgetAnalysisResult {
  let currentMonthlyCost = 0;
  const currentPetsBreakdown: CurrentPetBreakdown[] = [];
  
  // Calcular costo de mascotas actuales
  if (userProfile.hasOtherPets && userProfile.otherPets !== 'no_pets') {
    // 🆕 MANEJAR ARRAY DE MASCOTAS
    const otherPetsArray = Array.isArray(userProfile.otherPets) 
      ? userProfile.otherPets as PetType[]
      : [userProfile.otherPets as PetType];
    
    otherPetsArray.forEach((petType: PetType) => {
      let estimatedCost = 0;
      let count = 1; // Asumir 1 mascota por tipo
      
      // Estimación básica por tipo
      if (petType === 'dogs') {
        estimatedCost = 350000; // Promedio perro mediano
        count = 1; // Por simplicidad, asumir 1 perro
      } else if (petType === 'cats') {
        estimatedCost = 250000; // Promedio gato mediano  
        count = 1; // Por simplicidad, asumir 1 gato
      } else if (petType === 'small_pets') {
        estimatedCost = 140000; // Mascotas pequeñas
        count = 1; // Puede tener varias, pero costo similar
      }
      
      const totalPetTypeCost = estimatedCost * count;
      currentMonthlyCost += totalPetTypeCost;
      
      currentPetsBreakdown.push({
        type: petType,
        estimatedCost: totalPetTypeCost,
        count: count // 🆕 Agregar campo count
      });
    });
  }
  
  // Calcular costo de la nueva mascota
  const newPetCost = calculateMonthlyCost(newBreed, feedingPreference);
  
  // Total con nueva mascota
  const totalWithNewPet = currentMonthlyCost + newPetCost.total;
  
  // Presupuesto del usuario
  const userBudget = mapBudgetToCOP(userProfile.budgetLevel);
  
  return {
    currentMonthlyCost,
    currentPetsBreakdown,
    newPetCost: newPetCost.total,
    newPetBreakdown: newPetCost.breakdown,
    totalWithNewPet,
    userBudget,
    isOverBudget: totalWithNewPet > userBudget,
    budgetDifference: totalWithNewPet - userBudget,
    affordabilityPercentage: Math.round((userBudget / totalWithNewPet) * 100)
  };
}

/**
 * 💵 Mapear nivel de presupuesto del usuario a COP
 */
function mapBudgetToCOP(budgetLevel: Level): number {
  const budgetMap: Record<Level, number> = {
    1: 200000,   // Muy bajo (menos de 200k/mes)
    2: 400000,   // Bajo (200k-400k/mes) 
    3: 700000,   // Moderado (400k-700k/mes)
    4: 1200000,  // Alto (700k-1.2M/mes)
    5: 2000000   // Muy alto (más de 1.2M/mes)
  };
  
  return budgetMap[budgetLevel] || 700000;
}

/**
 * ⚖️ Generar análisis de compatibilidad presupuestaria
 */
export function generateBudgetCompatibilityAnalysis(
  userProfile: UserProfile, 
  breed: BreedCharacteristics, 
  feedingPreference: string = 'normal'
): BudgetAnalysisResult & { analysis: BudgetAnalysis } {
  const budgetAnalysis = calculateTotalBudgetImpact(userProfile, breed, feedingPreference);
  
  const analysis: BudgetAnalysis = {
    isAffordable: !budgetAnalysis.isOverBudget,
    riskLevel: getRiskLevel(budgetAnalysis.affordabilityPercentage),
    recommendations: [],
    warnings: [],
    alternatives: []
  };
  
  // 🟢 ANÁLISIS DE AFFORDABILIDAD
  if (budgetAnalysis.affordabilityPercentage >= 120) {
    analysis.recommendations.push(
      `✅ Presupuesto muy cómodo: Tu presupuesto (${formatCOP(budgetAnalysis.userBudget)}) cubre holgadamente los gastos estimados (${formatCOP(budgetAnalysis.totalWithNewPet)})`
    );
  } else if (budgetAnalysis.affordabilityPercentage >= 100) {
    analysis.recommendations.push(
      `✅ Presupuesto ajustado pero viable: Los gastos estimados (${formatCOP(budgetAnalysis.totalWithNewPet)}) se ajustan a tu presupuesto`
    );
  } else if (budgetAnalysis.affordabilityPercentage >= 80) {
    analysis.warnings.push(
      `⚠️ Presupuesto límite: Los gastos (${formatCOP(budgetAnalysis.totalWithNewPet)}) superan tu presupuesto por ${formatCOP(budgetAnalysis.budgetDifference)}`
    );
    analysis.alternatives.push('Considera comida normal en lugar de premium');
    analysis.alternatives.push('Busca veterinarios con planes de descuento');
  } else {
    analysis.warnings.push(
      `❌ Presupuesto insuficiente: Los gastos estimados superan significativamente tu presupuesto`
    );
    analysis.alternatives.push('Considera una raza de menor tamaño');
    analysis.alternatives.push('Evalúa si puedes aumentar tu presupuesto mensual');
  }
  
  // 🔍 ANÁLISIS POR COMPONENTES
  if ((breed.healthIssues as Level) >= 4) {
    analysis.warnings.push(
      `🏥 Esta raza tiene predisposición a problemas de salud, aumentando costos veterinarios en ${Math.round((HEALTH_MULTIPLIERS[breed.healthIssues as Level] - 1) * 100)}%`
    );
  }
  
  if ((breed.grooming as Level) >= 4) {
    analysis.warnings.push(
      `💅 Raza que requiere grooming frecuente, aumentando costos de peluquería en ${Math.round((GROOMING_MULTIPLIERS[breed.grooming as Level] - 1) * 100)}%`
    );
  }
  
  return {
    ...budgetAnalysis,
    analysis
  };
}

/**
 * 🚦 Determinar nivel de riesgo presupuestario
 */
function getRiskLevel(affordabilityPercentage: number): 'low' | 'moderate' | 'high' | 'very_high' {
  if (affordabilityPercentage >= 120) return 'low';
  if (affordabilityPercentage >= 100) return 'moderate';
  if (affordabilityPercentage >= 80) return 'high';
  return 'very_high';
}

/**
 * 💰 Formatear cantidad en pesos colombianos
 */
function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * 📋 Generar reporte detallado de costos
 */
export function generateCostReport(breed: BreedCharacteristics, feedingPreference: string = 'normal'): CostReportResult {
  const monthlyCost = calculateMonthlyCost(breed, feedingPreference);
  const annualCost = monthlyCost.total * 12;
  
  // 🔧 CORRECCIÓN: Estimar esperanza de vida según tipo y tamaño
  const avgLifespan = estimateLifespan(breed);
  const lifetimeCost = annualCost * avgLifespan;
  
  return {
    monthly: {
      total: monthlyCost.total,
      breakdown: monthlyCost.breakdown,
      formatted: formatCOP(monthlyCost.total)
    },
    annual: {
      total: annualCost,
      formatted: formatCOP(annualCost)
    },
    lifetime: {
      total: Math.round(lifetimeCost),
      formatted: formatCOP(lifetimeCost),
      yearsEstimated: Math.round(avgLifespan)
    },
    feedingPreference
  };
}

/**
 * 🔧 FUNCIÓN AUXILIAR: Estimar esperanza de vida por tipo y tamaño
 */
function estimateLifespan(breed: BreedCharacteristics): number {
  // Estimaciones basadas en datos estadísticos generales
  if (breed.type === 'dog') {
    switch (breed.size) {
      case 'small': return 14;   // Perros pequeños viven más
      case 'medium': return 12;  // Perros medianos
      case 'large': return 10;   // Perros grandes viven menos
      default: return 12;
    }
  } else if (breed.type === 'cat') {
    return 15; // Gatos generalmente viven 13-17 años
  } else {
    return 8; // Mascotas pequeñas (conejos, hamsters, etc.)
  }
}

/**
 * 🎯 INTEGRACIÓN CON ALGORITMO DE COMPATIBILIDAD
 * Esta función se integra con identifyChallenges() en breedMatcher.ts
 */
export function addBudgetChallenges(breed: BreedCharacteristics, userProfile: UserProfile, existingChallenges: string[] = []): string[] {
  const challenges = [...existingChallenges];
  
  // Obtener preferencia de alimentación del usuario
  const feedingPreference = (userProfile as any).feedingPreference || 'normal';
  
  // Calcular análisis de presupuesto
  const budgetAnalysis = generateBudgetCompatibilityAnalysis(userProfile, breed, feedingPreference);
  
  // 🔴 DESAFÍOS CRÍTICOS DE PRESUPUESTO
  if (budgetAnalysis.analysis.riskLevel === 'very_high') {
    challenges.push(
      `💸 PRESUPUESTO CRÍTICO: Esta raza costaría ${formatCOP(budgetAnalysis.totalWithNewPet)}/mes, superando tu presupuesto de ${formatCOP(budgetAnalysis.userBudget)} por ${formatCOP(Math.abs(budgetAnalysis.budgetDifference))}`
    );
  } else if (budgetAnalysis.analysis.riskLevel === 'high') {
    challenges.push(
      `⚠️ PRESUPUESTO AJUSTADO: Los gastos mensuales (${formatCOP(budgetAnalysis.totalWithNewPet)}) están en el límite de tu presupuesto`
    );
  }
  
  // 🏥 DESAFÍOS POR SALUD
  if ((breed.healthIssues as Level) >= 4) {
    const petType = breed.type as keyof PetTypeCosts;
    const size = breed.size as keyof SizeCosts;
    let baseCost = 80000; // Valor por defecto
    
    if (petType === 'dogs' || petType === 'cats') {
      baseCost = BASE_COSTS_COP[petType][size].veterinary;
    }
    
    const extraHealthCost = budgetAnalysis.newPetBreakdown.veterinary - baseCost;
    challenges.push(
      `🏥 GASTOS VETERINARIOS: Esta raza puede tener ${formatCOP(extraHealthCost)} adicionales/mes en salud`
    );
  }
  
  // 💅 DESAFÍOS POR GROOMING
  if ((breed.grooming as Level) >= 4) {
    const groomingCost = budgetAnalysis.newPetBreakdown.grooming;
    challenges.push(
      `💄 GROOMING COSTOSO: Necesitará aproximadamente ${formatCOP(groomingCost)}/mes en peluquería`
    );
  }
  
  // 🍖 DESAFÍOS POR ALIMENTACIÓN
  if (feedingPreference === 'premium' && breed.size === 'large') {
    const foodCost = budgetAnalysis.newPetBreakdown.food;
    challenges.push(
      `🍖 ALIMENTACIÓN PREMIUM: Comida de alta calidad costaría desde ${formatCOP(foodCost)}/mes para esta raza grande`
    );
  }
  
  // ⚡ RECOMENDACIONES DE AHORRO
  if (budgetAnalysis.analysis.alternatives.length > 0) {
    challenges.push(
      `💡 ALTERNATIVAS DE AHORRO: ${budgetAnalysis.analysis.alternatives.join(', ')}`
    );
  }
  
  return challenges;
}

/**
 * 🎯 INTEGRACIÓN CON ALGORITMO DE FORTALEZAS
 * Esta función se integra con identifyStrengths() en breedMatcher.ts
 */
export function addBudgetStrengths(breed: BreedCharacteristics, userProfile: UserProfile, existingStrengths: string[] = []): string[] {
  const strengths = [...existingStrengths];
  
  const feedingPreference = (userProfile as any).feedingPreference || 'normal';
  const budgetAnalysis = generateBudgetCompatibilityAnalysis(userProfile, breed, feedingPreference);
  
  // 🟢 FORTALEZAS ECONÓMICAS
  if (budgetAnalysis.analysis.riskLevel === 'low') {
    strengths.push(
      `💰 ECONÓMICAMENTE VIABLE: Los gastos mensuales (${formatCOP(budgetAnalysis.totalWithNewPet)}) están muy por debajo de tu presupuesto`
    );
  }
  
  // 🏥 FORTALEZAS DE SALUD
  if ((breed.healthIssues as Level) <= 2) {
    strengths.push(
      `🏥 GASTOS VETERINARIOS BAJOS: Raza generalmente saludable, menores costos médicos`
    );
  }
  
  // 💅 FORTALEZAS DE GROOMING
  if ((breed.grooming as Level) <= 2) {
    const petType = breed.type as keyof PetTypeCosts;
    const size = breed.size as keyof SizeCosts;
    let baseCost = 50000; // Valor por defecto
    
    if (petType === 'dogs' || petType === 'cats') {
      baseCost = BASE_COSTS_COP[petType][size].grooming;
    }
    
    const groomingSavings = baseCost * 0.5;
    strengths.push(
      `💄 BAJO MANTENIMIENTO: Ahorro de aproximadamente ${formatCOP(groomingSavings)}/mes en grooming`
    );
  }
  
  // 🍖 FORTALEZAS DE ALIMENTACIÓN
  if (breed.size === 'small') {
    strengths.push(
      `🍖 ALIMENTACIÓN ECONÓMICA: Por su tamaño pequeño, consume menos comida que razas grandes`
    );
  }
  
  return strengths;
}