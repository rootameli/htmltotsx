'use client';

import { useEffect, useState } from 'react';

export function CurrentDate() {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    );
  }, []);

  // Pendant le SSR / au premier rendu : chaîne vide pour éviter le mismatch
  return <>{date || '…'}</>;
}