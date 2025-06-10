// src/components/features/breeds-comparison/FilterableBreedsList.jsx - BASADO EN EL ORIGINAL FUNCIONAL
import React, { useState, useEffect, useMemo } from 'react';

const FilterableBreedsList = ({ 
  initialBreeds = [], 
  children, 
  onFilterChange,
  activeFilters = {},
  selectedBreeds = [],
  onBreedSelect 
}) => {
  const [breeds, setBreeds] = useState(initialBreeds || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    type: [],
    size: [],
    energyLevel: [],
    furLength: [],
    hypoallergenic: null,
    goodWith: [],
    experience: [],
    apartmentFriendly: null,
    ...activeFilters
  });
  
  const BREEDS_PER_PAGE = 20;

  // 🔧 DEBUG: Log para verificar datos
  useEffect(() => {
    console.log('🐕 FilterableBreedsList - Initial breeds:', initialBreeds?.length);
  }, [initialBreeds]);

  // Efecto para actualizar las razas cuando cambien las props
  useEffect(() => {
    if (initialBreeds && initialBreeds.length > 0) {
      setBreeds(initialBreeds);
      console.log('✅ Breeds updated:', initialBreeds.length);
    }
  }, [initialBreeds]);

  // 🔧 LÓGICA DE FILTRADO SIMPLIFICADA
  const filteredAndSearchedBreeds = useMemo(() => {
    if (!breeds || breeds.length === 0) {
      console.log('❌ No breeds to filter');
      return [];
    }
    
    let results = [...breeds];
    console.log('🚀 Starting filter with', results.length, 'breeds');

    // 1. APLICAR BÚSQUEDA POR TEXTO
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      results = results.filter(breed => {
        const nameMatch = breed.name?.toLowerCase().includes(searchLower);
        const typeMatch = breed.type?.toLowerCase().includes(searchLower);
        const sizeMatch = breed.size?.toLowerCase().includes(searchLower);
        
        return nameMatch || typeMatch || sizeMatch;
      });
    }
    
    // 2. FILTRO POR TIPO (perro/gato)
    if (localFilters.type && localFilters.type.length > 0) {
      results = results.filter(breed => {
        return localFilters.type.includes(breed.type);
      });
    }
    
    // 3. FILTRO POR TAMAÑO
    if (localFilters.size && localFilters.size.length > 0) {
      results = results.filter(breed => {
        return localFilters.size.includes(breed.size);
      });
    }
    
    // 4. FILTRO POR NIVEL DE ENERGÍA
    if (localFilters.energyLevel && localFilters.energyLevel.length > 0) {
      results = results.filter(breed => {
        const energy = parseInt(breed.energyLevel) || 0;
        let energyCategory;
        
        if (energy <= 2) energyCategory = 'low';
        else if (energy <= 3) energyCategory = 'medium'; 
        else energyCategory = 'high';
        
        return localFilters.energyLevel.includes(energyCategory);
      });
    }
    
    // 5. FILTRO POR TIPO DE PELO
    if (localFilters.furLength && localFilters.furLength.length > 0) {
      results = results.filter(breed => {
        // Si el breed tiene furLength, usarlo directamente
        if (breed.furLength) {
          return localFilters.furLength.includes(breed.furLength);
        }
        
        // Si no, inferir del grooming level (lógica de fallback)
        const grooming = parseInt(breed.grooming) || 0;
        let furType;
        
        if (grooming <= 2) furType = 'short';
        else if (grooming <= 3) furType = 'medium';
        else furType = 'long';
        
        return localFilters.furLength.includes(furType);
      });
    }
    
    // 6. FILTRO HIPOALERGÉNICO
    if (localFilters.hypoallergenic !== null && localFilters.hypoallergenic !== undefined) {
      results = results.filter(breed => {
        return breed.hypoallergenic === localFilters.hypoallergenic;
      });
    }
    
    console.log('✅ Final filtered results:', results.length, 'breeds');
    return results;
  }, [breeds, searchTerm, localFilters]);

  // Reset página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSearchedBreeds]);

  // Obtener razas de la página actual
  const getPaginatedBreeds = () => {
    const startIndex = (currentPage - 1) * BREEDS_PER_PAGE;
    const endIndex = startIndex + BREEDS_PER_PAGE;
    return filteredAndSearchedBreeds.slice(startIndex, endIndex);
  };

  // Calcular total de páginas
  const getTotalPages = () => {
    return Math.ceil(filteredAndSearchedBreeds.length / BREEDS_PER_PAGE);
  };

  // Manejar búsqueda por texto
  const handleSearch = (newSearchTerm) => {
    console.log('🔍 Search term changed:', newSearchTerm);
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  // Renderizar tarjeta de raza
  const renderBreedCard = (breed) => {
    const isSelected = selectedBreeds.some(selected => selected.id === breed.id);
    
    if (typeof children === 'function') {
      return (
        <div 
          key={`${breed.id}-${isSelected ? 'selected' : 'unselected'}`}
          data-breed-id={breed.id}
          className="breed-card-wrapper"
        >
          {children(breed, isSelected)}
        </div>
      );
    }
    
    return children;
  };

  return (
    <div className="space-y-6">
      {/* Controles básicos de filtrado */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filtros y búsqueda
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar raza
            </label>
            <input
              type="text"
              placeholder="Nombre de la raza..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de mascota
            </label>
            <select
              value={localFilters.type.length > 0 ? localFilters.type[0] : 'all'}
              onChange={(e) => {
                const newType = e.target.value === 'all' ? [] : [e.target.value];
                setLocalFilters(prev => ({ ...prev, type: newType }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="dog">🐕 Perros</option>
              <option value="cat">🐱 Gatos</option>
            </select>
          </div>

          {/* Filtro por tamaño */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño
            </label>
            <select
              value={localFilters.size.length > 0 ? localFilters.size[0] : 'all'}
              onChange={(e) => {
                const newSize = e.target.value === 'all' ? [] : [e.target.value];
                setLocalFilters(prev => ({ ...prev, size: newSize }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los tamaños</option>
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
          </div>

          {/* Filtro por nivel de energía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de energía
            </label>
            <select
              value={localFilters.energyLevel.length > 0 ? localFilters.energyLevel[0] : 'all'}
              onChange={(e) => {
                const newEnergy = e.target.value === 'all' ? [] : [e.target.value];
                setLocalFilters(prev => ({ ...prev, energyLevel: newEnergy }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los niveles</option>
              <option value="low">⚡ Baja energía</option>
              <option value="medium">⚡⚡ Energía moderada</option>
              <option value="high">⚡⚡⚡ Alta energía</option>
            </select>
          </div>

          {/* Filtro por tipo de pelo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de pelo
            </label>
            <select
              value={localFilters.furLength.length > 0 ? localFilters.furLength[0] : 'all'}
              onChange={(e) => {
                const newFur = e.target.value === 'all' ? [] : [e.target.value];
                setLocalFilters(prev => ({ ...prev, furLength: newFur }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="short">✂️ Pelo corto</option>
              <option value="medium">✂️ Pelo medio</option>
              <option value="long">✂️ Pelo largo</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hipoalergénico
            </label>
            <select
              value={localFilters.hypoallergenic === null ? 'all' : localFilters.hypoallergenic.toString()}
              onChange={(e) => {
                const value = e.target.value === 'all' ? null : e.target.value === 'true';
                setLocalFilters(prev => ({ ...prev, hypoallergenic: value }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="true">🌿 Solo hipoalergénicos</option>
              <option value="false">❌ No hipoalergénicos</option>
            </select>
          </div>
        </div>

        {/* Segunda fila de filtros - Características especiales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
          {/* Filtro hipoalergénico */}
         

          {/* Estadísticas de filtros activos */}
          <div className="md:col-span-2 flex items-end">
            <div className="text-sm text-gray-500">
              {Object.values(localFilters).some(filter => 
                (Array.isArray(filter) && filter.length > 0) || 
                (filter !== null && filter !== undefined && !Array.isArray(filter))
              ) && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {[
                    ...localFilters.type,
                    ...localFilters.size,
                    ...localFilters.energyLevel,
                    ...localFilters.furLength,
                    ...(localFilters.hypoallergenic !== null ? ['hipoalergénico'] : [])
                  ].length} filtros activos
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Resultados de búsqueda */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredAndSearchedBreeds.length} raza{filteredAndSearchedBreeds.length !== 1 ? 's' : ''} encontrada{filteredAndSearchedBreeds.length !== 1 ? 's' : ''}
          </p>
          
          {/* Botón para limpiar filtros */}
          {(searchTerm || localFilters.type.length > 0 || localFilters.size.length > 0 || 
            localFilters.energyLevel.length > 0 || localFilters.furLength.length > 0 || 
            localFilters.hypoallergenic !== null) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setLocalFilters(prev => ({ 
                  ...prev, 
                  type: [], 
                  size: [], 
                  energyLevel: [], 
                  furLength: [], 
                  hypoallergenic: null 
                }));
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de razas */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div>
            {/* Header con información */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">
                  Mostrando {Math.min(BREEDS_PER_PAGE, filteredAndSearchedBreeds.length - ((currentPage - 1) * BREEDS_PER_PAGE))} de {filteredAndSearchedBreeds.length} razas
                </p>
                <p className="text-xs text-gray-500">
                  Página {currentPage} de {getTotalPages() || 1}
                </p>
                {selectedBreeds.length > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    {selectedBreeds.length}/3 razas seleccionadas para comparar
                  </p>
                )}
              </div>
            </div>
            
            {filteredAndSearchedBreeds.length > 0 ? (
              <>
                {/* Renderizar razas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {getPaginatedBreeds().map(breed => renderBreedCard(breed))}
                </div>

                {/* Paginación simple */}
                {getTotalPages() > 1 && (
                  <div className="flex justify-center items-center space-x-4 py-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Anterior
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      Página {currentPage} de {getTotalPages()}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                      disabled={currentPage === getTotalPages()}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron razas
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 
                    `No hay razas que coincidan con "${searchTerm}" y los filtros aplicados.` :
                    'No hay razas que coincidan con los filtros aplicados.'
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setLocalFilters(prev => ({ 
                      ...prev, 
                      type: [], 
                      size: [], 
                      energyLevel: [], 
                      furLength: [], 
                      hypoallergenic: null 
                    }));
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterableBreedsList;