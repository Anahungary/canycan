const FOOD_DATA = {
  dogs: {
    small: {
      premium: { weight: 7.5, price: 12e4, duration: 45 },
      standard: { weight: 15, price: 8e4, duration: 60 }
    },
    medium: {
      premium: { weight: 15, price: 2e5, duration: 45 },
      standard: { weight: 15, price: 1e5, duration: 30 }
    },
    large: {
      premium: { weight: 18, price: 28e4, duration: 30 },
      standard: { weight: 20, price: 15e4, duration: 25 }
    }
  },
  cats: {
    all_sizes: {
      premium: { weight: 1.5, price: 6e4, duration: 30 },
      standard: { weight: 1.5, price: 32500, duration: 30 }
    }
  }
};
function getFoodDataSafely(breed) {
  try {
    if (!breed?.type) {
      return FOOD_DATA.cats.all_sizes;
    }
    if (breed.type === "cat") {
      return FOOD_DATA.cats.all_sizes;
    }
    if (breed.type === "dog") {
      const size = breed.size || "medium";
      switch (size) {
        case "small":
          return FOOD_DATA.dogs.small;
        case "medium":
          return FOOD_DATA.dogs.medium;
        case "large":
          return FOOD_DATA.dogs.large;
        default:
          return FOOD_DATA.dogs.medium;
      }
    }
    return FOOD_DATA.cats.all_sizes;
  } catch {
    return {
      premium: { weight: 5, price: 8e4, duration: 30 },
      standard: { weight: 5, price: 5e4, duration: 30 }
    };
  }
}
function calculateMonthlyFeedingCost(breed, feedingPreference = "standard") {
  try {
    const foodData = getFoodDataSafely(breed);
    const packageInfo = foodData[feedingPreference];
    if (!packageInfo?.price || !packageInfo?.duration) {
      throw new Error("Datos de paquete inválidos");
    }
    const costPerDay = packageInfo.price / packageInfo.duration;
    const monthlyCost = Math.round(costPerDay * 30);
    if (!isFinite(costPerDay) || !isFinite(monthlyCost)) {
      throw new Error("Cálculo produce valores infinitos");
    }
    const explanation = generateExplanation(breed, feedingPreference, packageInfo, costPerDay);
    return {
      monthlyCost,
      packageInfo,
      costPerDay: Math.round(costPerDay),
      explanation
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    console.error("❌ Error calculando costo alimentación:", errorMsg);
    const emergencyPrice = breed?.type === "cat" ? 4e4 : breed?.size === "small" ? 6e4 : breed?.size === "large" ? 12e4 : 8e4;
    return {
      monthlyCost: emergencyPrice,
      packageInfo: { weight: 5, price: emergencyPrice, duration: 30 },
      costPerDay: Math.round(emergencyPrice / 30),
      explanation: `Estimación para ${breed?.name || "mascota desconocida"}`
    };
  }
}
function generateExplanation(breed, preference, packageInfo, costPerDay) {
  try {
    const petType = breed.type === "dog" ? "perro" : "gato";
    const sizeText = breed.type === "dog" && breed.size ? breed.size === "small" ? "pequeño" : breed.size === "medium" ? "mediano" : "grande" : "";
    const qualityText = preference === "premium" ? "premium" : "estándar";
    const priceFormatted = formatCurrency$1(packageInfo.price);
    const dailyCostFormatted = formatCurrency$1(costPerDay);
    if (breed.type === "cat") {
      return `🐱 Gato: ${packageInfo.weight}kg ${qualityText} = ${priceFormatted} (${packageInfo.duration} días) = ${dailyCostFormatted}/día`;
    } else {
      return `🐕 Perro ${sizeText}: ${packageInfo.weight}kg ${qualityText} = ${priceFormatted} (${packageInfo.duration} días) = ${dailyCostFormatted}/día`;
    }
  } catch {
    return `Costos estimados para ${breed.name}`;
  }
}
function compareFeedingCosts(breed) {
  try {
    const premiumCost = calculateMonthlyFeedingCost(breed, "premium");
    const standardCost = calculateMonthlyFeedingCost(breed, "standard");
    const difference = premiumCost.monthlyCost - standardCost.monthlyCost;
    if (!isFinite(difference)) {
      throw new Error("Diferencia de costos inválida");
    }
    const recommendation = generateRecommendation(breed, difference);
    return {
      premium: premiumCost,
      standard: standardCost,
      difference,
      recommendation
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Error desconocido";
    console.error("❌ Error comparando costos:", errorMsg);
    const emergencyResult = calculateMonthlyFeedingCost(breed, "standard");
    return {
      premium: emergencyResult,
      standard: emergencyResult,
      difference: 0,
      recommendation: "Comparación no disponible - usando estimación básica"
    };
  }
}
function generateRecommendation(breed, difference) {
  try {
    const safeDifference = isFinite(difference) ? Math.abs(difference) : 0;
    const differenceFormatted = formatCurrency$1(safeDifference);
    let recommendation = `💰 Diferencia: ${differenceFormatted}/mes entre premium y estándar. `;
    if (safeDifference <= 5e4) {
      recommendation += `✅ Diferencia pequeña, considera premium para mejor nutrición.`;
    } else if (safeDifference <= 1e5) {
      recommendation += `⚖️ Diferencia moderada, evalúa según tu presupuesto.`;
    } else {
      recommendation += `💸 Diferencia considerable, estándar es más económico.`;
    }
    return recommendation;
  } catch {
    return "Evalúa tu presupuesto y las necesidades de tu mascota";
  }
}
function formatCurrency$1(amount) {
  if (!isFinite(amount) || isNaN(amount)) {
    return "$0";
  }
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(amount);
  } catch {
    return `$${Math.round(amount).toLocaleString()}`;
  }
}

const getBaseCosts = (breed) => {
  if (!breed || !breed.type) {
    console.warn("⚠️ Raza sin tipo, usando costos por defecto");
    return { veterinary: 7e4, accessories: 4e4, grooming: 5e4 };
  }
  if (breed.type === "cat") {
    return {
      veterinary: 7e4,
      accessories: 4e4,
      // Arena, arenero, juguetes, rascador
      grooming: 3e4
      // Menos grooming que perros
    };
  }
  if (breed.type === "dog") {
    const size = breed.size || "medium";
    switch (size.toLowerCase()) {
      case "tiny":
      // 🔧 AÑADIDO: Soporte para "tiny"
      case "small":
        return {
          veterinary: 8e4,
          accessories: 5e4,
          grooming: 6e4
        };
      case "medium":
        return {
          veterinary: 1e5,
          accessories: 6e4,
          grooming: 8e4
        };
      case "large":
      case "giant":
        return {
          veterinary: 12e4,
          accessories: 8e4,
          grooming: 1e5
        };
      default:
        console.warn(`⚠️ Tamaño de perro desconocido: ${size}, usando mediano`);
        return {
          veterinary: 1e5,
          accessories: 6e4,
          grooming: 8e4
        };
    }
  }
  return { veterinary: 7e4, accessories: 4e4, grooming: 5e4 };
};
const getHealthMultiplier = (healthLevel) => {
  if (!healthLevel || typeof healthLevel !== "number") {
    return 1;
  }
  const multipliers = {
    1: 1,
    // Sin problemas
    2: 1.1,
    // Problemas menores
    3: 1.2,
    // Problemas moderados  
    4: 1.4,
    // Problemas frecuentes
    5: 1.6
    // Problemas severos/crónicos
  };
  return multipliers[healthLevel] || 1;
};
const getGroomingMultiplier = (groomingLevel) => {
  if (!groomingLevel || typeof groomingLevel !== "number") {
    return 1;
  }
  const multipliers = {
    1: 0.5,
    // Grooming mínimo
    2: 0.7,
    // Grooming bajo
    3: 1,
    // Grooming normal
    4: 1.5,
    // Grooming alto
    5: 2
    // Grooming muy alto
  };
  return multipliers[groomingLevel] || 1;
};
function calculateMonthlyCost(breed, userProfile, feedingPreference) {
  try {
    console.log(`💰 Calculando costo mensual para: ${breed.name} (${breed.type}, ${breed.size})`);
    let actualFeedingPreference = "standard";
    if (feedingPreference === "premium") {
      actualFeedingPreference = "premium";
    } else if (feedingPreference === "standard") {
      actualFeedingPreference = "standard";
    } else if (userProfile.feedingPreference === "premium") {
      actualFeedingPreference = "premium";
    } else if (userProfile.feedingPreference === "flexible") {
      actualFeedingPreference = userProfile.budgetLevel >= 3 ? "premium" : "standard";
    }
    const feedingResult = calculateMonthlyFeedingCost(breed, actualFeedingPreference);
    if (!feedingResult || !isFinite(feedingResult.monthlyCost) || isNaN(feedingResult.monthlyCost)) {
      throw new Error("Error en cálculo de alimentación");
    }
    const feedingCost = feedingResult.monthlyCost;
    const baseCosts = getBaseCosts(breed);
    const healthMultiplier = getHealthMultiplier(breed.healthIssues);
    const groomingMultiplier = getGroomingMultiplier(breed.grooming);
    const adjustedVeterinaryCost = Math.round(baseCosts.veterinary * healthMultiplier);
    const adjustedGroomingCost = Math.round(baseCosts.grooming * groomingMultiplier);
    const breakdown = {
      food: feedingCost,
      veterinary: adjustedVeterinaryCost,
      grooming: adjustedGroomingCost,
      accessories: baseCosts.accessories,
      total: 0
      // Se calcula abajo
    };
    const validatedBreakdown = {
      food: isFinite(breakdown.food) ? breakdown.food : 0,
      veterinary: isFinite(breakdown.veterinary) ? breakdown.veterinary : 0,
      grooming: isFinite(breakdown.grooming) ? breakdown.grooming : 0,
      accessories: isFinite(breakdown.accessories) ? breakdown.accessories : 0,
      total: 0
    };
    validatedBreakdown.total = validatedBreakdown.food + validatedBreakdown.veterinary + validatedBreakdown.grooming + validatedBreakdown.accessories;
    if (!isFinite(validatedBreakdown.total) || isNaN(validatedBreakdown.total)) {
      throw new Error("Total calculado es inválido");
    }
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
    console.error("❌ Error calculating monthly cost:", error);
    const emergencyBreakdown = {
      food: breed.type === "cat" ? 4e4 : breed.size === "small" ? 7e4 : breed.size === "large" ? 15e4 : 1e5,
      veterinary: breed.type === "cat" ? 7e4 : 1e5,
      accessories: breed.type === "cat" ? 4e4 : 6e4,
      grooming: breed.type === "cat" ? 3e4 : 8e4,
      total: 0
    };
    emergencyBreakdown.total = emergencyBreakdown.food + emergencyBreakdown.veterinary + emergencyBreakdown.grooming + emergencyBreakdown.accessories;
    return {
      total: emergencyBreakdown.total,
      breakdown: emergencyBreakdown,
      feedingDetails: {
        type: "standard",
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
function calculateTotalBudgetImpact(userProfile, newBreed, feedingPreference) {
  try {
    console.log(`📊 Calculando impacto presupuestario para: ${newBreed.name}`);
    let currentMonthlyCost = 0;
    if (userProfile.hasOtherPets && userProfile.otherPets !== "no_pets") {
      const otherPetsArray = Array.isArray(userProfile.otherPets) ? userProfile.otherPets : [userProfile.otherPets];
      otherPetsArray.forEach((petType) => {
        if (petType === "dogs") {
          currentMonthlyCost += 35e4;
        } else if (petType === "cats") {
          currentMonthlyCost += 18e4;
        } else if (petType === "small_pets") {
          currentMonthlyCost += 1e5;
        }
      });
    }
    const newPetCostDetails = calculateMonthlyCost(newBreed, userProfile, feedingPreference);
    if (!isFinite(newPetCostDetails.total) || isNaN(newPetCostDetails.total)) {
      throw new Error("Costo de nueva mascota inválido");
    }
    const totalWithNewPet = currentMonthlyCost + newPetCostDetails.total;
    const userBudget = mapBudgetToCOP(userProfile.budgetLevel);
    if (!isFinite(totalWithNewPet) || !isFinite(userBudget)) {
      throw new Error("Cálculos de presupuesto inválidos");
    }
    const budgetDifference = totalWithNewPet - userBudget;
    const affordabilityPercentage = userBudget > 0 ? Math.round(userBudget / totalWithNewPet * 100) : 0;
    const feedingAnalysis = generateFeedingAnalysis(newBreed, userProfile, newPetCostDetails.feedingDetails.type);
    const result = {
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
      affordability: result.affordabilityPercentage + "%"
    });
    return result;
  } catch (error) {
    console.error("❌ Error calculating budget impact:", error);
    const emergencyCost = 25e4;
    const userBudget = mapBudgetToCOP(userProfile.budgetLevel);
    return {
      currentMonthlyCost: 0,
      newPetCost: emergencyCost,
      newPetBreakdown: {
        food: 8e4,
        veterinary: 8e4,
        accessories: 4e4,
        grooming: 5e4,
        total: emergencyCost
      },
      totalWithNewPet: emergencyCost,
      userBudget,
      isOverBudget: emergencyCost > userBudget,
      budgetDifference: emergencyCost - userBudget,
      affordabilityPercentage: userBudget > 0 ? Math.round(userBudget / emergencyCost * 100) : 0,
      feedingAnalysis: {
        recommendedOption: "standard",
        budgetCompatibility: "good",
        advice: "Estimación de emergencia - verifica cálculos"
      }
    };
  }
}
function mapBudgetToCOP(budgetLevel) {
  const budgetMap = {
    1: 2e5,
    // Muy bajo
    2: 4e5,
    // Bajo
    3: 7e5,
    // Moderado
    4: 12e5,
    // Alto
    5: 2e6
    // Muy alto
  };
  const budget = budgetMap[budgetLevel];
  return isFinite(budget) ? budget : 7e5;
}
function generateFeedingAnalysis(breed, userProfile, recommendedOption) {
  try {
    const userBudget = mapBudgetToCOP(userProfile.budgetLevel);
    const feedingCost = calculateMonthlyFeedingCost(breed, recommendedOption);
    if (!isFinite(feedingCost.monthlyCost)) {
      throw new Error("Costo de alimentación inválido");
    }
    const budgetPercentage = feedingCost.monthlyCost / userBudget * 100;
    let budgetCompatibility;
    if (budgetPercentage <= 20) budgetCompatibility = "excellent";
    else if (budgetPercentage <= 35) budgetCompatibility = "good";
    else if (budgetPercentage <= 50) budgetCompatibility = "tight";
    else budgetCompatibility = "over_budget";
    let advice = `🍖 Alimentación ${recommendedOption}: ${formatCurrency(feedingCost.monthlyCost)}/mes `;
    switch (budgetCompatibility) {
      case "excellent":
        advice += `✅ Excelente para tu presupuesto. `;
        break;
      case "good":
        advice += `✅ Se ajusta bien a tu presupuesto. `;
        break;
      case "tight":
        advice += `⚠️ Un poco ajustado para tu presupuesto. `;
        break;
      case "over_budget":
        advice += `❌ Supera tu presupuesto mensual. `;
        break;
    }
    return {
      recommendedOption,
      budgetCompatibility,
      advice
    };
  } catch (error) {
    console.error("❌ Error generating feeding analysis:", error);
    return {
      recommendedOption: "standard",
      budgetCompatibility: "good",
      advice: "Análisis de alimentación no disponible"
    };
  }
}
function generateBudgetCompatibilityAnalysis(userProfile, breed, feedingPreference) {
  try {
    const budgetAnalysis = calculateTotalBudgetImpact(userProfile, breed, feedingPreference);
    const analysis = {
      isAffordable: !budgetAnalysis.isOverBudget,
      riskLevel: getRiskLevel(budgetAnalysis.affordabilityPercentage),
      recommendations: [],
      warnings: [],
      alternatives: []
    };
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
      analysis.alternatives.push("Considera una raza de menor tamaño para reducir costos");
    }
    return {
      ...budgetAnalysis,
      analysis
    };
  } catch (error) {
    console.error("❌ Error generating budget compatibility analysis:", error);
    const emergencyAnalysis = calculateTotalBudgetImpact(userProfile, breed, feedingPreference);
    return {
      ...emergencyAnalysis,
      analysis: {
        isAffordable: true,
        riskLevel: "moderate",
        recommendations: ["Análisis detallado no disponible"],
        warnings: ["Verifica los cálculos manualmente"],
        alternatives: []
      }
    };
  }
}
function getRiskLevel(affordabilityPercentage) {
  if (!isFinite(affordabilityPercentage) || isNaN(affordabilityPercentage)) {
    return "moderate";
  }
  if (affordabilityPercentage >= 120) return "low";
  if (affordabilityPercentage >= 100) return "moderate";
  if (affordabilityPercentage >= 80) return "high";
  return "very_high";
}
function formatCurrency(amount) {
  if (!isFinite(amount) || isNaN(amount)) {
    return "$0";
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
function addBudgetChallenges(breed, userProfile, existingChallenges = []) {
  try {
    const challenges = [...existingChallenges];
    const budgetAnalysis = generateBudgetCompatibilityAnalysis(userProfile, breed);
    if (budgetAnalysis.analysis.riskLevel === "very_high") {
      challenges.push(
        `💸 PRESUPUESTO CRÍTICO: Esta raza costaría ${formatCurrency(budgetAnalysis.totalWithNewPet)}/mes, superando tu presupuesto`
      );
    } else if (budgetAnalysis.analysis.riskLevel === "high") {
      challenges.push(
        `⚠️ PRESUPUESTO AJUSTADO: Los gastos mensuales están en el límite de tu presupuesto`
      );
    }
    budgetAnalysis.analysis.warnings.forEach((warning) => {
      if (!challenges.includes(warning)) {
        challenges.push(warning);
      }
    });
    return challenges;
  } catch (error) {
    console.error("❌ Error adding budget challenges:", error);
    return existingChallenges;
  }
}
function addBudgetStrengths(breed, userProfile, existingStrengths = []) {
  try {
    const strengths = [...existingStrengths];
    const budgetAnalysis = generateBudgetCompatibilityAnalysis(userProfile, breed);
    if (budgetAnalysis.analysis.riskLevel === "low") {
      strengths.push(
        `💰 MUY ECONÓMICO: Los gastos mensuales están muy por debajo de tu presupuesto`
      );
    }
    budgetAnalysis.analysis.recommendations.forEach((recommendation) => {
      if (!strengths.includes(recommendation)) {
        strengths.push(recommendation);
      }
    });
    return strengths;
  } catch (error) {
    console.error("❌ Error adding budget strengths:", error);
    return existingStrengths;
  }
}

const COLOMBIAN_BREED_IDS = /* @__PURE__ */ new Set([
  // 🐕 PERROS DISPONIBLES EN COLOMBIA
  "airedale-terrier",
  "akita-americano",
  "american-bully",
  "basset-hound",
  "beagle",
  "bernes-montana",
  "bichon-frise",
  "bichon-maltes",
  "border-collie",
  "boston-terrier",
  "boxer",
  "bull-terrier-ingles",
  "bullmastiff",
  "bulldog-frances",
  "bulldog-ingles",
  "cane-corso",
  "cavalier-king-charles",
  "chihuahua",
  "chow-chow",
  "cocker-spaniel-ingles",
  "collie-pastor-escoces",
  "corgi-gales-pembroke",
  "dalmata",
  "dachshund-teckel",
  "doberman",
  "dogo-argentino",
  "fila-brasileno",
  "golden-retriever",
  "gran-danes",
  "husky-siberiano",
  "jack-russell-terrier",
  "labrador-retriever",
  "lhasa-apso",
  "malamute-alaska",
  "mastin-napolitano",
  "pastor-aleman",
  "pastor-australiano",
  "pastor-belga-malinois",
  "pastor-ganadero-australiano",
  "pastor-shetland",
  "pinscher-miniatura",
  "pitbull-american",
  "pomerania-spitz",
  "pomsky",
  "poodle-toy-mini",
  "pug-carlino",
  "rottweiler",
  "samoyedo",
  "san-bernardo",
  "shar-pei",
  "shiba-inu",
  "shih-tzu",
  "schnauzer-miniatura",
  "terranova",
  "west-highland-terrier",
  "yorkshire-terrier",
  // 🐱 GATOS DISPONIBLES EN COLOMBIA
  "abisinio",
  "angora-turco",
  "azul-ruso",
  "bengali",
  "bosque-noruega",
  "britanico-pelo-corto",
  "cornish-rex",
  "devon-rex",
  "exotico-pelo-corto",
  "himalayo-persa",
  "maine-coon",
  "munchkin",
  "persa",
  "ragdoll",
  "ragamuffin",
  "savannah",
  "scottish-fold",
  "siames",
  "siberiano",
  "somali",
  "sphynx-esfinge"
]);
function isAvailableInColombia(breedId) {
  return COLOMBIAN_BREED_IDS.has(breedId);
}

const getDefaultWeights = () => ({
  size: 5,
  energyLevel: 8,
  independence: 7,
  noiseLevel: 6,
  grooming: 5,
  training: 5,
  goodWith: 9,
  healthIssues: 4,
  budget: 7,
  // 🆕 Peso incrementado para presupuesto COP
  costLevel: 3
});
function calculateCompatibilityScore(breed, userProfile) {
  let score = 0;
  let maxScore = 0;
  const weights = getDefaultWeights();
  const sizeScore = calculateSizeCompatibility(breed.size, userProfile.sizePreference, userProfile.homeType);
  score += sizeScore * weights.size;
  maxScore += weights.size;
  const energyScore = calculateEnergyCompatibility(breed.energyLevel, userProfile.activityLevel, userProfile.hoursAway);
  score += energyScore * weights.energyLevel;
  maxScore += weights.energyLevel;
  const independenceScore = calculateIndependenceScore(breed.independenceLevel || 3, userProfile.hoursAway);
  score += independenceScore * weights.independence;
  maxScore += weights.independence;
  const noiseScore = calculateNoiseCompatibility(breed, userProfile);
  score += noiseScore * weights.noiseLevel;
  maxScore += weights.noiseLevel;
  const groomingScore = calculateGroomingCompatibility(breed.grooming, userProfile.groomingWillingness, userProfile.budgetLevel);
  score += groomingScore * weights.grooming;
  maxScore += weights.grooming;
  const trainingScore = calculateTrainingCompatibility(breed, userProfile);
  score += trainingScore * weights.training;
  maxScore += weights.training;
  const goodWithScore = calculateFamilyCompatibility(breed, userProfile);
  score += goodWithScore * weights.goodWith;
  maxScore += weights.goodWith;
  const healthScore = calculateHealthCompatibility(breed.healthIssues || 3, userProfile.budgetLevel);
  score += healthScore * weights.healthIssues;
  maxScore += weights.healthIssues;
  const budgetScore = calculateBudgetCompatibilityScore(breed, userProfile);
  score += budgetScore * weights.budget;
  maxScore += weights.budget;
  const costScore = calculateCostCompatibility(breed.costLevel || 3, userProfile.budgetLevel);
  score += costScore * weights.costLevel;
  maxScore += weights.costLevel;
  return Math.round(score / maxScore * 100);
}
function calculateSizeCompatibility(breedSize, userPreference, homeType) {
  if (userPreference === "any") return 1;
  if (userPreference === breedSize) return 1;
  if (homeType === "apartment_small" && breedSize === "large") {
    return 0.1;
  }
  if (homeType === "apartment_large" && breedSize === "large") {
    return 0.5;
  }
  if (userPreference === "medium" && breedSize === "small" || userPreference === "small" && breedSize === "medium") {
    return 0.7;
  }
  if (userPreference === "large" && breedSize === "medium" || userPreference === "medium" && breedSize === "large") {
    return 0.6;
  }
  return 0.3;
}
function calculateEnergyCompatibility(breedEnergy, userActivity, hoursAway) {
  const energyDifference = Math.abs(userActivity - breedEnergy);
  if (energyDifference === 0) return 1;
  if (userActivity <= 2 && breedEnergy >= 4) {
    return 0.1;
  }
  if (userActivity >= 4 && breedEnergy <= 2) {
    return 0.3;
  }
  if (hoursAway >= 8 && breedEnergy >= 4) {
    return 0.2;
  }
  if (energyDifference === 1) return 0.8;
  if (energyDifference === 2) return 0.5;
  return 0.2;
}
function calculateNoiseCompatibility(breed, userProfile) {
  if (breed.type === "cat") {
    return userProfile.noiseToleranceLevel >= 2 ? 1 : 0.8;
  }
  const breedNoise = breed.noiseLevel || 3;
  const userTolerance = userProfile.noiseToleranceLevel;
  if ((userProfile.homeType === "apartment_small" || userProfile.homeType === "apartment_large") && breedNoise >= 4 && userTolerance <= 2) {
    return 0.1;
  }
  const noiseDifference = userTolerance - breedNoise;
  if (noiseDifference >= 0) return 1;
  if (noiseDifference === -1) return 0.6;
  if (noiseDifference === -2) return 0.3;
  return 0.1;
}
function calculateGroomingCompatibility(breedGrooming, userWillingness, userBudget) {
  const groomingDifference = userWillingness - breedGrooming;
  if (breedGrooming >= 4 && userWillingness <= 2 && userBudget <= 2) {
    return 0.1;
  }
  if (groomingDifference < 0 && userBudget >= 4) {
    return 0.7;
  }
  if (groomingDifference >= 0) return 1;
  if (groomingDifference === -1) return 0.6;
  if (groomingDifference === -2) return 0.3;
  return 0.1;
}
function calculateTrainingCompatibility(breed, userProfile) {
  if (breed.type === "cat") {
    return 0.9;
  }
  const breedTrainingNeeds = breed.training;
  const userTrainingWillingness = userProfile.trainingWillingness;
  if (userTrainingWillingness === 5) {
    return 1;
  }
  if (userProfile.experience === "first_time" && breedTrainingNeeds >= 4) {
    return 0.1;
  }
  const trainingDifference = userTrainingWillingness - breedTrainingNeeds;
  if (trainingDifference >= 0) return 1;
  if (trainingDifference === -1) return 0.6;
  if (trainingDifference === -2) return 0.3;
  return 0.1;
}
function calculateFamilyCompatibility(breed, userProfile) {
  let score = 0;
  let factors = 0;
  if (userProfile.hasChildren) {
    factors++;
    if (breed.goodWith && breed.goodWith.includes("children")) {
      score += 1;
    } else {
      if (userProfile.childrenAge === "young_children") {
        score += 0.1;
      } else if (userProfile.childrenAge === "older_children") {
        score += 0.4;
      } else {
        score += 0.6;
      }
    }
  }
  if (userProfile.hasOtherPets && userProfile.otherPets !== "no_pets") {
    factors++;
    const otherPetsArray = Array.isArray(userProfile.otherPets) ? userProfile.otherPets : [userProfile.otherPets];
    let petCompatibilityScore = 0;
    for (const otherPet of otherPetsArray) {
      if (breed.goodWith && otherPet === "dogs" && breed.goodWith.includes("dogs")) {
        petCompatibilityScore += 1;
      } else if (breed.goodWith && otherPet === "cats" && breed.goodWith.includes("cats")) {
        petCompatibilityScore += 1;
      } else if (otherPet === "small_pets") {
        petCompatibilityScore += breed.type === "cat" ? 0.4 : breed.energyLevel <= 2 ? 0.6 : 0.2;
      } else {
        petCompatibilityScore += 0.3;
      }
    }
    score += petCompatibilityScore / otherPetsArray.length;
  }
  factors++;
  if (userProfile.homeType === "apartment_small" || userProfile.homeType === "apartment_large") {
    if (breed.goodWith && breed.goodWith.includes("apartments")) {
      score += 1;
    } else if (breed.size === "small" || breed.size === "medium" && breed.energyLevel <= 3) {
      score += 0.7;
    } else {
      score += 0.2;
    }
  } else {
    score += 1;
  }
  return factors > 0 ? score / factors : 1;
}
function calculateIndependenceScore(breedIndependence, userHoursAway) {
  if (userHoursAway <= 4) return 1;
  if (userHoursAway >= 10 && breedIndependence <= 2) {
    return 0.1;
  }
  if (userHoursAway > 8) {
    return breedIndependence >= 4 ? 1 : breedIndependence === 3 ? 0.5 : breedIndependence === 2 ? 0.2 : 0.1;
  }
  return breedIndependence >= 3 ? 1 : breedIndependence === 2 ? 0.7 : 0.4;
}
function calculateHealthCompatibility(healthIssues, userBudget) {
  const baseScore = (6 - healthIssues) / 5;
  if (healthIssues >= 4 && userBudget <= 2) {
    return baseScore * 0.3;
  }
  if (healthIssues >= 3 && userBudget >= 4) {
    return Math.min(baseScore * 1.2, 1);
  }
  return baseScore;
}
function calculateCostCompatibility(breedCostLevel, userBudget) {
  const costDifference = userBudget - breedCostLevel;
  if (costDifference >= 0) return 1;
  if (costDifference === -1) return 0.6;
  if (costDifference === -2) return 0.3;
  return 0.1;
}
function calculateBudgetCompatibilityScore(breed, userProfile) {
  try {
    if (!breed || !userProfile) {
      console.warn("Datos insuficientes para calcular compatibilidad de presupuesto");
      return 0.5;
    }
    const feedingPreference = userProfile.feedingPreference || "standard";
    const budgetAnalysis = generateBudgetCompatibilityAnalysis(
      userProfile,
      breed,
      feedingPreference
    );
    switch (budgetAnalysis.analysis.riskLevel) {
      case "low":
        return 1;
      case "moderate":
        return 0.8;
      case "high":
        return 0.4;
      // Más severo
      case "very_high":
        return 0.1;
      // Crítico
      default:
        return 0.5;
    }
  } catch (error) {
    console.warn("Error calculando compatibilidad de presupuesto, usando valor por defecto:", error);
    return 0.5;
  }
}
function getDualBreedRecommendations(userProfile, allBreeds) {
  console.log("🇨🇴 Iniciando recomendación dual Colombia/Global...");
  const allCompatibilities = allBreeds.map((breed) => {
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
  const colombianBreeds = allCompatibilities.filter((result) => result.isColombianAvailable).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  const globalBreeds = allCompatibilities.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  console.log(`📊 Razas analizadas: ${globalBreeds.length} globales, ${colombianBreeds.length} colombianas`);
  const globalRecommendation = globalBreeds[0];
  const colombianRecommendation = colombianBreeds[0];
  if (!globalRecommendation || !colombianRecommendation) {
    throw new Error("No se encontraron razas compatibles");
  }
  const colombianRankInGlobal = globalBreeds.findIndex(
    (result) => result.breed.id === colombianRecommendation.breed.id
  ) + 1;
  const isColombianSameAsGlobal = globalRecommendation.breed.id === colombianRecommendation.breed.id;
  const scoreDifference = globalRecommendation.compatibilityScore - colombianRecommendation.compatibilityScore;
  const message = generateAvailabilityMessage(
    isColombianSameAsGlobal,
    scoreDifference,
    colombianRankInGlobal,
    colombianRecommendation.breed.name,
    globalRecommendation.breed.name
  );
  const colombianAlternatives = colombianBreeds.slice(1, 4).filter((result) => result.compatibilityScore >= 60);
  const cleanResult = (result) => {
    const { isColombianAvailable, ...cleanedResult } = result;
    return cleanedResult;
  };
  console.log("✅ Recomendación dual generada exitosamente");
  return {
    colombianRecommendation: cleanResult(colombianRecommendation),
    globalRecommendation: cleanResult(globalRecommendation),
    colombianAlternatives: colombianAlternatives.map((result) => cleanResult(result)),
    availability: {
      isColombianSameAsGlobal,
      colombianRank: colombianRankInGlobal,
      globalRank: 1,
      scoreDifference,
      message
    }
  };
}
function generateAvailabilityMessage(isSame, scoreDiff, colombianRank, colombianName, globalName) {
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
function getCompatibilityCategory(score) {
  if (score >= 85) return "excelente";
  if (score >= 70) return "muy buena";
  if (score >= 55) return "buena";
  if (score >= 40) return "moderada";
  return "baja";
}
function mapExperienceToLevel(experience) {
  switch (experience) {
    case "experienced":
      return 5;
    case "some_experience":
      return 3;
    case "first_time":
    default:
      return 1;
  }
}
function identifyStrengths(breed, userProfile) {
  const strengths = [];
  if (!breed || !userProfile) {
    console.warn("Datos insuficientes para identificar fortalezas");
    return ["Información de raza disponible"];
  }
  try {
    if (breed.size === userProfile.sizePreference || userProfile.sizePreference === "any") {
      if (breed.size === "small") {
        strengths.push("Tamaño pequeño, ideal para espacios reducidos");
      } else if (breed.size === "medium") {
        strengths.push("Tamaño mediano, equilibrado para diversos espacios");
      } else if (breed.size === "large" && userProfile.homeType.includes("house")) {
        strengths.push("Tamaño grande, ideal para casas con espacio");
      }
    }
    if (Math.abs(breed.energyLevel - userProfile.activityLevel) <= 1) {
      if (breed.energyLevel >= 4 && userProfile.activityLevel >= 4) {
        strengths.push("Alta energía, perfecto para personas activas");
      } else if (breed.energyLevel <= 2 && userProfile.activityLevel <= 2) {
        strengths.push("Tranquilo y calmado, ideal para un estilo de vida relajado");
      } else {
        strengths.push("Nivel de energía equilibrado que se adapta a tu estilo de vida");
      }
    }
    if (userProfile.hasChildren && breed.goodWith && breed.goodWith.includes("children")) {
      strengths.push("Excelente con niños, paciente y tolerante");
    }
    if (userProfile.hasOtherPets) {
      if (Array.isArray(userProfile.otherPets)) {
        userProfile.otherPets.forEach((petType) => {
          if (breed.goodWith && (petType === "dogs" && breed.goodWith.includes("dogs") || petType === "cats" && breed.goodWith.includes("cats"))) {
            strengths.push(`Se lleva bien con otros ${petType === "dogs" ? "perros" : "gatos"}`);
          }
        });
      } else {
        if (breed.goodWith && (userProfile.otherPets === "dogs" && breed.goodWith.includes("dogs") || userProfile.otherPets === "cats" && breed.goodWith.includes("cats"))) {
          strengths.push(`Se lleva bien con otros ${userProfile.otherPets === "dogs" ? "perros" : "gatos"}`);
        }
      }
    }
    if (breed.training <= mapExperienceToLevel(userProfile.experience)) {
      if (breed.training <= 2) {
        strengths.push("Fácil de entrenar, ideal para dueños primerizos");
      } else if (breed.training <= 3) {
        strengths.push("Nivel de entrenamiento moderado, adecuado para tu experiencia");
      }
    }
    if (breed.grooming <= userProfile.groomingWillingness) {
      if (breed.grooming <= 2) {
        strengths.push("Bajo mantenimiento, necesita mínimos cuidados de aseo");
      }
    }
    if (userProfile.hoursAway >= 6 && breed.independenceLevel >= 4) {
      strengths.push("Independiente, puede quedarse solo durante tus horas de trabajo");
    } else if (userProfile.hoursAway <= 4 && breed.independenceLevel <= 2) {
      strengths.push("Disfruta de la compañía constante, perfecto para tu disponibilidad");
    }
    if (userProfile.allergies && breed.hypoallergenic) {
      strengths.push("Hipoalergénico, menos probabilidades de causar reacciones alérgicas");
    }
    if (breed.noiseLevel <= userProfile.noiseToleranceLevel) {
      if (breed.noiseLevel <= 2) {
        strengths.push("Tranquilo, no suele ser ruidoso");
      }
    }
    if (breed.costLevel <= userProfile.budgetLevel) {
      if (breed.costLevel <= 2) {
        strengths.push("Económico de mantener, se ajusta a tu presupuesto");
      }
    }
    try {
      return addBudgetStrengths(breed, userProfile, strengths);
    } catch (budgetError) {
      console.warn("Error añadiendo fortalezas de presupuesto:", budgetError);
      return strengths;
    }
  } catch (error) {
    console.error("Error identificando fortalezas:", error);
    return [`${breed.name} es una raza ${breed.type === "dog" ? "canina" : "felina"} con características únicas`];
  }
}
function identifyChallenges(breed, userProfile) {
  const challenges = [];
  if (!breed || !userProfile) {
    console.warn("Datos insuficientes para identificar desafíos");
    return ["Consulta información adicional sobre esta raza"];
  }
  try {
    if (userProfile.sizePreference !== "any" && breed.size !== userProfile.sizePreference) {
      if (breed.size === "large" && userProfile.sizePreference === "small") {
        challenges.push("Más grande de lo que prefieres, necesitará más espacio");
      } else if (breed.size === "small" && userProfile.sizePreference === "large") {
        challenges.push("Más pequeño de lo que prefieres, aunque más adaptable a espacios reducidos");
      }
    }
    if (Math.abs(breed.energyLevel - userProfile.activityLevel) >= 2) {
      if (breed.energyLevel > userProfile.activityLevel) {
        challenges.push("Necesita más ejercicio del que normalmente realizas");
      } else {
        challenges.push("Podría no seguir tu ritmo de actividad física");
      }
    }
    if (userProfile.hasChildren && breed.goodWith && !breed.goodWith.includes("children")) {
      challenges.push("Requiere supervisión con niños, ya que no es su punto fuerte");
    }
    if (userProfile.hasOtherPets) {
      const otherPetsArray = Array.isArray(userProfile.otherPets) ? userProfile.otherPets : [userProfile.otherPets];
      otherPetsArray.forEach((petType) => {
        if (breed.goodWith && (petType === "dogs" && !breed.goodWith.includes("dogs") || petType === "cats" && !breed.goodWith.includes("cats"))) {
          challenges.push(`Puede necesitar socialización para convivir con tus ${petType === "dogs" ? "perros" : "gatos"}`);
        }
      });
    }
    if (breed.training > mapExperienceToLevel(userProfile.experience)) {
      if (breed.training >= 4) {
        challenges.push("Requiere entrenamiento constante y experiencia, puede ser desafiante");
      } else {
        challenges.push("Necesitarás algo de paciencia durante el entrenamiento");
      }
    }
    if (breed.grooming > userProfile.groomingWillingness) {
      if (breed.grooming >= 4) {
        challenges.push("Necesita cuidados de aseo frecuentes, más de lo que habías considerado");
      } else {
        challenges.push("Requiere algo más de cuidados de los que prefieres");
      }
    }
    if (userProfile.hoursAway >= 8 && breed.independenceLevel <= 2) {
      challenges.push("Puede sufrir ansiedad por separación si pasa muchas horas solo");
    }
    if (userProfile.allergies && !breed.hypoallergenic) {
      challenges.push("No es hipoalergénico, puede provocar reacciones alérgicas");
    }
    if (breed.noiseLevel > userProfile.noiseToleranceLevel) {
      if (breed.noiseLevel >= 4) {
        challenges.push("Tiende a ser vocal, puede ser más ruidoso de lo que prefieres");
      } else {
        challenges.push("Puede ser algo más ruidoso de lo ideal para ti");
      }
    }
    if (breed.costLevel > userProfile.budgetLevel) {
      if (breed.costLevel >= 4) {
        challenges.push("Mantenimiento costoso, superior a tu presupuesto ideal");
      } else {
        challenges.push("Puede requerir algo más de presupuesto del previsto");
      }
    }
    if (breed.healthIssues >= 4) {
      challenges.push("Predisposición a ciertos problemas de salud, consulta con el veterinario");
    }
    try {
      return addBudgetChallenges(breed, userProfile, challenges);
    } catch (budgetError) {
      console.warn("Error añadiendo desafíos de presupuesto:", budgetError);
      return challenges;
    }
  } catch (error) {
    console.error("Error identificando desafíos:", error);
    return ["Consulta con expertos sobre las necesidades específicas de esta raza"];
  }
}

export { identifyChallenges as a, calculateCompatibilityScore as c, getDualBreedRecommendations as g, identifyStrengths as i };
