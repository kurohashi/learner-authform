var ctrl = require("../../../controllers/user.controller");

// The route urls presented here are going to  
module.exports = function (app) {
    app.route("/userProfile")
        .get(ctrl.profile);
}