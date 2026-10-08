import { Skill, CareerPath, OfflinePack, AtRiskStudent, Opportunity, QuizQuestion } from '../types';

export const initialLearnerProfile = {
  id: 'learner-101',
  name: 'Aarav Patel',
  role: 'B.Tech Student (Computer Science & Automation)',
  institution: 'Gujarat Technological University (GTU)',
  location: 'Ahmedabad / Rural Anand District',
  preferredLanguage: 'en' as const,
  targetCareerId: 'career-ai-eng',
  academicGpa: 8.4,
  completedModules: 14,
  streakDays: 12,
  offlineSyncStatus: 'synced' as const,
};

export const defaultSkills: Skill[] = [
  { id: 's1', name: 'Python & Data Structures', category: 'core_tech', currentProficiency: 82, requiredProficiency: 90, evidenceCount: 4, certifications: ['NPTEL Data Structures'] },
  { id: 's2', name: 'Machine Learning & Scikit-Learn', category: 'core_tech', currentProficiency: 65, requiredProficiency: 85, evidenceCount: 2, certifications: ['AICTE AI Fundamentals'] },
  { id: 's3', name: 'System Architecture & REST APIs', category: 'core_tech', currentProficiency: 78, requiredProficiency: 80, evidenceCount: 3 },
  { id: 's4', name: 'Deep Learning & Neural Networks', category: 'core_tech', currentProficiency: 42, requiredProficiency: 80, evidenceCount: 1 },
  { id: 's5', name: 'Prompt Engineering & RAG', category: 'core_tech', currentProficiency: 55, requiredProficiency: 85, evidenceCount: 2 },
  { id: 's6', name: 'Database & SQL / pgvector', category: 'core_tech', currentProficiency: 70, requiredProficiency: 75, evidenceCount: 3 },
  { id: 's7', name: 'Solar PV Systems & Grid Maintenance', category: 'practical_vocational', currentProficiency: 30, requiredProficiency: 85, evidenceCount: 0 },
  { id: 's8', name: 'EV Battery Management Systems', category: 'practical_vocational', currentProficiency: 25, requiredProficiency: 80, evidenceCount: 0 },
  { id: 's9', name: 'Digital Agriculture IoT Sensors', category: 'domain_knowledge', currentProficiency: 40, requiredProficiency: 75, evidenceCount: 1 },
  { id: 's10', name: 'Technical Problem Solving & Communication', category: 'soft_skills', currentProficiency: 85, requiredProficiency: 85, evidenceCount: 5 }
];

