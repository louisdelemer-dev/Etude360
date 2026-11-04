# Étude 360 — V1.1

Simulation de gestion d'une étude de commissaire de justice, pensée comme un **jeu de gestion visuel et ludique**.

## Nouveautés principales

- interface beaucoup plus visuelle : cockpit, cartes, jauges, badges, kanban léger
- progression de l'étude : niveau, rang, score de pilotage, objectifs de partie
- condition de victoire : atteindre un objectif de rentabilité dans le temps imparti
- pression économique réelle : salaires, charges fixes, marketing, capacité, retards
- distinction entre :
  - **pôle amiable** (100 dossiers par chargé, honoraires 10 % HT sur encaissements)
  - **pôle judiciaire** (25 dossiers par clerc)
- mandants avec volumes mensuels plus importants
- profils de débiteurs plus variés
- compte de résultat mensuel avec séparation entre recettes de l'étude et fonds de tiers

## Rappels de simulation

Cette application reste une **simulation pédagogique**. Les règles tarifaires, procédurales et comptables sont simplifiées pour servir le gameplay.

## Déploiement GitHub / Netlify

1. placer `index.html` à la racine du dépôt GitHub ;
2. connecter le dépôt à Netlify ;
3. publier sans commande de build, avec `.` comme dossier de publication.

La sauvegarde est locale au navigateur.
