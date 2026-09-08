# Localisation du diagnostic AUREVIA

Le questionnaire enregistre un territoire, une zone/commune et un quartier.
Les neuf zones de Gênes reprennent les municipi ; le catalogue n’est pas une
délimitation cadastrale exhaustive. « Autre quartier » permet de préciser une
micro-localisation absente. Changer de zone efface le quartier et l’adresse
précédents pour éviter les associations incohérentes.

Sources géographiques vérifiées le 8 septembre 2026 :

- https://trovailtuoseggio.comune.genova.it/municipi.asp
- https://www.comune.genova.it/amministrazione/municipi
- https://www2.comune.genova.it/content/boccadasse

## Statut des tarifs

**Aucune donnée de marché par quartier n’a été fournie ou validée.** Le modèle
réutilise uniquement les bases du simulateur existant : Gênes 155 €, Nervi
190 €, Camogli 215 €, Rapallo 205 €, Santa Margherita 245 €, Portofino 340 €, autre
localité 165 €. Ces montants sont des bases de scénario, pas des prix moyens
de marché ni des tarifs recommandés à publier.

Nervi dispose d’une base historique spécifique. Sestri Ponente utilise encore
la base de Gênes : il n’existe pas de barème Sestri Ponente validé. Les autres
quartiers non calibrés utilisent également la base de leur localité ; ils
ne reçoivent pas de coefficient inventé.

Le catalogue et les futures bases de quartier sont dans `lib/audit-location.ts`.
Une valeur `scenarioBase: null` active explicitement ce repli. Les bandes de
sensibilité ±25% / ±35% sont utilisées dans le bilan : conventions de scénario,
pas intervalles de confiance ni statistiques de marché.

## Calcul

L’audit et le simulateur public appellent la même fonction
`calculateRevenueOptimization` dans `lib/simulator.ts`. À la demande d’AUREVIA,
le tarif déclaré est majoré de **20% exactement**, arrondi au centime. Les bases
locales et coefficients du bien ne s’y ajoutent pas. Le tarif actuel n’est pas
réécrit et aucun multiplicateur du portefeuille n’est appliqué au prix par nuit.

- Occupation simulée = objectif opérationnel AUREVIA de 70%. Un taux historique
  supérieur n’est conservé que si le tarif reste inchangé : pas de cumul
  automatique des meilleurs prix et taux. Aucun couple prix/occupation validé.
- Nuits projetées = arrondi(nuits disponibles × occupation simulée), comme sur le simulateur.
- Tarif simulé = prix saisi ×1,20, arrondi au centime. Pour un bien non encore
  loué, le prix actuel est nul : le repère local ajusté reste le scénario de
  lancement, sans ajouter 20% et sans inventer d’historique.
- Brut projeté par logement = tarif simulé × nuits projetées.
- Brut du portefeuille = brut par logement × nombre exact de logements.
- Net futur avant impôts = brut × (1 − 8% distribution − 25% AUREVIA) − charges déclarées.
- Net actuel = brut actuel × (1 − frais pondérés des canaux − gestion actuelle) − charges.
  Les 8% futurs sont une hypothèse AUREVIA, jamais une commission universelle.

Les deux commissions sont actuellement calculées sur le brut. La base
contractuelle des 25% reste à confirmer ; aucune déduction séquentielle n’a été
supposée. Exemple arithmétique (pas comparable observé) : sept biens représentés
par un logement à Nervi, tarif déclaré 160 €, occupation 40%, 365 nuits disponibles.
Le tarif simulé est 192 €. Brut actuel : 160 € ×146 nuits ×7 = 163 520 €.
Brut simulé : 192 € ×256 nuits ×7 = 344 064 €, soit 49 152 € par logement.
Les nuits actuelles sont arrondies au plus proche, comme dans le simulateur :
365 ×70% donne 256 nuits (et non les 255 retenues par l’ancien modèle v3).

Les 70% sont un objectif opérationnel fourni par AUREVIA, pas une statistique
de performance mesurée. Un bien déjà très occupé peut connaître une baisse brute
malgré le +20% tarifaire. Le gain net peut être négatif après commissions.
La saisonnalité et les charges ne sont pas recalibrées par quartier.

Le résultat public montre le tarif déclaré et le tarif simulé +20%, pas les
bases locales ni le repère ajusté. Ceux-ci restent dans le dossier interne,
avec `appliedToCentralRate: false` lorsqu’un tarif est déclaré. Sans tarif actuel,
le scénario de lancement et ses limites restent visibles. Les données de contact ne sont pas envoyées lors
des tests. Les résultats stockés issus d’un ancien modèle ne sont plus affichés :
un nouvel audit est demandé pour éviter de présenter les anciens chiffres.

Tests : `node --test tests/audit-location.test.mjs`.
