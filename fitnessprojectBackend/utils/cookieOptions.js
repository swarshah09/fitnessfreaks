const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/',
};

const authCookieOptions = {
    ...baseCookieOptions,
    maxAge: 50 * 60 * 1000, // 50 minutes
};

const refreshCookieOptions = {
    ...baseCookieOptions,
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
};

module.exports = {
    authCookieOptions,
    refreshCookieOptions,
    baseCookieOptions,
};
