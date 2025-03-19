"use client";

import { useState, useEffect } from "react";
import CalculatorDisplay from "./CalculatorDisplay";
import CalculatorKeyboard from "../keyboard/CalculatorKeyboard";
import ComplexGraph from "../graph/ComplexGraph";
import { ComplexCalculatorEngine } from "../../utils/ComplexCalculatorEngine";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const [equation, setEquation] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mode, setMode] = useState<"standard" | "equation" | "complex">("standard");
  const [graphInputMode, setGraphInputMode] = useState(false);

  // Détection améliorée des appareils mobiles
  useEffect(() => {
    const checkIfMobile = () => {
      // Utilisation d'une détection plus précise basée sur la largeur et les fonctionnalités tactiles
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isSmallScreen || isTouchDevice);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleKeyPress = (key: string) => {
    if (key === "=") {
      try {
        let calculatedResult;
        
        if (mode === "equation" && input.includes("=")) {
          // Résolution d'équation
          calculatedResult = ComplexCalculatorEngine.solveLinearEquation(input);
        } else if (mode === "complex") {
          // Calcul avec nombres complexes
          calculatedResult = ComplexCalculatorEngine.evaluate(input);
        } else {
          // Calcul standard
          calculatedResult = ComplexCalculatorEngine.evaluate(input);
        }
        
        setResult(calculatedResult);
        if (calculatedResult !== "Erreur") {
          setHistory([...history, `${input} = ${calculatedResult}`]);
        }

        // Si nous sommes en mode de saisie d'équation pour le graphique, mettre à jour l'équation
        if (graphInputMode) {
          setEquation(input);
          setGraphInputMode(false);
        }
      } catch (error) {
        setResult("Erreur");
      }
    } else if (key === "C") {
      setInput("");
      setResult("");
    } else if (key === "⌫") {
      setInput(input.slice(0, -1));
    } else if (key === "Graph") {
      if (!showGraph) {
        // Activer le graphique et passer en mode de saisie d'équation
        setShowGraph(true);
        setGraphInputMode(true);
        setResult("Entrez une équation pour le graphique");
      } else if (graphInputMode) {
        // Désactiver le mode de saisie d'équation mais garder le graphique
        setGraphInputMode(false);
        if (input) {
          setEquation(input);
        }
      } else {
        // Basculer l'affichage du graphique
        setShowGraph(!showGraph);
      }
    } else if (key === "Mode") {
      // Changer de mode de calcul
      setMode(prevMode => {
        if (prevMode === "standard") return "equation";
        if (prevMode === "equation") return "complex";
        return "standard";
      });
      setResult(`Mode: ${mode === "standard" ? "Équation" : mode === "equation" ? "Complexe" : "Standard"}`);
    } else if (key === "sin" || key === "cos" || key === "tan" || 
               key === "asin" || key === "acos" || key === "atan" || 
               key === "log" || key === "ln" || key === "√") {
      setInput(input + key + "(");
    } else if (key === "π") {
      setInput(input + "π");
    } else if (key === "e") {
      setInput(input + "e");
    } else if (key === "^") {
      setInput(input + "^");
    } else if (key === "i") {
      setInput(input + "i");
    } else if (key === "|z|") {
      setInput(input + "abs(");
    } else if (key === "Arg") {
      setInput(input + "arg(");
    } else if (key === "Re") {
      setInput(input + "re(");
    } else if (key === "Im") {
      setInput(input + "im(");
    } else if (key === "d/dx") {
      // Dérivée
      if (result && result !== "Erreur") {
        try {
          const derivative = ComplexCalculatorEngine.derivative(input);
          setResult(`d/dx(${input}) = ${derivative}`);
          setHistory([...history, `d/dx(${input}) = ${derivative}`]);
        } catch (error) {
          setResult("Erreur de dérivation");
        }
      } else {
        setInput(input + "derivative(");
      }
    } else {
      setInput(input + key);
    }
  };

  // Fonction pour entrer directement une équation pour le graphique
  const handleGraphEquationInput = () => {
    setGraphInputMode(true);
    setInput("");
    setResult("Entrez une équation pour le graphique");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-full overflow-hidden">
      <div className={`flex flex-col ${showGraph ? "lg:w-1/2" : "w-full"} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4`}>
        <div className="mb-2 flex justify-between items-center">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium text-blue-800 dark:text-blue-100">
            Mode: {mode === "standard" ? "Standard" : mode === "equation" ? "Équation" : "Complexe"}
          </span>
          {graphInputMode && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-sm font-medium text-green-800 dark:text-green-100">
              Saisie d'équation pour graphique
            </span>
          )}
        </div>
        <CalculatorDisplay input={input} result={result} history={history} />
        <CalculatorKeyboard onKeyPress={handleKeyPress} isMobile={isMobile} />
      </div>
      
      {showGraph && (
        <div className={`${isMobile ? "w-full" : "lg:w-1/2"} bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px] lg:h-auto`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Graphique 3D</h3>
            <button 
              onClick={handleGraphEquationInput}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
            >
              Modifier l'équation
            </button>
          </div>
          <ComplexGraph equation={equation} />
        </div>
      )}
    </div>
  );
}
