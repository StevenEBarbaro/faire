var Hapi = require('hapi'),
    serverConfig = require('./config/config').config,
    server = new Hapi.Server(serverConfig.hostname, serverConfig.port);

server.auth('session', {
    scheme: 'cookie',
    password: 'zxr3rsjoi2r',
    cookie: 'faire-e-land',
    redirectTo: '/login'
});

var fauth = require('./auth');

var home = function () {
    this.reply('<html><head><title>Login page</title></head><body><h3>Welcome '
      + this.auth.credentials.name
      + '!</h3><br/><form method="get" action="/logout">'
      + '<input type="submit" value="Logout">'
      + '</form></body></html>');
};

server.route([
  { method: 'GET', path: '/', config: { handler: home, auth: true  } },
  { method: 'GET',  path: '/hello', handler: function () { this.reply('hello world'); } },
  { method: '*', path: '/login', config: { handler: fauth.login, auth: { mode: 'try' } } },
  { method: 'GET', path: '/logout', config: { handler: fauth.logout, auth: true } }
]);

server.start();
