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
import { Siren } from 'lucide-react';

interface EmergencyAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmergencyAlertDialog({
  open,
  onOpenChange,
}: EmergencyAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Siren className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Potential Emergency Detected
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Based on your input, your situation may require immediate medical
            attention.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-4 bg-red-50/50 border border-red-200 rounded-md text-sm text-red-800">
          <p>
            Please do not delay seeking care. Contact your local emergency
            services, go to the nearest emergency room, or consult a healthcare
            professional immediately.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
