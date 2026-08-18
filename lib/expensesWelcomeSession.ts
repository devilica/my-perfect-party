let welcomeShownThisSession = false;

export function shouldShowExpensesWelcome(): boolean {
  return !welcomeShownThisSession;
}

export function markExpensesWelcomeShown(): void {
  welcomeShownThisSession = true;
}
