
var internals = {};
internals.sequelize = null;

internals.initialize = function(dbname, dbuser, dbpassword, dbhostname, dbport) {
	console.log("db.internals.initialize()");
	var Sequelize = require("sequelize");

	var sequelize = new Sequelize(dbname, dbuser, dbpassword, {
		host: dbhostname,
		port: dbport
	});
	internals.sequelize = sequelize;
}

exports.getExistingConnection = function() {
	console.log("db.getExistingConnection()");
	return internals.sequelize ? internals.sequelize : null;
}

//TODO: refactor this function to use a single config object instead of 5 parameters
exports.createSingletonConnection = function(dbname, dbuser, dbpassword, dbhostname, dbport) {
	console.log("db.createSingletonConnection()");
	if (!internals.sequelize) {
		internals.initialize(dbname, dbuser, dbpassword, dbhostname, dbport);
	}
	return internals.sequelize;
}

