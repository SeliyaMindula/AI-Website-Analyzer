import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { CompressImageTool } from '@/components/image/CompressImageTool';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Compress Image Online',
  description: 'Reduce image file size with adjustable quality. Export as JPG, PNG, or WebP — free and private.',
  path: '/image/compress',
});

export default function CompressImagePage() {
  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Compress Image</h1>
        <p className="text-muted mt-2">Shrink file size with adjustable quality.</p>
      </div>
      <CompressImageTool />
      <ToolSeoBlurb title="About this tool">
        Compress photos for web, email, or storage. Adjust quality and format to balance size and
        clarity — all processing happens locally in your browser.
      </ToolSeoBlurb>
    </main>
  );
}
