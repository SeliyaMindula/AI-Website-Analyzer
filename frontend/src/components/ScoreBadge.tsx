export function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const color = score >= 80
    ? 'text-emerald-600 dark:text-emerald-400'
    : score >= 50
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-600 dark:text-red-400';
  return (
    <span className={`text-2xl font-bold ${color}`}>
      {label ?? score}
    </span>
  );
}
