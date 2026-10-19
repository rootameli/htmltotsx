# Conversion Next.js / TypeScript

Conversion du fichier MHTML fourni en application Next.js avec App Router et composants TSX. Le design de la page source est reproduit localement. Aucun script, formulaire distant, suivi, collecte de coordonnées ou paiement du document source n'est exécuté.

## Utilisation

Node.js 22.12+ ou 24 recommandé.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm start
```

## Structure

- `app/layout.tsx` et `app/page.tsx` : App Router Next.js.
- `app/globals.css` : reproduction responsive du design.
- `src/App.tsx` : assemblage et état du parcours côté client.
- `src/components/Header.tsx` : en-tête et navigation.
- `src/components/OrderChoice.tsx` : commande confirmée et choix annulation/remboursement (`1.mhtml`).
- `src/components/ReasonForm.tsx` : motifs, champ conditionnel et validation (`2.mhtml`).
- `src/components/PersonalDetailsForm.tsx` : coordonnées et validation locale (`3.mhtml`).
- `src/components/SummaryStep.tsx` : récapitulatif de la sélection (`4.mhtml`).
- `src/components/SafePaymentStep.tsx` : confirmation sûre avec carte fictive masquée (`5.mhtml`).
- `src/components/LoadingStep.tsx` : animation locale de traitement (`loading.mhtml`).
- `src/components/ConfirmationStep.tsx` : résultat final de la simulation (`confirmation.mhtml`).
- `src/components/Footer.tsx` : pied de page.

Le parcours reprend les écrans MHTML dans leur ordre : `1 → 2 → 3 → 4 → 5 → loading → confirmation`. Les choix et les coordonnées restent uniquement en mémoire pendant l'affichage et disparaissent au rechargement. Le formulaire de coordonnées est effacé dès sa validation. Aucun serveur applicatif, secret ou service externe n'est nécessaire.

Le motif d'annulation est un choix unique. Le formulaire de coordonnées formate automatiquement la date de naissance (`JJ/MM/AAAA`) et le téléphone, contrôle les dates réelles, le code postal à cinq chiffres et les formats des noms et de la ville.

L'étape 5 utilise uniquement une carte fictive masquée. Elle ne demande et ne traite aucun numéro de carte, date d'expiration ou cryptogramme.

L'interface applique un zoom global de 80 % tout en conservant le bloc principal centré. Les champs carte visibles à l'étape 5 sont en lecture seule, ne possèdent pas d'attribut `name`, ne sont pas dans un formulaire et affichent uniquement les valeurs de test publiques `4242 4242 4242 4242`, `12/34` et `123`.

Les logos Visa, Mastercard et American Express affichés dans l'en-tête du bloc de paiement proviennent du dossier `assets/images` du dépôt. Le montant total affiché pour le prototype est `249,90 EUR`.

Les images et les polices utilisées viennent du dossier `assets/` ajouté au dépôt. Les assets non utilisés par ces trois écrans restent disponibles pour les prochaines étapes.

## Déploiement Vercel

Le projet utilise le preset Next.js et produit son build dans `.next`. Le fichier `vercel.json` configure ces valeurs explicitement afin de remplacer un ancien réglage Vite pointant vers `dist`.
