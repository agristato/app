"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  userCount?: number;
}

export function SuccessModal({ isOpen, onClose, onContinue, userCount = 190 }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-domine text-gray-900">
              Bem-vindo à lista de espera!
            </h2>
            <p className="text-gray-600 font-outfit">
              Obrigado por se inscrever! Você receberá em primeira mão todas as novidades sobre o lançamento do Agristato.
            </p>
          </div>

          <div className="w-full bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 font-outfit mb-1">
              Você é o número
            </p>
            <p className="text-2xl font-bold text-green-700 font-domine">
              #{userCount + 1}
            </p>
            <p className="text-sm text-gray-600 font-outfit">
              na lista de espera
            </p>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-green-700 hover:bg-green-800 font-outfit font-semibold"
          >
            Continuar e garantir oferta especial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
