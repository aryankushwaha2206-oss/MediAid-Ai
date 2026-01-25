'use client';

import { interpretMedicalReportAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  reportText: z.string().min(20, {
    message: 'Medical report text must be at least 20 characters.',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function ReportInterpretationForm() {
  const [reportText, setReportText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const validation = formSchema.safeParse({ reportText });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    startTransition(async () => {
      const response = await interpretMedicalReportAction({
        reportText: validation.data.reportText,
      });

      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: response.error,
        });
      } else if (response.simplifiedExplanation) {
        setResult(response.simplifiedExplanation);
      }
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="Paste the full text of your medical report here..."
          className="min-h-[200px] text-base"
          aria-label="Medical Report Text"
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Interpret Report
        </Button>
      </form>

      {isPending && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzing Report...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-center text-muted-foreground">
              Please wait while our AI interprets your report.
            </p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="bg-blue-50/20 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Simplified Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p className="whitespace-pre-wrap">{result}</p>
            <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p>
                <strong>Disclaimer:</strong> This is not a professional medical
                diagnosis and should be used for informational purposes only.
                Always consult with a licensed doctor or qualified healthcare
                provider for any medical concerns.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
