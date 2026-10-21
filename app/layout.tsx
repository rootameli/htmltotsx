import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Annulation de l'abonnement — Amazon.fr",
  description: "Gérez vos abonnements : Vous pouvez consulter et gérer vos abonnements Amazon Prime.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}