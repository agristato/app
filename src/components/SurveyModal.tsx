"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SurveyFormData, surveySchema } from "@/lib/validations";
import { SurveyStep } from "@/types/survey";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: SurveyFormData) => void;
}

const steps: { id: SurveyStep; title: string; total: number }[] = [
  { id: "profile", title: "Pesquisa Rápida", total: 6 },
  { id: "farm-size", title: "Pesquisa Rápida", total: 6 },
  { id: "crops", title: "Pesquisa Rápida", total: 6 },
  { id: "software", title: "Pesquisa Rápida", total: 6 },
  { id: "challenges", title: "Pesquisa Rápida", total: 6 },
  { id: "pilot-interest", title: "Pesquisa Rápida", total: 6 },
];

export function SurveyModal({ isOpen, onClose, onComplete }: SurveyModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const { register, handleSubmit, watch, setValue, reset } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setSelectedCrops([]);
      reset();
    }
  }, [isOpen, reset]);

  const watchedProfile = watch("userProfile");
  const watchedSoftware = watch("currentSoftware");
  const watchedChallenge = watch("mainChallenge");

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCropChange = (crop: string, checked: boolean) => {
    let newCrops;
    if (checked) {
      newCrops = [...selectedCrops, crop];
    } else {
      newCrops = selectedCrops.filter((c) => c !== crop);
    }
    setSelectedCrops(newCrops);
    setValue("mainCrops", newCrops);
  };

  const onSubmit = (data: SurveyFormData) => {
    onComplete({
      ...data,
      completedAt: new Date().toISOString(),
    } as SurveyFormData);
  };

  const canProceed = () => {
    switch (currentStepData.id) {
      case "profile":
        return watchedProfile && (watchedProfile !== "other" || watch("customProfile"));
      case "farm-size":
        return watch("farmSize");
      case "crops":
        return selectedCrops.length > 0;
      case "software":
        return (
          watchedSoftware && (watchedSoftware !== "commercial_software" || watch("customSoftware"))
        );
      case "challenges":
        return watchedChallenge && (watchedChallenge !== "other" || watch("customChallenge"));
      case "pilot-interest":
        return watch("pilotInterest");
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStepData.id) {
      case "profile":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-domine">Qual é o seu perfil?</h3>
            <RadioGroup
              value={watchedProfile}
              onValueChange={(value) =>
                setValue("userProfile", value as "producer" | "consultant" | "agronomist" | "other")
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="producer"
                  id="producer"
                  className="border-gray-300 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
                  style={
                    watchedProfile === "producer"
                      ? { borderColor: "#16a34a", backgroundColor: "#16a34a" }
                      : {}
                  }
                />
                <Label htmlFor="producer" className="font-outfit text-gray-900 cursor-pointer">
                  Produtor
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="consultant"
                  id="consultant"
                  className="border-gray-300 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
                  style={
                    watchedProfile === "consultant"
                      ? { borderColor: "#16a34a", backgroundColor: "#16a34a" }
                      : {}
                  }
                />
                <Label htmlFor="consultant" className="font-outfit text-gray-900 cursor-pointer">
                  Consultor
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="agronomist"
                  id="agronomist"
                  className="border-gray-300 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
                  style={
                    watchedProfile === "agronomist"
                      ? { borderColor: "#16a34a", backgroundColor: "#16a34a" }
                      : {}
                  }
                />
                <Label htmlFor="agronomist" className="font-outfit text-gray-900 cursor-pointer">
                  Agrônomo
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="other"
                  id="other"
                  className="border-gray-300 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
                  style={
                    watchedProfile === "other"
                      ? { borderColor: "#16a34a", backgroundColor: "#16a34a" }
                      : {}
                  }
                />
                <Label htmlFor="other" className="font-outfit text-gray-900 cursor-pointer">
                  Outro
                </Label>
              </div>
            </RadioGroup>
            {watchedProfile === "other" && (
              <Input
                {...register("customProfile")}
                placeholder="Especifique seu perfil..."
                className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-200 font-outfit"
              />
            )}
          </div>
        );

      case "farm-size":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-domine">Quantos hectares você gerencia?</h3>
            <RadioGroup
              value={watch("farmSize")}
              onValueChange={(value) =>
                setValue("farmSize", value as "<500ha" | "500-2000ha" | "2000-10000ha" | ">10000ha")
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="<500ha"
                  id="small"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="small" className="font-outfit text-gray-900 cursor-pointer">
                  &lt;500 hectares
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="500-2000ha"
                  id="medium"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="medium" className="font-outfit text-gray-900 cursor-pointer">
                  500-2.000 hectares
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="2000-10000ha"
                  id="large"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="large" className="font-outfit text-gray-900 cursor-pointer">
                  2.000-10.000 hectares
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value=">10000ha"
                  id="xlarge"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="xlarge" className="font-outfit text-gray-900 cursor-pointer">
                  &gt;10.000 hectares
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case "crops":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-domine">Principais culturas na fazenda?</h3>
            <p className="text-sm text-gray-600">Marque até 3 opções</p>
            <div className="space-y-4">
              {["Soja", "Milho", "Feijão", "Algodão", "Cana", "Café", "Outro(s)"].map((crop) => (
                <div key={crop} className="flex items-center space-x-3">
                  <Checkbox
                    id={crop}
                    checked={selectedCrops.includes(crop.toLowerCase())}
                    onCheckedChange={(checked) =>
                      handleCropChange(crop.toLowerCase(), checked as boolean)
                    }
                    className="checkbox-green border-gray-300 data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700 data-[state=checked]:text-white focus-visible:ring-green-200"
                    style={
                      selectedCrops.includes(crop.toLowerCase())
                        ? {
                            backgroundColor: "#16a34a",
                            borderColor: "#16a34a",
                            color: "white",
                          }
                        : {}
                    }
                  />
                  <Label htmlFor={crop} className="font-outfit text-gray-900 cursor-pointer">
                    {crop}
                  </Label>
                </div>
              ))}
            </div>
            {selectedCrops.includes("outro(s)") && (
              <Input
                {...register("customCrops")}
                placeholder="Qual cultura?"
                className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-200 font-outfit"
              />
            )}
          </div>
        );

      case "software":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-domine">
              Hoje você calcula adubação usando...
            </h3>
            <RadioGroup
              value={watchedSoftware}
              onValueChange={(value) =>
                setValue(
                  "currentSoftware",
                  value as
                    | "spreadsheets"
                    | "external_consultant"
                    | "no_other"
                    | "commercial_software",
                )
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="spreadsheets"
                  id="spreadsheets"
                  className="border-gray-300 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
                  style={
                    watchedSoftware === "spreadsheets"
                      ? { borderColor: "#16a34a", backgroundColor: "#16a34a" }
                      : {}
                  }
                />
                <Label htmlFor="spreadsheets" className="font-outfit text-gray-900 cursor-pointer">
                  Planilhas e anotações manuais
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="external_consultant"
                  id="consultant"
                  className="border-gray-300 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
                  style={
                    watchedSoftware === "external_consultant"
                      ? { borderColor: "#16a34a", backgroundColor: "#16a34a" }
                      : {}
                  }
                />
                <Label htmlFor="consultant" className="font-outfit text-gray-900 cursor-pointer">
                  Consultor externo
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="no_other"
                  id="no_other"
                  className="border-gray-300 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
                  style={
                    watchedSoftware === "no_other"
                      ? { borderColor: "#16a34a", backgroundColor: "#16a34a" }
                      : {}
                  }
                />
                <Label htmlFor="no_other" className="font-outfit text-gray-900 cursor-pointer">
                  &quot;No olho&quot;
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="commercial_software"
                  id="commercial"
                  className="border-gray-300 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
                  style={
                    watchedSoftware === "commercial_software"
                      ? { borderColor: "#16a34a", backgroundColor: "#16a34a" }
                      : {}
                  }
                />
                <Label htmlFor="commercial" className="font-outfit text-gray-900 cursor-pointer">
                  Software comercial
                </Label>
              </div>
            </RadioGroup>
            {watchedSoftware === "commercial_software" && (
              <Input
                {...register("customSoftware")}
                placeholder="Qual software?"
                className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-200 font-outfit"
              />
            )}
          </div>
        );

      case "challenges":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-domine">Maior desafio com fertilizantes?</h3>
            <RadioGroup
              value={watchedChallenge}
              onValueChange={(value) =>
                setValue(
                  "mainChallenge",
                  value as "cost" | "logistics" | "field_confidence" | "time_shortage" | "other",
                )
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="cost"
                  id="cost"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="cost" className="font-outfit text-gray-900 cursor-pointer">
                  Custo
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="logistics"
                  id="logistics"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="logistics" className="font-outfit text-gray-900 cursor-pointer">
                  Logística
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="field_confidence"
                  id="confidence"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="confidence" className="font-outfit text-gray-900 cursor-pointer">
                  Confiança nos laudos
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="time_shortage"
                  id="time"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="time" className="font-outfit text-gray-900 cursor-pointer">
                  Falta de tempo
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="other"
                  id="other_challenge"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label
                  htmlFor="other_challenge"
                  className="font-outfit text-gray-900 cursor-pointer"
                >
                  Outro
                </Label>
              </div>
            </RadioGroup>
            {watchedChallenge === "other" && (
              <Input
                {...register("customChallenge")}
                placeholder="Especifique seu desafio..."
                className="mt-2 border-gray-300 focus:border-green-500 focus:ring-green-200 font-outfit"
              />
            )}
          </div>
        );

      case "pilot-interest":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-domine">
              Gostaria de participar do programa piloto fechado?
            </h3>
            <p className="text-sm text-gray-600">
              Acesso antecipado, solução e plataforma com condições especiais.
            </p>
            <RadioGroup
              value={watch("pilotInterest")}
              onValueChange={(value) =>
                setValue("pilotInterest", value as "interested" | "prefer_wait")
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="interested"
                  id="interested"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label
                  htmlFor="interested"
                  className="text-green-700 font-bold font-outfit cursor-pointer"
                >
                  Sim, tenho interesse
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="prefer_wait"
                  id="wait"
                  className="border-gray-300 text-green-700 focus-visible:ring-green-200"
                />
                <Label htmlFor="wait" className="font-outfit text-gray-900 cursor-pointer">
                  Não, prefiro aguardar o lançamento
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold font-domine text-gray-900">
            {currentStepData.title}
          </h2>
          <div className="w-full mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-700 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 font-outfit">{currentStep + 1}/6</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="min-h-[300px]">{renderStep()}</div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center text-gray-600 hover:text-gray-900 font-outfit"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                type="submit"
                disabled={!canProceed()}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold font-outfit px-6 py-2 rounded-lg"
              >
                Finalizar
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center bg-green-700 hover:bg-green-800 text-white font-semibold font-outfit px-6 py-2 rounded-lg"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
