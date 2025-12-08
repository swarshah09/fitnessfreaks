const jwt = require('jsonwebtoken');
const { authCookieOptions, refreshCookieOptions } = require('../utils/cookieOptions');

const unauthorized = (res, message) => res.status(401).json({ message, ok: false });

const decodeToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
};

function checkAuth(req, res, next) {
    const cookies = req.cookies || {};
    const cookieAuthToken = cookies.authToken;
    const refreshToken = cookies.refreshToken;

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!cookieAuthToken && !refreshToken && bearerToken) {
        const decoded = decodeToken(bearerToken, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return unauthorized(res, 'Authentication failed: Invalid bearer token');
        }
        req.userId = decoded.userId;
        return next();
    }

    if (!cookieAuthToken || !refreshToken) {
        return unauthorized(res, 'Authentication failed: No authToken or refreshToken provided');
    }

    jwt.verify(cookieAuthToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (refreshErr, refreshDecoded) => {
                if (refreshErr) {
                    return unauthorized(res, 'Authentication failed: Both tokens are invalid');
                } else {
<<<<<<< Updated upstream
                    const newAuthToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
=======
                    const newAuthToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
>>>>>>> Stashed changes
                    const newRefreshToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '10d' });

                    res.cookie('authToken', newAuthToken, authCookieOptions);
                    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

                    req.userId = refreshDecoded.userId;
                    req.ok = true;
                    return next();
                }
            });
        } else {
            req.userId = decoded.userId;
            return next();
        }
    });
}

module.exports = checkAuth;