'use client';

import {
  detectEmergencyAction,
  symptomBasedGuidanceAction,
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/hooks/use-locale';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  AlertTriangle,
  Activity,
  BadgeCheck,
  Clock,
  Upload,
  X,
} from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import EmergencyAlertDialog from './emergency-alert-dialog';
import { SymptomBasedGuidanceOutput } from '@/ai/flows/symptom-based-guidance';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function SymptomCheckerForm() {
  const { t, locale } = useLocale();
  const formSchema = z.object({
    symptoms: z.string().min(10, t('symptoms.form.symptomsValidationError')),
    photoDataUri: z.string().optional(),
    age: z.coerce.number().min(0).optional(),
    gender: z.string().optional(),
    duration: z.string().optional(),
    severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  });
  type FormValues = z.infer<typeof formSchema>;

  const [result, setResult] = useState<SymptomBasedGuidanceOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          form.setValue('photoDataUri', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
  });

  const handleClearImage = () => {
    setPreview(null);
    form.setValue('photoDataUri', undefined);
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const emergencyResult = await detectEmergencyAction({
        userInput: values.symptoms,
        language: locale,
      });
      if (emergencyResult.isEmergency) {
        setIsEmergency(true);
        setIsLoading(false);
        return;
      }

      const guidanceResult = await symptomBasedGuidanceAction({
        ...values,
        language: locale,
      });

      if (guidanceResult.error) {
        throw new Error(guidanceResult.error);
      }

      setResult(guidanceResult as SymptomBasedGuidanceOutput);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('chat.errorTitle'),
        description: t('chat.errorMessage'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const UrgencyIcon = ({ urgency }: { urgency: string }) => {
    switch (urgency) {
      case 'emergency':
        return <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />;
      case 'consult soon':
        return <Clock className="mr-2 h-5 w-5 text-amber-500" />;
      default:
        return <BadgeCheck className="mr-2 h-5 w-5 text-green-500" />;
    }
  };

  const getUrgencyLevelText = (urgency: string) => {
    const key = `symptoms.results.levels.${urgency.replace(' ', '-')}`;
    return t(key);
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t('symptoms.form.symptomsLabel')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('symptoms.form.symptomsPlaceholder')}
                          className="min-h-[120px] md:min-h-[240px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoDataUri"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {t('symptoms.form.photoLabel')}
                      </FormLabel>
                      <FormControl>
                        {!preview ? (
                          <div
                            {...getRootProps()}
                            className={cn(
                              'flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors h-full',
                              isDragActive
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:bg-primary/5'
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
                              alt="Symptom preview"
                              width={500}
                              height={500}
                              className="rounded-lg object-contain w-full max-h-60"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={handleClearImage}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">
                                {t('xray.upload.clear')}
                              </span>
                            </Button>
                          </div>
                        )}
                      </FormControl>
                      <FormDescription>
                        {t('symptoms.form.photoDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('symptoms.form.ageLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('symptoms.form.agePlaceholder')}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('symptoms.form.genderLabel')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                'symptoms.form.genderPlaceholder'
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">
                            {t('symptoms.form.genders.male')}
                          </SelectItem>
                          <SelectItem value="female">
                            {t('symptoms.form.genders.female')}
                          </SelectItem>
                          <SelectItem value="other">
                            {t('symptoms.form.genders.other')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('symptoms.form.durationLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('symptoms.form.durationPlaceholder')}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('symptoms.form.severityLabel')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                'symptoms.form.severityPlaceholder'
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mild">
                            {t('symptoms.form.severities.mild')}
                          </SelectItem>
                          <SelectItem value="moderate">
                            {t('symptoms.form.severities.moderate')}
                          </SelectItem>
                          <SelectItem value="severe">
                            {t('symptoms.form.severities.severe')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Activity className="mr-2 h-4 w-4" />
                )}
                {t('symptoms.form.button')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Loader2 className="mx-auto mt-8 h-8 w-8 animate-spin text-primary" />
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold font-headline">
            {t('symptoms.results.title')}
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {result.possibleCauses?.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <UrgencyIcon urgency={item.urgency} />
                    {item.cause}
                  </CardTitle>
                  <CardDescription>
                    <Badge
                      variant={
                        item.urgency === 'emergency'
                          ? 'destructive'
                          : item.urgency === 'consult soon'
                          ? 'secondary'
                          : 'default'
                      }
                      className={cn(
                        item.urgency === 'consult soon' &&
                          'bg-amber-100 text-amber-800 border-amber-200'
                      )}
                    >
                      {t('symptoms.results.urgency', {
                        level: getUrgencyLevelText(item.urgency),
                      })}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.rationale}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p>
              <strong>{t('symptoms.disclaimer').split(':')[0]}:</strong>{' '}
              {result.disclaimer}
            </p>
          </div>
        </div>
      )}
      <EmergencyAlertDialog open={isEmergency} onOpenChange={setIsEmergency} />
    </>
  );
}
