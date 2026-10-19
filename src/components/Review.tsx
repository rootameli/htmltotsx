import { reasons, type Cancellation } from './ReasonForm';
export function Review({ value, onBack }: { value: Cancellation; onBack: () => void }) {
  return <section aria-labelledby="review-title">
    <h2 className="amz-prime-section-title" id="review-title">Récapitulatif des motifs</h2>
    <ul className="amz-summary">{value.selected.map(id => <li key={id}>{reasons.find(r => r.id === id)?.label}</li>)}</ul>
    {value.detail && <p className="amz-detail-summary">{value.detail}</p>}
    <p className="amz-local-notice" role="status">Cette reproduction fonctionne localement : aucune donnée n’est transmise.</p>
    <div className="amz-actions"><button className="amz-btn amz-btn--secondary" onClick={onBack}>Modifier mes choix</button></div>
  </section>;
}
