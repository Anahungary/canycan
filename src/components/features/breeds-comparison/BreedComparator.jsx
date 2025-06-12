// src/components/features/breeds-comparison/BreedComparator.jsx - VERSIÓN CORREGIDA PARA ADDSENT
import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Componente para comparar razas seleccionadas
 * @param {Object} props Props del componente 
 * @param {Array} props.breeds Array de razas para comparar
 * @param {Function} props.onSelectionChange Callback cuando cambia la selección
 * @param {Array} props.userProfile Perfil del usuario para análisis personalizado
 */
const BreedComparator = ({ breeds = [], onSelectionChange, userProfile }) => {
  // ✅ CORREGIDO: Usar 'breeds' en lugar de 'initialBreeds'
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ✅ CORREGIDO: useRef para cleanup apropiado
  const abortControllerRef = useRef(null);
  
  // ✅ CORREGIDO: Inicializar con las razas cuando el componente se monta
  useEffect(() => {
    if (breeds && breeds.length > 0) {
      // Solo actualizar si realmente cambió el contenido
      setSelectedBreeds(prevSelected => {
        const currentIds = prevSelected.map(b => b.id);
        const newValidBreeds = breeds.filter(breed => currentIds.includes(breed.id));
        
        // Solo actualizar si hay diferencias
        if (newValidBreeds.length !== prevSelected.length) {
          return newValidBreeds;
        }
        return prevSelected;
      });
    }
  }, [breeds]); // ✅ CORREGIDO: Dependency array correcto

  // ✅ NUEVO: Event listener optimizado con cleanup apropiado
  useEffect(() => {
    const handleAddBreed = (e) => {
      const breedId = e.detail?.breedId;
      if (breedId) {
        console.log(`Evento recibido para añadir raza: ${breedId}`);
        addBreedToComparison(breedId);
      }
    };
    
    // ✅ CORREGIDO: Cleanup apropiado sin referencias a variables inexistentes
    document.addEventListener('addBreedToComparison', handleAddBreed);
    
    return () => {
      document.removeEventListener('addBreedToComparison', handleAddBreed);
    };
  }, []); // ✅ CORREGIDO: Array vacío porque no depende de props

  // ✅ NUEVO: Cleanup de AbortController en unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ✅ MEJORADO: Función para cargar raza con abort controller
  const loadBreedById = useCallback(async (breedId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // ✅ NUEVO: Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      // Simular carga de datos (aquí irían tus datos reales)
      const foundBreed = breeds.find(breed => breed.id === breedId);
      
      if (foundBreed) {
        addBreedToComparison(foundBreed);
      } else {
        throw new Error(`Raza con ID ${breedId} no encontrada`);
      }
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading breed:', error);
        setError(`Error al cargar la raza: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [breeds]); // ✅ CORREGIDO: Dependency apropiado

  // ✅ MEJORADO: Función para añadir raza con validación robusta
  const addBreedToComparison = useCallback((breed) => {
    if (!breed || !breed.id) {
      console.warn('Intento de añadir raza inválida:', breed);
      return;
    }

    setSelectedBreeds(prev => {
      // Verificar si ya existe
      if (prev.some(b => b.id === breed.id)) {
        console.log(`Raza ${breed.name} ya está en la comparación`);
        return prev;
      }

      // Límite máximo de 3 razas
      if (prev.length >= 3) {
        setError('Máximo 3 razas para comparar. Elimina una antes de añadir otra.');
        return prev;
      }

      const newSelection = [...prev, breed];
      
      // ✅ NUEVO: Notificar cambio al componente padre
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }

      console.log(`✅ Raza ${breed.name} añadida a la comparación`);
      return newSelection;
    });
  }, [onSelectionChange]);

  // ✅ MEJORADO: Función para remover raza
  const removeBreedFromComparison = useCallback((breedId) => {
    setSelectedBreeds(prev => {
      const newSelection = prev.filter(breed => breed.id !== breedId);
      
      // ✅ NUEVO: Notificar cambio al componente padre
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }
      
      // Limpiar error si se resuelve el problema
      if (error && prev.length >= 3 && newSelection.length < 3) {
        setError(null);
      }
      
      return newSelection;
    });
  }, [error, onSelectionChange]);

  // ✅ NUEVO: Función para limpiar toda la comparación
  const clearComparison = useCallback(() => {
    setSelectedBreeds([]);
    setError(null);
    
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

  // ✅ NUEVO: Preparar datos para AddSent si hay perfil de usuario
  const prepareComparisonDataForAddSent = useCallback(() => {
    if (!userProfile || selectedBreeds.length === 0) return null;

    return {
      userEmail: userProfile.email,
      comparedBreeds: selectedBreeds.map(breed => ({
        id: breed.id,
        name: breed.name,
        type: breed.type,
        compatibilityScore: calculateCompatibilityScore(breed, userProfile)
      })),
      userPreferences: {
        experience: userProfile.experienceLevel,
        livingSpace: userProfile.livingSpace,
        activityLevel: userProfile.activityLevel
      },
      comparisonTimestamp: new Date().toISOString()
    };
  }, [selectedBreeds, userProfile]);

  // ✅ NUEVO: Función helper para calcular compatibilidad
  const calculateCompatibilityScore = (breed, profile) => {
    if (!profile) return 0;
    
    let score = 0;
    let factors = 0;

    // Factor de experiencia
    if (profile.experienceLevel === 'beginner' && breed.training <= 3) {
      score += 2;
    } else if (profile.experienceLevel === 'experienced' && breed.training >= 3) {
      score += 2;
    }
    factors += 2;

    // Factor de espacio de vida
    if (profile.livingSpace === 'apartment' && breed.apartmentFriendly) {
      score += 2;
    } else if (profile.livingSpace === 'house' && breed.size === 'large') {
      score += 1;
    }
    factors += 2;

    // Factor de nivel de actividad
    const activityMatch = Math.abs(breed.energyLevel - (profile.activityLevel || 3));
    score += Math.max(0, 2 - activityMatch);
    factors += 2;

    return factors > 0 ? (score / factors) * 5 : 0;
  };

  // ✅ MEJORADO: Renderizar tabla de comparación
  const renderComparisonTable = () => {
    if (selectedBreeds.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🐕🐱</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Selecciona razas para comparar
          </h3>
          <p className="text-gray-600 mb-4">
            Busca razas en la lista superior y haz clic en "Comparar" para añadirlas aquí.
          </p>
        </div>
      );
    }

    const comparisonCategories = [
      { id: 'basic', label: 'Información Básica', items: ['Tipo', 'Tamaño', 'Esperanza de vida'] },
      { id: 'temperament', label: 'Temperamento', items: ['Energía', 'Sociabilidad', 'Entrenamiento'] },
      { id: 'care', label: 'Cuidados', items: ['Ejercicio', 'Aseo', 'Salud'] },
      { id: 'compatibility', label: 'Compatibilidad', items: ['Niños', 'Mascotas', 'Novatos'] }
    ];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Característica
              </th>
              {selectedBreeds.map(breed => (
                <th key={breed.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{breed.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{breed.type}</div>
                      {userProfile && (
                        <div className="text-xs text-blue-600 mt-1">
                          Compatibilidad: {calculateCompatibilityScore(breed, userProfile).toFixed(1)}/5
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeBreedFromComparison(breed.id)}
                      className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Eliminar de la comparación"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Información básica */}
            <tr className="bg-blue-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={selectedBreeds.length + 1}>
                📊 Información Básica
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Tamaño</td>
              {selectedBreeds.map(breed => (
                <td key={breed.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {breed.size || 'No especificado'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Esperanza de vida</td>
              {selectedBreeds.map(breed => (
                <td key={breed.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {breed.lifespan || 'No especificado'}
                </td>
              ))}
            </tr>

            {/* Temperamento */}
            <tr className="bg-green-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={selectedBreeds.length + 1}>
                🎭 Temperamento
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Nivel de energía</td>
              {selectedBreeds.map(breed => (
                <td key={breed.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (breed.energyLevel || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-600">({breed.energyLevel || 0}/5)</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Sociabilidad</td>
              {selectedBreeds.map(breed => (
                <td key={breed.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <div className="flex text-blue-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (breed.friendliness || 0) ? 'text-blue-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-600">({breed.friendliness || 0}/5)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Compatibilidad */}
            <tr className="bg-purple-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={selectedBreeds.length + 1}>
                👨‍👩‍👧‍👦 Compatibilidad
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Apartamentos</td>
              {selectedBreeds.map(breed => (
                <td key={breed.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {breed.apartmentFriendly === true ? (
                    <span className="text-green-600 font-medium">✓ Sí</span>
                  ) : breed.apartmentFriendly === false ? (
                    <span className="text-red-600 font-medium">✗ No</span>
                  ) : (
                    <span className="text-gray-400">No especificado</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Hipoalergénico</td>
              {selectedBreeds.map(breed => (
                <td key={breed.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {breed.hypoallergenic === true ? (
                    <span className="text-green-600 font-medium">✓ Sí</span>
                  ) : breed.hypoallergenic === false ? (
                    <span className="text-red-600 font-medium">✗ No</span>
                  ) : (
                    <span className="text-gray-400">No especificado</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#2E2E2E]">Comparador de Razas</h2>
            <p className="text-sm text-gray-600">
              {selectedBreeds.length > 0
                ? `Comparando ${selectedBreeds.length} ${selectedBreeds.length === 1 ? 'raza' : 'razas'}. Puedes seleccionar hasta 3 razas.`
                : 'Selecciona hasta 3 razas para comparar sus características.'}
            </p>
          </div>
          
          {/* ✅ NUEVO: Botón para exportar datos a AddSent */}
          {userProfile && selectedBreeds.length > 0 && (
            <button
              onClick={() => {
                const data = prepareComparisonDataForAddSent();
                console.log('Datos preparados para AddSent:', data);
                // Aquí puedes integrar con AddSent
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              📧 Enviar análisis
            </button>
          )}
        </div>
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
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={clearComparison}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                🗑️ Limpiar comparación
              </button>
              
              {userProfile && (
                <button
                  onClick={() => {
                    const data = prepareComparisonDataForAddSent();
                    // Aquí integras con tu API de AddSent
                    console.log('Enviar a AddSent:', data);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  📬 Recibir recomendaciones
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BreedComparator;