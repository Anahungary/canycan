// src/components/features/breeds-comparison/BreedsComparison.jsx
import React from 'react';
import { ComparisonProvider } from '../../../contexts/ComparisonContext';
import ComparisonCard from './ComparisonCard';
import ComparisonResults from './ComparisonResults';

const BreedsComparison = ({ breeds }) => {
  return (
    <ComparisonProvider>
      <div>
        <h2 className="text-2xl font-bold mb-6">Selecciona razas para comparar</h2>
        <p className="text-gray-600 mb-8">
          Haz clic en "Comparar" en hasta 3 razas que te interesen. Si completaste nuestro cuestionario, 
          te mostraremos cuáles son más compatibles con tu estilo de vida.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {breeds.map(breed => (
            <ComparisonCard key={breed.id} breed={breed} />
          ))}
        </div>
        
        <ComparisonResults />
      </div>
    </ComparisonProvider>
  );
};

export default BreedsComparison;