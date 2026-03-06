/**
 * Helper to match tour codes to tour references and extract kilometers
 */

// Tour code to kilometers mapping
const TOUR_CODE_KM_MAP: Record<string, number> = {
  'ZAPAN': 5900,
  'ZAKRU': 3300,
  'ZAAD': 2600,
  'ZAADS': 3000,
  'ZAOUT': 2500,
  'ZARAI': 3000,
  'ZARAIS': 3000
};

/**
 * Extract tour code from tour reference or tour name
 * @param tourReference - Tour reference (e.g., "ZAPAN2026.02.27")
 * @param tourName - Tour name (e.g., "Panorama")
 * @returns Tour code if found (e.g., "ZAPAN")
 */
export function extractTourCode(tourReference: string, tourName?: string): string | null {
  if (!tourReference) return null;

  // Try to match known tour codes in the reference
  const upperRef = tourReference.toUpperCase();
  
  for (const code of Object.keys(TOUR_CODE_KM_MAP)) {
    if (upperRef.includes(code)) {
      return code;
    }
  }

  // If not found in reference, try tour name
  if (tourName) {
    const upperName = tourName.toUpperCase();
    for (const code of Object.keys(TOUR_CODE_KM_MAP)) {
      if (upperName.includes(code)) {
        return code;
      }
    }
  }

  return null;
}

/**
 * Get kilometers for a tour code
 * @param tourCode - Tour code (e.g., "ZAPAN")
 * @returns Kilometers for the tour code, or 0 if not found
 */
export function getKilometersForTourCode(tourCode: string): number {
  return TOUR_CODE_KM_MAP[tourCode.toUpperCase()] || 0;
}

/**
 * Auto-populate estimated_km based on tour reference or name
 * @param tourReference - Tour reference
 * @param tourName - Tour name
 * @param currentEstimatedKm - Current estimated_km value
 * @returns Estimated kilometers
 */
export function autoPopulateEstimatedKm(
  tourReference: string,
  tourName?: string,
  currentEstimatedKm?: number
): number {
  // If estimated_km is already set and non-zero, keep it
  if (currentEstimatedKm && currentEstimatedKm > 0) {
    return currentEstimatedKm;
  }

  // Try to extract tour code and get kilometers
  const tourCode = extractTourCode(tourReference, tourName);
  if (tourCode) {
    return getKilometersForTourCode(tourCode);
  }

  // Return current value or 0
  return currentEstimatedKm || 0;
}

/**
 * Update tour code mapping from database
 * This allows dynamic updates without code changes
 */
export function updateTourCodeMapping(tourCodes: Array<{ code: string; kilometers: number }>) {
  for (const tc of tourCodes) {
    TOUR_CODE_KM_MAP[tc.code.toUpperCase()] = tc.kilometers;
  }
}
