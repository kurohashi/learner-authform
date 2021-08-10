var ctrl = require("../../../controllers/user.controller");

// The route urls presented here are going to  
module.exports = function (app) {
    app.route("/register")
        .post(ctrl.register);
    app.route("/authenticate")
        .post(ctrl.login);
}