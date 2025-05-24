import React from 'react';

const BreedRecommendationResult = ({ recommendation }) => {
  const { breed, compatibilityScore, compatibilityCategory, strengths, challenges } = recommendation;
  
  // Función para generar etiquetas según las características de la raza
  const breedTags = () => {
    const tags = [];
    
    // Añadir tag basado en el tamaño
    if (breed.size === 'small') tags.push('Tamaño pequeño');
    else if (breed.size === 'medium') tags.push('Tamaño mediano');
    else if (breed.size === 'large') tags.push('Tamaño grande');
    
    // Añadir tag basado en la energía
    if (breed.energyLevel <= 2) tags.push('Baja energía');
    else if (breed.energyLevel >= 4) tags.push('Alta energía');
    
    // Añadir tag basado en el entrenamiento
    if (breed.training <= 2) tags.push('Fácil de entrenar');
    else if (breed.training >= 4) tags.push('Entrenamiento avanzado');
    
    // Añadir tag basado en el pelo
    if (breed.furLength === 'short') tags.push('Pelo corto');
    else if (breed.furLength === 'long') tags.push('Pelo largo');
    
    // Añadir tag de hipoalergénico si aplica
    if (breed.hypoallergenic) tags.push('Hipoalergénico');
    
    // Añadir tag para apartamentos si aplica
    if (breed.goodWith.includes('apartments')) tags.push('Apto para apartamento');
    
    // Añadir tag para niños si aplica
    if (breed.goodWith.includes('children')) tags.push('Bueno con niños');
    
    return tags;
  };
  
  // Generar color basado en la puntuación de compatibilidad
  const getScoreColor = () => {
    if (compatibilityScore >= 80) return 'bg-green-500';
    if (compatibilityScore >= 60) return 'bg-green-400';
    if (compatibilityScore >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={breed.image} 
              alt={breed.name} 
              className="w-full h-64 object-cover"
            />
            <div className={`absolute top-3 left-3 ${breed.type === 'dog' ? 'bg-[#AFC2D5]' : 'bg-[#F6B89E]'} text-white text-xs px-2 py-1 rounded-full`}>
              {breed.type === 'dog' ? 'Perro' : 'Gato'}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Compatibilidad</span>
              <span className="text-sm font-bold">{compatibilityScore}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-full rounded-full ${getScoreColor()}`}
                style={{ width: `${compatibilityScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-center mt-1">
              Compatibilidad <strong>{compatibilityCategory}</strong>
            </p>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">{breed.name}</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {breedTags().map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-[#C8D6B9] bg-opacity-30 text-[#5A7251] rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-600 mb-6">{breed.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2E2E2E] mb-3">Aspectos positivos</h3>
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-[#2E2E2E] mb-3">Consideraciones</h3>
              <ul className="space-y-2">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex gap-3">
            <a 
              href={`/razas/${breed.id}`} 
              className="px-4 py-2 bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white rounded-md text-sm font-medium transition-colors"
            >
              Ver perfil completo
            </a>
            <button 
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
              onClick={() => window.open(`/comparador-razas?add=${breed.id}`, '_blank')}
            >
              Comparar con otras razas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedRecommendationResult;