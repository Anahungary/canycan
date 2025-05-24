import React from 'react';

const QuizQuestion = ({ question, onAnswer, currentAnswer }) => {
  // Renderizar diferente según el tipo de pregunta
  if (question.type === 'single') {
    return (
      <div className="quiz-question">
        <h3 className="text-xl font-bold mb-4">{question.text}</h3>
        
        <div className="space-y-2">
          {question.options.map(option => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                currentAnswer === option.value
                  ? 'border-[#AFC2D5] bg-[#AFC2D5] bg-opacity-10 text-[#AFC2D5]'
                  : 'border-gray-200 hover:border-[#AFC2D5] hover:bg-gray-50'
              }`}
              onClick={() => onAnswer(question.id, option.value)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  if (question.type === 'multiple') {
    // Asegurarse de que currentAnswer sea un array
    const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
    
    return (
      <div className="quiz-question">
        <h3 className="text-xl font-bold mb-4">{question.text}</h3>
        <p className="text-gray-600 mb-4">Puedes seleccionar varias opciones</p>
        
        <div className="space-y-2">
          {question.options.map(option => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                selectedValues.includes(option.value)
                  ? 'border-[#AFC2D5] bg-[#AFC2D5] bg-opacity-10 text-[#AFC2D5]'
                  : 'border-gray-200 hover:border-[#AFC2D5] hover:bg-gray-50'
              }`}
              onClick={() => {
                let newValues;
                if (selectedValues.includes(option.value)) {
                  newValues = selectedValues.filter(val => val !== option.value);
                } else {
                  newValues = [...selectedValues, option.value];
                }
                onAnswer(question.id, newValues);
              }}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded border flex-shrink-0 mr-3 flex items-center justify-center ${
                  selectedValues.includes(option.value)
                    ? 'border-[#AFC2D5] bg-[#AFC2D5] text-white'
                    : 'border-gray-300'
                }`}>
                  {selectedValues.includes(option.value) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {option.text}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  if (question.type === 'scale') {
    return (
      <div className="quiz-question">
        <h3 className="text-xl font-bold mb-4">{question.text}</h3>
        
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">{question.options[0]?.text || 'Bajo'}</span>
            <span className="text-sm text-gray-500">{question.options[question.options.length - 1]?.text || 'Alto'}</span>
          </div>
          
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                className={`flex-1 py-3 rounded-lg text-center transition-colors ${
                  parseInt(currentAnswer) === value
                    ? 'bg-[#AFC2D5] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => onAnswer(question.id, value.toString())}
              >
                {value}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Mínimo</span>
            <span className="text-xs text-gray-500">Máximo</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Por defecto, devolver un mensaje de error
  return <div>Tipo de pregunta no soportado: {question.type}</div>;
};


export default QuizQuestion;