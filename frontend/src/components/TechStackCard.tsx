import { SectionError, TechStackResult, isSectionError } from '@/types/analysis';

const confidenceColor = {
  high: 'bg-indigo-600/30 text-indigo-300 border-indigo-600/50',
  medium: 'bg-zinc-700/50 text-zinc-300 border-zinc-600',
  low: 'bg-zinc-800 text-zinc-400 border-zinc-700',
} as const;

export function TechStackCard({ data }: { data: TechStackResult | SectionError }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3">Tech Stack</h3>
      {isSectionError(data) ? (
        <p className="text-red-400 text-sm">{data.error}</p>
      ) : data.technologies.length === 0 ? (
        <p className="text-zinc-500 text-sm">No technologies detected</p>
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
