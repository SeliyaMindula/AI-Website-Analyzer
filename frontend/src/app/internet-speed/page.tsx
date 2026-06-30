import { InternetSpeedTest } from '@/components/InternetSpeedTest';

export default function InternetSpeedPage() {
  return (
    <main className="flex-1 p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Internet Speed Test</h1>
        <p className="text-muted mt-2">Measure your connection — download, upload, ping, and jitter.</p>
      </div>
      <InternetSpeedTest />
    </main>
  );
}
