const verifyAdmin = (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if the user's role is 'admin'
    if (req.user.role !== 'Mentor') {
        return res.status(403).json({ message: 'Access forbidden: Mentor only' });
    }

    // If the user is an admin, proceed to the next middleware
    next();
};

module.exports = verifyAdmin;
