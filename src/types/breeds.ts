// src/types/breeds.ts

// Tipos básicos para clasificación de razas
export type BreedType = 'dog' | 'cat';
export type SizeType = 'small' | 'medium' | 'large';
export type GoodWithType = 'children' | 'dogs' | 'cats' | 'seniors' | 'apartments';
export type ExperienceLevel = 'first_time' | 'some_experience' | 'experienced';
export type HomeType = 'apartment_small' | 'apartment_large' | 'house_small_yard' | 'house_large_yard';
export type ChildrenAge = 'no_children' | 'young_children' | 'older_children' | 'teens';
export type PetType = 'no_pets' | 'dogs' | 'cats' | 'small_pets';
export type AllergyLevel = 'no_allergies' | 'yes_mild' | 'yes_severe';
export type PurposeType = 'companion' | 'guard' | 'therapy' | 'family' | 'sports';
export type CompatibilityCategory = 'excelente' | 'muy buena' | 'buena' | 'moderada' | 'baja';

// Tipos para definir niveles de 1 a 5
export type Level = 1 | 2 | 3 | 4 | 5;

// Para rasgos de personalidad y características de la raza
export interface Trait {
  name: string;
  value: Level;
  description: string;
}

// Problema de salud común en la raza
export interface HealthIssue {
  name: string;
  description: string;
}

// Raza base (datos mínimos)
export interface BaseBreed {
  id: string;
  name: string;
  image: string;
  size: SizeType;
  energyLevel: Level;
  friendliness: Level;
  grooming: Level;
  training: Level;
  type: BreedType;
  goodWith: GoodWithType[];
  hypoallergenic: boolean;
  featured?: boolean;
}

// Raza completa con todos los detalles
export interface BreedDetailProps extends BaseBreed {
  images: string[];
  description: string;
  weight: { min: number; max: number };
  height?: { min: number; max: number };
  lifespan: { min: number; max: number };
  traits: Trait[];
  history: string;
  origins?: string;
  temperament: string[];
  healthIssues: HealthIssue[];
  similarBreeds: BaseBreed[];
  careGuide: string;
}

// Características de una raza para el algoritmo de recomendación
export interface BreedCharacteristics extends BaseBreed {
  furLength: 'short' | 'medium' | 'long';
  noiseLevel: Level;
  healthIssues: Level; // Nivel general de problemas de salud
  costLevel: Level; // Costo de mantenimiento
  independenceLevel: Level; // Qué tan independiente es
  suitableFor: PurposeType[];
}
// En el mismo archivo src/types/breeds.ts, después de definir BreedCharacteristics

// Características mejoradas de razas con datos más detallados
export interface EnhancedBreedCharacteristics extends BreedCharacteristics {
  // Tiempo y actividad
  minimumExercise: number; // Minutos mínimos diarios recomendados
  exerciseIntensity: Level; // Intensidad necesaria del ejercicio
  separationAnxietyProne: Level; // Tendencia a ansiedad por separación
  
  // Comportamiento
  guardInstinct: Level; // Instinto guardián
  preyDrive: Level; // Instinto de persecución (para gatos o mascotas pequeñas)
  territoriality: Level; // Defensa del territorio
  barkingFrequency: Level; // Frecuencia de ladridos
  
  // Salud y mantenimiento
  shedLevel: Level; // Nivel de caída de pelo
  drooling: Level; // Babeo
  specificCareNeeds: string[]; // Necesidades especiales (pliegues, oídos, etc)
  commonHealthIssues: string[]; // Problemas comunes para prever gastos
  foodConsumption: Level; // Cantidad de comida (relacionado con tamaño)
  
  // Adaptabilidad
  heatTolerance: Level; // Tolerancia al calor
  coldTolerance: Level; // Tolerancia al frío
  adaptableToRoutineChanges: Level; // Adaptación a cambios
}
// Perfil del usuario basado en sus respuestas al cuestionario
// src/types/breeds.ts

// [Otras definiciones de tipos e interfaces...]

