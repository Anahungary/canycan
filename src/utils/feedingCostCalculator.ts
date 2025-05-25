// src/utils/feedingCostCalculator.ts - VERSIÓN COMPLETAMENTE LIMPIA SIN ERRORES

import type { BreedCharacteristics, Level, SizeType } from '../types/breeds';

// 📊 DATOS REALES DE ALIMENTACIÓN VALIDADOS
interface FoodPackage {
  weight: number;        
  price: number;         
  duration: number;      
}

interface FoodCosts {
  premium: FoodPackage;
  standard: FoodPackage;
}

// 🐕🐱 DATOS DE ALIMENTACIÓN COLOMBIANA - SIMPLIFICADOS Y SEGUROS
const FOOD_DATA = {
  dogs: {
    small: {
      premium: { weight: 7.5, price: 120000, duration: 45 },
      standard: { weight: 15, price: 80000, duration: 60 }
    },
    medium: {
      premium: { weight: 15, price: 200000, duration: 45 },
      standard: { weight: 15, price: 100000, duration: 30 }
    },
    large: {
      premium: { weight: 18, price: 280000, duration: 30 },
      standard: { weight: 20, price: 150000, duration: 25 }
    }
  },
  cats: {
    all_sizes: {
      premium: { weight: 1.5, price: 60000, duration: 30 },
      standard: { weight: 1.5, price: 32500, duration: 30 }
    }
  }
} as const;

// 🛡️ FUNCIÓN SEGURA PARA OBTENER DATOS DE COMIDA
function getFoodDataSafely(breed: BreedCharacteristics): FoodCosts {
  try {
    if (!breed?.type) {
      return FOOD_DATA.cats.all_sizes;
    }

    if (breed.type === 'cat') {
      return FOOD_DATA.cats.all_sizes;
    } 
    
    if (breed.type === 'dog') {
      const size = breed.size || 'medium';
      
      switch (size) {
        case 'small': return FOOD_DATA.dogs.small;
        case 'medium': return FOOD_DATA.dogs.medium;
        case 'large': return FOOD_DATA.dogs.large;
        default: return FOOD_DATA.dogs.medium;
      }
    }
    
    return FOOD_DATA.cats.all_sizes;
    
  } catch {
    return {
      premium: { weight: 5, price: 80000, duration: 30 },
      standard: { weight: 5, price: 50000, duration: 30 }
    };
  }
}

// 🧮 CALCULAR COSTO MENSUAL - VERSIÓN SIMPLIFICADA Y SEGURA
export function calculateMonthlyFeedingCost(
  breed: BreedCharacteristics, 
  feedingPreference: 'premium' | 'standard' = 'standard'
): {
  monthlyCost: number;
  packageInfo: FoodPackage;
  costPerDay: number;
  explanation: string;
} {
  try {
    const foodData = getFoodDataSafely(breed);
    const packageInfo = foodData[feedingPreference];
    
    if (!packageInfo?.price || !packageInfo?.duration) {
      throw new Error('Datos de paquete inválidos');
    }
    
    const costPerDay = packageInfo.price / packageInfo.duration;
    const monthlyCost = Math.round(costPerDay * 30);
    
    if (!isFinite(costPerDay) || !isFinite(monthlyCost)) {
      throw new Error('Cálculo produce valores infinitos');
    }
    
    const explanation = generateExplanation(breed, feedingPreference, packageInfo, costPerDay);
    
    return {
      monthlyCost,
      packageInfo,
      costPerDay: Math.round(costPerDay),
      explanation
    };
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error calculando costo alimentación:', errorMsg);
    
    // Valores de emergencia seguros
    const emergencyPrice = breed?.type === 'cat' ? 40000 : 
                          breed?.size === 'small' ? 60000 :
                          breed?.size === 'large' ? 120000 : 80000;
    
    return {
      monthlyCost: emergencyPrice,
      packageInfo: { weight: 5, price: emergencyPrice, duration: 30 },
      costPerDay: Math.round(emergencyPrice / 30),
      explanation: `Estimación para ${breed?.name || 'mascota desconocida'}`
    };
  }
}

