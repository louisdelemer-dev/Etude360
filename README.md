# Étude 360 · V0.3 — Simulation d'étude de commissaire de justice

Application statique HTML/CSS/JavaScript. Fonctionne directement avec GitHub et Netlify, sans compilation (publish directory `.`).

## Nouveautés V0.3
- **Bureau du jour** dans le menu : décisions à prendre aujourd'hui, tâches en retard (J+), échéances futures, lien direct vers chaque affaire.
- Les dossiers laissés sans arbitrage ne se règlent pas automatiquement ; avancer de 1 ou 7 jours fait apparaître les retards cumulés.
- Référentiel pédagogique 2026 sur certains actes : signification/commandement et saisie-attribution avec coefficient de tranche 0,5 / 1 / 2 ; distinction émoluments réglementés, honoraires libres, TVA et coûts internes estimatifs.
- Journal des actes et ventilation des recettes. Comptes de fonds de tiers séparés de l'exploitation.
- Conservation des anciennes parties sauvegardées sur le même navigateur (`localStorage` clé `etude360-v1`).

## Limites économiques importantes
Le barème complet 2026, droits proportionnels et d'engagement, frais de déplacement, débours exacts, taxes, remises, vacations, différences entre procédures et parties supportant les frais ne sont **pas entièrement modélisés**. Les actes sélectionnés utilisent des bases de tarif publiées mais les calculs qui en découlent demeurent approximatifs. La facturation HT est réputée encaissée instantanément ; la TVA est isolée de la trésorerie d'exploitation. Les coûts opérationnels sont des hypothèses de simulation, non des tarifs officiels. Le recouvrement au succès est un forfait simplifié de jeu. Ne pas utiliser pour facturer un vrai dossier.

## Installation
Téléversez le contenu du dossier `simulation-etude-justice/` à la racine du dépôt GitHub, puis Netlify → Import from Git. Build command vide, publish directory `.`.

## Sources tarifaires à contrôler pour toute évolution
- Code de commerce, art. A444-10 à A444-52 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053602234
- Chambre nationale : https://commissaire-justice.fr/profession-commissaire-de-justice/tarif-frais-et-honoraires-commissaires-de-justice/
- Arrêté du 25 février 2026 applicable depuis le 1er mars 2026.

Toutes les personnes et créances du jeu sont fictives.