export const careerPathways: CareerPath[] = [
  {
    id: 'career-ai-eng',
    title: 'AI Systems & Full-Stack Engineer',
    category: 'Software & AI',
    description: 'Design end-to-end AI applications, neural search, FastAPI microservices, and modern dynamic frontends.',
    description_hi: 'एंड-टू-एंड एआई एप्लिकेशन, न्यूरल सर्च और फास्टएपीआई माइक्रोसर्विस का निर्माण करें।',
    description_gu: 'એન્ડ-ટુ-એન્ડ AI એપ્લિકેશન્સ, ન્યુરલ સર્ચ અને FastAPI સર્વિસીસ ડિઝાઈન કરો.',
    demandIndex: 'Critical',
    avgSalary: '₹8.5L - ₹18L / annum',
    requiredSkills: [
      { skillId: 's1', skillName: 'Python & Data Structures', minScore: 85, weight: 0.25 },
      { skillId: 's2', skillName: 'Machine Learning & Scikit-Learn', minScore: 80, weight: 0.25 },
      { skillId: 's4', skillName: 'Deep Learning & Neural Networks', minScore: 75, weight: 0.20 },
      { skillId: 's5', skillName: 'Prompt Engineering & RAG', minScore: 80, weight: 0.15 },
      { skillId: 's6', skillName: 'Database & SQL / pgvector', minScore: 75, weight: 0.15 }
    ]
  },
  {
    id: 'career-solar-tech',
    title: 'Solar PV & Clean Energy Systems Specialist',
    category: 'Green Tech & Vocational',
    description: 'Install, troubleshoot, and maintain grid-tied rooftop solar systems and smart inverter networks.',
    description_hi: 'सोलर पीवी और क्लीन एनर्जी इंफ्रास्ट्रक्चर की स्थापना और रखरखाव करें।',
    description_gu: 'સોલર PV અને ક્લીન એનર્જી સિસ્ટમ્સનું ઇન્સ્ટોલેશન અને મેન્ટેનન્સ કરો.',
    demandIndex: 'High',
    avgSalary: '₹4.5L - ₹9L / annum',
    requiredSkills: [
      { skillId: 's7', skillName: 'Solar PV Systems & Grid Maintenance', minScore: 85, weight: 0.50 },
      { skillId: 's3', skillName: 'System Architecture & REST APIs', minScore: 60, weight: 0.20 },
      { skillId: 's10', skillName: 'Technical Problem Solving & Communication', minScore: 75, weight: 0.30 }
    ]
  },
  {
    id: 'career-ev-eng',
    title: 'EV Mobility & Powertrain Diagnostics Engineer',
    category: 'Automotive & Electronics',
    description: 'Analyze electric vehicle battery health (BMS), motor controllers, and automated diagnostic systems.',
    description_hi: 'इलेक्ट्रिक वाहन बैटरी स्वास्थ्य और ऑटोमेटेड डायग्नोस्टिक सिस्टम का विश्लेषण करें।',
    description_gu: 'ઈલેક્ટ્રિક વ્હીકલ બેટરી હેલ્થ અને ડાયગ્નોસ્ટિક સિસ્ટમ્સનું એનાલિસિસ કરો.',
    demandIndex: 'Very High',
    avgSalary: '₹6L - ₹14L / annum',
    requiredSkills: [
      { skillId: 's8', skillName: 'EV Battery Management Systems', minScore: 80, weight: 0.45 },
      { skillId: 's1', skillName: 'Python & Data Structures', minScore: 70, weight: 0.25 },
      { skillId: 's6', skillName: 'Database & SQL / pgvector', minScore: 65, weight: 0.30 }
    ]
  },
  {
    id: 'career-agri-tech',
    title: 'Smart Agriculture & IoT Automation Lead',
    category: 'Agritech & Rural Tech',
    description: 'Deploy IoT moisture sensors, drone crop health analyzers, and automated irrigation telemetry.',
    description_hi: 'स्मार्ट कृषि के लिए IoT सेंसर और स्वचालित सिंचाई तकनीक लागू करें।',
    description_gu: 'સ્માર્ટ ખેતી માટે IoT સેન્સર્સ અને ઓટોમેટેડ સિંચાઈ ટેકનોલોજી સ્થાપિત કરો.',
    demandIndex: 'High',
    avgSalary: '₹5L - ₹11L / annum',
    requiredSkills: [
      { skillId: 's9', skillName: 'Digital Agriculture IoT Sensors', minScore: 80, weight: 0.40 },
      { skillId: 's1', skillName: 'Python & Data Structures', minScore: 70, weight: 0.30 },
      { skillId: 's2', skillName: 'Machine Learning & Scikit-Learn', minScore: 65, weight: 0.30 }
    ]
  }
];

