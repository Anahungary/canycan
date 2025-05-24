// src/hooks/useUserProfile.ts
import { useEffect, useState } from 'react';
import type { UserProfile } from '../types/breeds';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    // Intentar cargar el perfil del localStorage (guardado del cuestionario)
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, []);
  
  const saveUserProfile = (profile: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUserProfile(profile);
  };
  
  const clearUserProfile = () => {
    localStorage.removeItem('userProfile');
    setUserProfile(null);
  };
  
  return {
    userProfile,
    saveUserProfile,
    clearUserProfile,
    hasProfile: userProfile !== null
  };
}