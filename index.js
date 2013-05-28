var Hapi = require('hapi'),
    options = {
    	views: {
			path: 'app/views',
			engines: {
				html: 'handlebars'
			}
		}
	},
    serverConfig = require('./config/config').config,
    server = new Hapi.Server(serverConfig.hostname, serverConfig.port, options),
    Handlebars = require('handlebars');
 

var devconfig = require('./config/database').config;

var dbname = devconfig.db;
var dbhostname = devconfig.hostname;
var dbport = devconfig.port;
var dbuser = devconfig.user;
var dbpassword = devconfig.password;


var Sequelize = require("sequelize");

var sequelize = new Sequelize(dbname, dbuser, dbpassword, {
    host: dbhostname,
    port: dbport
});
            

 var source = "<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>";

Handlebars.registerPartial('link', '<a href="/people/{{id}}">{{name}}</a>');
var template = Handlebars.compile(source);

var data = { 
    "people": [
        { "name": "Alan", "id": 1 },
        { "name": "Yehuda", "id": 2 }
    ]
};
      
server.auth('session', {
    scheme: 'cookie',
    password: 'zxr3rsjoi2r', //TODO: refactor this out to gitignored auth config file
    cookie: 'faire-e-land',  //?TODO: refactor this out to gitignored auth config file
    redirectTo: '/login',
	isSecure: false,
	ttl: 1800000,
	clearInvalid: true
});

var fauth = require('./auth');

var home = function () {
    this.reply('<html><head><title>Login page</title></head><body><h3>Welcome '
      + this.auth.credentials.name
      + '!</h3><br/><form method="get" action="/logout">'
      + '<input type="submit" value="Logout">'
      + '</form></body></html>');
};

var staticPage = function() {
    var me = this;
    
    sequelize.query("SELECT * FROM tasks ORDER BY created DESC").success(function(myTableRows) {
        console.log(myTableRows);
        var result = "";
        var total = myTableRows.length;
        myTableRows.forEach(function(element, index) {
            /*result.push({
                id: element.id,
                body: element.body,
                created: element.created,
                state: element.state
            });*/
            
            result += "<div class=\"task\">" + element.body + "</div>";
            if(index == total - 1) {
                templateStaticPage(me, result);  
            }    
        });
    }).fail(function(err) { console.log(err); });
    
    //me.reply.view("staticpage.html", {greeting: 'hello world', title: 'test'}).send();
};
 
var templateStaticPage = function(request, tasks) { 
 
 request.reply.view("staticpage.html", {tasks: template(data), pageTitle: 'Email Asset creation', contentTitle: 'EMAIL ASSET CREATION CHECKLIST'});   
};

server.route([
  { method: '*', path: '/{path*}', handler: { directory: { path: './public/', listing: false } } },
  /*{ method: 'GET', path: '/', config: { handler: home, auth: true  } },
  { method: '*', path: '/login', config: { handler: fauth.login, auth: { mode: 'try' } } },
  { method: 'GET', path: '/logout', config: { handler: fauth.logout, auth: true } },*/
  
  { method: 'GET', path: '/static', config: { handler: staticPage, auth: false  } }
]);

server.start();
