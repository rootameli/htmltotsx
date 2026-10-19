export const PANEL_COOKIE_NAME = 'panel_session';

export async function createPanelToken(password: string) {
  const input = new TextEncoder().encode(`panel-access:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
