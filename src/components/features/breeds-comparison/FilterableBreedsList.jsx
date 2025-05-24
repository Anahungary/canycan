// src/components/features/breeds-comparison/FilterableBreedsList.jsx - VERSIÓN CORREGIDA CON FILTROS FUNCIONANDO
import React, { useState, useEffect, useMemo } from 'react';
import BreedFilters from './BreedFilters.jsx';

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
    goodWith: [],
    experience: [],
    apartmentFriendly: null,
    hypoallergenic: null,
    ...activeFilters
  });
  
  const BREEDS_PER_PAGE = 20;

  // 🔧 DEBUG: Log para verificar datos
  useEffect(() => {
    console.log('🐕 Initial breeds:', initialBreeds?.length, initialBreeds?.slice(0, 2));
    console.log('🔍 Active filters:', localFilters);
  }, [initialBreeds, localFilters]);

  // Efecto para actualizar las razas cuando cambien las props
  useEffect(() => {
    if (initialBreeds && initialBreeds.length > 0) {
      setBreeds(initialBreeds);
      console.log('✅ Breeds updated:', initialBreeds.length);
    }
  }, [initialBreeds]);

  // 🔧 LÓGICA DE FILTRADO MEJORADA
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
      console.log('🔍 After search:', results.length, 'breeds');
    }
    
    // 2. FILTRO POR TIPO (perro/gato)
    if (localFilters.type && localFilters.type.length > 0) {
      results = results.filter(breed => {
        const match = localFilters.type.includes(breed.type);
        return match;
      });
      console.log('🐕 After type filter:', results.length, 'breeds');
    }
    
    // 3. FILTRO POR TAMAÑO
    if (localFilters.size && localFilters.size.length > 0) {
      results = results.filter(breed => {
        const match = localFilters.size.includes(breed.size);
        return match;
      });
      console.log('📏 After size filter:', results.length, 'breeds');
    }
    
    // 4. FILTRO POR NIVEL DE ENERGÍA
    if (localFilters.energyLevel && localFilters.energyLevel.length > 0) {
      results = results.filter(breed => {
        const energy = parseInt(breed.energyLevel) || 0;
        let energyCategory;
        
        if (energy <= 2) energyCategory = 'low';
        else if (energy <= 3) energyCategory = 'medium'; 
        else energyCategory = 'high';
        
        const match = localFilters.energyLevel.includes(energyCategory);
        return match;
      });
      console.log('⚡ After energy filter:', results.length, 'breeds');
    }
    
    // 5. FILTRO POR "BUENO CON"
    if (localFilters.goodWith && localFilters.goodWith.length > 0) {
      results = results.filter(breed => {
        if (!breed.goodWith || !Array.isArray(breed.goodWith)) {
          return false;
        }
        
        // Verificar si la raza tiene TODOS los traits seleccionados
        const hasAllTraits = localFilters.goodWith.every(trait => 
          breed.goodWith.includes(trait)
        );
        
        return hasAllTraits;
      });
      console.log('👶 After goodWith filter:', results.length, 'breeds');
    }
    
    // 6. FILTRO POR EXPERIENCIA REQUERIDA
    if (localFilters.experience && localFilters.experience.length > 0) {
      results = results.filter(breed => {
        const training = parseInt(breed.training) || 0;
        let expCategory;
        
        if (training <= 2) expCategory = 'beginner';
        else if (training <= 3) expCategory = 'intermediate';
        else expCategory = 'advanced';
        
        const match = localFilters.experience.includes(expCategory);
        return match;
      });
      console.log('🎓 After experience filter:', results.length, 'breeds');
    }
    
    // 7. FILTRO APARTAMENTO FRIENDLY
    if (localFilters.apartmentFriendly !== null && localFilters.apartmentFriendly !== undefined) {
      results = results.filter(breed => {
        const isApartmentFriendly = 
          breed.size === 'small' || 
          (breed.size === 'medium' && parseInt(breed.energyLevel || 0) <= 3) ||
          (breed.goodWith && Array.isArray(breed.goodWith) && breed.goodWith.includes('apartments'));
        
        return localFilters.apartmentFriendly === isApartmentFriendly;
      });
      console.log('🏠 After apartment filter:', results.length, 'breeds');
    }
    
    // 8. FILTRO HIPOALERGÉNICO
    if (localFilters.hypoallergenic !== null && localFilters.hypoallergenic !== undefined) {
      results = results.filter(breed => {
        return breed.hypoallergenic === localFilters.hypoallergenic;
      });
      console.log('🤧 After hypoallergenic filter:', results.length, 'breeds');
    }
    
    console.log('✅ Final filtered results:', results.length, 'breeds');
    return results;
  }, [breeds, searchTerm, localFilters]);

  // Reset página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSearchedBreeds]);

  // 🔧 FUNCIÓN PARA APLICAR FILTROS CORREGIDA
  const applyFilters = (newFilters) => {
    console.log('🔄 Applying filters:', newFilters);
    setLocalFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // 🔧 FUNCIÓN PARA LIMPIAR FILTROS
  const clearAllFilters = () => {
    const emptyFilters = {
      type: [],
      size: [],
      energyLevel: [],
      goodWith: [],
      experience: [],
      apartmentFriendly: null,
      hypoallergenic: null
    };
    
    setLocalFilters(emptyFilters);
    setSearchTerm('');
    
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

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

  // 🔧 FUNCIÓN DE ORDENAMIENTO CORREGIDA
  const handleSort = (sortBy) => {
    console.log('📊 Sorting by:', sortBy);
    // La ordenación se maneja en el estado local, no modifica los filtros
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
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar con filtros */}
      <div className="w-full md:w-1/4 lg:w-1/5">
        <div className="sticky top-4">
          <BreedFilters 
            onFilterChange={applyFilters} 
            activeFilters={localFilters}
          />
          
          {/* 🔧 BOTÓN PARA LIMPIAR FILTROS */}
          <div className="mt-4">
            <button
              onClick={clearAllFilters}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      </div>
      
      {/* Lista de razas */}
      <div className="w-full md:w-3/4 lg:w-4/5">
        {/* Buscador */}
        <div className="mb-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar razas
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre, tipo o tamaño..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AFC2D5] focus:border-transparent"
            />
          </div>
        </div>



        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AFC2D5]"></div>
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
                  <p className="text-xs text-[#AFC2D5] font-medium">
                    {selectedBreeds.length}/3 razas seleccionadas para comparar
                  </p>
                )}
              </div>
            </div>
            
            {filteredAndSearchedBreeds.length > 0 ? (
              <>
                {/* Renderizar razas */}
                <div id="filtered-breeds-container">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {getPaginatedBreeds().map(breed => renderBreedCard(breed))}
                  </div>
                </div>

                {/* Paginación */}
                {getTotalPages() > 1 && (
                  <div className="flex justify-center items-center space-x-4 py-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Anterior
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: Math.min(5, getTotalPages()) }, (_, i) => {
                        const pageNum = Math.max(1, currentPage - 2) + i;
                        if (pageNum > getTotalPages()) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[#AFC2D5] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                      disabled={currentPage === getTotalPages()}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Siguiente
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
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
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#AFC2D5] hover:bg-[#9DB3C6] transition-colors"
                >
                  Limpiar filtros
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