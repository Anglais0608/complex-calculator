"use client";

import React from "react";

interface CalculatorDisplayProps {
  input: string;
  result: string;
  history: string[];
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ input, result, history }) => {
  return (
    <div className="mb-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-2">
        <div className="text-right text-gray-600 dark:text-gray-300 text-sm h-6 overflow-x-auto">
          {input || "0"}
        </div>
        <div className="text-right text-2xl font-bold overflow-x-auto">
          {result || "0"}
        </div>
      </div>
      
      {history.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-750 p-2 rounded-lg max-h-32 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-1">Historique</h3>
          <ul className="text-xs">
            {history.map((item, index) => (
              <li key={index} className="py-1 border-b border-gray-200 dark:border-gray-700 last:border-0">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalculatorDisplay;
