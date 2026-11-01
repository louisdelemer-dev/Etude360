# Étude 360 V0.4 — Simulation d'étude de commissaire de justice

Version jouable statique, déploiement GitHub + Netlify : build command vide, publish directory `.`.

## Mise à jour
- Barèmes proportionnels A444-31 et A444-32 à tranches, calculés sur le principal recouvré cumulatif.
- Ventilation des paiements : frais récupérables, droits du débiteur et principal, avec suivi séparé.
- Lors d'une mesure d'exécution : appel de provision auprès du créancier, facturation indicative de l'acte et ajout des frais récupérables TTC au décompte débiteur.
- Remboursement au créancier de la provision à hauteur des frais effectivement recouvrés auprès du débiteur, pas automatiquement lorsqu'une saisie est tentée.
- Affichage dans la fiche dossier des soldes détaillés et des provisions.
- Conservation des sauvegardes préexistantes (localStorage `etude360-v1`).

## Limites juridiques et comptables
Simulation pédagogique, non logiciel de taxation. Le calcul n'inclut pas toutes les exceptions, les procédures spéciales, les remises, le tarif complet des actes, les frais de déplacement et débours ou les règles exactes d'imputation. Le droit débiteur est modélisé pour les dossiers sur titre mais son exigibilité réelle dépend notamment des dispositions et exceptions applicables. Les recettes au titre des droits du créancier sont présumées facturées et réglées immédiatement. La provision du créancier est réputée versée immédiatement dans le jeu ; la répartition comptable simplifiée des provisions, fonds clients et recettes ne remplace pas une comptabilité réelle.

Références principales :
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049217994 (A444-31)
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049217998 (A444-32)
- https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000028747701 (L111-8 CPCE)

Tout le jeu repose sur des personnes et des données fictives.
