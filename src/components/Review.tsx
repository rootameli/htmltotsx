import { reasons, type Cancellation } from './ReasonForm';
export function Review({ value, onBack }: { value: Cancellation; onBack: () => void }) {
  return <section aria-labelledby="review-title">
    <h2 id="review-title">Récapitulatif des motifs</h2>
    <ul className="summary">{value.selected.map(id => <li key={id}>{reasons.find(r => r.id === id)?.label}</li>)}</ul>
    {value.detail && <p className="detail-summary">{value.detail}</p>}
    <p className="notice" role="status">La démonstration est terminée. Aucun abonnement réel n’a été modifié et aucune donnée n’a été transmise.</p>
    <button className="secondary" onClick={onBack}>← Modifier mes choix</button>
  </section>;
}