export const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Neural Networks & Activation Functions',
    difficulty: 'medium',
    question: 'Why is the ReLU (Rectified Linear Unit) activation function widely preferred over Sigmoid in deep neural networks?',
    question_hi: 'डीप न्यूरल नेटवर्क में सिग्मॉइड की तुलना में ReLU एक्टिवेशन फ़ंक्शन को क्यों प्राथमिकता दी जाती है?',
    question_gu: 'ડીપ ન્યુરલ નેટવર્ક્સમાં સિગ્મોઈડ કરતા ReLU એક્ટિવેશન ફંક્શન શા માટે વધુ પસંદ કરવામાં આવે છે?',
    options: [
      'It restricts output values strictly between 0 and 1',
      'It mitigates the vanishing gradient problem and computes faster',
      'It prevents over-fitting automatically without dropout layers',
      'It works only on binary classification problems'
    ],
    options_hi: [
      'यह आउटपुट मानों को 0 और 1 के बीच सीमित करता है',
      'यह वैनिशिंग ग्रेडिएंट समस्या को कम करता है और तेज़ी से गणना करता है',
      'यह ड्रॉपआउट परतों के बिना ओवर-फिटिंग को रोकता है',
      'यह केवल बाइनरी वर्गीकरण में काम करता है'
    ],
    options_gu: [
      'તે આઉટપુટ વેલ્યુઝને 0 અને 1 ની વચ્ચે સીમિત કરે છે',
      'તે વેનિશિંગ ગ્રેડિયન્ટ પ્રોબ્લેમ ઘટાડે છે અને ઝડપથી ગણતરી કરે છે',
      'તે ડ્રોપઆઉટ લેયર્સ વગર ઓવર-ફિટિંગ અટકાવે છે',
      'તે માત્ર બાઈનરી ક્લાસિફિકેશનમાં કામ કરે છે'
    ],
    correctAnswer: 1,
    explanation: 'ReLU (f(x) = max(0, x)) preserves non-zero gradients for positive inputs, avoiding the gradient saturation experienced by Sigmoid at extreme values.',
    explanation_hi: 'ReLU धनात्मक इनपुट के लिए गैर-शून्य ग्रेडिएंट बनाए रखता है, जिससे सिग्मॉइड जैसी ग्रेडिएंट संतृप्ति समस्या से बचा जा सकता है।',
    explanation_gu: 'ReLU ધનાત્મક ઇનપુટ્સ માટે ગ્રેડિયન્ટ જાળવી રાખે છે, જેથી સિગ્મોઇડ જેવી સેચ્યુરેશન સમસ્યા ટળે છે.'
  },
  {
    id: 'q2',
    topic: 'Vector Databases & RAG',
    difficulty: 'hard',
    question: 'In a Retrieval-Augmented Generation (RAG) system, what is the primary role of Cosine Similarity during pgvector queries?',
    question_hi: 'RAG सिस्टम में, pgvector प्रश्नों के दौरान कोसाइन समानता की मुख्य भूमिका क्या है?',
    question_gu: 'RAG સિસ્ટમમાં, pgvector ક્વેરીઝ દરમિયાન કોસાઈન સમાનતા (Cosine Similarity) નો મુખ્ય ભાગ શો છે?',
    options: [
      'To measure word count frequency in documents',
      'To calculate semantic similarity between question embeddings and document chunk embeddings',
      'To compress vector dimensions from 1536 to 256',
      'To encrypt private learner profiles before sending to the LLM'
    ],
    options_hi: [
      'दस्तावेज़ों में शब्दों की संख्या मापने के लिए',
      'प्रश्न और दस्तावेज़ एम्बेडिंग के बीच अर्थपूर्ण (सेमंटिक्स) समानता की गणना करने के लिए',
      'वेक्टर आयामों को कंप्रेस करने के लिए',
      'प्राइवेट डेटा को एन्क्रिप्ट करने के लिए'
    ],
    options_gu: [
      'દસ્તાવેજોમાં શબ્દ સંખ્યા માપવા માટે',
      'પ્રશ્ન અને ડોક્યુમેન્ટ ચંક વચ્ચે અર્થપૂર્ણ (Semantic) સમાનતા ગણવા માટે',
      'વેક્ટર પરિમાણોને નાનાં કરવા માટે',
      'ડેટાને એનક્રિપ્ટ કરવા માટે'
    ],
    correctAnswer: 1,
    explanation: 'Cosine similarity measures the angle between directional vectors in high-dimensional embedding space to retrieve the most semantically relevant text context.',
    explanation_hi: 'कोसाइन समानता सबसे प्रासंगिक टेक्स्ट संदर्भ प्राप्त करने के लिए वेक्टर दिशाओं के बीच के कोण को मापती है।',
    explanation_gu: 'કોસાઈન સમાનતા સૌથી સંબંધિત માહિતી શોધવા માટે હાઈ-ડાયમેન્શનલ સ્પેસમાં એંગલ માપે છે.'
  }
];

