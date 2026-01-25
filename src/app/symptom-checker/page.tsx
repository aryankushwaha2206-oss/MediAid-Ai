import SymptomCheckerForm from '@/components/symptom-checker-form';

export default function SymptomCheckerPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">
          Symptom-Based Guidance
        </h1>
        <p className="text-muted-foreground">
          Describe your symptoms to receive a list of possible causes for
          informational purposes.
        </p>
      </header>
      <SymptomCheckerForm />
    </div>
  );
}
