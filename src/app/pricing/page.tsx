'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/hooks/use-locale';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const { t } = useLocale();

  const plans = [
    {
      name: t('pricing.plans.free.name'),
      price: {
        monthly: '₹0',
        yearly: '₹0',
      },
      description: t('pricing.plans.free.description'),
      features: [
        t('pricing.plans.free.features.symptomChecker'),
        t('pricing.plans.free.features.aiChat'),
        t('pricing.plans.free.features.healthTips'),
        t('pricing.plans.free.features.reportUpload'),
      ],
      cta: t('pricing.plans.free.cta'),
      variant: 'default',
    },
    {
      name: t('pricing.plans.basic.name'),
      price: {
        monthly: '₹99',
        yearly: '₹999',
      },
      description: t('pricing.plans.basic.description'),
      features: [
        t('pricing.plans.basic.features.symptomChecks'),
        t('pricing.plans.basic.features.reportAnalysis'),
        t('pricing.plans.basic.features.aiChat'),
        t('pricing.plans.basic.features.historyStorage'),
      ],
      cta: t('pricing.plans.basic.cta'),
      variant: 'default',
    },
    {
      name: t('pricing.plans.pro.name'),
      price: {
        monthly: '₹299',
        yearly: '₹2,999',
      },
      description: t('pricing.plans.pro.description'),
      features: [
        t('pricing.plans.pro.features.everythingInBasic'),
        t('pricing.plans.pro.features.imagingAnalysis'),
        t('pricing.plans.pro.features.priorityResponses'),
        t('pricing.plans.pro.features.riskPrediction'),
        t('pricing.plans.pro.features.downloadableReports'),
      ],
      cta: t('pricing.plans.pro.cta'),
      variant: 'primary',
    },
  ];

  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
          {t('pricing.title')}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('pricing.description')}
        </p>
      </header>

      <div className="flex justify-center items-center gap-4">
        <span
          className={cn(
            'font-medium',
            billingCycle === 'monthly'
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          {t('pricing.monthly')}
        </span>
        <Switch
          checked={billingCycle === 'yearly'}
          onCheckedChange={checked =>
            setBillingCycle(checked ? 'yearly' : 'monthly')
          }
          aria-label="Toggle billing cycle"
        />
        <span
          className={cn(
            'font-medium',
            billingCycle === 'yearly' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {t('pricing.yearly')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <Card
            key={plan.name}
            className={cn(
              'flex flex-col',
              plan.variant === 'primary' && 'border-primary ring-2 ring-primary'
            )}
          >
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
              <div className="text-4xl font-bold">
                {plan.price[billingCycle]}
                <span className="text-sm font-normal text-muted-foreground">
                  {billingCycle === 'monthly'
                    ? t('pricing.perMonth')
                    : t('pricing.perYear')}
                </span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="size-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.variant === 'primary' ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
