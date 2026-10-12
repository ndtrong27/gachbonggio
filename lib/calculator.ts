export interface ProductDimensions {
  widthMm: number;
  heightMm: number;
  thicknessMm: number;
  piecesPerM2: number;
  estimatedWeightKg: number;
  sizeLabel: string;
}

export interface CalculationResult {
  widthM: number;
  heightM: number;
  areaM2: number;
  netPieces: number;
  wastagePercent: number;
  wastagePieces: number;
  totalPieces: number;
  totalWeightKg: number;
  piecesPerM2: number;
  sizeLabel: string;
}

/**
 * Parse a size string (e.g., "290x290x90 mm", "400x400x50 mm", "300x300x40 mm")
 * and extract standard construction dimensions, pieces per m2, and approximate weight.
 */
export function parseProductDimensions(sizeStr?: string | null, category?: string): ProductDimensions {
  if (!sizeStr) {
    return {
      widthMm: 290,
      heightMm: 290,
      thicknessMm: 90,
      piecesPerM2: 11,
      estimatedWeightKg: 8.0,
      sizeLabel: '290 × 290 × 90 mm',
    };
  }

  // Extract numbers: e.g. "290x290x90 mm" -> [290, 290, 90]
  const numbers = sizeStr.match(/\d+/g)?.map(Number) || [];
  const widthMm = numbers[0] || 290;
  const heightMm = numbers[1] || numbers[0] || 290;
  const thicknessMm = numbers[2] || 65;

  // Standard construction dimensions in Vietnam
  let piecesPerM2 = 11;
  let estimatedWeightKg = 7.5;

  if (widthMm <= 200 && heightMm <= 200) {
    // 190x190 or 200x200: ~25 pieces/m2
    piecesPerM2 = 25;
    estimatedWeightKg = category?.includes('men') ? 2.0 : 3.2;
  } else if (widthMm <= 310 && heightMm <= 310) {
    // 290x290 or 300x300: ~11 pieces/m2 with mortar joint
    piecesPerM2 = 11;
    if (category?.includes('men')) {
      estimatedWeightKg = 3.8;
    } else if (category?.includes('nung')) {
      estimatedWeightKg = 3.5;
    } else {
      estimatedWeightKg = 8.0;
    }
  } else if (widthMm >= 380 && heightMm >= 380) {
    // 400x400: ~6.25 pieces/m2
    piecesPerM2 = 6.25;
    estimatedWeightKg = category?.includes('men') ? 6.0 : 5.5;
  }

  return {
    widthMm,
    heightMm,
    thicknessMm,
    piecesPerM2,
    estimatedWeightKg,
    sizeLabel: `${widthMm} × ${heightMm} × ${thicknessMm} mm`,
  };
}

/**
 * Calculate required brick quantities based on wall width and height
 */
export function calculateBrickQuantity(
  widthM: number,
  heightM: number,
  sizeStr?: string | null,
  category?: string,
  wastagePercent: number = 5
): CalculationResult {
  const safeWidth = Math.max(0.1, Number(widthM) || 0);
  const safeHeight = Math.max(0.1, Number(heightM) || 0);
  const dims = parseProductDimensions(sizeStr, category);

  const areaM2 = Math.round(safeWidth * safeHeight * 100) / 100;
  const netPieces = Math.ceil(areaM2 * dims.piecesPerM2);
  const wastagePieces = Math.ceil((netPieces * wastagePercent) / 100);
  const totalPieces = netPieces + wastagePieces;
  const totalWeightKg = Math.round(totalPieces * dims.estimatedWeightKg * 10) / 10;

  return {
    widthM: safeWidth,
    heightM: safeHeight,
    areaM2,
    netPieces,
    wastagePercent,
    wastagePieces,
    totalPieces,
    totalWeightKg,
    piecesPerM2: dims.piecesPerM2,
    sizeLabel: dims.sizeLabel,
  };
}
