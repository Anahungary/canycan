// src/utils/quizHelpers.ts - PREGUNTAS DINÁMICAS POR TIPO DE MASCOTA

import type {
  UserProfile,
  QuizAnswers,
  ExperienceLevel,
  Level,
  ChildrenAge,
  PetType,
  HomeType,
  QuizQuestion
} from '../types/breeds';

// 🆕 FUNCIÓN PARA GENERAR OPCIONES DINÁMICAS DE TAMAÑO
function getSizePreferenceOptions(petType: 'dog' | 'cat' | 'any'): Array<{value: string, text: string}> {
  if (petType === 'cat') {
    return [
      { value: 'small', text: '🐱 Pequeño/a - Gatos compactos y delicados (2-4 kg)' },
      { value: 'medium', text: '🐱 Mediano/a - Gatos de tamaño estándar (4-6 kg)' },
      { value: 'large', text: '🐱 Grande - Gatos robustos como Maine Coon (6+ kg)' },
      { value: 'any', text: '🤷‍♀️ No importa - El tamaño no es un factor decisivo' }
    ];
  } else if (petType === 'dog') {
    return [
      { value: 'small', text: '🐕‍🦺 Pequeño - Fácil de manejar y transportar (hasta 10 kg)' },
      { value: 'medium', text: '🐕 Mediano - Equilibrio entre tamaño y facilidad (10-25 kg)' },
      { value: 'large', text: '🐕‍🦮 Grande - Me gustan las mascotas imponentes (25+ kg)' },
      { value: 'any', text: '🤷‍♀️ No importa - El tamaño no es un factor decisivo' }
    ];
  } else {
    return [
      { value: 'small', text: '🐾 Pequeño - Mascotas compactas y manejables' },
      { value: 'medium', text: '🐾 Mediano - Tamaño estándar, equilibrado' },
      { value: 'large', text: '🐾 Grande - Mascotas de mayor tamaño' },
      { value: 'any', text: '🤷‍♀️ No importa - El tamaño no es un factor decisivo' }
    ];
  }
}

// 🆕 FUNCIÓN PARA GENERAR OPCIONES DINÁMICAS DE RUIDO
function getNoiseToleranceOptions(petType: 'dog' | 'cat' | 'any'): Array<{value: string, text: string}> {
  if (petType === 'cat') {
    return [
      { value: 'very_low', text: '🤫 Muy poco - Necesito un gato silencioso (apartamento, vecinos)' },
      { value: 'low', text: '🔇 Poco - Maullidos ocasionales están bien' },
      { value: 'moderate', text: '🔊 Moderado - No me molestan los maullidos normales' },
      { value: 'high', text: '📢 Alto - Los maullidos no son problema' },
      { value: 'very_high', text: '🗣️ Muy alto - Me gustan los gatos conversadores' }
    ];
  } else if (petType === 'dog') {
    return [
      { value: 'very_low', text: '🤫 Muy poco - Necesito silencio (apartamento, vecinos)' },
      { value: 'low', text: '🔇 Poco - Ladridos ocasionales están bien' },
      { value: 'moderate', text: '🔊 Moderado - No me molestan los ladridos normales' },
      { value: 'high', text: '📢 Alto - Los ladridos no son problema' },
      { value: 'very_high', text: '🔊 Muy alto - Me gustan los perros vocales/guardianes' }
    ];
  } else {
    return [
      { value: 'very_low', text: '🤫 Muy poco - Necesito mascotas silenciosas' },
      { value: 'low', text: '🔇 Poco - Sonidos ocasionales están bien' },
      { value: 'moderate', text: '🔊 Moderado - Nivel normal de vocalizaciones' },
      { value: 'high', text: '📢 Alto - No me molesta el ruido' },
      { value: 'very_high', text: '🔊 Muy alto - Me gustan las mascotas expresivas' }
    ];
  }
}

