import { useState, type FormEvent } from 'react';

export const reasons = [
  { id: 'price', label: "Le tarif de l’abonnement est trop élevé" },
  { id: 'benefits', label: "Je n’utilise pas suffisamment les avantages proposés" },
  { id: 'unexpected', label: "Je ne suis pas à l’origine de cet abonnement" },
  { id: 'technical', label: 'Je rencontre un problème technique' },
  { id: 'other', label: 'Autre motif' },
] as const;
export type ReasonId = typeof reasons[number]['id'];
export type Cancellation = { selected: ReasonId[]; detail: string };
type Props = { initial: Cancellation; onContinue: (value: Cancellation) => void };

export function ReasonForm({ initial, onContinue }: Props) {
  const [selected, setSelected] = useState(initial.selected);
  const [detail, setDetail] = useState(initial.detail);
  const [error, setError] = useState('');
  const hasOther = selected.includes('other');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected.length) return setError('Sélectionnez au moins un motif.');
    if (hasOther && !detail.trim()) return setError('Précisez votre autre motif.');
    onContinue({ selected, detail: hasOther ? detail.trim() : '' });
  }
  return <form onSubmit={submit}>
    <fieldset><legend>Pourquoi souhaitez-vous annuler votre abonnement ?</legend>
      <p className="muted">Sélectionnez un ou plusieurs motifs, puis poursuivez.</p>
      <div className="reasons">{reasons.map(reason => <label className={`reason ${selected.includes(reason.id) ? 'selected' : ''}`} key={reason.id}>
        <input type="checkbox" checked={selected.includes(reason.id)} onChange={event => {
          setSelected(current => event.target.checked ? [...current, reason.id] : current.filter(id => id !== reason.id));
          setError('');
        }}/><span>{reason.label}</span>
      </label>)}</div>
      <label className="detail-label" htmlFor="detail">Précisez votre motif (si Autre)</label>
      <input id="detail" className="detail" value={detail} disabled={!hasOther} maxLength={500} onChange={e => setDetail(e.target.value)} placeholder="Décrivez brièvement votre situation" aria-describedby="privacy"/>
      <p id="privacy" className="muted small">N’indiquez aucune information personnelle. Rien n’est envoyé ni enregistré.</p>
    </fieldset>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="primary" type="submit">Continuer <span aria-hidden="true">→</span></button>
  </form>;
}
