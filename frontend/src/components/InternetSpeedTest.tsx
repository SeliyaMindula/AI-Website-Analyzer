'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/api';
import { InternetSpeedResult } from '@/types/tools';

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

async function measurePing(samples = 10): Promise<{ pingMs: number; jitterMs: number }> {
  const times: number[] = [];
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    await fetch(`${API_URL}/speed-test/ping`, { cache: 'no-store' });
    times.push(performance.now() - start);
  }
  const pingMs = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  return { pingMs, jitterMs: Math.round(stdDev(times)) };
}

async function measureDownload(size: '1mb' | '5mb'): Promise<number> {
  const start = performance.now();
  const res = await fetch(`${API_URL}/speed-test/download?size=${size}`, { cache: 'no-store' });
  const buf = await res.arrayBuffer();
  const seconds = (performance.now() - start) / 1000;
  const bits = buf.byteLength * 8;
  return (bits / seconds / 1_000_000);
}

async function measureUpload(sizeMb: 1 | 5): Promise<number> {
  const bytes = sizeMb * 1024 * 1024;
  const blob = new Blob([new Uint8Array(bytes)]);
  const start = performance.now();
  await fetch(`${API_URL}/speed-test/upload`, { method: 'POST', body: blob, cache: 'no-store' });
  const seconds = (performance.now() - start) / 1000;
  return (bytes * 8) / seconds / 1_000_000;
}

export function InternetSpeedTest() {
  const [phase, setPhase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InternetSpeedResult | null>(null);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <button
        type="button"
        disabled={!!phase}
        onClick={async () => {
          setError(null);
          setResult(null);
          try {
            setPhase('Measuring ping…');
            const { pingMs, jitterMs } = await measurePing();
            setPhase('Measuring download…');
            const d1 = await measureDownload('1mb');
            const d5 = await measureDownload('5mb');
            const downloadMbps = Math.round(((d1 + d5) / 2) * 10) / 10;
            setPhase('Measuring upload…');
            const u1 = await measureUpload(1);
            const u5 = await measureUpload(5);
            const uploadMbps = Math.round(((u1 + u5) / 2) * 10) / 10;
            setResult({
              downloadMbps,
              uploadMbps,
              pingMs,
              jitterMs,
              testedAt: new Date().toISOString(),
            });
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Speed test failed');
          } finally {
            setPhase(null);
          }
        }}
        className="w-full wp-btn py-3"
      >
        {phase ? phase : 'Start Speed Test'}
      </button>

      {error && <p className="text-center text-red-600 text-sm">{error}</p>}

      {result && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Download', value: `${result.downloadMbps} Mbps` },
            { label: 'Upload', value: `${result.uploadMbps} Mbps` },
            { label: 'Ping', value: `${result.pingMs} ms` },
            { label: 'Jitter', value: `${result.jitterMs} ms` },
          ].map(({ label, value }) => (
            <div key={label} className="wp-card p-4 text-center">
              <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
              <p className="text-xl font-semibold mt-1 text-accent">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