// 🆕 FUNCIÓN PARA GENERAR OPCIONES DINÁMICAS DE ALIMENTACIÓN
function getFeedingPreferenceOptions(petType: 'dog' | 'cat' | 'any'): Array<{value: string, text: string}> {
  if (petType === 'cat') {
    return [
      { 
        value: 'standard', 
        text: '🥘 Comida estándar - $25k-40k/mes (1.5kg, buena calidad, económica)' 
      },
      { 
        value: 'premium', 
        text: '⭐ Comida premium - $60k/mes (1.5kg, alta proteína, ingredientes especiales)' 
      },
      { 
        value: 'flexible', 
        text: '🤷‍♀️ Flexible - Según presupuesto y necesidades del gato' 
      }
    ];
  } else if (petType === 'dog') {
    return [
      { 
        value: 'standard', 
        text: '🥘 Comida estándar - $60k-150k/mes según tamaño (buena calidad, económica)' 
      },
      { 
        value: 'premium', 
        text: '⭐ Comida premium - $120k-280k/mes según tamaño (ingredientes especiales)' 
      },
      { 
        value: 'flexible', 
        text: '🤷‍♀️ Flexible - Según presupuesto y necesidades del perro' 
      }
    ];
  } else {
    return [
      { 
        value: 'standard', 
        text: '🥘 Comida estándar - Buena calidad, económica' 
      },
      { 
        value: 'premium', 
        text: '⭐ Comida premium - Alta calidad, ingredientes especiales' 
      },
      { 
        value: 'flexible', 
        text: '🤷‍♀️ Flexible - Según presupuesto y necesidades específicas' 
      }
    ];
  }
}

// 🆕 FUNCIÓN PARA OBTENER TEXTO DINÁMICO DE PREGUNTA
function getDynamicQuestionText(questionId: string, petType: 'dog' | 'cat' | 'any'): string {
  const questionTexts: Record<string, Record<string, string>> = {
    sizePreference: {
      dog: '¿Qué tamaño de perro prefieres?',
      cat: '¿Qué tamaño de gato prefieres?',
      any: '¿Qué tamaño de mascota prefieres?'
    },
    noiseToleranceLevel: {
      dog: '¿Cuánto ruido/ladridos puedes tolerar?',
      cat: '¿Cuánto tolerarías las vocalizaciones de tu gato?',
      any: '¿Cuánto ruido puedes tolerar de tu mascota?'
    },
    feedingPreference: {
      dog: '¿Qué tipo de alimentación prefieres para tu perro?',
      cat: '¿Qué tipo de alimentación prefieres para tu gato?', 
      any: '¿Qué tipo de alimentación prefieres para tu mascota?'
    }
  };
  
  return questionTexts[questionId]?.[petType] || questionTexts[questionId]?.['any'] || '';
}

