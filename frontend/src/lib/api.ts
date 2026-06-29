import { AnalysisReport } from '@/types/analysis';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function parsePdfFilename(contentDisposition: string | null): string {
  const match = contentDisposition?.match(/filename="(.+)"/);
  return match?.[1] ?? 'website-analysis.pdf';
}

async function savePdfBlob(blob: Blob, filename: string): Promise<void> {
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'PDF report', accept: { 'application/pdf': ['.pdf'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      throw err;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function analyzeUrl(url: string): Promise<AnalysisReport> {
  const res = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Analysis failed');
  }
  return res.json();
}

export async function downloadPdfReport(report: AnalysisReport): Promise<void> {
  const res = await fetch(`${API_URL}/report/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  if (!res.ok) throw new Error('Could not generate PDF. Please try again.');
  const blob = await res.blob();
  const filename = parsePdfFilename(res.headers.get('Content-Disposition'));
  await savePdfBlob(blob, filename);
}
