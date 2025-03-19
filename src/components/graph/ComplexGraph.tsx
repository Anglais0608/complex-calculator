"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { ComplexCalculatorEngine } from "../../utils/ComplexCalculatorEngine";

interface ComplexGraphProps {
  equation: string;
}

const ComplexGraph: React.FC<ComplexGraphProps> = ({ equation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const [visualizationMode, setVisualizationMode] = useState<"points" | "curve" | "surface" | "all">("all");
  const [resolution, setResolution] = useState<number>(100);
  const [colorScheme, setColorScheme] = useState<"default" | "rainbow" | "heatmap">("default");

  // Détection des appareils mobiles
  useEffect(() => {
    const checkIfMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      const isMobileDevice = isSmallScreen || isTouchDevice;
      
      setIsMobile(isMobileDevice);
      
      // Ajuster automatiquement la qualité en fonction de l'appareil
      if (isMobileDevice) {
        setQuality("medium");
        if (window.innerWidth < 480) {
          setQuality("low");
        }
      } else {
        setQuality("high");
      }
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Initialisation de la scène Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialisation de la scène Three.js
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Création du renderer avec des paramètres adaptés à l'appareil
    const renderer = new THREE.WebGLRenderer({ 
      antialias: quality !== "low", 
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Création de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Ajout des contrôles pour la rotation avec options tactiles améliorées
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.rotateSpeed = isMobile ? 0.7 : 1.0; // Rotation plus lente sur mobile
    controls.zoomSpeed = isMobile ? 0.7 : 1.0;   // Zoom plus lent sur mobile
    controls.panSpeed = isMobile ? 0.7 : 1.0;    // Déplacement plus lent sur mobile
    controls.touchRotate = true;
    controls.touchZoom = true;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    controlsRef.current = controls;

    // Ajout d'une grille pour référence
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Ajout des axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Ajout de l'éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Ajouter des étiquettes pour les axes
    const createAxisLabel = (text: string, position: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.width = 128;
      canvas.height = 64;
      
      context.fillStyle = '#000000';
      context.font = '24px Arial';
      context.fillText(text, 10, 40);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(1, 0.5, 1);
      
      scene.add(sprite);
    };
    
    createAxisLabel('X', new THREE.Vector3(5.5, 0, 0));
    createAxisLabel('Y', new THREE.Vector3(0, 5.5, 0));
    createAxisLabel('Z', new THREE.Vector3(0, 0, 5.5));

    // Fonction d'animation
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isMobile, quality]);

  // Fonction pour obtenir une couleur en fonction du schéma de couleur
  const getColor = (t: number): THREE.Color => {
    if (colorScheme === "rainbow") {
      // Couleurs arc-en-ciel (HSL)
      return new THREE.Color().setHSL(t, 1.0, 0.5);
    } else if (colorScheme === "heatmap") {
      // Dégradé de chaleur (bleu -> rouge)
      return new THREE.Color(t, 0, 1 - t);
    } else {
      // Schéma par défaut (bleu -> rouge)
      return new THREE.Color(t, 0, 1 - t);
    }
  };

  // Effet pour mettre à jour le graphique lorsque l'équation change
  useEffect(() => {
    if (!sceneRef.current || !equation) return;

    setIsLoading(true);

    // Suppression des graphiques précédents
    const scene = sceneRef.current;
    scene.children = scene.children.filter(
      child => !(child instanceof THREE.Mesh && child.userData.isGraph) && 
               !(child instanceof THREE.Points && child.userData.isGraph)
    );

    try {
      // Générer des points pour le graphique avec résolution ajustable
      const points = ComplexCalculatorEngine.generateComplexGraphPointsDetailed(equation, resolution);
      setGraphData(points);

      if (points.length > 0) {
        // Créer une géométrie pour les points
        if (visualizationMode === "points" || visualizationMode === "all") {
          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(points.length * 3);
          const colors = new Float32Array(points.length * 3);
          
          points.forEach((point, i) => {
            // Position (x, y, z) = (a, re, im)
            positions[i * 3] = point.a;
            positions[i * 3 + 1] = point.re;
            positions[i * 3 + 2] = point.im;
            
            // Couleur basée sur la valeur de a (normalisée entre 0 et 1)
            const t = (point.a + 5) / 10;
            const color = getColor(t);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
          });
          
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          
          // Créer un matériau pour les points
          const material = new THREE.PointsMaterial({
            size: isMobile ? 0.15 : 0.1, // Points plus gros sur mobile pour meilleure visibilité
            vertexColors: true,
            sizeAttenuation: true
          });
          
          // Créer un système de particules
          const particleSystem = new THREE.Points(geometry, material);
          particleSystem.userData.isGraph = true;
          scene.add(particleSystem);
        }
        
        // Créer une courbe 3D
        if ((visualizationMode === "curve" || visualizationMode === "all") && points.length > 1) {
          const curve = new THREE.CatmullRomCurve3(
            points.map(point => new THREE.Vector3(point.a, point.re, point.im))
          );
          
          // Ajuster la qualité en fonction de l'appareil
          const tubularSegments = quality === "high" ? 100 : quality === "medium" ? 50 : 30;
          const radialSegments = quality === "high" ? 8 : quality === "medium" ? 6 : 4;
          
          const curveGeometry = new THREE.TubeGeometry(curve, tubularSegments, 0.05, radialSegments, false);
          
          // Créer un matériau avec dégradé de couleurs
          const colors = [];
          const count = curveGeometry.attributes.position.count;
          
          for (let i = 0; i < count; i++) {
            const t = i / count; // Normaliser entre 0 et 1
            const color = getColor(t);
            colors.push(color.r, color.g, color.b);
          }
          
          curveGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          
          const curveMaterial = new THREE.MeshPhongMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            shininess: 30
          });
          
          const curveMesh = new THREE.Mesh(curveGeometry, curveMaterial);
          curveMesh.userData.isGraph = true;
          scene.add(curveMesh);
        }
        
        // Créer une surface pour les équations de type a^x = x
        if ((visualizationMode === "surface" || visualizationMode === "all") && 
            equation.includes("^") && equation.includes("=")) {
          // Ajuster la qualité en fonction de l'appareil
          const subdivisions = quality === "high" ? 50 : quality === "medium" ? 30 : 20;
          
          const surfaceGeometry = new ParametricGeometry(
            (u, v, target) => {
              // u et v sont entre 0 et 1, les transformer en coordonnées appropriées
              const a = -5 + u * 10; // a varie de -5 à 5
              const theta = v * Math.PI * 2; // angle pour le cercle complexe
              
              // Calculer x = a^z pour différentes valeurs de z sur un cercle complexe
              const r = 0.5; // rayon du cercle dans le plan complexe
              const re = r * Math.cos(theta);
              const im = r * Math.sin(theta);
              
              // Calculer a^(re+im*i) approximativement
              const magnitude = Math.pow(a, re) * Math.exp(-im * Math.log(Math.abs(a)));
              const phase = im * Math.log(Math.abs(a));
              
              const x = magnitude * Math.cos(phase);
              const y = magnitude * Math.sin(phase);
              
              target.set(a, x, y);
            },
            subdivisions, // subdivisions en u
            subdivisions  // subdivisions en v
          );
          
          // Créer un matériau avec dégradé de couleurs
          const colors = [];
          const count = surfaceGeometry.attributes.position.count;
          
          for (let i = 0; i < count; i++) {
            const position = new THREE.Vector3();
            position.fromBufferAttribute(surfaceGeometry.attributes.position, i);
            
            // Normaliser la position pour obtenir une couleur
            const t = (position.x + 5) / 10; // Normaliser entre 0 et 1
            const color = getColor(t);
            colors.push(color.r, color.g, color.b);
          }
          
          surfaceGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          
          const surfaceMaterial = new THREE.MeshPhongMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
            shininess: 30
          });
          
          const surfaceMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
          surfaceMesh.userData.isGraph = true;
          scene.add(surfaceMesh);
          
          // Ajouter un wireframe pour mieux visualiser la surface
          const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true,
            opacity: 0.1
          });
          
          const wireframeMesh = new THREE.Mesh(surfaceGeometry, wireframeMaterial);
          wireframeMesh.userData.isGraph = true;
          scene.add(wireframeMesh);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la génération du graphique:", error);
    } finally {
      setIsLoading(false);
    }
  }, [equation, isMobile, quality, visualizationMode, resolution, colorScheme]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <div className="text-center mb-2 font-semibold text-gray-800 dark:text-gray-200">
        {equation ? `Graphique: ${equation}` : "Entrez une équation et cliquez sur Graph"}
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-[calc(100%-30px)] min-h-[270px] bg-gray-100 dark:bg-gray-700 rounded-lg touch-manipulation"
      />
      {graphData.length > 0 && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
          <p>Axes: X = a (paramètre), Y = partie réelle, Z = partie imaginaire</p>
          <p>{isMobile ? 
            "Utilisez un doigt pour faire pivoter, deux doigts pour zoomer et déplacer" : 
            "Utilisez la souris pour faire pivoter, zoomer et déplacer le graphique"}
          </p>
          
          {/* Options de visualisation */}
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <div className="flex flex-col items-center">
              <label className="text-xs mb-1">Mode de visualisation</label>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setVisualizationMode("points")} 
                  className={`px-2 py-1 rounded text-xs ${visualizationMode === "points" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Points
                </button>
                <button 
                  onClick={() => setVisualizationMode("curve")} 
                  className={`px-2 py-1 rounded text-xs ${visualizationMode === "curve" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Courbe
                </button>
                <button 
                  onClick={() => setVisualizationMode("surface")} 
                  className={`px-2 py-1 rounded text-xs ${visualizationMode === "surface" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Surface
                </button>
                <button 
                  onClick={() => setVisualizationMode("all")} 
                  className={`px-2 py-1 rounded text-xs ${visualizationMode === "all" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Tout
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <label className="text-xs mb-1">Qualité</label>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setQuality("high")} 
                  className={`px-2 py-1 rounded text-xs ${quality === "high" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Haute
                </button>
                <button 
                  onClick={() => setQuality("medium")} 
                  className={`px-2 py-1 rounded text-xs ${quality === "medium" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Moyenne
                </button>
                <button 
                  onClick={() => setQuality("low")} 
                  className={`px-2 py-1 rounded text-xs ${quality === "low" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Basse
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <label className="text-xs mb-1">Couleurs</label>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setColorScheme("default")} 
                  className={`px-2 py-1 rounded text-xs ${colorScheme === "default" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Défaut
                </button>
                <button 
                  onClick={() => setColorScheme("rainbow")} 
                  className={`px-2 py-1 rounded text-xs ${colorScheme === "rainbow" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Arc-en-ciel
                </button>
                <button 
                  onClick={() => setColorScheme("heatmap")} 
                  className={`px-2 py-1 rounded text-xs ${colorScheme === "heatmap" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
                >
                  Thermique
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <label className="text-xs mb-1">Résolution: {resolution}</label>
              <input 
                type="range" 
                min="20" 
                max="200" 
                step="10"
                value={resolution} 
                onChange={(e) => setResolution(parseInt(e.target.value))}
                className="w-32 h-6"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplexGraph;
