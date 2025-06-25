const viewsController = require("../controllers/views.controller");

const userType = process.env.USER_TYPE || 'user';

module.exports = function(app) {
    app.get(`/${userType}/login`, viewsController.login);
    app.get(`/${userType}/register`, viewsController.register);
};