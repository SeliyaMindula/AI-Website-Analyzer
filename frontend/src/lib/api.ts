import { AnalysisReport } from '@/types/analysis';
import { DnsLookupResult, InternetSpeedResult, IpLookupResult, SslCheckResult, UptimeCheckResult } from '@/types/tools';

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

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Request failed');
  }
  return res.json();
}

export async function analyzeUrl(url: string): Promise<AnalysisReport> {
  return postJson('/analyze', { url });
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

export async function lookupDns(domain: string): Promise<DnsLookupResult> {
  return postJson('/dns/lookup', { domain });
}

export async function checkSsl(domain: string): Promise<SslCheckResult> {
  return postJson('/ssl/check', { domain });
}

export async function checkUptime(url: string): Promise<UptimeCheckResult> {
  return postJson('/uptime/check', { url });
}

export async function lookupIp(query: string): Promise<IpLookupResult> {
  return postJson('/ip/lookup', { query });
}

export { API_URL };