// 🆕 FUNCIÓN PARA GENERAR PREGUNTAS DINÁMICAS
export function getDynamicQuizQuestions(answers: QuizAnswers): QuizQuestion[] {
  const petType = (answers.petTypePreference as 'dog' | 'cat' | 'any') || 'any';
  
  return [
    // Pregunta 1: Tipo de mascota (siempre igual)
    {
      id: 'petTypePreference',
      text: '¿Qué tipo de mascota prefieres?',
      type: 'single',
      options: [
        { value: 'dog', text: '🐕 Perro - Me gustan los animales activos y leales' },
        { value: 'cat', text: '🐱 Gato - Prefiero animales más independientes' },
        { value: 'any', text: '🤷‍♀️ No tengo preferencia - Estoy abierto a ambos' }
      ]
    },
    
    // Pregunta 2: Tipo de hogar
    {
      id: 'homeType',
      text: '¿Dónde vives actualmente?',
      type: 'single',
      options: [
        { value: 'apartment_small', text: '🏠 Apartamento pequeño (menos de 60m²)' },
        { value: 'apartment_large', text: '🏢 Apartamento grande (más de 60m²)' },
        { value: 'house_small', text: '🏡 Casa con jardín pequeño' },
        { value: 'house_large', text: '🏘️ Casa con jardín grande o patio amplio' }
      ]
    },
    
    // Pregunta 3: Horas fuera de casa
    {
      id: 'hoursAway',
      text: '¿Cuántas horas al día está vacía tu casa generalmente?',
      type: 'single',
      options: [
        { value: 'less_than_2', text: '⏰ Menos de 2 horas - Siempre hay alguien en casa' },
        { value: '2_to_4', text: '🕐 Entre 2 y 4 horas - Horario flexible' },
        { value: '4_to_8', text: '🕘 Entre 4 y 8 horas - Jornada laboral estándar' },
        { value: '8_to_12', text: '🕛 Más de 8 horas - Jornadas largas' }
      ]
    },
    
    // Pregunta 4: Nivel de actividad
    {
      id: 'activityLevel',
      text: '¿Cómo describirías tu nivel de actividad física?',
      type: 'single',
      options: [
        { value: 'sedentary', text: '🛋️ Sedentario - Prefiero actividades tranquilas en casa' },
        { value: 'light', text: '🚶‍♀️ Ligero - Paseos ocasionales, actividad mínima' },
        { value: 'moderate', text: '🏃‍♀️ Moderado - Ejercicio regular, paseos diarios' },
        { value: 'active', text: '🏋️‍♀️ Activo - Ejercicio frecuente, deportes, senderismo' },
        { value: 'very_active', text: '🏃‍♂️ Muy activo - Deportista, actividades al aire libre constantes' }
      ]
    },
    
    // Pregunta 5: Niños en casa
    {
      id: 'hasChildren',
      text: '¿Tienes niños en casa?',
      type: 'single',
      options: [
        { value: 'yes', text: '👶 Sí, tengo niños' },
        { value: 'no', text: '🙅‍♀️ No tengo niños' }
      ]
    },
    
    // Pregunta 6: Edad de los niños (condicional)
    {
      id: 'childrenAge',
      text: '¿De qué edad son tus niños?',
      type: 'single',
      options: [
        { value: 'young_children', text: '👶 Bebés y niños pequeños (0-5 años)' },
        { value: 'older_children', text: '🧒 Niños mayores (6-12 años)' },
        { value: 'teens', text: '👦 Adolescentes (13+ años)' },
        { value: 'no_children', text: '🚫 No tengo niños' }
      ]
    },
    
    // Pregunta 7: Otras mascotas
    {
      id: 'hasOtherPets',
      text: '¿Tienes otras mascotas en casa?',
      type: 'single',
      options: [
        { value: 'yes', text: '🐾 Sí, tengo otras mascotas' },
        { value: 'no', text: '🚫 No tengo otras mascotas' }
      ]
    },
    
    // Pregunta 8: Tipo de otras mascotas
    {
      id: 'otherPets',
      text: '¿Qué tipo de mascotas tienes?',
      type: 'multiple',
      options: [
        { value: 'dogs', text: '🐕 Perros' },
        { value: 'cats', text: '🐱 Gatos' },
        { value: 'small_pets', text: '🐰 Mascotas pequeñas (conejos, hamsters, pájaros)' },
        { value: 'no_pets', text: '🚫 No tengo otras mascotas' }
      ]
    },
    
    // Pregunta 9: Experiencia previa
    {
      id: 'experience',
      text: '¿Cuál es tu experiencia previa con mascotas?',
      type: 'single',
      options: [
        { value: 'first_time', text: '🆕 Primera vez - Nunca he tenido mascotas' },
        { value: 'some_experience', text: '📚 Algo de experiencia - He tenido mascotas antes' },
        { value: 'experienced', text: '🎓 Muy experimentado - He criado/entrenado mascotas' }
      ]
    },
    
    // 🆕 Pregunta 10: Preferencia de tamaño (DINÉMICA)
    {
      id: 'sizePreference',
      text: getDynamicQuestionText('sizePreference', petType),
      type: 'single',
      options: getSizePreferenceOptions(petType)
    },
    
    // Pregunta 11: Largo del pelaje  
    {
      id: 'furLengthPreference',
      text: '¿Tienes preferencia por el tipo de pelaje?',
      type: 'single',
      options: [
        { value: 'short', text: '✂️ Pelo corto - Menos mantenimiento' },
        { value: 'medium', text: '🖌️ Pelo mediano - Equilibrio entre apariencia y cuidado' },
        { value: 'long', text: '💇‍♀️ Pelo largo - Me gusta el aspecto elegante' },
        { value: 'any', text: '🤷‍♀️ No importa - No tengo preferencia' }
      ]
    },
    
    // 🆕 Pregunta 12: Tolerancia al ruido (DINÉMICA - solo si NO es gato exclusivamente)
    ...(petType !== 'cat' ? [{
      id: 'noiseToleranceLevel',
      text: getDynamicQuestionText('noiseToleranceLevel', petType),
      type: 'single' as const,
      options: getNoiseToleranceOptions(petType)
    }] : []),
    
    // Pregunta 13: Disposición para cuidados
    {
      id: 'groomingWillingness',
      text: '¿Cuánto tiempo puedes dedicar al cuidado y aseo?',
      type: 'single',
      options: [
        { value: 'minimal', text: '⏱️ Mínimo - Solo lo básico (baño ocasional)' },
        { value: 'low', text: '🧼 Poco - Cepillado semanal, baños mensuales' },
        { value: 'moderate', text: '✨ Moderado - Cuidados regulares, visitas al peluquero' },
        { value: 'high', text: '💅 Alto - Cepillado diario, muchos cuidados' },
        { value: 'very_high', text: '👑 Muy alto - Disfruto mimando a mi mascota' }
      ]
    },
    
    // Pregunta 14: Disposición para entrenamiento (solo si NO es gato exclusivamente)
    ...(petType !== 'cat' ? [{
      id: 'trainingWillingness',
      text: '¿Cuánto tiempo y dinero puedes dedicar al entrenamiento?',
      type: 'single' as const,
      options: [
        { value: 'minimal', text: '⏱️ Mínimo - Solo comandos básicos en casa' },
        { value: 'low', text: '📚 Poco - Entrenamiento básico de obediencia casero' },
        { value: 'moderate', text: '🎓 Moderado - Clases grupales ocasionales + práctica en casa' },
        { value: 'high', text: '🏆 Alto - Entrenador personal o clases regulares' },
        { value: 'professional', text: '🥇 Profesional - Colegio canino mensual + entrenamiento avanzado' }
      ]
    }] : []),
    
    // Pregunta 15: Alergias
    {
      id: 'allergies',
      text: '¿Alguien en tu familia tiene alergias a mascotas?',
      type: 'single',
      options: [
        { value: 'no', text: '✅ No hay alergias en la familia' },
        { value: 'yes', text: '🤧 Sí, hay alergias (necesito opciones hipoalergénicas)' }
      ]
    },
    
    // Pregunta 16: Nivel de alergias (condicional)
    {
      id: 'allergyLevel',
      text: '¿Qué tan severas son las alergias?',
      type: 'single',
      options: [
        { value: 'yes_mild', text: '😌 Leves - Síntomas manejables' },
        { value: 'yes_severe', text: '😷 Severas - Necesito razas 100% hipoalergénicas' },
        { value: 'no_allergies', text: '✅ No hay alergias' }
      ]
    },
    
    // Pregunta 17: Presupuesto
    {
      id: 'budgetLevel',
      text: '¿Cuál es tu presupuesto mensual para tu mascota? (incluye comida, veterinario, accesorios)',
      type: 'single',
      options: [
        { value: '1', text: '💰 Muy bajo (menos de $200.000 COP/mes) - Solo lo esencial' },
        { value: '2', text: '💵 Bajo ($200.000 - $400.000 COP/mes) - Cuidados básicos' },
        { value: '3', text: '💶 Moderado ($400.000 - $700.000 COP/mes) - Cuidados completos' },
        { value: '4', text: '💷 Alto ($700.000 - $1.200.000 COP/mes) - Sin restricciones mayores' },
        { value: '5', text: '💸 Muy alto (más de $1.200.000 COP/mes) - Premium sin límites' }
      ]
    },
    
    // 🆕 Pregunta 18: Alimentación (DINÉMICA con costos específicos)
    {
      id: 'feedingPreference',
      text: getDynamicQuestionText('feedingPreference', petType),
      type: 'single',
      options: getFeedingPreferenceOptions(petType)
    },
    
    // Pregunta 19: Propósito/objetivo
    {
      id: 'purpose',
      text: '¿Cuál es tu objetivo principal al tener una mascota?',
      type: 'multiple',
      options: [
        { value: 'companion', text: '❤️ Compañía - Quiero un mejor amigo' },
        { value: 'family', text: '👨‍👩‍👧‍👦 Mascota familiar - Para toda la familia' },
        { value: 'guard', text: '🛡️ Protección - Quiero que cuide mi hogar' },
        { value: 'therapy', text: '🏥 Terapia/apoyo emocional - Necesidades especiales' },
        { value: 'sports', text: '🏃‍♀️ Actividades deportivas - Compañero de ejercicio' }
      ]
    }
  ];
}