// 📝 GENERAR EXPLICACIÓN SIMPLE
function generateExplanation(
  breed: BreedCharacteristics,
  preference: 'premium' | 'standard',
  packageInfo: FoodPackage,
  costPerDay: number
): string {
  try {
    const petType = breed.type === 'dog' ? 'perro' : 'gato';
    const sizeText = breed.type === 'dog' && breed.size
      ? (breed.size === 'small' ? 'pequeño' : breed.size === 'medium' ? 'mediano' : 'grande')
      : '';
    
    const qualityText = preference === 'premium' ? 'premium' : 'estándar';
    
    const priceFormatted = formatCurrency(packageInfo.price);
    const dailyCostFormatted = formatCurrency(costPerDay);
    
    if (breed.type === 'cat') {
      return `🐱 Gato: ${packageInfo.weight}kg ${qualityText} = ${priceFormatted} (${packageInfo.duration} días) = ${dailyCostFormatted}/día`;
    } else {
      return `🐕 Perro ${sizeText}: ${packageInfo.weight}kg ${qualityText} = ${priceFormatted} (${packageInfo.duration} días) = ${dailyCostFormatted}/día`;
    }
  } catch {
    return `Costos estimados para ${breed.name}`;
  }
}

// 🔍 COMPARAR COSTOS - VERSIÓN SIMPLIFICADA
export function compareFeedingCosts(breed: BreedCharacteristics): {
  premium: ReturnType<typeof calculateMonthlyFeedingCost>;
  standard: ReturnType<typeof calculateMonthlyFeedingCost>;
  difference: number;
  recommendation: string;
} {
  try {
    const premiumCost = calculateMonthlyFeedingCost(breed, 'premium');
    const standardCost = calculateMonthlyFeedingCost(breed, 'standard');
    
    const difference = premiumCost.monthlyCost - standardCost.monthlyCost;
    
    if (!isFinite(difference)) {
      throw new Error('Diferencia de costos inválida');
    }
    
    const recommendation = generateRecommendation(breed, difference);
    
    return {
      premium: premiumCost,
      standard: standardCost,
      difference,
      recommendation
    };
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error comparando costos:', errorMsg);
    
    const emergencyResult = calculateMonthlyFeedingCost(breed, 'standard');
    return {
      premium: emergencyResult,
      standard: emergencyResult,
      difference: 0,
      recommendation: 'Comparación no disponible - usando estimación básica'
    };
  }
}

// 💡 GENERAR RECOMENDACIÓN SIMPLE
function generateRecommendation(breed: BreedCharacteristics, difference: number): string {
  try {
    const safeDifference = isFinite(difference) ? Math.abs(difference) : 0;
    const differenceFormatted = formatCurrency(safeDifference);
    
    let recommendation = `💰 Diferencia: ${differenceFormatted}/mes entre premium y estándar. `;
    
    if (safeDifference <= 50000) {
      recommendation += `✅ Diferencia pequeña, considera premium para mejor nutrición.`;
    } else if (safeDifference <= 100000) {
      recommendation += `⚖️ Diferencia moderada, evalúa según tu presupuesto.`;
    } else {
      recommendation += `💸 Diferencia considerable, estándar es más económico.`;
    }
    
    return recommendation;
  } catch {
    return 'Evalúa tu presupuesto y las necesidades de tu mascota';
  }
}

// 💰 FORMATEAR MONEDA DE FORMA SEGURA
function formatCurrency(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) {
    return '$0';
  }
  
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  } catch {
    return `$${Math.round(amount).toLocaleString()}`;
  }
}

