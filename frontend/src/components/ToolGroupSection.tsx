import { ToolCard } from '@/components/ToolCard';
import type { ToolGroup } from '@/lib/tools-config';

export function ToolGroupSection({ group }: { group: ToolGroup }) {
  return (
    <section id={group.id} className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">{group.title}</h2>
        <p className="text-muted mt-1">{group.description}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {group.tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </section>
  );
}
