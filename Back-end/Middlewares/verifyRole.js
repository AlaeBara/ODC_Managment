const verifyRole = (allowedRoles) => (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  
    // Check if the user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access forbidden: ${allowedRoles.join(' or ')} only` });
    }
  
    // If the user's role is allowed, proceed to the next middleware
    next();
  };
  
module.exports = verifyRole;