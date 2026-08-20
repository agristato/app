"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface DuplicateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function DuplicateEmailModal({ isOpen, onClose, email }: DuplicateEmailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <div className="w-16 h-16 bg-status-warn/15 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-status-warn" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-display text-ink">
              Email já cadastrado
            </h2>
            <p className="text-ink/55 font-sans">
              O email <span className="font-semibold text-ink">{email}</span> já foi cadastrado anteriormente na nossa lista de espera.
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-forest hover:bg-forest-deep font-sans font-semibold"
          >
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
