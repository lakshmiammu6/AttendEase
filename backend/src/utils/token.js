const jwt = require('jsonwebtoken');

// Ensure a JWT secret exists even if process.env.JWT_SECRET is unset
const getJwtSecret = () => {
  return (
    process.env.JWT_SECRET ||
    process.env.ADMIN_INITIAL_PASSWORD ||
    'attendease_secure_jwt_fallback_secret_key_2026'
  );
};

/**
 * generateToken:
 * Generates a signed JSON Web Token (JWT) containing the user ID and role.
 *
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @param {string} role - The role of the user ('student' | 'faculty' | 'admin').
 * @returns {string} Signed JWT string.
 */
const generateToken = (userId, role) => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId, role }, secret, {
    expiresIn
  });
};

/**
 * verifyToken:
 * Verifies and decodes a given JWT.
 *
 * @param {string} token - The raw JWT token string.
 * @returns {object} Decoded payload ({ id, role, iat, exp }).
 */
const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
