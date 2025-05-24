// src/contexts/ComparisonContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { BreedCharacteristics, UserProfile } from '../types/breeds';

// Usar React.ReactNode en lugar de importar ReactNode directamente
interface ComparisonContextType {
  selectedBreeds: BreedCharacteristics[];
  userProfile: UserProfile | null;
  addBreed: (breed: BreedCharacteristics) => void;
  removeBreed: (breedId: string) => void;
  clearComparison: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
  isSelected: (breedId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

// Cambiar ReactNode por React.ReactNode
export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedBreeds, setSelectedBreeds] = useState<BreedCharacteristics[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const addBreed = (breed: BreedCharacteristics) => {
    if (selectedBreeds.length < 3 && !selectedBreeds.find(b => b.id === breed.id)) {
      setSelectedBreeds([...selectedBreeds, breed]);
    }
  };

  const removeBreed = (breedId: string) => {
    setSelectedBreeds(selectedBreeds.filter(breed => breed.id !== breedId));
  };

  const clearComparison = () => {
    setSelectedBreeds([]);
  };

  const isSelected = (breedId: string) => {
    return selectedBreeds.some(breed => breed.id === breedId);
  };

  const canAddMore = selectedBreeds.length < 3;

  return (
    <ComparisonContext.Provider value={{
      selectedBreeds,
      userProfile,
      addBreed,
      removeBreed,
      clearComparison,
      setUserProfile,
      isSelected,
      canAddMore
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}