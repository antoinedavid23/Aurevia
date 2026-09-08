# Validation du modèle — 8 septembre 2026

Statut : **calculs vérifiables, prévisions à calibrer**. La précision de marché
demandée n’est pas atteinte sans historiques et comparables. Aucun benchmark
de quartier, taux de conversion par canal ou couple prix/occupation n’a été inventé.

## Vérifié / fourni / hypothétique

- Vérifié par tests : prix × nuits, nombre exact de biens, frais pondérés par
  revenu, différences de net par canal, signes des contributions, rapprochement
  mensuel/annuel, absence de faux historique pour un lancement.
- Fourni par AUREVIA : majoration fixe de 20% sur le tarif déclaré, objectif
  d’occupation autour de 70%, hypothèse future de distribution à 8%, gestion à
  25%. Base contractuelle des 25% à confirmer. Le +20% est une hypothèse, pas un
  gain de marché mesuré.
- Hérité mais non validé : bases tarifaires locales, coefficients de standing,
  surface, capacité et équipements, répartition saisonnière et scores commerciaux.
- Manquant : tarifs réellement réservés par micro-localisation, fenêtres de
  disponibilité, saisonnalité, qualité de l’annonce, frais futurs par canal,
  élasticité entre prix et remplissage, rendement des piscines/jacuzzis selon usage.

La piscine privée ne déclenche pas un minimum universel de 200 € ou 250 €.
Le nom d’une plateforme ne suffit pas à calculer une hausse de chiffre d’affaires.
Le modèle applique uniquement prix déclaré ×1,20, arrondi au centime. Aucun
coefficient de quartier, standing ou équipement ne s’y ajoute. Les repères
hérités restent internes et ne sont utilisés pour le prix central que lorsqu’il
n’existe pas de tarif actuel (lancement), sans majoration supplémentaire.

## Définitions et sources consultées

Revenus du modèle : nuitées après remises, avant commissions, hors ménage et taxes.
Le taux d’occupation se rapporte aux nuits ouvertes à la vente, usage personnel exclu.
Les frais saisis comprennent commissions et coûts de paiement rapportés à cette
même assiette. Les charges excluent ces frais pour éviter un double comptage.

- [Airbnb — frais de service](https://www.airbnb.com/help/article/1857) : plusieurs
  structures existent. Le modèle demande le taux réellement supporté plutôt
  qu’appliquer automatiquement 3%, 15,5% ou 8% à toutes les annonces.
- [Booking.com — FAQ d’inscription](https://join.booking.com/faq.html) : le taux
  de commission est affiché à l’étape de l’accord. Le modèle n’invente pas un taux contractuel.
- [AirDNA — occupation](https://help.airdna.co/en/articles/8062178-how-does-airdna-calculate-occupancy-rate) :
  distinguer nuits réservées, disponibles et bloquées.
- [AirDNA — tarif moyen](https://help.airdna.co/en/articles/8062173-how-does-airdna-calculate-average-daily-rate-adr) :
  leur ADR comprend le ménage. Il ne peut donc pas être importé tel quel dans notre
  assiette hors ménage. Aucune donnée AirDNA de marché n’a été obtenue ou utilisée.

## Données nécessaires pour la prochaine calibration

Export de 12 mois complets minimum, idéalement 24 pour tester hors échantillon :
identifiant de bien et réservation pseudonymisés, quartier/micro-zone, capacité,
surface, standing, équipements (privé/partagé, piscine ouverte quand), dates de
séjour, nuits offertes et bloquées, canal, revenus nuitées, ménage, remises,
commissions, coûts de paiement et annulations. Aucun nom, email ou téléphone
de voyageur n’est nécessaire.

Une grille AUREVIA validée peut servir de solution provisoire si elle précise
ses cohortes, la période, l’échantillon, l’assiette de revenus et les couples
tarif/occupation. Une annonce affichée à 250 € n’est pas une preuve qu’elle est
réservée à ce prix ni qu’elle maintient 70% d’occupation annuelle.

Le modèle devra ensuite comparer des biens comparables, dédupliquer les annonces
multi-canaux, séparer effet de composition et effet du canal, valider saisonnalité
et disponibilités, puis mesurer les erreurs sur une période non utilisée pour
le calibrage. Tant que ces données manquent, conserver les mentions de scénario.

## Contrôles de livraison

Tests métier et de rendu sans navigateur : aucune réservation ni aucun email réel.
Le contrôle TypeScript global rencontre des erreurs préexistantes du sous-projet
Velyo ; ne pas les corriger dans ce travail. La compilation AUREVIA doit réussir.
