// returns digits only (used before sending to server)
export function stripPlate(s: string): string {
  return s.replace(/\D/g, '');
}

// formats dashes by length: 7 => xx-xxx-xx, 8 => xxx-xx-xxx
export function formatPlate(raw: string): string {
  const d = stripPlate(raw).slice(0, 8);
  if (d.length === 7) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
  if (d.length === 8) return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  return d; // during partial typing shows digits only
}
