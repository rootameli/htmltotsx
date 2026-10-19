# Démonstration React / TypeScript

Conversion structurelle du fichier MHTML fourni en composants TSX. La marque et les liens externes ont été remplacés par une interface indépendante `atelier+`. Aucun script, formulaire distant, suivi, collecte de coordonnées ou paiement du document source n'est exécuté.

## Utilisation

Node.js 22.12+ ou 24 recommandé.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Structure

- `src/App.tsx` : assemblage et état du parcours.
- `src/components/Header.tsx` : en-tête et navigation.
- `src/components/ReasonForm.tsx` : cases à cocher, champ conditionnel et validation.
- `src/components/Review.tsx` : récapitulatif et retour aux choix.
- `src/components/Footer.tsx` : pied de page.
- `src/styles.css` : styles adaptatifs.

Le parcours comprend deux étapes locales. Les étapes de coordonnées et de paiement ne sont pas implémentées. Les choix restent en mémoire et disparaissent au rechargement. Aucun serveur applicatif, secret ou service externe n'est nécessaire.
