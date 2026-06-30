import { SectionError, TechStackResult, isSectionError } from '@/types/analysis';

const confidenceColor = {
  high: 'bg-accent-soft text-accent border-teal-200 dark:border-teal-800',
  medium: 'bg-surface-muted text-foreground border-border',
  low: 'bg-surface-muted text-muted border-border',
} as const;

export function TechStackCard({ data }: { data: TechStackResult | SectionError }) {
  return (
    <div className="wp-card p-4">
      <h3 className="text-lg font-semibold text-foreground mb-3">Tech Stack</h3>
      {isSectionError(data) ? (
        <p className="text-red-600 text-sm">{data.error}</p>
      ) : data.technologies.length === 0 ? (
        <p className="text-muted text-sm">No technologies detected</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.technologies.map((tech, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${confidenceColor[tech.confidence]}`}
              title={`${tech.category} · ${tech.confidence} confidence`}
            >
              {tech.name}
              <span className="opacity-60">{tech.category}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
