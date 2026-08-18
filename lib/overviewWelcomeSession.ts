let welcomeShownThisSession = false;

export function shouldShowOverviewWelcome(): boolean {
  return !welcomeShownThisSession;
}

export function markOverviewWelcomeShown(): void {
  welcomeShownThisSession = true;
}
