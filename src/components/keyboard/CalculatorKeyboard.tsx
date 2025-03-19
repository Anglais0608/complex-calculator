"use client";

import React, { useState } from "react";

interface CalculatorKeyboardProps {
  onKeyPress: (key: string) => void;
  isMobile: boolean;
}

const CalculatorKeyboard: React.FC<CalculatorKeyboardProps> = ({ onKeyPress, isMobile }) => {
  const [showVariables, setShowVariables] = useState(false);

  // Définition des touches de la calculatrice
  const standardKeys = [
    ["C", "⌫", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="]
  ];

  const advancedKeys = [
    ["sin", "cos", "tan", "π"],
    ["asin", "acos", "atan", "e"],
    ["log", "ln", "√", "^"],
    ["(", ")", "i", "|z|"],
    ["Graph", "Arg", "Re", "Im"],
    ["Mode", "d/dx", "Var", "="] // Ajout d'une touche pour les variables et =
  ];

  // Nouvelles touches pour les variables et lettres
  const variableKeys = [
    ["a", "b", "c", "d"],
    ["x", "y", "z", "n"],
    ["f", "g", "h", "j"],
    ["k", "l", "m", "p"],
    ["q", "r", "s", "t"],
    ["u", "v", "w", "<-"] // Flèche pour revenir au clavier principal
  ];

  const handleVariableKeyPress = (key: string) => {
    if (key === "<-") {
      setShowVariables(false);
    } else {
      onKeyPress(key);
    }
  };

  const handleAdvancedKeyPress = (key: string) => {
    if (key === "Var") {
      setShowVariables(true);
    } else {
      onKeyPress(key);
    }
  };

  // Rendu adaptatif en fonction du type d'appareil
  return (
    <div className="w-full">
      {/* Clavier standard */}
      {!showVariables && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {standardKeys.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((key, keyIndex) => (
                <button
                  key={`key-${rowIndex}-${keyIndex}`}
                  className={`
                    ${key === "=" ? "col-span-2" : ""}
                    ${key === "C" || key === "⌫" ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" : 
                      key === "=" ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700" : 
                      /[+\-×÷%]/.test(key) ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700" : 
                      "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"}
                    text-white font-bold py-4 md:py-3 rounded-lg transition-colors
                    text-lg md:text-base
                    touch-manipulation
                  `}
                  onClick={() => onKeyPress(key)}
                >
                  {key}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Clavier de variables - affiché lorsque showVariables est true */}
      {showVariables && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {variableKeys.map((row, rowIndex) => (
            <React.Fragment key={`var-row-${rowIndex}`}>
              {row.map((key, keyIndex) => (
                <button
                  key={`var-key-${rowIndex}-${keyIndex}`}
                  className={`
                    ${key === "<-" ? "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700" : 
                      "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"}
                    text-white font-bold py-4 md:py-3 rounded-lg transition-colors
                    text-lg md:text-base
                    touch-manipulation
                  `}
                  onClick={() => handleVariableKeyPress(key)}
                >
                  {key}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Clavier avancé - affiché différemment selon le type d'appareil et seulement si showVariables est false */}
      {!showVariables && (
        isMobile ? (
          <div className="mt-4">
            <details className="bg-gray-200 dark:bg-gray-700 rounded-lg">
              <summary className="p-3 font-semibold cursor-pointer text-center text-gray-800 dark:text-gray-200">
                Fonctions avancées
              </summary>
              <div className="grid grid-cols-4 gap-3 p-3">
                {advancedKeys.map((row, rowIndex) => (
                  <React.Fragment key={`adv-row-${rowIndex}`}>
                    {row.map((key, keyIndex) => (
                      key ? (
                        <button
                          key={`adv-key-${rowIndex}-${keyIndex}`}
                          className={`
                            ${key === "Var" ? "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700" : 
                              "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"}
                            text-white font-bold py-3 px-1 text-sm rounded-lg transition-colors touch-manipulation
                          `}
                          onClick={() => handleAdvancedKeyPress(key)}
                        >
                          {key}
                        </button>
                      ) : (
                        <div key={`adv-key-${rowIndex}-${keyIndex}`}></div>
                      )
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </details>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {advancedKeys.map((row, rowIndex) => (
              <React.Fragment key={`adv-row-${rowIndex}`}>
                {row.map((key, keyIndex) => (
                  key ? (
                    <button
                      key={`adv-key-${rowIndex}-${keyIndex}`}
                      className={`
                        ${key === "Var" ? "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700" : 
                          "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"}
                        text-white font-bold py-2 rounded-lg transition-colors
                      `}
                      onClick={() => handleAdvancedKeyPress(key)}
                    >
                      {key}
                    </button>
                  ) : (
                    <div key={`adv-key-${rowIndex}-${keyIndex}`}></div>
                  )
                ))}
              </React.Fragment>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default CalculatorKeyboard;
