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
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-domine text-gray-900">
              Email já cadastrado
            </h2>
            <p className="text-gray-600 font-outfit">
              O email <span className="font-semibold text-gray-900">{email}</span> já foi cadastrado anteriormente na nossa lista de espera.
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-green-700 hover:bg-green-800 font-outfit font-semibold"
          >
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}