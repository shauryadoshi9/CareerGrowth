/**
 * Automated Security Check Suite for CareerGrowth Platform
 * Team Tatva (HSC|GJ|00051)
 *
 * Verifies critical security controls:
 * 1. Self-register with role 'admin' gives role 'student'
 * 2. Google-login for an existing admin returns 403
 * 3. Student token gets 403 on /api/teacher/analytics, /api/institution/analytics and /api/interventions
 * 4. Request to /api/profile without token returns 401
 * 5. /api/db is not exposed (returns 404)
 * 6. 11th rapid auth attempt receives 429 Too Many Requests
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const SEED_PATH = path.join(ROOT_DIR, 'server', 'database.seed.json');

const testPort = Math.floor(25000 + Math.random() * 20000);
const throwawayJwtSecret = 'sec_check_test_jwt_secret_with_32_characters_minimum!';
const tempDbFile = path.join(os.tmpdir(), `cg_test_db_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`);

// Prepare isolated test database from seed file
fs.copyFileSync(SEED_PATH, tempDbFile);

let serverProcess = null;
let allPassed = true;
const results = [];

function recordResult(name, passed, details = '') {
  if (!passed) allPassed = false;
  results.push({ name, passed, details });
  const status = passed ? 'PASS' : 'FAIL';
  const prefix = passed ? '✅' : '❌';
  console.log(`${prefix} [${status}] ${name}${details ? ` - ${details}` : ''}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.ok) return true;
    } catch {
      // Server not ready yet
    }
    await sleep(250);
  }
  return false;
}

function cleanup() {
  if (serverProcess) {
    try {
      serverProcess.kill('SIGKILL');
    } catch {
      // Process already terminated
    }
  }
  try {
    if (fs.existsSync(tempDbFile)) fs.unlinkSync(tempDbFile);
  } catch {
    // Ignore cleanup error
  }
}

process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(1); });
process.on('SIGTERM', () => { cleanup(); process.exit(1); });

async function runSecurityChecks() {
  console.log('\n============================================================');
  console.log('🛡️  CAREERGROWTH AUTOMATED SECURITY CONTROLS TEST SUITE');
  console.log('    Team Tatva (HSC|GJ|00051) | Submission Security Audit');
  console.log('============================================================');
  console.log(`Port: ${testPort} | DB: Isolated Temporary Seed Instance\n`);

  let serverOutput = '';
  serverProcess = spawn(process.execPath, [path.join(ROOT_DIR, 'server', 'index.js')], {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      PORT: String(testPort),
      JWT_SECRET: throwawayJwtSecret,
      DEMO_MODE: 'true',
      TRUST_PROXY: 'true',
      NODE_ENV: 'test',
      DB_PATH: tempDbFile
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', data => {
    serverOutput += data.toString();
  });

  serverProcess.stderr.on('data', data => {
    const msg = data.toString();
    serverOutput += msg;
    if (msg.includes('FATAL') || msg.includes('Error:')) {
      console.error(`[Server Error]: ${msg.trim()}`);
    }
  });

  const baseUrl = `http://127.0.0.1:${testPort}`;
  const ready = await waitForServer(baseUrl);
  if (!ready) {
    console.error('❌ Server failed to start within timeout window.');
    console.error(`Server output:\n${serverOutput}`);
    cleanup();
    process.exit(1);
  }

  let studentToken = null;

  try {
    // -------------------------------------------------------------
    // CHECK 1: Self-register with role 'admin' yields role 'student'
    // -------------------------------------------------------------
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '192.168.10.1'
      },
      body: JSON.stringify({
        name: 'Adversary Admin Probe',
        email: 'probe.admin@example.com',
        password: 'Password123!',
        role: 'admin'
      })
    });
    const regData = await regRes.json();
    const check1Passed = regRes.status === 201 && regData?.user?.role === 'student';
    studentToken = regData?.token;
    recordResult(
      "Self-register with role 'admin' gives role 'student'",
      check1Passed,
      check1Passed ? `Assigned role: '${regData?.user?.role}'` : `HTTP ${regRes.status}, role: '${regData?.user?.role}'`
    );

    // -------------------------------------------------------------
    // CHECK 2: Google-login for existing admin returns 403
    // -------------------------------------------------------------
    const googleRes = await fetch(`${baseUrl}/api/auth/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '192.168.10.2'
      },
      body: JSON.stringify({
        email: 'admin.demo@careergrowth.org',
        name: 'Dean Verma (Admin)'
      })
    });
    const googleData = await googleRes.json();
    const check2Passed = googleRes.status === 403 && (googleData?.message?.includes('Use password login') || false);
    recordResult(
      "Google-login for existing admin gives 403 ('Use password login for this account.')",
      check2Passed,
      `HTTP ${googleRes.status}: "${googleData?.message || ''}"`
    );

    // -------------------------------------------------------------
    // CHECK 3: Student token is blocked (403) on teacher/admin routes
    // -------------------------------------------------------------
    if (!studentToken) {
      recordResult("Student token blocked on /api/teacher/analytics, /api/institution/analytics and /api/interventions", false, 'Failed to acquire student token');
    } else {
      const teacherRes = await fetch(`${baseUrl}/api/teacher/analytics`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      const instRes = await fetch(`${baseUrl}/api/institution/analytics`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      const intervRes = await fetch(`${baseUrl}/api/interventions`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });

      const check3Passed = teacherRes.status === 403 && instRes.status === 403 && intervRes.status === 403;
      recordResult(
        "Student token gets 403 on /api/teacher/analytics, /api/institution/analytics and /api/interventions",
        check3Passed,
        `Teacher: ${teacherRes.status}, Institution: ${instRes.status}, Interventions: ${intervRes.status}`
      );
    }

    // -------------------------------------------------------------
    // CHECK 4: Request to /api/profile without token returns 401
    // -------------------------------------------------------------
    const profileRes = await fetch(`${baseUrl}/api/profile`);
    const check4Passed = profileRes.status === 401;
    recordResult(
      "No token gets 401 on /api/profile",
      check4Passed,
      `HTTP ${profileRes.status}`
    );

    // -------------------------------------------------------------
    // CHECK 5: /api/db is not exposed (returns 404 / non-200)
    // -------------------------------------------------------------
    const dbResNoAuth = await fetch(`${baseUrl}/api/db`);
    const dbResAuth = await fetch(`${baseUrl}/api/db`, {
      headers: studentToken ? { 'Authorization': `Bearer ${studentToken}` } : {}
    });
    const check5Passed = dbResNoAuth.status !== 200 && (dbResNoAuth.status === 404 || dbResNoAuth.status === 401) && dbResAuth.status === 404;
    recordResult(
      "/api/db is not exposed",
      check5Passed,
      `Without token: HTTP ${dbResNoAuth.status}, With token: HTTP ${dbResAuth.status}`
    );

    // -------------------------------------------------------------
    // CHECK 6: 11th rapid auth attempt receives 429
    // -------------------------------------------------------------
    const rateLimitIP = '192.168.10.99';
    let throttledOn11 = false;
    let priorThrottled = false;
    let statuses = [];

    for (let i = 1; i <= 11; i++) {
      const attemptRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': rateLimitIP
        },
        body: JSON.stringify({
          email: 'student.demo@careergrowth.org',
          password: 'IncorrectPasswordProbe!'
        })
      });
      statuses.push(attemptRes.status);
      if (i <= 10 && attemptRes.status === 429) {
        priorThrottled = true;
      }
      if (i === 11 && attemptRes.status === 429) {
        throttledOn11 = true;
      }
    }

    const check6Passed = !priorThrottled && throttledOn11;
    recordResult(
      "The 11th rapid login attempt gets 429",
      check6Passed,
      `Attempts 1-10: [${statuses.slice(0, 10).join(',')}], Attempt 11: ${statuses[10]}`
    );

  } catch (err) {
    console.error('Unexpected error running checks:', err);
    allPassed = false;
  } finally {
    cleanup();
  }

  console.log('\n------------------------------------------------------------');
  const passCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(`Summary: ${passCount}/${totalCount} checks PASSED.`);

  if (allPassed && passCount === 6) {
    console.log('🎉 ALL SECURITY CONTROLS VERIFIED SUCCESSFULLY.');
    console.log('============================================================\n');
    process.exit(0);
  } else {
    console.error('❌ SECURITY VERIFICATION FAILED. Review issues above.');
    console.log('============================================================\n');
    process.exit(1);
  }
}

runSecurityChecks();
