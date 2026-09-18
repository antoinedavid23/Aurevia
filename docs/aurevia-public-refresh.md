# Refonte publique Aurevia

## Périmètre convenu

Reprise du site public Velyo dans Aurevia. Les polices Lato/Montserrat et la pile éditoriale Didot/Bodoni/Times New Roman, les proportions, les espacements et les animations restent conservés. Derniers ajustements : navigation bleu nuit, accents or lumineux (sans bronze), fonds ivoire plus neutres et petits textes bleu nuit sur les zones claires. Les titres en or gardent un contraste de 3:1 ; les petits textes et libellés de boutons de 4,5:1 minimum. Le nom reste Aurevia ; il n’y a pas de transformation inverse du projet Velyo.

À la demande du propriétaire, le hero d’accueil original d’Aurevia est conservé : vidéo, composition, signature et liens. Tous les emplacements de logo utilisent désormais la version sans « Private Concierge » déjà créée dans `output/brand/aurevia-logo-bleu-nuit.png`, copiée sans modification dans `public/images/brand/aurevia-logo-no-tagline.png`. Un filtre SVG d’affichage détoure son fond sombre, sans modifier le fichier source.

Publication autorisée explicitement par le propriétaire après validation locale (« okay push tout ça »). Branche de préparation : `codex/aurevia-velyo-local`. Les identifiants de démonstration restent dans `.env.local`, exclu de Git et des envois Vercel ; les accès du site officiel sont inchangés.

## Éléments conservés

- Connexion, administration, gestion des biens et micro-CRM : routes, accès et fonctionnement existants ; seul le fichier de logo affiché change.
- Audit publicitaire, résultats et rendez-vous : routes et calculs existants.
- API de contact/évaluation, stockage et notifications internes : aucune modification.
- Coordonnées Aurevia, Instagram, consentement marketing et pages légales.
- Projet source Velyo : aucune modification.

## Organisation

- `components/BrandSiteShell.tsx` choisit le cadre original pour `/connexion`, `/administration` et `/audit` (y compris leurs sous-pages).
- Les nouvelles pages publiques utilisent `components/public-site`, `data/public-site` et `lib/public-site`.
- Les styles publics sont limités à `[data-aurevia-site]`, excluent le hero original et utilisent des noms d’animations isolés.
- `scripts/sync-velyo-public-styles.mjs` régénère les styles depuis les quatre fichiers Velyo figés dans `vendor/velyo-styles`, sans changer typographie, géométrie ou animations. Il adapte uniquement les couleurs, les noms, les chemins d’images et l’isolation. Le petit fichier de compatibilité conserve le hero, le logo sans slogan dans la navigation, les contrôles de langue Aurevia et le contraste des accents dorés. Le dépôt Velyo complet et les exports locaux ne sont pas nécessaires à la compilation ou aux tests.
- Le traducteur public est séparé. Le traducteur et le contrôleur de langues historiques d’Aurevia sont inchangés.
- Les photos reprises sont dans `public/images/public-site`. Le logo et la vidéo sont les originaux d’Aurevia.
- Le simulateur public reprend la version Velyo ; l’audit Aurevia conserve son modèle financier actuel. Ce sont deux parcours distincts à valider commercialement avant publication.

## Vérifications locales

- 108 tests audit/CRM/accès/consentement relancés et réussis pour ce changement visuel.
- 13 tests de refonte publique : valeurs CSS comparées à Velyo hors recoloration, contraste or/bleu nuit/ivoire, navbar bleu nuit et logo sans mention partagé, import des polices, isolation des pages privées, hero conservé, styles/animations limités au public, fichiers image présents, langues, destinations des formulaires, téléphone dans Contact direct et prestations chauffeur/chef privés.
- Vérification TypeScript réussie.
- Compilation de production Next.js réussie ; 12 routes contrôlées répondent HTTP 200.
- Contrôle navigateur : hero, menu, aller-retour IT/FR/EN, largeur mobile 390 px, services sur grand écran, validation et passage d’étape du formulaire sans envoi.
- Aucun e-mail ni contact de test transmis aux services réels.

Lancer l’aperçu : `npx next dev --webpack --hostname 127.0.0.1 --port 3018`.

Adresse locale : http://127.0.0.1:3018/ .

L’aperçu remis au propriétaire utilise la compilation vérifiée avec `npx next start --hostname 127.0.0.1 --port 3018`. La publication officielle suit la branche `main` du dépôt Aurevia via Vercel, avec `npx next build` défini dans `vercel.json`.
