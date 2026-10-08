export type UserRole = 'student' | 'teacher' | 'admin';

export type Language = 'en' | 'hi' | 'gu';

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
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
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

export interface TeacherContentGen {
  topic: string;
  gradeLevel: string;
  language: Language;
  contentType: 'lesson_plan' | 'quiz_set' | 'remedial_guide';
  generatedContent: string;
}
