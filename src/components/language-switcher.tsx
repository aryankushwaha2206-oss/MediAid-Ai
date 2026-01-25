'use client';

import { useLocale } from '@/hooks/use-locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="flex items-center gap-2 px-2">
      <Globe className="size-4" />
      <Select
        value={locale}
        onValueChange={value => setLocale(value as 'en' | 'es')}
      >
        <SelectTrigger className="w-full border-0 focus:ring-0 group-data-[collapsible=icon]:hidden">
          <SelectValue placeholder={t('sidebar.language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
