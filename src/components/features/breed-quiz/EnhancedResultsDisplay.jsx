// src/components/features/breed-quiz/EnhancedResultsDisplay.jsx
import React from 'react';
import BreedRecommendationResult from './BreedRecommendationResult';

const EnhancedResultsDisplay = ({ results, onCompareBreeds }) => {
  return (
    <div className="space-y-8">
      {/* Recomendación Principal */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#2E2E2E] mb-2">
            🥇 Tu Raza Ideal
          </h2>
          <p className="text-gray-600">
            Basado en tu estilo de vida y preferencias, esta es nuestra recomendación principal
          </p>
        </div>
        <BreedRecommendationResult recommendation={results.topMatch} />
      </div>

      {/* Alternativas */}
      {results.alternativeMatches && results.alternativeMatches.length > 0 && (
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-[#2E2E2E] mb-2">
              🔄 Otras opciones muy compatibles
            </h3>
            <p className="text-gray-600">
              Estas razas también son excelentes opciones para ti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.alternativeMatches.map((rec, index) => (
              <div key={rec.breed.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Header con ranking */}
                <div className="bg-gradient-to-r from-[#AFC2D5] to-[#9DB3C6] text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-3">#{index + 2}</span>
                      <div>
                        <h4 className="text-xl font-bold">{rec.breed.name}</h4>
                        <p className="text-sm opacity-90">{rec.compatibilityCategory} compatibilidad</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{rec.compatibilityScore}%</div>
                      <div className="text-xs opacity-90">compatibilidad</div>
                    </div>
                  </div>
                </div>

                {/* Imagen */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={rec.breed.image} 
                    alt={rec.breed.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {rec.breed.description || `${rec.breed.name} es una excelente opción que se adapta muy bien a tu estilo de vida.`}
                  </p>

                  {/* Aspectos destacados */}
                  {rec.strengths && rec.strengths.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-bold text-green-700 mb-2">✅ Aspectos positivos:</h5>
                      <ul className="text-xs text-green-800 space-y-1">
                        {rec.strengths.slice(0, 2).map((strength, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-1">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Consideraciones */}
                  {rec.challenges && rec.challenges.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-bold text-orange-700 mb-2">⚠️ Consideraciones:</h5>
                      <ul className="text-xs text-orange-800 space-y-1">
                        {rec.challenges.slice(0, 2).map((challenge, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-1">•</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <a 
                      href={`/razas/${rec.breed.id}`}
                      className="flex-1 text-center text-xs bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white px-3 py-2 rounded transition-colors"
                    >
                      Ver detalles completos
                    </a>
                    <button
                      onClick={() => window.open(`/comparador-razas?add=${rec.breed.id}`, '_blank')}
                      className="flex-1 text-center text-xs border border-[#AFC2D5] text-[#AFC2D5] hover:bg-[#AFC2D5] hover:text-white px-3 py-2 rounded transition-colors"
                    >
                      Comparar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón para comparar las 3 sugeridas */}
      {results.comparisonSuggestions && results.comparisonSuggestions.length >= 2 && (
        <div className="bg-gradient-to-r from-[#C8D6B9] to-[#B8CBA9] rounded-lg p-6 text-center">
          <h4 className="text-xl font-bold text-[#5A7251] mb-2">
            🔍 ¿Quieres ver una comparación detallada?
          </h4>
          <p className="text-[#5A7251] mb-4">
            Compara estas {results.comparisonSuggestions.length} razas recomendadas lado a lado para tomar la mejor decisión
          </p>
          <button 
            onClick={() => onCompareBreeds && onCompareBreeds(results.comparisonSuggestions)}
            className="px-8 py-3 bg-[#5A7251] hover:bg-[#4A6244] text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            🔍 Comparar estas {results.comparisonSuggestions.length} razas recomendadas
          </button>
        </div>
      )}

      {/* Estadísticas del resultado */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-bold text-[#2E2E2E] mb-4 text-center">
          📊 Resumen de tu compatibilidad
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {results.topMatch.compatibilityScore}%
            </div>
            <div className="text-sm text-gray-600">
              Mejor compatibilidad
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-[#AFC2D5] mb-1">
              {results.allRecommendations.length}
            </div>
            <div className="text-sm text-gray-600">
              Razas analizadas
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-[#F6B89E] mb-1">
              {Math.round(results.allRecommendations.reduce((acc, rec) => acc + rec.compatibilityScore, 0) / results.allRecommendations.length)}%
            </div>
            <div className="text-sm text-gray-600">
              Compatibilidad promedio
            </div>
          </div>
        </div>
      </div>

      {/* Consejo final */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">💡</span>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-blue-900 mb-2">Consejo final</h4>
            <p className="text-blue-800 text-sm mb-3">
              Recuerda que cada animal tiene su propia personalidad, independientemente de la raza. 
              Te recomendamos visitar refugios o criadores responsables para conocer a tu futura 
              mascota antes de tomar la decisión final.
            </p>
            <div className="flex flex-wrap gap-2">
              <a 
                href="/blog/adopcion-responsable" 
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Guía de adopción
              </a>
              <a 
                href="/blog/primeros-dias-mascota" 
                className="text-xs border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-colors"
              >
                Primeros días en casa
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedResultsDisplay;