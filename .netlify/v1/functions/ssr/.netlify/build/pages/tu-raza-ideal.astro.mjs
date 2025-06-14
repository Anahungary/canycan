/* empty css                                      */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D02iGaEB.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Container } from '../chunks/Container_DjUMO5lw.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import React, { useState, useEffect } from 'react';
import { b as breedsData } from '../chunks/index_NJrSibqZ.mjs';
import { c as calculateCompatibilityScore, i as identifyStrengths, a as identifyChallenges, g as getDualBreedRecommendations } from '../chunks/breedMatcher_D0ea6ER8.mjs';
export { renderers } from '../renderers.mjs';

const QuizQuestion = ({ question, onAnswer, currentAnswer }) => {
  if (question.type === "single") {
    return /* @__PURE__ */ jsxs("div", { className: "quiz-question", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: question.text }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: question.options.map((option) => /* @__PURE__ */ jsx(
        "button",
        {
          className: `w-full text-left px-4 py-3 rounded-lg border transition-colors ${currentAnswer === option.value ? "border-[#AFC2D5] bg-[#AFC2D5] bg-opacity-10 text-[#AFC2D5]" : "border-gray-200 hover:border-[#AFC2D5] hover:bg-gray-50"}`,
          onClick: () => onAnswer(question.id, option.value),
          children: option.text
        },
        option.value
      )) })
    ] });
  }
  if (question.type === "multiple") {
    const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
    return /* @__PURE__ */ jsxs("div", { className: "quiz-question", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: question.text }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Puedes seleccionar varias opciones" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: question.options.map((option) => /* @__PURE__ */ jsx(
        "button",
        {
          className: `w-full text-left px-4 py-3 rounded-lg border transition-colors ${selectedValues.includes(option.value) ? "border-[#AFC2D5] bg-[#AFC2D5] bg-opacity-10 text-[#AFC2D5]" : "border-gray-200 hover:border-[#AFC2D5] hover:bg-gray-50"}`,
          onClick: () => {
            let newValues;
            if (selectedValues.includes(option.value)) {
              newValues = selectedValues.filter((val) => val !== option.value);
            } else {
              newValues = [...selectedValues, option.value];
            }
            onAnswer(question.id, newValues);
          },
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded border flex-shrink-0 mr-3 flex items-center justify-center ${selectedValues.includes(option.value) ? "border-[#AFC2D5] bg-[#AFC2D5] text-white" : "border-gray-300"}`, children: selectedValues.includes(option.value) && /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }),
            option.text
          ] })
        },
        option.value
      )) })
    ] });
  }
  if (question.type === "scale") {
    return /* @__PURE__ */ jsxs("div", { className: "quiz-question", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-4", children: question.text }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: question.options[0]?.text || "Bajo" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: question.options[question.options.length - 1]?.text || "Alto" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-between gap-2", children: [1, 2, 3, 4, 5].map((value) => /* @__PURE__ */ jsx(
          "button",
          {
            className: `flex-1 py-3 rounded-lg text-center transition-colors ${parseInt(currentAnswer) === value ? "bg-[#AFC2D5] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`,
            onClick: () => onAnswer(question.id, value.toString()),
            children: value
          },
          value
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mt-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Mínimo" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "Máximo" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    "Tipo de pregunta no soportado: ",
    question.type
  ] });
};

