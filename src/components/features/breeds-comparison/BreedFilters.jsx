// src/components/features/breeds-comparison/BreedFilters.jsx
import React, { useState } from 'react';

const BreedFilters = ({ onFilterChange, activeFilters }) => {
  // Estado local para los filtros
  const [filters, setFilters] = useState(activeFilters || {
    type: [],
    size: [],
    energyLevel: [],
    goodWith: [],
    experience: [],
    apartmentFriendly: null,
    hypoallergenic: null
  });

  // Manejar cambios en los filtros
  const handleFilterChange = (category, value) => {
    let updatedFilters = { ...filters };
    
    // Para filtros de tipo array (selección múltiple)
    if (Array.isArray(updatedFilters[category])) {
      if (updatedFilters[category].includes(value)) {
        // Remover el valor si ya está seleccionado
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        // Agregar el valor si no está seleccionado
        updatedFilters[category] = [...updatedFilters[category], value];
      }
    } 
    // Para filtros de tipo booleano
    else if (typeof updatedFilters[category] === 'boolean' || updatedFilters[category] === null) {
      // Toggle entre true, false y null (sin filtro)
      if (updatedFilters[category] === true) {
        updatedFilters[category] = false;
      } else if (updatedFilters[category] === false) {
        updatedFilters[category] = null;
      } else {
        updatedFilters[category] = true;
      }
    }
    // Para cualquier otro tipo de filtro
    else {
      updatedFilters[category] = value;
    }
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    const resetFilters = {
      type: [],
      size: [],
      energyLevel: [],
      goodWith: [],
      experience: [],
      apartmentFriendly: null,
      hypoallergenic: null
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Verificar si algún filtro está activo
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (value === null) return false;
      return true;
    });
  };

  // Renderizar estado de filtro
  const renderFilterState = (category, value) => {
    if (Array.isArray(filters[category])) {
      return filters[category].includes(value) ? 'bg-[#AFC2D5] text-white' : 'bg-gray-100 text-gray-700';
    }
    
    if (category === 'apartmentFriendly' || category === 'hypoallergenic') {
      if (filters[category] === null) return 'bg-gray-100 text-gray-700';
      return filters[category] === value ? 'bg-[#AFC2D5] text-white' : 'bg-gray-100 text-gray-700';
    }
    
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#2E2E2E]">Filtros</h2>
        {hasActiveFilters() && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-[#AFC2D5] hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filtro por tipo de mascota */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo de mascota</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilterChange('type', 'dog')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('type', 'dog')}`}
          >
            Perros
          </button>
          <button
            onClick={() => handleFilterChange('type', 'cat')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('type', 'cat')}`}
          >
            Gatos
          </button>
        </div>
      </div>

      {/* Filtro por tamaño */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tamaño</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('size', 'small')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('size', 'small')}`}
          >
            Pequeño
          </button>
          <button
            onClick={() => handleFilterChange('size', 'medium')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('size', 'medium')}`}
          >
            Mediano
          </button>
          <button
            onClick={() => handleFilterChange('size', 'large')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('size', 'large')}`}
          >
            Grande
          </button>
        </div>
      </div>

      {/* Filtro por nivel de energía */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Nivel de energía</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('energyLevel', 'low')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('energyLevel', 'low')}`}
          >
            Bajo
          </button>
          <button
            onClick={() => handleFilterChange('energyLevel', 'medium')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('energyLevel', 'medium')}`}
          >
            Medio
          </button>
          <button
            onClick={() => handleFilterChange('energyLevel', 'high')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('energyLevel', 'high')}`}
          >
            Alto
          </button>
        </div>
      </div>

      {/* Filtro por buena convivencia */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Buena convivencia con</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('goodWith', 'children')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('goodWith', 'children')}`}
          >
            Niños
          </button>
          <button
            onClick={() => handleFilterChange('goodWith', 'dogs')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('goodWith', 'dogs')}`}
          >
            Perros
          </button>
          <button
            onClick={() => handleFilterChange('goodWith', 'cats')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('goodWith', 'cats')}`}
          >
            Gatos
          </button>
          <button
            onClick={() => handleFilterChange('goodWith', 'seniors')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('goodWith', 'seniors')}`}
          >
            Adultos mayores
          </button>
        </div>
      </div>

      {/* Filtro por nivel de experiencia requerida */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Experiencia del dueño</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('experience', 'beginner')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('experience', 'beginner')}`}
          >
            Principiante
          </button>
          <button
            onClick={() => handleFilterChange('experience', 'intermediate')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('experience', 'intermediate')}`}
          >
            Intermedio
          </button>
          <button
            onClick={() => handleFilterChange('experience', 'advanced')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${renderFilterState('experience', 'advanced')}`}
          >
            Avanzado
          </button>
        </div>
      </div>

      {/* Filtros adicionales - CORREGIDO A COLUMNAS */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Características adicionales</h3>
        
        {/* Apartamento - EN COLUMNA */}
        <div>
          <p className="text-xs text-gray-600 mb-2">Espacio requerido</p>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange('apartmentFriendly', true)}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                filters.apartmentFriendly === true ? 'bg-[#AFC2D5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏠 Apto para apartamento
            </button>
            <button
              onClick={() => handleFilterChange('apartmentFriendly', false)}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                filters.apartmentFriendly === false ? 'bg-[#AFC2D5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏡 Necesita espacio amplio
            </button>
          </div>
        </div>
        
        {/* Hipoalergénico - EN COLUMNA */}
        <div>
          <p className="text-xs text-gray-600 mb-2">Alergias</p>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange('hypoallergenic', true)}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                filters.hypoallergenic === true ? 'bg-[#AFC2D5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Hipoalergénico
            </button>
            <button
              onClick={() => handleFilterChange('hypoallergenic', false)}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                filters.hypoallergenic === false ? 'bg-[#AFC2D5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ❌ No hipoalergénico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedFilters;