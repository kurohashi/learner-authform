let conf = require("../configs/app.conf");
const lib = require("./lib");
let console = conf.console;

module.exports = {
	isAuthenticated: isAuthenticated,
	isAdmin: isAdmin,
}

function isAuthenticated(req, res, cb) {
	let token = req.headers["x-access-token"];
	lib.find(conf.dbTables.token, { token: token }, function (err, data) {
		if (err || !data)
			return cb("unauthenticated");
		cb(null, req);
	});
}

function isAdmin(req, res, cb) {
	// TODO: Admin auth
	cb(null, req);
}