const mapTraitToSpanish = (trait) => {
  const traitMap = {
    // Niños
    "children": "Niños",
    "young_children": "Niños pequeños",
    "older_children": "Niños mayores",
    "teens": "Adolescentes",
    // Otras mascotas
    "dogs": "Otros perros",
    "cats": "Gatos",
    "small_pets": "Mascotas pequeñas",
    // Personas
    "seniors": "Adultos mayores",
    "families": "Familias",
    "singles": "Personas solteras",
    // Espacios
    "apartments": "Apartamentos",
    "small_spaces": "Espacios pequeños",
    "large_yards": "Patios grandes",
    // Niveles de experiencia
    "first_time_owners": "Dueños primerizos",
    "experienced_owner": "Dueños experimentados",
    // Estilos de vida
    "active_owners": "Personas activas",
    "calm_environments": "Ambientes tranquilos",
    "busy_households": "Hogares ocupados"
  };
  return traitMap[trait] || trait;
};
const DualBreedRecommendationResults = ({ results, onCompareBreeds }) => {
  const [showComparison, setShowComparison] = useState(!results.availability.isColombianSameAsGlobal);
  const [activeTab, setActiveTab] = useState("colombian");
  if (!breedsData || breedsData.length === 0) {
    console.error("❌ No se encontraron datos de razas");
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-12 bg-red-50 rounded-lg border border-red-200", children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-600 mb-4", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 mx-auto", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-red-900 mb-2", children: "Error de conexión con datos" }),
      /* @__PURE__ */ jsx("p", { className: "text-red-700", children: "No se pudieron cargar los datos de razas. Por favor, verifica la configuración." })
    ] });
  }
  const getFullBreedData = (breedId) => {
    const breed = breedsData.find((b) => b.id === breedId);
    if (!breed) {
      console.warn(`⚠️ Raza no encontrada en índice: ${breedId}`);
      return null;
    }
    return breed;
  };
  const colombianBreedData = getFullBreedData(results.colombianRecommendation.breed.id);
  const globalBreedData = getFullBreedData(results.globalRecommendation.breed.id);
  if (!colombianBreedData || !globalBreedData) {
    console.error("❌ Las razas recomendadas no se encontraron en el índice");
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200", children: [
      /* @__PURE__ */ jsx("div", { className: "text-yellow-600 mb-4", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 mx-auto", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-yellow-900 mb-2", children: "Datos de razas incompletos" }),
      /* @__PURE__ */ jsx("p", { className: "text-yellow-700", children: "Las razas recomendadas no están disponibles en la base de datos actual." })
    ] });
  }
  generateDualRecommendationExplanation(results);
  const formatScore = (score) => `${score}%`;
  if (results.availability.isColombianSameAsGlobal) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-3", children: "🎯🇨🇴" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-green-800 mb-2", children: "¡Resultado Perfecto!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-green-700 text-lg", children: [
          "Tu raza ideal ",
          /* @__PURE__ */ jsx("strong", { children: colombianBreedData.name }),
          " está disponible en Colombia"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-200", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: colombianBreedData.name }),
            /* @__PURE__ */ jsx("p", { className: "text-green-100", children: "Tu compañero perfecto" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: formatScore(results.colombianRecommendation.compatibilityScore) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-green-100", children: "compatibilidad" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: colombianBreedData.image || "/images/breeds/default.jpg",
                alt: colombianBreedData.name,
                className: "w-64 h-64 object-cover rounded-lg shadow-md",
                onError: (e) => {
                  e.target.src = "/images/breeds/default.jpg";
                }
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-bold text-green-700 mb-2 flex items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "mr-2", children: "✅" }),
                  " Por qué es perfecto para ti:"
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: results.colombianRecommendation.strengths.slice(0, 3).map((strength, index) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-gray-700 flex items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-green-500 mr-2 mt-1", children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: strength })
                ] }, index)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-green-50 rounded-lg p-4", children: [
                /* @__PURE__ */ jsx("h5", { className: "font-bold text-green-800 mb-2", children: "🇨🇴 Ventajas en Colombia:" }),
                /* @__PURE__ */ jsxs("ul", { className: "text-sm text-green-700 space-y-1", children: [
                  /* @__PURE__ */ jsx("li", { children: "• Disponible en criaderos locales" }),
                  /* @__PURE__ */ jsx("li", { children: "• Veterinarios especializados" }),
                  /* @__PURE__ */ jsx("li", { children: "• Precios accesibles" }),
                  /* @__PURE__ */ jsx("li", { children: "• Comunidad de dueños activa" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-lg p-4", children: [
                /* @__PURE__ */ jsx("h5", { className: "font-bold text-blue-800 mb-2", children: "📊 Características:" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Tamaño:" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium ml-1", children: colombianBreedData.size === "small" ? "Pequeño" : colombianBreedData.size === "medium" ? "Mediano" : "Grande" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Energía:" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium ml-1", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx("span", { className: i < colombianBreedData.energyLevel ? "text-amber-500" : "text-gray-300", children: i < colombianBreedData.energyLevel ? "★" : "☆" }, i)) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Sociabilidad:" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium ml-1", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx("span", { className: i < colombianBreedData.friendliness ? "text-amber-500" : "text-gray-300", children: i < colombianBreedData.friendliness ? "★" : "☆" }, i)) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Cuidados:" }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium ml-1", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx("span", { className: i < colombianBreedData.grooming ? "text-amber-500" : "text-gray-300", children: i < colombianBreedData.grooming ? "★" : "☆" }, i)) })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row gap-3 justify-center", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `/razas/${colombianBreedData.id}`,
                className: "px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-center",
                children: "📖 Ver perfil completo"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onCompareBreeds && onCompareBreeds([colombianBreedData]),
                className: "px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 rounded-lg font-medium transition-colors",
                children: "🔍 Comparar con otras razas"
              }
            )
          ] })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-3", children: "🇨🇴🌍" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Tu Raza Ideal: Disponibilidad vs Compatibilidad" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Te mostramos tu mejor opción disponible en Colombia y tu raza teóricamente ideal" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 rounded-lg p-1", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("colombian"),
          className: `px-6 py-2 rounded-md font-medium transition-colors ${activeTab === "colombian" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`,
          children: "🇨🇴 Disponible en Colombia"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("global"),
          className: `px-6 py-2 rounded-md font-medium transition-colors ${activeTab === "global" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`,
          children: "🌍 Raza Ideal Teórica"
        }
      )
    ] }) }),
    activeTab === "colombian" ? /* @__PURE__ */ jsx(
      BreedRecommendationCard,
      {
        recommendation: results.colombianRecommendation,
        breedData: colombianBreedData,
        title: "🇨🇴 Tu mejor opción en Colombia",
        subtitle: `Ranking global: #${results.availability.colombianRank}`,
        advantages: [
          "✅ Disponible en criaderos colombianos",
          "✅ Veterinarios especializados locales",
          "✅ Precios accesibles sin importación",
          "✅ Comunidad de dueños establecida"
        ],
        cardColor: "border-green-200",
        headerColor: "from-green-500 to-emerald-500",
        onViewProfile: () => window.location.href = `/razas/${colombianBreedData.id}`,
        onCompare: () => onCompareBreeds && onCompareBreeds([colombianBreedData])
      }
    ) : /* @__PURE__ */ jsx(
      BreedRecommendationCard,
      {
        recommendation: results.globalRecommendation,
        breedData: globalBreedData,
        title: "🌍 Tu raza teóricamente ideal",
        subtitle: `${results.availability.scoreDifference}% más compatible`,
        advantages: [
          `✨ ${results.availability.scoreDifference}% mejor compatibilidad`,
          "⭐ Características ideales para ti",
          "🎯 Mejor match según algoritmo",
          "⚠️ Requiere búsqueda especializada"
        ],
        cardColor: "border-blue-200",
        headerColor: "from-blue-500 to-indigo-500",
        onViewProfile: () => window.location.href = `/razas/${globalBreedData.id}`,
        onCompare: () => onCompareBreeds && onCompareBreeds([globalBreedData])
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4 text-center", children: "💡 Nuestra Recomendación" }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-4 border border-gray-200", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-center", children: results.availability.message }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-green-50 rounded-lg p-4 border border-green-200", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-green-800 mb-2", children: [
            "🇨🇴 ",
            colombianBreedData.name
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600 mb-1", children: formatScore(results.colombianRecommendation.compatibilityScore) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-green-700", children: "Disponible localmente" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-lg p-4 border border-blue-200", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-bold text-blue-800 mb-2", children: [
            "🌍 ",
            globalBreedData.name
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600 mb-1", children: formatScore(results.globalRecommendation.compatibilityScore) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700", children: "Búsqueda especializada" })
        ] })
      ] })
    ] }),
    results.colombianAlternatives.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "🇨🇴 Otras excelentes opciones en Colombia" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: results.colombianAlternatives.map((alternative, index) => {
        const alternativeData = getFullBreedData(alternative.breed.id);
        if (!alternativeData) return null;
        return /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: alternativeData.image || "/images/breeds/default.jpg",
                alt: alternativeData.name,
                className: "w-12 h-12 rounded-full object-cover mr-3",
                onError: (e) => {
                  e.target.src = "/images/breeds/default.jpg";
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm", children: alternativeData.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600", children: [
                formatScore(alternative.compatibilityScore),
                " compatible"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-700", children: [
            alternative.strengths[0]?.substring(0, 60),
            "..."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex gap-1", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `/razas/${alternativeData.id}`,
                className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors",
                children: "Ver perfil"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onCompareBreeds && onCompareBreeds([alternativeData]),
                className: "text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors",
                children: "Comparar"
              }
            )
          ] })
        ] }, alternative.breed.id);
      }) })
    ] })
  ] });
};
const BreedRecommendationCard = ({
  recommendation,
  breedData,
  title,
  subtitle,
  advantages,
  cardColor,
  headerColor,
  onViewProfile,
  onCompare
}) => /* @__PURE__ */ jsxs("div", { className: `bg-white rounded-xl shadow-lg overflow-hidden border-2 ${cardColor}`, children: [
  /* @__PURE__ */ jsx("div", { className: `bg-gradient-to-r ${headerColor} text-white p-4`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: breedData.name }),
      /* @__PURE__ */ jsx("p", { className: "text-white/90", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-white/80", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
        recommendation.compatibilityScore,
        "%"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80", children: "compatibilidad" })
    ] })
  ] }) }),
  /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: " justify-center", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: breedData.image || "/images/breeds/default.jpg",
          alt: breedData.name,
          className: "w-200 h-200 object-cover rounded-lg ",
          onError: (e) => {
            e.target.src = "/images/breeds/default.jpg";
          }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-3", children: [
          /* @__PURE__ */ jsx("h5", { className: "font-bold text-gray-800 mb-2", children: "📊 Características:" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Tamaño:" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium ml-1", children: breedData.size === "small" ? "Pequeño" : breedData.size === "medium" ? "Mediano" : "Grande" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Tipo:" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium ml-1", children: breedData.type === "dog" ? "🐕 Perro" : "🐱 Gato" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Ideal para:" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: breedData.goodWith && breedData.goodWith.length > 0 ? breedData.goodWith.map((trait, index) => /* @__PURE__ */ jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded", children: mapTraitToSpanish(trait) }, index)) : /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 italic", children: "Información no disponible" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-700 mb-2", children: "✨ Fortalezas para ti:" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: recommendation.strengths.slice(0, 3).map((strength, index) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-gray-600 flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "text-green-500 mr-2 mt-1", children: "•" }),
            /* @__PURE__ */ jsx("span", { children: strength })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-gray-700 mb-2", children: "🎯 Ventajas:" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: advantages.map((advantage, index) => /* @__PURE__ */ jsx("li", { className: "text-sm text-gray-600", children: advantage }, index)) })
        ] }),
        recommendation.challenges.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-orange-700 mb-2", children: "⚠️ Consideraciones:" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: recommendation.challenges.slice(0, 2).map((challenge, index) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-orange-600 flex items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "text-orange-500 mr-2 mt-1", children: "•" }),
            /* @__PURE__ */ jsx("span", { children: challenge })
          ] }, index)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row gap-3 justify-center", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onViewProfile,
          className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors",
          children: "📖 Ver perfil completo"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onCompare,
          className: "px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors",
          children: "🔍 Comparar con otras razas"
        }
      )
    ] })
  ] })
] });
const generateDualRecommendationExplanation = (results) => {
  const colombianBreed = results.colombianRecommendation.breed.name;
  const globalBreed = results.globalRecommendation.breed.name;
  const scoreDiff = results.availability.scoreDifference;
  return {
    title: results.availability.isColombianSameAsGlobal ? `🎯 ¡${colombianBreed} es perfecto para ti!` : `🇨🇴 Tu mejor opción en Colombia vs 🌍 Tu raza ideal teórica`,
    colombianSection: {
      title: `🇨🇴 En Colombia: ${colombianBreed}`,
      subtitle: `${results.colombianRecommendation.compatibilityScore}% de compatibilidad`,
      description: results.availability.isColombianSameAsGlobal ? "Esta es tu raza ideal y está disponible localmente. ¡No necesitas buscar más!" : `Excelente opción disponible en criaderos colombianos. Posición #${results.availability.colombianRank} en el ranking global de compatibilidad contigo.`
    },
    globalSection: {
      title: `🌍 Raza ideal teórica: ${globalBreed}`,
      subtitle: `${results.globalRecommendation.compatibilityScore}% de compatibilidad`,
      description: results.availability.isColombianSameAsGlobal ? "¡Coincide con tu mejor opción colombiana!" : `Sería ${scoreDiff}% más compatible, pero requiere búsqueda especializada o importación.`
    },
    comparisonSection: {
      title: "💡 Nuestra recomendación",
      description: results.availability.message
    }
  };
};

