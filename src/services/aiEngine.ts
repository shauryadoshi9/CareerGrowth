import { Skill, CareerPath, SkillGapAnalysis, Opportunity, RoadmapStep, Language } from '../types';

export function calculateSkillGap(learnerSkills: Skill[], targetCareer: CareerPath): SkillGapAnalysis {
  let weightedScoreSum = 0;
  let totalWeight = 0;
  let matchedCount = 0;

  const criticalMissing: { name: string; gapScore: number; priority: 'high' | 'medium' | 'low' }[] = [];
  const aligned: { name: string; score: number }[] = [];

  targetCareer.requiredSkills.forEach(req => {
    const learnerSkill = learnerSkills.find(s => s.id === req.skillId || s.name.toLowerCase() === req.skillName.toLowerCase());
    const currentScore = learnerSkill ? learnerSkill.currentProficiency : 0;
    
    totalWeight += req.weight;
    const effectiveScore = Math.min(currentScore, req.minScore);
    weightedScoreSum += (effectiveScore / req.minScore) * req.weight;

    if (currentScore >= req.minScore) {
      matchedCount++;
      aligned.push({ name: req.skillName, score: currentScore });
    } else {
      const gap = req.minScore - currentScore;
      const priority = gap > 30 ? 'high' : gap > 15 ? 'medium' : 'low';
      criticalMissing.push({ name: req.skillName, gapScore: gap, priority });
    }
  });

  const readinessScore = Math.round((weightedScoreSum / (totalWeight || 1)) * 100);

  return {
    careerId: targetCareer.id,
    careerTitle: targetCareer.title,
    readinessScore,
    totalRequiredSkills: targetCareer.requiredSkills.length,
    matchedSkillsCount: matchedCount,
    criticalMissingSkills: criticalMissing.sort((a, b) => b.gapScore - a.gapScore),
    alignedSkills: aligned
  };
}

export function calculateJobMatch(learnerSkills: Skill[], learnerGpa: number, opportunity: Opportunity): Opportunity {
  // 1. Hard Eligibility Check
  const eligibilityMet = learnerGpa >= opportunity.minGpa;

  // 2. Weighted Skill Compatibility
  let matchedWeight = 0;
  let totalWeight = 0;
  const alignedSkills: string[] = [];
  const missingSkills: string[] = [];

  opportunity.requiredSkills.forEach(req => {
    const learnerSkill = learnerSkills.find(s => s.name.toLowerCase().includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(s.name.toLowerCase()));
    totalWeight += 1;
    const currentScore = learnerSkill ? learnerSkill.currentProficiency : 0;
    
    if (currentScore >= req.level) {
      matchedWeight += 1;
      alignedSkills.push(`${req.skillName} (${currentScore}% vs ${req.level}% required)`);
    } else {
      const partial = Math.max(0, currentScore / req.level);
      matchedWeight += partial;
      missingSkills.push(`${req.skillName} (Current: ${currentScore}%, Target: ${req.level}%)`);
    }
  });

  // 3. Match Score calculation
  const skillRatio = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
  const finalMatchScore = eligibilityMet ? Math.round(skillRatio) : Math.round(skillRatio * 0.5);

  return {
    ...opportunity,
    eligibilityMet,
    matchScore: finalMatchScore,
    alignedSkills,
    missingSkills
  };
}

export function generateAdaptiveRoadmap(learnerSkills: Skill[], targetCareer: CareerPath): RoadmapStep[] {
  const gapAnalysis = calculateSkillGap(learnerSkills, targetCareer);

  return [
    {
      id: 'step-1',
      month: 1,
      title: 'Phase 1: Core Foundation & High-Priority Gap Remediation',
      description: `Targeting top critical missing skills: ${gapAnalysis.criticalMissingSkills.slice(0, 2).map(s => s.name).join(', ') || 'Core Fundamentals'}.`,
      skillsCovered: gapAnalysis.criticalMissingSkills.slice(0, 2).map(s => s.name),
      status: 'in_progress',
      estimatedHours: 35,
      topics: [
        { id: 't1', title: 'Conceptual Fundamentals & Multilingual Audio Guide', type: 'concept', completed: true },
        { id: 't2', title: 'Interactive Practical Code Sandbox / Tool Setup', type: 'practical', completed: true },
        { id: 't3', title: 'Diagnostic Assessment Quiz (Adaptive Difficulty)', type: 'assessment', completed: false }
      ]
    },
    {
      id: 'step-2',
      month: 2,
      title: 'Phase 2: Advanced Mastery & Practical Evidence Building',
      description: 'Building verifiable project evidence and practicing domain-specific RAG/vector database applications.',
      skillsCovered: ['Deep Learning & Neural Networks', 'Prompt Engineering & RAG'],
      status: 'locked',
      estimatedHours: 45,
      topics: [
        { id: 't4', title: 'Building a RAG Pipeline with pgvector & FastAPI', type: 'practical', completed: false },
        { id: 't5', title: 'Neural Network Hyperparameter Tuning Lab', type: 'concept', completed: false },
        { id: 't6', title: 'Capstone Assessment & Peer Review', type: 'assessment', completed: false }
      ]
    },
    {
      id: 'step-3',
      month: 3,
      title: 'Phase 3: Career Readiness & Placement Match Fast-Track',
      description: 'Final opportunity readiness validation, mock interview simulation, and candidate profile verification.',
      skillsCovered: ['System Architecture & REST APIs', 'Technical Problem Solving'],
      status: 'locked',
      estimatedHours: 25,
      topics: [
        { id: 't7', title: 'End-to-End System Integration Project', type: 'practical', completed: false },
        { id: 't8', title: 'Placement Match Verification & Evidence Upload', type: 'assessment', completed: false }
      ]
    }
  ];
}

