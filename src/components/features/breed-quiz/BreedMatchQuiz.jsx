// src/components/features/breed-quiz/BreedMatchQuiz.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import QuizQuestion from './QuizQuestion';
import DualBreedRecommendationResults from './DualBreedRecommendationResults';
import LeadCaptureForm from './LeadCaptureForm';
import { getDynamicQuizQuestions, collectUserResponses, shouldShowQuestion } from '../../../utils/quizHelpers';
import { getDualBreedRecommendations, calculateCompatibilityScore, identifyStrengths, identifyChallenges } from '../../../utils/breedMatcher';
import { breedsData } from '../../../data/breeds/index.js';

const BreedMatchQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [dualRecommendations, setDualRecommendations] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizProgress, setQuizProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

   // 🆕 Estados para captura de datos
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [userLeadData, setUserLeadData] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Estados para exploración y comparación
  const [showAllBreeds, setShowAllBreeds] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showComparator, setShowComparator] = useState(false);
  
  const BREEDS_PER_PAGE = 20;
  
  // 🔧 CARGA DE DATOS MEJORADA CON VALIDACIÓN
 useEffect(() => {
  // ✅ NUEVO: Flag para evitar updates en componente desmontado
  let isMounted = true;
  
  // ✅ NUEVO: AbortController para cancelar operaciones async
  const abortController = new AbortController();
  
  // ✅ NUEVO: Datos de emergencia definidos localmente para evitar errores
  const emergencyBreeds = [
    {
      id: 'golden-retriever-emergency',
      name: 'Golden Retriever',
      type: 'dog',
      size: 'large',
      energyLevel: 4,
      friendliness: 5,
      grooming: 3,
      training: 4,
      apartmentFriendly: false,
      hypoallergenic: false,
      image: '/images/breeds/golden-retriever.jpg'
    },
    {
      id: 'persian-cat-emergency',
      name: 'Gato Persa',
      type: 'cat',
      size: 'medium',
      energyLevel: 2,
      friendliness: 3,
      grooming: 5,
      training: 2,
      apartmentFriendly: true,
      hypoallergenic: false,
      image: '/images/breeds/persian-cat.jpg'
    }
  ];

  async function loadData() {
    try {
      // ✅ MEJORADO: Verificar si el componente sigue montado antes de cada operación
      if (!isMounted) return;
      
      console.log('🔄 Cargando datos del cuestionario...');
      
      // ✅ MEJORADO: Validación más robusta con mejor logging
      if (!breedsData) {
        console.error('❌ Error: breedsData es undefined o null');
        throw new Error('Datos de razas no disponibles - variable undefined');
      }
      
      if (!Array.isArray(breedsData)) {
        console.error('❌ Error: breedsData no es un array:', typeof breedsData);
        throw new Error('Datos de razas no disponibles - formato inválido');
      }
      
      if (breedsData.length === 0) {
        console.error('❌ Error: breedsData está vacío');
        throw new Error('Datos de razas no disponibles - array vacío');
      }
      
      // ✅ MEJORADO: Validación más exhaustiva de cada raza
      const validBreeds = breedsData.filter(breed => {
        // Verificación básica de existencia
        if (!breed || typeof breed !== 'object') {
          console.warn('⚠️ Raza inválida (no es objeto):', breed);
          return false;
        }
        
        // Verificación de campos requeridos
        const requiredStringFields = ['id', 'name', 'type'];
        for (const field of requiredStringFields) {
          if (!breed[field] || typeof breed[field] !== 'string' || breed[field].trim() === '') {
            console.warn(`⚠️ Raza inválida (campo ${field} faltante o inválido):`, breed.name || 'Unknown');
            return false;
          }
        }
        
        // Verificación de tipo válido
        if (!['dog', 'cat'].includes(breed.type)) {
          console.warn('⚠️ Raza con tipo inválido:', breed.name, breed.type);
          return false;
        }
        
        // ✅ MEJORADO: Validación más flexible de campos numéricos
        const numericFields = ['energyLevel', 'friendliness', 'grooming'];
        for (const field of numericFields) {
          const value = breed[field];
          if (value !== undefined && value !== null) {
            const numValue = Number(value);
            if (isNaN(numValue) || numValue < 1 || numValue > 5) {
              console.warn(`⚠️ Raza con ${field} inválido:`, breed.name, value);
              // ✅ NUEVO: Corregir valores en lugar de descartar
              breed[field] = Math.max(1, Math.min(5, Math.round(numValue) || 3));
            }
          } else {
            // ✅ NUEVO: Asignar valor por defecto si falta
            breed[field] = 3;
            console.warn(`⚠️ Asignando valor por defecto para ${field} en:`, breed.name);
          }
        }
        
        return true;
      });
      
      // ✅ VERIFICAR: Componente sigue montado antes de continuar
      if (!isMounted) return;
      
      if (validBreeds.length === 0) {
        console.error('❌ Error: No se encontraron razas válidas después del filtrado');
        throw new Error('Datos de razas inválidos - ninguna raza pasó la validación');
      }
      
      console.log(`✅ Datos validados: ${validBreeds.length} razas válidas de ${breedsData.length} totales`);
      
      // ✅ MEJORADO: Estadísticas más detalladas
      const stats = {
        total: validBreeds.length,
        dogs: validBreeds.filter(b => b.type === 'dog').length,
        cats: validBreeds.filter(b => b.type === 'cat').length,
        withImages: validBreeds.filter(b => b.image && b.image.trim() !== '').length,
        hypoallergenic: validBreeds.filter(b => b.hypoallergenic === true).length,
        apartmentFriendly: validBreeds.filter(b => b.apartmentFriendly === true).length,
        sizes: {
          small: validBreeds.filter(b => b.size === 'small').length,
          medium: validBreeds.filter(b => b.size === 'medium').length,
          large: validBreeds.filter(b => b.size === 'large').length
        },
        averageEnergy: (validBreeds.reduce((sum, b) => sum + (b.energyLevel || 0), 0) / validBreeds.length).toFixed(1),
        averageFriendliness: (validBreeds.reduce((sum, b) => sum + (b.friendliness || 0), 0) / validBreeds.length).toFixed(1)
      };
      
      console.log('📊 Estadísticas detalladas de razas cargadas:', stats);
      
      // ✅ NUEVO: Validación final antes de setear estado
      if (!isMounted) {
        console.log('⚠️ Componente desmontado, cancelando actualización de estado');
        return;
      }
      
      // ✅ MEJORADO: Actualizar estado solo si el componente sigue montado
      setBreeds(validBreeds);
      setIsLoading(false);
      
      // ✅ NUEVO: Trigger de evento personalizado para otros componentes
      const dataLoadedEvent = new CustomEvent('breedsDataLoaded', {
        detail: { breeds: validBreeds, stats }
      });
      window.dispatchEvent(dataLoadedEvent);
      
    } catch (error) {
      // ✅ VERIFICAR: Solo proceder si el componente sigue montado
      if (!isMounted) {
        console.log('⚠️ Componente desmontado, cancelando manejo de error');
        return;
      }
      
      console.error('❌ Error crítico cargando datos del cuestionario:', {
        message: error.message,
        stack: error.stack,
        breedsDataType: typeof breedsData,
        breedsDataLength: Array.isArray(breedsData) ? breedsData.length : 'N/A'
      });
      
      // ✅ MEJORADO: Logging más detallado de datos de emergencia
      console.log(`🔄 Usando datos de emergencia: ${emergencyBreeds.length} razas de respaldo`);
      console.log('📋 Razas de emergencia:', emergencyBreeds.map(b => `${b.name} (${b.type})`));
      
      // ✅ NUEVO: Establecer flag de error para mostrar al usuario
      setError(`Error cargando datos: ${error.message}. Mostrando razas de ejemplo.`);
      
      setBreeds(emergencyBreeds);
      setIsLoading(false);
      
      // ✅ NUEVO: Trigger de evento de error
      const errorEvent = new CustomEvent('breedsDataError', {
        detail: { error: error.message, fallbackCount: emergencyBreeds.length }
      });
      window.dispatchEvent(errorEvent);
      
      // ✅ NUEVO: Intentar tracking del error si hay analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'data_loading_error', {
          event_category: 'error',
          event_label: 'breeds_data_loading',
          value: error.message
        });
      }
    }
  }
  
  // ✅ NUEVO: Delay opcional para evitar loading muy rápido (mejor UX)
  const loadWithDelay = async () => {
    // Pequeño delay para mejor percepción de carga
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (isMounted && !abortController.signal.aborted) {
      await loadData();
    }
  };
  
  // ✅ EJECUTAR: Iniciar carga con delay
  loadWithDelay();
  
  // ✅ CLEANUP: Función de limpieza apropiada
  return () => {
    console.log('🧹 Limpiando useEffect de carga de datos...');
    
    // Marcar componente como desmontado
    isMounted = false;
    
    // Cancelar operaciones pendientes
    abortController.abort();
    
    // ✅ NUEVO: Limpiar event listeners si los hay
    // (útil si agregas listeners en el futuro)
  };
}, []); // ✅ DEPENDENCY ARRAY: Vacío porque no depende de props/state

