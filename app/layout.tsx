import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Annulation de l'abonnement — Amazon.fr",
  description: "Reproduction locale en Next.js du document HTML fourni",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
