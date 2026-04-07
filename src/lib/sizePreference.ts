const LAST_SELECTED_SIZE_KEY = 'adhd_squirrel_last_selected_size';

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readRememberedSize(availableSizes: string[]): string | null {
  const storage = getStorage();
  const rememberedSize = storage?.getItem(LAST_SELECTED_SIZE_KEY) ?? null;

  return rememberedSize && availableSizes.includes(rememberedSize) ? rememberedSize : null;
}

export function rememberSelectedSize(size: string): void {
  const storage = getStorage();
  storage?.setItem(LAST_SELECTED_SIZE_KEY, size);
}
