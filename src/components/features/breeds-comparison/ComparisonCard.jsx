// src/components/features/breeds-comparison/ComparisonCard.jsx
import React from 'react';
import { useComparison } from '../../../contexts/ComparisonContext';

const ComparisonCard = ({ breed }) => {
  const { addBreed, removeBreed, isSelected, canAddMore } = useComparison();
  
  const selected = isSelected(breed.id);
  
  const handleToggleSelection = () => {
    if (selected) {
      removeBreed(breed.id);
    } else if (canAddMore) {
      addBreed(breed);
    }
  };

  const renderRating = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-amber-500' : 'text-gray-300'}>
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className={`relative rounded-lg overflow-hidden border transition-all duration-300 ${
      selected 
        ? 'border-[#AFC2D5] bg-[#AFC2D5] bg-opacity-10 shadow-md' 
        : 'border-gray-200 hover:shadow-md hover:border-[#AFC2D5]'
    } bg-white`}>
      
      {/* Badge de selección */}
      {selected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-[#AFC2D5] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Seleccionado
          </div>
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <img
          src={breed.image}
          alt={breed.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 left-3 ${breed.type === 'dog' ? 'bg-[#AFC2D5]' : 'bg-[#F6B89E]'} text-white text-xs px-2 py-1 rounded-full`}>
          {breed.type === 'dog' ? 'Perro' : 'Gato'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{breed.name}</h3>

        <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <span className="text-gray-600">Tamaño:</span>
            <span className="font-medium ml-1">
              {breed.size === 'small' ? 'Pequeño' : breed.size === 'medium' ? 'Mediano' : 'Grande'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Energía:</span>
            <div className="inline-flex ml-1">{renderRating(breed.energyLevel)}</div>
          </div>
          <div>
            <span className="text-gray-600">Sociabilidad:</span>
            <div className="inline-flex ml-1">{renderRating(breed.friendliness)}</div>
          </div>
          <div>
            <span className="text-gray-600">Cuidados:</span>
            <div className="inline-flex ml-1">{renderRating(breed.grooming)}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <a 
            href={`/razas/${breed.id}`} 
            className="text-sm font-medium text-[#AFC2D5] hover:underline"
          >
            Ver detalles
          </a>
          
          <button
            onClick={handleToggleSelection}
            disabled={!selected && !canAddMore}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selected
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : canAddMore
                  ? 'bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white'
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

export default ComparisonCard;