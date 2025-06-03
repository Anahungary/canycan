// src/components/features/breeds-comparison/BreedsComparisonContainer.jsx - VERSIÓN CON ANÁLISIS COMPARATIVO
import React, { useState, useEffect } from 'react';
import FilterableBreedsList from './FilterableBreedsList.jsx';
import { ComparativeAnalysis } from './ComparativeAnalysis.jsx'; // El componente que acabamos de crear
import { calculateCompatibilityScore, identifyStrengths, identifyChallenges } from '../../../utils/breedMatcher';

const BreedsComparisonContainer = ({ breeds = [] }) => {
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ✅ VALIDACIÓN DE DATOS DE ENTRADA
  const validBreeds = Array.isArray(breeds) ? breeds.filter(breed => 
    breed && 
    typeof breed === 'object' && 
    breed.id && 
    breed.name && 
    breed.type && 
    ['dog', 'cat'].includes(breed.type)
  ) : [];

  // Mostrar componente de error si no hay razas válidas
  if (validBreeds.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🐕🐱</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No hay razas disponibles
          </h3>
          <p className="text-gray-600 mb-4">
            Parece que hay un problema cargando los datos de las razas.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  // Cargar perfil del usuario desde localStorage si existe
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        console.log('👤 Perfil de usuario cargado:', profile);
      } catch (error) {
        console.error('❌ Error loading user profile:', error);
      }
    }
  }, []);

  const addBreed = (breed) => {
    if (selectedBreeds.length < 3 && !selectedBreeds.find(b => b.id === breed.id)) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setSelectedBreeds(prev => [...prev, breed]);
        setIsAnalyzing(false);
      }, 300);
    }
  };

  const removeBreed = (breedId) => {
    setSelectedBreeds(prev => prev.filter(breed => breed.id !== breedId));
  };

  const clearComparison = () => {
    setSelectedBreeds([]);
  };

  const isSelected = (breedId) => {
    return selectedBreeds.some(breed => breed.id === breedId);
  };

  const canAddMore = selectedBreeds.length < 3;

  // Calcular análisis de compatibilidad para cada raza seleccionada (solo si hay perfil)
  const getPersonalizedAnalysis = () => {
    if (!userProfile) return null;

    return selectedBreeds.map(breed => {
      const compatibilityScore = calculateCompatibilityScore(breed, userProfile);
      const strengths = identifyStrengths(breed, userProfile);
      const challenges = identifyChallenges(breed, userProfile);
      
      return {
        breed,
        compatibilityScore,
        strengths,
        challenges,
        isHighCompatibility: compatibilityScore >= 70,
        isModerateCompatibility: compatibilityScore >= 50 && compatibilityScore < 70,
        isLowCompatibility: compatibilityScore < 50
      };
    });
  };

  const personalizedAnalysis = getPersonalizedAnalysis();

  // 🎨 Renderizar tarjeta personalizada para el comparador
  const renderComparisonCard = (breed) => {
    const renderRating = (rating) => {
      return Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-sm ${i < rating ? 'text-amber-500' : 'text-gray-300'}`}>
          {i < rating ? '★' : '☆'}
        </span>
      ));
    };

    const selected = isSelected(breed.id);

    return (
      <div 
        className={`relative rounded-lg overflow-hidden border transition-all duration-300 ${
          selected
            ? 'border-[#AFC2D5] bg-[#AFC2D5] bg-opacity-10 shadow-lg ring-2 ring-[#AFC2D5] ring-opacity-50' 
            : 'border-gray-200 hover:shadow-md hover:border-[#AFC2D5]'
        } bg-white`}
      >
        
        {/* Badge de selección mejorado */}
        {selected && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-[#AFC2D5] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Seleccionado
            </div>
          </div>
        )}

        <div className="relative h-48 overflow-hidden">
          <img
            src={breed.image}
            alt={breed.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = '/images/breeds/default-pet.jpg'; // Imagen por defecto
            }}
          />
          <div className={`absolute top-3 left-3 ${breed.type === 'dog' ? 'bg-[#AFC2D5]' : 'bg-[#F6B89E]'} text-white text-xs px-2 py-1 rounded-full`}>
            {breed.type === 'dog' ? 'Perro' : 'Gato'}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{breed.name}</h3>

          <div className="mb-4 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tamaño:</span>
              <span className="font-medium capitalize">
                {breed.size === 'small' ? 'Pequeño' : breed.size === 'medium' ? 'Mediano' : 'Grande'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Energía:</span>
              <div className="flex">{renderRating(breed.energyLevel || 0)}</div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sociabilidad:</span>
              <div className="flex">{renderRating(breed.friendliness || 0)}</div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cuidados:</span>
              <div className="flex">{renderRating(breed.grooming || 0)}</div>
            </div>

            {/* Características adicionales */}
            <div className="pt-2 border-t border-gray-200">
              {breed.hypoallergenic && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  ✓ Hipoalergénica
                </span>
              )}
              {breed.goodWith && breed.goodWith.includes('children') && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  👶 Bueno con niños
                </span>
              )}
              {breed.goodWith && breed.goodWith.includes('apartments') && (
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  🏠 Apto apartamento
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <a 
              href={`/razas/${breed.id}`} 
              className="text-sm font-medium text-[#AFC2D5] hover:underline"
            >
              Ver detalles
            </a>
            
            <button
              onClick={() => {
                if (selected) {
                  removeBreed(breed.id);
                } else if (canAddMore) {
                  addBreed(breed);
                }
              }}
              disabled={!selected && !canAddMore}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selected
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                  : canAddMore
                    ? 'bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selected ? 'Quitar' : canAddMore ? 'Comparar' : 'Máximo 3'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header explicativo */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Selecciona razas para comparar</h2>
        <p className="text-gray-600 mb-2">
          Haz clic en "Comparar" en hasta 3 razas que te interesen.
        </p>
        {userProfile ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-green-800 font-medium">
              ✅ Perfil detectado - Te mostraremos análisis personalizado de compatibilidad
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-blue-800">
              💡 <strong>Consejo:</strong> El comparador funciona perfectamente sin test. Completa nuestro{' '}
              <a href="/tu-raza-ideal" className="underline font-medium hover:text-blue-600">
                cuestionario "Tu Raza Ideal"
              </a>{' '}
              solo si quieres análisis de compatibilidad ultra-personalizado.
            </p>
          </div>
        )}
      </div>

      {/* Lista filtrable de razas */}
      <FilterableBreedsList 
        initialBreeds={validBreeds}
        activeFilters={{
          type: [],
          size: [],
          energyLevel: [],
          goodWith: [],
          experience: [],
          apartmentFriendly: null,
          hypoallergenic: null
        }}
        selectedBreeds={selectedBreeds}
        onBreedSelect={(breed) => {
          if (isSelected(breed.id)) {
            removeBreed(breed.id);
          } else if (canAddMore) {
            addBreed(breed);
          }
        }}
        onFilterChange={(filters) => {
          console.log('🔍 Filtros aplicados:', filters);
        }}
      >
        {/* Función que renderiza cada tarjeta */}
        {(breed) => renderComparisonCard(breed)}
      </FilterableBreedsList>

      {/* ANÁLISIS COMPARATIVO DIRECTO - NUEVO */}
      {selectedBreeds.length >= 2 && (
        <ComparativeAnalysis selectedBreeds={selectedBreeds} />
      )}

      {/* Panel de análisis personalizado (solo si hay perfil) */}
      {personalizedAnalysis && selectedBreeds.length >= 2 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6">
          <h3 className="text-xl font-bold text-[#2E2E2E] mb-6">
            🎯 Análisis personalizado de compatibilidad
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalizedAnalysis.map((analysis) => (
              <div key={analysis.breed.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <img 
                    src={analysis.breed.image} 
                    alt={analysis.breed.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{analysis.breed.name}</h4>
                    <div className={`text-sm font-medium ${
                      analysis.isHighCompatibility ? 'text-green-600' :
                      analysis.isModerateCompatibility ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      Compatibilidad: {analysis.compatibilityScore}%
                    </div>
                  </div>
                </div>

                <div className="text-sm space-y-2">
                  {analysis.strengths.length > 0 && (
                    <div>
                      <p className="font-medium text-green-700 mb-1">✓ Aspectos positivos:</p>
                      <ul className="list-disc list-inside space-y-1 text-green-800 text-xs">
                        {analysis.strengths.slice(0, 2).map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.challenges.length > 0 && (
                    <div>
                      <p className="font-medium text-orange-700 mb-1">⚠ Consideraciones:</p>
                      <ul className="list-disc list-inside space-y-1 text-orange-800 text-xs">
                        {analysis.challenges.slice(0, 2).map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <a 
                    href={`/razas/${analysis.breed.id}`}
                    className="text-sm font-medium text-[#AFC2D5] hover:underline"
                  >
                    Ver perfil completo →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicador de selección flotante */}
      {selectedBreeds.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-[#AFC2D5] text-white px-4 py-2 rounded-full shadow-lg z-40 flex items-center space-x-2">
          <span className="text-sm font-medium">
            {selectedBreeds.length}/3 razas seleccionadas
          </span>
          {selectedBreeds.length >= 2 && (
            <button
              onClick={clearComparison}
              className="ml-2 text-white hover:text-gray-200 text-xs"
              title="Limpiar selección"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Estado vacío mejorado */}
      {selectedBreeds.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Selecciona razas para comenzar
            </h3>
            <p className="text-gray-600 mb-4">
              Usa los filtros arriba para encontrar razas que te interesen y haz clic en "Comparar" para comenzar el análisis.
            </p>
            <div className="text-sm text-gray-500">
              💡 <strong>Tip:</strong> Puedes comparar hasta 3 razas a la vez
            </div>
          </div>
        </div>
      )}

      {/* Estado con una sola raza */}
      {selectedBreeds.length === 1 && (
        <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-200">
          <div className="max-w-md mx-auto">
            <div className="text-4xl mb-3">👍</div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              ¡{selectedBreeds[0].name} seleccionado!
            </h3>
            <p className="text-blue-700 mb-4">
              Selecciona al menos una raza más para comenzar la comparación.
            </p>
            <div className="text-sm text-blue-600">
              Puedes agregar hasta 2 razas más para una comparación completa.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedsComparisonContainer;