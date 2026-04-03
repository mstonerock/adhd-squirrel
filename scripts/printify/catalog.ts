export const MONSTER_DIGITAL_BLACK_BLANKS = {
  '3001': {
    blueprintId: 12,
    variantIds: {
      S: 18100,
      M: 18101,
      L: 18102,
      XL: 18103,
      '2XL': 18104,
      '3XL': 18105,
    },
  },
  '18000': {
    blueprintId: 49,
    variantIds: {
      S: 25397,
      M: 25428,
      L: 25459,
      XL: 25490,
      '2XL': 25521,
      '3XL': 25552,
    },
  },
  '18500': {
    blueprintId: 77,
    variantIds: {
      S: 32918,
      M: 32919,
      L: 32920,
      XL: 32921,
      '2XL': 32922,
      '3XL': 32923,
      '4XL': 32924,
      '5XL': 32925,
    },
  },
} as const;

export type MonsterDigitalBlackBlankCode = keyof typeof MONSTER_DIGITAL_BLACK_BLANKS;

export function getMonsterDigitalBlackBlank(blankCode: string) {
  return MONSTER_DIGITAL_BLACK_BLANKS[blankCode as MonsterDigitalBlackBlankCode];
}

export function getSizeForVariantId(blankCode: string, variantId: number): string {
  const blank = getMonsterDigitalBlackBlank(blankCode);
  if (!blank) {
    throw new Error(`Unsupported Monster Digital blank code: ${blankCode}`);
  }

  const match = Object.entries(blank.variantIds).find(([, id]) => id === variantId);
  if (!match) {
    throw new Error(`Unknown variant id ${variantId} for blank ${blankCode}`);
  }

  return match[0];
}

export function findSizeForVariantId(blankCode: string, variantId: number): string | null {
  const blank = getMonsterDigitalBlackBlank(blankCode);
  if (!blank) {
    return null;
  }

  const match = Object.entries(blank.variantIds).find(([, id]) => id === variantId);
  return match?.[0] ?? null;
}

export function buildVariantSku(storefrontProductId: string, size: string): string {
  return `${storefrontProductId}__${size}`;
}
