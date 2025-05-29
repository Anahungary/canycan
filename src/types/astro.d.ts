// src/types/astro.d.ts - Tipos para mejorar TypeScript
/// <reference types="astro/client" />

declare global {
  interface Window {
    // Para funciones globales si las necesitas
    toggleMenu?: () => void;
    initSearch?: () => void;
  }
}

// Tipos para los componentes de UI
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  children?: any;
  class?: string;
  disabled?: boolean;
}

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  class?: string;
  children?: any;
}

// Tipos para artículos
export interface Article {
  title: string;
  description: string;
  slug: string;
  date: Date;
  author: string;
  authorBio?: string;
  tags: string[];
  category: string;
  featured?: boolean;
  image: string;
  readingTime: number;
  content?: string;
}

// Tipos para razas
export interface Breed {
  name: string;
  slug: string;
  description: string;
  type: 'dog' | 'cat';
  size: 'toy' | 'small' | 'medium' | 'large' | 'giant';
  image: string;
  characteristics: {
    energy: number;
    friendliness: number;
    training: number;
    grooming: number;
  };
  goodWith: string[];
  featured?: boolean;
}

// Tipos para autores
export interface Author {
  name: string;
  slug: string;
  bio: string;
  avatar?: string;
  role?: string;
  specialties?: string[];
}

export type {}