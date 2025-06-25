const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());
app.use(cookieParser()); // 👈 pour lire les cookies

app.use((req, res, next) => {
    const forwardedCookie = req.headers['x-set-cookie'];
    if (forwardedCookie) {
        res.setHeader('Set-Cookie', forwardedCookie);
    }
    next();
});


app.use((req, res, next) => {
    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (token && !req.headers.authorization) {
        req.headers.authorization = `Bearer ${token}`;
    }
    if (refreshToken && !req.headers['x-refresh-token']) {
        req.headers['x-refresh-token'] = refreshToken;
    }
    next();
});

require('./src/routes/auth.routes')(app);
require('./src/routes/views.routes')(app);


app.listen(port, () => {
    console.log(`Server is running on ${port} inside of the user_auth container`);
});
