// src/utils/quizHelpers.ts - Versión completa con todas las preguntas
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

// Mapear respuestas del cuestionario al perfil de usuario
export function collectUserResponses(answers: QuizAnswers): UserProfile {
  console.log('🔄 Procesando respuestas del cuestionario:', answers);
  
  // Construir el perfil del usuario
  const profile: UserProfile = {
    // Factores de estilo de vida
    homeType: mapHomeType(answers['homeType'] as string),
    hoursAway: mapHoursAway(answers['hoursAway'] as string),
    activityLevel: mapActivityLevel(answers['activityLevel'] as string),
    hasChildren: answers['hasChildren'] === 'yes',
    childrenAge: mapChildrenAge(answers['childrenAge'] as string),
    hasOtherPets: answers['hasOtherPets'] === 'yes',
    otherPets: mapPetType(answers['otherPets'] as string),
    experience: mapExperience(answers['experience'] as string),
    
    // Preferencias
    petTypePreference: answers['petTypePreference'] as 'dog' | 'cat' | 'any',
    sizePreference: answers['sizePreference'] as 'small' | 'medium' | 'large' | 'any',
    furLengthPreference: answers['furLengthPreference'] as 'short' | 'medium' | 'long' | 'any',
    noiseToleranceLevel: mapNoiseToleranceLevel(answers['noiseToleranceLevel'] as string),
    groomingWillingness: mapGroomingWillingness(answers['groomingWillingness'] as string),
    trainingWillingness: mapTrainingWillingness(answers['trainingWillingness'] as string),
    
    // Restricciones
    allergies: answers['allergies'] === 'yes',
    allergyLevel: mapAllergyLevel(answers['allergyLevel'] as string),
    budgetLevel: mapBudgetLevel(answers['budgetLevel'] as string),
    
    // 🆕 NUEVOS CAMPOS COP
    feedingPreference: answers['feedingPreference'] as 'normal' | 'premium' | 'flexible' || 'normal',
    budgetAmount: mapBudgetAmount(answers['budgetLevel'] as string),
    
    // Objetivos
    purpose: mapPurpose(answers['purpose'] as string[]),
  };
  
  console.log('✅ Perfil de usuario generado:', profile);
  return profile;
}



// Funciones de mapeo para convertir respuestas a valores específicos
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
    // Filtrar respuestas válidas
    const validPets = answer.filter(pet => 
      ['dogs', 'cats', 'small_pets', 'no_pets'].includes(pet)
    );
    
    // Si seleccionó "no_pets" con otras opciones, ignorar no_pets
    if (validPets.includes('no_pets') && validPets.length > 1) {
      return validPets.filter(pet => pet !== 'no_pets') as PetType[];
    }
    
    // Si solo seleccionó no_pets o array vacío
    if (validPets.length === 0 || (validPets.length === 1 && validPets[0] === 'no_pets')) {
      return 'no_pets';
    }
    
    // Retornar array de tipos de mascotas
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
    'professional': 5  // 🆕 FALTA AGREGAR - Colegio canino
  };
  return trainingMap[answer] || 3;
}


function mapAllergyLevel(answer: string): 'no_allergies' | 'yes_mild' | 'yes_severe' {
  return answer as 'no_allergies' | 'yes_mild' | 'yes_severe' || 'no_allergies';
}

function mapBudgetLevel(answer: string): Level {
  const budgetMap: {[key: string]: Level} = {
    '1': 1,  // Muy bajo
    '2': 2,  // Bajo  
    '3': 3,  // Moderado
    '4': 4,  // Alto
    '5': 5   // Muy alto
  };
  return budgetMap[answer] || 3;
}

function mapPurpose(answers: string[]): Array<'companion' | 'guard' | 'therapy' | 'family' | 'sports'> {
  if (!answers || !Array.isArray(answers)) return ['companion'];
  return answers as Array<'companion' | 'guard' | 'therapy' | 'family' | 'sports'>;
}

function mapBudgetAmount(budgetLevel: string): number {
  const budgetMap: {[key: string]: number} = {
    '1': 200000,   // Muy bajo
    '2': 400000,   // Bajo 
    '3': 700000,   // Moderado
    '4': 1200000,  // Alto
    '5': 2000000   // Muy alto
  };
  return budgetMap[budgetLevel] || 700000;
}

