// src/components/features/breeds-comparison/ComparativeAnalysis.jsx - VERSIÓN CORREGIDA
import React from 'react';

// Función para analizar y comparar razas seleccionadas
const analyzeBreedComparison = (selectedBreeds) => {
  if (selectedBreeds.length < 2) return null;

  const characteristics = [
    {
      key: 'energyLevel',
      label: 'Nivel de energía',
      emoji: '⚡',
      higherIsBetter: null, // Depende del usuario
      descriptions: {
        higher: 'más energético',
        lower: 'más tranquilo',
        equal: 'mismo nivel de energía'
      }
    },
    {
      key: 'friendliness',
      label: 'Sociabilidad',
      emoji: '🤝',
      higherIsBetter: true,
      descriptions: {
        higher: 'más sociable',
        lower: 'más reservado',
        equal: 'igual de sociable'
      }
    },
    {
      key: 'grooming',
      label: 'Cuidados',
      emoji: '✂️',
      higherIsBetter: false,
      descriptions: {
        higher: 'necesita más cuidados',
        lower: 'requiere menos cuidados',
        equal: 'necesitan el mismo nivel de cuidados'
      }
    },
    {
      key: 'training',
      label: 'Entrenabilidad',
      emoji: '🎓',
      higherIsBetter: true,
      descriptions: {
        higher: 'más fácil de entrenar',
        lower: 'más desafiante de entrenar',
        equal: 'igual de fácil de entrenar'
      }
    },
    {
      key: 'healthIssues',
      label: 'Problemas de salud',
      emoji: '💊',
      higherIsBetter: false,
      descriptions: {
        higher: 'más propenso a problemas de salud',
        lower: 'más saludable',
        equal: 'similar predisposición a problemas de salud'
      }
    },
    {
      key: 'noiseLevel',
      label: 'Nivel de ruido',
      emoji: '🔊',
      higherIsBetter: false,
      descriptions: {
        higher: 'más ruidoso',
        lower: 'más silencioso',
        equal: 'mismo nivel de ruido'
      }
    },
    {
      key: 'costLevel',
      label: 'Costo de mantenimiento',
      emoji: '💰',
      higherIsBetter: false,
      descriptions: {
        higher: 'más costoso de mantener',
        lower: 'más económico de mantener',
        equal: 'similar costo de mantenimiento'
      }
    },
    {
      key: 'independenceLevel',
      label: 'Independencia',
      emoji: '🏠',
      higherIsBetter: null,
      descriptions: {
        higher: 'más independiente',
        lower: 'más dependiente/apegado',
        equal: 'mismo nivel de independencia'
      }
    }
  ];

  // Analizar cada característica
  const comparisons = characteristics.map(char => {
    const values = selectedBreeds.map(breed => ({
      breed,
      value: parseInt(breed[char.key]) || 0,
      name: breed.name
    }));

    // Ordenar por valor (mayor a menor)
    const sortedValues = [...values].sort((a, b) => b.value - a.value);
    
    const highest = sortedValues[0];
    const lowest = sortedValues[sortedValues.length - 1];
    
    // Verificar si hay empates
    const uniqueValues = [...new Set(values.map(v => v.value))];
    const hasVariation = uniqueValues.length > 1;
    
    let analysis = null;
    
    if (!hasVariation) {
      // Todas las razas tienen el mismo valor
      analysis = {
        type: 'equal',
        message: `Todas ${char.descriptions.equal}`
      };
    } else {
      // Hay diferencias
      const highestBreeds = values.filter(v => v.value === highest.value);
      const lowestBreeds = values.filter(v => v.value === lowest.value);
      
      if (highestBreeds.length === 1 && lowestBreeds.length === 1) {
        // Un ganador claro y un último claro
        analysis = {
          type: 'clear_difference',
          highest: {
            breeds: highestBreeds,
            description: char.descriptions.higher,
            value: highest.value
          },
          lowest: {
            breeds: lowestBreeds,
            description: char.descriptions.lower,
            value: lowest.value
          }
        };
      } else {
        // Empates parciales
        analysis = {
          type: 'partial_ties',
          highest: {
            breeds: highestBreeds,
            description: char.descriptions.higher,
            value: highest.value
          },
          lowest: {
            breeds: lowestBreeds,
            description: char.descriptions.lower,
            value: lowest.value
          }
        };
      }
    }

    return {
      ...char,
      values,
      analysis,
      hasVariation
    };
  });

  // Generar insights generales
  const insights = generateGeneralInsights(selectedBreeds, comparisons);

  return {
    comparisons: comparisons.filter(c => c.hasVariation), // Solo mostrar donde hay diferencias
    insights,
    summary: generateSummary(selectedBreeds, comparisons)
  };
};