// 🆕 FUNCIÓN PARA DETERMINAR SI UNA PREGUNTA DEBE MOSTRARSE
export function shouldShowQuestion(questionId: string, answers: QuizAnswers): boolean {
  const petType = answers.petTypePreference as 'dog' | 'cat' | 'any';
  
  // Lógica condicional existente
  if (questionId === 'childrenAge' && answers['hasChildren'] !== 'yes') {
    return false;
  }
  
  if (questionId === 'otherPets' && answers['hasOtherPets'] !== 'yes') {
    return false;
  }
  
  if (questionId === 'allergyLevel' && answers['allergies'] !== 'yes') {
    return false;
  }
  
  // 🆕 NUEVA LÓGICA: Ocultar preguntas específicas para gatos
  if (petType === 'cat') {
    // No mostrar tolerancia al ruido para gatos (son naturalmente más silenciosos)
    if (questionId === 'noiseToleranceLevel') {
      return false;
    }
    
    // No mostrar entrenamiento para gatos (son más independientes)
    if (questionId === 'trainingWillingness') {
      return false;
    }
  }
  
  return true;
}

// 🆕 ACTUALIZAR collectUserResponses para manejar valores por defecto
export function collectUserResponses(answers: QuizAnswers): UserProfile {
  console.log('🔄 Procesando respuestas del cuestionario:', answers);
  
  const petType = answers.petTypePreference as 'dog' | 'cat' | 'any';
  
  const profile: UserProfile = {
    homeType: mapHomeType(answers['homeType'] as string),
    hoursAway: mapHoursAway(answers['hoursAway'] as string),
    activityLevel: mapActivityLevel(answers['activityLevel'] as string),
    hasChildren: answers['hasChildren'] === 'yes',
    childrenAge: mapChildrenAge(answers['childrenAge'] as string),
    hasOtherPets: answers['hasOtherPets'] === 'yes',
    otherPets: mapPetType(answers['otherPets'] as string),
    experience: mapExperience(answers['experience'] as string),
    petTypePreference: petType,
    sizePreference: answers['sizePreference'] as 'small' | 'medium' | 'large' | 'any',
    furLengthPreference: answers['furLengthPreference'] as 'short' | 'medium' | 'long' | 'any',
    
    // 🆕 VALORES CONDICIONALES PARA GATOS
    noiseToleranceLevel: petType === 'cat' 
      ? 2 as Level  // Los gatos son naturalmente más silenciosos
      : mapNoiseToleranceLevel(answers['noiseToleranceLevel'] as string),
    
    groomingWillingness: mapGroomingWillingness(answers['groomingWillingness'] as string),
    
    trainingWillingness: petType === 'cat'
      ? 2 as Level  // Los gatos requieren menos entrenamiento
      : mapTrainingWillingness(answers['trainingWillingness'] as string),
    
    allergies: answers['allergies'] === 'yes',
    allergyLevel: mapAllergyLevel(answers['allergyLevel'] as string),
    budgetLevel: mapBudgetLevel(answers['budgetLevel'] as string),
    
    // 🆕 NORMALIZAR feedingPreference
feedingPreference: answers['feedingPreference'] as 'standard' | 'premium' | 'flexible' || 'standard',
    budgetAmount: mapBudgetAmount(answers['budgetLevel'] as string),
    purpose: mapPurpose(answers['purpose'] as string[]),
  };
  
  console.log('✅ Perfil de usuario generado:', profile);
  return profile;
}

