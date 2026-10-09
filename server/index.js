import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'database.json');
const DIST_PATH = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge_sih_secret_key_2026';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json'
};

function serveStatic(req, res, pathname) {
  let relativePath = pathname === '/' ? 'index.html' : pathname;
  let safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(DIST_PATH, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA fallback to index.html
  const indexPath = path.join(DIST_PATH, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Static build not found. Please run npm run build.');
}

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { profile: {}, skills: [], careerPathways: [], quizSubmissions: [], applications: [], interventions: [], copilotHistory: [], aiTutorHistory: [], activityLog: [], users: [], otpStore: {} };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    parsed.users = parsed.users || [];
    parsed.otpStore = parsed.otpStore || {};
    return parsed;
  } catch (err) {
    console.error('Error reading DB file:', err);
    return { profile: {}, skills: [], careerPathways: [], quizSubmissions: [], applications: [], interventions: [], copilotHistory: [], aiTutorHistory: [], activityLog: [], users: [], otpStore: {} };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB file:', err);
    return false;
  }
}

function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        resolve(data);
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', err => reject(err));
  });
}

// Call Google Gemini API directly if key is provided
async function callGeminiAPI(apiKey, systemInstruction, userPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }
        ]
      }
    ]
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.candidates && json.candidates[0]?.content?.parts[0]?.text) {
            resolve(json.candidates[0].content.parts[0].text);
          } else if (json.error) {
            reject(new Error(json.error.message || 'Gemini API Error'));
          } else {
            reject(new Error('Invalid response structure from Gemini API'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(payload);
    req.end();
  });
}

// Built-in intelligent AI tutor reasoning engine fallback
function generateSmartTutorResponse(prompt = '', topic = 'General Tech', language = 'en') {
  const langUpper = (language || 'en').toUpperCase();
  const lowerPrompt = (prompt || '').toLowerCase();

  let explanation = '';

  if (lowerPrompt.includes('relu') || lowerPrompt.includes('activation')) {
    explanation = `ReLU (Rectified Linear Unit) is defined as f(x) = max(0, x). It fixes the vanishing gradient problem in deep neural networks by maintaining non-saturated gradients for positive inputs, allowing gradient descent to propagate back through 50+ hidden layers efficiently.`;
  } else if (lowerPrompt.includes('rag') || lowerPrompt.includes('vector') || lowerPrompt.includes('cosine')) {
    explanation = `In Retrieval-Augmented Generation (RAG), text chunks are mapped into high-dimensional vector embeddings (e.g. 1536 dimensions). Cosine Similarity measures the angular difference between vectors rather than Euclidean distance, ensuring semantic meaning is retrieved regardless of sentence length.`;
  } else if (lowerPrompt.includes('solar') || lowerPrompt.includes('pv') || lowerPrompt.includes('inverter')) {
    explanation = `For rooftop Solar PV installations, grid synchronization requires matching AC phase angle, voltage waveform (230V RMS), and grid frequency (50 Hz). MPPT (Maximum Power Point Tracking) algorithms dynamically adjust panel impedance to extract maximum peak wattage.`;
  } else if (lowerPrompt.includes('ev') || lowerPrompt.includes('battery') || lowerPrompt.includes('bms')) {
    explanation = `Electric Vehicle Battery Management Systems (BMS) monitor individual lithium cell voltages (3.2V-4.2V), state-of-charge (SOC), and thermal limits. Active cell balancing redirects excess charge to lower cells to prevent thermal runaway.`;
  } else {
    explanation = `For topic "${topic}": Key conceptual principles require breaking down complex domain workflows into 3 core stages: 1) State Initialization, 2) Transformation Logic, and 3) Verification & Validation against target benchmarks.`;
  }

  return `🤖 [AI TUTOR - EXPERT ANSWER (${langUpper})]
Topic: ${topic}

Question: "${prompt || 'General Inquiry'}"

💡 EXPLANATION & CONCEPTS:
• ${explanation}

🎯 PRACTICAL TAKEAWAY & STEP-BY-STEP ADVICE:
1. Understand the core mathematical formulation or diagnostic schematic first.
2. Build verified project evidence (e.g. NPTEL / AICTE certified labs).
3. Test your understanding using SkillBridge Diagnostic Quizzes and low-bandwidth rural offline packs.`;
}

