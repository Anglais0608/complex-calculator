"use client";

import { create, all, Complex } from 'mathjs';

// Configuration de mathjs avec toutes les fonctions
const math = create(all);

// Classe pour gérer les calculs de la calculatrice avec support pour les nombres complexes
export class ComplexCalculatorEngine {
  // Évalue une expression mathématique, y compris avec des nombres complexes
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
      } else if (math.typeOf(result) === 'Complex') {
        // Formater les nombres complexes
        return this.formatComplex(result);
      } else {
        // Pour les autres types de résultats
        return result.toString();
      }
    } catch (error) {
      console.error("Erreur d'évaluation:", error);
      return "Erreur";
    }
  }

  // Formater un nombre complexe pour l'affichage
  static formatComplex(complex: any): string {
    const re = complex.re;
    const im = complex.im;
    
    // Arrondir les valeurs pour éviter les problèmes de précision
    const roundedRe = Math.abs(re) < 1e-14 ? 0 : re;
    const roundedIm = Math.abs(im) < 1e-14 ? 0 : im;
    
    if (roundedIm === 0) return roundedRe.toString();
    if (roundedRe === 0) return roundedIm === 1 ? "i" : roundedIm === -1 ? "-i" : `${roundedIm}i`;
    
    const sign = roundedIm < 0 ? "-" : "+";
    const absIm = Math.abs(roundedIm);
    
    return `${roundedRe} ${sign} ${absIm === 1 ? "" : absIm}i`;
  }

  // Résoudre une équation simple de la forme a*x + b = c
  static solveLinearEquation(equation: string): string {
    try {
      // Vérifier si l'équation contient un "="
      if (!equation.includes("=")) {
        return "Format d'équation invalide";
      }
      
      // Diviser l'équation en parties gauche et droite
      const [leftSide, rightSide] = equation.split("=").map(side => side.trim());
      
      // Reformuler l'équation pour la résoudre
      const expr = `solve(${leftSide} - (${rightSide}), x)`;
      
      // Résoudre l'équation
      const solution = math.evaluate(expr);
      
      // Formater la solution
      if (Array.isArray(solution)) {
        return solution.map(sol => `x = ${this.formatComplex(sol)}`).join(", ");
      } else {
        return `x = ${this.formatComplex(solution)}`;
      }
    } catch (error) {
      console.error("Erreur de résolution d'équation:", error);
      return "Erreur: impossible de résoudre l'équation";
    }
  }

  // Résoudre une équation quadratique de la forme ax^2 + bx + c = 0
  static solveQuadraticEquation(a: number, b: number, c: number): string {
    try {
      // Calculer le discriminant
      const discriminant = b * b - 4 * a * c;
      
      if (discriminant >= 0) {
        // Solutions réelles
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        
        if (x1 === x2) {
          return `x = ${x1}`;
        } else {
          return `x₁ = ${x1}, x₂ = ${x2}`;
        }
      } else {
        // Solutions complexes
        const realPart = -b / (2 * a);
        const imagPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);
        
        return `x₁ = ${realPart} + ${imagPart}i, x₂ = ${realPart} - ${imagPart}i`;
      }
    } catch (error) {
      console.error("Erreur de résolution d'équation quadratique:", error);
      return "Erreur: impossible de résoudre l'équation";
    }
  }

  // Calculer la dérivée d'une expression
  static derivative(expression: string, variable: string = 'x'): string {
    try {
      // Remplacer les symboles pour la compatibilité avec mathjs
      let processedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi');
      
      // Calculer la dérivée
      const result = math.derivative(processedExpression, variable);
      
      return result.toString();
    } catch (error) {
      console.error("Erreur de calcul de dérivée:", error);
      return "Erreur: impossible de calculer la dérivée";
    }
  }

  // Calculer l'intégrale d'une expression
  static integrate(expression: string, variable: string = 'x'): string {
    try {
      // Remplacer les symboles pour la compatibilité avec mathjs
      let processedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi');
      
      // Utiliser l'API de mathjs pour l'intégration symbolique
      const result = math.evaluate(`integrate(${processedExpression}, ${variable})`);
      
      return result.toString() + " + C";
    } catch (error) {
      console.error("Erreur de calcul d'intégrale:", error);
      return "Erreur: impossible de calculer l'intégrale";
    }
  }

  // Calculer la limite d'une expression
  static limit(expression: string, variable: string = 'x', value: number | string): string {
    try {
      // Remplacer les symboles pour la compatibilité avec mathjs
      let processedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi');
      
      // Utiliser l'API de mathjs pour calculer la limite
      const result = math.evaluate(`limit(${processedExpression}, ${variable}, ${value})`);
      
      return result.toString();
    } catch (error) {
      console.error("Erreur de calcul de limite:", error);
      return "Erreur: impossible de calculer la limite";
    }
  }

  // Fonctions pour les nombres complexes
  static complexAdd(a: string, b: string): string {
    try {
      const complexA = math.complex(a);
      const complexB = math.complex(b);
      const result = math.add(complexA, complexB);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexSubtract(a: string, b: string): string {
    try {
      const complexA = math.complex(a);
      const complexB = math.complex(b);
      const result = math.subtract(complexA, complexB);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexMultiply(a: string, b: string): string {
    try {
      const complexA = math.complex(a);
      const complexB = math.complex(b);
      const result = math.multiply(complexA, complexB);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexDivide(a: string, b: string): string {
    try {
      const complexA = math.complex(a);
      const complexB = math.complex(b);
      const result = math.divide(complexA, complexB);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexAbs(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.abs(complexA);
      return result.toString();
    } catch (error) {
      return "Erreur";
    }
  }

  static complexArg(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.arg(complexA);
      return result.toString();
    } catch (error) {
      return "Erreur";
    }
  }

  static complexRe(a: string): string {
    try {
      const complexA = math.complex(a);
      return complexA.re.toString();
    } catch (error) {
      return "Erreur";
    }
  }

  static complexIm(a: string): string {
    try {
      const complexA = math.complex(a);
      return complexA.im.toString();
    } catch (error) {
      return "Erreur";
    }
  }

  // Nouvelles fonctions pour les nombres complexes
  static complexPow(a: string, b: string | number): string {
    try {
      const complexA = math.complex(a);
      const result = math.pow(complexA, b);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexExp(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.exp(complexA);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexLog(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.log(complexA);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexSqrt(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.sqrt(complexA);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexSin(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.sin(complexA);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexCos(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.cos(complexA);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexTan(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.tan(complexA);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  static complexConjugate(a: string): string {
    try {
      const complexA = math.complex(a);
      const result = math.conj(complexA);
      return this.formatComplex(result);
    } catch (error) {
      return "Erreur";
    }
  }

  // Fonction pour générer des points pour un graphique d'équation complexe
  static generateComplexGraphPoints(equation: string): any[] {
    try {
      // Vérifier si l'équation contient un "="
      if (!equation.includes("=")) {
        return [];
      }

      // Diviser l'équation en parties gauche et droite
      const [leftSide, rightSide] = equation.split("=").map(side => side.trim());
      
      // Créer une fonction pour évaluer l'équation
      const evalEquation = (a: number): Complex => {
        try {
          // Remplacer 'a' dans l'équation et évaluer
          const expr = leftSide.replace(/a/g, a.toString());
          return math.evaluate(expr);
        } catch (error) {
          return math.complex(0, 0);
        }
      };
      
      // Générer des points pour différentes valeurs de 'a'
      const points = [];
      for (let a = -5; a <= 5; a += 0.1) {
        const result = evalEquation(a);
        if (math.typeOf(result) === 'Complex') {
          points.push({
            a,
            re: result.re,
            im: result.im
          });
        }
      }
      
      return points;
    } catch (error) {
      console.error("Erreur de génération de points pour graphique:", error);
      return [];
    }
  }

  // Fonction améliorée pour générer des points pour un graphique d'équation complexe
  static generateComplexGraphPointsDetailed(equation: string, resolution: number = 100): any[] {
    try {
      // Vérifier si l'équation contient un "="
      if (!equation.includes("=")) {
        return [];
      }

      // Diviser l'équation en parties gauche et droite
      const [leftSide, rightSide] = equation.split("=").map(side => side.trim());
      
      // Créer une fonction pour évaluer l'équation
      const evalEquation = (a: number): Complex => {
        try {
          // Remplacer 'a' dans l'équation et évaluer
          const expr = leftSide.replace(/a/g, a.toString());
          return math.evaluate(expr);
        } catch (error) {
          return math.complex(0, 0);
        }
      };
      
      // Générer des points pour différentes valeurs de 'a' avec résolution ajustable
      const points = [];
      const step = 10 / resolution;
      for (let a = -5; a <= 5; a += step) {
        const result = evalEquation(a);
        if (math.typeOf(result) === 'Complex') {
          points.push({
            a,
            re: result.re,
            im: result.im
          });
        }
      }
      
      return points;
    } catch (error) {
      console.error("Erreur de génération de points pour graphique:", error);
      return [];
    }
  }
}

export default ComplexCalculatorEngine;
