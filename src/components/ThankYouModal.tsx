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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-domine text-gray-900">
              Obrigado pelo interesse!
            </h2>
            <p className="text-gray-600 font-outfit">
              Você será um dos primeiros a descobrir quando o Agristato 
              estiver disponível e ainda receberá uma oferta imperdível!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}