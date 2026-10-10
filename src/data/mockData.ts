import { Skill, CareerPath, OfflinePack, AtRiskStudent, Opportunity, QuizQuestion, Mentor, ProjectPortfolioItem } from '../types';

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
  { 
    id: 's1', 
    name: 'Python & Data Structures', 
    category: 'core_tech', 
    currentProficiency: 82, 
    requiredProficiency: 90, 
    evidenceCount: 4, 
    certifications: ['NPTEL Data Structures'], 
    completedProjects: ['Algorithm Visualizer', 'CLI Data Processing Pipeline'],
    quizScore: 88,
    portfolioLinks: ['https://github.com/aarav-patel/python-ds-algo']
  },
  { 
    id: 's2', 
    name: 'Machine Learning & Scikit-Learn', 
    category: 'core_tech', 
    currentProficiency: 65, 
    requiredProficiency: 85, 
    evidenceCount: 2, 
    certifications: ['AICTE AI Fundamentals'],
    completedProjects: ['Crop Yield Prediction Random Forest'],
    quizScore: 72,
    portfolioLinks: ['https://github.com/aarav-patel/crop-yield-predictor']
  },
  { 
    id: 's3', 
    name: 'System Architecture & REST APIs', 
    category: 'core_tech', 
    currentProficiency: 78, 
    requiredProficiency: 80, 
    evidenceCount: 3,
    completedProjects: ['FastAPI Microservices Authentication Gateway'],
    quizScore: 80,
    portfolioLinks: ['https://github.com/aarav-patel/fastapi-gateway']
  },
  { 
    id: 's4', 
    name: 'Deep Learning & Neural Networks', 
    category: 'core_tech', 
    currentProficiency: 42, 
    requiredProficiency: 80, 
    evidenceCount: 1,
    quizScore: 48
  },
  { 
    id: 's5', 
    name: 'Prompt Engineering & RAG', 
    category: 'core_tech', 
    currentProficiency: 55, 
    requiredProficiency: 85, 
    evidenceCount: 2,
    completedProjects: ['Personal Document Q&A Bot with FastAPI & pgvector'],
    quizScore: 60,
    portfolioLinks: ['https://github.com/aarav-patel/rag-doc-chat']
  },
  { 
    id: 's6', 
    name: 'Database & SQL / pgvector', 
    category: 'core_tech', 
    currentProficiency: 70, 
    requiredProficiency: 75, 
    evidenceCount: 3,
    quizScore: 75
  },
  { 
    id: 's7', 
    name: 'Solar PV Systems & Grid Maintenance', 
    category: 'practical_vocational', 
    currentProficiency: 30, 
    requiredProficiency: 85, 
    evidenceCount: 0,
    quizScore: 35
  },
  { 
    id: 's8', 
    name: 'EV Battery Management Systems', 
    category: 'practical_vocational', 
    currentProficiency: 25, 
    requiredProficiency: 80, 
    evidenceCount: 0,
    quizScore: 30
  },
  { 
    id: 's9', 
    name: 'Digital Agriculture IoT Sensors', 
    category: 'domain_knowledge', 
    currentProficiency: 40, 
    requiredProficiency: 75, 
    evidenceCount: 1,
    completedProjects: ['ESP32 Soil Telemetry Testbench'],
    quizScore: 45
  },
  { 
    id: 's10', 
    name: 'Technical Problem Solving & Communication', 
    category: 'soft_skills', 
    currentProficiency: 85, 
    requiredProficiency: 85, 
    evidenceCount: 5,
    certifications: ['British Council Communication Skills'],
    quizScore: 90
  }
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
  // 1. PM Internship Scheme (Govt. of India - MCA)
  {
    id: 'opp-pm-1',
    title: 'Prime Minister Internship Scheme in Top 500 Companies (MCA)',
    company: 'Ministry of Corporate Affairs (Govt. of India)',
    location: 'Pan-India (Top 500 Corporates - Tata, Reliance, L&T, HDFC)',
    stipendOrSalary: '₹5,000 / month + ₹6,000 One-time Grant',
    prizeOrStipend: '₹5,000 / mo + ₹6,000 Allowance',
    type: 'internship',
    category: 'internship',
    sourcePlatform: 'PM Internship Scheme',
    sourceUrl: 'https://pminternship.mca.gov.in/',
    deadline: 'Phase 2 Live - 1.25 Lakh Slots',
    registeredCount: '1,20,000+ Enrolled',
    urgencyBadge: '⚡ Govt Flagship',
    verifiedHost: true,
    tags: ['Govt of India Verified', '12-Month Internship', 'Direct Benefit Transfer', 'Top 500 Companies', 'No Application Fee'],
    bannerGradient: 'from-amber-500 via-orange-600 to-red-600',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 65 },
      { skillName: 'Technical Problem Solving & Communication', level: 70 }
    ]
  },

  // 2. Unstop - Flipkart GRiD 6.0
  {
    id: 'opp-unstop-grid',
    title: 'Flipkart GRiD 6.0 - Software Development & AI Track',
    company: 'Flipkart Careers (Unstop Exclusive)',
    location: 'Bengaluru (National Virtual Prelims)',
    stipendOrSalary: '₹5,25,000 Cash Pool + SDE Internship PPIs (₹1.5L/mo)',
    prizeOrStipend: '₹5,25,000 + SDE PPIs',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Unstop',
    sourceUrl: 'https://unstop.com/hackathons/flipkart-grid-60-flipkart-1000000',
    deadline: 'Live on Unstop Portal',
    registeredCount: '48,500+ Engineers',
    urgencyBadge: '🔥 High PPI Conversion',
    verifiedHost: true,
    tags: ['Unstop Verified', 'Hiring Challenge', 'SDE Pre-Placement Interviews', 'Engineering & MCA'],
    bannerGradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    minGpa: 7.0,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 80 },
      { skillName: 'Prompt Engineering & RAG', level: 75 }
    ]
  },

  // 3. Devfolio - ETHIndia 2026
  {
    id: 'opp-devfolio-ethindia',
    title: 'ETHIndia 2026 - Global Web3 & Decentralized AI Hackathon',
    company: 'Devfolio Ecosystem & Global Protocol Foundations',
    location: 'Bengaluru (In-person) & Virtual Track',
    stipendOrSalary: '$100,000+ (₹83,00,000+) Global Prize Pool',
    prizeOrStipend: '₹83,00,000+ ($100k) Pool',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Devfolio',
    sourceUrl: 'https://ethindia.devfolio.co/',
    deadline: 'Applications Closing in 5 Days',
    registeredCount: '15,400+ Hackers',
    urgencyBadge: '⚡ Closing Soon',
    verifiedHost: true,
    tags: ['Devfolio Flagship', 'Web3 & AI', 'Global VCs & Grants', 'Travel Grants Available'],
    bannerGradient: 'from-blue-600 via-indigo-700 to-purple-800',
    minGpa: 6.5,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 75 },
      { skillName: 'Machine Learning & Scikit-Learn', level: 70 },
      { skillName: 'Database & SQL / pgvector', level: 65 }
    ]
  },

  // 4. Unstop - Tata Crucible Campus Quiz 2026
  {
    id: 'opp-unstop-tata-quiz',
    title: 'Tata Crucible Campus Business & Technology Quiz 2026',
    company: 'Tata Sons & Tata Group (Unstop Partnered)',
    location: 'Online Zonal Prelims & National Finals',
    stipendOrSalary: '₹2,50,000 Grand Cash Prize + National Trophy',
    prizeOrStipend: '₹2,50,000 Cash Prize',
    type: 'quiz',
    category: 'quiz',
    sourcePlatform: 'Unstop',
    sourceUrl: 'https://unstop.com/competitions/tata-crucible-campus-quiz-2026',
    deadline: 'Registrations Open',
    registeredCount: '22,000+ Students',
    urgencyBadge: '💡 National Prestige',
    verifiedHost: true,
    tags: ['Unstop Quiz', 'Tata Sons', 'General Tech & Business', 'No Eligibility Barriers'],
    bannerGradient: 'from-purple-600 via-pink-600 to-rose-600',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'Technical Problem Solving & Communication', level: 80 }
    ]
  },

  // 5. Hack2Skill - India AI Innovation Hackathon
  {
    id: 'opp-h2s-india-ai',
    title: 'India AI & Generative Intelligence Innovation Sprint',
    company: 'Hack2Skill & MeitY Partner Ecosystem',
    location: 'Virtual / Online Pan-India',
    stipendOrSalary: '₹8,00,000 Cash Prizes + NVIDIA Cloud GPU Credits',
    prizeOrStipend: '₹8,00,000 + GPU Vouchers',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Hack2Skill',
    sourceUrl: 'https://hack2skill.com/',
    deadline: 'Submissions Open Now',
    registeredCount: '8,200+ Developers',
    urgencyBadge: '🟢 Submissions Live',
    verifiedHost: true,
    tags: ['Hack2Skill Verified', 'Generative AI', 'Cloud Credits', 'Open to All Indian Colleges'],
    bannerGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 70 },
      { skillName: 'Deep Learning & Neural Networks', level: 65 }
    ]
  },

  // 6. Devfolio - HackNITR 6.0
  {
    id: 'opp-devfolio-hacknitr',
    title: 'HackNITR 6.0 - Flagship National Student Hackathon',
    company: 'NIT Rourkela on Devfolio',
    location: 'Hybrid / Virtual & Campus Finals',
    stipendOrSalary: '₹5,50,000 Prize Pool + Swag & Sponsor Bounties',
    prizeOrStipend: '₹5,50,000 Cash Pool',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Devfolio',
    sourceUrl: 'https://devfolio.co/hackathons',
    deadline: 'Registrations Live',
    registeredCount: '6,400+ Hackers',
    urgencyBadge: '🎁 Free Swags',
    verifiedHost: true,
    tags: ['Devfolio Community', 'Beginner Friendly', 'Hardware & AI Tracks', 'Top Mentor Support'],
    bannerGradient: 'from-violet-600 via-fuchsia-600 to-pink-600',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 70 },
      { skillName: 'System Architecture & REST APIs', level: 65 }
    ]
  },

  // 7. Unstop - Amazon ML Challenge 2026
  {
    id: 'opp-unstop-amazon-ml',
    title: 'Amazon Machine Learning Challenge 2026',
    company: 'Amazon India (Unstop Exclusive)',
    location: 'Virtual / Online India',
    stipendOrSalary: '₹10,00,000 Cash Prizes + Applied Scientist / SDE Roles',
    prizeOrStipend: '₹10,00,000 + Amazon Roles',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Unstop',
    sourceUrl: 'https://unstop.com/hackathons/amazon-ml-challenge-2026',
    deadline: 'Closing in 7 Days',
    registeredCount: '34,000+ Participants',
    urgencyBadge: '⚡ Top Tier Hiring',
    verifiedHost: true,
    tags: ['Unstop Flagship', 'Amazon SDE & ML Roles', 'Computer Vision & NLP', 'High Impact'],
    bannerGradient: 'from-amber-600 via-orange-600 to-yellow-600',
    minGpa: 7.0,
    requiredSkills: [
      { skillName: 'Machine Learning & Scikit-Learn', level: 80 },
      { skillName: 'Deep Learning & Neural Networks', level: 75 }
    ]
  },

  // 8. Devfolio - HackByte 3.0
  {
    id: 'opp-devfolio-hackbyte',
    title: 'HackByte 3.0 - IIIT Jabalpur Annual Hackathon',
    company: 'IIITDM Jabalpur on Devfolio',
    location: 'Online Pan-India',
    stipendOrSalary: '₹4,00,000 Cash Pool + Cloud Vouchers',
    prizeOrStipend: '₹4,00,000 Pool',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Devfolio',
    sourceUrl: 'https://devfolio.co/hackathons',
    deadline: 'Registrations Open',
    registeredCount: '4,100+ Participants',
    urgencyBadge: '🟢 Open Now',
    verifiedHost: true,
    tags: ['Devfolio Verified', 'Web & App', 'Open Innovation', 'Senior Mentorship'],
    bannerGradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'System Architecture & REST APIs', level: 70 },
      { skillName: 'Database & SQL / pgvector', level: 65 }
    ]
  },

  // 9. Hack2Skill - Smart Mobility & CleanTech Challenge
  {
    id: 'opp-h2s-cleantech',
    title: 'Smart Mobility, EV & Clean Energy Sprint',
    company: 'Hack2Skill & Automotive Technology Alliance',
    location: 'Virtual & Pune / Ahmedabad Sandboxes',
    stipendOrSalary: '₹4,50,000 Cash + EV Incubation Grants',
    prizeOrStipend: '₹4,50,000 + Incubation',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Hack2Skill',
    sourceUrl: 'https://hack2skill.com/',
    deadline: 'Live Innovation Sprint',
    registeredCount: '3,800+ Engineers',
    urgencyBadge: '⚡ CleanTech Track',
    verifiedHost: true,
    tags: ['Hack2Skill', 'EV Batteries', 'Solar Smart Grids', 'Hardware Prototypes'],
    bannerGradient: 'from-teal-600 via-emerald-600 to-green-700',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'EV Battery Management Systems', level: 70 },
      { skillName: 'Solar PV Systems & Grid Maintenance', level: 65 }
    ]
  },

  // 10. Unstop - L'Oréal Brandstorm 2026
  {
    id: 'opp-unstop-loreal',
    title: "L'Oréal Brandstorm 2026 - Global Tech & Sustainability Challenge",
    company: "L'Oréal Global (Unstop Exclusive)",
    location: 'Virtual National Prelims & Paris Finals',
    stipendOrSalary: 'Paris Intrapreneurship Mission + Pre-Placement Interviews',
    prizeOrStipend: 'Paris Mission + PPIs',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Unstop',
    sourceUrl: 'https://unstop.com/competitions/loreal-brandstorm-2026',
    deadline: 'Applications Live',
    registeredCount: '19,500+ Innovators',
    urgencyBadge: '✈️ Global Final in Paris',
    verifiedHost: true,
    tags: ['Unstop Global', 'Sustainability & AI', 'Direct PPIs', 'Undergrads & Postgrads'],
    bannerGradient: 'from-rose-600 via-pink-700 to-purple-800',
    minGpa: 6.5,
    requiredSkills: [
      { skillName: 'Technical Problem Solving & Communication', level: 75 }
    ]
  },

  // 11. Devfolio - InOut 11.0
  {
    id: 'opp-devfolio-inout',
    title: "InOut 11.0 - India's Oldest Community Hackathon",
    company: 'Devfolio & Hacker Community Foundation',
    location: 'Bengaluru & Virtual Track',
    stipendOrSalary: '₹12,00,000+ Prize Bounty & Partner Tracks',
    prizeOrStipend: '₹12,00,000+ Bounty',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Devfolio',
    sourceUrl: 'https://devfolio.co/hackathons',
    deadline: 'Phase 1 Applications',
    registeredCount: '7,800+ Hackers',
    urgencyBadge: '🔥 Community Classic',
    verifiedHost: true,
    tags: ['Devfolio Exclusive', 'Top Mentors', 'Fast-Track VC Bounties'],
    bannerGradient: 'from-purple-700 via-indigo-700 to-blue-800',
    minGpa: 6.5,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 75 },
      { skillName: 'System Architecture & REST APIs', level: 75 }
    ]
  },

  // 12. Unstop - Reliance TUP 9.0
  {
    id: 'opp-unstop-reliance-tup',
    title: 'Reliance The Ultimate Pitch (TUP) 9.0',
    company: 'Reliance Industries (Unstop Exclusive)',
    location: 'Online Prelims & Mumbai Corporate Finals',
    stipendOrSalary: '₹6,00,000 Cash Prizes + Seed Incubation Support',
    prizeOrStipend: '₹6,00,000 Cash + Seed',
    type: 'quiz',
    category: 'quiz',
    sourcePlatform: 'Unstop',
    sourceUrl: 'https://unstop.com/competitions/reliance-tup-9',
    deadline: 'Submissions Open',
    registeredCount: '16,200+ Pitches',
    urgencyBadge: '💼 Reliance Leadership',
    verifiedHost: true,
    tags: ['Unstop Verified', 'Startup Pitch', 'Direct CXO Mentorship', 'All College Students'],
    bannerGradient: 'from-red-600 via-orange-600 to-amber-600',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'Technical Problem Solving & Communication', level: 75 }
    ]
  },

  // 13. Hack2Skill - AgriTech & Rural IoT Sprint
  {
    id: 'opp-h2s-agritech',
    title: 'AgriTech, Smart Drone & Rural IoT Innovation Sprint',
    company: 'Hack2Skill & National Rural Digital Mission',
    location: 'Virtual / Online India',
    stipendOrSalary: '₹3,00,000 Cash + Rural Pilot Deployment Funding',
    prizeOrStipend: '₹3,00,000 + Pilot Grants',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Hack2Skill',
    sourceUrl: 'https://hack2skill.com/',
    deadline: 'Live Challenge',
    registeredCount: '2,900+ Teams',
    urgencyBadge: '🌾 Rural Impact',
    verifiedHost: true,
    tags: ['Hack2Skill', 'IoT Sensors', 'Drone Tech', 'Rural Development'],
    bannerGradient: 'from-green-600 via-emerald-600 to-teal-700',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'Technical Problem Solving & Communication', level: 70 }
    ]
  },

  // 14. AICTE - Smart Grid Apprenticeship
  {
    id: 'opp-aicte-grid',
    title: 'AICTE National Renewable & Smart Grid Apprenticeship',
    company: 'AICTE & Ministry of Education Portal',
    location: 'Ahmedabad / GIFT City Hub & Pan-India',
    stipendOrSalary: '₹22,000 / month Stipend + NATS Certification',
    prizeOrStipend: '₹22,000 / month',
    type: 'vocational_apprenticeship',
    category: 'internship',
    sourcePlatform: 'AICTE Portal',
    sourceUrl: 'https://internship.aicte-india.org/',
    deadline: 'Rolling Next Batch 2026',
    registeredCount: '5,000+ Apprentices',
    urgencyBadge: '📜 NCrF Credit Backed',
    verifiedHost: true,
    tags: ['AICTE Verified', 'NATS Accredited', 'NCrF Credits', 'Stipendiary', 'Government Portal'],
    bannerGradient: 'from-teal-600 via-emerald-700 to-green-800',
    minGpa: 6.5,
    requiredSkills: [
      { skillName: 'Solar PV Systems & Grid Maintenance', level: 75 },
      { skillName: 'Technical Problem Solving & Communication', level: 70 }
    ]
  },

  // 15. Google - Google Summer of Code (GSoC) 2026
  {
    id: 'opp-google-gsoc',
    title: 'Google Summer of Code (GSoC) Open Source Fellowship',
    company: 'Google Open Source Programs & 150+ Global Foundations',
    location: '100% Remote / Work from Anywhere',
    stipendOrSalary: '₹1,80,000 - ₹3,20,000 Stipend (USD Equivalent)',
    prizeOrStipend: 'Up to ₹3,20,000',
    type: 'internship',
    category: 'scholarship',
    sourcePlatform: 'Google Open Source',
    sourceUrl: 'https://summerofcode.withgoogle.com/',
    deadline: 'Annual Window Live',
    registeredCount: '12,000+ Contributors',
    urgencyBadge: '⭐ Global Prestige',
    verifiedHost: true,
    tags: ['Google Verified', 'Global Open Source', '1-on-1 Mentorship', 'High Resume Value'],
    bannerGradient: 'from-amber-600 via-red-600 to-purple-700',
    minGpa: 7.5,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 85 },
      { skillName: 'Database & SQL / pgvector', level: 75 }
    ]
  },

  // 16. Unstop - Optum Stratethon Season 5
  {
    id: 'opp-unstop-optum',
    title: 'Optum Stratethon Season 5 - HealthTech & AI Challenge',
    company: 'Optum & UnitedHealth Group (Unstop Exclusive)',
    location: 'Virtual National Prelims',
    stipendOrSalary: '₹15,00,000 Cash Pool + Fast-Track Software Interviews',
    prizeOrStipend: '₹15,00,000 + Optum Roles',
    type: 'hackathon',
    category: 'hackathon',
    sourcePlatform: 'Unstop',
    sourceUrl: 'https://unstop.com/hackathons/optum-stratethon-season-5',
    deadline: 'Registrations Open',
    registeredCount: '28,000+ Students',
    urgencyBadge: '🏥 HealthTech SDE',
    verifiedHost: true,
    tags: ['Unstop Flagship', 'HealthTech', '₹15 Lakh Cash', 'Fast-Track Placement'],
    bannerGradient: 'from-cyan-700 via-blue-700 to-indigo-800',
    minGpa: 7.0,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 75 },
      { skillName: 'System Architecture & REST APIs', level: 75 }
    ]
  },

  // 17. National Scholarship Portal (NSP) - Central Sector Scheme
  {
    id: 'opp-nsp-scholarship',
    title: 'Central Sector Scholarship Scheme for College & University Students',
    company: 'Ministry of Education, Govt. of India (NSP Portal)',
    location: 'Pan-India (Direct Benefit Transfer DBT)',
    stipendOrSalary: '₹12,000 to ₹20,000 / year Financial Grant',
    prizeOrStipend: '₹20,000/yr Grant',
    type: 'scholarship',
    category: 'scholarship',
    sourcePlatform: 'NSP & Govt Portal',
    sourceUrl: 'https://scholarships.gov.in/',
    deadline: 'Applications Open for 2026 Academic Year',
    registeredCount: '82,000+ Applied',
    urgencyBadge: '🏛️ Direct Benefit Transfer',
    verifiedHost: true,
    tags: ['Govt Scholarship', 'DBT Transfer', 'NSP Portal', 'College Students', 'Merit Financial Aid'],
    bannerGradient: 'from-amber-600 via-orange-600 to-red-700',
    minGpa: 7.5,
    requiredSkills: [
      { skillName: 'Technical Problem Solving & Communication', level: 75 }
    ]
  },

  // 18. Reliance Foundation Undergraduate Scholarships 2026
  {
    id: 'opp-reliance-scholarship',
    title: 'Reliance Foundation Undergraduate Merit-cum-Means Scholarship 2026',
    company: 'Reliance Foundation (Partnered with Premier Institutions)',
    location: 'Pan-India (All Recognized Degree Colleges)',
    stipendOrSalary: 'Up to ₹2,00,000 Financial Grant for Degree Duration',
    prizeOrStipend: '₹2,00,000 Grant',
    type: 'scholarship',
    category: 'scholarship',
    sourcePlatform: 'Industry Partner',
    sourceUrl: 'https://www.scholarships.reliancefoundation.org/',
    deadline: 'Applications Closing Soon',
    registeredCount: '45,000+ Applicants',
    urgencyBadge: '💰 Up to ₹2 Lakh',
    verifiedHost: true,
    tags: ['Reliance Foundation', 'Undergraduate Grant', 'Merit & Need', 'Mentorship & Network'],
    bannerGradient: 'from-blue-700 via-indigo-700 to-purple-800',
    minGpa: 7.0,
    requiredSkills: [
      { skillName: 'Technical Problem Solving & Communication', level: 70 }
    ]
  },

  // 19. Swayam NPTEL Free Certified AI & Data Science Mastery Course
  {
    id: 'opp-nptel-freecourse',
    title: 'NPTEL Swayam: Foundations of Data Science & Machine Learning',
    company: 'IIT Madras & Ministry of Education (Swayam Portal)',
    location: '100% Online / Self-Paced & Proctored Exam',
    stipendOrSalary: 'Free Courseware + Credit Transfer (NCrF/AICTE)',
    prizeOrStipend: 'Free Certified (AICTE Credits)',
    type: 'free_course',
    category: 'free_course',
    sourcePlatform: 'AICTE Portal',
    sourceUrl: 'https://swayam.gov.in/nc_details/NPTEL',
    deadline: 'Enrollment Open for Next Semester',
    registeredCount: '95,000+ Learners',
    urgencyBadge: '🎓 Academic Credits',
    verifiedHost: true,
    tags: ['NPTEL Free Course', 'IIT Faculty', 'NCrF Credits', 'AICTE Recognized'],
    bannerGradient: 'from-teal-600 via-cyan-600 to-blue-700',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 70 },
      { skillName: 'Machine Learning & Scikit-Learn', level: 65 }
    ]
  },

  // 20. Google Cloud Skills Boost Free Generative AI Training Path
  {
    id: 'opp-google-cloud-course',
    title: 'Google Cloud Generative AI & Foundation Models Learning Path',
    company: 'Google Cloud Training & Developer Relations',
    location: '100% Online Self-Paced',
    stipendOrSalary: 'Free Skill Badges + Google Cloud Qwiklabs Vouchers',
    prizeOrStipend: 'Free Vouchers & Badges',
    type: 'free_course',
    category: 'free_course',
    sourcePlatform: 'Google Open Source',
    sourceUrl: 'https://www.cloudskillsboost.google/paths/118',
    deadline: 'Instant Free Access',
    registeredCount: '60,000+ Badges Earned',
    urgencyBadge: '☁️ Free Cloud Credits',
    verifiedHost: true,
    tags: ['Google Cloud', 'Generative AI', 'Free Badges', 'Prompt Engineering'],
    bannerGradient: 'from-sky-600 via-blue-600 to-indigo-700',
    minGpa: 6.0,
    requiredSkills: [
      { skillName: 'Prompt Engineering & RAG', level: 60 }
    ]
  },

  // 21. TCS Digital / NQT Entry-Level Software Engineer 2026
  {
    id: 'opp-tcs-entry-job',
    title: 'TCS National Qualifier Test (NQT) - Digital Software Engineer',
    company: 'Tata Consultancy Services (TCS)',
    location: 'Pan-India (Hybrid Across Major Delivery Hubs)',
    stipendOrSalary: '₹7,00,000 - ₹9,50,000 / annum (Digital Band)',
    prizeOrStipend: '₹7L - ₹9.5L CTC',
    type: 'entry_level_job',
    category: 'job',
    sourcePlatform: 'Industry Partner',
    sourceUrl: 'https://www.tcs.com/careers/entry-level',
    deadline: 'Registrations Live on TCS Hub',
    registeredCount: '1,20,000+ Enrolled',
    urgencyBadge: '💼 Direct Full-Time Role',
    verifiedHost: true,
    tags: ['TCS Digital', 'Entry-Level Full-Time', 'B.Tech/MCA/B.Sc', 'Tier 2/3 College Priority'],
    bannerGradient: 'from-violet-700 via-purple-700 to-pink-700',
    minGpa: 6.5,
    requiredSkills: [
      { skillName: 'Python & Data Structures', level: 80 },
      { skillName: 'System Architecture & REST APIs', level: 75 }
    ]
  }
];