// Generar insights generales sobre las razas comparadas
const generateGeneralInsights = (breeds, comparisons) => {
  const insights = [];

  // Análisis de tipos
  const types = breeds.map(b => b.type);
  const uniqueTypes = [...new Set(types)];
  
  if (uniqueTypes.length > 1) {
    insights.push({
      type: 'species_mix',
      icon: '🐕🐱',
      title: 'Comparación entre especies',
      message: 'Estás comparando diferentes especies. Recuerda que perros y gatos tienen necesidades naturalmente diferentes.'
    });
  }

  // Análisis de tamaños (solo para perros)
  const dogs = breeds.filter(b => b.type === 'dog');
  if (dogs.length >= 2) {
    const sizes = dogs.map(d => d.size);
    const uniqueSizes = [...new Set(sizes)];
    
    if (uniqueSizes.length > 1) {
      const sizeOrder = { small: 1, medium: 2, large: 3 };
      const sortedSizes = uniqueSizes.sort((a, b) => sizeOrder[a] - sizeOrder[b]);
      
      insights.push({
        type: 'size_difference',
        icon: '📏',
        title: 'Diferentes tamaños',
        message: `Hay razas de tamaño ${sortedSizes.join(', ')}. Considera el espacio disponible y tus preferencias.`
      });
    }
  }

  // Análisis de energía extrema
  const energyLevels = breeds.map(b => parseInt(b.energyLevel) || 0);
  const maxEnergy = Math.max(...energyLevels);
  const minEnergy = Math.min(...energyLevels);
  
  if (maxEnergy - minEnergy >= 3) {
    insights.push({
      type: 'energy_gap',
      icon: '⚡',
      title: 'Gran diferencia de energía',
      message: 'Hay una diferencia significativa en los niveles de energía. Considera tu estilo de vida y tiempo disponible.'
    });
  }

  // Análisis de cuidados
  const groomingLevels = breeds.map(b => parseInt(b.grooming) || 0);
  const maxGrooming = Math.max(...groomingLevels);
  const minGrooming = Math.min(...groomingLevels);
  
  if (maxGrooming - minGrooming >= 2) {
    insights.push({
      type: 'grooming_difference',
      icon: '✂️',
      title: 'Diferentes necesidades de cuidado',
      message: 'Las razas seleccionadas tienen muy diferentes necesidades de aseo y cuidado.'
    });
  }

  return insights;
};

// Generar resumen ejecutivo
const generateSummary = (breeds, comparisons) => {
  const summary = {
    totalBreeds: breeds.length,
    types: [...new Set(breeds.map(b => b.type))],
    mainDifferences: [],
    recommendations: []
  };

  // Identificar las 3 diferencias más significativas
  const significantDiffs = comparisons
    .filter(c => c.hasVariation)
    .map(c => {
      const values = c.values.map(v => v.value);
      const variance = Math.max(...values) - Math.min(...values);
      return { ...c, variance };
    })
    .sort((a, b) => b.variance - a.variance)
    .slice(0, 3);

  summary.mainDifferences = significantDiffs.map(diff => ({
    characteristic: diff.label,
    variance: diff.variance,
    emoji: diff.emoji
  }));

  // Generar recomendaciones básicas
  if (significantDiffs.length > 0) {
    summary.recommendations.push(
      'Considera cuáles de estas diferencias son más importantes para tu estilo de vida.'
    );
  }

  return summary;
};

