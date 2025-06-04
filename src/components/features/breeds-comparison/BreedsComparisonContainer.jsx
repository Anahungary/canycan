// src/components/features/breeds-comparison/BreedsComparisonContainer.jsx - VERSIÓN CORREGIDA COMPLETA
import React, { useState, useEffect } from 'react';
import FilterableBreedsList from './FilterableBreedsList.jsx';
import { ComparativeAnalysis } from './ComparativeAnalysis.jsx';
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
      
      // ✅ RANGOS DE COMPATIBILIDAD CORREGIDOS
      const isExcellentCompatibility = compatibilityScore >= 85;    // 85% o más = Excelente
      const isGoodCompatibility = compatibilityScore >= 75 && compatibilityScore < 85;  // 75-84% = Buena
      const isAcceptableCompatibility = compatibilityScore >= 65 && compatibilityScore < 75;  // 65-74% = Aceptable
      const isLowCompatibility = compatibilityScore < 65;          // Menos de 65% = Baja
      
      return {
        breed,
        compatibilityScore,
        strengths,
        challenges,
        isExcellentCompatibility,
        isGoodCompatibility,
        isAcceptableCompatibility,
        isLowCompatibility
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

        <div className="relative h-38 overflow-hidden">
          <img
            src={breed.image}
            alt={breed.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = '/images/breeds/default-pet.jpg';
            }}
          />
          <div className={`absolute top-3 left-3 ${breed.type === 'dog' ? 'bg-[#facc14]' : 'bg-[#F6B89E]'} text-white text-xs px-2 py-1 rounded-full`}>
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
              className="text-sm font-medium text-green-600 hover:underline"
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
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
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

      {/* ANÁLISIS COMPARATIVO DIRECTO */}
      {selectedBreeds.length >= 2 && (
        <ComparativeAnalysis selectedBreeds={selectedBreeds} userProfile={userProfile} />
      )}

      {/* Panel de análisis personalizado (solo si hay perfil) - ESTILO MEJORADO */}
      {personalizedAnalysis && selectedBreeds.length >= 2 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 mt-8 overflow-hidden relative">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-purple-50/30"></div>
          
          {/* Contenido principal */}
          <div className="relative z-10">
            {/* Header con diseño mejorado */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
                <span className="text-xl">🎯</span>
                <h3 className="text-xl text-white font-bold">
                  Análisis personalizado de compatibilidad
                </h3>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Basado en tu perfil específico, aquí está tu compatibilidad con cada raza seleccionada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedAnalysis.map((analysis) => (
                <div key={analysis.breed.id} className="group hover:scale-105 transition-all duration-300">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Header de la raza con compatibilidad */}
                    <div className="flex items-center mb-4">
                      <img 
                        src={analysis.breed.image} 
                        alt={analysis.breed.name}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-white shadow-md"
                        onError={(e) => {
                          e.target.src = '/images/breeds/default-pet.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900">{analysis.breed.name}</h4>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${
                          analysis.isExcellentCompatibility 
                            ? 'bg-green-100 text-green-700' :
                          analysis.isGoodCompatibility 
                            ? 'bg-blue-100 text-blue-700' :
                          analysis.isAcceptableCompatibility
                            ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                          {analysis.isExcellentCompatibility ? '🎯 Excelente' : 
                           analysis.isGoodCompatibility ? '👍 Buena' : 
                           analysis.isAcceptableCompatibility ? '⚠️ Aceptable' :
                           '❌ Baja'} compatibilidad
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso de compatibilidad */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Compatibilidad</span>
                        <span className="text-sm font-bold text-gray-900">{analysis.compatibilityScore}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            analysis.isExcellentCompatibility 
                              ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            analysis.isGoodCompatibility 
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                            analysis.isAcceptableCompatibility
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${analysis.compatibilityScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Fortalezas y desafíos con mejor diseño */}
                    <div className="space-y-4">
                      {analysis.strengths.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="font-medium text-green-800 mb-2 flex items-center">
                            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                            Aspectos positivos
                          </h5>
                          <ul className="space-y-1 text-green-800 text-sm">
                            {analysis.strengths.slice(0, 3).map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2 mt-0.5">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.challenges.length > 0 && (
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-medium text-orange-800 mb-2 flex items-center">
                            <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </span>
                            Consideraciones
                          </h5>
                          <ul className="space-y-1 text-orange-800 text-sm">
                            {analysis.challenges.slice(0, 3).map((challenge, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-0.5">•</span>
                                <span>{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Footer con enlace */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a 
                        href={`/razas/${analysis.breed.id}`}
                        className="text-sm font-medium text-[#AFC2D5] hover:text-[#9DB3C6] transition-colors flex items-center group"
                      >
                        Ver perfil completo 
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer informativo */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h5 className="font-bold text-blue-900 mb-2">Sobre tu análisis personalizado</h5>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Este análisis se basa en las respuestas de tu cuestionario personal. Los porcentajes reflejan qué tan bien cada raza se adapta a tu estilo de vida, experiencia y necesidades específicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de selección flotante */}
      {selectedBreeds.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-40 flex items-center space-x-2">
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