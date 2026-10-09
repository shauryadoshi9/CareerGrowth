export type UserRole = 'student' | 'teacher' | 'admin';

export type Language = 
  | 'en' // English
  | 'hi' // Hindi
  | 'gu' // Gujarati
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'kn' // Kannada
  | 'bn' // Bengali
  | 'pa' // Punjabi
  | 'ml'; // Malayalam

export type ThemeMode = 'dark' | 'light';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
];

export interface Skill {
  id: string;
  name: string;
  category: 'core_tech' | 'domain_knowledge' | 'practical_vocational' | 'soft_skills';
  currentProficiency: number; // 0 - 100
  requiredProficiency: number; // 0 - 100
  evidenceCount: number;
  certifications?: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  category: string;
  description: string;
  demandIndex: 'High' | 'Very High' | 'Critical';
  avgSalary: string;
  requiredSkills: { skillId: string; skillName: string; minScore: number; weight: number }[];
  description_hi?: string;
  description_gu?: string;
}

export interface SkillGapAnalysis {
  careerId: string;
  careerTitle: string;
  readinessScore: number; // 0 - 100
  totalRequiredSkills: number;
  matchedSkillsCount: number;
  criticalMissingSkills: { name: string; gapScore: number; priority: 'high' | 'medium' | 'low' }[];
  alignedSkills: { name: string; score: number }[];
}

export interface RoadmapStep {
  id: string;
  month: number;
  title: string;
  description: string;
  skillsCovered: string[];
  status: 'completed' | 'in_progress' | 'locked';
  estimatedHours: number;
  topics: {
    id: string;
    title: string;
    type: 'concept' | 'practical' | 'assessment';
    completed: boolean;
  }[];
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  question_hi?: string;
  question_gu?: string;
  options: string[];
  options_hi?: string[];
  options_gu?: string[];
  correctAnswer: number;
  explanation: string;
  explanation_hi?: string;
  explanation_gu?: string;
}

export interface OfflinePack {
  id: string;
  title: string;
  subject: string;
  fileSize: string;
  downloaded: boolean;
  modulesCount: number;
  lastSynced?: string;
  description: string;
}

export interface AtRiskStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskScore: number; // 0 - 100
  strugglingTopics: string[];
  inactivityDays: number;
  lastQuizScore: number;
  recommendedIntervention: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  stipendOrSalary: string;
  type: 'internship' | 'fulltime' | 'vocational_apprenticeship';
  minGpa: number;
  requiredSkills: { skillName: string; level: number }[];
  matchScore?: number;
  eligibilityMet?: boolean;
  alignedSkills?: string[];
  missingSkills?: string[];
}

export interface JobApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  appliedAt: string;
  status: string;
  matchScore: number;
  applicantName: string;
}

export interface ServerHealth {
  status: 'online' | 'offline';
  message: string;
  timestamp: string;
  stats: {
    skillsCount: number;
    submissionsCount: number;
    applicationsCount: number;
    interventionsCount: number;
    copilotCount: number;
    activityCount: number;
  };
}
