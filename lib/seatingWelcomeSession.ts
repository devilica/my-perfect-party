let welcomeShownThisSession = false;

export function shouldShowSeatingWelcome(): boolean {
  return !welcomeShownThisSession;
}

export function markSeatingWelcomeShown(): void {
  welcomeShownThisSession = true;
}
