# Étude 360 V0.6 — Simulation de commissaire de justice

Application statique autonome, à publier sur GitHub puis Netlify. Déposer les fichiers à la racine du dépôt. Aucun build requis.

## V0.6
- Fiche de recouvrement réorganisée en quatre onglets : Synthèse, Décisions, Compte financier, Historique.
- Décompte synthétique toujours visible, y compris montant restant, principal récupéré, frais et droits restant dus, provisions.
- Historique détaillé des nouveaux paiements avec ventilation principal / frais et droits (depuis V0.6 uniquement).
- Écritures par dossier issues du grand livre déjà existant, sans reconstituer artificiellement les anciennes périodes.
- Tâche et retard affichés directement sur le dossier.
- Sauvegardes existantes conservées (clé localStorage identique).

## Attention
Cette version reste un jeu, non un logiciel métier homologué. La fiscalité, les tarifs, le régime des provisions et l'imputation des paiements sont simplifiés. La sauvegarde dépend du navigateur et de l'origine du site.
