type ToolSeoBlurbProps = {
  title: string;
  children: React.ReactNode;
};

export function ToolSeoBlurb({ title, children }: ToolSeoBlurbProps) {
  return (
    <section className="max-w-2xl mx-auto mt-12 text-center px-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-2">{title}</h2>
      <p className="text-sm text-muted leading-relaxed">{children}</p>
    </section>
  );
}
