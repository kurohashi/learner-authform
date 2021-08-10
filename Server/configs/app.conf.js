module.exports = new (function () {
	this.console = require("tracer").colorConsole();
	this.sys = {
		"environment": "Development",
		"versions": ["v1"],
		"port": "30000",
		"base_url": "http://localhost:30000"
	}
	this.auth = {
		iterations: 2500,
		salt: "example_setter",
		length: 50,
		email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		password: "(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.*[A-Za-z])(?=.{6,})",
	};
	this.dbTables = {
		user: "users",
		token: "tokens",
	};
})();