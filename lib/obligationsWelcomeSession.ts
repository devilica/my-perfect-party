let welcomeShownThisSession = false;

export function shouldShowObligationsWelcome(): boolean {
  return !welcomeShownThisSession;
}

export function markObligationsWelcomeShown(): void {
  welcomeShownThisSession = true;
}
