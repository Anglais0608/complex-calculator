"use client";

import { create, all } from 'mathjs';

// Configuration de mathjs avec toutes les fonctions
const math = create(all);

// Classe pour gérer les calculs de la calculatrice
export class CalculatorEngine {
  // Évalue une expression mathématique
  static evaluate(expression: string): string {
    if (!expression) return "0";
    
    try {
      // Remplacer les symboles pour la compatibilité avec mathjs
      let processedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/\|z\|/g, 'abs');
      
      // Évaluer l'expression
      const result = math.evaluate(processedExpression);
      
      // Formater le résultat
      if (typeof result === 'number') {
        // Éviter les problèmes de précision flottante
        return math.format(result, { precision: 14 });
      } else {
        // Pour les résultats complexes ou autres
        return result.toString();
      }
    } catch (error) {
      console.error("Erreur d'évaluation:", error);
      return "Erreur";
    }
  }

  // Vérifie si une expression est valide
  static isValid(expression: string): boolean {
    if (!expression) return false;
    
    try {
      // Remplacer les symboles pour la compatibilité avec mathjs
      let processedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/\|z\|/g, 'abs');
      
      // Tenter d'évaluer l'expression
      math.evaluate(processedExpression);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Fonctions arithmétiques de base
  static add(a: number, b: number): number {
    return a + b;
  }

  static subtract(a: number, b: number): number {
    return a - b;
  }

  static multiply(a: number, b: number): number {
    return a * b;
  }

  static divide(a: number, b: number): number {
    if (b === 0) throw new Error("Division par zéro");
    return a / b;
  }

  // Fonctions trigonométriques
  static sin(angle: number): number {
    return Math.sin(angle);
  }

  static cos(angle: number): number {
    return Math.cos(angle);
  }

  static tan(angle: number): number {
    return Math.tan(angle);
  }

  static asin(value: number): number {
    return Math.asin(value);
  }

  static acos(value: number): number {
    return Math.acos(value);
  }

  static atan(value: number): number {
    return Math.atan(value);
  }

  // Fonctions logarithmiques et exponentielles
  static log(value: number): number {
    if (value <= 0) throw new Error("Logarithme d'un nombre négatif ou nul");
    return Math.log10(value);
  }

  static ln(value: number): number {
    if (value <= 0) throw new Error("Logarithme naturel d'un nombre négatif ou nul");
    return Math.log(value);
  }

  static sqrt(value: number): number {
    if (value < 0) throw new Error("Racine carrée d'un nombre négatif");
    return Math.sqrt(value);
  }

  static power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }
}

export default CalculatorEngine;
