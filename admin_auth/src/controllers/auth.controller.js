const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

const userType = process.env.USER_TYPE || 'restaurant';

const ACCESS_SECRET = process.env.ACCESS_JWT_KEY;
const REFRESH_SECRET = process.env.REFRESH_JWT_KEY;
const refreshTokens = new Map();


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await prisma.admin.findUnique({where: {email}});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const mathDate = Math.floor(Date.now() / 1000);
        const accessTokenDuration = 7 * 24 * 60 * 60;
        const refreshExpireTime = 7 * 24 * 60 * 60;

        const jti = uuidv4();
        refreshTokens.set(jti, user);

        const accessToken = jwt.sign({
            username: user.username,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + accessTokenDuration
        }, ACCESS_SECRET);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "Lax",
            expires: new Date(mathDate * 1000 + accessTokenDuration * 1000)
        });

        const refreshToken = jwt.sign({
            username: user.username,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + refreshExpireTime
        }, process.env.REFRESH_JWT_KEY);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "Lax",
            expires: new Date(mathDate * 1000 + refreshExpireTime * 1000)
        });
        return res.redirect(`/${userType}/`);

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message: "Server error during login"});
    }
};

exports.authenticate = (req, res) => {
    const auth = req.headers['authorization'];
    const refresh = req.cookies['refreshToken'];

    if (auth?.startsWith('Bearer ') && auth) {
        const token = auth.slice(7);
        try {
            jwt.verify(token, ACCESS_SECRET);
            return res.sendStatus(200);
        } catch (e) {
            if (e.name !== 'TokenExpiredError') return res.sendStatus(401);
        }
    }
    if (!refresh) return res.sendStatus(401);
    try {
        const payload = jwt.verify(refresh, REFRESH_SECRET);
        if (!refreshTokens.has(payload.jti)) return res.sendStatus(401);
        const newAccess = jwt.sign({sub: payload.sub}, ACCESS_SECRET, {expiresIn: '15m'});
        res.setHeader('X-Set-Cookie', `accessToken=${newAccess}; HttpOnly; SameSite=Lax; Path=/; Max-Age=900`);
        res.setHeader('Authorization', 'Bearer ' + newAccess);
        return res.sendStatus(200);
    } catch {
        return res.sendStatus(401);
    }
};

exports.logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.redirect(`/${userType}/login`);
};