const SuccessNotification = ({
  show,
  title = "¡Éxito!",
  message = "Operación completada exitosamente",
  duration = 5e3,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!show) return;
    setIsVisible(true);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    const closeTimer = setTimeout(() => {
      if (onClose) onClose();
    }, duration + 300);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [show, duration, onClose]);
  if (!show && !isVisible) return null;
  return /* @__PURE__ */ jsx("div", { className: `fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4 max-w-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "w-5 h-5 text-green-600",
          fill: "currentColor",
          viewBox: "0 0 20 20",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
              clipRule: "evenodd"
            }
          )
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "ml-3 flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900", children: title }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: message })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setIsVisible(false);
            if (onClose) {
              setTimeout(onClose, 300);
            }
          },
          className: "ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors",
          children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
              clipRule: "evenodd"
            }
          ) })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-1", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-green-500 h-1 rounded-full transition-all duration-300 ease-linear",
        style: {
          width: isVisible ? "0%" : "100%",
          transition: `width ${duration}ms linear`
        }
      }
    ) }) })
  ] }) });
};

const LeadCaptureForm = ({ onSubmit, onSkip, userAnswers }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError("");
    }
  };
  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("Por favor ingresa tu nombre");
      return false;
    }
    if (!formData.apellido.trim()) {
      setError("Por favor ingresa tu apellido");
      return false;
    }
    if (!formData.correo.trim()) {
      setError("Por favor ingresa tu correo electrónico");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError("Por favor ingresa un correo electrónico válido");
      return false;
    }
    return true;
  };
  const submitToAirtable = async (data) => {
    try {
      const airtablePayload = {
        records: [
          {
            fields: {
              "fldr9O0y5r5qlTuZD": `${data.nombre} ${data.apellido}`,
              // Nombre y apellido
              "fld8tclUxPeoaU20S": data.correo,
              // Correo electronico
              "fldDbuBpfjA0rbbjh": (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
              // Fecha (solo fecha, no hora)
            }
          }
        ]
      };
      console.log("📤 Enviando payload con field IDs correctos:", airtablePayload);
      const response = await fetch("/api/airtable-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(airtablePayload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("✅ Éxito enviando a Airtable:", result);
      return result;
    } catch (error2) {
      console.error("❌ Error submitting to Airtable:", error2);
      throw error2;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const result = await submitToAirtable(formData);
      console.log("✅ Lead guardado exitosamente:", result);
      setShowSuccess(true);
      setTimeout(() => {
        onSubmit({
          ...formData,
          fullName: `${formData.nombre} ${formData.apellido}`
        });
      }, 1500);
    } catch (error2) {
      console.error("❌ Error al enviar datos:", error2);
      if (error2.message.includes("campos")) {
        setError("Error de configuración. Por favor contacta al soporte.");
      } else if (error2.message.includes("network") || error2.message.includes("fetch")) {
        setError("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
      } else {
        setError("Hubo un error al procesar tu información. Por favor intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (showSuccess) {
    return /* @__PURE__ */ jsx(
      SuccessNotification,
      {
        message: "¡Datos guardados exitosamente!",
        onClose: () => setShowSuccess(false)
      }
    );
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-green-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-white text-2xl", children: "🐕" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "¡Casi terminamos!" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm leading-relaxed", children: "Solo necesitamos unos datos para personalizar mejor tu recomendación y enviarte consejos útiles." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nombre *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "nombre",
            value: formData.nombre,
            onChange: handleInputChange,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all",
            placeholder: "Tu nombre",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Apellido *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "apellido",
            value: formData.apellido,
            onChange: handleInputChange,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all",
            placeholder: "Tu apellido",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Correo electrónico *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            name: "correo",
            value: formData.correo,
            onChange: handleInputChange,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all",
            placeholder: "ejemplo@correo.com",
            required: true
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3", children: /* @__PURE__ */ jsx("p", { className: "text-red-600 text-sm", children: error }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 my-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-medium text-green-800 mb-2", children: "✨ Qué recibirás:" }),
        /* @__PURE__ */ jsxs("ul", { className: "text-sm text-green-700 space-y-1", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xs", children: "✓" }) }),
            "Tu recomendación personalizada al instante"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xs", children: "✓" }) }),
            "Consejos exclusivos para tu futura mascota"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xs", children: "✓" }) }),
            "Newsletter con tips de cuidado (opcional)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting,
            className: `w-full py-3 px-4 rounded-lg font-medium transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg"} text-white`,
            children: isSubmitting ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
              /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" }),
              "Procesando..."
            ] }) : "🎯 Ver mi raza ideal"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onSkip,
            className: "w-full py-2 px-4 text-gray-600 hover:text-gray-800 text-sm transition-colors",
            children: "Continuar sin registrarme"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "🔒 Tus datos están seguros. No spam, solo contenido útil." }) })
  ] }) });
};

