let welcomeShownThisSession = false;

export function shouldShowGuestsWelcome(): boolean {
  return !welcomeShownThisSession;
}

export function markGuestsWelcomeShown(): void {
  welcomeShownThisSession = true;
}
