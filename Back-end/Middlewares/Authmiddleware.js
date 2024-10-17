const jwt = require('jsonwebtoken');
const { User } = require('../Models/userModel');

const authenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the user still exists in the database
        const user = await User.findById(decoded.userId);
        if (!user) {
            // If the user doesn't exist, clear the cookie and return an error
            res.clearCookie('token');
            return res.status(401).json({ message: 'User no longer exists' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.clearCookie('token');
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticated;