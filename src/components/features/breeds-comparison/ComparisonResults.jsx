// src/components/features/breeds-comparison/ComparisonResults.jsx
import React from 'react';
import { useComparison } from '../../../contexts/ComparisonContext';
import { calculateCompatibilityScore } from '../../../utils/breedMatcher';

const ComparisonResults = () => {
  const { selectedBreeds, userProfile, removeBreed, clearComparison } = useComparison();

  if (selectedBreeds.length < 2) {
    return null;
  }

  // Calcular compatibilidad si hay perfil de usuario
  const breedsWithCompatibility = selectedBreeds.map(breed => {
    if (userProfile) {
      const compatibilityScore = calculateCompatibilityScore(breed, userProfile);
      return {
        breed,
        compatibilityScore,
        isCompatible: compatibilityScore >= 60 // Umbral de compatibilidad
      };
    }
    return { breed, compatibilityScore: null, isCompatible: null };
  });

  // Separar en compatibles y menos compatibles
  const compatibleBreeds = breedsWithCompatibility.filter(item => item.isCompatible === true);
  const lessCompatibleBreeds = breedsWithCompatibility.filter(item => item.isCompatible === false);
  const neutralBreeds = breedsWithCompatibility.filter(item => item.isCompatible === null);

  const renderBreedCompatibilityCard = (item, type) => {
    const { breed, compatibilityScore } = item;
    
    return (
      <div key={breed.id} className={`p-4 rounded-lg border ${
        type === 'compatible' 
          ? 'bg-green-50 border-green-200' 
          : type === 'less-compatible'
            ? 'bg-red-50 border-red-200'
            : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <img 
              src={breed.image} 
              alt={breed.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <h4 className="font-bold text-lg">{breed.name}</h4>
              {compatibilityScore && (
                <p className="text-sm text-gray-600">
                  Compatibilidad: <span className="font-medium">{compatibilityScore}%</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => removeBreed(breed.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {userProfile && (
          <div className="text-sm">
            {type === 'compatible' && (
              <div className="text-green-700">
                <p className="font-medium mb-1">✓ Por qué es compatible contigo:</p>
                <ul className="list-disc list-inside space-y-1">
                  {getCompatibilityReasons(breed, userProfile).map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {type === 'less-compatible' && (
              <div className="text-red-700">
                <p className="font-medium mb-1">⚠ Aspectos a considerar:</p>
                <ul className="list-disc list-inside space-y-1">
                  {getIncompatibilityReasons(breed, userProfile).map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200">
          <a 
            href={`/razas/${breed.id}`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Ver perfil completo →
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Comparando {selectedBreeds.length} raza{selectedBreeds.length > 1 ? 's' : ''}
            {userProfile && ' - Basado en tu perfil'}
          </h3>
          <button
            onClick={clearComparison}
            className="text-gray-500 hover:text-red-500 font-medium text-sm"
          >
            Limpiar comparación
          </button>
        </div>

        {userProfile ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sección de razas compatibles */}
            {compatibleBreeds.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  MÁS compatibles contigo
                </h4>
                <div className="space-y-3">
                  {compatibleBreeds.map(item => renderBreedCompatibilityCard(item, 'compatible'))}
                </div>
              </div>
            )}

            {/* Sección de razas menos compatibles */}
            {lessCompatibleBreeds.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-red-700 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  MENOS compatibles - Requieren consideración
                </h4>
                <div className="space-y-3">
                  {lessCompatibleBreeds.map(item => renderBreedCompatibilityCard(item, 'less-compatible'))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>💡 Tip:</strong> Completa nuestro <a href="/tu-raza-ideal" className="underline font-medium">cuestionario "Tu Raza Ideal"</a> 
                para obtener recomendaciones personalizadas basadas en tu estilo de vida.
              </p>
            </div>
            {neutralBreeds.map(item => renderBreedCompatibilityCard(item, 'neutral'))}
          </div>
        )}
      </div>
    </div>
  );
};

// Funciones auxiliares para generar razones de compatibilidad
function getCompatibilityReasons(breed, userProfile) {
  const reasons = [];
  
  // Tamaño compatible
  if (breed.size === userProfile.sizePreference || userProfile.sizePreference === 'any') {
    reasons.push('Tamaño ideal para tus preferencias');
  }
  
  // Energía compatible
  if (Math.abs(breed.energyLevel - userProfile.activityLevel) <= 1) {
    reasons.push('Nivel de energía compatible con tu estilo de vida');
  }
  
  // Bueno con niños
  if (userProfile.hasChildren && breed.goodWith.includes('children')) {
    reasons.push('Excelente con niños');
  }
  
  // Bueno con otras mascotas
  if (userProfile.hasOtherPets && (
    (userProfile.otherPets === 'dogs' && breed.goodWith.includes('dogs')) ||
    (userProfile.otherPets === 'cats' && breed.goodWith.includes('cats'))
  )) {
    reasons.push(`Se lleva bien con ${userProfile.otherPets === 'dogs' ? 'otros perros' : 'gatos'}`);
  }
  
  // Hipoalergénico
  if (userProfile.allergies && breed.hypoallergenic) {
    reasons.push('Hipoalergénico, ideal para tus alergias');
  }
  
  return reasons.slice(0, 3); // Máximo 3 razones
}

function getIncompatibilityReasons(breed, userProfile) {
  const reasons = [];
  
  // Tamaño incompatible
  if (userProfile.sizePreference !== 'any' && breed.size !== userProfile.sizePreference) {
    reasons.push(`Tamaño ${breed.size === 'large' ? 'grande' : breed.size === 'small' ? 'pequeño' : 'mediano'}, diferente a tu preferencia`);
  }
  
  // Energía incompatible
  if (Math.abs(breed.energyLevel - userProfile.activityLevel) >= 2) {
    if (breed.energyLevel > userProfile.activityLevel) {
      reasons.push('Necesita más ejercicio del que puedes proporcionar');
    } else {
      reasons.push('Podría no seguir tu ritmo de actividad');
    }
  }
  
  // Problemas con niños
  if (userProfile.hasChildren && !breed.goodWith.includes('children')) {
    reasons.push('Requiere supervisión especial con niños');
  }
  
  // Problemas con alergias
  if (userProfile.allergies && !breed.hypoallergenic) {
    reasons.push('Puede provocar reacciones alérgicas');
  }
  
  // Tiempo solo
  if (userProfile.hoursAway >= 8 && breed.independenceLevel <= 2) {
    reasons.push('Puede sufrir ansiedad por separación');
  }
  
  return reasons.slice(0, 3); // Máximo 3 razones
}

export default ComparisonResults;