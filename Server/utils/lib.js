
var crypto = require("crypto");
var send = require("../configs/response.conf");
var conf = require("../configs/app.conf");
var console = conf.console;

module.exports = {
	createId: createId,
	createHash: createHash,
	createToken: createToken,
	validPasswordStrength: validPasswordStrength,
	validEmail: validEmail,
	authFailed: authFailed,
	passOn: passOn,
	isObject: isObject,
	insertQuery: insertQuery,
	selectQuery: selectQuery,
	deleteQuery: deleteQuery,
	updateQuery: updateQuery,
	find: find,
	insert: insert,
}

/**
 *  General response for failing Autharization. It can fail for various reasons. 
 * 		- 	forbidden actions (user control)
 * 		-	invalid token or credentials
 * 		-	Payment required (premium features)
 * @param {*} req 
 * @param {*} res 
 */
function authFailed(err, req, res, next) {
	console.error("Forbidden", err);
	if (err == 426)
		return send.upgrade(res);
	if (err == 401)
		return send.unauthorized(res);
	send.forbidden(res);
}

/**
 * Check password strength
 * @param {*} password 
 * @returns 
 */
function validPasswordStrength(password) {
	let checker = new RegExp(conf.auth.password);
	return checker.test(password);
}

/**
 * Check email validity
 * @param {*} email 
 * @returns 
 */
function validEmail(email) {
	let checker = conf.auth.email;
	return checker.test(email);
}

/**
 * 
 * @param {*} type  : Base64 or Hex type
 * @param {*} len 	: length of the id
 */
function createId(type, len) {
	var foo = "";
	try {
		type = type.toLowerCase();
		const supported_types = ["hex", "base64"];
		if (supported_types.indexOf(type) < 0)
			foo = "hex";
		else
			foo = type;
	} catch (error) {
		foo = "hex";
	}
	if (!len)
		len = 20;

	return crypto.randomBytes(Math.ceil(len))
		.toString(foo) // convert to given format
		.slice(0, len);
}

/**
 * Create a hash of the password provided
 * @param {*} string 
 * @returns 
 */
function createHash(string) {
	return new Buffer(crypto.pbkdf2Sync(string, conf.auth.salt, conf.auth.iterations, conf.auth.length, "SHA256"), 'binary').toString('base64');
}

/**
 * pass to callback the agruments
 * @param {*} args
 */
function passOn(...args) {
	return function (next) {
		return next(null, ...args);
	}
}

/**
 * Whether an object or not
 * @param {*} obj 
 * @returns 
 */
function isObject(obj) {
	if (!obj)
		return false;
	if (Array.isArray(obj))
		return false;
	return typeof obj === 'object';
}

/**
 * Create a new token for auth
 * @param {*} callback (err, token)
 */
function createToken(callback) {
	let token = createId("hex", 50);
	insert(conf.dbTables.token, { token: token }, function (err, data) {
		if (err)
			return callback(err);
		return callback(null, token);
	});
}

/**
 * Create db insert query
 * @param {*} table 
 * @param {*} obj 
 * @param {*} callback 
 */
function insertQuery(table, obj, callback) {
	if (!(table && obj))
		return callback("invalid query");
	try {
		let keys = Object.keys(obj);
		let query = `insert into ${table} (${keys.join(',')}) values (`;
		for (let i in obj) {
			let rec = obj[i];
			if (typeof rec === 'string')
				query += `'${rec}',`;
			else
				query += `${rec},`;
		}
		query = query.slice(0, -1);
		query += ')';
		console.log(query);
		conf.db.query(query, callback);
	} catch (error) {
		return callback("invalid query");
	}
}

/**
 * Fetch something from the db
 * @param {*} table 
 * @param {*} obj : (optional)
 * @param {*} callback 
 * @returns 
 */
function selectQuery(table, obj, callback) {
	if (!(table))
		return callback("invalid query");
	try {
		let query = `select * from ${table}`;
		if (isObject(obj)) {
			query += ` where `;
			let where = [];
			for (let i in obj) {
				let rec = obj[i];
				if (typeof rec === 'string')
					where.push(`${i}='${rec}'`);
				else
					where.push(`${i}=${rec}`);
			}
			query += where.join(" and ");
		}
		console.log(query);
		conf.db.query(query, callback);
	} catch (error) {
		return callback(error);
	}
}

/**
 * Delete something from the db
 * @param {*} table 
 * @param {*} obj : (optional)
 * @param {*} callback 
 * @returns 
 */
 function deleteQuery(table, obj, callback) {
	if (!(table && obj && isObject(obj)))
		return callback("invalid query");
	try {
		let query = `delete from ${table}`;
		if (isObject(obj)) {
			query += ` where `;
			for (let i in obj) {
				let rec = obj[i];
				if (typeof rec === 'string')
					query += `${i}='${rec}',`;
				else
					query += `${i}=${rec},`;
			}
			query = query.slice(0, -1);
		}
		console.log(query);
		conf.db.query(query, callback);
	} catch (error) {
		return callback(error);
	}
}

/**
 * Update into db
 * @param {*} table 
 * @param {*} updateObj 
 * @param {*} queryObj 
 * @param {*} callback 
 */
function updateQuery(table, updateObj, queryObj, callback) {
	if (!(table && isObject(updateObj) && isObject(queryObj)))
		return callback("invalid query");
	try {
		let query = `update ${table} set `;
		for (let i in updateObj) {
			let rec = updateObj[i];
			if (typeof rec === 'string')
				query += `${i}='${rec}',`;
			else
				query += `${i}=${rec},`;
		}
		query = query.slice(0, -1);
		query += ' where ';
		for (let i in queryObj) {
			let rec = queryObj[i];
			if (typeof rec === 'string')
				query += `${i}='${rec}',`;
			else
				query += `${i}=${rec},`;
		}
		query = query.slice(0, -1);
		console.log(query);
		conf.db.query(query, callback);
	} catch (error) {
		callback(error);
	}
}

function find(collection, query, callback) {
	console.log(JSON.stringify(query));
	conf.db.collection(collection).find(query).toArray(function (err, data) {
		if (err)
			return callback(err);
		data = data[0];
		if (!data)
			return callback("no data");
		callback(null, data);
	});
}

function insert(collection, query, callback) {
	console.log(JSON.stringify(query));
	conf.db.collection(collection).insert(query, callback);
}