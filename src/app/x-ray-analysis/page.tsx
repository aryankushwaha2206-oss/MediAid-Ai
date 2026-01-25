import XRayAnalysisForm from '@/components/x-ray-analysis-form';

export default function XRayAnalysisPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">
          X-Ray & Imaging Analysis
        </h1>
        <p className="text-muted-foreground">
          Upload an X-ray image for an educational analysis. This tool is for
          informational purposes only.
        </p>
      </header>
      <XRayAnalysisForm />
    </div>
  );
}
