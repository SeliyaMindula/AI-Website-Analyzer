import type { Metadata } from 'next';
import { ToolSeoBlurb } from '@/components/ToolSeoBlurb';
import { ResizeImageTool } from '@/components/image/ResizeImageTool';
import { pageMetadata } from '@/lib/site-config';

export const metadata: Metadata = pageMetadata({
  title: 'Resize Image Online',
  description: 'Resize images to exact dimensions with optional aspect ratio lock. Free browser-based tool.',
  path: '/image/resize',
});

export default function ResizeImagePage() {
  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Resize Image</h1>
        <p className="text-muted mt-2">Set width and height in pixels.</p>
      </div>
      <ResizeImageTool />
      <ToolSeoBlurb title="About this tool">
        Scale images for social media, thumbnails, or web use. Lock aspect ratio to avoid distortion
        — fast, free, and private.
      </ToolSeoBlurb>
    </main>
  );
}