// Preguntas completas del cuestionario
export const defaultQuizQuestions: QuizQuestion[] = [
  // Pregunta 1: Tipo de mascota
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
  
  // Pregunta 10: Preferencia de tamaño
  {
    id: 'sizePreference',
    text: '¿Qué tamaño de mascota prefieres?',
    type: 'single',
    options: [
      { value: 'small', text: '🐕‍🦺 Pequeño - Fácil de manejar y transportar' },
      { value: 'medium', text: '🐕 Mediano - Equilibrio entre tamaño y facilidad' },
      { value: 'large', text: '🐕‍🦮 Grande - Me gustan las mascotas imponentes' },
      { value: 'any', text: '🤷‍♀️ No importa - El tamaño no es un factor decisivo' }
    ]
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
  
  // Pregunta 12: Tolerancia al ruido
  {
    id: 'noiseToleranceLevel',
    text: '¿Cuánto ruido/ladridos puedes tolerar?',
    type: 'single',
    options: [
      { value: 'very_low', text: '🤫 Muy poco - Necesito silencio (apartamento, vecinos)' },
      { value: 'low', text: '🔇 Poco - Ruidos ocasionales están bien' },
      { value: 'moderate', text: '🔊 Moderado - No me molestan los ladridos normales' },
      { value: 'high', text: '📢 Alto - Los ruidos no son problema' },
      { value: 'very_high', text: '🔊 Muy alto - Me gustan las mascotas vocales' }
    ]
  },
  
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
  
  // Pregunta 14: Disposición para entrenamiento
  {
   id: 'trainingWillingness',
    text: '¿Cuánto tiempo y dinero puedes dedicar al entrenamiento?',
    type: 'single',
    options: [
      { value: 'minimal', text: '⏱️ Mínimo - Solo comandos básicos en casa' },
      { value: 'low', text: '📚 Poco - Entrenamiento básico de obediencia casero' },
      { value: 'moderate', text: '🎓 Moderado - Clases grupales ocasionales + práctica en casa' },
      { value: 'high', text: '🏆 Alto - Entrenador personal o clases regulares' },
      { value: 'professional', text: '🥇 Profesional - Colegio canino mensual + entrenamiento avanzado' }
    ]
  },

  
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
    text: '¿Cuál es tu presupuesto mensual para tu mascota?',
    type: 'single',
    options: [
      { value: '1', text: '💰 Muy bajo (menos de $200.000 COP/mes)' },
      { value: '2', text: '💵 Bajo ($200.000 - $400.000 COP/mes)' },
      { value: '3', text: '💶 Moderado ($400.000 - $700.000 COP/mes)' },
      { value: '4', text: '💷 Alto ($700.000 - $1.200.000 COP/mes)' },
      { value: '5', text: '💸 Muy alto (más de $1.200.000 COP/mes)' }
    ]
  },
  {
    id: 'feedingPreference',
    text: '¿Qué tipo de alimentación prefieres para tu mascota?',
    type: 'single',
    options: [
      { value: 'normal', text: '🥘 Comida normal (desde $100.000/mes) - Buena calidad, económica' },
      { value: 'premium', text: '⭐ Comida premium (desde $200.000/mes) - Alta calidad, ingredientes especiales' },
      { value: 'flexible', text: '🤷‍♀️ Flexible - Depende del presupuesto disponible' }
    ]
  },
  
  // Pregunta 18: Propósito/objetivo
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

// Funciones auxiliares para validación y procesamiento
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
    'budgetLevel'
  ];
  
  const missingQuestions = requiredQuestions.filter(questionId => !answers[questionId]);
  
  return {
    isValid: missingQuestions.length === 0,
    missingQuestions
  };
}

export function getProgressPercentage(answers: QuizAnswers, totalQuestions: number): number {
  const answeredCount = Object.keys(answers).length;
  return Math.round((answeredCount / totalQuestions) * 100);
}

// Función para obtener la siguiente pregunta basada en respuestas previas
export function getNextQuestionId(answers: QuizAnswers, questions: QuizQuestion[]): string | null {
  for (const question of questions) {
    // Lógica condicional para preguntas
    if (question.id === 'childrenAge' && answers['hasChildren'] !== 'yes') {
      continue; // Saltar pregunta sobre edad de niños si no tiene niños
    }
    
    if (question.id === 'otherPets' && answers['hasOtherPets'] !== 'yes') {
      continue; // Saltar pregunta sobre tipo de mascotas si no tiene otras
    }
    
    if (question.id === 'allergyLevel' && answers['allergies'] !== 'yes') {
      continue; // Saltar pregunta sobre severidad si no hay alergias
    }
    
    // Si no está respondida, es la siguiente
    if (!answers[question.id]) {
      return question.id;
    }
  }
  
  return null; // Todas las preguntas relevantes están respondidas
}

// Función para obtener el resumen de respuestas en formato legible
export function getAnswersSummary(answers: QuizAnswers): Record<string, string> {
  const summary: Record<string, string> = {};
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = defaultQuizQuestions.find(q => q.id === questionId);
    if (question) {
      if (Array.isArray(answer)) {
        // Para respuestas múltiples
        const selectedOptions = question.options
          .filter(option => answer.includes(option.value))
          .map(option => option.text);
        summary[question.text] = selectedOptions.join(', ');
      } else {
        // Para respuesta única
        const selectedOption = question.options.find(option => option.value === answer);
        summary[question.text] = selectedOption?.text || answer.toString();
      }
    }
  });
  
  return summary;
}

// Función para resetear respuestas condicionales cuando cambia una respuesta padre
export function cleanupConditionalAnswers(answers: QuizAnswers, changedQuestionId: string): QuizAnswers {
  const newAnswers = { ...answers };
  
  // Si cambia la respuesta sobre niños, limpiar la edad de niños
  if (changedQuestionId === 'hasChildren' && answers['hasChildren'] !== 'yes') {
    delete newAnswers['childrenAge'];
  }
  
  // Si cambia la respuesta sobre otras mascotas, limpiar el tipo
  if (changedQuestionId === 'hasOtherPets' && answers['hasOtherPets'] !== 'yes') {
    delete newAnswers['otherPets'];
  }
  
  // Si cambia la respuesta sobre alergias, limpiar el nivel
  if (changedQuestionId === 'allergies' && answers['allergies'] !== 'yes') {
    delete newAnswers['allergyLevel'];
  }
  
  return newAnswers;
}