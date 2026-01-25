'use client';
import XRayAnalysisForm from '@/components/x-ray-analysis-form';
import { useLocale } from '@/hooks/use-locale';

export default function XRayAnalysisPage() {
  const { t } = useLocale();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">{t('xray.title')}</h1>
        <p className="text-muted-foreground">{t('xray.description')}</p>
      </header>
      <XRayAnalysisForm />
    </div>
  );
}
