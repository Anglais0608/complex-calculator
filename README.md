# Calculatrice Complexe
Une calculatrice web avancée avec support pour les nombres complexes et visualisation 3D dans le plan complexe.

## Fonctionnalités
- Opérations arithmétiques de base
- Fonctions trigonométriques et logarithmiques
- Support complet des nombres complexes
- Résolution d'équations
- Calcul de dérivées
- Visualisation 3D des équations dans le plan complexe
- Interface responsive adaptée aux appareils mobiles
- Clavier spécial pour les fonctions avancées

## Modes de calcul
- **Mode Standard** : Pour les calculs arithmétiques classiques
- **Mode Équation** : Pour la résolution d'équations
- **Mode Complexe** : Pour les calculs avec nombres complexes

## Visualisation 3D
La calculatrice permet de visualiser des équations dans le plan complexe en 3D. Par exemple, pour visualiser l'équation `a^x = x` :
1. Entrez l'équation dans le champ de saisie
2. Cliquez sur le bouton "Graph"
3. Utilisez la souris pour faire pivoter, zoomer et déplacer le graphique

## Technologies utilisées
- Next.js
- React
- Three.js pour la visualisation 3D
- Math.js pour les calculs mathématiques avancés

## Installation locale
```bash
# Cloner le dépôt
git clone https://github.com/Anglais0608/complex-calculator.git
# Accéder au répertoire
cd complex-calculator
# Installer les dépendances
pnpm install
# Lancer le serveur de développement
pnpm dev
```

## Déploiement
Cette application peut être facilement déployée sur Vercel :
1. Importez le dépôt GitHub dans Vercel
2. Suivez les instructions de déploiement
3. Votre calculatrice sera accessible en ligne

## Exemples d'utilisation
### Calculs de base
- `2 + 3 * 4` = `14`
- `sin(π/2)` = `1`
- `log(100)` = `2`

### Calculs complexes
- `2 + 3i` (nombre complexe)
- `(2+3i) * (4-2i)` = `14 + 8i`
- `|z|(3+4i)` = `5` (module d'un nombre complexe)

### Équations
- `2x + 3 = 7` (résolution: `x = 2`)
- `x^2 - 4 = 0` (résolution: `x = 2, x = -2`)

## Licence
MIT
