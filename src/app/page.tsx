import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, FileText, ListPlus, ScanLine, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'X-Ray Analysis',
    description: 'Upload an X-ray to get an educational analysis.',
    link: '/x-ray-analysis',
    icon: <ScanLine className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'xray'),
  },
  {
    title: 'Report Interpretation',
    description: 'Paste a medical report for a simplified explanation.',
    link: '/report-interpretation',
    icon: <FileText className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'report'),
  },
  {
    title: 'Symptom Checker',
    description: 'Describe your symptoms for informational guidance.',
    link: '/symptom-checker',
    icon: <ListPlus className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'symptoms'),
  },
  {
    title: 'Medical AI Chat',
    description: 'Ask health-related questions in a supportive chat.',
    link: '/chat',
    icon: <MessageSquare className="size-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'chat'),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Welcome to MediaID AI
        </h1>
        <p className="text-lg text-muted-foreground">
          Your safety-focused medical AI assistant. How can I help you today?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <Link href={feature.link} key={feature.title} className="group">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
                    <CardTitle className="text-xl font-headline">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                  {feature.icon}
                </div>
                <div className="mt-6 flex items-center text-sm font-semibold text-primary group-hover:underline">
                  Get Started <ArrowRight className="ml-2 size-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
