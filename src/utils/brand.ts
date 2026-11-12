/** Brand spelling is identical in every language; legal names and URLs are kept. */
export function normalizeBrand(text: string): string {
  return text.replace(/하이비나|HI[ -]VINA|Hi[ -]VINA|Hi[ -]Vina|HiVina|HiVINA/g, 'HIVINA');
}
