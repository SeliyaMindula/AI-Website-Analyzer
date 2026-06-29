export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateUrl(input: string): string {
  try {
    const normalized = normalizeUrl(input);
    const parsed = new URL(normalized);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Please enter a valid URL');
    }
    return parsed.href;
  } catch {
    throw new Error('Please enter a valid URL');
  }
}
