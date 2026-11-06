/**
 * authorize:
 * Middleware factory for Role-Based Access Control (RBAC).
 *
 * @param  {...string} roles - Permitted user roles ('student', 'faculty', 'admin')
 * @returns {Function} Express middleware function
 *
 * Example usage:
 *   router.get('/admin-only', protect, authorize('admin'), handler);
 *   router.post('/mark-attendance', protect, authorize('faculty', 'admin'), handler);
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to perform this action.`
      });
    }

    next();
  };
};

module.exports = { authorize };