// Las funciones de mapeo permanecen iguales...
function mapHomeType(answer: string): HomeType {
  const homeTypeMap: {[key: string]: HomeType} = {
    'apartment_small': 'apartment_small',
    'apartment_large': 'apartment_large',
    'house_small': 'house_small_yard',
    'house_large': 'house_large_yard',
  };
  return homeTypeMap[answer] || 'apartment_large';
}

function mapHoursAway(answer: string): number {
  const hoursMap: {[key: string]: number} = {
    'less_than_2': 1,
    '2_to_4': 3,
    '4_to_8': 6,
    '8_to_12': 10,
    'more_than_12': 12
  };
  return hoursMap[answer] || 6;
}

function mapActivityLevel(answer: string): Level {
  const activityMap: {[key: string]: Level} = {
    'sedentary': 1,
    'light': 2,
    'moderate': 3,
    'active': 4,
    'very_active': 5
  };
  return activityMap[answer] || 3;
}

function mapChildrenAge(answer: string): ChildrenAge {
  return answer as ChildrenAge || 'no_children';
}

function mapPetType(answer: string | string[]): PetType | PetType[] {
  if (Array.isArray(answer)) {
    const validPets = answer.filter(pet => 
      ['dogs', 'cats', 'small_pets', 'no_pets'].includes(pet)
    );
    
    if (validPets.includes('no_pets') && validPets.length > 1) {
      return validPets.filter(pet => pet !== 'no_pets') as PetType[];
    }
    
    if (validPets.length === 0 || (validPets.length === 1 && validPets[0] === 'no_pets')) {
      return 'no_pets';
    }
    
    return validPets as PetType[];
  }
  
  return answer as PetType || 'no_pets';
}

