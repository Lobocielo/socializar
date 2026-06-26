const VALID_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
  'aol.com', 'icloud.com', 'mail.com', 'protonmail.com', 'proton.me',
  'zoho.com', 'yandex.com', 'gmx.com', 'fastmail.com', 'tutanota.com',
  'msn.com', 'ymail.com', 'rocketmail.com', 'inbox.com', 'me.com',
  'googlemail.com', 'email.com', 'rediffmail.com', 'laposte.net',
  'web.de', 'freenet.de', 't-online.de', 'arcor.de',
  'libre.nl', 'orange.fr', 'wanadoo.fr', 'sfr.fr',
  'virgilio.it', 'alice.it', 'tin.it', 'libero.it',
  'terra.com.br', 'uol.com.br', 'bol.com.br', 'r7.com',
  'yahoo.com.ar', 'hotmail.com.ar', 'gmail.com.ar', 'outlook.com.ar',
  'hotmail.es', 'gmail.es', 'outlook.es', 'yahoo.es',
  'hotmail.com.br', 'gmail.com.br', 'outlook.com.br',
  'hotmail.com.mx', 'gmail.com.mx', 'outlook.com.mx',
  'hotmail.com.co', 'gmail.com.co', 'outlook.com.co',
  'hotmail.cl', 'gmail.cl', 'outlook.cl',
  'hotmail.com.uy', 'gmail.com.uy', 'outlook.com.uy',
  'hotmail.com.py', 'gmail.com.py',
  'hotmail.com.pe', 'gmail.com.pe', 'outlook.com.pe',
  'hotmail.com.ec', 'gmail.com.ec',
  'ciudad.com.ar', 'fibertel.com.ar', 'speedy.com.ar',
  'arnet.com.ar', 'fibertel.com', 'movistar.com.ar',
  'telefonica.net', 'netizen.com.ar', 'wow.com',
];

export function validateEmailFormat(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, error: 'Ingresá tu email' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'El formato del email no es válido' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Email inválido' };
  }

  const [localPart, domain] = parts;

  if (localPart.length < 1) {
    return { valid: false, error: 'Falta el nombre de usuario' };
  }

  if (domain.length < 3) {
    return { valid: false, error: 'Dominio muy corto' };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return { valid: false, error: 'Dominio inválido' };
  }

  if (!VALID_DOMAINS.includes(domain)) {
    return {
      valid: false,
      error: `Dominio "${domain}" no reconocido. Usá un email real (gmail, yahoo, outlook, etc.)`
    };
  }

  return { valid: true };
}

export function isValidEmail(email: string): boolean {
  return validateEmailFormat(email).valid;
}

export function getSuggestionDomain(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  const parts = trimmed.split('@');
  if (parts.length !== 2) return null;

  const [, domain] = parts;
  if (VALID_DOMAINS.includes(domain)) return null;

  const popular = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const input = domain.replace(/\.(com|net|org|ar|es|mx|uy)$/, '');

  for (const pop of popular) {
    if (pop.includes(input) || input.includes(pop.split('.')[0])) {
      return `${parts[0]}@${pop}`;
    }
  }

  return `${parts[0]}@gmail.com`;
}
