import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { ConvertImageTool } from '@/components/image/ConvertImageTool';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Convert Image Format',
  description: 'Convert images between PNG, JPG, and WebP online. Free, private, runs in your browser.',
  path: '/image/convert',
});

export default function ConvertImagePage() {
  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Convert Format</h1>
        <p className="text-muted mt-2">Switch between PNG, JPG, and WebP.</p>
      </div>
      <ConvertImageTool />
      <ToolSeoBlurb title="About this tool">
        Convert image formats without desktop software. Perfect when you need PNG transparency, JPEG
        compatibility, or modern WebP compression.
      </ToolSeoBlurb>
    </main>
  );
}
