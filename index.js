var Hapi = require('hapi'),
    options = {
        cors: true
	};
var masterConfig = require('./config/config');

var serverConfig = masterConfig.config,
	tlsConfig = masterConfig.tlsconfig,
	mailConfig = masterConfig.mailconfig;

if (serverConfig.tls) {
	console.log('Loading tls');
	options.tls = tlsConfig;
}
var server = new Hapi.Server(serverConfig.hostname, serverConfig.port, options);
var scurvy = require('scurvy');
var auth = require('./lib/auth'); //
var faire = require('./lib/faire');
var mailer = require('./lib/mail');

//Setup auth rules
server.auth('session', {
    scheme: 'cookie',
    password: 'zxr3rsjoi2r', //TODO: refactor this out to gitignored auth config file
    cookie: 'faire-e-land',  //?TODO: refactor this out to gitignored auth config file
    redirectTo: '/login',
	isSecure: serverConfig.tls,
	ttl: 1800000,
	clearInvalid: true
});

server.views({
    engines: {
        html: 'handlebars'            
    },
    path: './app/views',
	partialsPath: './app/views/partials'
});


var home = function () {
    this.reply('<html><head><title>Test</title></head><body>Test!</body></html>');
};



server.route([
  //Faire Routes
  { method: 'GET', 	path: '/', config: { handler: home, auth: { mode: 'try' } } },
  { method: 'GET', path: '/static', config: { handler: faire.baseHandler, auth: false  } },
  { method: 'GET', path: '/staticTasks', config: { handler: faire.baseData, auth: false  } },
  
  //Scurvy Routes
  { method: '*', 	path: '/confirm/{hashkey*}', config: { handler: auth.confirm, auth: false  } },
  { method: 'POST', path: '/register', config: { handler: auth.register, validate: { payload: scurvy.register_validate(Hapi) }, auth: false  } },
  { method: 'POST', path: '/login', config: { handler: auth.login, validate: { payload: scurvy.login_validate(Hapi) }, auth: { mode: 'try' }  } },
  { method: 'GET', path: '/login', config: { handler: auth.login_view, auth: { mode: 'try' }  } },
  { method: '*', path: '/logout', config: { handler: auth.logout, auth: true  } },
  
  //All static content
  { method: '*', path: '/{path*}', handler: { directory: { path: './public/', listing: false } } }
]);


//setup/load modules/plugins here
var virt_modules = [];
virt_modules.push(scurvy);

var db = require('./app/models');
db.init(virt_modules, function() {
	console.log('database setup complete');
	
	server.start();
	auth.setURI(server.info.uri);
	console.log("Server up!");
});