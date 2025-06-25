const authController = require("../controllers/auth.controller");

const userType = process.env.USER_TYPE || 'delivery';

console.log(`Setting up routes for user type: ${userType}`);

module.exports = function(app) {
    app.post(`/${userType}/register`, authController.register);
    app.post(`/${userType}/login`, authController.login);
    app.get(`/${userType}/authenticate`, authController.authenticate);
    app.get(`/${userType}/logout`, authController.logout);
    app.get(`/${userType}/auth/google`, authController.auth_google);
    app.get(`/${userType}/auth/google/callback`, authController.auth_google_callback);
};