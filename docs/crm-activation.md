# AUREVIA — activation du CRM privé

## Fonctionnement

- `/administration` : liste de 25 contacts, recherche serveur, filtres et suivi.
- `/api/leads` : authentification obligatoire, aucune réponse privée en cache.
- Le dossier complet est chargé uniquement avec son identifiant, à l’ouverture.
- Aucune actualisation périodique ; retour sur l’onglet et bouton Actualiser uniquement.
- Les instantanés conservent le résultat remis au client, restitué en français sans floutage.
- Après enregistrement confirmé, le mail contient les coordonnées et le lien privé.
- En cas de panne de stockage, l’ancien mail complet reste un secours : ne pas
  supprimer ce secours avant de disposer d’une autre file de réception durable.

## Configuration de production

Hébergement : projet Vercel `aurevia`. Base dédiée Neon `aurevia-crm`, Free,
Francfort. L’intégration fournit `DATABASE_URL` en production, marquée sensible.
Les previews et le développement ne reçoivent pas les accès de production.

1. Terminer la vérification d’identité Vercel dans l’éditeur Query.
2. Vérifier que la base sélectionnée est bien `aurevia-crm`.
3. Appliquer `db/neon/001_crm.sql` une fois, avant publication. Ce fichier ne
   supprime aucune table et n’ajoute aucun contact de démonstration.
4. Ajouter `ADMIN_AUTH_SECRET` dans les variables de production : secret aléatoire
   privé d’au moins 32 caractères. Ne jamais le placer dans Git, un lien ou un message.
   Sa saisie dans l’interface Vercel doit être effectuée par le propriétaire.
5. Conserver les paramètres existants de connexion administrateur et d’e-mail.
6. Vérifier une écriture/relecture autorisée, puis publier la version validée sur main.

La nouvelle version doit rester hors production tant que la table et le secret
administrateur ne sont pas prêts. Sans ce secret, l’accès privé échoue volontairement.
Le projet Vercel est actuellement Hobby ; son usage commercial nécessite une offre
adaptée, à choisir par le propriétaire. Aucun abonnement payant n’a été activé.

## Historique et gestion des biens

Les données historiques de l’ancien hébergement ne sont pas automatiquement copiées.
Ne pas assimiler une base nouvellement créée à une absence de prospects historiques.
Les demandes reçues uniquement par e-mail nécessitent une reprise distincte.
Le gestionnaire des biens et ses médias restent ceux du site existant ; leur ancien
stockage Cloudflare n’est pas migré par la migration CRM et doit être raccordé séparément.

## Vérifications

`node --test tests/admin-crm.test.mjs tests/crm-storage.test.mjs` vérifie les accès,
la lecture exacte des audits, les filtres et les opérations de suivi avec une base
locale de test et un adaptateur Postgres simulé. Cela ne prouve pas une livraison
réelle dans Neon : cette dernière doit être confirmée après activation.

La compilation de production est `npx next build`. `tsconfig.app.json` limite son
analyse au site AUREVIA, sans inclure les projets indépendants présents à côté.
