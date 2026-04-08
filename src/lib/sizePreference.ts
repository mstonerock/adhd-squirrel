const LAST_SELECTED_SIZE_KEY = 'adhd_squirrel_last_selected_size';
const REMEMBERED_CORE_SIZES = new Set(['S', 'M', 'L', 'XL', '2XL', '3XL']);

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

  if (!rememberedSize) {
    return null;
  }

  if (!REMEMBERED_CORE_SIZES.has(rememberedSize) || !availableSizes.includes(rememberedSize)) {
    storage?.removeItem(LAST_SELECTED_SIZE_KEY);
    return null;
  }

  return rememberedSize;
}

export function rememberSelectedSize(size: string): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (!REMEMBERED_CORE_SIZES.has(size)) {
    storage.removeItem(LAST_SELECTED_SIZE_KEY);
    return;
  }

  storage.setItem(LAST_SELECTED_SIZE_KEY, size);
}
