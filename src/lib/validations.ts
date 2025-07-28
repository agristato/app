import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Por favor, insira um email válido"),
});

export const surveySchema = z
  .object({
    userProfile: z.enum(["producer", "consultant", "agronomist", "other"]),
    customProfile: z.string().optional(),
    farmSize: z.enum(["<500ha", "500-2000ha", "2000-10000ha", ">10000ha"]),
    mainCrops: z.array(z.string()).min(1, "Selecione pelo menos uma cultura"),
    customCrops: z.string().optional(),
    currentSoftware: z.enum([
      "spreadsheets",
      "external_consultant",
      "no_other",
      "commercial_software",
    ]),
    customSoftware: z.string().optional(),
    mainChallenge: z.enum(["cost", "logistics", "field_confidence", "time_shortage", "other"]),
    customChallenge: z.string().optional(),
    pilotInterest: z.enum(["interested", "prefer_wait"]),
  })
  .refine(
    (data) => {
      // If "other" is selected for userProfile, customProfile is required
      if (data.userProfile === "other" && !data.customProfile) {
        return false;
      }
      // If "commercial_software" is selected, customSoftware is required
      if (data.currentSoftware === "commercial_software" && !data.customSoftware) {
        return false;
      }
      // If "other" is selected for mainChallenge, customChallenge is required
      if (data.mainChallenge === "other" && !data.customChallenge) {
        return false;
      }
      return true;
    },
    {
      message: "Por favor, preencha todos os campos obrigatórios",
    },
  );

export type EmailFormData = z.infer<typeof emailSchema>;
export type SurveyFormData = z.infer<typeof surveySchema>;
