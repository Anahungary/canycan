// src/components/features/breed-quiz/DualBreedRecommendationResults.jsx - CONECTADO CON INDEX
import React, { useState } from 'react';
import { breedsData } from '../../../data/breeds/index.js'; // 🆕 CONEXIÓN CON EL ÍNDICE

// 🔧 FUNCIÓN PARA MAPEAR CORRECTAMENTE LOS TRAITS
const mapTraitToSpanish = (trait) => {
  const traitMap = {
    // Niños
    'children': 'Niños',
    'young_children': 'Niños pequeños',
    'older_children': 'Niños mayores',
    'teens': 'Adolescentes',
    
    // Otras mascotas
    'dogs': 'Otros perros',
    'cats': 'Gatos',
    'small_pets': 'Mascotas pequeñas',
    
    // Personas
    'seniors': 'Adultos mayores',
    'families': 'Familias',
    'singles': 'Personas solteras',
    
    // Espacios
    'apartments': 'Apartamentos',
    'small_spaces': 'Espacios pequeños',
    'large_yards': 'Patios grandes',
    
    // Niveles de experiencia
    'first_time_owners': 'Dueños primerizos',
    'experienced_owner': 'Dueños experimentados',
    
    // Estilos de vida
    'active_owners': 'Personas activas',
    'calm_environments': 'Ambientes tranquilos',
    'busy_households': 'Hogares ocupados'
  };
  
  return traitMap[trait] || trait; // Si no encuentra el mapeo, devuelve el valor original
};