export const sampleOfflinePacks: OfflinePack[] = [
  {
    id: 'pack-ai-basics',
    title: 'Foundations of AI & Python (Rural Low-Bandwidth Pack)',
    subject: 'Computer Science & AI',
    fileSize: '14.2 MB',
    downloaded: true,
    modulesCount: 6,
    lastSynced: '2 hours ago',
    description: 'Lightweight text summaries, line diagrams, code exercises, and offline quiz engine. No high-speed video needed.'
  },
  {
    id: 'pack-solar-install',
    title: 'Solar Rooftop & Inverter Troubleshooting (Practical Guide)',
    subject: 'Vocational Green Energy',
    fileSize: '8.7 MB',
    downloaded: false,
    modulesCount: 4,
    description: 'Step-by-step schematics, safety protocols, and multimeter testing guides optimized for offline tablet use.'
  },
  {
    id: 'pack-ev-bms',
    title: 'EV Battery Diagnostic & Safety Protocols',
    subject: 'Vocational Engineering',
    fileSize: '11.5 MB',
    downloaded: false,
    modulesCount: 5,
    description: 'Battery management cell balancing charts, diagnostic fault codes (DTC), and offline troubleshooting tree.'
  }
];

export const mockAtRiskStudents: AtRiskStudent[] = [
  {
    id: 'stu-204',
    name: 'Priya Sharma',
    email: 'priya.s@gtu.ac.in',
    course: 'B.Tech CS - Sem 6',
    riskLevel: 'high',
    riskScore: 84,
    strugglingTopics: ['Deep Learning', 'Neural Network Backpropagation', 'Gradient Saturation'],
    inactivityDays: 9,
    lastQuizScore: 35,
    recommendedIntervention: 'Assign Teacher Remedial Worksheet & Peer Mentoring with Aarav Patel'
  },
  {
    id: 'stu-309',
    name: 'Karan Verma',
    email: 'karan.v@polytechnic.org',
    course: 'Diploma Solar Electrical Tech',
    riskLevel: 'medium',
    riskScore: 62,
    strugglingTopics: ['Grid Tie Protection Relay Setting', 'Inverter Phase Matching'],
    inactivityDays: 4,
    lastQuizScore: 58,
    recommendedIntervention: 'Send Gujarati Practical Visual Guide & Low-bandwidth Audio Note'
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'AI & Data Engineering Intern (SIH26044 Partner)',
    company: 'TechCorp AI Innovations (Gujarat Tech Hub)',
    location: 'GIFT City, Gandhinagar (Hybrid)',
    stipendOrSalary: '₹25,000 / month',
    type: 'internship',
    minGpa: 7.5,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 80 },
      { skillName: 'Machine Learning & Scikit-Learn', level: 75 },
      { skillName: 'Database & SQL / pgvector', level: 70 }
    ]
  },
  {
    id: 'opp-2',
    title: 'Solar & Renewable Systems Apprentice',
    company: 'SunPower Clean Energy Infrastructure',
    location: 'Ahmedabad / Vadodara',
    stipendOrSalary: '₹20,000 / month',
    type: 'vocational_apprenticeship',
    minGpa: 6.5,
    requiredSkills: [
      { skillName: 'Solar PV Systems & Grid Maintenance', level: 80 },
      { skillName: 'Technical Problem Solving & Communication', level: 70 }
    ]
  },
  {
    id: 'opp-3',
    title: 'Junior Full-Stack AI Engineer',
    company: 'Cognitive Cloud Solutions',
    location: 'Remote / Bengaluru',
    stipendOrSalary: '₹9.5 Lakhs / annum',
    type: 'fulltime',
    minGpa: 8.0,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 85 },
      { skillName: 'Deep Learning & Neural Networks', level: 75 },
      { skillName: 'Prompt Engineering & RAG', level: 80 }
    ]
  }
];
