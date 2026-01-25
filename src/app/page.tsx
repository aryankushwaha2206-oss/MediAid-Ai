'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  ArrowRight,
  FileText,
  ListPlus,
  ScanLine,
  MessageSquare,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/hooks/use-locale';

export default function DashboardPage() {
  const { t } = useLocale();
  const features = [
    {
      title: t('dashboard.features.xray.title'),
      description: t('dashboard.features.xray.description'),
      link: '/x-ray-analysis',
      icon: <ScanLine className="size-6 text-primary" />,
      image: PlaceHolderImages.find(img => img.id === 'xray'),
    },
    {
      title: t('dashboard.features.report.title'),
      description: t('dashboard.features.report.description'),
      link: '/report-interpretation',
      icon: <FileText className="size-6 text-primary" />,
      image: PlaceHolderImages.find(img => img.id === 'report'),
    },
    {
      title: t('dashboard.features.symptoms.title'),
      description: t('dashboard.features.symptoms.description'),
      link: '/symptom-checker',
      icon: <ListPlus className="size-6 text-primary" />,
      image: PlaceHolderImages.find(img => img.id === 'symptoms'),
    },
    {
      title: t('dashboard.features.chat.title'),
      description: t('dashboard.features.chat.description'),
      link: '/chat',
      icon: <MessageSquare className="size-6 text-primary" />,
      image: PlaceHolderImages.find(img => img.id === 'chat'),
    },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('dashboard.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {features.map(feature => (
          <Link href={feature.link} key={feature.title} className="group">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-transparent hover:border-primary/20">
              <CardHeader className="p-0">
                {feature.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={feature.image.imageUrl}
                      alt={feature.image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={feature.image.imageHint}
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold font-headline group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    {feature.icon}
                  </div>
                </div>
                <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('dashboard.getStarted')}{' '}
                  <ArrowRight className="ml-2 size-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