// Verified 1-on-1 Industry Mentors Dataset
export const mockMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Priya Sharma',
    role: 'Senior AI Research Engineer',
    company: 'Google DeepMind (Ex-IIT Bombay)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    sessionsCount: 185,
    bio: 'Specializes in LLM architectures, RAG pipelines, PyTorch optimization, and technical AI mock interview drills.',
    expertise: ['Generative AI', 'PyTorch & RAG', 'AI Mock Interviews', 'Research Papers'],
    languages: ['English', 'Hindi'],
    availableSlots: ['Tomorrow at 6:00 PM', 'Thursday at 7:30 PM', 'Saturday at 11:00 AM'],
    sessionPrice: 'Free 1:1 Intro Session',
    topTopic: 'AI Systems & RAG Architecture Review'
  },
  {
    id: 'mentor-2',
    name: 'Kunal Verma',
    role: 'Staff Distributed Systems Architect',
    company: 'Microsoft Azure (Ex-Amazon)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    sessionsCount: 220,
    bio: 'Guided 200+ students into Tier-1 product companies. Focuses on high-scale microservices, concurrency, and system design rounds.',
    expertise: ['System Design', 'Distributed Systems', 'SDE Interview Prep', 'Resume Critique'],
    languages: ['English', 'Hindi'],
    availableSlots: ['Wednesday at 8:00 PM', 'Friday at 6:30 PM', 'Sunday at 10:00 AM'],
    sessionPrice: 'Free 1:1 Intro Session',
    topTopic: 'SDE System Design & High-Concurrency Architecture'
  },
  {
    id: 'mentor-3',
    name: 'Dr. Harsh Patel',
    role: 'CleanTech & Battery Systems Scientist',
    company: 'GIFT City EV & Clean Energy Alliance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    sessionsCount: 115,
    bio: 'Passionate about guiding polytechnic and engineering graduates into renewable careers: EV Battery Management (BMS) and Solar Rooftop MPPT.',
    expertise: ['EV Powertrains', 'Solar Rooftop MPPT', 'Smart Grid Tech', 'Diploma to BTech Transition'],
    languages: ['English', 'Gujarati', 'Hindi'],
    availableSlots: ['Tomorrow at 5:00 PM', 'Saturday at 3:00 PM', 'Sunday at 4:30 PM'],
    sessionPrice: 'Scholarship Sponsored',
    topTopic: 'Solar PV Grid Synchronization & EV Battery BMS Diagnostics'
  },
  {
    id: 'mentor-4',
    name: 'Ananya Iyer',
    role: 'Lead Full-Stack Engineer',
    company: 'Zerodha Technology (FinTech)',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 4.99,
    sessionsCount: 310,
    bio: 'Frequent hackathon judge and winner. Advises student teams on pitching, rapid prototyping, and full-stack performance tuning.',
    expertise: ['React & Node.js', 'FinTech Architecture', 'Hackathon Winning Strategy', 'Portfolio Reviews'],
    languages: ['English', 'Hindi', 'Tamil'],
    availableSlots: ['Thursday at 6:00 PM', 'Saturday at 1:00 PM', 'Sunday at 6:00 PM'],
    sessionPrice: 'Free 1:1 Intro Session',
    topTopic: 'Hackathon Strategy & Fast Production MVP Development'
  },
  {
    id: 'mentor-5',
    name: 'Rohan Mehta',
    role: 'Senior SDE & Open Source Maintainer',
    company: 'Google Summer of Code (GSoC) Mentor',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    sessionsCount: 195,
    bio: 'Helped 40+ students qualify for GSoC, LFX, and open source fellowships. Focuses on Git mastery, issue selection, and proposal writing.',
    expertise: ['GSoC Proposal Writing', 'Open Source Contributions', 'Git Workflow', 'C++ & Python'],
    languages: ['English', 'Gujarati', 'Hindi'],
    availableSlots: ['Wednesday at 7:00 PM', 'Friday at 8:00 PM', 'Sunday at 11:30 AM'],
    sessionPrice: 'Free 1:1 Intro Session',
    topTopic: 'GSoC Proposal Drafting & First Open Source Pull Request'
  },
  {
    id: 'mentor-6',
    name: 'Sneha Mukherjee',
    role: 'Analytics & Campus Recruitment Manager',
    company: 'Tata Consultancy Services (TCS)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 4.90,
    sessionsCount: 140,
    bio: '10+ years evaluating candidate profiles. Expert in campus placement aptitude, HR interview questions, and behavioral rubrics.',
    expertise: ['Campus Hiring Prep', 'HR & Behavioral Questions', 'Resume ATS Optimization', 'Communication Skills'],
    languages: ['English', 'Hindi', 'Bengali'],
    availableSlots: ['Tomorrow at 7:00 PM', 'Thursday at 5:30 PM', 'Saturday at 4:00 PM'],
    sessionPrice: 'Free 1:1 Intro Session',
    topTopic: 'Campus Placement Mock HR & Behavioral Interview'
  }
];

