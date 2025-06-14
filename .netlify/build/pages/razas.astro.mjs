/* empty css                                      */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D02iGaEB.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Container } from '../chunks/Container_DjUMO5lw.mjs';
import { $ as $$Button } from '../chunks/Button_CImbW17Y.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { c as calculateCompatibilityScore, i as identifyStrengths, a as identifyChallenges } from '../chunks/breedMatcher_D0ea6ER8.mjs';
import { b as breedsData } from '../chunks/index_NJrSibqZ.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const FilterableBreedsList = ({
  initialBreeds = [],
  children,
  onFilterChange,
  activeFilters = {},
  selectedBreeds = [],
  onBreedSelect
}) => {
  const [breeds, setBreeds] = useState(initialBreeds || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [localFilters, setLocalFilters] = useState(() => ({
    type: [],
    size: [],
    energyLevel: [],
    furLength: [],
    hypoallergenic: null,
    goodWith: [],
    experience: [],
    apartmentFriendly: null,
    ...activeFilters
  }));
  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      ...activeFilters
    }));
  }, [activeFilters]);
  const BREEDS_PER_PAGE = 20;
  useEffect(() => {
    console.log("🐕 FilterableBreedsList - Initial breeds:", initialBreeds?.length);
  }, [initialBreeds]);
  useEffect(() => {
    if (initialBreeds && initialBreeds.length > 0) {
      setBreeds(initialBreeds);
      console.log("✅ Breeds updated:", initialBreeds.length);
    }
  }, [initialBreeds]);
  const filteredAndSearchedBreeds = useMemo(() => {
    if (!breeds || breeds.length === 0) {
      console.log("❌ No breeds to filter");
      return [];
    }
    let results = [...breeds];
    console.log("🚀 Starting filter with", results.length, "breeds");
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      results = results.filter((breed) => {
        const nameMatch = breed.name?.toLowerCase().includes(searchLower);
        const typeMatch = breed.type?.toLowerCase().includes(searchLower);
        const sizeMatch = breed.size?.toLowerCase().includes(searchLower);
        return nameMatch || typeMatch || sizeMatch;
      });
    }
    if (localFilters.type && localFilters.type.length > 0) {
      results = results.filter((breed) => {
        return localFilters.type.includes(breed.type);
      });
    }
    if (localFilters.size && localFilters.size.length > 0) {
      results = results.filter((breed) => {
        return localFilters.size.includes(breed.size);
      });
    }
    if (localFilters.energyLevel && localFilters.energyLevel.length > 0) {
      results = results.filter((breed) => {
        const energy = parseInt(breed.energyLevel) || 0;
        let energyCategory;
        if (energy <= 2) energyCategory = "low";
        else if (energy <= 3) energyCategory = "medium";
        else energyCategory = "high";
        return localFilters.energyLevel.includes(energyCategory);
      });
    }
    if (localFilters.furLength && localFilters.furLength.length > 0) {
      results = results.filter((breed) => {
        if (breed.furLength) {
          return localFilters.furLength.includes(breed.furLength);
        }
        const grooming = parseInt(breed.grooming) || 0;
        let furType;
        if (grooming <= 2) furType = "short";
        else if (grooming <= 3) furType = "medium";
        else furType = "long";
        return localFilters.furLength.includes(furType);
      });
    }
    if (localFilters.hypoallergenic !== null && localFilters.hypoallergenic !== void 0) {
      results = results.filter((breed) => {
        return breed.hypoallergenic === localFilters.hypoallergenic;
      });
    }
    console.log("✅ Final filtered results:", results.length, "breeds");
    return results;
  }, [breeds, searchTerm, localFilters]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSearchedBreeds]);
  const getPaginatedBreeds = () => {
    const startIndex = (currentPage - 1) * BREEDS_PER_PAGE;
    const endIndex = startIndex + BREEDS_PER_PAGE;
    return filteredAndSearchedBreeds.slice(startIndex, endIndex);
  };
  const getTotalPages = () => {
    return Math.ceil(filteredAndSearchedBreeds.length / BREEDS_PER_PAGE);
  };
  const handleSearch = (newSearchTerm) => {
    console.log("🔍 Search term changed:", newSearchTerm);
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };
  const renderBreedCard = (breed) => {
    const isSelected = selectedBreeds.some((selected) => selected.id === breed.id);
    if (typeof children === "function") {
      return /* @__PURE__ */ jsx(
        "div",
        {
          "data-breed-id": breed.id,
          className: "breed-card-wrapper",
          children: children(breed, isSelected)
        },
        `${breed.id}-${isSelected ? "selected" : "unselected"}`
      );
    }
    return children;
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Filtros y búsqueda" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Buscar raza" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Nombre de la raza...",
              value: searchTerm,
              onChange: (e) => handleSearch(e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de mascota" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: localFilters.type.length > 0 ? localFilters.type[0] : "all",
              onChange: (e) => {
                const newType = e.target.value === "all" ? [] : [e.target.value];
                setLocalFilters((prev) => ({ ...prev, type: newType }));
              },
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todos" }),
                /* @__PURE__ */ jsx("option", { value: "dog", children: "🐕 Perros" }),
                /* @__PURE__ */ jsx("option", { value: "cat", children: "🐱 Gatos" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tamaño" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: localFilters.size.length > 0 ? localFilters.size[0] : "all",
              onChange: (e) => {
                const newSize = e.target.value === "all" ? [] : [e.target.value];
                setLocalFilters((prev) => ({ ...prev, size: newSize }));
              },
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todos los tamaños" }),
                /* @__PURE__ */ jsx("option", { value: "small", children: "Pequeño" }),
                /* @__PURE__ */ jsx("option", { value: "medium", children: "Mediano" }),
                /* @__PURE__ */ jsx("option", { value: "large", children: "Grande" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nivel de energía" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: localFilters.energyLevel.length > 0 ? localFilters.energyLevel[0] : "all",
              onChange: (e) => {
                const newEnergy = e.target.value === "all" ? [] : [e.target.value];
                setLocalFilters((prev) => ({ ...prev, energyLevel: newEnergy }));
              },
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todos los niveles" }),
                /* @__PURE__ */ jsx("option", { value: "low", children: "⚡ Baja energía" }),
                /* @__PURE__ */ jsx("option", { value: "medium", children: "⚡⚡ Energía moderada" }),
                /* @__PURE__ */ jsx("option", { value: "high", children: "⚡⚡⚡ Alta energía" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de pelo" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: localFilters.furLength.length > 0 ? localFilters.furLength[0] : "all",
              onChange: (e) => {
                const newFur = e.target.value === "all" ? [] : [e.target.value];
                setLocalFilters((prev) => ({ ...prev, furLength: newFur }));
              },
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todos los tipos" }),
                /* @__PURE__ */ jsx("option", { value: "short", children: "✂️ Pelo corto" }),
                /* @__PURE__ */ jsx("option", { value: "medium", children: "✂️ Pelo medio" }),
                /* @__PURE__ */ jsx("option", { value: "long", children: "✂️ Pelo largo" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Hipoalergénico" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: localFilters.hypoallergenic === null ? "all" : localFilters.hypoallergenic.toString(),
              onChange: (e) => {
                const value = e.target.value === "all" ? null : e.target.value === "true";
                setLocalFilters((prev) => ({ ...prev, hypoallergenic: value }));
              },
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todos" }),
                /* @__PURE__ */ jsx("option", { value: "true", children: "🌿 Solo hipoalergénicos" }),
                /* @__PURE__ */ jsx("option", { value: "false", children: "❌ No hipoalergénicos" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "md:col-span-2 flex items-end", children: /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: Object.values(localFilters).some(
        (filter) => Array.isArray(filter) && filter.length > 0 || filter !== null && filter !== void 0 && !Array.isArray(filter)
      ) && /* @__PURE__ */ jsxs("span", { className: "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium", children: [
        [
          ...localFilters.type,
          ...localFilters.size,
          ...localFilters.energyLevel,
          ...localFilters.furLength,
          ...localFilters.hypoallergenic !== null ? ["hipoalergénico"] : []
        ].length,
        " filtros activos"
      ] }) }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          filteredAndSearchedBreeds.length,
          " raza",
          filteredAndSearchedBreeds.length !== 1 ? "s" : "",
          " encontrada",
          filteredAndSearchedBreeds.length !== 1 ? "s" : ""
        ] }),
        (searchTerm || localFilters.type.length > 0 || localFilters.size.length > 0 || localFilters.energyLevel.length > 0 || localFilters.furLength.length > 0 || localFilters.hypoallergenic !== null) && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSearchTerm("");
              setLocalFilters((prev) => ({
                ...prev,
                type: [],
                size: [],
                energyLevel: [],
                furLength: [],
                hypoallergenic: null
              }));
            },
            className: "text-sm text-green-600 hover:text-green-700 font-medium",
            children: "Limpiar todos los filtros"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" }) }) : /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          "Mostrando ",
          Math.min(BREEDS_PER_PAGE, filteredAndSearchedBreeds.length - (currentPage - 1) * BREEDS_PER_PAGE),
          " de ",
          filteredAndSearchedBreeds.length,
          " razas"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
          "Página ",
          currentPage,
          " de ",
          getTotalPages() || 1
        ] }),
        selectedBreeds.length > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 font-medium", children: [
          selectedBreeds.length,
          "/3 razas seleccionadas para comparar"
        ] })
      ] }) }),
      filteredAndSearchedBreeds.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8", children: getPaginatedBreeds().map((breed) => renderBreedCard(breed)) }),
        getTotalPages() > 1 && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center space-x-4 py-6", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
              disabled: currentPage === 1,
              className: "px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors",
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
              className: "px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors",
              children: "Siguiente"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🔍" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No se encontraron razas" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: searchTerm ? `No hay razas que coincidan con "${searchTerm}" y los filtros aplicados.` : "No hay razas que coincidan con los filtros aplicados." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setSearchTerm("");
              setLocalFilters((prev) => ({
                ...prev,
                type: [],
                size: [],
                energyLevel: [],
                furLength: [],
                hypoallergenic: null
              }));
            },
            className: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium",
            children: "Limpiar todos los filtros"
          }
        )
      ] })
    ] }) })
  ] });
};

