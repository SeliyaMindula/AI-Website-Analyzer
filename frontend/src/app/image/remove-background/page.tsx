import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { RemoveBackgroundTool } from '@/components/image/RemoveBackgroundTool';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Remove Background from Image',
  description:
    'Free AI background remover — runs in your browser. No upload to servers. Download transparent PNG instantly.',
  path: '/image/remove-background',
});

export default function RemoveBackgroundPage() {
  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Remove Background</h1>
        <p className="text-muted mt-2">AI-powered — processed privately in your browser.</p>
      </div>
      <RemoveBackgroundTool />
      <ToolSeoBlurb title="About this tool">
        Remove image backgrounds instantly with on-device AI. Your files never leave your browser —
        ideal for product photos, profile pictures, and social media graphics.
      </ToolSeoBlurb>
    </main>
  );
}
