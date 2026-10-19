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
type Props = { initial: Cancellation; onBack: () => void; onContinue: (value: Cancellation) => void };

export function ReasonForm({ initial, onBack, onContinue }: Props) {
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
    <fieldset><legend className="amz-prime-section-title">Pourquoi souhaitez-vous annuler votre abonnement ?</legend>
      <p className="amz-prime-section-hint">Sélectionnez un motif, puis poursuivez.</p>
      <ul className="amz-reason-list">{reasons.map(reason => <li className="amz-reason-item" key={reason.id}>
        <input id={`motif-${reason.id}`} name="motif" type="radio" checked={selected.includes(reason.id)} onChange={() => {
          setSelected([reason.id]);
          setError('');
        }}/><label htmlFor={`motif-${reason.id}`}>{reason.label}</label>
      </li>)}</ul>
      <div className="amz-field"><label htmlFor="detail">Précisez votre motif (si Autre)</label>
      <input id="detail" className="amz-input" value={detail} disabled={!hasOther} maxLength={500} onChange={e => setDetail(e.target.value)} placeholder="Décrivez brièvement votre situation"/></div>
    </fieldset>
    {error && <p className="amz-form-error" role="alert">{error}</p>}
    <div className="amz-actions"><button className="amz-btn amz-btn--primary" type="submit">Continuer</button><button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>Retour</button></div>
  </form>;
}