// Recommended Real-World Projects with Discrete Steps (Report Highlight #6 & #13)
export const mockRecommendedProjects: ProjectPortfolioItem[] = [
  {
    id: 'proj-rag-bot',
    title: 'Personal Document Q&A Bot with FastAPI & pgvector',
    category: 'AI & Data Engineering',
    level: 'Intermediate',
    description: 'Build a production Retrieval-Augmented Generation (RAG) assistant that chunks technical PDFs, generates dense vector embeddings, and performs cosine similarity search before prompting the LLM.',
    targetSkills: ['Python & Data Structures', 'Prompt Engineering & RAG', 'Database & SQL / pgvector'],
    isVerifiedEvidence: true,
    repoUrl: 'https://github.com/aarav-patel/rag-doc-chat',
    demoUrl: 'https://rag-doc-chat.careergrowth.dev',
    notes: 'Benchmarked with 500-page AI research paper dataset. Cosine similarity threshold tuned to 0.82 for zero hallucinations.',
    completedAt: '2026-09-28',
    matchedOpportunityIds: ['opp-unstop-amazon-ml', 'opp-devfolio-ethindia', 'opp-pminternship-ai', 'opp-h2s-india-ai'],
    steps: [
      { id: 'step-1', title: 'Architecture & PDF Parser', detail: 'Implement PyPDF text extraction and recursive sliding-window chunking (500 tokens, 50 overlap).', completed: true },
      { id: 'step-2', title: 'Vector Embeddings & PostgreSQL', detail: 'Generate 1536-dimensional embeddings and store in PostgreSQL using the pgvector extension with IVFFlat index.', completed: true },
      { id: 'step-3', title: 'FastAPI Semantic Query Endpoint', detail: 'Construct REST route /api/query that calculates top-k cosine similarity and augments the system prompt.', completed: true },
      { id: 'step-4', title: 'Diagnostic Verification & Benchmarking', detail: 'Run hallucination evaluation testbench with Ragas metrics and publish open-source GitHub repository.', completed: true }
    ]
  },
  {
    id: 'proj-solar-mppt',
    title: 'Solar Rooftop MPPT Inverter & Grid Sync Simulation',
    category: 'Clean Energy & Smart Grid',
    level: 'Intermediate',
    description: 'Design and simulate an automated Perturb & Observe Maximum Power Point Tracking (MPPT) controller with grid synchronization safety locks.',
    targetSkills: ['Solar PV Systems & Grid Maintenance', 'Technical Problem Solving & Communication', 'System Architecture & REST APIs'],
    isVerifiedEvidence: true,
    repoUrl: 'https://github.com/aarav-patel/solar-mppt-sim',
    notes: 'Maintained 98.4% tracking efficiency across simulated dynamic cloud cover irradiance changes.',
    completedAt: '2026-09-15',
    matchedOpportunityIds: ['opp-aicte-smartgrid', 'opp-unstop-cleantech'],
    steps: [
      { id: 'step-1', title: 'I-V & P-V Mathematical Modeling', detail: 'Model standard silicon solar cell characteristic curve under varying irradiance (200 - 1000 W/m²).', completed: true },
      { id: 'step-2', title: 'Perturb & Observe Algorithm', detail: 'Implement discrete duty-cycle adjustment loop to track maximum electrical power point.', completed: true },
      { id: 'step-3', title: 'Anti-Islanding Grid Protection', detail: 'Program automatic disconnection triggers when utility grid voltage drops below standard tolerance.', completed: true },
      { id: 'step-4', title: 'Telemetry Dashboard & Report', detail: 'Record experimental logs and assemble verification report aligned with NCrF vocational guidelines.', completed: true }
    ]
  },
  {
    id: 'proj-ev-bms',
    title: 'EV Lithium-ion Battery State-of-Charge (SoC) & BMS Monitor',
    category: 'Electric Mobility & Automotive',
    level: 'Advanced',
    description: 'Develop an extended Kalman Filter (EKF) algorithm running on microcontrollers to estimate individual cell voltage, internal resistance, and state-of-charge for 48V EV battery packs.',
    targetSkills: ['EV Battery Management Systems', 'Python & Data Structures', 'System Architecture & REST APIs'],
    isVerifiedEvidence: false,
    matchedOpportunityIds: ['opp-reliance-tup', 'opp-h2s-agritech-iot'],
    steps: [
      { id: 'step-1', title: 'Battery Equivalent Circuit Model', detail: 'Formulate 2-RC Thevenin circuit model capturing charge-transfer and diffusion polarization dynamics.', completed: true },
      { id: 'step-2', title: 'Extended Kalman Filter Implementation', detail: 'Code recursive EKF state estimator in Python to track real-time SoC within ±2.5% accuracy.', completed: false },
      { id: 'step-3', title: 'Thermal Runaway Safety Alerting', detail: 'Integrate multi-point thermistor threshold warnings with CAN bus broadcast simulation.', completed: false },
      { id: 'step-4', title: 'Hardware-in-the-Loop Validation', detail: 'Benchmark controller against standardized automotive driving cycles (WLTP).', completed: false }
    ]
  },
  {
    id: 'proj-smart-agri',
    title: 'Precision Agri IoT Soil Telemetry & Automated Drip Relay',
    category: 'Agritech & Embedded IoT',
    level: 'Beginner',
    description: 'Build a low-power wireless telemetry probe that samples volumetric soil moisture and ambient temperature, triggering solar-powered solenoid irrigation valves.',
    targetSkills: ['Digital Agriculture IoT Sensors', 'Python & Data Structures'],
    isVerifiedEvidence: false,
    matchedOpportunityIds: ['opp-h2s-agritech-iot', 'opp-pminternship-ai'],
    steps: [
      { id: 'step-1', title: 'Sensor Calibration in Sand/Clay', detail: 'Calibrate capacitive soil moisture sensors against gravimetric soil drying standards.', completed: true },
      { id: 'step-2', title: 'ESP32 MQTT Publish Loop', detail: 'Program microcontroller to sleep in deep sleep mode and wake up hourly to publish telemetry packets.', completed: false },
      { id: 'step-3', title: 'Automated Relay Valve Actuation', detail: 'Implement threshold-based valve switching to prevent over-irrigation and conserve groundwater.', completed: false },
      { id: 'step-4', title: 'Mobile Cloud Dashboard', detail: 'Connect MQTT feed to web visualization showing live farm moisture heatmap.', completed: false }
    ]
  }
];


