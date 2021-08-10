
module.exports = {
	ok: ok,
	created: created,
	noData: noData,
	invalid: invalid,
	serverError: serverError,
	upgrade: upgrade,
	forbidden: forbidden,
	failure: failure,
	conflict: conflict,
	toomuch: toomuch,
	unauthorized: unauthorized,
	notImplemented: notImplemented,
	genResponse: genResponse,
}

function ok(res, data, msg, obj) {
	genResponse(res, msg || "OK", data, 200, null, obj)
};

function created(res, data, msg) {
	genResponse(res, msg || "Created", data, 201)
};

function noData(res, data, msg) {
	genResponse(res, msg || "No Content", data, 204)
};

function invalid(res, msg, data) {
	genResponse(res, msg || "Bad Request", data, 400)
};

function forbidden(res, data, msg) {
	genResponse(res, msg || "Forbidden ", data, 403)
};

function unauthorized(res, data, msg) {
	genResponse(res, msg || "Unauthorized access", data, 401)
};

function serverError(res, data, msg) {
	genResponse(res, msg || "Internal Server Error", data, 500)
};

function notImplemented(res, data, msg) {
	genResponse(res, msg || "Method Not Implemented", data, 501)
};

function upgrade(res, data, msg) {
	genResponse(res, msg || "Please upgrade your plan to avail this feature.", data, 402)
};

function conflict(res, data, msg) {
	genResponse(res, msg || "Conflict", data, 409)
};

function toomuch(res, data, msg) {
	genResponse(res, msg || "Too Many requests", data, 429)
};

function failure(res, data, msg) {
	genResponse(res, msg || "Expectation Failed", data, 417)
};

/**
 * Send response to caller
 * @param {*} res : express response object
 * @param {*} msg : response message
 * @param {*} data : response data is any
 * @param {*} statusCode : response statusCode
 * @param {*} headers : response headers is any
 * @param {*} obj : any related more info
 * @returns 
 */
function genResponse(res, msg, data, statusCode, headers, obj) {
	headers = headers || {};
	if (isNaN(parseInt(data)))
		data = data || {};
	if (!(res && msg && statusCode)) {
		console.error("Inavlid call to send Function.. Missing parameters");
		return;
	}
	let json = {
		statusCode: statusCode,
		msg: msg,
		data: data
	};
	if (obj) {
		delete obj.statusCode; delete obj.data; delete obj.msg;
		Object.assign(json, obj);
	}
	return res.set(headers).status(statusCode).json(json);
}