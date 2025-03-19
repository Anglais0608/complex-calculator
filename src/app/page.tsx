"use client";

import { useState } from "react";
import Calculator from "../components/calculator/Calculator";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Calculatrice Complexe</h1>
      <Calculator />
    </div>
  );
}
