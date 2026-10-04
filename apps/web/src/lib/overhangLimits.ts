/**
 * Ueberhaenge: Flaechen, die steiler nach unten zeigen, als ein Drucker ohne
 * Stuetzen schafft. Der Winkel zaehlt von der Senkrechten - eine Wand hat 0°,
 * eine waagerechte Decke 90°. Ueblich sind 45°.
 */
export const DEFAULT_OVERHANG_ANGLE = 45;
export const MIN_OVERHANG_ANGLE = 30;
export const MAX_OVERHANG_ANGLE = 70;
/** What lies this close above the plate rests on it and needs no support. */
export const OVERHANG_PLATE_TOLERANCE = 0.05;

export function normalizeOverhangAngle(value: unknown, fallback = DEFAULT_OVERHANG_ANGLE) {
  const number = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(MAX_OVERHANG_ANGLE, Math.max(MIN_OVERHANG_ANGLE, Math.round(number)));
}

/** -normal.y above this marks an overhang; the shader uses the same number. */
export function overhangDownwardLimit(angle: number) {
  return Math.sin((normalizeOverhangAngle(angle) * Math.PI) / 180);
}
