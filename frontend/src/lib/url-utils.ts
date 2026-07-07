export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function validateUrlInput(input: string): string {
  const normalized = normalizeUrl(input);
  if (!normalized) {
    throw new Error('Please enter a URL');
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error('Please enter a valid URL');
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
    throw new Error('Please enter a valid URL');
  }

  return parsed.href;
}
