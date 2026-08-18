let welcomeShownThisSession = false;

export function shouldShowEventsWelcome(): boolean {
  return !welcomeShownThisSession;
}

export function markEventsWelcomeShown(): void {
  welcomeShownThisSession = true;
}
