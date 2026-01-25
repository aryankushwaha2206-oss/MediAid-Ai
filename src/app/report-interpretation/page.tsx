'use client';
import ReportInterpretationForm from '@/components/report-interpretation-form';
import { useLocale } from '@/hooks/use-locale';

export default function ReportInterpretationPage() {
  const { t } = useLocale();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">
          {t('report.title')}
        </h1>
        <p className="text-muted-foreground">{t('report.description')}</p>
      </header>
      <ReportInterpretationForm />
    </div>
  );
}
