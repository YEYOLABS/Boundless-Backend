/**
 * Helper to match tour codes to tour references and extract kilometers
 */

// Tour code to kilometers mapping with route variants
const TOUR_CODE_KM_MAP: Record<string, { default: number; variants?: Record<string, number> }> = {
  'ZAPAN': { default: 5900 },
  'ZAKRU': { default: 3300 },
  'ZAAD': { 
    default: 2600,
    variants: {
      'north': 2600,
      'south': 3000
    }
  },
  'ZAOUT': { default: 2500 },
  'ZARAI': { 
    default: 3000,
    variants: {
      'north': 3000,
      'south': 3000
    }
  }
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
 * Detect route variant (North/South) from tour reference or name
 * @param tourReference - Tour reference
 * @param tourName - Tour name
 * @returns 'north', 'south', or null
 */
function detectRouteVariant(tourReference: string, tourName?: string): string | null {
  const combined = `${tourReference} ${tourName || ''}`.toUpperCase();
  
  if (combined.includes('NORTH') || combined.includes('N')) {
    return 'north';
  }
  if (combined.includes('SOUTH') || combined.includes('S')) {
    return 'south';
  }
  
  return null;
}

/**
 * Get kilometers for a tour code with variant support
 * @param tourCode - Tour code (e.g., "ZAAD")
 * @param tourReference - Tour reference for variant detection
 * @param tourName - Tour name for variant detection
 * @returns Kilometers for the tour code
 */
export function getKilometersForTourCode(
  tourCode: string, 
  tourReference?: string, 
  tourName?: string
): number {
  const mapping = TOUR_CODE_KM_MAP[tourCode.toUpperCase()];
  if (!mapping) return 0;

  // If no variants, return default
  if (!mapping.variants) {
    return mapping.default;
  }

  // Try to detect variant
  const variant = detectRouteVariant(tourReference || '', tourName);
  if (variant && mapping.variants[variant]) {
    return mapping.variants[variant];
  }

  // Return default if variant not detected
  return mapping.default;
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
    return getKilometersForTourCode(tourCode, tourReference, tourName);
  }

  // Return current value or 0
  return currentEstimatedKm || 0;
}

/**
 * Update tour code mapping from database
 * This allows dynamic updates without code changes
 */
export function updateTourCodeMapping(tourCodes: Array<{ code: string; kilometers: number; routeName?: string }>) {
  for (const tc of tourCodes) {
    const code = tc.code.toUpperCase();
    const routeName = tc.routeName?.toLowerCase() || '';
    
    // Check if this is a variant (North/South)
    if (routeName.includes('north') || routeName.includes('south')) {
      const variant = routeName.includes('north') ? 'north' : 'south';
      
      if (!TOUR_CODE_KM_MAP[code]) {
        TOUR_CODE_KM_MAP[code] = { default: tc.kilometers, variants: {} };
      }
      
      if (!TOUR_CODE_KM_MAP[code].variants) {
        TOUR_CODE_KM_MAP[code].variants = {};
      }
      
      TOUR_CODE_KM_MAP[code].variants![variant] = tc.kilometers;
    } else {
      // Regular tour code without variants
      TOUR_CODE_KM_MAP[code] = { default: tc.kilometers };
    }
  }
}

