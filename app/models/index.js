var Sequelize = require('sequelize');

//console.log("process.env.NODE_ENV: [" + process.env.NODE_ENV + "]");

var database_config_to_use = '';
switch (process.env.NODE_ENV) {
    case 'test_travis':
        database_config_to_use = '../../config/database.test_travis';
        break;
    case undefined:
    case 'production':
    case 'development':
        database_config_to_use = '../../config/database';
        break;
}
var dbconfig = require(database_config_to_use).config;

var dbname = dbconfig.db;
var dbhostname = dbconfig.hostname;
var dbport = dbconfig.port;
var dbuser = dbconfig.user;
var dbpassword = dbconfig.password;

var sequelize = new Sequelize(dbname, dbuser, dbpassword, {
    host: dbhostname,
    port: dbport
});

//list all faire models that will be loaded
var models = [
	{
        name: "Task",
        file: "task"
    },
	{
        name: "Tasklist",
        file: "tasklist"
    }
];

//load models dynamically
models.forEach(function(model) {
    module.exports[model.name] = sequelize.import(__dirname + '/' + model.file); 
});

module.exports.init = function(virt_modules, done) {
	console.log("app/models/index::init()");
	
	for (var i = 0; i < virt_modules.length; i++) {
		virt_modules[i].loadModels(module.exports);
	}
    (function(model) {
        //define all associations
		
		//scurvy associations
		var scurvy = require('scurvy');
		scurvy.setupAssociations(model);
		
		//faire specific associations
		model.Tasklist.hasMany(model.Task);
		model.Task.belongsTo(model.Tasklist, { as: 'List' });
		
		model.Tasklist.hasOne(model.User, { as: 'Owner' });
		model.User.hasMany(model.Tasklist);
		
		model.Tasklist.hasMany(model.User, { as: 'SharedUser' });
		model.User.hasMany(model.Tasklist, { as: 'SharedTasklist' });
        
        //ensure tables are created with the fields and associations
		
		//scurvy tables
		scurvy.setupSync(model, function(err) {
			if (err) { console.log('Error when trying to sync scurvy tables.'); }
			
			//faire specific tables
			model.Tasklist.sync().success(function() {
				model.Task.sync().success(function() {
					//callback
					done();
				}).error(function(error) { console.log("Error during Task.sync(): " + error); });
			}).error(function(error) { console.log("Error during Tasklist.sync(): " + error); });
        });
    })(module.exports);
};

//export the connection
module.exports.sequelize = sequelize;