// ✅ OPCIONAL: useEffect adicional para logging de cambios en breeds
useEffect(() => {
  if (breeds.length > 0) {
    console.log(`🎉 Estado actualizado: ${breeds.length} razas disponibles`);
    
    // ✅ NUEVO: Validación post-carga
    const invalidBreeds = breeds.filter(breed => 
      !breed.id || !breed.name || !breed.type
    );
    
    if (invalidBreeds.length > 0) {
      console.warn('⚠️ Detectadas razas inválidas en estado:', invalidBreeds);
    }
  }
}, [breeds]); // ✅ DEPENDENCY: Solo ejecutar cuando breeds cambie
  
  // Generar preguntas dinámicas
  const relevantQuestions = React.useMemo(() => {
    const dynamicQuestions = getDynamicQuizQuestions(answers);
    return dynamicQuestions.filter(question => shouldShowQuestion(question.id, answers));
  }, [answers]);
  
  useEffect(() => {
    if (relevantQuestions.length > 0) {
      const progress = ((currentQuestionIndex + 1) / relevantQuestions.length) * 100;
      setQuizProgress(Math.min(progress, 100));
    }
  }, [currentQuestionIndex, relevantQuestions.length]);
  
  const handleAnswer = (questionId, answer) => {
    console.log('📝 Respuesta:', { questionId, answer });
    
    const newAnswers = {
      ...answers,
      [questionId]: answer
    };
    
    // Limpiar respuestas condicionales cuando cambia una respuesta padre
    if (questionId === 'petTypePreference') {
      if (answer === 'cat') {
        delete newAnswers['noiseToleranceLevel'];
        delete newAnswers['trainingWillingness'];
      }
      delete newAnswers['sizePreference'];
      delete newAnswers['feedingPreference'];
    }
    
    if (questionId === 'hasChildren' && answer !== 'yes') {
      delete newAnswers['childrenAge'];
    }
    
    if (questionId === 'hasOtherPets' && answer !== 'yes') {
      delete newAnswers['otherPets'];
    }
    
    if (questionId === 'allergies' && answer !== 'yes') {
      delete newAnswers['allergyLevel'];
    }
    
    setAnswers(newAnswers);
  };
  
  const goToNextQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionIndex < relevantQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
        setShowLeadCapture(true);
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

  // 🆕 Manejar envío de datos de captura