// 🎯 INTEGRACIÓN CON PRESUPUESTO - SIMPLIFICADA
export function integrateWithBudgetCalculator(
  breed: BreedCharacteristics,
  userBudgetLevel: Level,
  feedingPreference: 'premium' | 'standard' | 'flexible' = 'flexible'
): {
  recommendedOption: 'premium' | 'standard';
  feedingCost: number;
  budgetCompatibility: 'excellent' | 'good' | 'tight' | 'over_budget';
  advice: string;
} {
  try {
    const budgetMap = { 1: 200000, 2: 400000, 3: 700000, 4: 1200000, 5: 2000000 };
    const userBudget = budgetMap[userBudgetLevel] || 700000;
    const comparison = compareFeedingCosts(breed);
    
    let recommendedOption: 'premium' | 'standard';
    let feedingCost: number;
    
    if (feedingPreference === 'premium') {
      recommendedOption = 'premium';
      feedingCost = comparison.premium.monthlyCost;
    } else if (feedingPreference === 'standard') {
      recommendedOption = 'standard';
      feedingCost = comparison.standard.monthlyCost;
    } else {
      // Flexible: decidir según presupuesto
      const premiumPercentage = (comparison.premium.monthlyCost / userBudget) * 100;
      
      if (premiumPercentage <= 25) {
        recommendedOption = 'premium';
        feedingCost = comparison.premium.monthlyCost;
      } else {
        recommendedOption = 'standard';
        feedingCost = comparison.standard.monthlyCost;
      }
    }
    
    const budgetPercentage = (feedingCost / userBudget) * 100;
    
    let budgetCompatibility: 'excellent' | 'good' | 'tight' | 'over_budget';
    if (budgetPercentage <= 20) budgetCompatibility = 'excellent';
    else if (budgetPercentage <= 35) budgetCompatibility = 'good';
    else if (budgetPercentage <= 50) budgetCompatibility = 'tight';
    else budgetCompatibility = 'over_budget';
    
    const advice = `🍖 ${recommendedOption}: ${formatCurrency(feedingCost)}/mes - ${budgetCompatibility}`;
    
    return {
      recommendedOption,
      feedingCost,
      budgetCompatibility,
      advice
    };
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error integrando con presupuesto:', errorMsg);
    
    return {
      recommendedOption: 'standard',
      feedingCost: breed?.type === 'cat' ? 35000 : 80000,
      budgetCompatibility: 'good',
      advice: 'Estimación básica - verifica cálculos'
    };
  }
}

// 📊 REPORTE COMPLETO - VERSIÓN SIMPLIFICADA
export function generateFeedingReport(breed: BreedCharacteristics): {
  summary: string;
  monthlyOptions: {
    premium: ReturnType<typeof calculateMonthlyFeedingCost>;
    standard: ReturnType<typeof calculateMonthlyFeedingCost>;
  };
  annualCosts: {
    premium: number;
    standard: number;
  };
  lifetimeCosts: {
    premium: number;
    standard: number;
    estimatedYears: number;
  };
  recommendations: string[];
} {
  try {
    const comparison = compareFeedingCosts(breed);
    
    const estimatedYears = breed.type === 'cat' ? 15 : 
                          breed.size === 'small' ? 14 :
                          breed.size === 'medium' ? 12 : 10;
    
    const annualCosts = {
      premium: comparison.premium.monthlyCost * 12,
      standard: comparison.standard.monthlyCost * 12
    };
    
    const lifetimeCosts = {
      premium: annualCosts.premium * estimatedYears,
      standard: annualCosts.standard * estimatedYears,
      estimatedYears
    };
    
    const summary = `🍖 Costos de alimentación para ${breed.name}`;
    
    const recommendations = [
      comparison.recommendation,
      `📅 Anual: Premium ${formatCurrency(annualCosts.premium)} vs Estándar ${formatCurrency(annualCosts.standard)}`,
      `🛒 Compra paquetes grandes para ahorrar`,
      breed.type === 'cat' ? '🐱 Variedad de sabores' : '🐕 Croquetas del tamaño adecuado'
    ];
    
    return {
      summary,
      monthlyOptions: {
        premium: comparison.premium,
        standard: comparison.standard
      },
      annualCosts,
      lifetimeCosts,
      recommendations
    };
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error generando reporte:', errorMsg);
    
    const emergencyMonthly = breed?.type === 'cat' ? 40000 : 80000;
    const emergencyResult = {
      monthlyCost: emergencyMonthly,
      packageInfo: { weight: 5, price: emergencyMonthly, duration: 30 },
      costPerDay: Math.round(emergencyMonthly / 30),
      explanation: `Estimación para ${breed?.name || 'mascota'}`
    };
    
    return {
      summary: `Estimación para ${breed?.name || 'mascota'}`,
      monthlyOptions: {
        premium: emergencyResult,
        standard: emergencyResult
      },
      annualCosts: {
        premium: emergencyMonthly * 12,
        standard: emergencyMonthly * 12
      },
      lifetimeCosts: {
        premium: emergencyMonthly * 12 * 12,
        standard: emergencyMonthly * 12 * 12,
        estimatedYears: 12
      },
      recommendations: ['Consulta precios locales']
    };
  }
}