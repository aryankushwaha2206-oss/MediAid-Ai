'use client';
import SymptomCheckerForm from '@/components/symptom-checker-form';
import { useLocale } from '@/hooks/use-locale';

export default function SymptomCheckerPage() {
  const { t } = useLocale();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">{t('symptoms.title')}</h1>
        <p className="text-muted-foreground">{t('symptoms.description')}</p>
      </header>
      <SymptomCheckerForm />
    </div>
  );
}
