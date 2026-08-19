'use client';

import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThankYouModal({ isOpen, onClose }: ThankYouModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="w-16 h-16 bg-moss/15 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-moss" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-display text-ink">
              Obrigado pelo interesse!
            </h2>
            <p className="text-ink/60 font-sans">
              Você será um dos primeiros a descobrir quando o Agristato
              estiver disponível e ainda receberá uma oferta imperdível!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