function getSizePreferenceOptions(petType) {
  if (petType === "cat") {
    return [
      { value: "small", text: "🐱 Pequeño/a - Gatos compactos y delicados (2-4 kg)" },
      { value: "medium", text: "🐱 Mediano/a - Gatos de tamaño estándar (4-6 kg)" },
      { value: "large", text: "🐱 Grande - Gatos robustos como Maine Coon (6+ kg)" },
      { value: "any", text: "🤷‍♀️ No importa - El tamaño no es un factor decisivo" }
    ];
  } else if (petType === "dog") {
    return [
      { value: "small", text: "🐕‍🦺 Pequeño - Fácil de manejar y transportar (hasta 10 kg)" },
      { value: "medium", text: "🐕 Mediano - Equilibrio entre tamaño y facilidad (10-25 kg)" },
      { value: "large", text: "🐕‍🦮 Grande - Me gustan las mascotas imponentes (25+ kg)" },
      { value: "any", text: "🤷‍♀️ No importa - El tamaño no es un factor decisivo" }
    ];
  } else {
    return [
      { value: "small", text: "🐾 Pequeño - Mascotas compactas y manejables" },
      { value: "medium", text: "🐾 Mediano - Tamaño estándar, equilibrado" },
      { value: "large", text: "🐾 Grande - Mascotas de mayor tamaño" },
      { value: "any", text: "🤷‍♀️ No importa - El tamaño no es un factor decisivo" }
    ];
  }
}
function getNoiseToleranceOptions(petType) {
  if (petType === "cat") {
    return [
      { value: "very_low", text: "🤫 Muy poco - Necesito un gato silencioso (apartamento, vecinos)" },
      { value: "low", text: "🔇 Poco - Maullidos ocasionales están bien" },
      { value: "moderate", text: "🔊 Moderado - No me molestan los maullidos normales" },
      { value: "high", text: "📢 Alto - Los maullidos no son problema" },
      { value: "very_high", text: "🗣️ Muy alto - Me gustan los gatos conversadores" }
    ];
  } else if (petType === "dog") {
    return [
      { value: "very_low", text: "🤫 Muy poco - Necesito silencio (apartamento, vecinos)" },
      { value: "low", text: "🔇 Poco - Ladridos ocasionales están bien" },
      { value: "moderate", text: "🔊 Moderado - No me molestan los ladridos normales" },
      { value: "high", text: "📢 Alto - Los ladridos no son problema" },
      { value: "very_high", text: "🔊 Muy alto - Me gustan los perros vocales/guardianes" }
    ];
  } else {
    return [
      { value: "very_low", text: "🤫 Muy poco - Necesito mascotas silenciosas" },
      { value: "low", text: "🔇 Poco - Sonidos ocasionales están bien" },
      { value: "moderate", text: "🔊 Moderado - Nivel normal de vocalizaciones" },
      { value: "high", text: "📢 Alto - No me molesta el ruido" },
      { value: "very_high", text: "🔊 Muy alto - Me gustan las mascotas expresivas" }
    ];
  }
}
function getFeedingPreferenceOptions(petType) {
  if (petType === "cat") {
    return [
      {
        value: "standard",
        text: "🥘 Comida estándar - $25k-40k/mes (1.5kg, buena calidad, económica)"
      },
      {
        value: "premium",
        text: "⭐ Comida premium - $60k/mes (1.5kg, alta proteína, ingredientes especiales)"
      },
      {
        value: "flexible",
        text: "🤷‍♀️ Flexible - Según presupuesto y necesidades del gato"
      }
    ];
  } else if (petType === "dog") {
    return [
      {
        value: "standard",
        text: "🥘 Comida estándar - $60k-150k/mes según tamaño (buena calidad, económica)"
      },
      {
        value: "premium",
        text: "⭐ Comida premium - $120k-280k/mes según tamaño (ingredientes especiales)"
      },
      {
        value: "flexible",
        text: "🤷‍♀️ Flexible - Según presupuesto y necesidades del perro"
      }
    ];
  } else {
    return [
      {
        value: "standard",
        text: "🥘 Comida estándar - Buena calidad, económica"
      },
      {
        value: "premium",
        text: "⭐ Comida premium - Alta calidad, ingredientes especiales"
      },
      {
        value: "flexible",
        text: "🤷‍♀️ Flexible - Según presupuesto y necesidades específicas"
      }
    ];
  }
}
function getDynamicQuestionText(questionId, petType) {
  const questionTexts = {
    sizePreference: {
      dog: "¿Qué tamaño de perro prefieres?",
      cat: "¿Qué tamaño de gato prefieres?",
      any: "¿Qué tamaño de mascota prefieres?"
    },
    noiseToleranceLevel: {
      dog: "¿Cuánto ruido/ladridos puedes tolerar?",
      cat: "¿Cuánto tolerarías las vocalizaciones de tu gato?",
      any: "¿Cuánto ruido puedes tolerar de tu mascota?"
    },
    feedingPreference: {
      dog: "¿Qué tipo de alimentación prefieres para tu perro?",
      cat: "¿Qué tipo de alimentación prefieres para tu gato?",
      any: "¿Qué tipo de alimentación prefieres para tu mascota?"
    }
  };
  return questionTexts[questionId]?.[petType] || questionTexts[questionId]?.["any"] || "";
}
function getDynamicQuizQuestions(answers) {
  const petType = answers.petTypePreference || "any";
  return [
    // Pregunta 1: Tipo de mascota (siempre igual)
    {
      id: "petTypePreference",
      text: "¿Qué tipo de mascota prefieres?",
      type: "single",
      options: [
        { value: "dog", text: "🐕 Perro - Me gustan los animales activos y leales" },
        { value: "cat", text: "🐱 Gato - Prefiero animales más independientes" },
        { value: "any", text: "🤷‍♀️ No tengo preferencia - Estoy abierto a ambos" }
      ]
    },
    // Pregunta 2: Tipo de hogar
    {
      id: "homeType",
      text: "¿Dónde vives actualmente?",
      type: "single",
      options: [
        { value: "apartment_small", text: "🏠 Apartamento pequeño (menos de 60m²)" },
        { value: "apartment_large", text: "🏢 Apartamento grande (más de 60m²)" },
        { value: "house_small", text: "🏡 Casa con jardín pequeño" },
        { value: "house_large", text: "🏘️ Casa con jardín grande o patio amplio" }
      ]
    },
    // Pregunta 3: Horas fuera de casa
    {
      id: "hoursAway",
      text: "¿Cuántas horas al día está vacía tu casa generalmente?",
      type: "single",
      options: [
        { value: "less_than_2", text: "⏰ Menos de 2 horas - Siempre hay alguien en casa" },
        { value: "2_to_4", text: "🕐 Entre 2 y 4 horas - Horario flexible" },
        { value: "4_to_8", text: "🕘 Entre 4 y 8 horas - Jornada laboral estándar" },
        { value: "8_to_12", text: "🕛 Más de 8 horas - Jornadas largas" }
      ]
    },
    // Pregunta 4: Nivel de actividad
    {
      id: "activityLevel",
      text: "¿Cómo describirías tu nivel de actividad física?",
      type: "single",
      options: [
        { value: "sedentary", text: "🛋️ Sedentario - Prefiero actividades tranquilas en casa" },
        { value: "light", text: "🚶‍♀️ Ligero - Paseos ocasionales, actividad mínima" },
        { value: "moderate", text: "🏃‍♀️ Moderado - Ejercicio regular, paseos diarios" },
        { value: "active", text: "🏋️‍♀️ Activo - Ejercicio frecuente, deportes, senderismo" },
        { value: "very_active", text: "🏃‍♂️ Muy activo - Deportista, actividades al aire libre constantes" }
      ]
    },
    // Pregunta 5: Niños en casa
    {
      id: "hasChildren",
      text: "¿Tienes niños en casa?",
      type: "single",
      options: [
        { value: "yes", text: "👶 Sí, tengo niños" },
        { value: "no", text: "🙅‍♀️ No tengo niños" }
      ]
    },
    // Pregunta 6: Edad de los niños (condicional)
    {
      id: "childrenAge",
      text: "¿De qué edad son tus niños?",
      type: "single",
      options: [
        { value: "young_children", text: "👶 Bebés y niños pequeños (0-5 años)" },
        { value: "older_children", text: "🧒 Niños mayores (6-12 años)" },
        { value: "teens", text: "👦 Adolescentes (13+ años)" },
        { value: "no_children", text: "🚫 No tengo niños" }
      ]
    },
    // Pregunta 7: Otras mascotas
    {
      id: "hasOtherPets",
      text: "¿Tienes otras mascotas en casa?",
      type: "single",
      options: [
        { value: "yes", text: "🐾 Sí, tengo otras mascotas" },
        { value: "no", text: "🚫 No tengo otras mascotas" }
      ]
    },
    // Pregunta 8: Tipo de otras mascotas
    {
      id: "otherPets",
      text: "¿Qué tipo de mascotas tienes?",
      type: "multiple",
      options: [
        { value: "dogs", text: "🐕 Perros" },
        { value: "cats", text: "🐱 Gatos" },
        { value: "small_pets", text: "🐰 Mascotas pequeñas (conejos, hamsters, pájaros)" },
        { value: "no_pets", text: "🚫 No tengo otras mascotas" }
      ]
    },
    // Pregunta 9: Experiencia previa
    {
      id: "experience",
      text: "¿Cuál es tu experiencia previa con mascotas?",
      type: "single",
      options: [
        { value: "first_time", text: "🆕 Primera vez - Nunca he tenido mascotas" },
        { value: "some_experience", text: "📚 Algo de experiencia - He tenido mascotas antes" },
        { value: "experienced", text: "🎓 Muy experimentado - He criado/entrenado mascotas" }
      ]
    },
    // 🆕 Pregunta 10: Preferencia de tamaño (DINÉMICA)
    {
      id: "sizePreference",
      text: getDynamicQuestionText("sizePreference", petType),
      type: "single",
      options: getSizePreferenceOptions(petType)
    },
    // Pregunta 11: Largo del pelaje  
    {
      id: "furLengthPreference",
      text: "¿Tienes preferencia por el tipo de pelaje?",
      type: "single",
      options: [
        { value: "short", text: "✂️ Pelo corto - Menos mantenimiento" },
        { value: "medium", text: "🖌️ Pelo mediano - Equilibrio entre apariencia y cuidado" },
        { value: "long", text: "💇‍♀️ Pelo largo - Me gusta el aspecto elegante" },
        { value: "any", text: "🤷‍♀️ No importa - No tengo preferencia" }
      ]
    },
    // 🆕 Pregunta 12: Tolerancia al ruido (DINÉMICA - solo si NO es gato exclusivamente)
    ...petType !== "cat" ? [{
      id: "noiseToleranceLevel",
      text: getDynamicQuestionText("noiseToleranceLevel", petType),
      type: "single",
      options: getNoiseToleranceOptions(petType)
    }] : [],
    // Pregunta 13: Disposición para cuidados
    {
      id: "groomingWillingness",
      text: "¿Cuánto tiempo puedes dedicar al cuidado y aseo?",
      type: "single",
      options: [
        { value: "minimal", text: "⏱️ Mínimo - Solo lo básico (baño ocasional)" },
        { value: "low", text: "🧼 Poco - Cepillado semanal, baños mensuales" },
        { value: "moderate", text: "✨ Moderado - Cuidados regulares, visitas al peluquero" },
        { value: "high", text: "💅 Alto - Cepillado diario, muchos cuidados" },
        { value: "very_high", text: "👑 Muy alto - Disfruto mimando a mi mascota" }
      ]
    },
    // Pregunta 14: Disposición para entrenamiento (solo si NO es gato exclusivamente)
    ...petType !== "cat" ? [{
      id: "trainingWillingness",
      text: "¿Cuánto tiempo y dinero puedes dedicar al entrenamiento?",
      type: "single",
      options: [
        { value: "minimal", text: "⏱️ Mínimo - Solo comandos básicos en casa" },
        { value: "low", text: "📚 Poco - Entrenamiento básico de obediencia casero" },
        { value: "moderate", text: "🎓 Moderado - Clases grupales ocasionales + práctica en casa" },
        { value: "high", text: "🏆 Alto - Entrenador personal o clases regulares" },
        { value: "professional", text: "🥇 Profesional - Colegio canino mensual + entrenamiento avanzado" }
      ]
    }] : [],
    // Pregunta 15: Alergias
    {
      id: "allergies",
      text: "¿Alguien en tu familia tiene alergias a mascotas?",
      type: "single",
      options: [
        { value: "no", text: "✅ No hay alergias en la familia" },
        { value: "yes", text: "🤧 Sí, hay alergias (necesito opciones hipoalergénicas)" }
      ]
    },
    // Pregunta 16: Nivel de alergias (condicional)
    {
      id: "allergyLevel",
      text: "¿Qué tan severas son las alergias?",
      type: "single",
      options: [
        { value: "yes_mild", text: "😌 Leves - Síntomas manejables" },
        { value: "yes_severe", text: "😷 Severas - Necesito razas 100% hipoalergénicas" },
        { value: "no_allergies", text: "✅ No hay alergias" }
      ]
    },
    // Pregunta 17: Presupuesto
    {
      id: "budgetLevel",
      text: "¿Cuál es tu presupuesto mensual para tu mascota? (incluye comida, veterinario, accesorios)",
      type: "single",
      options: [
        { value: "1", text: "💰 Muy bajo (menos de $200.000 COP/mes) - Solo lo esencial" },
        { value: "2", text: "💵 Bajo ($200.000 - $400.000 COP/mes) - Cuidados básicos" },
        { value: "3", text: "💶 Moderado ($400.000 - $700.000 COP/mes) - Cuidados completos" },
        { value: "4", text: "💷 Alto ($700.000 - $1.200.000 COP/mes) - Sin restricciones mayores" },
        { value: "5", text: "💸 Muy alto (más de $1.200.000 COP/mes) - Premium sin límites" }
      ]
    },
    // 🆕 Pregunta 18: Alimentación (DINÉMICA con costos específicos)
    {
      id: "feedingPreference",
      text: getDynamicQuestionText("feedingPreference", petType),
      type: "single",
      options: getFeedingPreferenceOptions(petType)
    },
    // Pregunta 19: Propósito/objetivo
    {
      id: "purpose",
      text: "¿Cuál es tu objetivo principal al tener una mascota?",
      type: "multiple",
      options: [
        { value: "companion", text: "❤️ Compañía - Quiero un mejor amigo" },
        { value: "family", text: "👨‍👩‍👧‍👦 Mascota familiar - Para toda la familia" },
        { value: "guard", text: "🛡️ Protección - Quiero que cuide mi hogar" },
        { value: "therapy", text: "🏥 Terapia/apoyo emocional - Necesidades especiales" },
        { value: "sports", text: "🏃‍♀️ Actividades deportivas - Compañero de ejercicio" }
      ]
    }
  ];
}
function shouldShowQuestion(questionId, answers) {
  const petType = answers.petTypePreference;
  if (questionId === "childrenAge" && answers["hasChildren"] !== "yes") {
    return false;
  }
  if (questionId === "otherPets" && answers["hasOtherPets"] !== "yes") {
    return false;
  }
  if (questionId === "allergyLevel" && answers["allergies"] !== "yes") {
    return false;
  }
  if (petType === "cat") {
    if (questionId === "noiseToleranceLevel") {
      return false;
    }
    if (questionId === "trainingWillingness") {
      return false;
    }
  }
  return true;
}
function collectUserResponses(answers) {
  console.log("🔄 Procesando respuestas del cuestionario:", answers);
  const petType = answers.petTypePreference;
  const profile = {
    homeType: mapHomeType(answers["homeType"]),
    hoursAway: mapHoursAway(answers["hoursAway"]),
    activityLevel: mapActivityLevel(answers["activityLevel"]),
    hasChildren: answers["hasChildren"] === "yes",
    childrenAge: mapChildrenAge(answers["childrenAge"]),
    hasOtherPets: answers["hasOtherPets"] === "yes",
    otherPets: mapPetType(answers["otherPets"]),
    experience: mapExperience(answers["experience"]),
    petTypePreference: petType,
    sizePreference: answers["sizePreference"],
    furLengthPreference: answers["furLengthPreference"],
    // 🆕 VALORES CONDICIONALES PARA GATOS
    noiseToleranceLevel: petType === "cat" ? 2 : mapNoiseToleranceLevel(answers["noiseToleranceLevel"]),
    groomingWillingness: mapGroomingWillingness(answers["groomingWillingness"]),
    trainingWillingness: petType === "cat" ? 2 : mapTrainingWillingness(answers["trainingWillingness"]),
    allergies: answers["allergies"] === "yes",
    allergyLevel: mapAllergyLevel(answers["allergyLevel"]),
    budgetLevel: mapBudgetLevel(answers["budgetLevel"]),
    // 🆕 NORMALIZAR feedingPreference
    feedingPreference: answers["feedingPreference"] || "standard",
    budgetAmount: mapBudgetAmount(answers["budgetLevel"]),
    purpose: mapPurpose(answers["purpose"])
  };
  console.log("✅ Perfil de usuario generado:", profile);
  return profile;
}
function mapHomeType(answer) {
  const homeTypeMap = {
    "apartment_small": "apartment_small",
    "apartment_large": "apartment_large",
    "house_small": "house_small_yard",
    "house_large": "house_large_yard"
  };
  return homeTypeMap[answer] || "apartment_large";
}
function mapHoursAway(answer) {
  const hoursMap = {
    "less_than_2": 1,
    "2_to_4": 3,
    "4_to_8": 6,
    "8_to_12": 10,
    "more_than_12": 12
  };
  return hoursMap[answer] || 6;
}
function mapActivityLevel(answer) {
  const activityMap = {
    "sedentary": 1,
    "light": 2,
    "moderate": 3,
    "active": 4,
    "very_active": 5
  };
  return activityMap[answer] || 3;
}
function mapChildrenAge(answer) {
  return answer || "no_children";
}
function mapPetType(answer) {
  if (Array.isArray(answer)) {
    const validPets = answer.filter(
      (pet) => ["dogs", "cats", "small_pets", "no_pets"].includes(pet)
    );
    if (validPets.includes("no_pets") && validPets.length > 1) {
      return validPets.filter((pet) => pet !== "no_pets");
    }
    if (validPets.length === 0 || validPets.length === 1 && validPets[0] === "no_pets") {
      return "no_pets";
    }
    return validPets;
  }
  return answer || "no_pets";
}
function mapExperience(answer) {
  return answer || "some_experience";
}
function mapNoiseToleranceLevel(answer) {
  const noiseMap = {
    "very_low": 1,
    "low": 2,
    "moderate": 3,
    "high": 4,
    "very_high": 5
  };
  return noiseMap[answer] || 3;
}
function mapGroomingWillingness(answer) {
  const groomingMap = {
    "minimal": 1,
    "low": 2,
    "moderate": 3,
    "high": 4,
    "very_high": 5
  };
  return groomingMap[answer] || 3;
}
function mapTrainingWillingness(answer) {
  const trainingMap = {
    "minimal": 1,
    "low": 2,
    "moderate": 3,
    "high": 4,
    "professional": 5
  };
  return trainingMap[answer] || 3;
}
function mapAllergyLevel(answer) {
  return answer || "no_allergies";
}
function mapBudgetLevel(answer) {
  const budgetMap = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5
  };
  return budgetMap[answer] || 3;
}
function mapPurpose(answers) {
  if (!answers || !Array.isArray(answers)) return ["companion"];
  return answers;
}
function mapBudgetAmount(budgetLevel) {
  const budgetMap = {
    "1": 2e5,
    "2": 4e5,
    "3": 7e5,
    "4": 12e5,
    "5": 2e6
  };
  return budgetMap[budgetLevel] || 7e5;
}

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
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [userLeadData, setUserLeadData] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAllBreeds, setShowAllBreeds] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showComparator, setShowComparator] = useState(false);
  const BREEDS_PER_PAGE = 20;
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const emergencyBreeds = [
      {
        id: "golden-retriever-emergency",
        name: "Golden Retriever",
        type: "dog",
        size: "large",
        energyLevel: 4,
        friendliness: 5,
        grooming: 3,
        training: 4,
        apartmentFriendly: false,
        hypoallergenic: false,
        image: "/images/breeds/golden-retriever.jpg"
      },
      {
        id: "persian-cat-emergency",
        name: "Gato Persa",
        type: "cat",
        size: "medium",
        energyLevel: 2,
        friendliness: 3,
        grooming: 5,
        training: 2,
        apartmentFriendly: true,
        hypoallergenic: false,
        image: "/images/breeds/persian-cat.jpg"
      }
    ];
    async function loadData() {
      try {
        if (!isMounted) return;
        console.log("🔄 Cargando datos del cuestionario...");
        if (!breedsData) {
          console.error("❌ Error: breedsData es undefined o null");
          throw new Error("Datos de razas no disponibles - variable undefined");
        }
        if (!Array.isArray(breedsData)) {
          console.error("❌ Error: breedsData no es un array:", typeof breedsData);
          throw new Error("Datos de razas no disponibles - formato inválido");
        }
        if (breedsData.length === 0) {
          console.error("❌ Error: breedsData está vacío");
          throw new Error("Datos de razas no disponibles - array vacío");
        }
        const validBreeds = breedsData.filter((breed) => {
          if (!breed || typeof breed !== "object") {
            console.warn("⚠️ Raza inválida (no es objeto):", breed);
            return false;
          }
          const requiredStringFields = ["id", "name", "type"];
          for (const field of requiredStringFields) {
            if (!breed[field] || typeof breed[field] !== "string" || breed[field].trim() === "") {
              console.warn(`⚠️ Raza inválida (campo ${field} faltante o inválido):`, breed.name || "Unknown");
              return false;
            }
          }
          if (!["dog", "cat"].includes(breed.type)) {
            console.warn("⚠️ Raza con tipo inválido:", breed.name, breed.type);
            return false;
          }
          const numericFields = ["energyLevel", "friendliness", "grooming"];
          for (const field of numericFields) {
            const value = breed[field];
            if (value !== void 0 && value !== null) {
              const numValue = Number(value);
              if (isNaN(numValue) || numValue < 1 || numValue > 5) {
                console.warn(`⚠️ Raza con ${field} inválido:`, breed.name, value);
                breed[field] = Math.max(1, Math.min(5, Math.round(numValue) || 3));
              }
            } else {
              breed[field] = 3;
              console.warn(`⚠️ Asignando valor por defecto para ${field} en:`, breed.name);
            }
          }
          return true;
        });
        if (!isMounted) return;
        if (validBreeds.length === 0) {
          console.error("❌ Error: No se encontraron razas válidas después del filtrado");
          throw new Error("Datos de razas inválidos - ninguna raza pasó la validación");
        }
        console.log(`✅ Datos validados: ${validBreeds.length} razas válidas de ${breedsData.length} totales`);
        const stats = {
          total: validBreeds.length,
          dogs: validBreeds.filter((b) => b.type === "dog").length,
          cats: validBreeds.filter((b) => b.type === "cat").length,
          withImages: validBreeds.filter((b) => b.image && b.image.trim() !== "").length,
          hypoallergenic: validBreeds.filter((b) => b.hypoallergenic === true).length,
          apartmentFriendly: validBreeds.filter((b) => b.apartmentFriendly === true).length,
          sizes: {
            small: validBreeds.filter((b) => b.size === "small").length,
            medium: validBreeds.filter((b) => b.size === "medium").length,
            large: validBreeds.filter((b) => b.size === "large").length
          },
          averageEnergy: (validBreeds.reduce((sum, b) => sum + (b.energyLevel || 0), 0) / validBreeds.length).toFixed(1),
          averageFriendliness: (validBreeds.reduce((sum, b) => sum + (b.friendliness || 0), 0) / validBreeds.length).toFixed(1)
        };
        console.log("📊 Estadísticas detalladas de razas cargadas:", stats);
        if (!isMounted) {
          console.log("⚠️ Componente desmontado, cancelando actualización de estado");
          return;
        }
        setBreeds(validBreeds);
        setIsLoading(false);
        const dataLoadedEvent = new CustomEvent("breedsDataLoaded", {
          detail: { breeds: validBreeds, stats }
        });
        window.dispatchEvent(dataLoadedEvent);
      } catch (error) {
        if (!isMounted) {
          console.log("⚠️ Componente desmontado, cancelando manejo de error");
          return;
        }
        console.error("❌ Error crítico cargando datos del cuestionario:", {
          message: error.message,
          stack: error.stack,
          breedsDataType: typeof breedsData,
          breedsDataLength: Array.isArray(breedsData) ? breedsData.length : "N/A"
        });
        console.log(`🔄 Usando datos de emergencia: ${emergencyBreeds.length} razas de respaldo`);
        console.log("📋 Razas de emergencia:", emergencyBreeds.map((b) => `${b.name} (${b.type})`));
        setError(`Error cargando datos: ${error.message}. Mostrando razas de ejemplo.`);
        setBreeds(emergencyBreeds);
        setIsLoading(false);
        const errorEvent = new CustomEvent("breedsDataError", {
          detail: { error: error.message, fallbackCount: emergencyBreeds.length }
        });
        window.dispatchEvent(errorEvent);
        if (typeof gtag !== "undefined") {
          gtag("event", "data_loading_error", {
            event_category: "error",
            event_label: "breeds_data_loading",
            value: error.message
          });
        }
      }
    }
    const loadWithDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (isMounted && !abortController.signal.aborted) {
        await loadData();
      }
    };
    loadWithDelay();
    return () => {
      console.log("🧹 Limpiando useEffect de carga de datos...");
      isMounted = false;
      abortController.abort();
    };
  }, []);
  useEffect(() => {
    if (breeds.length > 0) {
      console.log(`🎉 Estado actualizado: ${breeds.length} razas disponibles`);
      const invalidBreeds = breeds.filter(
        (breed) => !breed.id || !breed.name || !breed.type
      );
      if (invalidBreeds.length > 0) {
        console.warn("⚠️ Detectadas razas inválidas en estado:", invalidBreeds);
      }
    }
  }, [breeds]);
  const relevantQuestions = React.useMemo(() => {
    const dynamicQuestions = getDynamicQuizQuestions(answers);
    return dynamicQuestions.filter((question) => shouldShowQuestion(question.id, answers));
  }, [answers]);
  useEffect(() => {
    if (relevantQuestions.length > 0) {
      const progress = (currentQuestionIndex + 1) / relevantQuestions.length * 100;
      setQuizProgress(Math.min(progress, 100));
    }
  }, [currentQuestionIndex, relevantQuestions.length]);
  const handleAnswer = (questionId, answer) => {
    console.log("📝 Respuesta:", { questionId, answer });
    const newAnswers = {
      ...answers,
      [questionId]: answer
    };
    if (questionId === "petTypePreference") {
      if (answer === "cat") {
        delete newAnswers["noiseToleranceLevel"];
        delete newAnswers["trainingWillingness"];
      }
      delete newAnswers["sizePreference"];
      delete newAnswers["feedingPreference"];
    }
    if (questionId === "hasChildren" && answer !== "yes") {
      delete newAnswers["childrenAge"];
    }
    if (questionId === "hasOtherPets" && answer !== "yes") {
      delete newAnswers["otherPets"];
    }
    if (questionId === "allergies" && answer !== "yes") {
      delete newAnswers["allergyLevel"];
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
  const handleLeadSubmit = (leadData) => {
    console.log("📧 Datos capturados:", leadData);
    setUserLeadData(leadData);
    setShowLeadCapture(false);
    calculateDualResults();
  };
  const handleLeadSkip = () => {
    console.log("⏭️ Usuario omitió el registro");
    setShowLeadCapture(false);
    calculateDualResults();
  };
  const calculateDualResults = () => {
    console.log("🇨🇴 Calculando resultados duales Colombia/Global...");
    setIsLoading(true);
    try {
      if (!breeds || breeds.length === 0) {
        throw new Error("No hay razas disponibles para calcular recomendaciones");
      }
      const profile = collectUserResponses(answers);
      console.log("👤 Perfil del usuario:", profile);
      if (!profile || !profile.petTypePreference) {
        throw new Error("Perfil de usuario inválido");
      }
      let availableBreeds = breeds;
      if (profile.petTypePreference !== "any") {
        availableBreeds = breeds.filter((breed) => breed.type === profile.petTypePreference);
        console.log(`🔍 Filtrando por tipo ${profile.petTypePreference}: ${availableBreeds.length} razas disponibles`);
      }
      if (availableBreeds.length === 0) {
        throw new Error(`No hay razas de tipo ${profile.petTypePreference} disponibles`);
      }
      const dualResults = getDualBreedRecommendations(profile, availableBreeds);
      console.log("🎯 Resultados duales calculados:", dualResults);
      if (!dualResults || !dualResults.colombianRecommendation || !dualResults.globalRecommendation) {
        throw new Error("No se pudieron generar recomendaciones duales");
      }
      localStorage.setItem("userProfile", JSON.stringify(profile));
      console.log("💾 Perfil guardado en localStorage");
      setUserProfile(profile);
      setDualRecommendations(dualResults);
      setShowAllBreeds(true);
    } catch (error) {
      console.error("❌ Error calculating dual recommendations:", error);
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
    setSearchTerm("");
    setCurrentPage(1);
    setShowLeadCapture(false);
    setUserLeadData(null);
    setQuizCompleted(false);
  };
  const getFilteredBreeds = () => {
    let filtered = breeds;
    if (searchTerm) {
      filtered = breeds.filter(
        (breed) => breed.name.toLowerCase().includes(searchTerm.toLowerCase()) || breed.type.toLowerCase().includes(searchTerm.toLowerCase()) || breed.size.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (selectedForComparison.length < 3 && !selectedForComparison.find((b) => b.id === breed.id)) {
      setSelectedForComparison((prev) => [...prev, breed]);
    }
  };
  const removeFromComparison = (breedId) => {
    setSelectedForComparison((prev) => prev.filter((breed) => breed.id !== breedId));
  };
  const compareRecommended = () => {
    if (dualRecommendations) {
      const breedsToCompare = [];
      const colombianBreedData = breeds.find((b) => b.id === dualRecommendations.colombianRecommendation.breed.id);
      const globalBreedData = breeds.find((b) => b.id === dualRecommendations.globalRecommendation.breed.id);
      if (colombianBreedData) {
        breedsToCompare.push(colombianBreedData);
      }
      if (globalBreedData && globalBreedData.id !== colombianBreedData?.id) {
        breedsToCompare.push(globalBreedData);
      }
      if (dualRecommendations.colombianAlternatives.length > 0) {
        const alternativeData = breeds.find((b) => b.id === dualRecommendations.colombianAlternatives[0].breed.id);
        if (alternativeData && !breedsToCompare.find((b) => b.id === alternativeData.id)) {
          breedsToCompare.push(alternativeData);
        }
      }
      console.log("🔍 Comparando razas recomendadas:", breedsToCompare.map((b) => b.name));
      setSelectedForComparison(breedsToCompare.slice(0, 3));
      setShowComparator(true);
    }
  };
  const isSelectedForComparison = (breedId) => {
    return selectedForComparison.some((breed) => breed.id === breedId);
  };
  const renderComparisonAnalysis = () => {
    if (!userProfile || selectedForComparison.length === 0) return null;
    const analysisData = selectedForComparison.map((breed) => {
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
    const highCompatibility = analysisData.filter((item) => item.isHighCompatibility);
    const moderateCompatibility = analysisData.filter((item) => item.isModerateCompatibility);
    const lowCompatibility = analysisData.filter((item) => item.isLowCompatibility);
    return /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-white rounded-lg border border-gray-200 shadow-lg p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[#2E2E2E]", children: "Análisis de Compatibilidad" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setShowComparator(false);
              setSelectedForComparison([]);
            },
            className: "text-red-500 hover:text-red-700 text-sm",
            children: "Cerrar comparador"
          }
        )
      ] }),
      highCompatibility.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-green-700 mb-3 flex items-center", children: "🎯 MÁS COMPATIBLES contigo (70%+)" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: highCompatibility.map((item) => renderCompatibilityCard(item, "high")) })
      ] }),
      moderateCompatibility.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-yellow-700 mb-3 flex items-center", children: "⚠️ MODERADAMENTE COMPATIBLES (50-69%)" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: moderateCompatibility.map((item) => renderCompatibilityCard(item, "moderate")) })
      ] }),
      lowCompatibility.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-red-700 mb-3 flex items-center", children: "❌ REQUIEREN CONSIDERACIÓN ESPECIAL (menos del 50%)" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: lowCompatibility.map((item) => renderCompatibilityCard(item, "low")) })
      ] })
    ] });
  };
  const renderCompatibilityCard = (item, type) => {
    const { breed, compatibilityScore, strengths, challenges } = item;
    const getCompatibilityColor = () => {
      if (type === "high") return "bg-green-50 border-green-200";
      if (type === "moderate") return "bg-yellow-50 border-yellow-200";
      return "bg-red-50 border-red-200";
    };
    const getScoreColor = () => {
      if (compatibilityScore >= 70) return "text-green-600";
      if (compatibilityScore >= 50) return "text-yellow-600";
      return "text-red-600";
    };
    return /* @__PURE__ */ jsxs("div", { className: `rounded-lg border p-4 ${getCompatibilityColor()}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: breed.image || "/images/breeds/default.jpg",
              alt: breed.name,
              className: "w-16 h-16 rounded-full object-cover mr-4",
              onError: (e) => {
                e.target.src = "/images/breeds/default.jpg";
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg", children: breed.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
              "Compatibilidad: ",
              /* @__PURE__ */ jsxs("span", { className: `font-bold ${getScoreColor()}`, children: [
                compatibilityScore,
                "%"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => removeFromComparison(breed.id),
            className: "text-gray-400 hover:text-red-500 transition-colors",
            children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
        strengths.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-green-700 mb-2", children: "✓ Aspectos positivos:" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1 text-green-800", children: strengths.slice(0, 3).map((strength, index) => /* @__PURE__ */ jsx("li", { children: strength }, index)) })
        ] }),
        challenges.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-orange-700 mb-2", children: "⚠ Consideraciones:" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1 text-orange-800", children: challenges.slice(0, 3).map((challenge, index) => /* @__PURE__ */ jsx("li", { children: challenge }, index)) })
        ] })
      ] })
    ] }, breed.id);
  };
  if (isLoading && !dualRecommendations) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center items-center py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AFC2D5] mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: breeds.length === 0 ? "Cargando datos de razas..." : "Preparando el cuestionario..." }),
      breeds.length > 0 && /* @__PURE__ */ jsxs("p", { className: "text-sm text-green-500 mt-2", children: [
        breeds.length,
        " razas disponibles"
      ] })
    ] });
  }
  if (showLeadCapture && quizCompleted) {
    return /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsx(
      LeadCaptureForm,
      {
        onSubmit: handleLeadSubmit,
        onSkip: handleLeadSkip,
        userAnswers: answers
      }
    ) });
  }
  if (dualRecommendations) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      userLeadData && /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-green-800 mb-2", children: [
          "¡Hola ",
          userLeadData.nombre,
          "! 👋"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-green-700", children: [
          "Aquí están tus recomendaciones personalizadas. También hemos enviado un resumen a ",
          userLeadData.correo,
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        DualBreedRecommendationResults,
        {
          results: dualRecommendations,
          userLeadData,
          onCompareBreeds: (breedsToCompare) => {
            console.log("🔍 Comparando razas sugeridas:", breedsToCompare);
            const completeBreeds = breedsToCompare.map((breed) => {
              const fullBreed = breeds.find((b) => b.id === breed.id);
              return fullBreed || breed;
            }).filter(Boolean);
            setSelectedForComparison(completeBreeds);
            setShowComparator(true);
          }
        }
      ),
      showAllBreeds && /* @__PURE__ */ jsxs("div", { className: "mt-12 bg-gray-50 rounded-lg p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[#2E2E2E]", children: "Explora todas las razas disponibles" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
            selectedForComparison.length,
            "/3 seleccionadas para comparar"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "¿Tienes una raza en mente?" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Buscar por nombre, tipo o tamaño...",
              value: searchTerm,
              onChange: (e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              },
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AFC2D5]"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: getPaginatedBreeds().map((breed) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsx("div", { className: "h-22 overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: breed.image || "/images/breeds/default.jpg",
              alt: breed.name,
              className: "w-full h-full object-cover",
              onError: (e) => {
                e.target.src = "/images/breeds/default.jpg";
              }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm mb-1", children: breed.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-600 mb-2", children: [
              breed.type === "dog" ? "Perro" : "Gato",
              " • ",
              breed.size === "small" ? "Pequeño" : breed.size === "medium" ? "Mediano" : "Grande"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  if (isSelectedForComparison(breed.id)) {
                    removeFromComparison(breed.id);
                  } else {
                    addToComparison(breed);
                    setShowComparator(true);
                  }
                },
                disabled: !isSelectedForComparison(breed.id) && selectedForComparison.length >= 3,
                className: `w-full px-3 py-1 rounded text-xs font-medium transition-colors ${isSelectedForComparison(breed.id) ? "bg-red-500 hover:bg-red-600 text-white" : selectedForComparison.length >= 3 ? "bg-gray-300 text-white cursor-not-allowed" : "bg-green-500 hover:bg-green-800 text-white"}`,
                children: isSelectedForComparison(breed.id) ? "Quitar" : selectedForComparison.length >= 3 ? "Máximo 3" : "Comparar"
              }
            )
          ] })
        ] }, breed.id)) }),
        getTotalPages() > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center space-x-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
              disabled: currentPage === 1,
              className: "px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50",
              children: "Anterior"
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
            "Página ",
            currentPage,
            " de ",
            getTotalPages()
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((prev) => Math.min(getTotalPages(), prev + 1)),
              disabled: currentPage === getTotalPages(),
              className: "px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50",
              children: "Siguiente"
            }
          )
        ] })
      ] }),
      showComparator && selectedForComparison.length > 0 && renderComparisonAnalysis(),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-center", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-green-900 mb-2", children: "🔍 ¿Quieres comparar tus recomendaciones?" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#5A7251] mb-4", children: "Compara tu raza colombiana vs la ideal global para tomar la mejor decisión" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: compareRecommended,
            className: "px-8 py-3 bg-[#5A7251] hover:bg-[#4A6244] text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg",
            children: "🔍 Comparar mis recomendaciones"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-gray-50 rounded-lg p-6 text-center", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-[#2E2E2E] mb-2", children: "¿Qué sigue?" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Explora más razas, compara opciones o vuelve a hacer el cuestionario" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors",
            onClick: restartQuiz,
            children: "🔄 Volver a empezar"
          }
        ) })
      ] })
    ] });
  }
  if (relevantQuestions.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "text-red-500 mb-4", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 mx-auto", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z", clipRule: "evenodd" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "Error al cargar el cuestionario" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "No se pudieron cargar las preguntas. Por favor, recarga la página." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "px-4 py-2 bg-[#AFC2D5] text-white rounded-md hover:bg-[#9DB3C6] transition-colors",
          children: "Recargar página"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-green-500", children: [
          "Pregunta ",
          currentQuestionIndex + 1,
          " de ",
          relevantQuestions.length
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-green-500", children: [
          Math.round(quizProgress),
          "% completado"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out",
          style: { width: `${quizProgress}%` }
        }
      ) }),
      relevantQuestions[currentQuestionIndex] && /* @__PURE__ */ jsx("div", { className: "mt-2 text-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-green-500 bg-gray-100 px-2 py-1 rounded-full", children: getQuestionCategory(relevantQuestions[currentQuestionIndex].id) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `transition-all duration-300 ${isTransitioning ? "opacity-0 transform translate-x-4" : "opacity-100 transform translate-x-0"}`, children: relevantQuestions.length > 0 && currentQuestionIndex < relevantQuestions.length && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: /* @__PURE__ */ jsx(
      QuizQuestion,
      {
        question: relevantQuestions[currentQuestionIndex],
        onAnswer: handleAnswer,
        currentAnswer: answers[relevantQuestions[currentQuestionIndex]?.id]
      }
    ) }) }),
    relevantQuestions[currentQuestionIndex] && /* @__PURE__ */ jsx("div", { className: "mb-6", children: renderQuestionContext(relevantQuestions[currentQuestionIndex].id, answers) }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-8", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: `flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md text-sm font-medium transition-all ${currentQuestionIndex > 0 ? "hover:bg-gray-50 hover:border-gray-400" : "opacity-50 cursor-not-allowed"}`,
          onClick: goToPreviousQuestion,
          disabled: currentQuestionIndex === 0,
          children: [
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }),
            "Anterior"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-green-500", children: currentQuestionIndex < relevantQuestions.length - 1 ? `${relevantQuestions.length - currentQuestionIndex - 1} preguntas restantes` : "¡Última pregunta!" }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-2 space-x-1", children: Array.from({ length: Math.min(5, relevantQuestions.length) }, (_, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `w-2 h-2 rounded-full ${i <= currentQuestionIndex ? "bg-green-500" : "bg-green-800"}`
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: `flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all ${answers[relevantQuestions[currentQuestionIndex]?.id] ? "bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white shadow-md hover:shadow-lg" : "bg-gray-300 text-white cursor-not-allowed"}`,
          onClick: goToNextQuestion,
          disabled: !answers[relevantQuestions[currentQuestionIndex]?.id],
          children: currentQuestionIndex < relevantQuestions.length - 1 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "Siguiente",
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 ml-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "🇨🇴 Ver mis resultados",
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 ml-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7l5 5m0 0l-5 5m5-5H6" }) })
          ] })
        }
      )
    ] }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AFC2D5] mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "🇨🇴 Calculando tu compatibilidad..." }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm mb-2", children: [
        "Analizamos tus respuestas con las ",
        breeds.length,
        " razas disponibles en nuestro índice"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-blue-50 rounded-lg p-3 mt-4", children: /* @__PURE__ */ jsx("p", { className: "text-blue-800 text-xs", children: "💡 Te mostraremos tanto tu mejor opción en Colombia como tu raza ideal teórica" }) })
    ] }) })
  ] });
};
const getQuestionCategory = (questionId) => {
  const categories = {
    "petTypePreference": "🐕🐱 Tipo de mascota",
    "homeType": "🏠 Vivienda",
    "hoursAway": "⏰ Tiempo disponible",
    "activityLevel": "⚡ Actividad física",
    "hasChildren": "👶 Familia",
    "childrenAge": "👶 Edad de niños",
    "hasOtherPets": "🐾 Otras mascotas",
    "otherPets": "🐾 Tipo de mascotas",
    "experience": "🎓 Experiencia",
    "sizePreference": "📏 Tamaño preferido",
    "furLengthPreference": "💇‍♀️ Tipo de pelaje",
    "noiseToleranceLevel": "🔊 Tolerancia al ruido",
    "groomingWillingness": "💅 Cuidados",
    "trainingWillingness": "🎓 Entrenamiento",
    "allergies": "🤧 Alergias",
    "allergyLevel": "🤧 Nivel de alergias",
    "budgetLevel": "💰 Presupuesto",
    "feedingPreference": "🍖 Alimentación",
    "purpose": "🎯 Objetivo"
  };
  return categories[questionId] || "❓ Información adicional";
};
const renderQuestionContext = (questionId, answers) => {
  const petType = answers.petTypePreference;
  const contextMessages = {
    "petTypePreference": /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-blue-800 text-sm", children: [
      "💡 ",
      /* @__PURE__ */ jsx("strong", { children: "Tip:" }),
      " Esta decisión afectará las siguientes preguntas. Los perros y gatos tienen necesidades muy diferentes."
    ] }) }),
    "budgetLevel": /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-yellow-800 text-sm", children: [
      "💰 ",
      /* @__PURE__ */ jsx("strong", { children: "Importante:" }),
      " Incluye comida, veterinario, accesorios y cuidados. Una mascota puede costar entre $200k-1.2M COP mensuales según la raza."
    ] }) }),
    "feedingPreference": petType && /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-green-800 text-sm", children: [
      "🍖 ",
      /* @__PURE__ */ jsx("strong", { children: "Contexto:" }),
      " ",
      petType === "cat" ? "Para gatos: comida estándar ~$32k/mes, premium ~$60k/mes (1.5kg mensual)" : petType === "dog" ? "Para perros: varía por tamaño desde $60k/mes (pequeños) hasta $280k/mes (grandes premium)" : "Los costos varían significativamente entre perros y gatos"
    ] }) }),
    "hasChildren": /* @__PURE__ */ jsx("div", { className: "bg-purple-50 border border-purple-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-purple-800 text-sm", children: [
      "👶 ",
      /* @__PURE__ */ jsx("strong", { children: "Seguridad:" }),
      " La compatibilidad con niños es crucial. Algunas razas son naturalmente más pacientes con los pequeños."
    ] }) })
  };
  return contextMessages[questionId] || null;
};

const $$TuRazaIdeal = createComponent(($$result, $$props, $$slots) => {
  const title = "Tu Raza Ideal | Descubre la mascota perfecta para ti";
  const description = "Contesta unas simples preguntas y te mostraremos qu\xE9 razas de perros o gatos se adaptan mejor a tu estilo de vida y preferencias.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-[#f3f3f3] bg-opacity-20 py-12"> ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` <div class="max-w-3xl mx-auto text-center mb-10"> <h1 class="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
🎯 Descubre tu mascota ideal
</h1> <p class="text-lg text-gray-600 mb-6">
¿Estás pensando en adoptar una mascota pero no sabes qué raza elegir? 
          Nuestro cuestionario inteligente analiza tu estilo de vida y te recomienda 
          las razas más compatibles contigo.
</p> <!-- Beneficios del cuestionario --> <div class="bg-white rounded-lg shadow-sm p-6 mb-8"> <h2 class="text-xl font-bold text-[#2E2E2E] mb-4">¿Qué obtienes al completarlo?</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"> <div class="flex items-start"> <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> </div> <div> <h3 class="font-bold text-sm">Recomendación personalizada</h3> <p class="text-sm text-gray-600">Tu raza ideal con puntuación de compatibilidad específica</p> </div> </div> <div class="flex items-start"> <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path> </svg> </div> <div> <h3 class="font-bold text-sm">Análisis detallado</h3> <p class="text-sm text-gray-600">Por qué es compatible y qué considerar antes de adoptar</p> </div> </div> <div class="flex items-start"> <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path> </svg> </div> <div> <h3 class="font-bold text-sm">Comparador mejorado</h3> <p class="text-sm text-gray-600">Análisis personalizado cuando uses nuestro comparador</p> </div> </div> <div class="flex items-start"> <div class="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path> </svg> </div> <div> <h3 class="font-bold text-sm">Prevención de problemas</h3> <p class="text-sm text-gray-600">Evita adopciones problemáticas con información anticipada</p> </div> </div> </div> </div> </div> <div class="bg-white rounded-lg shadow-md overflow-hidden"> <div class="p-6 md:p-8"> ${renderComponent($$result3, "BreedMatchQuiz", BreedMatchQuiz, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/features/breed-quiz/BreedMatchQuiz.jsx", "client:component-export": "default" })} </div> </div> <div class="max-w-3xl mx-auto mt-12 text-center"> <h2 class="text-2xl font-bold text-[#2E2E2E] mb-4">
🤔 ¿Por qué es importante elegir la raza adecuada?
</h2> <p class="text-gray-600 mb-8">
Cada raza tiene características y necesidades diferentes. Encontrar 
          la que mejor se adapte a tu estilo de vida aumentará la felicidad 
          tanto de tu mascota como tuya, y reducirá los problemas de convivencia 
          y abandono.
</p> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <div class="bg-white p-6 rounded-lg shadow-sm"> <div class="w-12 h-12 bg-[#AFC2D5] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#AFC2D5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path> </svg> </div> <h3 class="text-lg font-bold text-[#2E2E2E] mb-2">🏠 Espacio</h3> <p class="text-gray-600 text-sm">
Algunas razas necesitan mucho espacio para correr, mientras que 
              otras son perfectas para apartamentos pequeños.
</p> </div> <div class="bg-white p-6 rounded-lg shadow-sm"> <div class="w-12 h-12 bg-[#F6B89E] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#F6B89E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> </div> <h3 class="text-lg font-bold text-[#2E2E2E] mb-2">⚡ Energía</h3> <p class="text-gray-600 text-sm">
El nivel de actividad de tu mascota debe coincidir con tu propio 
              estilo de vida para evitar problemas de comportamiento.
</p> </div> <div class="bg-white p-6 rounded-lg shadow-sm"> <div class="w-12 h-12 bg-[#C8D6B9] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#5A7251]" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <h3 class="text-lg font-bold text-[#2E2E2E] mb-2">⏰ Tiempo</h3> <p class="text-gray-600 text-sm">
Algunas razas requieren más tiempo para cuidados, paseos y 
              entrenamiento que otras.
</p> </div> </div> </div>  <div class="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white"> <div class="text-center mb-8"> <h2 class="text-2xl font-bold mb-2">📊 ¿Sabías que...?</h2> <p class="opacity-90">Datos importantes sobre adopción de mascotas</p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"> <div> <div class="text-3xl font-bold mb-2">23%</div> <p class="text-sm opacity-90">de las mascotas son devueltas a refugios por incompatibilidad de raza</p> </div> <div> <div class="text-3xl font-bold mb-2">67%</div> <p class="text-sm opacity-90">de los problemas de comportamiento se deben a necesidades no satisfechas</p> </div> <div> <div class="text-3xl font-bold mb-2">89%</div> <p class="text-sm opacity-90">de las familias que investigan antes de adoptar están más satisfechas</p> </div> </div> <div class="text-center mt-6"> <p class="text-sm opacity-90"> <strong>Nuestro cuestionario te ayuda a estar en ese 89% de familias satisfechas</strong> </p> </div> </div>  <div class="max-w-3xl mx-auto mt-16 bg-white p-6 md:p-8 rounded-lg shadow-md"> <h2 class="text-2xl font-bold text-[#2E2E2E] mb-6 text-center">
❓ Preguntas frecuentes
</h2> <div class="space-y-6"> <div class="border-b border-gray-200 pb-4"> <h3 class="text-lg font-bold text-[#2E2E2E] mb-2">¿Cómo funciona el algoritmo de recomendación?</h3> <p class="text-gray-600">
Nuestro sistema analiza más de 15 factores de tu estilo de vida (espacio, tiempo, actividad, familia, presupuesto, etc.) 
              y los compara con las características de cada raza. Genera una puntuación de compatibilidad del 0 al 100% 
              y te explica específicamente por qué cada raza es buena o problemática para TU situación particular.
</p> </div> <div class="border-b border-gray-200 pb-4"> <h3 class="text-lg font-bold text-[#2E2E2E] mb-2">¿Qué pasa si mi raza ideal no está disponible en refugios locales?</h3> <p class="text-gray-600">
Nuestro cuestionario te recomienda las 5 razas más compatibles, no solo una. Además, muchas veces encontrarás 
              mezclas de estas razas en refugios que mantienen las características positivas. También puedes usar nuestro 
              comparador para explorar razas similares que podrían estar disponibles.
</p> </div> <div class="border-b border-gray-200 pb-4"> <h3 class="text-lg font-bold text-[#2E2E2E] mb-2">¿Las recomendaciones son precisas al 100%?</h3> <p class="text-gray-600">
Nuestro algoritmo usa datos estadísticos y características generales de cada raza, pero cada animal es único. 
              La puntuación de compatibilidad es una guía muy útil, pero siempre recomendamos conocer al animal individual 
              antes de adoptar. Lo importante es que te damos información que el 90% de las personas no considera al elegir mascota.
</p> </div> <div> <h3 class="text-lg font-bold text-[#2E2E2E] mb-2">¿Puedo hacer el cuestionario varias veces?</h3> <p class="text-gray-600">
¡Por supuesto! Puedes repetir el cuestionario si tu situación cambia (mudanza, cambio de trabajo, nueva pareja, etc.) 
              o si quieres explorar diferentes escenarios. Cada vez que lo completes, se guardará tu nuevo perfil para usar 
              en el comparador de razas.
</p> </div> </div> </div>  <div class="text-center mt-12"> <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6"> <h3 class="text-lg font-bold text-yellow-800 mb-2">🎯 ¿Listo para comenzar?</h3> <p class="text-yellow-700 text-sm">
El cuestionario toma solo 3-5 minutos y puede ahorrarte años de problemas con una mascota incompatible.
</p> </div> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="#" onclick="document.querySelector('.bg-white.rounded-lg.shadow-md').scrollIntoView({behavior: 'smooth'})" class="px-6 py-3 bg-[#AFC2D5] hover:bg-[#9DB3C6] text-white rounded-md font-medium transition-colors">
↑ Comenzar cuestionario
</a> <a href="/comparador-razas" class="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium transition-colors">
Ver comparador de razas
</a> </div> </div> ` })} </div> ` })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/tu-raza-ideal.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/tu-raza-ideal.astro";
const $$url = "/tu-raza-ideal";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TuRazaIdeal,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
