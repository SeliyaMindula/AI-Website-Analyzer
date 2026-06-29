export function normalizeDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.split('/')[0] ?? domain;
  domain = domain.split(':')[0] ?? domain;
  domain = domain.replace(/\.$/, '');

  if (!domain || !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(domain)) {
    throw new Error('Please enter a valid domain');
  }
  return domain;
}
