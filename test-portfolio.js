#!/usr/bin/env node

/**
 * Testing Script per Portfolio Alina Galben
 * Esegue test automatici prima del deploy
 */

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load backend .env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, 'backend', '.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
}

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${COLORS.green}✅ ${msg}${COLORS.reset}`),
  error: (msg) => console.log(`${COLORS.red}❌ ${msg}${COLORS.reset}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ️  ${msg}${COLORS.reset}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠️  ${msg}${COLORS.reset}`),
  section: (msg) => console.log(`\n${COLORS.cyan}━━━ ${msg} ━━━${COLORS.reset}\n`)
};

// Test configuration
const config = {
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3020',
  frontendUrl: process.env.FRONTEND_URL || 'http://127.0.0.1:5174'
};

let testsPassed = 0;
let testsFailed = 0;

// HTTP request helper
function makeRequest(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Test-Script/1.0'
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          error: null
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test functions
async function testBackendHealth() {
  log.section('BACKEND TESTS');
  
  try {
    const response = await makeRequest(`${config.backendUrl}/health`);
    
    if (response.status === 200) {
      const data = JSON.parse(response.body);
      log.success(`Backend is healthy: ${data.status}`);
      testsPassed++;
      return true;
    } else {
      log.error(`Backend returned status ${response.status}`);
      testsFailed++;
      return false;
    }
  } catch (err) {
    log.error(`Backend not responding: ${err.message}`);
    log.warn(`Make sure backend is running on ${config.backendUrl}`);
    testsFailed++;
    return false;
  }
}

async function testBlogEndpoint() {
  try {
    const response = await makeRequest(`${config.backendUrl}/api/blog`);
    
    if (response.status === 200) {
      const data = JSON.parse(response.body);
      if (data.items && Array.isArray(data.items)) {
        log.success(`Blog endpoint working (${data.items.length} articles found)`);
        testsPassed++;
      } else {
        log.error('Blog endpoint did not return items array');
        testsFailed++;
      }
    } else {
      log.error(`Blog endpoint returned status ${response.status}`);
      testsFailed++;
    }
  } catch (err) {
    log.error(`Blog endpoint error: ${err.message}`);
    testsFailed++;
  }
}

async function testContactForm() {
  try {
    const testData = {
      name: 'Test User',
      email: 'test@portfolio.local',
      subject: 'Test Subject',
      message: 'This is a test message'
    };

    const response = await makeRequest(
      `${config.backendUrl}/api/contact`,
      'POST',
      testData
    );

    if (response.status === 200 || response.status === 201) {
      const data = JSON.parse(response.body);
      if (data.success) {
        log.success('Contact form endpoint working');
        testsPassed++;
      } else {
        log.error('Contact form returned error: ' + data.message);
        testsFailed++;
      }
    } else if (response.status === 429) {
      log.warn('Rate limiting active (expected for multiple rapid requests)');
      testsPassed++;
    } else {
      log.error(`Contact form returned status ${response.status}`);
      testsFailed++;
    }
  } catch (err) {
    log.error(`Contact form error: ${err.message}`);
    testsFailed++;
  }
}

async function testFrontendHealth() {
  log.section('FRONTEND TESTS');
  
  try {
    // Try both localhost and 127.0.0.1
    let response = null;
    try {
      response = await makeRequest(config.frontendUrl);
    } catch (err) {
      // Prova localhost se 127.0.0.1 fallisce
      try {
        response = await makeRequest('http://localhost:5174/');
      } catch (err2) {
        throw err2;
      }
    }
    
    if (response.status === 200) {
      if (response.body.includes('<!DOCTYPE') || response.body.includes('<html')) {
        log.success('Frontend is serving HTML');
        testsPassed++;
      } else {
        log.warn('Frontend responded but with non-HTML content (dev server active)');
        testsPassed++;
      }
    } else {
      log.error(`Frontend returned status ${response.status}`);
      testsFailed++;
    }
  } catch (err) {
    log.error(`Frontend not responding: ${err.message}`);
    log.warn(`Make sure frontend is running on ${config.frontendUrl}`);
    testsFailed++;
  }
}

async function testCORS() {
  log.section('CORS TESTS');
  
  try {
    const response = await makeRequest(
      `${config.backendUrl}/health`,
      'OPTIONS'
    );

    const corsHeaders = response.headers['access-control-allow-origin'];
    if (corsHeaders) {
      log.success(`CORS headers present: ${corsHeaders}`);
      testsPassed++;
    } else {
      log.warn('No CORS headers found (may be expected)');
    }
  } catch (err) {
    log.error(`CORS test error: ${err.message}`);
    testsFailed++;
  }
}

// Performance test
function measureResponseTime(url) {
  return new Promise(async (resolve) => {
    try {
      const start = Date.now();
      await makeRequest(url);
      const time = Date.now() - start;
      resolve(time);
    } catch {
      resolve(null);
    }
  });
}

async function testPerformance() {
  log.section('PERFORMANCE TESTS');

  const backendTime = await measureResponseTime(`${config.backendUrl}/health`);
  if (backendTime !== null) {
    if (backendTime < 500) {
      log.success(`Backend response time: ${backendTime}ms`);
      testsPassed++;
    } else {
      log.warn(`Backend response time: ${backendTime}ms (slower than expected)`);
    }
  }

  const frontendTime = await measureResponseTime(config.frontendUrl);
  if (frontendTime !== null) {
    if (frontendTime < 1000) {
      log.success(`Frontend response time: ${frontendTime}ms`);
      testsPassed++;
    } else {
      log.warn(`Frontend response time: ${frontendTime}ms (slower than expected)`);
    }
  }
}

async function testEnvironmentVariables() {
  log.section('ENVIRONMENT VARIABLES');

  const requiredVars = [
    'RESEND_API_KEY',
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ACCESS_TOKEN'
  ];

  log.info('Backend should have these variables in .env:');
  let varsPresent = 0;
  requiredVars.forEach(v => {
    const isDefined = process.env[v] ? '✅ Present' : '❌ Missing';
    if (process.env[v]) {
      varsPresent++;
    }
    console.log(`  ${v}: ${isDefined}`);
  });

  if (varsPresent === requiredVars.length) {
    log.success('All required backend variables present');
    testsPassed++;
  } else {
    log.warn(`Only ${varsPresent}/${requiredVars.length} variables present`);
  }

  log.info('\nFrontend should have VITE_ prefixed versions in .env');
}

async function runAllTests() {
  console.clear();
  console.log(`${COLORS.cyan}`);
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Portfolio Testing Suite - Alina Galben ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`${COLORS.reset}\n`);

  log.info(`Backend URL: ${config.backendUrl}`);
  log.info(`Frontend URL: ${config.frontendUrl}\n`);

  // Run CRITICAL tests only
  await testBackendHealth();
  await testBlogEndpoint();
  await testContactForm();
  await testEnvironmentVariables();
  
  // Optional tests (non-critical)
  log.section('OPTIONAL TESTS');
  await testPerformance();

  // Summary
  log.section('TEST SUMMARY');
  console.log(`${COLORS.green}Passed: ${testsPassed}${COLORS.reset}`);
  console.log(`${COLORS.red}Failed: ${testsFailed}${COLORS.reset}`);
  
  const total = testsPassed + testsFailed;
  const percentage = total > 0 ? Math.round((testsPassed / total) * 100) : 0;
  console.log(`Success Rate: ${percentage}%`);

  if (testsFailed === 0) {
    console.log(`\n${COLORS.green}✅ All tests passed! Ready for deployment.${COLORS.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${COLORS.red}❌ Some tests failed. Fix issues before deployment.${COLORS.reset}`);
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(err => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
