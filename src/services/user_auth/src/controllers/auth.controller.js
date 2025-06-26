const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');

const userType = process.env.USER_TYPE || 'user';

const ACCESS_SECRET = process.env.ACCESS_JWT_KEY;
const REFRESH_SECRET = process.env.REFRESH_JWT_KEY;
const refreshTokens = new Map();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const REDIRECT_URI = `http://localhost:3000/${userType}/auth/google/callback`; // Adjust the redirect URI as needed

const googleClient = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

exports.register = async (req, res) => {
    try {
        const {email, username, password} = req.body;

        const existingEmail = await prisma.user.findUnique({where: {email}});
        if (existingEmail) {
            return res.status(409).json({msg: "Email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        const user = await prisma.user.findUnique({where: {email}});
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
        return res.status(200).json({
            message: "Register successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({msg: "Server error during registration"});
    }
};

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const email = username;

        const user = await prisma.user.findUnique({where: {email}});
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
        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message: "Server error during login"});
    }
};

exports.auth_google = async (req, res) => {
    const url = googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
    });
    res.redirect(url);
};

exports.auth_google_callback = async (req, res) => {
    const {code} = req.query;
    if (!code) {
        return res.status(400).json({message: "No code provided"});
    }

    try {
        const {tokens} = await googleClient.getToken(code);
        googleClient.setCredentials(tokens);

        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const username = payload.name || email.split('@')[0];

        console.log("Google auth payload:", payload);

        let user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: bcrypt.hashSync(uuidv4(), 10) // Generate a random password
                }
            });
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

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', {
            id: user.id,
            username: user.username,
            email: user.email
        });

        return res.redirect("/user/google/success");

    } catch (error) {
        console.error("Google auth error:", error);
        return res.status(500).json({message: "Server error during Google authentication"});
    }
}


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