/**
 * @typedef {Object} BreedCardProps
 * @property {string} id
 * @property {string} name
 * @property {string} image
 * @property {'small'|'medium'|'large'} size
 * @property {number} energyLevel
 * @property {number} friendliness
 * @property {number} grooming
 * @property {number} [training]
 * @property {'dog'|'cat'} type
 * @property {string[]} [goodWith]
 * @property {boolean} hypoallergenic
 * @property {boolean} [featured]
 */

import React from 'react';
import PropTypes from 'prop-types';

const sizeMap = {
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande'
};

const typeColor = {
  dog: 'bg-[#AFC2D5]',
  cat: 'bg-[#F6B89E]'
};

const renderRating = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? 'text-amber-500' : 'text-gray-300'}>
      {i < rating ? '★' : '☆'}
    </span>
  ));
};

/**
 * @param {BreedCardProps} props
 */
function BreedCard({
  id,
  name,
  image,
  size,
  energyLevel,
  friendliness,
  grooming,
  training,
  type,
  goodWith = [],
  hypoallergenic,
  featured = false
}) {
  return (
    <div className={`relative rounded-lg overflow-hidden border ${featured ? 'border-[#AFC2D5]' : 'border-gray-200'} bg-white transition-all duration-300 hover:shadow-md`}>
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-[#AFC2D5] text-white text-xs px-2 py-1 rounded-full">Destacado</span>
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`${name} - raza de ${type === 'dog' ? 'perro' : 'gato'}`}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 left-3 ${typeColor[type]} text-white text-xs px-2 py-1 rounded-full`}>
          {type === 'dog' ? 'Perro' : 'Gato'}
        </div>
      </div>

      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-bold text-[#2E2E2E] mb-2 leading-snug">{name}</h3>

        <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <span className="text-gray-600">Tamaño:</span>
            <span className="font-medium"> {sizeMap[size]}</span>
          </div>
          <div>
            <span className="text-gray-600">Energía:</span>
            <span className="font-medium"> {renderRating(energyLevel)}</span>
          </div>
          <div>
            <span className="text-gray-600">Sociabilidad:</span>
            <span className="font-medium"> {renderRating(friendliness)}</span>
          </div>
          <div>
            <span className="text-gray-600">Cuidados:</span>
            <span className="font-medium"> {renderRating(grooming)}</span>
          </div>
        </div>

        <div className="mb-2 text-sm">
          <span className="text-gray-600">Hipoalergénico:</span>
          <span className="font-medium"> {hypoallergenic ? 'Sí' : 'No'}</span>
        </div>

        {goodWith.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Ideal para:</p>
            <div className="flex flex-wrap gap-1">
              {goodWith.map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-1 text-xs bg-[#C8D6B9] text-[#5A7251] rounded-full"
                >
                  {trait === 'children' ? 'Niños' :
                   trait === 'dogs' ? 'Perros' :
                   trait === 'cats' ? 'Gatos' :
                   trait === 'seniors' ? 'Adultos mayores' :
                   trait === 'apartments' ? 'Apartamentos' : trait}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-auto">
          <a href={`/razas/${id}`} className="text-sm font-medium text-white bg-[#AFC2D5] hover:bg-[#9DB3C6] px-3 py-1 rounded-md">
            Ver detalles
          </a>
          <a href={`/comparador-razas?add=${id}`} className="text-sm font-medium border border-[#AFC2D5] text-[#AFC2D5] hover:bg-[#f1f5f9] px-3 py-1 rounded-md">
            Comparar
          </a>
        </div>
      </div>
    </div>
  );
}

BreedCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
  energyLevel: PropTypes.number.isRequired,
  friendliness: PropTypes.number.isRequired,
  grooming: PropTypes.number.isRequired,
  training: PropTypes.number,
  type: PropTypes.oneOf(['dog', 'cat']).isRequired,
  goodWith: PropTypes.arrayOf(PropTypes.string),
  hypoallergenic: PropTypes.bool.isRequired,
  featured: PropTypes.bool
};

BreedCard.defaultProps = {
  goodWith: [],
  featured: false
};

export default BreedCard;
