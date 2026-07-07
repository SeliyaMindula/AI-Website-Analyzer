import { BrokenLinksResult, LinkAssetType } from '@/types/tools';

const typeLabels: Record<LinkAssetType, string> = {
  link: 'Link',
  image: 'Image',
  script: 'Script',
  stylesheet: 'Stylesheet',
};

function limitMessage(result: BrokenLinksResult): string | null {
  if (!result.limitReached) return null;
  switch (result.limitReason) {
    case 'pages':
      return 'Crawl stopped at 50 pages — the site may have more pages.';
    case 'links':
      return 'Stopped after checking 250 unique URLs.';
    case 'timeout':
      return 'Crawl stopped after 60 seconds — try a smaller site or run again.';
    default:
      return 'Crawl limit reached.';
  }
}

export function BrokenLinksResults({ result }: { result: BrokenLinksResult }) {
  const warning = limitMessage(result);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {warning && (
        <p className="text-center text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg px-4 py-3">
          {warning}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="wp-stat">
          <p className="text-xs text-muted uppercase">Pages crawled</p>
          <p className="text-lg font-semibold text-foreground">{result.pagesCrawled}</p>
        </div>
        <div className="wp-stat">
          <p className="text-xs text-muted uppercase">URLs checked</p>
          <p className="text-lg font-semibold text-foreground">{result.linksChecked}</p>
        </div>
        <div className="wp-stat">
          <p className="text-xs text-muted uppercase">Broken</p>
          <p className={`text-lg font-semibold ${result.brokenCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {result.brokenCount}
          </p>
        </div>
        <div className="wp-stat">
          <p className="text-xs text-muted uppercase">OK</p>
          <p className="text-lg font-semibold text-emerald-600">{result.okCount}</p>
        </div>
      </div>

      {result.brokenCount === 0 ? (
        <div className="wp-card p-6 text-center">
          <p className="text-foreground font-medium">No broken links found</p>
          <p className="text-sm text-muted mt-1">
            Checked {result.linksChecked} URLs across {result.pagesCrawled} pages on {result.hostname}.
          </p>
        </div>
      ) : (
        <div className="wp-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Broken URLs ({result.brokenCount})
            </h2>
          </div>
          <ul className="divide-y divide-border max-h-[520px] overflow-y-auto">
            {result.broken.map((entry) => (
              <li key={entry.url} className="px-4 py-3 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase font-medium text-red-600">
                    {entry.statusCode ?? entry.error ?? 'Error'}
                  </span>
                  <span className="text-xs text-muted uppercase">{typeLabels[entry.type]}</span>
                </div>
                <p className="text-sm font-mono text-foreground break-all">{entry.url}</p>
                <p className="text-xs text-muted">
                  Found on: {entry.foundOn.slice(0, 3).join(', ')}
                  {entry.foundOn.length > 3 ? ` +${entry.foundOn.length - 3} more` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.pages.length > 0 && (
        <details className="wp-card overflow-hidden">
          <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-foreground">
            Pages crawled ({result.pages.length})
          </summary>
          <ul className="divide-y divide-border border-t border-border max-h-64 overflow-y-auto">
            {result.pages.map((page) => (
              <li key={page.url} className="px-4 py-2 flex justify-between gap-3 text-sm">
                <span className="text-foreground truncate font-mono">{page.url}</span>
                <span className="text-muted shrink-0">
                  {page.statusCode || '—'} · {page.linkCount} refs
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
