export interface SurveyResults {
  userProfile: 'producer' | 'consultant' | 'agronomist' | 'other';
  customProfile?: string;
  farmSize: '<500ha' | '500-2000ha' | '2000-10000ha' | '>10000ha';
  mainCrops: string[]; // Array of crop names like ['soy', 'corn', 'wheat', etc.]
  customCrops?: string;
  currentSoftware: 'spreadsheets' | 'external_consultant' | 'no_other' | 'commercial_software';
  customSoftware?: string;
  mainChallenge: 'cost' | 'logistics' | 'field_confidence' | 'time_shortage' | 'other';
  customChallenge?: string;
  pilotInterest: 'interested' | 'prefer_wait';
  completedAt: string; // ISO date string
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  results?: SurveyResults;
}

export type SurveyStep = 
  | 'profile'
  | 'farm-size'
  | 'crops'
  | 'software'
  | 'challenges'
  | 'pilot-interest';