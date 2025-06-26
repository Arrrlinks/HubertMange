const viewsController = require("../controllers/views.controller");

const userType = process.env.USER_TYPE || 'admin';

module.exports = function(app) {
    app.get(`/${userType}/login`, viewsController.login);
};