// Perfil básico del usuario (mantén el original para compatibilidad)
export interface UserProfile {
  // Factores de estilo de vida
  homeType: HomeType;
  hoursAway: number;  // Horas fuera de casa por día (1-12)
  activityLevel: Level;  // Nivel de actividad física del dueño
  hasChildren: boolean;  // Si tiene niños pequeños
  childrenAge: ChildrenAge;  // Edad de los niños
  hasOtherPets: boolean;  // Si tiene otras mascotas
  otherPets: PetType | PetType[]; // 🆕 Puede ser array
  experience: ExperienceLevel;  // Experiencia previa
  
  // Preferencias
  petTypePreference: BreedType | 'any';  // Preferencia perro/gato
  sizePreference: SizeType | 'any';  // Tamaño preferido
  furLengthPreference: 'short' | 'medium' | 'long' | 'any';  // Largo de pelo
  noiseToleranceLevel: Level;  // Tolerancia al ruido (ladridos, etc)
  groomingWillingness: Level;  // Disposición para cuidados de aseo
  trainingWillingness: Level; // 🆕 Incluye opción "professional"
  
  // Restricciones
  allergies: boolean;  // Si hay alergias en la familia
  allergyLevel: AllergyLevel;  // Nivel de alergia
  budgetLevel: Level;  // Presupuesto para mantenimiento

  // 🆕 NUEVOS CAMPOS COP
  feedingPreference?: 'normal' | 'premium' | 'flexible';  // Preferencia alimentación
  budgetAmount?: number;  // Monto específico si es necesario
  
  // Objetivos o propósitos
  purpose: PurposeType[];  // Propósito principal
}

// Perfil mejorado del usuario con factores adicionales para recomendaciones más precisas
export interface EnhancedUserProfile extends UserProfile {
  // Tiempo disponible
  walkingTime: 'minimal' | 'moderate' | 'active' | 'very_active';
  hometime: number; // Horas que pasa en casa al día
  
  // Actividad y ejercicio
  activityTypes: string[]; // walks, running, hiking, agility, companion
  workoutFrequency: number; // Días por semana de ejercicio intenso
  
  // Familia detallada
  childrenAges: string[]; // babies, preschool, school_age, teenagers
  elderlyAtHome: boolean;
  
  // Presupuesto
  foodBudget: 'economic' | 'medium' | 'premium' | 'no_limit';
  healthcareBudget: 'basic' | 'moderate' | 'significant' | 'unlimited';
  monthlyBudgetCOP: number; // Presupuesto específico en COP
  
  // Preferencias conductuales
  noisePreference: 'silent' | 'moderate_alert' | 'vocal_ok';
  guardianNeeds: 'not_important' | 'moderate' | 'important';
  socialVisits: 'rare' | 'occasional' | 'frequent';
  
  // Preferencias de cuidado
  groomingEffort: 'minimal' | 'moderate' | 'significant' | 'professional';
  shedTolerance: Level; // Tolerancia a la caída de pelo
}

// Estructura de una pregunta del cuestionario
export interface QuizQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'scale';
  options: Array<{
    value: string;
    text: string;
  }>;
  impactFactors?: Array<{
    factor: keyof UserProfile;
    value: any;
  }>;
}

// Respuestas del usuario al cuestionario
export interface QuizAnswers {
  [questionId: string]: string | string[];
}

// Resultado de compatibilidad entre perfil y raza
export interface BreedCompatibilityResult {
  breed: BreedCharacteristics;
  compatibilityScore: number;
  compatibilityCategory: CompatibilityCategory;
  strengths: string[];
  challenges: string[];
  userProfile: UserProfile;
}

// Resultados finales del cuestionario
export interface QuizResults {
  topMatch: BreedCompatibilityResult;
  allRecommendations: BreedCompatibilityResult[];
}

// 🆕 Resultados mejorados del cuestionario
export interface EnhancedQuizResults {
  topMatch: BreedCompatibilityResult;
  alternativeMatches: BreedCompatibilityResult[]; // 🆕 2 alternativas
  allRecommendations: BreedCompatibilityResult[];
  comparisonSuggestions: BreedCompatibilityResult[]; // 🆕 Para comparador
}