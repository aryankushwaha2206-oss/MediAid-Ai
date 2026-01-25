'use client';

import { analyzeXRayImageAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import { AnalyzeXRayImageOutput } from '@/ai/flows/x-ray-image-analysis';
import {
  Loader2,
  Upload,
  X,
  FileImage,
  AlertTriangle,
  ShieldCheck,
  CircleHelp,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Badge } from './ui/badge';

export default function XRayAnalysisForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeXRayImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t, locale } = useLocale();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
  });

  const handleClear = () => {
    setPreview(null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setIsLoading(true);
    setResult(null);

    try {
      const response = await analyzeXRayImageAction({
        photoDataUri: preview,
        language: locale,
      });
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response as AnalyzeXRayImageOutput);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'Could not analyze the image. Please try a different image or try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ConcernLevelInfo = ({
    level,
  }: {
    level: 'low' | 'moderate' | 'high';
  }) => {
    const info = {
      low: {
        icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
        text: t('xray.analysis.concernLevel.low'),
        variant: 'default',
        className: 'bg-green-100 text-green-800 border-green-200',
      },
      moderate: {
        icon: <CircleHelp className="h-5 w-5 text-amber-500" />,
        text: t('xray.analysis.concernLevel.moderate'),
        variant: 'secondary',
        className: 'bg-amber-100 text-amber-800 border-amber-200',
      },
      high: {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        text: t('xray.analysis.concernLevel.high'),
        variant: 'destructive',
      },
    };
    const current = info[level];
    return (
      <Badge
        variant={current.variant}
        className={cn('text-base', current.className)}
      >
        {current.icon}
        <span className="ml-2">{current.text}</span>
      </Badge>
    );
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('xray.upload.title')}</CardTitle>
          <CardDescription>{t('xray.upload.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {!preview ? (
            <div
              {...getRootProps()}
              className={cn(
                'flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors',
                isDragActive ? 'border-primary bg-primary/10' : 'border-border'
              )}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {isDragActive
                    ? t('xray.upload.dragActive')
                    : t('xray.upload.dragInactive')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('xray.upload.fileTypes')}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <Image
                src={preview}
                alt="X-ray preview"
                width={500}
                height={500}
                className="rounded-lg object-contain w-full"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t('xray.upload.clear')}</span>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={!preview || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileImage className="mr-2 h-4 w-4" />
            )}
            {t('xray.upload.button')}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        {isLoading && (
          <Card className="flex flex-col items-center justify-center p-10">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">
              {t('xray.analysis.analyzingTitle')}
            </p>
            <p className="text-muted-foreground">
              {t('xray.analysis.analyzingDescription')}
            </p>
          </Card>
        )}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">
                {t('xray.analysis.resultsTitle')}
              </CardTitle>
              <CardDescription>
                <ConcernLevelInfo level={result.concernLevel} />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base whitespace-pre-wrap">
                {result.explanation}
              </p>
            </CardContent>
            <CardFooter>
              <div className="w-full text-xs text-muted-foreground border-t pt-4">
                <p>
                  <strong>
                    {t('xray.analysis.disclaimer', {
                      disclaimerText: result.disclaimer,
                    }).split(':')[0]}
                    :
                  </strong>
                  {' '}
                  {
                    t('xray.analysis.disclaimer', {
                      disclaimerText: result.disclaimer,
                    })
                      .split(':')
                      .slice(1)
                      .join(':')
                  }
                </p>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