export function generateTeacherCopilotContent(topic: string, gradeLevel: string, lang: Language, contentType: 'lesson_plan' | 'quiz_set' | 'remedial_guide'): string {
  const langTitle = lang === 'gu' ? 'ગુજરાતી' : lang === 'hi' ? 'हिंदी' : 'English';
  
  if (contentType === 'lesson_plan') {
    return `📋 AI GENERATED LESSON PLAN (${langTitle})
Topic: ${topic}
Target Cohort: ${gradeLevel}

1. LEARNING OBJECTIVES:
   • Understand core principles of ${topic} through interactive real-world examples.
   • Master key diagnostic metrics and practical implementation steps.
   • Identify common pitfalls and remediation strategies.

2. TIMELINE & STRUCTURE (60 Mins):
   • 00-15m: Conceptual Hook & Multilingual Explanation.
   • 15-35m: Practical Hands-on Demonstration / Code Sandbox.
   • 35-50m: Group Problem Solving & Diagnostic Quiz.
   • 50-60m: Summary, At-Risk Student Intervention & Take-home Pack.

3. TEACHER NOTES & REMEDIAL ADVICE:
   • Focus extra attention on students struggling with mathematical formulations.
   • Use low-bandwidth visual diagrams for rural cohort modules.`;
  } else if (contentType === 'quiz_set') {
    return `📝 AI GENERATED DIAGNOSTIC QUIZ (${langTitle})
Topic: ${topic}
Total Items: 3 Questions | Answer Keys Included

Q1. What is the primary purpose of ${topic}?
    A) To simplify data architecture
    B) To optimize model execution speed
    C) To reduce memory footprint
    D) All of the above
    [Correct Answer: D | Explanation: ${topic} addresses architectural, performance, and optimization aspects.]

Q2. How do we verify correct setup for ${topic}?
    A) By running unit tests and checking accuracy curves
    B) By inspecting server memory logs
    C) Both A and B
    [Correct Answer: C]`;
  } else {
    return `💡 AI GENERATED REMEDIAL WORKSHEET (${langTitle})
Target: At-Risk Students Struggling with ${topic}

1. SIMPLIFIED EXPLANATION:
   • Concept break-down into 3 easy steps with diagrams.
   • Step 1: Identify the input state.
   • Step 2: Apply transformation formula.
   • Step 3: Verify output bounds.

2. GUIDED PRACTICE PROBLEMS:
   • Problem 1: Walkthrough solution provided.
   • Problem 2: Try yourself with hint provided.

3. MENTOR CHECKLIST:
   [ ] Schedule 15-min 1-on-1 review session
   [ ] Assign Gujarati/Hindi audio summary pack`;
  }
}

export function translateText(text: string, targetLang: Language): string {
  if (targetLang === 'en') return text;
  
  const dict: Record<string, Partial<Record<Language, string>>> = {
    'Skill Gap Analyzer': { hi: 'कौशल अंतर विश्लेषक', gu: 'કૌશલ્ય તફાવત વિશ્લેષક', mr: 'कौशल्य फरक विश्लेषक' },
    'Adaptive Learning Engine': { hi: 'अनुकूली शिक्षण इंजन', gu: 'એડેપ્ટિવ લર્નિંગ એન્જિન', mr: 'अनुकूलनीय शिक्षण' },
    'AI Career Navigator': { hi: 'एआई करियर नेविगेटर', gu: 'AI કારકિર્દી નેવિગેટર', mr: 'एआय करिअर नेव्हिगेटर' },
    'Rural Low-Bandwidth Mode': { hi: 'ग्रामीण कम-बैंडविड्थ मोड', gu: 'ગ્રામીણ ઓછું-બેન્ડવિડ્થ મોડ', mr: 'ग्रामीण कमी-बैंडविड्थ मोड' },
    'Teacher Copilot': { hi: 'शिक्षक कोपायलट', gu: 'શિક્ષક કો-પાયલોટ', mr: 'शिक्षक कोपायलट' },
    'Learning Risk Engine': { hi: 'शिक्षण जोखिम और हस्तक्षेप इंजन', gu: 'લર્નિંગ રિસ્ક અને ઈન્ટરવેન્શન એન્જિન', mr: 'शिक्षण जोखीम आणि हस्तक्षेप' },
    'Opportunity Placement Matching': { hi: 'इंटरनशिप और जॉब मैचिंग', gu: 'ઈન્ટર્નશીપ અને જોબ મેચિંગ', mr: 'नोकरी आणि इंटर्नशिप मॅच' },
    'From Learning to Livelihood': { hi: 'शिक्षा से आजीविका तक', gu: 'શિક્ષણથી આજીવિકા સુધી', mr: 'शिक्षणापासून उपजीविकेपर्यन्त' }
  };

  const match = dict[text];
  if (match && match[targetLang]) {
    return match[targetLang]!;
  }
  return text;
}
