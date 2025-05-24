// src/components/features/breeds-comparison/BreedComparator.jsx - versión con solución para el problema de duplicados
import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente para comparar razas seleccionadas
 * @param {Object} props Props del componente 
 * @param {Array} props.initialBreeds Array inicial de razas para comparar
 */
const BreedsComparisonContainer = ({ breeds = [] }) => {
  const [selectedBreeds, setSelectedBreeds] = useState(initialBreeds || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Referencia para rastrear si ya tenemos un listener configurado
  const listenerConfigured = useRef(false);

  // Inicializar el componente con las razas iniciales
  useEffect(() => {
    if (initialBreeds && initialBreeds.length > 0) {
      setSelectedBreeds(initialBreeds);
    }
    
    // Prevenir múltiples listeners que causarían duplicados
    if (!listenerConfigured.current) {
      // Marcar que ya configuramos el listener para evitar duplicados
      listenerConfigured.current = true;
      
      // Escuchar eventos para añadir razas a la comparación
      const handleAddBreed = (e) => {
        const breedId = e.detail?.breedId;
        if (breedId) {
          console.log(`Evento recibido para añadir raza: ${breedId}`);
          addBreedToComparison(breedId);
        }
      };
      
      // Remover cualquier listener previo para evitar duplicados
      document.removeEventListener('addBreedToComparison', handleAddBreed);
      
      // Añadir nuevo listener
      document.addEventListener('addBreedToComparison', handleAddBreed);
      
      // Limpiar el event listener cuando el componente se desmonte
      return () => {
        document.removeEventListener('addBreedToComparison', handleAddBreed);
        listenerConfigured.current = false;
      };
    }
  }, [initialBreeds]);

  // Función para cargar una raza por su ID
  const loadBreedById = async (breedId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // En un entorno real, esto sería una llamada a la API
      // Simulamos un retraso para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Buscar en las tarjetas de razas visibles
      let breedData = null;
      
      // Buscar en el DOM usando data-breed-id
      const breedCard = document.querySelector(`[data-breed-id="${breedId}"]`);
      
      if (breedCard) {
        // Hemos encontrado la tarjeta, intentar extraer datos
        const nameElement = breedCard.querySelector('h3');
        const imageElement = breedCard.querySelector('img');
        const typeElement = breedCard.querySelector('[class*="bg-[#AFC2D5]"], [class*="bg-[#F6B89E]"]');
        
        // Intentar determinar tipo (perro/gato)
        let type = 'dog'; // Por defecto
        if (typeElement) {
          const typeText = typeElement.textContent.trim().toLowerCase();
          type = typeText.includes('gato') ? 'cat' : 'dog';
        }
        
        // Intentar determinar tamaño
        let size = 'medium'; // Por defecto
        const sizeTextElement = breedCard.querySelector('.text-gray-600');
        if (sizeTextElement) {
          const sizeText = sizeTextElement.textContent.toLowerCase();
          if (sizeText.includes('pequeño')) size = 'small';
          else if (sizeText.includes('mediano')) size = 'medium';
          else if (sizeText.includes('grande')) size = 'large';
        }
        
        // Buscar ratings de estrellas
        const ratingElements = breedCard.querySelectorAll('[class*="text-amber-500"]');
        
        // Datos de la raza
        breedData = {
          id: breedId,
          name: nameElement ? nameElement.textContent.trim() : `Raza ${breedId}`,
          image: imageElement ? imageElement.src : '',
          type: type,
          size: size,
          energyLevel: Math.min(Math.ceil(ratingElements.length / 4), 5) || 3,
          friendliness: 3, // Valor por defecto si no se puede determinar
          grooming: 2, // Valor por defecto si no se puede determinar
          training: 3, // Valor por defecto si no se puede determinar
          goodWith: [], // Por defecto vacío
          hypoallergenic: false // Por defecto no
        };
        
        // Intentar determinar goodWith
        const goodWithElements = breedCard.querySelectorAll('[class*="bg-[#C8D6B9]"]');
        if (goodWithElements.length > 0) {
          goodWithElements.forEach(element => {
            const text = element.textContent.trim().toLowerCase();
            if (text.includes('niños')) breedData.goodWith.push('children');
            else if (text.includes('perros')) breedData.goodWith.push('dogs');
            else if (text.includes('gatos')) breedData.goodWith.push('cats');
            else if (text.includes('adultos mayores')) breedData.goodWith.push('seniors');
            else if (text.includes('apartamentos')) breedData.goodWith.push('apartments');
          });
        }
        
        // Intentar determinar si es hipoalergénico
        const hypoElements = breedCard.querySelectorAll('.text-sm');
        for (const element of hypoElements) {
          if (element.textContent.includes('Hipoalergénico') && element.textContent.includes('Sí')) {
            breedData.hypoallergenic = true;
            break;
          }
        }
      }
      
      // Si no encontramos la tarjeta, intentar otras estrategias
      if (!breedData) {
        // Buscar en breeds visibles (si hay una prop con datos disponibles globalmente)
        if (window.allBreeds && Array.isArray(window.allBreeds)) {
          const breed = window.allBreeds.find(b => b.id === breedId);
          if (breed) {
            breedData = { ...breed };
          }
        }
      }
      
      // Como último recurso, crear datos mínimos con el ID
      if (!breedData) {
        breedData = {
          id: breedId,
          name: `Raza ${breedId}`,
          image: '',
          type: breedId.includes('cat') ? 'cat' : 'dog',
          size: 'medium',
          energyLevel: 3,
          friendliness: 3,
          grooming: 2,
          training: 3,
          goodWith: [],
          hypoallergenic: false
        };
      }
      
      return breedData;
    } catch (error) {
      console.error(`Error cargando la raza ${breedId}:`, error);
      setError('No se pudo cargar la información de la raza');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Añadir una raza a la comparación
  const addBreedToComparison = async (breedId) => {
    // Verificar si ya tenemos 3 razas seleccionadas
    if (selectedBreeds.length >= 3) {
      setError('Solo puedes comparar hasta 3 razas a la vez');
      return;
    }
    
    // Verificar si la raza ya está en la comparación
    if (selectedBreeds.some(breed => breed.id === breedId)) {
      setError('Esta raza ya está en la comparación');
      return;
    }
    
    // Cargar los datos de la raza
    const breedData = await loadBreedById(breedId);
    if (breedData) {
      setSelectedBreeds(prevBreeds => [...prevBreeds, breedData]);
      setError(null);
    }
  };

  // Eliminar una raza de la comparación
  const removeBreedFromComparison = (breedId) => {
    setSelectedBreeds(selectedBreeds.filter(breed => breed.id !== breedId));
    setError(null);
  };

  // Limpiar toda la comparación
  const clearComparison = () => {
    setSelectedBreeds([]);
    setError(null);
  };

  // Renderizar la tabla de comparación
  const renderComparisonTable = () => {
    if (selectedBreeds.length === 0) {
      return (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay razas seleccionadas para comparar
          </h3>
          <p className="text-gray-600">
            Selecciona hasta 3 razas para ver una comparación detallada.
            <br/>Puedes usar los filtros abajo para encontrar razas y hacer clic en "Comparar".
          </p>
        </div>
      );
    }
    
    // Renderizar estrellas de valoración
    const renderStars = (rating = 0) => {
      const numRating = parseInt(rating) || 0;
      return Array.from({ length: 5 }, (_, i) => {
        const filled = i < numRating;
        return (
          <span key={i} className={`text-sm ${filled ? 'text-amber-500' : 'text-gray-300'}`}>
            {filled ? '★' : '☆'}
          </span>
        );
      });
    };
    
    // Categorías a comparar
    const categories = [
      { id: 'type', label: 'Tipo' },
      { id: 'size', label: 'Tamaño' },
      { id: 'lifespan', label: 'Esperanza de vida' },
      { id: 'energyLevel', label: 'Nivel de energía' },
      { id: 'friendliness', label: 'Sociabilidad' },
      { id: 'grooming', label: 'Necesidad de cuidados' },
      { id: 'training', label: 'Facilidad de entrenamiento' },
      { id: 'goodWith', label: 'Buena convivencia con' },
      { id: 'hypoallergenic', label: 'Hipoalergénico' }
    ];
    
    // Mapeo de valores para categorías
    const valueMap = {
      type: {
        dog: 'Perro',
        cat: 'Gato'
      },
      size: {
        small: 'Pequeño',
        medium: 'Mediano',
        large: 'Grande'
      }
    };
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Característica
              </th>
              {selectedBreeds.map(breed => (
                <th key={breed.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col items-start">
                    {breed.image && (
                      <img 
                        src={breed.image} 
                        alt={breed.name || 'Raza'} 
                        className="w-16 h-16 object-cover rounded-full mb-2"
                      />
                    )}
                    <span>{breed.name}</span>
                    <button 
                      onClick={() => removeBreedFromComparison(breed.id)}
                      className="mt-2 text-xs  text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(category => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.label}
                </td>
                {selectedBreeds.map(breed => (
                  <td key={`${breed.id}-${category.id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.id === 'type' && (
                      valueMap.type[breed.type] || (breed.type || 'No especificado')
                    )}
                    {category.id === 'size' && (
                      valueMap.size[breed.size] || (breed.size || 'No especificado')
                    )}
                    {category.id === 'lifespan' && (
                      breed.lifespan ? `${breed.lifespan.min || '?'}-${breed.lifespan.max || '?'} años` : 'No especificado'
                    )}
                    {(category.id === 'energyLevel' || 
                      category.id === 'friendliness' || 
                      category.id === 'grooming' || 
                      category.id === 'training') && (
                      <div className="flex">{renderStars(breed[category.id] || 0)}</div>
                    )}
                    {category.id === 'goodWith' && (
                      <div className="flex flex-wrap gap-1">
                        {(breed.goodWith && Array.isArray(breed.goodWith) && breed.goodWith.length > 0) ? (
                          breed.goodWith.map((trait, idx) => (
                            <span key={`${trait}-${idx}`} className="px-2 py-1 rounded-full text-xs bg-[#C8D6B9] text-[#5A7251]">
                              {trait === 'children' ? 'Niños' :
                               trait === 'dogs' ? 'Perros' :
                               trait === 'cats' ? 'Gatos' :
                               trait === 'seniors' ? 'Adultos mayores' :
                               trait === 'apartments' ? 'Apartamentos' : trait}
                            </span>
                          ))
                        ) : (
                          'No especificado'
                        )}
                      </div>
                    )}
                    {category.id === 'hypoallergenic' && (
                      breed.hypoallergenic === true ? 
                        <span className="text-green-600">✓ Sí</span> : 
                        breed.hypoallergenic === false ?
                        <span className="text-red-600">✗ No</span> :
                        <span className="text-gray-400">No especificado</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2E2E2E]">Comparador de Razas</h2>
        <p className="text-sm text-gray-600">
          {selectedBreeds.length > 0
            ? `Comparando ${selectedBreeds.length} ${selectedBreeds.length === 1 ? 'raza' : 'razas'}. Puedes seleccionar hasta 3 razas.`
            : 'Selecciona hasta 3 razas para comparar sus características.'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AFC2D5]"></div>
        </div>
      ) : (
        <div className="p-4">
          {renderComparisonTable()}
          
          {selectedBreeds.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearComparison}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Limpiar comparación
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BreedComparator;