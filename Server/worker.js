// worker Node instance

var app = require("express")();
var conf = require("./configs/app.conf");
var bodyParser = require("body-parser");
var send = require("./configs/response.conf");
var auth = require("./utils/auth");
var utils = require("./utils/lib");
let console = conf.console;
module.exports = {
	init: init,
	close: close
}

function close() {
	console.log("closing worker");
	if (conf.server)
		conf.server.close();
}

function init() {
	setEnvVars();
	app.set('conf', conf);
	app.use(bodyParser.json()); //supprts JSON encoded bodies
	app.use(bodyParser.text()); //for navigator.sendBeacon api call 
	app.use(bodyParser.urlencoded({ extended: true })); //supports URL encoded bodies
	app.use(require("cookie-parser")());
	app.use(require('helmet')());
	app.use(require("hpp")());
	// check the necessary conf
	if (!(conf.sys.versions || conf.sys.port)) {
		console.log("Missing mandatory config Variable. Please goto configs/env.conf.json and set versions, hasViews and port");
		return;
	}

	for (var i in conf.sys.versions) {
		app.use("/apis/" + conf.sys.versions[i], auth.isAuthenticated, require("./routes/auth." + conf.sys.versions[i]), utils.authFailed);
		app.use("/apis/admin/" + conf.sys.versions[i], auth.isAdmin, require("./routes/admin." + conf.sys.versions[i]), utils.authFailed);
		app.use("/apis/open/" + conf.sys.versions[i], require("./routes/open." + conf.sys.versions[i]));
	}

	app.use(function (req, res) {
		console.log("Unimplemented API called", req.url);
		send.notImplemented(res);
	})

	conf.server = app.listen(conf.sys.port, function () {
		console.log(conf.sys);
		console.log("App listening on port " + conf.sys.port);
	});

	process.on('uncaughtException', function (err) {
		console.log("uncaughtException ", err);
	});
}

function setEnvVars() {
	if (conf[conf.sys.environment]) {
		Object.assign(conf[i], conf[conf.sys.environment]);
	}
}