const server = http.createServer(async (req, res) => {
  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Serve frontend static assets for all non-API routes (Single Port 5000)
  if (!pathname.startsWith('/api')) {
    serveStatic(req, res, pathname);
    return;
  }

  // --- AUTH ROUTES ---
  // POST /api/auth/send-otp (Generates 6-digit verification code with 10-minute expiry)
  if (pathname === '/api/auth/send-otp' && method === 'POST') {
    const body = await parseJSONBody(req);
    const { email } = body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'A valid email address is required' }));
      return;
    }
    const cleanEmail = email.toLowerCase().trim();
    const db = readDB();
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    db.otpStore = db.otpStore || {};
    db.otpStore[cleanEmail] = {
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      createdAt: new Date().toISOString()
    };
    writeDB(db);

    console.log(`\n========================================`);
    console.log(`📧 [EMAIL VERIFICATION OTP SENT]`);
    console.log(`Recipient: ${cleanEmail}`);
    console.log(`Verification Code: [ ${generatedOtp} ]`);
    console.log(`Expires: 10 minutes`);
    console.log(`========================================\n`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      otpPreview: generatedOtp
    }));
    return;
  }

  // POST /api/auth/verify-otp (Validates OTP and creates verified account)
  if (pathname === '/api/auth/verify-otp' && method === 'POST') {
    const body = await parseJSONBody(req);
    const { name, email, password, otp } = body;
    if (!email || !otp) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Email and verification OTP are required' }));
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = readDB();
    db.otpStore = db.otpStore || {};
    const record = db.otpStore[cleanEmail];

    if (!record || record.otp !== otp.trim()) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid verification code. Please try again.' }));
      return;
    }

    if (Date.now() > record.expiresAt) {
      delete db.otpStore[cleanEmail];
      writeDB(db);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Verification code has expired. Please request a new code.' }));
      return;
    }

    // OTP is valid - consume it
    delete db.otpStore[cleanEmail];

    db.users = db.users || [];
    let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (user && user.password) {
      // User already fully exists
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'An account with this email is already registered. Please sign in.' }));
      return;
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: hashedPassword,
        isVerified: true,
        authProvider: 'email',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
    } else {
      user.isVerified = true;
      if (hashedPassword) user.password = hashedPassword;
      if (name) user.name = name;
    }

    writeDB(db);
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, isVerified: true, authProvider: 'email' }
    }));
    return;
  }

  // POST /api/auth/google-login (Authenticates chosen Google account identity)
  if (pathname === '/api/auth/google-login' && method === 'POST') {
    const body = await parseJSONBody(req);
    const { email, name, avatarUrl } = body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Valid Google email is required' }));
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = readDB();
    db.users = db.users || [];
    let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      user = {
        id: `usr_g_${Date.now()}`,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: '',
        avatarUrl: avatarUrl || '',
        isVerified: true,
        authProvider: 'google',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
    } else {
      user.authProvider = 'google';
      user.isVerified = true;
      if (name) user.name = name;
      if (avatarUrl) user.avatarUrl = avatarUrl;
    }

    writeDB(db);
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, isVerified: true, authProvider: 'google' }
    }));
    return;
  }

  // POST /api/auth/register (Direct registration fallback)
  if (pathname === '/api/auth/register' && method === 'POST') {
    const body = await parseJSONBody(req);
    const { name, email, password } = body;
    if (!email || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Email and password are required' }));
      return;
    }
    const cleanEmail = email.toLowerCase().trim();
    const db = readDB();
    db.users = db.users || [];
    const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User already exists with this email' }));
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: hashedPassword,
      isVerified: true,
      authProvider: 'email',
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeDB(db);
    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, isVerified: true }
    }));
    return;
  }

  // POST /api/auth/login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await parseJSONBody(req);
    const { email, password } = body;
    if (!email || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Email and password are required' }));
      return;
    }
    const cleanEmail = email.toLowerCase().trim();
    const db = readDB();
    db.users = db.users || [];
    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'No registered account found with this email' }));
      return;
    }
    if (!user.password && user.authProvider === 'google') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'This account was created with Google. Please use "Sign in with Google".' }));
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid password. Please check your credentials.' }));
      return;
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, isVerified: user.isVerified || false }
    }));
    return;
  }

  // GET /api/auth/me
  if (pathname === '/api/auth/me' && method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'No authorization token provided' }));
      return;
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const db = readDB();
      db.users = db.users || [];
      const user = db.users.find(u => u.id === decoded.id);
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        user: { id: user.id, name: user.name, email: user.email, isVerified: user.isVerified || false, authProvider: user.authProvider }
      }));
      return;
    } catch (err) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid or expired token' }));
      return;
    }
  }

  // GET /api/auth/google
  if (pathname === '/api/auth/google' && method === 'GET') {
    res.writeHead(302, { 'Location': '/?action=google_login' });
    res.end();
    return;
  }

  // GET /api/health
  if (pathname === '/api/health' && method === 'GET') {
    const db = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      message: 'SkillBridge Dynamic Server is active and operational',
      timestamp: new Date().toISOString(),
      stats: {
        skillsCount: db.skills?.length || 0,
        submissionsCount: db.quizSubmissions?.length || 0,
        applicationsCount: db.applications?.length || 0,
        interventionsCount: db.interventions?.length || 0,
        copilotCount: db.copilotHistory?.length || 0,
        aiTutorHistoryCount: db.aiTutorHistory?.length || 0,
        activityCount: db.activityLog?.length || 0
      }
    }));
    return;
  }

  // GET /api/db
  if (pathname === '/api/db' && method === 'GET') {
    const db = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
    return;
  }

  // POST /api/ai-tutor (AI Tutor API supporting any Gemini API key or smart fallback)
  if (pathname === '/api/ai-tutor' && method === 'POST') {
    const body = await parseJSONBody(req);
    const prompt = body.prompt || body.question || '';
    const topic = body.topic || 'General Tech';
    const language = body.language || 'en';
    const apiKey = body.apiKey || '';

    const db = readDB();
    const activeKey = apiKey || process.env.GEMINI_API_KEY || '';

    let aiResponseText = '';
    let apiUsed = 'Built-in Expert Engine';

    if (activeKey.trim()) {
      try {
        const sysInst = `You are SkillBridge AI Tutor, an expert tutor for Indian students (GTU / SIH 2026). Answer questions clearly, accurately, and concisely in ${language} language. Topic: ${topic}.`;
        aiResponseText = await callGeminiAPI(activeKey, sysInst, prompt);
        apiUsed = 'Google Gemini 2.0 API';
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart AI engine:', err.message);
        aiResponseText = generateSmartTutorResponse(prompt, topic, language) + `\n\n(Note: Custom API Key returned error: ${err.message}. Defaulted to Smart AI Engine).`;
        apiUsed = 'Smart Fallback AI Engine';
      }
    } else {
      aiResponseText = generateSmartTutorResponse(prompt, topic, language);
    }

    const tutorRecord = {
      id: `ai-tutor-${Date.now()}`,
      prompt,
      topic,
      language,
      response: aiResponseText,
      apiUsed,
      timestamp: new Date().toISOString()
    };

    db.aiTutorHistory = db.aiTutorHistory || [];
    db.aiTutorHistory.unshift(tutorRecord);
    db.activityLog = db.activityLog || [];
    db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'AI Tutor Query', details: { prompt, topic, apiUsed } });
    writeDB(db);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      answer: aiResponseText,
      apiUsed,
      historyCount: db.aiTutorHistory.length
    }));
    return;
  }

  // GET & POST /api/profile
  if (pathname === '/api/profile') {
    const db = readDB();
    if (method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.profile || {}));
      return;
    }
    if (method === 'POST' || method === 'PUT') {
      const body = await parseJSONBody(req);
      db.profile = { ...db.profile, ...body };
      db.activityLog = db.activityLog || [];
      db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'Profile Updated', details: body });
      writeDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, profile: db.profile }));
      return;
    }
  }

  // GET & POST /api/skills
  if (pathname === '/api/skills') {
    const db = readDB();
    if (method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.skills || []));
      return;
    }
    if (method === 'POST') {
      const body = await parseJSONBody(req);
      const newSkill = {
        id: body.id || `skill-${Date.now()}`,
        name: body.name || 'New Skill',
        category: body.category || 'core_tech',
        currentProficiency: Number(body.currentProficiency) || 50,
        requiredProficiency: Number(body.requiredProficiency) || 80,
        evidenceCount: Number(body.evidenceCount) || 1,
        certifications: body.certifications || []
      };
      db.skills = db.skills || [];
      db.skills.push(newSkill);
      db.activityLog = db.activityLog || [];
      db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'Skill Added', details: newSkill.name });
      writeDB(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, skill: newSkill, skills: db.skills }));
      return;
    }
  }

  // PUT & DELETE /api/skills/:id
  if (pathname.startsWith('/api/skills/') && pathname.length > 12) {
    const skillId = pathname.replace('/api/skills/', '');
    const db = readDB();

    if (method === 'PUT') {
      const body = await parseJSONBody(req);
      db.skills = (db.skills || []).map(s => s.id === skillId ? { ...s, ...body } : s);
      db.activityLog = db.activityLog || [];
      db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'Skill Updated', details: { id: skillId, body } });
      writeDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, skills: db.skills }));
      return;
    }

    if (method === 'DELETE') {
      db.skills = (db.skills || []).filter(s => s.id !== skillId);
      db.activityLog = db.activityLog || [];
      db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'Skill Deleted', details: skillId });
      writeDB(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, skills: db.skills }));
      return;
    }
  }

  // GET & POST /api/applications (Job / Internship)
  if (pathname === '/api/applications') {
    const db = readDB();
    if (method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.applications || []));
      return;
    }
    if (method === 'POST') {
      const body = await parseJSONBody(req);
      const appRecord = {
        id: `app-${Date.now()}`,
        opportunityId: body.opportunityId,
        opportunityTitle: body.opportunityTitle,
        company: body.company,
        appliedAt: new Date().toISOString(),
        status: 'Submitted to Server',
        matchScore: body.matchScore || 85,
        applicantName: db.profile?.name || 'Aarav Patel'
      };
      db.applications = db.applications || [];
      db.applications.unshift(appRecord);
      db.activityLog = db.activityLog || [];
      db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'Job Application Submitted', details: appRecord.opportunityTitle });
      writeDB(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, application: appRecord, applications: db.applications }));
      return;
    }
  }

  // GET & POST /api/quiz-submissions
  if (pathname === '/api/quiz-submissions') {
    const db = readDB();
    if (method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.quizSubmissions || []));
      return;
    }
    if (method === 'POST') {
      const body = await parseJSONBody(req);
      const submission = {
        id: `quiz-sub-${Date.now()}`,
        topic: body.topic || 'General Assessment',
        score: body.score || 0,
        totalQuestions: body.totalQuestions || 1,
        timestamp: new Date().toISOString(),
        answers: body.answers || []
      };
      db.quizSubmissions = db.quizSubmissions || [];
      db.quizSubmissions.unshift(submission);
      db.activityLog = db.activityLog || [];
      db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'Quiz Answered', details: submission });
      writeDB(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, submission, quizSubmissions: db.quizSubmissions }));
      return;
    }
  }

  // GET & POST /api/interventions (Teacher / Educator Notes)
  if (pathname === '/api/interventions') {
    const db = readDB();
    if (method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.interventions || []));
      return;
    }
    if (method === 'POST') {
      const body = await parseJSONBody(req);
      const intervention = {
        id: `interv-${Date.now()}`,
        studentId: body.studentId || 'stu-204',
        studentName: body.studentName || 'Student',
        note: body.note || 'Remedial session scheduled',
        actionType: body.actionType || 'Worksheet',
        createdAt: new Date().toISOString()
      };
      db.interventions = db.interventions || [];
      db.interventions.unshift(intervention);
      db.activityLog = db.activityLog || [];
      db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'Teacher Intervention Added', details: intervention });
      writeDB(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, intervention, interventions: db.interventions }));
      return;
    }
  }

  // POST /api/custom-input (Generic user data submission)
  if (pathname === '/api/custom-input' && method === 'POST') {
    const body = await parseJSONBody(req);
    const db = readDB();
    const entry = {
      id: `custom-${Date.now()}`,
      title: body.title || 'User Data Entry',
      category: body.category || 'General',
      payload: body.payload || body,
      timestamp: new Date().toISOString()
    };
    db.customEntries = db.customEntries || [];
    db.customEntries.unshift(entry);
    db.activityLog = db.activityLog || [];
    db.activityLog.unshift({ timestamp: new Date().toISOString(), action: 'Custom Data Submitted', details: entry.title });
    writeDB(db);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Custom data stored successfully on dynamic server', entry, totalCustomEntries: db.customEntries.length }));
    return;
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint Not Found', path: pathname }));
});

server.listen(PORT, () => {
  console.log(`🚀 SkillBridge Dynamic Backend Server listening on http://localhost:${PORT}`);
});
