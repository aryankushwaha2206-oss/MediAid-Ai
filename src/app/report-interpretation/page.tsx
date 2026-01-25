import ReportInterpretationForm from '@/components/report-interpretation-form';

export default function ReportInterpretationPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">
          Medical Report Interpretation
        </h1>
        <p className="text-muted-foreground">
          Paste your medical report below to get a simplified, easy-to-understand
          explanation.
        </p>
      </header>
      <ReportInterpretationForm />
    </div>
  );
}
