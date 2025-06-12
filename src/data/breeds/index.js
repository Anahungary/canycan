// src/data/breeds/index.js - Versión corregida con manejo de errores

// Importar razas de perros por secciones alfabéticas
import { dogsAC } from './dogs-a-c.js';     // Razas A-C
import { dogsDH } from './dogs-d-h.js';     // Razas D-H  
import { dogsIM } from './dogs-i-m.js';     // Razas I-M
import { dogsNZ } from './dogs-n-z.js';     // Razas N-Z

// Importar razas de gatos
import { catsALL } from './cats-all.js';    // Todas las razas de gatos

// 🛡️ FUNCIÓN DE VALIDACIÓN Y LIMPIEZA
function validateBreed(breed) {
  // Verificar que el objeto existe y tiene las propiedades mínimas requeridas
  if (!breed || typeof breed !== 'object') {
    console.warn('❌ Raza inválida encontrada (no es objeto):', breed);
    return false;
  }
  
  // Verificar propiedades esenciales
  if (!breed.id || typeof breed.id !== 'string') {
    console.warn('❌ Raza sin ID válido:', breed);
    return false;
  }
  
  if (!breed.name || typeof breed.name !== 'string') {
    console.warn('❌ Raza sin nombre válido:', breed);
    return false;
  }
  
  if (!breed.type || !['dog', 'cat'].includes(breed.type)) {
    console.warn('❌ Raza con tipo inválido:', breed);
    return false;
  }
  
  // Verificar propiedades numéricas básicas
  const numericFields = ['energyLevel', 'friendliness', 'grooming', 'training'];
  for (const field of numericFields) {
    if (breed[field] && (typeof breed[field] !== 'number' || breed[field] < 1 || breed[field] > 5)) {
      console.warn(`❌ Raza con ${field} inválido:`, breed);
      return false;
    }
  }
  
  return true;
}

// 🔧 FUNCIÓN PARA COMBINAR Y LIMPIAR ARRAYS
function combineAndCleanBreeds(...breedArrays) {
  const allBreeds = [];
  
  breedArrays.forEach((breedArray, index) => {
    if (!Array.isArray(breedArray)) {
      console.warn(`❌ Array de razas inválido en posición ${index}:`, breedArray);
      return;
    }
    
    breedArray.forEach((breed, breedIndex) => {
      if (validateBreed(breed)) {
        allBreeds.push(breed);
      } else {
        console.warn(`❌ Raza inválida en array ${index}, posición ${breedIndex}:`, breed);
      }
    });
  });
  
  return allBreeds;
}

// 🚀 COMBINAR TODAS LAS RAZAS CON VALIDACIÓN
const breedsData = combineAndCleanBreeds(
  dogsAC || [],
  dogsDH || [],
  dogsIM || [],
  dogsNZ || [],
  catsALL || []
);

// 📊 ESTADÍSTICAS DE DEPURACIÓN
console.log('📊 Estadísticas de carga de razas:');
console.log('  - dogsAC:', Array.isArray(dogsAC) ? dogsAC.length : 'ERROR');
console.log('  - dogsDH:', Array.isArray(dogsDH) ? dogsDH.length : 'ERROR');
console.log('  - dogsIM:', Array.isArray(dogsIM) ? dogsIM.length : 'ERROR');
console.log('  - dogsNZ:', Array.isArray(dogsNZ) ? dogsNZ.length : 'ERROR');
console.log('  - catsALL:', Array.isArray(catsALL) ? catsALL.length : 'ERROR');
console.log('  - Total válidas:', breedsData.length);

// 🛡️ VALIDACIÓN FINAL DEL ARRAY
if (breedsData.length === 0) {
  console.error('🚨 ERROR CRÍTICO: No se cargaron razas válidas');
  
  // Fallback con razas básicas para evitar que la app se rompa
  const fallbackBreeds = [
    {
      id: 'labrador-retriever',
      name: 'Labrador Retriever',
      image: '/images/breeds/labrador-retriever.jpg',
      description: 'Raza amigable y leal, perfecta para familias.',
      size: 'large',
      energyLevel: 4,
      friendliness: 5,
      grooming: 2,
      training: 5,
      type: 'dog',
      goodWith: ['children', 'dogs'],
      hypoallergenic: false,
      furLength: 'short',
      noiseLevel: 3,
      healthIssues: 3,
      costLevel: 3,
      independenceLevel: 2,
      suitableFor: ['families', 'companion']
    },
    {
      id: 'persian-cat',
      name: 'Persa',
      image: '/images/breeds/persian.jpg',
      description: 'Gato elegante y tranquilo.',
      size: 'medium',
      energyLevel: 2,
      friendliness: 3,
      grooming: 5,
      training: 2,
      type: 'cat',
      goodWith: ['seniors', 'apartments'],
      hypoallergenic: false,
      furLength: 'long',
      noiseLevel: 1,
      healthIssues: 4,
      costLevel: 4,
      independenceLevel: 4,
      suitableFor: ['companion']
    }
  ];
  
  console.log('🔄 Usando razas de fallback:', fallbackBreeds.length);
  breedsData.push(...fallbackBreeds);
}

// 📈 ESTADÍSTICAS FINALES CON VALIDACIÓN SEGURA
const stats = {
  // Usar filtros seguros para evitar errores de undefined
  dogs: breedsData.filter(breed => breed && breed.type === 'dog').length,
  cats: breedsData.filter(breed => breed && breed.type === 'cat').length,
  total: breedsData.length,
  
  // Estadísticas por tamaño (solo perros)
  smallDogs: breedsData.filter(breed => breed && breed.type === 'dog' && breed.size === 'small').length,
  mediumDogs: breedsData.filter(breed => breed && breed.type === 'dog' && breed.size === 'medium').length,
  largeDogs: breedsData.filter(breed => breed && breed.type === 'dog' && breed.size === 'large').length,
  
  // Razas hipoalergénicas
  hypoallergenic: breedsData.filter(breed => breed && breed.hypoallergenic === true).length,
  
  // Razas por nivel de energía
  lowEnergy: breedsData.filter(breed => breed && breed.energyLevel && breed.energyLevel <= 2).length,
  highEnergy: breedsData.filter(breed => breed && breed.energyLevel && breed.energyLevel >= 4).length,
  
  // Estado de implementación (siempre 100% si tenemos razas válidas)
  implementationProgress: breedsData.length > 0 ? 100 : 0,
  
  // Información de calidad de datos
  dataQuality: {
    withImages: breedsData.filter(breed => breed && breed.image).length,
    withDescriptions: breedsData.filter(breed => breed && breed.description).length,
    complete: breedsData.filter(breed => 
      breed && breed.id && breed.name && breed.type && breed.image && breed.description
    ).length
  }
};

// 📊 LOG DE ESTADÍSTICAS FINALES
console.log('✅ Estadísticas finales de razas:');
console.log(`  📊 Total: ${stats.total} razas`);
console.log(`  🐕 Perros: ${stats.dogs}`);
console.log(`  🐱 Gatos: ${stats.cats}`);
console.log(`  🏠 Hipoalergénicas: ${stats.hypoallergenic}`);
console.log(`  ⚡ Alta energía: ${stats.highEnergy}`);
console.log(`  😴 Baja energía: ${stats.lowEnergy}`);
console.log(`  📸 Con imágenes: ${stats.dataQuality.withImages}`);
console.log(`  📝 Con descripciones: ${stats.dataQuality.withDescriptions}`);
console.log(`  ✅ Datos completos: ${stats.dataQuality.complete}`);

// 🔍 VERIFICACIÓN DE INTEGRIDAD
const duplicateIds = [];
const seenIds = new Set();

breedsData.forEach(breed => {
  if (breed && breed.id) {
    if (seenIds.has(breed.id)) {
      duplicateIds.push(breed.id);
    } else {
      seenIds.add(breed.id);
    }
  }
});

if (duplicateIds.length > 0) {
  console.warn('⚠️ IDs duplicados encontrados:', duplicateIds);
}

// 🚀 EXPORTACIONES
export { breedsData, stats };
export default breedsData;

// 🛠️ EXPORTACIONES ADICIONALES PARA DEBUGGING
export const debugInfo = {
  originalArrays: {
    dogsAC: Array.isArray(dogsAC) ? dogsAC.length : 'ERROR',
    dogsDH: Array.isArray(dogsDH) ? dogsDH.length : 'ERROR', 
    dogsIM: Array.isArray(dogsIM) ? dogsIM.length : 'ERROR',
    dogsNZ: Array.isArray(dogsNZ) ? dogsNZ.length : 'ERROR',
    catsALL: Array.isArray(catsALL) ? catsALL.length : 'ERROR'
  },
  validationStats: {
    totalProcessed: (dogsAC?.length || 0) + (dogsDH?.length || 0) + (dogsIM?.length || 0) + (dogsNZ?.length || 0) + (catsALL?.length || 0),
    totalValid: breedsData.length,
    duplicateIds
  }
};

// 📚 FUNCIONES DE UTILIDAD PARA COMPONENTES
export const getBreedsByType = (type) => {
  return breedsData.filter(breed => breed && breed.type === type);
};

export const getBreedsBySize = (size) => {
  return breedsData.filter(breed => breed && breed.size === size);
};

export const getBreedById = (id) => {
  return breedsData.find(breed => breed && breed.id === id);
};

export const searchBreeds = (query) => {
  if (!query || typeof query !== 'string') return [];
  
  const searchTerm = query.toLowerCase().trim();
  return breedsData.filter(breed => 
    breed && 
    breed.name && 
    (breed.name.toLowerCase().includes(searchTerm) ||
     (breed.description && breed.description.toLowerCase().includes(searchTerm)))
  );
};