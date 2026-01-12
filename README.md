# 🏆 Pronos CAN 2025

Application React pour faire des pronos sur les matchs de la CAN (Coupe d'Afrique des Nations).

## 🚀 Installation

```bash
npm install
```

## 💻 Lancement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📋 Fonctionnalités

### 1. Page Login
- Dégradé rouge élégant
- Formulaire de connexion
- Validation des champs

### 2. Page Pronos des Matchs
- Liste de tous les matchs de la CAN
- Input pour saisir les scores de chaque équipe
- Validation des pronos
- Redirection automatique vers la page joueurs

### 3. Page Pronos des Joueurs
- Sélection du meilleur joueur du tournoi
- Sélection du meilleur buteur
- Sélection du meilleur gardien
- Validation finale avec récapitulatif

## 🛠️ Technologies utilisées

- React 18
- React Router DOM
- CSS3 (avec gradients et animations)
- LocalStorage pour la persistance des données

## 📦 Structure du projet

```
src/
  ├── components/
  │   ├── Login.jsx              # Page de connexion
  │   ├── Login.css
  │   ├── MatchPronos.jsx        # Page des pronos matchs
  │   ├── MatchPronos.css
  │   ├── PlayerPronos.jsx       # Page des pronos joueurs
  │   ├── PlayerPronos.css
  │   ├── MatchCard.jsx          # Composant carte de match
  │   └── MatchCard.css
  ├── data/
  │   ├── matches.js             # Données des matchs
  │   └── players.js             # Données des équipes et joueurs
  ├── App.jsx                    # Configuration du routing
  └── App.css
```

## 🎨 Design

- Dégradé rouge (#c31432 → #240b36) pour le thème principal
- Interface responsive
- Animations smooth sur les interactions
- Design moderne et épuré

## 💾 Données

Les pronos sont sauvegardés dans le localStorage :
- `user` : nom d'utilisateur
- `matchPronos` : pronos des matchs
- `playerPronos` : pronos des joueurs

## 🔄 Navigation

1. `/` - Page de login
2. `/match-pronos` - Pronos des matchs
3. `/player-pronos` - Pronos des joueurs

## 📝 TODO / Améliorations possibles

- [ ] Ajouter un backend pour sauvegarder les pronos
- [ ] Système de points et classement
- [ ] Comparaison avec les résultats réels
- [ ] Page de récapitulatif des pronos
- [ ] Mode multijoueur
- [ ] Notifications pour les matchs
- [ ] Export des pronos en PDF

## 👨‍💻 Développé par Dylan

Application créée avec une logique de développeur professionnelle :
- Code modulaire et réutilisable
- Composants React optimisés
- Gestion d'état propre
- CSS organisé par composant
- Navigation fluide