const handleLeadSubmit = (leadData) => {
  console.log('📧 Datos capturados:', leadData);
  setUserLeadData(leadData);
  setShowLeadCapture(false);
  calculateDualResults();
};

// 🆕 Manejar omisión de captura
const handleLeadSkip = () => {
  console.log('⏭️ Usuario omitió el registro');
  setShowLeadCapture(false);
  calculateDualResults();
};
  
  // Calcular resultados duales (Colombia + Global)
  const calculateDualResults = () => {
    console.log('🇨🇴 Calculando resultados duales Colombia/Global...');
    setIsLoading(true);
    
    try {
      if (!breeds || breeds.length === 0) {
        throw new Error('No hay razas disponibles para calcular recomendaciones');
      }
      
      const profile = collectUserResponses(answers);
      console.log('👤 Perfil del usuario:', profile);
      
      if (!profile || !profile.petTypePreference) {
        throw new Error('Perfil de usuario inválido');
      }
      
      let availableBreeds = breeds;
      if (profile.petTypePreference !== 'any') {
        availableBreeds = breeds.filter(breed => breed.type === profile.petTypePreference);
        console.log(`🔍 Filtrando por tipo ${profile.petTypePreference}: ${availableBreeds.length} razas disponibles`);
      }
      
      if (availableBreeds.length === 0) {
        throw new Error(`No hay razas de tipo ${profile.petTypePreference} disponibles`);
      }
      
      const dualResults = getDualBreedRecommendations(profile, availableBreeds);
      console.log('🎯 Resultados duales calculados:', dualResults);
      
      if (!dualResults || !dualResults.colombianRecommendation || !dualResults.globalRecommendation) {
        throw new Error('No se pudieron generar recomendaciones duales');
      }
      
      localStorage.setItem('userProfile', JSON.stringify(profile));
      console.log('💾 Perfil guardado en localStorage');
      
      setUserProfile(profile);
      setDualRecommendations(dualResults);
      setShowAllBreeds(true);
      
    } catch (error) {
      console.error('❌ Error calculating dual recommendations:', error);
      alert(`Ha ocurrido un error al calcular las recomendaciones: ${error.message}. Por favor, verifica tus respuestas e inténtalo de nuevo.`);
      setIsLoading(false);
    } finally {
      if (dualRecommendations) {
        setIsLoading(false);
      }
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setDualRecommendations(null);
    setUserProfile(null);
    setQuizProgress(0);
    setShowAllBreeds(false);
    setSelectedForComparison([]);
    setShowComparator(false);
    setSearchTerm('');
    setCurrentPage(1);
  // 🆕 Resetear estados de captura
    setShowLeadCapture(false);
    setUserLeadData(null);
    setQuizCompleted(false);
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

  const addToComparison = (breed) => {
    if (selectedForComparison.length < 3 && !selectedForComparison.find(b => b.id === breed.id)) {
      setSelectedForComparison(prev => [...prev, breed]);
    }
  };

  const removeFromComparison = (breedId) => {
    setSelectedForComparison(prev => prev.filter(breed => breed.id !== breedId));
  };

  const compareRecommended = () => {
    if (dualRecommendations) {
      const breedsToCompare = [];
      
      const colombianBreedData = breeds.find(b => b.id === dualRecommendations.colombianRecommendation.breed.id);
      const globalBreedData = breeds.find(b => b.id === dualRecommendations.globalRecommendation.breed.id);
      
      if (colombianBreedData) {
        breedsToCompare.push(colombianBreedData);
      }
      
      if (globalBreedData && globalBreedData.id !== colombianBreedData?.id) {
        breedsToCompare.push(globalBreedData);
      }
      
      if (dualRecommendations.colombianAlternatives.length > 0) {
        const alternativeData = breeds.find(b => b.id === dualRecommendations.colombianAlternatives[0].breed.id);
        if (alternativeData && !breedsToCompare.find(b => b.id === alternativeData.id)) {
          breedsToCompare.push(alternativeData);
        }
      }
      
      console.log('🔍 Comparando razas recomendadas:', breedsToCompare.map(b => b.name));
      setSelectedForComparison(breedsToCompare.slice(0, 3));
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
              src={breed.image || '/images/breeds/default.jpg'} 
              alt={breed.name}
              className="w-16 h-16 rounded-full object-cover mr-4"
              onError={(e) => {
                e.target.src = '/images/breeds/default.jpg';
              }}
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
  if (isLoading && !dualRecommendations) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AFC2D5] mb-4"></div>
        <p className="text-gray-600">
          {breeds.length === 0 ? 'Cargando datos de razas...' : 'Preparando el cuestionario...'}
        </p>
        {breeds.length > 0 && (
          <p className="text-sm text-green-500 mt-2">
            {breeds.length} razas disponibles
          </p>
        )}
      </div>
    );
  }

  // 🆕 PANTALLA DE CAPTURA DE DATOS
if (showLeadCapture && quizCompleted) {
  return (
    <div className="space-y-8">
      <LeadCaptureForm 
        onSubmit={handleLeadSubmit}
        onSkip={handleLeadSkip}
        userAnswers={answers}
      />
    </div>
  );
}

  
  // 🆕 PANTALLA DE RESULTADOS DUALES
  if (dualRecommendations) {
    return (
      <div className="space-y-8">
        {userLeadData && (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
      <h2 className="text-2xl font-bold text-green-800 mb-2">
        ¡Hola {userLeadData.nombre}! 👋
      </h2>
      <p className="text-green-700">
        Aquí están tus recomendaciones personalizadas. También hemos enviado un resumen a {userLeadData.correo}.
      </p>
    </div>
  )}


        {/* Componente principal de resultados duales */}
        <DualBreedRecommendationResults 
          results={dualRecommendations}
          userLeadData={userLeadData}
          onCompareBreeds={(breedsToCompare) => {
            console.log('🔍 Comparando razas sugeridas:', breedsToCompare);
            
            const completeBreeds = breedsToCompare.map(breed => {
              const fullBreed = breeds.find(b => b.id === breed.id);
              return fullBreed || breed;
            }).filter(Boolean);
            
            setSelectedForComparison(completeBreeds);
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
                  <div className="h-22 overflow-hidden">
                    <img 
                      src={breed.image || '/images/breeds/default.jpg'} 
                      alt={breed.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/breeds/default.jpg';
                      }}
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
                            ? 'bg-gray-300 text-white cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-800 text-white'
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
        
        {/* Botón para comparar recomendadas */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-center">
          <h4 className="text-xl font-bold text-green-900 mb-2">
            🔍 ¿Quieres comparar tus recomendaciones?
          </h4>
          <p className="text-[#5A7251] mb-4">
            Compara tu raza colombiana vs la ideal global para tomar la mejor decisión
          </p>
          <button 
            onClick={compareRecommended}
            className="px-8 py-3 bg-[#5A7251] hover:bg-[#4A6244] text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            🔍 Comparar mis recomendaciones
          </button>
        </div>
        
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
  if (relevantQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" clipRule="evenodd" />
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
  
  // 🆕 CUESTIONARIO PRINCIPAL CON ORDEN CORREGIDO
  return (
    <div className="max-w-3xl mx-auto">
      {/* Barra de progreso mejorada */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-green-500">
            Pregunta {currentQuestionIndex + 1} de {relevantQuestions.length}
          </span>
          <span className="text-sm font-medium text-green-500">
            {Math.round(quizProgress)}% completado
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${quizProgress}%` }}
          ></div>
        </div>
        
        {/* Indicador de tipo de pregunta */}
        {relevantQuestions[currentQuestionIndex] && (
          <div className="mt-2 text-center">
            <span className="text-xs text-green-500 bg-gray-100 px-2 py-1 rounded-full">
              {getQuestionCategory(relevantQuestions[currentQuestionIndex].id)}
            </span>
          </div>
        )}
      </div>

      {/* 🚀 CONTENEDOR DE PREGUNTAS CON TRANSICIÓN - APARECE PRIMERO */}
      <div className={`transition-all duration-300 ${
        isTransitioning 
          ? 'opacity-0 transform translate-x-4' 
          : 'opacity-100 transform translate-x-0'
      }`}>
        {relevantQuestions.length > 0 && currentQuestionIndex < relevantQuestions.length && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <QuizQuestion
              question={relevantQuestions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              currentAnswer={answers[relevantQuestions[currentQuestionIndex]?.id]}
            />
          </div>
        )}
      </div>
      
      {/* Información contextual dinámica */}
      {relevantQuestions[currentQuestionIndex] && (
        <div className="mb-6">
          {renderQuestionContext(relevantQuestions[currentQuestionIndex].id, answers)}
        </div>
      )}
      
      {/* Botones de navegación mejorados */}
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
          <p className="text-xs text-green-500">
            {currentQuestionIndex < relevantQuestions.length - 1 
              ? `${relevantQuestions.length - currentQuestionIndex - 1} preguntas restantes`
              : '¡Última pregunta!'
            }
          </p>
          {/* Indicador de progreso visual */}
          <div className="flex justify-center mt-2 space-x-1">
            {Array.from({ length: Math.min(5, relevantQuestions.length) }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= currentQuestionIndex ? 'bg-green-500' : 'bg-green-800'
                }`}
              />
            ))}
          </div>
        </div>
        
        <button 
          className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all ${
            answers[relevantQuestions[currentQuestionIndex]?.id] 
              ? 'bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white shadow-md hover:shadow-lg' 
              : 'bg-gray-300 text-white cursor-not-allowed'
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
              🇨🇴 Ver mis resultados
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
      
      {/* Pantalla de carga para cálculos mejorada */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AFC2D5] mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🇨🇴 Calculando tu compatibilidad...
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              Analizamos tus respuestas con las {breeds.length} razas disponibles en nuestro índice
            </p>
            <div className="bg-blue-50 rounded-lg p-3 mt-4">
              <p className="text-blue-800 text-xs">
                💡 Te mostraremos tanto tu mejor opción en Colombia como tu raza ideal teórica
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Funciones auxiliares para mejorar la experiencia

// Categorizar preguntas para mostrar contexto
const getQuestionCategory = (questionId) => {
  const categories = {
    'petTypePreference': '🐕🐱 Tipo de mascota',
    'homeType': '🏠 Vivienda',
    'hoursAway': '⏰ Tiempo disponible',
    'activityLevel': '⚡ Actividad física',
    'hasChildren': '👶 Familia',
    'childrenAge': '👶 Edad de niños',
    'hasOtherPets': '🐾 Otras mascotas',
    'otherPets': '🐾 Tipo de mascotas',
    'experience': '🎓 Experiencia',
    'sizePreference': '📏 Tamaño preferido',
    'furLengthPreference': '💇‍♀️ Tipo de pelaje',
    'noiseToleranceLevel': '🔊 Tolerancia al ruido',
    'groomingWillingness': '💅 Cuidados',
    'trainingWillingness': '🎓 Entrenamiento',
    'allergies': '🤧 Alergias',
    'allergyLevel': '🤧 Nivel de alergias',
    'budgetLevel': '💰 Presupuesto',
    'feedingPreference': '🍖 Alimentación',
    'purpose': '🎯 Objetivo'
  };
  
  return categories[questionId] || '❓ Información adicional';
};

// Renderizar contexto específico por pregunta
const renderQuestionContext = (questionId, answers) => {
  const petType = answers.petTypePreference;
  
  const contextMessages = {
    'petTypePreference': (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 <strong>Tip:</strong> Esta decisión afectará las siguientes preguntas. Los perros y gatos tienen necesidades muy diferentes.
        </p>
      </div>
    ),
    'budgetLevel': (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          💰 <strong>Importante:</strong> Incluye comida, veterinario, accesorios y cuidados. Una mascota puede costar entre $200k-1.2M COP mensuales según la raza.
        </p>
      </div>
    ),
    'feedingPreference': petType && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🍖 <strong>Contexto:</strong> {
            petType === 'cat' 
              ? 'Para gatos: comida estándar ~$32k/mes, premium ~$60k/mes (1.5kg mensual)'
              : petType === 'dog'
                ? 'Para perros: varía por tamaño desde $60k/mes (pequeños) hasta $280k/mes (grandes premium)'
                : 'Los costos varían significativamente entre perros y gatos'
          }
        </p>
      </div>
    ),
    'hasChildren': (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-800 text-sm">
          👶 <strong>Seguridad:</strong> La compatibilidad con niños es crucial. Algunas razas son naturalmente más pacientes con los pequeños.
        </p>
      </div>
    )
  };
  
  return contextMessages[questionId] || null;
};

export default BreedMatchQuiz;