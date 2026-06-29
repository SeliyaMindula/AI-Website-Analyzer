export type IssueSeverity = 'error' | 'warning' | 'info';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
export type RecommendationPriority = 'high' | 'medium' | 'low';
export type RecommendationCategory = 'seo' | 'security' | 'speed' | 'tech';
export type HeaderStatus = 'present' | 'missing' | 'weak';
export type TechConfidence = 'high' | 'medium' | 'low';

export interface Issue {
  severity: IssueSeverity;
  message: string;
}

export interface SectionError {
  error: string;
}

export interface SeoResult {
  score: number;
  title: { present: boolean; content?: string; length?: number };
  metaDescription: { present: boolean; content?: string; length?: number };
  canonical?: string;
  robots?: string;
  h1Count: number;
  h1Texts: string[];
  openGraph: { title?: string; description?: string; image?: string };
  lang?: string;
  images: { total: number; withAlt: number; withoutAlt: number };
  issues: Issue[];
}

export interface SecurityHeaderCheck {
  name: string;
  status: HeaderStatus;
  value?: string;
}

export interface SecurityResult {
  score: number;
  headers: SecurityHeaderCheck[];
  issues: Issue[];
}

export interface Technology {
  name: string;
  category: string;
  confidence: TechConfidence;
}

export interface TechStackResult {
  technologies: Technology[];
}

export interface VitalMetric {
  value: string;
  pass: boolean;
}

export interface SpeedOpportunity {
  title: string;
  savings?: string;
}

export interface SpeedResult {
  performanceScore: number;
  lcp: VitalMetric;
  cls: VitalMetric;
  inp: VitalMetric;
  opportunities: SpeedOpportunity[];
}

export interface Recommendation {
  priority: RecommendationPriority;
  category: RecommendationCategory;
  message: string;
}

export interface AnalysisSummary {
  grade: Grade;
  overview: string;
  recommendations: Recommendation[];
}

export interface AnalysisReport {
  url: string;
  analyzedAt: string;
  summary: AnalysisSummary;
  seo: SeoResult | SectionError;
  security: SecurityResult | SectionError;
  speed: SpeedResult | SectionError;
  techStack: TechStackResult | SectionError;
}

export interface RawAnalysisReport {
  url: string;
  seo: SeoResult | SectionError;
  security: SecurityResult | SectionError;
  speed: SpeedResult | SectionError;
  techStack: TechStackResult | SectionError;
}

export interface FetchResult {
  html: string;
  headers: Record<string, string>;
  finalUrl: string;
  statusCode: number;
}

export function isSectionError(
  section: SeoResult | SecurityResult | SpeedResult | TechStackResult | SectionError,
): section is SectionError {
  return 'error' in section;
}
