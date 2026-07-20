export const DEFAULT_GUEST_SIDES: string[] = [];

export const LEGACY_DEFAULT_SIDES = ['Strana mlade', 'Strana mladoženje', 'Zajedničko'];

export const LEGACY_SIDE_TO_LABEL: Record<string, string> = {
  bride: 'Strana mlade',
  groom: 'Strana mladoženje',
  shared: 'Zajedničko',
};

export function stripLegacyDefaultSides(sides: string[] | undefined): string[] {
  return (sides ?? []).filter((s) => !LEGACY_DEFAULT_SIDES.includes(s));
}

export function resolveGuestSide(value: unknown): string {
  if (typeof value === 'string' && value.trim()) {
    return LEGACY_SIDE_TO_LABEL[value] ?? value;
  }
  return '';
}
