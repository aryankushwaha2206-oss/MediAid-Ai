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
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertTriangle, Activity, BadgeCheck, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import EmergencyAlertDialog from './emergency-alert-dialog';
import { SymptomBasedGuidanceOutput } from '@/ai/flows/symptom-based-guidance';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  symptoms: z
    .string()
    .min(10, 'Please describe your symptoms in at least 10 characters.'),
  age: z.coerce.number().min(0).optional(),
  gender: z.string().optional(),
  duration: z.string().optional(),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SymptomCheckerForm() {
  const [result, setResult] = useState<SymptomBasedGuidanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const emergencyResult = await detectEmergencyAction({ userInput: values.symptoms });
      if (emergencyResult.isEmergency) {
        setIsEmergency(true);
        setIsLoading(false);
        return;
      }

      const guidanceResult = await symptomBasedGuidanceAction(values);

      if (guidanceResult.error) {
        throw new Error(guidanceResult.error);
      }

      setResult(guidanceResult as SymptomBasedGuidanceOutput);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Failed to get guidance. Please try again.',
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

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Describe your symptoms
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I have a persistent cough, slight fever, and feel very tired.'"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 34" {...field} />
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
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., '3 days'" {...field} />
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
                      <FormLabel>Severity</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Activity className="mr-2 h-4 w-4" />
                )}
                Get Guidance
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <Loader2 className="mx-auto mt-8 h-8 w-8 animate-spin text-primary" />}

      {result && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold font-headline">Possible Causes</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {result.possibleCauses?.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <UrgencyIcon urgency={item.urgency} />
                    {item.cause}
                  </CardTitle>
                  <CardDescription>
                    <Badge variant={
                      item.urgency === 'emergency' ? 'destructive' :
                      item.urgency === 'consult soon' ? 'secondary' : 'default'
                    } className={cn(
                      item.urgency === 'consult soon' && 'bg-amber-100 text-amber-800 border-amber-200'
                    )}>
                      Urgency: {item.urgency.replace('-', ' ')}
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
            <p><strong>Disclaimer:</strong> {result.disclaimer}</p>
          </div>
        </div>
      )}
      <EmergencyAlertDialog open={isEmergency} onOpenChange={setIsEmergency} />
    </>
  );
}
