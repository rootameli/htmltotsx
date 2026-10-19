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
- `src/components/ReasonForm.tsx` : cases à cocher, champ conditionnel et validation.
- `src/components/Review.tsx` : récapitulatif et retour aux choix.
- `src/components/Footer.tsx` : pied de page.

Le parcours comprend deux étapes locales. Les étapes de coordonnées et de paiement ne sont pas implémentées. Les choix restent en mémoire et disparaissent au rechargement. Aucun serveur applicatif, secret ou service externe n'est nécessaire.
