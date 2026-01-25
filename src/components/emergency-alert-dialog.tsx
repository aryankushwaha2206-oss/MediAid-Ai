'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLocale } from '@/hooks/use-locale';
import { Siren } from 'lucide-react';

interface EmergencyAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmergencyAlertDialog({
  open,
  onOpenChange,
}: EmergencyAlertDialogProps) {
  const { t } = useLocale();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Siren className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            {t('emergency.title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {t('emergency.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-4 bg-red-50/50 border border-red-200 rounded-md text-sm text-red-800">
          <p>{t('emergency.advice')}</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            {t('emergency.understand')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
