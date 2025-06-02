# Documentation du Projet CardGame

## Vue d'ensemble

CardGame est un jeu de cartes en ligne développé avec Next.js, TypeScript et Supabase. Le jeu permet aux joueurs de collectionner des cartes, d'ouvrir des packs, et de gérer leur collection.

## Structure Technique

### Stack Technologique

- **Frontend** : Next.js 14 avec App Router
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **Authentication** : Supabase Auth
- **State Management** : Zustand
- **Animations** : Framer Motion
- **Son** : Système de son personnalisé avec hooks

### Architecture du Projet

```
src/
├── app/                    # Pages de l'application (App Router)
│   ├── auth/              # Authentication
│   ├── boosters/          # Boutique de boosters
│   ├── collection/        # Collection de cartes
│   └── rewards/           # Système de récompenses
├── components/            # Composants React
│   ├── cards/            # Composants liés aux cartes
│   ├── layout/           # Composants de mise en page
│   ├── ui/               # Composants UI réutilisables
│   └── effects/          # Effets visuels
├── store/                # State management (Zustand)
├── types/                # Types TypeScript
├── hooks/                # Custom hooks
└── lib/                  # Utilitaires et configurations
```

## Fonctionnalités Principales

### 1. Système de Cartes

- Chaque carte possède :
  - ID unique
  - Nom
  - Description
  - Rareté (common, uncommon, rare, legendary)
  - Statistiques (attack, defense, mana)
  - État visuel (isRevealed pour les animations)

### 2. Système de Boosters

- Trois types de packs :
  - Pack de démarrage (100 💎)
  - Pack premium (300 💎)
  - Pack légendaire (1000 💎)
- Chaque pack contient :
  - Nombre spécifique de boosters
  - Distribution de raretés garantie
  - Animation d'ouverture interactive

### 3. Système Économique

- Monnaie : Diamants (💎)
- Sources de diamants :
  - Récompenses quotidiennes
  - Quêtes
  - Achats (à implémenter)

### 4. Collection

- Vue en grille des cartes
- Filtres :
  - Par rareté
  - Par nom
  - Par statistiques
- Affichage détaillé des cartes
- Compteur de duplicatas

### 5. Interface Utilisateur

- Design sombre moderne
- Animations fluides
- Retours sonores
- Responsive design

## Base de Données

### Tables Principales

1. **user_cards**

   - Cartes possédées par les utilisateurs
   - Quantité de chaque carte

2. **user_diamonds**

   - Solde de diamants des utilisateurs
   - Historique des transactions

3. **daily_rewards**
   - Système de récompenses quotidiennes
   - État de réclamation

## Système d'Animation

- Animations de cartes avec Framer Motion
- Transitions de pages fluides
- Effets visuels pour les événements importants

## Système de Son

- Sons pour :
  - Ouverture de cartes
  - Achat de packs
  - Hover sur les éléments
  - Récompenses

## État Global (Zustand)

- **cardsStore** : Gestion de la collection
- **diamondsStore** : Gestion de la monnaie
- **rewardsStore** : Gestion des récompenses

## Styles et Thème

- Palette de couleurs :
  - Fond : Tons de gris foncé
  - Accents : Violet (principal)
  - Raretés :
    - Common : Gris
    - Uncommon : Vert
    - Rare : Bleu
    - Legendary : Violet

## Conventions de Code

- TypeScript strict
- Composants côté client marqués avec "use client"
- Nommage en français pour l'interface utilisateur
- Nommage en anglais pour le code

## Migrations Supabase

Les fichiers de migration sont dans `supabase/migrations/` et incluent :

- Création des tables
- Politiques de sécurité
- Fonctions SQL personnalisées

## Fonctionnalités à Venir

1. Système de combat
2. Classement des joueurs
3. Échange de cartes
4. Événements spéciaux
5. Système d'amis

## Notes pour le Développement

- Toujours utiliser les types TypeScript appropriés
- Maintenir la cohérence des animations
- Suivre le système de design établi
- Tester les fonctionnalités sur différents appareils
- Gérer les états de chargement et d'erreur