// Componente principal de análisis comparativo con diseño mejorado
const ComparativeAnalysis = ({ selectedBreeds }) => {
  const analysis = analyzeBreedComparison(selectedBreeds);
  
  if (!analysis) return null;

  // Función para crear barras de progreso comparativas
  const renderProgressComparison = (comparison) => {
    const maxValue = Math.max(...comparison.values.map(v => v.value));
    
    return (
      <div className="space-y-3">
        {comparison.values.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            {/* Avatar de la raza */}
            <div className="flex items-center space-x-2 w-32 flex-shrink-0">
              <img 
                src={item.breed.image} 
                alt={item.breed.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  e.target.src = '/images/breeds/default-pet.jpg';
                }}
              />
              <span className="text-xs font-medium text-gray-700 truncate">
                {item.breed.name}
              </span>
            </div>
            
            {/* Barra de progreso */}
            <div className="flex-1 relative">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    item.value === maxValue 
                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                      : 'bg-gradient-to-r from-blue-400 to-blue-600'
                  }`}
                  style={{ width: `${(item.value / 5) * 100}%` }}
                />
              </div>
              
              {/* Valor numérico */}
              <div className="absolute -right-1 -top-6">
                <span className={`text-xs font-bold px-2 py-1 rounded-full text-white shadow-sm ${
                  item.value === maxValue 
                    ? 'bg-green-500' 
                    : 'bg-blue-500'
                }`}>
                  {item.value}/5
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Función para renderizar comparación tipo "vs"
  const renderVsComparison = (comparison) => {
    if (comparison.analysis.type === 'equal') {
      return (
        <div className="text-center py-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
          <div className="text-3xl mb-2">🤝</div>
          <p className="text-gray-600 font-medium">{comparison.analysis.message}</p>
        </div>
      );
    }

    const winner = comparison.analysis.highest;
    const lower = comparison.analysis.lowest;

    return (
      <div className="relative">
        {/* Winner side */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">👑</span>
              </div>
              <div>
                <p className="font-bold text-green-800">
                  {winner.breeds.map(b => b.name).join(', ')}
                </p>
                <p className="text-sm text-green-600 capitalize">
                  {winner.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700">{winner.value}</div>
              <div className="text-xs text-green-600">de 5</div>
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-white border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
            <span className="text-sm font-bold text-gray-600">VS</span>
          </div>
        </div>

        {/* Lower side */}
        {lower && lower.value !== winner.value && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📉</span>
                </div>
                <div>
                  <p className="font-bold text-orange-800">
                    {lower.breeds.map(b => b.name).join(', ')}
                  </p>
                  <p className="text-sm text-orange-600 capitalize">
                    {lower.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-700">{lower.value}</div>
                <div className="text-xs text-orange-600">de 5</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl   overflow-hidden relative">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header con animación */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#AFC2D5] to-[#9DB3C6] text-white px-6 py-3 rounded-full shadow-lg mb-4">
            <span className="text-xl">📊</span>
            <h3 className="text-xl font-bold">
              Análisis comparativo de {selectedBreeds.length} razas
            </h3>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aquí puedes ver cómo se comparan tus razas seleccionadas en diferentes características importantes.
          </p>
        </div>

        {/* Insights generales con cards mejoradas */}
        {analysis.insights.length > 0 && (
          <div className="mb-10">
            <h4 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                💡
              </span>
              Observaciones importantes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.insights.map((insight, index) => (
                <div key={index} className="group hover:scale-105 transition-all duration-300">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-xl">{insight.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-blue-900 mb-2">{insight.title}</h5>
                        <p className="text-sm text-blue-700 leading-relaxed">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparaciones con diseño tipo dashboard */}
        {analysis.comparisons.length > 0 && (
          <div className="mb-10">
            <h4 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3">
                🔍
              </span>
              Comparación detallada
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {analysis.comparisons.map((comp, index) => (
                <div key={index} className="group">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Header de la característica */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <span className="text-xl">{comp.emoji}</span>
                        </div>
                        <h5 className="font-bold text-gray-900 text-lg">{comp.label}</h5>
                      </div>
                      
                      {/* Badge de diferencia */}
                      <div className="bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-gray-600">
                          Diferencia: {Math.max(...comp.values.map(v => v.value)) - Math.min(...comp.values.map(v => v.value))} pts
                        </span>
                      </div>
                    </div>

                    {/* Tipo de visualización según preferencia */}
                    <div className="space-y-4">
                      {/* Barras de progreso */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-3">Comparación visual</h6>
                        {renderProgressComparison(comp)}
                      </div>
                      
                      {/* Resumen textual */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Resumen</h6>
                        {renderVsComparison(comp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen ejecutivo con diseño premium */}
        <div className="bg-gradient-to-br from-[#ced5dc] via-[#ecf2f6] to-[#8BA3B8] rounded-xl p-8 text-white relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="text-xl font-bold">Resumen ejecutivo</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <h5 className="font-bold mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  Principales diferencias
                </h5>
                <div className="space-y-2">
                  {analysis.summary.mainDifferences.map((diff, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <span>{diff.emoji}</span>
                      <span className="font-medium">{diff.characteristic}</span>
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                        {diff.variance} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <h5 className="font-bold mb-3 flex items-center">
                  <span className="mr-2">💭</span>
                  Recomendación
                </h5>
                <p className="text-sm leading-relaxed opacity-90">
                  {analysis.summary.recommendations[0] || 'Todas las razas seleccionadas son muy similares en sus características principales.'}
                </p>
              </div>
            </div>

            {/* CTA mejorado */}
            <div className="text-center">
              <p className="mb-4 opacity-90">¿Quieres un análisis aún más personalizado?</p>
              <a 
                href="/tu-raza-ideal"
                className="inline-flex items-center space-x-2 bg-white text-[#AFC2D5] px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="text-xl">🎯</span>
                <span>Hacer test personalizado para mayor precisión</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ EXPORTACIÓN CORREGIDA
export { analyzeBreedComparison, ComparativeAnalysis };
export default ComparativeAnalysis;