function mapExperience(answer: string): ExperienceLevel {
  return answer as ExperienceLevel || 'some_experience';
}

function mapNoiseToleranceLevel(answer: string): Level {
  const noiseMap: {[key: string]: Level} = {
    'very_low': 1,
    'low': 2,
    'moderate': 3,
    'high': 4,
    'very_high': 5
  };
  return noiseMap[answer] || 3;
}

function mapGroomingWillingness(answer: string): Level {
  const groomingMap: {[key: string]: Level} = {
    'minimal': 1,
    'low': 2,
    'moderate': 3,
    'high': 4,
    'very_high': 5
  };
  return groomingMap[answer] || 3;
}

function mapTrainingWillingness(answer: string): Level {
  const trainingMap: {[key: string]: Level} = {
    'minimal': 1,
    'low': 2,
    'moderate': 3,
    'high': 4,
    'professional': 5
  };
  return trainingMap[answer] || 3;
}

function mapAllergyLevel(answer: string): 'no_allergies' | 'yes_mild' | 'yes_severe' {
  return answer as 'no_allergies' | 'yes_mild' | 'yes_severe' || 'no_allergies';
}

function mapBudgetLevel(answer: string): Level {
  const budgetMap: {[key: string]: Level} = {
    '1': 1,
    '2': 2,  
    '3': 3,
    '4': 4,
    '5': 5
  };
  return budgetMap[answer] || 3;
}

function mapPurpose(answers: string[]): Array<'companion' | 'guard' | 'therapy' | 'family' | 'sports'> {
  if (!answers || !Array.isArray(answers)) return ['companion'];
  return answers as Array<'companion' | 'guard' | 'therapy' | 'family' | 'sports'>;
}

function mapBudgetAmount(budgetLevel: string): number {
  const budgetMap: {[key: string]: number} = {
    '1': 200000,
    '2': 400000,
    '3': 700000,
    '4': 1200000,
    '5': 2000000
  };
  return budgetMap[budgetLevel] || 700000;
}

// Funciones auxiliares permanecen iguales...
export function validateAnswers(answers: QuizAnswers): { isValid: boolean; missingQuestions: string[] } {
  const requiredQuestions = [
    'petTypePreference',
    'homeType', 
    'hoursAway',
    'activityLevel',
    'hasChildren',
    'hasOtherPets',
    'experience',
    'sizePreference',
    'allergies',
    'budgetLevel',
    'feedingPreference'
  ];
  
  // 🆕 Filtrar preguntas requeridas según el tipo de mascota
  const petType = answers.petTypePreference as 'dog' | 'cat' | 'any';
  const filteredRequired = requiredQuestions.filter(questionId => 
    shouldShowQuestion(questionId, answers)
  );
  
  // Agregar preguntas condicionales si aplican
  if (petType !== 'cat') {
    filteredRequired.push('noiseToleranceLevel', 'trainingWillingness');
  }
  
  const missingQuestions = filteredRequired.filter(questionId => !answers[questionId]);
  
  return {
    isValid: missingQuestions.length === 0,
    missingQuestions
  };
}

export function getProgressPercentage(answers: QuizAnswers, totalQuestions: number): number {
  const answeredCount = Object.keys(answers).length;
  return Math.round((answeredCount / totalQuestions) * 100);
}

export function getNextQuestionId(answers: QuizAnswers, questions: QuizQuestion[]): string | null {
  for (const question of questions) {
    // Verificar si la pregunta debe mostrarse
    if (!shouldShowQuestion(question.id, answers)) {
      continue;
    }
    
    // Lógica condicional para preguntas
    if (question.id === 'childrenAge' && answers['hasChildren'] !== 'yes') {
      continue;
    }
    
    if (question.id === 'otherPets' && answers['hasOtherPets'] !== 'yes') {
      continue;
    }
    
    if (question.id === 'allergyLevel' && answers['allergies'] !== 'yes') {
      continue;
    }
    
    if (!answers[question.id]) {
      return question.id;
    }
  }
  
  return null;
}

export function getAnswersSummary(answers: QuizAnswers): Record<string, string> {
  const summary: Record<string, string> = {};
  const dynamicQuestions = getDynamicQuizQuestions(answers);
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = dynamicQuestions.find(q => q.id === questionId);
    if (question) {
      if (Array.isArray(answer)) {
        const selectedOptions = question.options
          .filter(option => answer.includes(option.value))
          .map(option => option.text);
        summary[question.text] = selectedOptions.join(', ');
      } else {
        const selectedOption = question.options.find(option => option.value === answer);
        summary[question.text] = selectedOption?.text || answer.toString();
      }
    }
  });
  
  return summary;
}

export function cleanupConditionalAnswers(answers: QuizAnswers, changedQuestionId: string): QuizAnswers {
  const newAnswers = { ...answers };
  
  if (changedQuestionId === 'hasChildren' && answers['hasChildren'] !== 'yes') {
    delete newAnswers['childrenAge'];
  }
  
  if (changedQuestionId === 'hasOtherPets' && answers['hasOtherPets'] !== 'yes') {
    delete newAnswers['otherPets'];
  }
  
  if (changedQuestionId === 'allergies' && answers['allergies'] !== 'yes') {
    delete newAnswers['allergyLevel'];
  }
  
  // 🆕 NUEVA LÓGICA: Si cambia el tipo de mascota, limpiar respuestas específicas
  if (changedQuestionId === 'petTypePreference') {
    const newPetType = answers['petTypePreference'];
    
    // Si cambia a gato, eliminar respuestas de ruido y entrenamiento
    if (newPetType === 'cat') {
      delete newAnswers['noiseToleranceLevel'];
      delete newAnswers['trainingWillingness'];
    }
    
    // Limpiar respuesta de tamaño para que se actualicen las opciones
    delete newAnswers['sizePreference'];
    
    // Limpiar respuesta de alimentación para que se actualicen los costos
    delete newAnswers['feedingPreference'];
    
    console.log('🔄 Tipo de mascota cambiado, limpiando respuestas relacionadas');
  }
  
  return newAnswers;
}

// 🆕 FUNCIÓN PARA OBTENER PREGUNTAS RELEVANTES (REEMPLAZA LA LÓGICA EN BreedMatchQuiz)
export function getRelevantQuestions(answers: QuizAnswers): QuizQuestion[] {
  const dynamicQuestions = getDynamicQuizQuestions(answers);
  
  return dynamicQuestions.filter(question => shouldShowQuestion(question.id, answers));
}