const DualBreedRecommendationResults = ({ results, onCompareBreeds }) => {
  const [showComparison, setShowComparison] = useState(!results.availability.isColombianSameAsGlobal);
  const [activeTab, setActiveTab] = useState('colombian');

  // 🔧 VALIDAR QUE TENEMOS DATOS DE RAZAS
  if (!breedsData || breedsData.length === 0) {
    console.error('❌ No se encontraron datos de razas');
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-red-900 mb-2">
          Error de conexión con datos
        </h3>
        <p className="text-red-700">
          No se pudieron cargar los datos de razas. Por favor, verifica la configuración.
        </p>
      </div>
    );
  }

  // 🔧 FUNCIÓN PARA OBTENER DATOS COMPLETOS DE UNA RAZA
  const getFullBreedData = (breedId) => {
    const breed = breedsData.find(b => b.id === breedId);
    if (!breed) {
      console.warn(`⚠️ Raza no encontrada en índice: ${breedId}`);
      return null;
    }
    return breed;
  };

  // 🔧 VALIDAR QUE LAS RAZAS RECOMENDADAS EXISTEN EN EL ÍNDICE
  const colombianBreedData = getFullBreedData(results.colombianRecommendation.breed.id);
  const globalBreedData = getFullBreedData(results.globalRecommendation.breed.id);

  if (!colombianBreedData || !globalBreedData) {
    console.error('❌ Las razas recomendadas no se encontraron en el índice');
    return (
      <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-yellow-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-yellow-900 mb-2">
          Datos de razas incompletos
        </h3>
        <p className="text-yellow-700">
          Las razas recomendadas no están disponibles en la base de datos actual.
        </p>
      </div>
    );
  }

  const explanation = generateDualRecommendationExplanation(results);
  const formatScore = (score) => `${score}%`;

  if (results.availability.isColombianSameAsGlobal) {
    // Si la raza colombiana ES la ideal, mostrar resultado simple
    return (
      <div className="space-y-6">
        {/* Header de éxito */}
        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="text-4xl mb-3">🎯🇨🇴</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            ¡Resultado Perfecto!
          </h2>
          <p className="text-green-700 text-lg">
            Tu raza ideal <strong>{colombianBreedData.name}</strong> está disponible en Colombia
          </p>
        </div>

        {/* Resultado principal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-200">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{colombianBreedData.name}</h3>
                <p className="text-green-100">Tu compañero perfecto</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatScore(results.colombianRecommendation.compatibilityScore)}</div>
                <div className="text-xs text-green-100">compatibilidad</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Imagen */}
              <div className="flex justify-center">
                <img 
                  src={colombianBreedData.image || '/images/breeds/default.jpg'} 
                  alt={colombianBreedData.name}
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = '/images/breeds/default.jpg';
                  }}
                />
              </div>

              {/* Información */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <span className="mr-2">✅</span> Por qué es perfecto para ti:
                  </h4>
                  <ul className="space-y-2">
                    {results.colombianRecommendation.strengths.slice(0, 3).map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-bold text-green-800 mb-2">🇨🇴 Ventajas en Colombia:</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Disponible en criaderos locales</li>
                    <li>• Veterinarios especializados</li>
                    <li>• Precios accesibles</li>
                    <li>• Comunidad de dueños activa</li>
                  </ul>
                </div>

                {/* 🆕 INFORMACIÓN ADICIONAL DEL ÍNDICE */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-bold text-blue-800 mb-2">📊 Características:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Tamaño:</span>
                      <span className="font-medium ml-1">
                        {colombianBreedData.size === 'small' ? 'Pequeño' : 
                         colombianBreedData.size === 'medium' ? 'Mediano' : 'Grande'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Energía:</span>
                      <span className="font-medium ml-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < colombianBreedData.energyLevel ? 'text-amber-500' : 'text-gray-300'}>
                            {i < colombianBreedData.energyLevel ? '★' : '☆'}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sociabilidad:</span>
                      <span className="font-medium ml-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < colombianBreedData.friendliness ? 'text-amber-500' : 'text-gray-300'}>
                            {i < colombianBreedData.friendliness ? '★' : '☆'}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cuidados:</span>
                      <span className="font-medium ml-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < colombianBreedData.grooming ? 'text-amber-500' : 'text-gray-300'}>
                            {i < colombianBreedData.grooming ? '★' : '☆'}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href={`/razas/${colombianBreedData.id}`}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-center"
              >
                📖 Ver perfil completo
              </a>
              <button
                onClick={() => onCompareBreeds && onCompareBreeds([colombianBreedData])}
                className="px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors"
              >
                🔍 Comparar con otras razas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si las razas son diferentes, mostrar comparación
  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="text-4xl mb-3">🇨🇴🌍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Tu Raza Ideal: Disponibilidad vs Compatibilidad
        </h2>
        <p className="text-gray-600">
          Te mostramos tu mejor opción disponible en Colombia y tu raza teóricamente ideal
        </p>
      </div>

      {/* Tabs para alternar */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('colombian')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'colombian'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🇨🇴 Disponible en Colombia
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'global'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🌍 Raza Ideal Teórica
          </button>
        </div>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === 'colombian' ? (
        <BreedRecommendationCard 
          recommendation={results.colombianRecommendation}
          breedData={colombianBreedData}
          title="🇨🇴 Tu mejor opción en Colombia"
          subtitle={`Ranking global: #${results.availability.colombianRank}`}
          advantages={[
            "✅ Disponible en criaderos colombianos",
            "✅ Veterinarios especializados locales",
            "✅ Precios accesibles sin importación",
            "✅ Comunidad de dueños establecida"
          ]}
          cardColor="border-green-200"
          headerColor="from-green-500 to-emerald-500"
          onViewProfile={() => window.location.href = `/razas/${colombianBreedData.id}`}
          onCompare={() => onCompareBreeds && onCompareBreeds([colombianBreedData])}
        />
      ) : (
        <BreedRecommendationCard 
          recommendation={results.globalRecommendation}
          breedData={globalBreedData}
          title="🌍 Tu raza teóricamente ideal"
          subtitle={`${results.availability.scoreDifference}% más compatible`}
          advantages={[
            `✨ ${results.availability.scoreDifference}% mejor compatibilidad`,
            "⭐ Características ideales para ti",
            "🎯 Mejor match según algoritmo",
            "⚠️ Requiere búsqueda especializada"
          ]}
          cardColor="border-blue-200"
          headerColor="from-blue-500 to-indigo-500"
          onViewProfile={() => window.location.href = `/razas/${globalBreedData.id}`}
          onCompare={() => onCompareBreeds && onCompareBreeds([globalBreedData])}
        />
      )}

      {/* Sección de comparación */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          💡 Nuestra Recomendación
        </h3>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-700 text-center">
            {results.availability.message}
          </p>
        </div>

        {/* Comparación rápida */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-bold text-green-800 mb-2">🇨🇴 {colombianBreedData.name}</h4>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatScore(results.colombianRecommendation.compatibilityScore)}
            </div>
            <p className="text-sm text-green-700">Disponible localmente</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">🌍 {globalBreedData.name}</h4>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatScore(results.globalRecommendation.compatibilityScore)}
            </div>
            <p className="text-sm text-blue-700">Búsqueda especializada</p>
          </div>
        </div>
      </div>

      {/* Alternativas colombianas */}
      {results.colombianAlternatives.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            🇨🇴 Otras excelentes opciones en Colombia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.colombianAlternatives.map((alternative, index) => {
              const alternativeData = getFullBreedData(alternative.breed.id);
              if (!alternativeData) return null;

              return (
                <div key={alternative.breed.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <img 
                      src={alternativeData.image || '/images/breeds/default.jpg'} 
                      alt={alternativeData.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                      onError={(e) => {
                        e.target.src = '/images/breeds/default.jpg';
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-sm">{alternativeData.name}</h4>
                      <p className="text-xs text-gray-600">{formatScore(alternative.compatibilityScore)} compatible</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">
                    {alternative.strengths[0]?.substring(0, 60)}...
                  </p>
                  <div className="mt-2 flex gap-1">
                    <a 
                      href={`/razas/${alternativeData.id}`}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      Ver perfil
                    </a>
                    <button
                      onClick={() => onCompareBreeds && onCompareBreeds([alternativeData])}
                      className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      Comparar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para tarjetas de recomendación MEJORADO
const BreedRecommendationCard = ({ 
  recommendation, 
  breedData,
  title, 
  subtitle, 
  advantages, 
  cardColor, 
  headerColor,
  onViewProfile,
  onCompare
}) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${cardColor}`}>
    <div className={`bg-gradient-to-r ${headerColor} text-white p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">{breedData.name}</h3>
          <p className="text-white/90">{title}</p>
          {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{recommendation.compatibilityScore}%</div>
          <div className="text-xs text-white/80">compatibilidad</div>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagen */}
        <div className=" justify-center">
          <img 
            src={breedData.image || '/images/breeds/default.jpg'} 
            alt={breedData.name}
            className="w-200 h-200 object-cover rounded-lg "
            onError={(e) => {
              e.target.src = '/images/breeds/default.jpg';
            }}
          />
        </div>

        {/* Información */}
        <div className="space-y-4">
          {/* Características del índice */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h5 className="font-bold text-gray-800 mb-2">📊 Características:</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Tamaño:</span>
                <span className="font-medium ml-1">
                  {breedData.size === 'small' ? 'Pequeño' : 
                   breedData.size === 'medium' ? 'Mediano' : 'Grande'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium ml-1">
                  {breedData.type === 'dog' ? '🐕 Perro' : '🐱 Gato'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Ideal para:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {breedData.goodWith && breedData.goodWith.length > 0 ? (
                    breedData.goodWith.map((trait, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {mapTraitToSpanish(trait)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">
                      Información no disponible
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-700 mb-2">✨ Fortalezas para ti:</h4>
            <ul className="space-y-1">
              {recommendation.strengths.slice(0, 3).map((strength, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-700 mb-2">🎯 Ventajas:</h4>
            <ul className="space-y-1">
              {advantages.map((advantage, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {advantage}
                </li>
              ))}
            </ul>
          </div>

          {recommendation.challenges.length > 0 && (
            <div>
              <h4 className="font-bold text-orange-700 mb-2">⚠️ Consideraciones:</h4>
              <ul className="space-y-1">
                {recommendation.challenges.slice(0, 2).map((challenge, index) => (
                  <li key={index} className="text-sm text-orange-600 flex items-start">
                    <span className="text-orange-500 mr-2 mt-1">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onViewProfile}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          📖 Ver perfil completo
        </button>
        <button
          onClick={onCompare}
          className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
        >
          🔍 Comparar con otras razas
        </button>
      </div>
    </div>
  </div>
);

// Función auxiliar para generar explicación (debe importarse del matcher)
const generateDualRecommendationExplanation = (results) => {
  const colombianBreed = results.colombianRecommendation.breed.name;
  const globalBreed = results.globalRecommendation.breed.name;
  const scoreDiff = results.availability.scoreDifference;
  
  return {
    title: results.availability.isColombianSameAsGlobal 
      ? `🎯 ¡${colombianBreed} es perfecto para ti!`
      : `🇨🇴 Tu mejor opción en Colombia vs 🌍 Tu raza ideal teórica`,
    
    colombianSection: {
      title: `🇨🇴 En Colombia: ${colombianBreed}`,
      subtitle: `${results.colombianRecommendation.compatibilityScore}% de compatibilidad`,
      description: results.availability.isColombianSameAsGlobal 
        ? "Esta es tu raza ideal y está disponible localmente. ¡No necesitas buscar más!"
        : `Excelente opción disponible en criaderos colombianos. Posición #${results.availability.colombianRank} en el ranking global de compatibilidad contigo.`
    },
    
    globalSection: {
      title: `🌍 Raza ideal teórica: ${globalBreed}`,
      subtitle: `${results.globalRecommendation.compatibilityScore}% de compatibilidad`,
      description: results.availability.isColombianSameAsGlobal
        ? "¡Coincide con tu mejor opción colombiana!"
        : `Sería ${scoreDiff}% más compatible, pero requiere búsqueda especializada o importación.`
    },
    
    comparisonSection: {
      title: "💡 Nuestra recomendación",
      description: results.availability.message
    }
  };
};

export default DualBreedRecommendationResults;