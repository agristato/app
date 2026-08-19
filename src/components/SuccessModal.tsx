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
          <div className="w-16 h-16 bg-moss/15 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-moss" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-display text-ink">
              Bem-vindo à lista de espera!
            </h2>
            <p className="text-ink/60 font-sans">
              Obrigado por se inscrever! Você receberá em primeira mão todas as novidades sobre o lançamento do Agristato.
            </p>
          </div>

          <div className="w-full bg-parchment-75/40 rounded-md p-4 text-center">
            <p className="text-sm text-ink/60 font-sans mb-1">
              Você é o número
            </p>
            <p className="text-2xl font-bold text-rust font-data">
              #{userCount + 1}
            </p>
            <p className="text-sm text-ink/60 font-sans">
              na lista de espera
            </p>
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-rust hover:bg-clay font-sans font-semibold"
          >
            Continuar e garantir oferta especial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
