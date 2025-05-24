import React, { useState, useEffect } from 'react';
import QuizQuestion from './QuizQuestion';
import BreedRecommendationResult from './BreedRecommendationResult';
import EnhancedResultsDisplay from './EnhancedResultsDisplay'; // 🆕 Import nuevo componente
import { defaultQuizQuestions, collectUserResponses } from '../../../utils/quizHelpers';
import { getBreedRecommendations, calculateCompatibilityScore, identifyStrengths, identifyChallenges } from '../../../utils/breedMatcher';
import { breedsData } from '../../../data/breeds/index.js';

const BreedMatchQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizProgress, setQuizProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Estados para exploración y comparación
  const [showAllBreeds, setShowAllBreeds] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showComparator, setShowComparator] = useState(false);
  
  const BREEDS_PER_PAGE = 20;
  
  useEffect(() => {
    async function loadData() {
      try {
        console.log('🔄 Cargando datos del cuestionario...');
        setQuestions(defaultQuizQuestions);
        setBreeds(breedsData);
        console.log('✅ Datos cargados:', {
          questions: defaultQuizQuestions.length,
          breeds: breedsData.length
        });
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error loading quiz data:', error);
        setIsLoading(false);
        setQuestions(defaultQuizQuestions);
        setBreeds(breedsData);
      }
    }
    loadData();
  }, []);
  
  // ✅ LÓGICA CONDICIONAL: Obtener preguntas relevantes
  const getRelevantQuestions = () => {
  return questions.filter(question => {
    // Solo mostrar entrenamiento detallado si elige perros
    if (question.id === 'trainingWillingness' && answers['petTypePreference'] === 'cat') {
      return false; // Los gatos no necesitan entrenamiento formal
    }
    
    // Pregunta 6 (childrenAge): Solo mostrar si tiene niños
    if (question.id === 'childrenAge' && answers['hasChildren'] !== 'yes') {
      return false;
    }
    
    // Pregunta 8 (otherPets): Solo mostrar si tiene otras mascotas
    if (question.id === 'otherPets' && answers['hasOtherPets'] !== 'yes') {
      return false;
    }
    
    // Pregunta 16 (allergyLevel): Solo mostrar si hay alergias
    if (question.id === 'allergyLevel' && answers['allergies'] !== 'yes') {
      return false;
    }
    
    return true;
  });
};


  const relevantQuestions = getRelevantQuestions();
  
  useEffect(() => {
    if (relevantQuestions.length > 0) {
      const progress = ((currentQuestionIndex + 1) / relevantQuestions.length) * 100;
      setQuizProgress(progress);
    }
  }, [currentQuestionIndex, relevantQuestions.length]);
  
  const handleAnswer = (questionId, answer) => {
    console.log('📝 Respuesta:', { questionId, answer });
    
    const newAnswers = {
      ...answers,
      [questionId]: answer
    };
    
    // ✅ LIMPIAR RESPUESTAS CONDICIONALES cuando cambia una respuesta padre
    if (questionId === 'petTypePreference' && answer === 'cat') {
      // Si cambia a gatos, eliminar respuesta de nivel de actividad
      delete newAnswers['activityLevel'];
      // Asignar nivel de actividad por defecto para gatos
      newAnswers['activityLevel'] = 'moderate';
    }
    
    if (questionId === 'hasChildren' && answer !== 'yes') {
      // Si no tiene niños, eliminar respuesta de edad de niños
      delete newAnswers['childrenAge'];
      // Asignar valor por defecto
      newAnswers['childrenAge'] = 'no_children';
    }
    
    if (questionId === 'hasOtherPets' && answer !== 'yes') {
      // Si no tiene otras mascotas, eliminar tipo de mascotas
      delete newAnswers['otherPets'];
      // Asignar valor por defecto
      newAnswers['otherPets'] = 'no_pets';
    }
    
    if (questionId === 'allergies' && answer !== 'yes') {
      // Si no hay alergias, eliminar nivel de alergias
      delete newAnswers['allergyLevel'];
      // Asignar valor por defecto
      newAnswers['allergyLevel'] = 'no_allergies';
    }
    
    setAnswers(newAnswers);
  };
  
  const goToNextQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionIndex < relevantQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateResults();
      }
      setIsTransitioning(false);
    }, 300);
  };
  
  const goToPreviousQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
      setIsTransitioning(false);
    }, 300);
  };
  
  const calculateResults = () => {
    console.log('🧮 Calculando resultados...');
    setIsLoading(true);
    
    try {
      const profile = collectUserResponses(answers);
      console.log('👤 Perfil del usuario:', profile);
      
      const results = getBreedRecommendations(profile, breeds);
      console.log('🎯 Resultados calculados:', results);
      
      localStorage.setItem('userProfile', JSON.stringify(profile));
      console.log('💾 Perfil guardado en localStorage');
      
      setUserProfile(profile);
      setRecommendations(results);
      setShowAllBreeds(true);
    } catch (error) {
      console.error('❌ Error calculating recommendations:', error);
      alert('Ha ocurrido un error al calcular las recomendaciones. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setRecommendations(null);
    setUserProfile(null);
    setQuizProgress(0);
    setShowAllBreeds(false);
    setSelectedForComparison([]);
    setShowComparator(false);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Funciones para exploración de razas
  const getFilteredBreeds = () => {
    let filtered = breeds;
    
    if (searchTerm) {
      filtered = breeds.filter(breed => 
        breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.size.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getPaginatedBreeds = () => {
    const filtered = getFilteredBreeds();
    const startIndex = (currentPage - 1) * BREEDS_PER_PAGE;
    const endIndex = startIndex + BREEDS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredBreeds().length / BREEDS_PER_PAGE);
  };

  // Funciones para comparación
  const addToComparison = (breed) => {
    if (selectedForComparison.length < 3 && !selectedForComparison.find(b => b.id === breed.id)) {
      setSelectedForComparison(prev => [...prev, breed]);
    }
  };

  const removeFromComparison = (breedId) => {
    setSelectedForComparison(prev => prev.filter(breed => breed.id !== breedId));
  };

  const compareRecommended = () => {
    if (recommendations?.allRecommendations) {
      const topThree = recommendations.allRecommendations.slice(0, 3).map(rec => rec.breed);
      setSelectedForComparison(topThree);
      setShowComparator(true);
    }
  };

  const isSelectedForComparison = (breedId) => {
    return selectedForComparison.some(breed => breed.id === breedId);
  };

  // Renderizar análisis de comparación
  const renderComparisonAnalysis = () => {
    if (!userProfile || selectedForComparison.length === 0) return null;

    const analysisData = selectedForComparison.map(breed => {
      const compatibilityScore = calculateCompatibilityScore(breed, userProfile);
      const strengths = identifyStrengths(breed, userProfile);
      const challenges = identifyChallenges(breed, userProfile);
      
      return {
        breed,
        compatibilityScore,
        strengths,
        challenges,
        isHighCompatibility: compatibilityScore >= 70,
        isModerateCompatibility: compatibilityScore >= 50 && compatibilityScore < 70,
        isLowCompatibility: compatibilityScore < 50
      };
    });

    const highCompatibility = analysisData.filter(item => item.isHighCompatibility);
    const moderateCompatibility = analysisData.filter(item => item.isModerateCompatibility);
    const lowCompatibility = analysisData.filter(item => item.isLowCompatibility);

    return (
      <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#2E2E2E]">
            Análisis de Compatibilidad
          </h3>
          <button
            onClick={() => {
              setShowComparator(false);
              setSelectedForComparison([]);
            }}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Cerrar comparador
          </button>
        </div>

        {highCompatibility.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-green-700 mb-3 flex items-center">
              🎯 MÁS COMPATIBLES contigo (70%+)
            </h4>
            <div className="space-y-4">
              {highCompatibility.map(item => renderCompatibilityCard(item, 'high'))}
            </div>
          </div>
        )}

        {moderateCompatibility.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-yellow-700 mb-3 flex items-center">
              ⚠️ MODERADAMENTE COMPATIBLES (50-69%)
            </h4>
            <div className="space-y-4">
              {moderateCompatibility.map(item => renderCompatibilityCard(item, 'moderate'))}
            </div>
          </div>
        )}

        {lowCompatibility.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-red-700 mb-3 flex items-center">
              ❌ REQUIEREN CONSIDERACIÓN ESPECIAL (menos del 50%)
            </h4>
            <div className="space-y-4">
              {lowCompatibility.map(item => renderCompatibilityCard(item, 'low'))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCompatibilityCard = (item, type) => {
    const { breed, compatibilityScore, strengths, challenges } = item;
    
    const getCompatibilityColor = () => {
      if (type === 'high') return 'bg-green-50 border-green-200';
      if (type === 'moderate') return 'bg-yellow-50 border-yellow-200';
      return 'bg-red-50 border-red-200';
    };

    const getScoreColor = () => {
      if (compatibilityScore >= 70) return 'text-green-600';
      if (compatibilityScore >= 50) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <div key={breed.id} className={`rounded-lg border p-4 ${getCompatibilityColor()}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <img 
              src={breed.image} 
              alt={breed.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h4 className="font-bold text-lg">{breed.name}</h4>
              <p className="text-sm text-gray-600">
                Compatibilidad: <span className={`font-bold ${getScoreColor()}`}>{compatibilityScore}%</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => removeFromComparison(breed.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {strengths.length > 0 && (
            <div>
              <p className="font-medium text-green-700 mb-2">✓ Aspectos positivos:</p>
              <ul className="list-disc list-inside space-y-1 text-green-800">
                {strengths.slice(0, 3).map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {challenges.length > 0 && (
            <div>
              <p className="font-medium text-orange-700 mb-2">⚠ Consideraciones:</p>
              <ul className="list-disc list-inside space-y-1 text-orange-800">
                {challenges.slice(0, 3).map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Pantalla de carga inicial
  if (isLoading && !recommendations) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AFC2D5] mb-4"></div>
        <p className="text-gray-600">Preparando el cuestionario...</p>
      </div>
    );
  }
  
// Pantalla de resultados con exploración mejorada
 if (recommendations) {
   return (
     <div className="space-y-8">
       {/* 🆕 COMPONENTE PRINCIPAL DE RESULTADOS MEJORADOS */}
       <EnhancedResultsDisplay 
         results={recommendations}
         onCompareBreeds={(breedsToCompare) => {
           console.log('🔍 Comparando razas sugeridas:', breedsToCompare);
           const breedsList = breedsToCompare.map(rec => rec.breed);
           setSelectedForComparison(breedsList);
           setShowComparator(true);
         }}
       />
       
       {/* Explorador de todas las razas */}
       {showAllBreeds && (
         <div className="mt-12 bg-gray-50 rounded-lg p-6">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-[#2E2E2E]">
               Explora todas las razas disponibles
             </h3>
             <div className="text-sm text-gray-600">
               {selectedForComparison.length}/3 seleccionadas para comparar
             </div>
           </div>

           {/* Buscador */}
           <div className="mb-6">
             <div className="max-w-md">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 ¿Tienes una raza en mente?
               </label>
               <input
                 type="text"
                 placeholder="Buscar por nombre, tipo o tamaño..."
                 value={searchTerm}
                 onChange={(e) => {
                   setSearchTerm(e.target.value);
                   setCurrentPage(1);
                 }}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AFC2D5]"
               />
             </div>
           </div>

           {/* Grid de razas */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             {getPaginatedBreeds().map(breed => (
               <div key={breed.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                 <div className="h-32 overflow-hidden">
                   <img 
                     src={breed.image} 
                     alt={breed.name}
                     className="w-full h-full object-cover"
                   />
                 </div>
                 <div className="p-3">
                   <h4 className="font-bold text-sm mb-1">{breed.name}</h4>
                   <p className="text-xs text-gray-600 mb-2">
                     {breed.type === 'dog' ? 'Perro' : 'Gato'} • {
                       breed.size === 'small' ? 'Pequeño' : 
                       breed.size === 'medium' ? 'Mediano' : 'Grande'
                     }
                   </p>
                   <button
                     onClick={() => {
                       if (isSelectedForComparison(breed.id)) {
                         removeFromComparison(breed.id);
                       } else {
                         addToComparison(breed);
                         setShowComparator(true);
                       }
                     }}
                     disabled={!isSelectedForComparison(breed.id) && selectedForComparison.length >= 3}
                     className={`w-full px-3 py-1 rounded text-xs font-medium transition-colors ${
                       isSelectedForComparison(breed.id)
                         ? 'bg-red-500 hover:bg-red-600 text-white'
                         : selectedForComparison.length >= 3
                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                           : 'bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white'
                     }`}
                   >
                     {isSelectedForComparison(breed.id) ? 'Quitar' : 
                      selectedForComparison.length >= 3 ? 'Máximo 3' : 'Comparar'}
                   </button>
                 </div>
               </div>
             ))}
           </div>

           {/* Paginación */}
           {getTotalPages() > 1 && (
             <div className="flex justify-center items-center space-x-4">
               <button
                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                 disabled={currentPage === 1}
                 className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
               >
                 Anterior
               </button>
               <span className="text-sm text-gray-600">
                 Página {currentPage} de {getTotalPages()}
               </span>
               <button
                 onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                 disabled={currentPage === getTotalPages()}
                 className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
               >
                 Siguiente
               </button>
             </div>
           )}
         </div>
       )}

       {/* Comparador integrado */}
       {showComparator && selectedForComparison.length > 0 && renderComparisonAnalysis()}
       
       {/* Acciones finales */}
       <div className="mt-8 bg-gray-50 rounded-lg p-6 text-center">
         <h4 className="text-lg font-bold text-[#2E2E2E] mb-2">¿Qué sigue?</h4>
         <p className="text-gray-600 mb-4">
           Explora más razas, compara opciones o vuelve a hacer el cuestionario
         </p>
         <div className="flex flex-col sm:flex-row gap-3 justify-center">
           <button
             className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
             onClick={restartQuiz}
           >
             🔄 Volver a empezar
           </button>
         </div>
       </div>
     </div>
   );
 }  
  // Error si no hay preguntas
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Error al cargar el cuestionario
        </h3>
        <p className="text-gray-600 mb-4">
          No se pudieron cargar las preguntas. Por favor, recarga la página.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#AFC2D5] text-white rounded-md hover:bg-[#9DB3C6] transition-colors"
        >
          Recargar página
        </button>
      </div>
    );
  }
  
  // Cuestionario principal con lógica condicional
  return (
    <div className="max-w-3xl mx-auto">
      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Pregunta {currentQuestionIndex + 1} de {relevantQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {Math.round(quizProgress)}% completado
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#AFC2D5] to-[#9DB3C6] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${quizProgress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Contenedor de preguntas */}
      <div className={`transition-all duration-300 ${
        isTransitioning 
          ? 'opacity-0 transform translate-x-4' 
          : 'opacity-100 transform translate-x-0'
      }`}>
        {relevantQuestions.length > 0 && currentQuestionIndex < relevantQuestions.length && (
          <QuizQuestion
            question={relevantQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            currentAnswer={answers[relevantQuestions[currentQuestionIndex]?.id]}
          />
        )}
      </div>
      
      {/* Botones de navegación */}
      <div className="flex justify-between items-center mt-8">
        <button 
          className={`flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md text-sm font-medium transition-all ${
            currentQuestionIndex > 0 
              ? 'hover:bg-gray-50 hover:border-gray-400' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {currentQuestionIndex < relevantQuestions.length - 1 
              ? `${relevantQuestions.length - currentQuestionIndex - 1} preguntas restantes`
              : '¡Última pregunta!'
            }
          </p>
        </div>
        
        <button 
          className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all ${
            answers[relevantQuestions[currentQuestionIndex]?.id] 
              ? 'bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white shadow-md hover:shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={goToNextQuestion}
          disabled={!answers[relevantQuestions[currentQuestionIndex]?.id]}
        >
          {currentQuestionIndex < relevantQuestions.length - 1 ? (
            <>
              Siguiente
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          ) : (
            <>
              Ver mis resultados
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
      
      {/* Pantalla de carga para cálculos */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AFC2D5] mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Calculando tu compatibilidad...
            </h3>
            <p className="text-gray-600 text-sm">
              Analizamos tus respuestas con nuestro algoritmo especializado
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedMatchQuiz;