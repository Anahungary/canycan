// 🇨🇴 SISTEMA DE RAZAS DISPONIBLES EN COLOMBIA
// src/utils/colombianBreeds.ts

// 📋 RAZAS DISPONIBLES EN COLOMBIA
export const COLOMBIAN_BREED_IDS = new Set([
  // 🐕 PERROS DISPONIBLES EN COLOMBIA
  'airedale-terrier',
  'akita-americano', 
  'american-bully',
  'basset-hound',
  'beagle',
  'bernes-montana',
  'bichon-frise',
  'bichon-maltes',
  'border-collie',
  'boston-terrier',
  'boxer',
  'bull-terrier-ingles',
  'bullmastiff',
  'bulldog-frances',
  'bulldog-ingles',
  'cane-corso',
  'cavalier-king-charles',
  'chihuahua',
  'chow-chow',
  'cocker-spaniel-ingles',
  'collie-pastor-escoces',
  'corgi-gales-pembroke',
  'dalmata',
  'dachshund-teckel',
  'doberman',
  'dogo-argentino',
  'fila-brasileno',
  'golden-retriever',
  'gran-danes',
  'husky-siberiano',
  'jack-russell-terrier',
  'labrador-retriever',
  'lhasa-apso',
  'malamute-alaska',
  'mastin-napolitano',
  'pastor-aleman',
  'pastor-australiano',
  'pastor-belga-malinois',
  'pastor-ganadero-australiano',
  'pastor-shetland',
  'pinscher-miniatura',
  'pitbull-american',
  'pomerania-spitz',
  'pomsky',
  'poodle-toy-mini',
  'pug-carlino',
  'rottweiler',
  'samoyedo',
  'san-bernardo',
  'shar-pei',
  'shiba-inu',
  'shih-tzu',
  'schnauzer-miniatura',
  'terranova',
  'west-highland-terrier',
  'yorkshire-terrier',
  
  // 🐱 GATOS DISPONIBLES EN COLOMBIA
  'abisinio',
  'angora-turco',
  'azul-ruso',
  'bengali',
  'bosque-noruega',
  'britanico-pelo-corto',
  'cornish-rex',
  'devon-rex',
  'exotico-pelo-corto',
  'himalayo-persa',
  'maine-coon',
  'munchkin',
  'persa',
  'ragdoll',
  'ragamuffin',
  'savannah',
  'scottish-fold',
  'siames',
  'siberiano',
  'somali',
  'sphynx-esfinge'
]);

// 🏆 FUNCIÓN PARA VERIFICAR SI UNA RAZA ESTÁ DISPONIBLE EN COLOMBIA
export function isAvailableInColombia(breedId: string): boolean {
  return COLOMBIAN_BREED_IDS.has(breedId);
}

// 🔍 FUNCIÓN PARA FILTRAR SOLO RAZAS COLOMBIANAS
export function filterColombianBreeds<T extends { id: string }>(breeds: T[]): T[] {
  return breeds.filter(breed => isAvailableInColombia(breed.id));
}

// 📊 ESTADÍSTICAS DE DISPONIBILIDAD
export function getAvailabilityStats(allBreeds: { id: string; type: 'dog' | 'cat' }[]): {
  total: number;
  available: number;
  dogs: { total: number; available: number };
  cats: { total: number; available: number };
  availabilityPercentage: number;
} {
  const available = allBreeds.filter(breed => isAvailableInColombia(breed.id));
  const dogs = allBreeds.filter(breed => breed.type === 'dog');
  const cats = allBreeds.filter(breed => breed.type === 'cat');
  const availableDogs = available.filter(breed => breed.type === 'dog');
  const availableCats = available.filter(breed => breed.type === 'cat');
  
  return {
    total: allBreeds.length,
    available: available.length,
    dogs: {
      total: dogs.length,
      available: availableDogs.length
    },
    cats: {
      total: cats.length,
      available: availableCats.length
    },
    availabilityPercentage: Math.round((available.length / allBreeds.length) * 100)
  };
}