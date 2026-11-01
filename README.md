# Étude 360 — simulateur d'étude de commissaire de justice

Prototype jouable (V0.1) sans dépendances, adapté à GitHub + Netlify.

## Publier
1. Créer un dépôt GitHub (par exemple `etude-360`).
2. Ajouter à la racine les fichiers `index.html`, `netlify.toml` et `README.md`.
3. Dans Netlify : Add new project → Import an existing project → GitHub → sélectionner le dépôt.
4. Build command : laisser vide. Publish directory : `.`. Déployer.

## Fonctionnalités
- Tableau de bord, passage du temps (1 ou 7 jours)
- Arrivée automatique de dossiers fictifs, gestion de leurs étapes et clôture
- Dossiers personnalisés, collaborateurs, formation, recrutement
- Mandants, prospection, marketing
- Suivi de trésorerie et distinction des fonds de tiers
- Journal d'événements, sauvegarde locale (`localStorage`), remise à zéro

## Limites importantes
Simulation ludique et simplifiée : les frais, honoraires, taux de réussite, durées de procédure, stratégies et salaires sont fictifs. Les tarifs réglementés, les règles de compétence, les voies d'exécution, la comptabilité des fonds de tiers et les exigences déontologiques ne sont **pas** implémentés juridiquement. Ne jamais saisir de données personnelles réelles dans cette version.

La sauvegarde est conservée dans le navigateur courant, sans compte ni synchronisation. Pour une version multi-utilisateurs : prévoir une base de données et authentification (ex. Supabase) avec une architecture sécurisée.
