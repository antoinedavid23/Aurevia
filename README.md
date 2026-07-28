# AUREVIA Private Concierge

Site complet de démonstration pour une conciergerie immobilière haut de gamme à Genova et en Liguria. L’expérience est pensée pour convertir des propriétaires vers une évaluation privée.

## Lancer le projet

```bash
npm install
npm run dev
```

Vérifications :

```bash
npm run lint
npm run build
```

## Fonctionnalités

- Pages éditoriales, services et fiches dynamiques
- Propriétés et expériences de démonstration
- Simulateur de revenus indicatif documenté dans `lib/simulator.ts`
- Formulaires contact et évaluation avec validation client/serveur et honeypot
- API routes prêtes à connecter à Resend
- SEO, Open Graph, sitemap, robots et données structurables
- Animations respectant `prefers-reduced-motion`
- Responsive mobile, tablette et desktop
- Logo, symboles, favicon et carte sociale

## Variables

Copier `.env.example` vers `.env.local`, puis remplacer les coordonnées. Sans clé Resend, les routes valident la demande et enregistrent uniquement un événement non sensible dans les logs.

## Images

Les emplacements sont préparés sous `public/images`. Les prompts de production sont dans `IMAGE_PROMPTS.md`. Les aplats éditoriaux servent de placeholders élégants jusqu’à l’arrivée des photographies finales.

## Avant publication

- Remplacer coordonnées, témoignages, propriétés et photos démonstratives
- Faire valider les pages légales et la politique cookies
- Configurer le destinataire email et Resend
- Compléter les données de l’entreprise et les réseaux sociaux
- Vérifier les coefficients du simulateur avec l’équipe commerciale
