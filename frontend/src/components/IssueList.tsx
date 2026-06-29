import { Issue, IssueSeverity } from '@/types/analysis';

export function severityColor(severity: IssueSeverity): string {
  switch (severity) {
    case 'error':
      return 'text-red-400';
    case 'warning':
      return 'text-amber-400';
    case 'info':
      return 'text-zinc-400';
  }
}

export function IssueList({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) return null;
  return (
    <ul className="mt-3 space-y-1 text-sm">
      {issues.map((issue, i) => (
        <li key={i} className={severityColor(issue.severity)}>
          <span className="uppercase text-xs mr-2 opacity-70">{issue.severity}</span>
          {issue.message}
        </li>
      ))}
    </ul>
  );
}
