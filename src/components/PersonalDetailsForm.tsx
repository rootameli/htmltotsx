import { useState, type FormEvent } from 'react';

export function PersonalDetailsForm({ onBack }: { onBack: () => void }) {
  const [complete, setComplete] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.reset();
    setComplete(true);
  }

  if (complete) return <div className="amz-complete" role="status">
    <span className="amz-complete__icon">✓</span>
    <h1 className="amz-prime-title">Informations confirmées</h1>
    <p className="amz-prime-lead">Le questionnaire de démonstration est terminé. Aucune information n&apos;a été transmise ou enregistrée.</p>
    <button className="amz-btn amz-btn--secondary" type="button" onClick={() => setComplete(false)}>Modifier les informations</button>
  </div>;

  return <>
    <h1 className="amz-prime-title">Confirmez vos informations personnelles</h1>
    <p className="amz-prime-lead">Ces informations sont nécessaires pour traiter votre demande Prime.</p>
    <p className="amz-prime-detail">Veuillez remplir tous les champs ci-dessous. Ils doivent correspondre aux données enregistrées sur votre compte Amazon.</p>
    <p className="amz-local-notice">Démonstration locale : les champs sont effacés à la validation et aucune donnée n&apos;est envoyée.</p>
    <form className="amz-coordonnees-form" onSubmit={submit}>
      <FormSection title="Identité" hint="Nom et prénom tels qu'indiqués sur votre compte Amazon.">
        <Field id="nom" label="Nom" autoComplete="family-name" maxLength={50}/>
        <Field id="prenom" label="Prénom" autoComplete="given-name" maxLength={50}/>
        <Field id="date-naissance" label="Date de naissance" placeholder="JJ/MM/AAAA" autoComplete="bday" hint="Format : 31/12/1990" pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"/>
      </FormSection>
      <FormSection title="Contact" hint="Pour vous envoyer la confirmation et vous joindre si nécessaire.">
        <Field id="telephone" label="Téléphone" type="tel" autoComplete="tel" maxLength={14} placeholder="0470 12 34 56" hint="Numéro national avec indicatif local"/>
        <Field id="email" label="Adresse e-mail" type="email" autoComplete="email" maxLength={120}/>
      </FormSection>
      <FormSection title="Adresse" hint="Adresse postale associée à votre compte ou à votre abonnement.">
        <Field id="adresse" label="Adresse" autoComplete="street-address" maxLength={120} placeholder="N° et nom de rue" full/>
        <Field id="code-postal" label="Code postal" autoComplete="postal-code" maxLength={10} placeholder="75001"/>
        <Field id="ville" label="Ville" autoComplete="address-level2" maxLength={80} placeholder="Paris"/>
      </FormSection>
      <div className="amz-actions"><button className="amz-btn amz-btn--primary" type="submit">Continuer</button><button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>Retour</button></div>
    </form>
  </>;
}

function FormSection({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return <section className="amz-form-section"><header className="amz-form-section__head"><h2 className="amz-form-section__title">{title}</h2><p className="amz-form-section__hint">{hint}</p></header><div className="amz-form-grid">{children}</div></section>;
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; full?: boolean };
function Field({ id, label, hint, full, ...inputProps }: FieldProps) {
  return <div className={`amz-field${full ? ' amz-field--full' : ''}`}><label htmlFor={id}>{label} <span className="req">*</span></label><input className="amz-input" id={id} name={id} required {...inputProps}/>{hint && <p className="amz-field-hint">{hint}</p>}</div>;
}
