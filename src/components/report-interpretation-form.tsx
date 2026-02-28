'use client';

import { interpretMedicalReportAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/hooks/use-locale';
import { Loader2, FileText } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { z } from 'zod';

export default function ReportInterpretationForm() {
  const { t, locale } = useLocale();
  const formSchema = z.object({
    reportText: z.string().min(20, {
      message: t('report.validationError'),
    }),
  });
  type FormData = z.infer<typeof formSchema>;

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
        language: locale,
      });

      if if ("error" in response && response.error) {
          variant: 'destructive',
          title: t('chat.errorTitle'),
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
          onChange={e => setReportText(e.target.value)}
          placeholder={t('report.placeholder')}
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
          {t('report.button')}
        </Button>
      </form>

      {isPending && (
        <Card>
          <CardHeader>
            <CardTitle>{t('report.analyzingTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-center text-muted-foreground">
              {t('report.analyzingDescription')}
            </p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="bg-blue-50/20 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {t('report.resultTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base">
            <p className="whitespace-pre-wrap">{result}</p>
            <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p>
                <strong>{t('report.disclaimer').split(':')[0]}:</strong>{' '}
                {t('report.disclaimer').split(':').slice(1).join(':')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
