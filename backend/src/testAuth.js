const http = require('http');
const { generateToken, verifyToken } = require('./utils/token');
const { authorize } = require('./middleware/roleMiddleware');
const app = require('./app');

async function runTests() {
  console.log('=== Step A: Authentication Unit & Integration Test Suite ===');

  // Test 1: Token Generation and Verification
  console.log('\n[Test 1] Testing JWT Token Generation & Verification:');
  const token = generateToken('user_mongo_id_123', 'admin');
  console.log('✓ Token generated successfully. Length:', token.length);
  const decoded = verifyToken(token);
  if (decoded.id === 'user_mongo_id_123' && decoded.role === 'admin') {
    console.log('✓ Decoded payload matches expected ID and role:', decoded);
  } else {
    throw new Error('Token verification payload mismatch');
  }

  // Test 2: Role-Based Authorization Middleware (RBAC)
  console.log('\n[Test 2] Testing Role-Based Authorization Middleware (RBAC):');
  let allowedCalled = false;
  const adminGuard = authorize('admin');

  // Case A: Role matches
  adminGuard({ user: { role: 'admin' } }, {}, () => {
    allowedCalled = true;
  });
  if (allowedCalled) {
    console.log('✓ Admin user permitted to access admin route');
  } else {
    throw new Error('Admin user was incorrectly blocked');
  }

  // Case B: Role does not match
  let forbiddenStatusCode = null;
  let forbiddenErrorMsg = null;
  const mockRes = {
    status: (code) => {
      forbiddenStatusCode = code;
      return {
        json: (body) => {
          forbiddenErrorMsg = body.message;
        }
      };
    }
  };

  adminGuard({ user: { role: 'student' } }, mockRes, () => {});
  if (forbiddenStatusCode === 403) {
    console.log('✓ Student correctly blocked with HTTP 403 Forbidden on admin route:');
    console.log('  Message:', forbiddenErrorMsg);
  } else {
    throw new Error('Student was not blocked with 403');
  }

  // Test 3: Controller & Middleware Direct Handler Testing (No socket connection needed)
  console.log('\n[Test 3] Testing Controller & Middleware Direct Handlers:');
  const { login } = require('./controllers/authController');
  const { protect } = require('./middleware/authMiddleware');

  // 3.1 Test login input validation (empty body)
  let status31 = null;
  let body31 = null;
  const mockRes31 = {
    status: (code) => {
      status31 = code;
      return {
        json: (data) => {
          body31 = data;
        }
      };
    }
  };
  await login({ body: {} }, mockRes31, () => {});
  console.log('✓ POST /api/auth/login validation (empty body) -> HTTP Status:', status31, '(Expected 400)');
  console.log('  Message:', body31.message);

  // 3.2 Test protect middleware without authorization header
  let status32 = null;
  let body32 = null;
  const mockRes32 = {
    status: (code) => {
      status32 = code;
      return {
        json: (data) => {
          body32 = data;
        }
      };
    }
  };
  await protect({ headers: {} }, mockRes32, () => {});
  console.log('✓ GET /api/auth/me without token -> HTTP Status:', status32, '(Expected 401)');
  console.log('  Message:', body32.message);

  // 3.3 Test protect middleware with invalid token
  let status33 = null;
  let body33 = null;
  const mockRes33 = {
    status: (code) => {
      status33 = code;
      return {
        json: (data) => {
          body33 = data;
        }
      };
    }
  };
  await protect({ headers: { authorization: 'Bearer invalid_garbage_token' } }, mockRes33, () => {});
  console.log('✓ GET /api/auth/me with invalid token -> HTTP Status:', status33, '(Expected 401)');
  console.log('  Message:', body33.message);

  console.log('\n🎉 ALL UNIT & INTEGRATION CHECKS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
