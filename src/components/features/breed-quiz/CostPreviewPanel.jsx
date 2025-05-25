import React, { useState, useEffect } from 'react';
import { generateCostPreview, getFeedingContextByPetType } from '../../../utils/quizHelpers';

const CostPreviewPanel = ({ answers, currentQuestionId }) => {
  const [costPreview, setCostPreview] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Solo mostrar preview si tenemos respuestas clave
    if (answers.petTypePreference && answers.budgetLevel) {
      const preview = generateCostPreview(answers);
      setCostPreview(preview);
    } else {
      setCostPreview(null);
    }
  }, [answers]);

  // No mostrar si no hay datos suficientes
  if (!costPreview) return null;

  const petType = answers.petTypePreference;
  const feedingContext = getFeedingContextByPetType(petType);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-blue-900 flex items-center">
          💰 Vista previa de costos
          {petType === 'dog' && '🐕'}
          {petType === 'cat' && '🐱'}
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
        </button>
      </div>

      <div className="space-y-3">
        {/* Rango de costo estimado */}
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Costo mensual estimado:</span>
            <span className="text-xl font-bold text-blue-600">
              {costPreview.estimatedMonthlyRange}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Basado en {petType === 'dog' ? 'perro' : petType === 'cat' ? 'gato' : 'tu selección'} 
            {answers.sizePreference && answers.sizePreference !== 'any' && petType === 'dog' 
              ? ` ${answers.sizePreference === 'small' ? 'pequeño' : 
                   answers.sizePreference === 'medium' ? 'mediano' : 'grande'}` 
              : ''}
          </p>
        </div>

        {/* Alimentación destacada */}
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium flex items-center">
              🍖 Solo alimentación:
            </span>
            <span className="font-bold text-green-600">
              {costPreview.feedingCost}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {feedingContext.context}
          </p>
        </div>

        {/* Advertencias importantes */}
        {costPreview.warnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            {costPreview.warnings.map((warning, index) => (
              <p key={index} className="text-yellow-800 text-sm flex items-start">
                <span className="mr-2">⚠️</span>
                {warning}
              </p>
            ))}
          </div>
        )}

        {/* Detalles expandibles */}
        {showDetails && (
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <h4 className="font-medium text-gray-800 mb-2">📊 Desglose detallado:</h4>
            <div className="space-y-1">
              {costPreview.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 Los costos varían según la raza específica, ciudad, y calidad de servicios. 
                Esta es una estimación general basada en tus respuestas.
              </p>
            </div>
          </div>
        )}

        {/* Consejo contextual según la pregunta actual */}
        {currentQuestionId === 'feedingPreference' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">
              💡 <strong>Consejo:</strong> La diferencia entre comida estándar y premium puede ser significativa. 
              {petType === 'cat' 
                ? ' Para gatos, la premium cuesta aprox. $60k vs $32k de la estándar.'
                : ' Para perros, puede variar desde $60k hasta $280k según el tamaño.'
              }
            </p>
          </div>
        )}

        {currentQuestionId === 'sizePreference' && petType === 'dog' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              🐕 <strong>Impacto del tamaño:</strong> Los perros grandes pueden costar hasta 2x más que los pequeños 
              en alimentación, accesorios y algunos tratamientos veterinarios.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal del cuestionario con vista previa de costos integrada
const EnhancedQuizWithCostPreview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCostPreview, setShowCostPreview] = useState(false);

  // Preguntas simuladas (normalmente vendrían de props)
  const questions = [
    {
      id: 'petTypePreference',
      text: '¿Qué tipo de mascota prefieres?',
      options: [
        { value: 'dog', text: '🐕 Perro' },
        { value: 'cat', text: '🐱 Gato' },
        { value: 'any', text: '🤷‍♂️ Cualquiera' }
      ]
    },
    {
      id: 'sizePreference',
      text: '¿Qué tamaño prefieres?',
      options: [
        { value: 'small', text: '🐕‍🦺 Pequeño' },
        { value: 'medium', text: '🐕 Mediano' },
        { value: 'large', text: '🐕‍🦮 Grande' }
      ]
    },
    {
      id: 'budgetLevel',
      text: '¿Cuál es tu presupuesto mensual?',
      options: [
        { value: '1', text: '💰 Muy bajo (menos de $200k)' },
        { value: '2', text: '💵 Bajo ($200k-400k)' },
        { value: '3', text: '💶 Moderado ($400k-700k)' },
        { value: '4', text: '💷 Alto ($700k-1.2M)' },
        { value: '5', text: '💸 Muy alto (más de $1.2M)' }
      ]
    },
    {
      id: 'feedingPreference',
      text: '¿Qué tipo de alimentación prefieres?',
      options: [
        { value: 'normal', text: '🥘 Estándar' },
        { value: 'premium', text: '⭐ Premium' },
        { value: 'flexible', text: '🤷‍♀️ Flexible' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Mostrar vista previa de costos después de responder presupuesto
    if (questionId === 'budgetLevel' || questionId === 'petTypePreference') {
      setShowCostPreview(true);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header del cuestionario */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">🎯 Encuentra tu mascota ideal</h1>
          <div className="flex justify-between items-center">
            <span className="text-blue-100">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% completado
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6">
          {/* Vista previa de costos (si está habilitada) */}
          {showCostPreview && (
            <CostPreviewPanel 
              answers={answers} 
              currentQuestionId={currentQ.id}
            />
          )}

          {/* Pregunta actual */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {currentQ.text}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[currentQ.id] === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                {questions.length - currentQuestion - 1} preguntas restantes
              </p>
            </div>

            <button
              onClick={() => {
                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion(currentQuestion + 1);
                } else {
                  alert('¡Cuestionario completado! Generando recomendaciones...');
                }
              }}
              disabled={!answers[currentQ.id]}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Panel informativo lateral */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          💡 ¿Por qué importan los costos?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-gray-700 mb-2">🏥 Costos veterinarios</h4>
            <p className="text-gray-600">
              Razas con predisposición a problemas de salud pueden costar 40-60% más en cuidados médicos.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-gray-700 mb-2">🍖 Alimentación</h4>
            <p className="text-gray-600">
              La diferencia entre comida estándar y premium puede ser de $100k+ mensual, especialmente en perros grandes.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-gray-700 mb-2">💅 Grooming</h4>
            <p className="text-gray-600">
              Razas de pelo largo pueden necesitar grooming profesional cada 4-6 semanas ($80k-150k).
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-gray-700 mb-2">🧸 Accesorios</h4>
            <p className="text-gray-600">
              Perros grandes necesitan correas más fuertes, camas más grandes, juguetes resistentes, etc.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>💰 Consejo financiero:</strong> El costo inicial de adopción es solo el 5-10% del gasto total. 
            Una mascota puede costar entre $2M-8M COP durante toda su vida (10-15 años).
          </p>
        </div>
      </div>

      {/* Simulación de respuestas actuales */}
      {Object.keys(answers).length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            📋 Tus respuestas hasta ahora
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(answers).map(([key, value]) => {
              const question = questions.find(q => q.id === key);
              const option = question?.options.find(o => o.value === value);
              
              return (
                <div key={key} className="border-l-4 border-blue-400 pl-4">
                  <p className="text-sm text-gray-600">{question?.text}</p>
                  <p className="font-medium text-gray-800">{option?.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de demostración de costos comparativos
const CostComparisonDemo = () => {
  const [selectedPetType, setSelectedPetType] = useState('dog');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedFoodType, setSelectedFoodType] = useState('standard');

  // Datos simulados de costos
  const getCostData = () => {
    if (selectedPetType === 'cat') {
      return {
        food: selectedFoodType === 'premium' ? 60000 : 32500,
        veterinary: 70000,
        accessories: 40000,
        grooming: 30000,
        total: 0
      };
    } else {
      const baseCosts = {
        small: { 
          food: selectedFoodType === 'premium' ? 120000 : 70000,
          veterinary: 80000, 
          accessories: 50000, 
          grooming: 60000 
        },
        medium: { 
          food: selectedFoodType === 'premium' ? 200000 : 100000,
          veterinary: 100000, 
          accessories: 60000, 
          grooming: 80000 
        },
        large: { 
          food: selectedFoodType === 'premium' ? 280000 : 150000,
          veterinary: 120000, 
          accessories: 80000, 
          grooming: 100000 
        }
      };
      return baseCosts[selectedSize];
    }
  };

  const costs = getCostData();
  costs.total = Object.values(costs).reduce((sum, cost) => sum + cost, 0) - costs.total;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        🧮 Calculadora de costos interactiva
      </h3>
      
      {/* Controles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de mascota
          </label>
          <select 
            value={selectedPetType}
            onChange={(e) => setSelectedPetType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="dog">🐕 Perro</option>
            <option value="cat">🐱 Gato</option>
          </select>
        </div>
        
        {selectedPetType === 'dog' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño
            </label>
            <select 
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de comida
          </label>
          <select 
            value={selectedFoodType}
            onChange={(e) => setSelectedFoodType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="standard">Estándar</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>
      
      {/* Resultados */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-bold text-gray-800 mb-4">
          💰 Costo mensual estimado: {formatCurrency(costs.total)}
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">🍖</div>
            <div className="text-sm text-gray-600">Alimentación</div>
            <div className="font-bold">{formatCurrency(costs.food)}</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">🏥</div>
            <div className="text-sm text-gray-600">Veterinario</div>
            <div className="font-bold">{formatCurrency(costs.veterinary)}</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">🧸</div>
            <div className="text-sm text-gray-600">Accesorios</div>
            <div className="font-bold">{formatCurrency(costs.accessories)}</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">💅</div>
            <div className="text-sm text-gray-600">Grooming</div>
            <div className="font-bold">{formatCurrency(costs.grooming)}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Costo anual:</span>
            <span className="text-lg font-bold text-blue-600">
              {formatCurrency(costs.total * 12)}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Costo de por vida (12 años promedio):</span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(costs.total * 12 * 12)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <EnhancedQuizWithCostPreview />
      <CostComparisonDemo />
    </div>
  );
}