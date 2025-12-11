const jwt = require('jsonwebtoken');

function checkAdminToken(req, res, next) {
    // Check for token in cookies (for backend-to-backend) or Authorization header (for frontend)
    const adminAuthToken = req.cookies.adminAuthToken || 
                          (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                           ? req.headers.authorization.substring(7) 
                           : null);

    if (!adminAuthToken) {
        return res.status(401).json({ message: 'Admin authentication failed: No adminAuthToken provided', ok: false });
    }

    jwt.verify(adminAuthToken, process.env.JWT_ADMIN_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Admin authentication failed: Invalid adminAuthToken', ok: false });
        } else {
            // Admin auth token is valid, continue with the request
            req.adminId = decoded.adminId;
            next();
        }
    });
}

module.exports = checkAdminToken;