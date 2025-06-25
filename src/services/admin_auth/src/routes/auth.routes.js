const authController = require("../controllers/auth.controller");

const userType = process.env.USER_TYPE || 'admin';

console.log(`Setting up routes for user type: ${userType}`);

module.exports = function(app) {
    app.post(`/${userType}/login`, authController.login);
    app.get(`/${userType}/authenticate`, authController.authenticate);
    app.get(`/${userType}/logout`, authController.logout);
};