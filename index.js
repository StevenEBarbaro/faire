var Hapi = require('hapi'),
    options = {
    	views: {
			path: 'app/views',
			partialsPath : 'app/views/partials',
			engines: {
				html: 'handlebars'
			}
		}
	},
    serverConfig = require('./config/config').config,
    server = new Hapi.Server(serverConfig.hostname, serverConfig.port, options);
 
/*CONFIG STUFF*/
var devconfig = require('./config/database').config;

var dbname = devconfig.db;
var dbhostname = devconfig.hostname;
var dbport = devconfig.port;
var dbuser = devconfig.user;
var dbpassword = devconfig.password;

//Initialize db connection
var sequelize = require('./lib/db').createSingletonConnection(dbname, dbuser, dbpassword, dbhostname, dbport);

//Setup auth rules
server.auth('session', {
    scheme: 'cookie',
    password: 'zxr3rsjoi2r', //TODO: refactor this out to gitignored auth config file
    cookie: 'faire-e-land',  //?TODO: refactor this out to gitignored auth config file
    redirectTo: '/login',
	isSecure: false,
	ttl: 1800000,
	clearInvalid: true
});


//var source = "<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>";
//Handlebars.registerPartial('link', '<a href="/people/{{id}}">{{name}}</a>');
//var template = Handlebars.compile(source);

//var data = { 
//    "people": [
//        { "name": "Alan", "id": 1 },
//        { "name": "Yehuda", "id": 2 }
//    ]
//};



var home = function () {
    this.reply('<html><head><title>Login page</title></head><body><h3>Welcome '
      + this.auth.credentials.name
      + '!</h3><br/><form method="get" action="/logout">'
      + '<input type="submit" value="Logout">'
      + '</form></body></html>');
};

var fauth = require('./lib/auth');
var faire = require('./lib/faire');

server.route([
  { method: '*', path: '/{path*}', handler: { directory: { path: './public/', listing: false } } },
  /*{ method: 'GET', path: '/', config: { handler: home, auth: true  } },
  { method: '*', path: '/login', config: { handler: fauth.login, auth: { mode: 'try' } } },
  { method: 'GET', path: '/logout', config: { handler: fauth.logout, auth: true } },*/
  
  { method: 'GET', path: '/static', config: { handler: faire, auth: false  } }
]);

server.start();
console.log("Server up!");