// 🆕 FUNCIÓN PARA OBTENER CONTEXTO DE ALIMENTACIÓN SEGÚN TIPO DE MASCOTA
export function getFeedingContextByPetType(petType: 'dog' | 'cat' | 'any'): {
  standardRange: string;
  premiumRange: string;
  context: string;
} {
  if (petType === 'cat') {
    return {
      standardRange: '$25k-40k/mes',
      premiumRange: '$60k/mes',
      context: 'Los gatos requieren 1.5kg de comida mensual aproximadamente. La comida premium tiene mejor balance de proteínas y es ideal para su salud renal.'
    };
  } else if (petType === 'dog') {
    return {
      standardRange: '$60k-150k/mes',
      premiumRange: '$120k-280k/mes', 
      context: 'Los costos varían según el tamaño: pequeños consumen menos, grandes necesitan paquetes de 15-20kg que duran 1-2 meses.'
    };
  } else {
    return {
      standardRange: '$25k-150k/mes',
      premiumRange: '$60k-280k/mes',
      context: 'Los costos varían significativamente entre perros y gatos. Te daremos recomendaciones específicas según tu elección final.'
    };
  }
}

// 🆕 FUNCIÓN PARA GENERAR RESUMEN DE COSTOS ESTIMADOS (ACTUALIZADA)
export function generateCostPreview(answers: QuizAnswers): {
  estimatedMonthlyRange: string;
  feedingCost: string;
  breakdown: string[];
  warnings: string[];
} {
  const petType = answers['petTypePreference'] as 'dog' | 'cat' | 'any';
  const budgetLevel = parseInt(answers['budgetLevel'] as string) || 3;
  const feedingPref = answers['feedingPreference'] as 'standard' | 'premium' | 'flexible';
  
  let estimatedMin = 150000;
  let estimatedMax = 400000;
  let feedingCost = '';
  const breakdown: string[] = [];
  const warnings: string[] = [];
  
  if (petType === 'cat') {
    estimatedMin = 130000;
    estimatedMax = 250000;
    feedingCost = feedingPref === 'premium' ? '$60k/mes' : '$25k-40k/mes';
    breakdown.push('🍖 Comida: ' + feedingCost);
    breakdown.push('🏥 Veterinario: $70k/mes');
    breakdown.push('🧸 Accesorios/Arena: $40k/mes');
    breakdown.push('💅 Grooming: $30k/mes (menos que perros)');
  } else if (petType === 'dog') {
    const sizePreference = answers['sizePreference'] as string;
    
    if (sizePreference === 'small') {
      estimatedMin = 200000;
      estimatedMax = 350000;
      feedingCost = feedingPref === 'premium' ? '$120k/mes' : '$60k-80k/mes';
    } else if (sizePreference === 'large') {
      estimatedMin = 350000;
      estimatedMax = 600000;
      feedingCost = feedingPref === 'premium' ? '$280k/mes' : '$150k/mes';
    } else {
      estimatedMin = 280000;
      estimatedMax = 480000;
      feedingCost = feedingPref === 'premium' ? '$200k/mes' : '$100k/mes';
    }
    
    breakdown.push('🍖 Comida: ' + feedingCost);
    breakdown.push('🏥 Veterinario: $80k-120k/mes');
    breakdown.push('🧸 Accesorios: $50k-80k/mes'); 
    breakdown.push('💅 Grooming: $60k-100k/mes');
    breakdown.push('🎓 Entrenamiento: $0-50k/mes (opcional)');
  }
  
  // Verificar compatibilidad con presupuesto
  const budgetMap = [0, 200000, 400000, 700000, 1200000, 2000000];
  const userBudget = budgetMap[budgetLevel] || 700000;
  
  if (estimatedMax > userBudget) {
    warnings.push(`⚠️ El costo estimado (${new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(estimatedMax)}) puede superar tu presupuesto`);
  }
  
  if (feedingPref === 'premium' && budgetLevel <= 2) {
    warnings.push('💡 Considera comida estándar para ajustarte mejor a tu presupuesto');
  }
  
  // 🆕 Advertencias específicas por tipo
  if (petType === 'cat' && budgetLevel >= 4) {
    warnings.push('✅ Tu presupuesto es excelente para un gato - considera comida premium para mejor salud');
  }
  
  if (petType === 'dog' && answers['sizePreference'] === 'large' && budgetLevel <= 2) {
    warnings.push('⚠️ Los perros grandes requieren mayor inversión - considera tamaño mediano');
  }
  
  const estimatedMonthlyRange = `${new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(estimatedMin)} - ${new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(estimatedMax)}`;
  
  return {
    estimatedMonthlyRange,
    feedingCost,
    breakdown,
    warnings
  };
}