const analyzeBreedComparison = (selectedBreeds) => {
  if (selectedBreeds.length < 2) return null;
  const characteristics = [
    {
      key: "energyLevel",
      label: "Nivel de energía",
      emoji: "⚡",
      higherIsBetter: null,
      // Depende del usuario
      descriptions: {
        higher: "más energético",
        lower: "más tranquilo",
        equal: "mismo nivel de energía"
      }
    },
    {
      key: "friendliness",
      label: "Sociabilidad",
      emoji: "🤝",
      higherIsBetter: true,
      descriptions: {
        higher: "más sociable",
        lower: "más reservado",
        equal: "igual de sociable"
      }
    },
    {
      key: "grooming",
      label: "Cuidados",
      emoji: "✂️",
      higherIsBetter: false,
      descriptions: {
        higher: "necesita más cuidados",
        lower: "requiere menos cuidados",
        equal: "necesitan el mismo nivel de cuidados"
      }
    },
    {
      key: "training",
      label: "Entrenabilidad",
      emoji: "🎓",
      higherIsBetter: true,
      descriptions: {
        higher: "más fácil de entrenar",
        lower: "más desafiante de entrenar",
        equal: "igual de fácil de entrenar"
      }
    },
    {
      key: "healthIssues",
      label: "Problemas de salud",
      emoji: "💊",
      higherIsBetter: false,
      descriptions: {
        higher: "más propenso a problemas de salud",
        lower: "más saludable",
        equal: "similar predisposición a problemas de salud"
      }
    },
    {
      key: "noiseLevel",
      label: "Nivel de ruido",
      emoji: "🔊",
      higherIsBetter: false,
      descriptions: {
        higher: "más ruidoso",
        lower: "más silencioso",
        equal: "mismo nivel de ruido"
      }
    },
    {
      key: "costLevel",
      label: "Costo de mantenimiento",
      emoji: "💰",
      higherIsBetter: false,
      descriptions: {
        higher: "más costoso de mantener",
        lower: "más económico de mantener",
        equal: "similar costo de mantenimiento"
      }
    },
    {
      key: "independenceLevel",
      label: "Independencia",
      emoji: "🏠",
      higherIsBetter: null,
      descriptions: {
        higher: "más independiente",
        lower: "más dependiente/apegado",
        equal: "mismo nivel de independencia"
      }
    }
  ];
  const comparisons = characteristics.map((char) => {
    const values = selectedBreeds.map((breed) => ({
      breed,
      value: parseInt(breed[char.key]) || 0,
      name: breed.name
    }));
    const sortedValues = [...values].sort((a, b) => b.value - a.value);
    const highest = sortedValues[0];
    const lowest = sortedValues[sortedValues.length - 1];
    const uniqueValues = [...new Set(values.map((v) => v.value))];
    const hasVariation = uniqueValues.length > 1;
    let analysis = null;
    if (!hasVariation) {
      analysis = {
        type: "equal",
        message: `Todas ${char.descriptions.equal}`
      };
    } else {
      const highestBreeds = values.filter((v) => v.value === highest.value);
      const lowestBreeds = values.filter((v) => v.value === lowest.value);
      if (highestBreeds.length === 1 && lowestBreeds.length === 1) {
        analysis = {
          type: "clear_difference",
          highest: {
            breeds: highestBreeds,
            description: char.descriptions.higher,
            value: highest.value
          },
          lowest: {
            breeds: lowestBreeds,
            description: char.descriptions.lower,
            value: lowest.value
          }
        };
      } else {
        analysis = {
          type: "partial_ties",
          highest: {
            breeds: highestBreeds,
            description: char.descriptions.higher,
            value: highest.value
          },
          lowest: {
            breeds: lowestBreeds,
            description: char.descriptions.lower,
            value: lowest.value
          }
        };
      }
    }
    return {
      ...char,
      values,
      analysis,
      hasVariation
    };
  });
  const insights = generateGeneralInsights(selectedBreeds);
  return {
    comparisons: comparisons.filter((c) => c.hasVariation),
    // Solo mostrar donde hay diferencias
    insights,
    summary: generateSummary(selectedBreeds, comparisons)
  };
};
const generateGeneralInsights = (breeds, comparisons) => {
  const insights = [];
  const types = breeds.map((b) => b.type);
  const uniqueTypes = [...new Set(types)];
  if (uniqueTypes.length > 1) {
    insights.push({
      type: "species_mix",
      icon: "🐕🐱",
      title: "Comparación entre especies",
      message: "Estás comparando diferentes especies. Recuerda que perros y gatos tienen necesidades naturalmente diferentes."
    });
  }
  const dogs = breeds.filter((b) => b.type === "dog");
  if (dogs.length >= 2) {
    const sizes = dogs.map((d) => d.size);
    const uniqueSizes = [...new Set(sizes)];
    if (uniqueSizes.length > 1) {
      const sizeOrder = { small: 1, medium: 2, large: 3 };
      const sortedSizes = uniqueSizes.sort((a, b) => sizeOrder[a] - sizeOrder[b]);
      insights.push({
        type: "size_difference",
        icon: "📏",
        title: "Diferentes tamaños",
        message: `Hay razas de tamaño ${sortedSizes.join(", ")}. Considera el espacio disponible y tus preferencias.`
      });
    }
  }
  const energyLevels = breeds.map((b) => parseInt(b.energyLevel) || 0);
  const maxEnergy = Math.max(...energyLevels);
  const minEnergy = Math.min(...energyLevels);
  if (maxEnergy - minEnergy >= 3) {
    insights.push({
      type: "energy_gap",
      icon: "⚡",
      title: "Gran diferencia de energía",
      message: "Hay una diferencia significativa en los niveles de energía. Considera tu estilo de vida y tiempo disponible."
    });
  }
  const groomingLevels = breeds.map((b) => parseInt(b.grooming) || 0);
  const maxGrooming = Math.max(...groomingLevels);
  const minGrooming = Math.min(...groomingLevels);
  if (maxGrooming - minGrooming >= 2) {
    insights.push({
      type: "grooming_difference",
      icon: "✂️",
      title: "Diferentes necesidades de cuidado",
      message: "Las razas seleccionadas tienen muy diferentes necesidades de aseo y cuidado."
    });
  }
  return insights;
};
const generateSummary = (breeds, comparisons) => {
  const summary = {
    totalBreeds: breeds.length,
    types: [...new Set(breeds.map((b) => b.type))],
    mainDifferences: [],
    recommendations: []
  };
  const significantDiffs = comparisons.filter((c) => c.hasVariation).map((c) => {
    const values = c.values.map((v) => v.value);
    const variance = Math.max(...values) - Math.min(...values);
    return { ...c, variance };
  }).sort((a, b) => b.variance - a.variance).slice(0, 3);
  summary.mainDifferences = significantDiffs.map((diff) => ({
    characteristic: diff.label,
    variance: diff.variance,
    emoji: diff.emoji
  }));
  const recommendations = generateSmartRecommendations(breeds, significantDiffs);
  summary.recommendations = recommendations;
  return summary;
};
const generateSmartRecommendations = (breeds, significantDiffs) => {
  const recommendations = [];
  significantDiffs.forEach((diff) => {
    const winner = diff.analysis?.highest;
    const lower = diff.analysis?.lowest;
    if (!winner || !lower) return;
    const winnerName = winner.breeds?.[0]?.name;
    const loserName = lower.breeds?.[0]?.name;
    switch (diff.key) {
      case "energyLevel":
        if (diff.variance >= 3) {
          recommendations.push(`Si tienes estilo de vida activo, ${winnerName} será ideal. Si prefieres tranquilidad, ${loserName} es mejor opción.`);
        } else {
          recommendations.push(`La diferencia de energía es manejable. Ambas razas se pueden adaptar con el ejercicio adecuado.`);
        }
        break;
      case "grooming":
        if (diff.variance >= 2) {
          recommendations.push(`${winnerName} necesita mucho más cuidado de pelaje. Considera si tienes tiempo o presupuesto para grooming profesional.`);
        }
        break;
      case "training":
        if (diff.variance >= 2) {
          recommendations.push(`${winnerName} será más fácil de entrenar para principiantes. ${loserName} requiere más paciencia y experiencia.`);
        }
        break;
      case "noiseLevel":
        if (diff.variance >= 2) {
          recommendations.push(`Si vives en apartamento o tienes vecinos cercanos, ${lower.breeds?.[0]?.name} (más silencioso) causará menos problemas.`);
        }
        break;
      case "healthIssues":
        if (diff.variance >= 2) {
          recommendations.push(`${lower.breeds?.[0]?.name} tiende a ser más saludable, lo que significa menos gastos veterinarios a largo plazo.`);
        }
        break;
      case "costLevel":
        if (diff.variance >= 2) {
          recommendations.push(`${lower.breeds?.[0]?.name} será más económico de mantener. Evalúa tu presupuesto a largo plazo.`);
        }
        break;
      case "independenceLevel":
        if (diff.variance >= 2) {
          recommendations.push(`Si trabajas muchas horas fuera, ${winner.breeds?.[0]?.name} manejará mejor la soledad.`);
        }
        break;
    }
  });
  if (recommendations.length === 0) {
    recommendations.push("Las razas son muy similares. Tu decisión puede basarse en preferencias estéticas o disponibilidad local.");
  }
  const hasHighVariance = significantDiffs.some((diff) => diff.variance >= 3);
  if (hasHighVariance) {
    recommendations.push("Las diferencias son importantes. Te recomendamos conocer las razas en persona antes de decidir.");
  }
  const types = [...new Set(breeds.map((b) => b.type))];
  if (types.length > 1) {
    recommendations.push("Estás comparando perros y gatos. Considera que las necesidades y cuidados son naturalmente diferentes.");
  }
  return recommendations.slice(0, 2);
};
const ComparativeAnalysis = ({ selectedBreeds, userProfile = null }) => {
  const analysis = analyzeBreedComparison(selectedBreeds);
  if (!analysis) return null;
  const renderProgressComparison = (comparison) => {
    const maxValue = Math.max(...comparison.values.map((v) => v.value));
    return /* @__PURE__ */ jsx("div", { className: "space-y-3", children: comparison.values.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 w-32 flex-shrink-0", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: item.breed.image,
            alt: item.breed.name,
            className: "w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm",
            onError: (e) => {
              e.target.src = "/images/breeds/default-pet.jpg";
            }
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-700 truncate", children: item.breed.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-full rounded-full transition-all duration-1000 ease-out ${item.value === maxValue ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-blue-400 to-blue-600"}`,
            style: { width: `${item.value / 5 * 100}%` }
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "absolute -right-1 -top-6", children: /* @__PURE__ */ jsxs("span", { className: `text-xs font-bold px-2 py-1 rounded-full text-white shadow-sm ${item.value === maxValue ? "bg-green-500" : "bg-blue-500"}`, children: [
          item.value,
          "/5"
        ] }) })
      ] })
    ] }, index)) });
  };
  const renderVsComparison = (comparison) => {
    if (comparison.analysis.type === "equal") {
      return /* @__PURE__ */ jsxs("div", { className: "text-center py-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl mb-2", children: "🤝" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 font-medium", children: comparison.analysis.message })
      ] });
    }
    const winner = comparison.analysis.highest;
    const lower = comparison.analysis.lowest;
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 ", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold", children: "👑" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-green-800", children: winner.breeds.map((b) => b.name).join(", ") }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-green-600 capitalize", children: winner.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-700", children: winner.value }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-green-600", children: "de 5" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center -my-2 relative z-10", children: /* @__PURE__ */ jsx("div", { className: "bg-white border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-gray-600", children: "VS" }) }) }),
      lower && lower.value !== winner.value && /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 mt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold", children: "📉" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-orange-800", children: lower.breeds.map((b) => b.name).join(", ") }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-orange-600 capitalize", children: lower.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-700", children: lower.value }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-orange-600", children: "de 5" })
        ] })
      ] }) })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: "  overflow-hidden relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 " }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-full shadow-lg mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xl", children: "📊" }),
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold", children: [
            "Análisis comparativo de ",
            selectedBreeds.length,
            " razas"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Aquí puedes ver cómo se comparan tus razas seleccionadas en diferentes características importantes." })
      ] }),
      analysis.insights.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-lg font-bold mb-6 text-gray-800 flex items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3", children: "💡" }),
          "Observaciones importantes"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: analysis.insights.map((insight, index) => /* @__PURE__ */ jsx("div", { className: "group hover:scale-105 transition-all duration-300", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: insight.icon }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h5", { className: "font-bold text-blue-900 mb-2", children: insight.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700 leading-relaxed", children: insight.message })
          ] })
        ] }) }) }, index)) })
      ] }),
      analysis.comparisons.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-lg font-bold mb-6 text-gray-800 flex items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3", children: "🔍" }),
          "Comparación detallada"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: analysis.comparisons.map((comp, index) => /* @__PURE__ */ jsx("div", { className: "group", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: comp.emoji }) }),
              /* @__PURE__ */ jsx("h5", { className: "font-bold text-gray-900 text-lg", children: comp.label })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-gray-100 px-3 py-1 rounded-full", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-gray-600", children: [
              "Diferencia: ",
              Math.max(...comp.values.map((v) => v.value)) - Math.min(...comp.values.map((v) => v.value)),
              " pts"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [
              /* @__PURE__ */ jsx("h6", { className: "text-sm font-medium text-gray-700 mb-3", children: "Comparación visual" }),
              renderProgressComparison(comp)
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4", children: [
              /* @__PURE__ */ jsx("h6", { className: "text-sm font-medium text-gray-700 mb-2", children: "Resumen" }),
              renderVsComparison(comp)
            ] })
          ] })
        ] }) }, index)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-green-500 via-green-600 to-green-500 rounded-xl p-8 text-white relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "📋" }) }),
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold", children: "Resumen ejecutivo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsxs("h5", { className: "font-bold mb-3 flex items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "🎯" }),
              "Principales diferencias"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: analysis.summary.mainDifferences.map((diff, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [
              /* @__PURE__ */ jsx("span", { children: diff.emoji }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: diff.characteristic }),
              /* @__PURE__ */ jsxs("span", { className: "bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs", children: [
                diff.variance,
                " pts"
              ] })
            ] }, index)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsxs("h5", { className: "font-bold mb-3 flex items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "💭" }),
              "Recomendación"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed opacity-90", children: analysis.summary.recommendations[0] || "Todas las razas seleccionadas son muy similares en sus características principales." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center", children: userProfile ? (
          // Usuario YA tiene perfil/test completado
          /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-4 opacity-90", children: "¡Tu análisis personalizado está activo!" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "/razas",
                  className: "inline-flex items-center space-x-2 bg-white text-[#AFC2D5] px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🔍" }),
                    /* @__PURE__ */ jsx("span", { children: "Explorar más razas" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "/tu-raza-ideal",
                  className: "inline-flex items-center space-x-2 bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:bg-opacity-30 transition-all duration-300 border border-white border-opacity-30",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xl", children: "⚙️" }),
                    /* @__PURE__ */ jsx("span", { children: "Refinar tu perfil" })
                  ]
                }
              )
            ] })
          ] })
        ) : (
          // Usuario NO tiene perfil/test
          /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-4 opacity-90", children: "¿Quieres un análisis aún más personalizado?" }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/tu-raza-ideal",
                className: "inline-flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🎯" }),
                  /* @__PURE__ */ jsx("span", { children: "Hacer test personalizado para mayor precisión" })
                ]
              }
            )
          ] })
        ) })
      ] }) })
    ] })
  ] });
};

const BreedsComparisonContainer = ({ breeds = [] }) => {
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const validBreeds = Array.isArray(breeds) ? breeds.filter(
    (breed) => breed && typeof breed === "object" && breed.id && breed.name && breed.type && ["dog", "cat"].includes(breed.type)
  ) : [];
  if (validBreeds.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-12 bg-gray-50 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🐕🐱" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "No hay razas disponibles" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Parece que hay un problema cargando los datos de las razas." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors",
          children: "Recargar página"
        }
      )
    ] }) });
  }
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        console.log("👤 Perfil de usuario cargado:", profile);
      } catch (error) {
        console.error("❌ Error loading user profile:", error);
      }
    }
  }, []);
  const addBreed = (breed) => {
    if (selectedBreeds.length < 3 && !selectedBreeds.find((b) => b.id === breed.id)) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setSelectedBreeds((prev) => [...prev, breed]);
        setIsAnalyzing(false);
      }, 300);
    }
  };
  const removeBreed = (breedId) => {
    setSelectedBreeds((prev) => prev.filter((breed) => breed.id !== breedId));
  };
  const clearComparison = () => {
    setSelectedBreeds([]);
  };
  const isSelected = (breedId) => {
    return selectedBreeds.some((breed) => breed.id === breedId);
  };
  const canAddMore = selectedBreeds.length < 3;
  const getPersonalizedAnalysis = () => {
    if (!userProfile) return null;
    return selectedBreeds.map((breed) => {
      const compatibilityScore = calculateCompatibilityScore(breed, userProfile);
      const strengths = identifyStrengths(breed, userProfile);
      const challenges = identifyChallenges(breed, userProfile);
      const isExcellentCompatibility = compatibilityScore >= 85;
      const isGoodCompatibility = compatibilityScore >= 75 && compatibilityScore < 85;
      const isAcceptableCompatibility = compatibilityScore >= 65 && compatibilityScore < 75;
      const isLowCompatibility = compatibilityScore < 65;
      return {
        breed,
        compatibilityScore,
        strengths,
        challenges,
        isExcellentCompatibility,
        isGoodCompatibility,
        isAcceptableCompatibility,
        isLowCompatibility
      };
    });
  };
  const personalizedAnalysis = getPersonalizedAnalysis();
  const renderComparisonCard = (breed) => {
    const renderRating = (rating) => {
      return Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx("span", { className: `text-sm ${i < rating ? "text-amber-500" : "text-gray-300"}`, children: i < rating ? "★" : "☆" }, i));
    };
    const selected = isSelected(breed.id);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative rounded-lg overflow-hidden border transition-all duration-300 ${selected ? "border-[#AFC2D5] bg-[#AFC2D5] bg-opacity-10 shadow-lg ring-2 ring-[#AFC2D5] ring-opacity-50" : "border-gray-200 hover:shadow-md hover:border-[#AFC2D5]"} bg-white`,
        children: [
          selected && /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 z-10", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#AFC2D5] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md", children: [
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3 mr-1", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }),
            "Seleccionado"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "relative h-38 overflow-hidden", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: breed.image,
                alt: breed.name,
                className: "w-full h-full object-cover transition-transform duration-500 hover:scale-105",
                onError: (e) => {
                  e.target.src = "/images/breeds/default-pet.jpg";
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: `absolute top-3 left-3 ${breed.type === "dog" ? "bg-[#facc14]" : "bg-[#F6B89E]"} text-white text-xs px-2 py-1 rounded-full`, children: breed.type === "dog" ? "Perro" : "Gato" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#2E2E2E] mb-2", children: breed.name }),
            /* @__PURE__ */ jsxs("div", { className: "mb-4 space-y-3 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Tamaño:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium capitalize", children: breed.size === "small" ? "Pequeño" : breed.size === "medium" ? "Mediano" : "Grande" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Energía:" }),
                /* @__PURE__ */ jsx("div", { className: "flex", children: renderRating(breed.energyLevel || 0) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Sociabilidad:" }),
                /* @__PURE__ */ jsx("div", { className: "flex", children: renderRating(breed.friendliness || 0) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Cuidados:" }),
                /* @__PURE__ */ jsx("div", { className: "flex", children: renderRating(breed.grooming || 0) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-gray-200", children: [
                breed.hypoallergenic && /* @__PURE__ */ jsx("span", { className: "inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1", children: "✓ Hipoalergénica" }),
                breed.goodWith && breed.goodWith.includes("children") && /* @__PURE__ */ jsx("span", { className: "inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1", children: "👶 Bueno con niños" }),
                breed.goodWith && breed.goodWith.includes("apartments") && /* @__PURE__ */ jsx("span", { className: "inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-2 mb-1", children: "🏠 Apto apartamento" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-4", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: `/razas/${breed.id}`,
                  className: "text-sm font-medium text-green-600 hover:underline",
                  children: "Ver detalles"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    if (selected) {
                      removeBreed(breed.id);
                    } else if (canAddMore) {
                      addBreed(breed);
                    }
                  },
                  disabled: !selected && !canAddMore,
                  className: `px-4 py-2 rounded-md text-sm font-medium transition-all ${selected ? "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg" : canAddMore ? "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`,
                  children: selected ? "Quitar" : canAddMore ? "Comparar" : "Máximo 3"
                }
              )
            ] })
          ] })
        ]
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Selecciona razas para comparar" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-2", children: 'Haz clic en "Comparar" en hasta 3 razas que te interesen.' }),
      userProfile ? /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 mt-4", children: /* @__PURE__ */ jsx("p", { className: "text-green-800 font-medium", children: "✅ Perfil detectado - Te mostraremos análisis personalizado de compatibilidad" }) }) : /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4", children: /* @__PURE__ */ jsxs("p", { className: "text-blue-800", children: [
        "💡 ",
        /* @__PURE__ */ jsx("strong", { children: "Consejo:" }),
        " El comparador funciona perfectamente sin test. Completa nuestro",
        " ",
        /* @__PURE__ */ jsx("a", { href: "/tu-raza-ideal", className: "underline font-medium hover:text-blue-600", children: 'cuestionario "Tu Raza Ideal"' }),
        " ",
        "solo si quieres análisis de compatibilidad ultra-personalizado."
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      FilterableBreedsList,
      {
        initialBreeds: validBreeds,
        activeFilters: {
          type: [],
          size: [],
          energyLevel: [],
          goodWith: [],
          experience: [],
          apartmentFriendly: null,
          hypoallergenic: null
        },
        selectedBreeds,
        onBreedSelect: (breed) => {
          if (isSelected(breed.id)) {
            removeBreed(breed.id);
          } else if (canAddMore) {
            addBreed(breed);
          }
        },
        onFilterChange: (filters) => {
          console.log("🔍 Filtros aplicados:", filters);
        },
        children: (breed) => renderComparisonCard(breed)
      }
    ),
    selectedBreeds.length >= 2 && /* @__PURE__ */ jsx(ComparativeAnalysis, { selectedBreeds, userProfile }),
    personalizedAnalysis && selectedBreeds.length >= 2 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-xl p-6 mt-8 overflow-hidden relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-purple-50/30" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl", children: "🎯" }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl text-white font-bold", children: "Análisis personalizado de compatibilidad" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Basado en tu perfil específico, aquí está tu compatibilidad con cada raza seleccionada." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: personalizedAnalysis.map((analysis) => /* @__PURE__ */ jsx("div", { className: "group hover:scale-105 transition-all duration-300", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: analysis.breed.image,
                alt: analysis.breed.name,
                className: "w-16 h-16 rounded-full object-cover mr-4 border-4 border-white shadow-md",
                onError: (e) => {
                  e.target.src = "/images/breeds/default-pet.jpg";
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg text-gray-900", children: analysis.breed.name }),
              /* @__PURE__ */ jsxs("div", { className: `text-sm font-bold px-3 py-1 rounded-full inline-block ${analysis.isExcellentCompatibility ? "bg-green-100 text-green-700" : analysis.isGoodCompatibility ? "bg-blue-100 text-blue-700" : analysis.isAcceptableCompatibility ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`, children: [
                analysis.isExcellentCompatibility ? "🎯 Excelente" : analysis.isGoodCompatibility ? "👍 Buena" : analysis.isAcceptableCompatibility ? "⚠️ Aceptable" : "❌ Baja",
                " compatibilidad"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Compatibilidad" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-gray-900", children: [
                analysis.compatibilityScore,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: `h-full rounded-full transition-all duration-1000 ease-out ${analysis.isExcellentCompatibility ? "bg-gradient-to-r from-green-400 to-green-600" : analysis.isGoodCompatibility ? "bg-gradient-to-r from-blue-400 to-blue-600" : analysis.isAcceptableCompatibility ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : "bg-gradient-to-r from-red-400 to-red-600"}`,
                style: { width: `${analysis.compatibilityScore}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            analysis.strengths.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 rounded-lg p-4", children: [
              /* @__PURE__ */ jsxs("h5", { className: "font-medium text-green-800 mb-2 flex items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }),
                "Aspectos positivos"
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-green-800 text-sm", children: analysis.strengths.slice(0, 3).map((strength, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "text-green-500 mr-2 mt-0.5", children: "•" }),
                /* @__PURE__ */ jsx("span", { children: strength })
              ] }, index)) })
            ] }),
            analysis.challenges.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 rounded-lg p-4", children: [
              /* @__PURE__ */ jsxs("h5", { className: "font-medium text-orange-800 mb-2 flex items-center", children: [
                /* @__PURE__ */ jsx("span", { className: "w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-2", children: /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }),
                "Consideraciones"
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-orange-800 text-sm", children: analysis.challenges.slice(0, 3).map((challenge, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "text-orange-500 mr-2 mt-0.5", children: "•" }),
                /* @__PURE__ */ jsx("span", { children: challenge })
              ] }, index)) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-gray-200", children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: `/razas/${analysis.breed.id}`,
              className: "text-sm font-medium text-[#AFC2D5] hover:text-[#9DB3C6] transition-colors flex items-center group",
              children: [
                "Ver perfil completo",
                /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
              ]
            }
          ) })
        ] }) }, analysis.breed.id)) }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: "💡" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h5", { className: "font-bold text-blue-900 mb-2", children: "Sobre tu análisis personalizado" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-800 leading-relaxed", children: "Este análisis se basa en las respuestas de tu cuestionario personal. Los porcentajes reflejan qué tan bien cada raza se adapta a tu estilo de vida, experiencia y necesidades específicas." })
          ] })
        ] }) })
      ] })
    ] }),
    selectedBreeds.length > 0 && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-40 flex items-center space-x-2", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
        selectedBreeds.length,
        "/3 razas seleccionadas"
      ] }),
      selectedBreeds.length >= 2 && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: clearComparison,
          className: "ml-2 text-white hover:text-gray-200 text-xs",
          title: "Limpiar selección",
          children: "✕"
        }
      )
    ] }),
    selectedBreeds.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-12 bg-gray-50 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "🔍" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "Selecciona razas para comenzar" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: 'Usa los filtros arriba para encontrar razas que te interesen y haz clic en "Comparar" para comenzar el análisis.' }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
        "💡 ",
        /* @__PURE__ */ jsx("strong", { children: "Tip:" }),
        " Puedes comparar hasta 3 razas a la vez"
      ] })
    ] }) }),
    selectedBreeds.length === 1 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 bg-blue-50 rounded-lg border border-blue-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-3", children: "👍" }),
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-blue-900 mb-2", children: [
        "¡",
        selectedBreeds[0].name,
        " seleccionado!"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-blue-700 mb-4", children: "Selecciona al menos una raza más para comenzar la comparación." }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-blue-600", children: "Puedes agregar hasta 2 razas más para una comparación completa." })
    ] }) })
  ] });
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const title = "Razas de Perros y Gatos | Encuentra tu compa\xF1ero ideal";
  const description = "Explora m\xE1s de 50 razas de perros y gatos con informaci\xF3n detallada sobre temperamento, cuidados y compatibilidad familiar.";
  const breeds = Array.isArray(breedsData) ? breedsData : [];
  const stats = {
    total: breeds.length,
    dogs: breeds.filter((breed) => breed?.type === "dog").length,
    cats: breeds.filter((breed) => breed?.type === "cat").length,
    hypoallergenic: breeds.filter((breed) => breed?.hypoallergenic === true).length
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "data-astro-cid-tnx5zkbt": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["", '<div class="bg-gradient-to-br from-[#FAFAFA] to-[#E6ECF2] py-16" data-astro-cid-tnx5zkbt> ', ' </div> <section id="comparador" class="py-12 bg-white" data-astro-cid-tnx5zkbt> ', ' </section> <section class="py-12 bg-[#FAFAFA]" data-astro-cid-tnx5zkbt> ', ' </section> <section class="py-8 bg-white border-t border-gray-200" data-astro-cid-tnx5zkbt> ', ` </section>   <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Scroll suave para enlaces internos
      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');
          if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });

      // Manejador para botones de filtro r\xE1pido - CSS puro
      const filterButtons = document.querySelectorAll('.filter-button');
      filterButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
          const filterType = button.getAttribute('data-filter');
          
          // Scroll al comparador
          const comparador = document.querySelector('#comparador');
          if (comparador) {
            comparador.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
            
            // Disparar evento para React despu\xE9s del scroll
            setTimeout(function() {
              const event = new CustomEvent('quickFilterApplied', {
                detail: { filterType: filterType }
              });
              document.dispatchEvent(event);
            }, 800);
          }
        });
      });

      // Detectar si viene de URL con hash
      if (window.location.hash === '#comparador') {
        setTimeout(function() {
          const comparador = document.querySelector('#comparador');
          if (comparador) {
            comparador.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
      }
    });
  <\/script> `])), maybeRenderHead(), renderComponent($$result2, "Container", $$Container, { "data-astro-cid-tnx5zkbt": true }, { "default": ($$result3) => renderTemplate` <div class="text-center max-w-4xl mx-auto mb-12" data-astro-cid-tnx5zkbt> <h1 class="text-3xl md:text-5xl font-bold text-[#2E2E2E] mb-4" data-astro-cid-tnx5zkbt>
Encuentra la raza perfecta para ti
</h1> <p class="text-lg text-gray-600 mb-8" data-astro-cid-tnx5zkbt>
Explora características detalladas, temperamento y necesidades de cada raza para tomar la mejor decisión para tu familia.
</p>  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8" data-astro-cid-tnx5zkbt> <div class="bg-white rounded-lg p-4 shadow-sm" data-astro-cid-tnx5zkbt> <div class="text-2xl font-bold text-green-500" data-astro-cid-tnx5zkbt>${stats.total}</div> <div class="text-sm text-gray-600" data-astro-cid-tnx5zkbt>Razas totales</div> </div> <div class="bg-white rounded-lg p-4 shadow-sm" data-astro-cid-tnx5zkbt> <div class="text-2xl font-bold text-green-500" data-astro-cid-tnx5zkbt>${stats.dogs}</div> <div class="text-sm text-gray-600" data-astro-cid-tnx5zkbt>Perros</div> </div> <div class="bg-white rounded-lg p-4 shadow-sm" data-astro-cid-tnx5zkbt> <div class="text-2xl font-bold text-green-500" data-astro-cid-tnx5zkbt>${stats.cats}</div> <div class="text-sm text-gray-600" data-astro-cid-tnx5zkbt>Gatos</div> </div> <div class="bg-white rounded-lg p-4 shadow-sm" data-astro-cid-tnx5zkbt> <div class="text-2xl font-bold text-green-500" data-astro-cid-tnx5zkbt>${stats.hypoallergenic}</div> <div class="text-sm text-gray-600" data-astro-cid-tnx5zkbt>Hipoalergénicas</div> </div> </div>  <div class="flex flex-col sm:flex-row gap-4 justify-center" data-astro-cid-tnx5zkbt> ${renderComponent($$result3, "Button", $$Button, { "href": "/tu-raza-ideal", "variant": "primary", "size": "lg", "class": "bg-green-500 text-white hover:bg-[#9DB3C6]", "data-astro-cid-tnx5zkbt": true }, { "default": ($$result4) => renderTemplate`
🎯 Descubre tu raza ideal
` })} ${renderComponent($$result3, "Button", $$Button, { "href": "#comparador", "variant": "outline", "size": "lg", "class": "border-green-500 text-green-500 hover:bg-green-500 hover:text-white", "data-astro-cid-tnx5zkbt": true }, { "default": ($$result4) => renderTemplate`
🔍 Comparar razas
` })} </div> </div> ` }), renderComponent($$result2, "Container", $$Container, { "data-astro-cid-tnx5zkbt": true }, { "default": ($$result3) => renderTemplate` <div class="mb-12" data-astro-cid-tnx5zkbt> ${renderComponent($$result3, "BreedsComparisonContainer", BreedsComparisonContainer, { "breeds": breeds, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/features/breeds-comparison/BreedsComparisonContainer.jsx", "client:component-export": "default", "data-astro-cid-tnx5zkbt": true })} </div> ` }), renderComponent($$result2, "Container", $$Container, { "data-astro-cid-tnx5zkbt": true }, { "default": ($$result3) => renderTemplate` <div class="grid grid-cols-1 md:grid-cols-2 gap-8" data-astro-cid-tnx5zkbt>  <div class="bg-white rounded-xl p-6 shadow-sm" data-astro-cid-tnx5zkbt> <h3 class="text-xl font-bold mb-4 text-[#2E2E2E]" data-astro-cid-tnx5zkbt>
🎯 Cómo funciona nuestro comparador inteligente
</h3> <ul class="space-y-3 text-sm" data-astro-cid-tnx5zkbt> <li class="flex items-start" data-astro-cid-tnx5zkbt> <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 mt-0.5" data-astro-cid-tnx5zkbt> <span class="text-xs font-bold" data-astro-cid-tnx5zkbt>1</span> </div> <p data-astro-cid-tnx5zkbt><strong data-astro-cid-tnx5zkbt>Filtra por tus necesidades:</strong> Usa los filtros para encontrar razas que se adapten a tu estilo de vida.</p> </li> <li class="flex items-start" data-astro-cid-tnx5zkbt> <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 mt-0.5" data-astro-cid-tnx5zkbt> <span class="text-xs font-bold" data-astro-cid-tnx5zkbt>2</span> </div> <p data-astro-cid-tnx5zkbt><strong data-astro-cid-tnx5zkbt>Selecciona hasta 3 razas:</strong> Haz clic en "Comparar" en las razas que te interesan.</p> </li> <li class="flex items-start" data-astro-cid-tnx5zkbt> <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 mt-0.5" data-astro-cid-tnx5zkbt> <span class="text-xs font-bold" data-astro-cid-tnx5zkbt>3</span> </div> <p data-astro-cid-tnx5zkbt><strong data-astro-cid-tnx5zkbt>Análisis automático:</strong> Ve comparaciones directas sin necesidad de hacer test.</p> </li> <li class="flex items-start" data-astro-cid-tnx5zkbt> <div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mr-3 mt-0.5" data-astro-cid-tnx5zkbt> <span class="text-xs font-bold" data-astro-cid-tnx5zkbt>4</span> </div> <p data-astro-cid-tnx5zkbt><strong data-astro-cid-tnx5zkbt>Test opcional:</strong> Para mayor precisión, completa nuestro cuestionario.</p> </li> </ul> </div>  <div class="bg-white rounded-xl p-6 shadow-sm" data-astro-cid-tnx5zkbt> <h3 class="text-xl font-bold mb-4 text-[#2E2E2E]" data-astro-cid-tnx5zkbt>
💡 Consejos para encontrar tu raza ideal
</h3> <ul class="space-y-3 text-sm" data-astro-cid-tnx5zkbt> <li class="flex items-start" data-astro-cid-tnx5zkbt> <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#facc14] flex items-center justify-center text-black mr-3 mt-0.5" data-astro-cid-tnx5zkbt> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-tnx5zkbt> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-astro-cid-tnx5zkbt></path> </svg> </div> <p data-astro-cid-tnx5zkbt><strong data-astro-cid-tnx5zkbt>Funciona sin test:</strong> El comparador muestra análisis directos automáticamente.</p> </li> <li class="flex items-start" data-astro-cid-tnx5zkbt> <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#facc14] flex items-center justify-center text-black mr-3 mt-0.5" data-astro-cid-tnx5zkbt> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-tnx5zkbt> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-astro-cid-tnx5zkbt></path> </svg> </div> <p data-astro-cid-tnx5zkbt><strong data-astro-cid-tnx5zkbt>Usa múltiples filtros:</strong> Combina tipo, tamaño, energía y compatibilidad familiar.</p> </li> <li class="flex items-start" data-astro-cid-tnx5zkbt> <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#facc14] flex items-center justify-center text-black mr-3 mt-0.5" data-astro-cid-tnx5zkbt> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-tnx5zkbt> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-astro-cid-tnx5zkbt></path> </svg> </div> <p data-astro-cid-tnx5zkbt><strong data-astro-cid-tnx5zkbt>Compara diferentes tipos:</strong> Mezcla perros grandes y pequeños para ver diferencias.</p> </li> <li class="flex items-start" data-astro-cid-tnx5zkbt> <div class="flex-shrink-0 w-6 h-6 rounded-full bg-[#facc14] flex items-center justify-center text-black mr-3 mt-0.5" data-astro-cid-tnx5zkbt> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-tnx5zkbt> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-astro-cid-tnx5zkbt></path> </svg> </div> <p data-astro-cid-tnx5zkbt><strong data-astro-cid-tnx5zkbt>Test personalizado opcional:</strong> Para mayor precisión, completa "Tu Raza Ideal".</p> </li> </ul> </div> </div> ` }), renderComponent($$result2, "Container", $$Container, { "data-astro-cid-tnx5zkbt": true }, { "default": ($$result3) => renderTemplate` <div class="text-center mb-6" data-astro-cid-tnx5zkbt> <h3 class="text-lg font-bold text-[#2E2E2E] mb-2" data-astro-cid-tnx5zkbt>Exploración rápida</h3> <p class="text-gray-600" data-astro-cid-tnx5zkbt>Acceso directo a tipos específicos</p> </div> <div class="flex flex-wrap justify-center gap-4" data-astro-cid-tnx5zkbt> ${renderComponent($$result3, "Button", $$Button, { "href": "#comparador", "variant": "primary", "size": "md", "class": "bg-green-500 text-white hover:bg-[#9DB3C6] filter-button", "data-filter": "dog", "data-astro-cid-tnx5zkbt": true }, { "default": ($$result4) => renderTemplate`
🐕 Solo Perros (${stats.dogs})
` })} ${renderComponent($$result3, "Button", $$Button, { "href": "#comparador", "variant": "primary", "size": "md", "class": "bg-green-500 text-white hover:bg-[#9DB3C6] filter-button", "data-filter": "cat", "data-astro-cid-tnx5zkbt": true }, { "default": ($$result4) => renderTemplate`
🐱 Solo Gatos (${stats.cats})
` })} ${renderComponent($$result3, "Button", $$Button, { "href": "#comparador", "variant": "outline", "size": "md", "class": "border-green-500 text-green-500 hover:bg-green-500 hover:text-white filter-button", "data-filter": "hypoallergenic", "data-astro-cid-tnx5zkbt": true }, { "default": ($$result4) => renderTemplate`
✨ Hipoalergénicas (${stats.hypoallergenic})
` })} ${renderComponent($$result3, "Button", $$Button, { "href": "#comparador", "variant": "outline", "size": "md", "class": "border-green-500 text-green-500 hover:bg-green-500 hover:text-white filter-button", "data-filter": "apartment", "data-astro-cid-tnx5zkbt": true }, { "default": ($$result4) => renderTemplate`
🏠 Ideales para apartamento
` })} </div> ` })) })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/razas/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/razas/index.astro";
const $$url = "/razas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
