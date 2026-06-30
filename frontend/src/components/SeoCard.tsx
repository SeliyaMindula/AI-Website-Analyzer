import { SeoResult, SectionError, isSectionError } from '@/types/analysis';
import { ScoreBadge } from './ScoreBadge';
import { IssueList } from './IssueList';

export function SeoCard({ data }: { data: SeoResult | SectionError }) {
  return (
    <div className="wp-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">SEO</h3>
        {!isSectionError(data) && <ScoreBadge score={data.score} />}
      </div>
      {isSectionError(data) ? (
        <p className="text-red-600 text-sm">{data.error}</p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-2 text-sm text-muted">
            <div>
              <dt>Title</dt>
              <dd className={data.title.present ? 'text-emerald-600' : 'text-red-600'}>
                {data.title.present ? data.title.content ?? 'Present' : 'Missing'}
              </dd>
            </div>
            <div>
              <dt>Meta description</dt>
              <dd className={data.metaDescription.present ? 'text-emerald-600' : 'text-red-600'}>
                {data.metaDescription.present ? 'Present' : 'Missing'}
              </dd>
            </div>
            <div>
              <dt>H1 count</dt>
              <dd className="text-foreground">{data.h1Count}</dd>
            </div>
            <div>
              <dt>Images with alt</dt>
              <dd className="text-foreground">
                {data.images.withAlt}/{data.images.total}
              </dd>
            </div>
          </dl>
          <IssueList issues={data.issues} />
        </>
      )}
    </div>
  );
}
