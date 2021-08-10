'use strict';
var send = require("../configs/response.conf");
var conf = require("../configs/app.conf");
var lib = require("../utils/lib");
let console = conf.console;

module.exports = {
    register: register,
    login: login,
    profile: profile,
};

/**
 * User registration
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function register(req, res) {
    let user = req.body;
    if (!(user.email && user.password))
        return send.invalid(res);
    if (!lib.validPasswordStrength(user.password))
        return send.invalid(res, "Password is weak");
    if (!lib.validEmail(user.email))
        return send.invalid(res, "invalid email");
    user.password = lib.createHash(user.password);
    lib.insert(conf.dbTables.user, user, function (err, data) {
        if (err)
            return send.failure(res, err);
        sendUserSuccessResp(req, res);
    });
}

/**
 * User login
 * @param {*} req 
 * @param {*} res 
 * @returns
 */
function login(req, res) {
    let user = req.body;
    if (!(user.email && user.password))
        return send.invalid(res);
    user.password = lib.createHash(user.password);
    lib.find(conf.dbTables.user, user, function (err, data) {
        if (err)
            return send.failure(res, err);
        sendUserSuccessResp(req, res);
    });
}

/**
 * Send a new resp after creating a new token
 * @param {*} req 
 * @param {*} res 
 */
function sendUserSuccessResp(req, res) {
    lib.createToken(function (err, token) {
        if (err)
            return send.serverError(res, err);
        req.body.token = token;
        delete req.body.password;
        send.ok(res, req.body);
    });
}

/**
 * Get profile info
 * @param {*} req 
 * @param {*} res 
 */
function profile(req, res) {
    let email = req.headers["x-email"];
    lib.find(conf.dbTables.user, { email: email }, function (err, data) {
        if (err)
            return send.failure(res, err);
        delete data.password;
        send.ok(res, data);
    });
}