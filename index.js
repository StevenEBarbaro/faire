<<<<<<< HEAD
var Hapi = require('hapi');

// Create a server with a host and port
var server = Hapi.createServer('0.0.0.0', 6131);

// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function () {

        this.reply('hello world');
    }
});

// Start the server
=======
var Hapi = require('hapi'),serverConfig = require('./config/config').config,
server = new Hapi.Server(serverConfig.hostname, serverConfig.port);


    
// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function () {

        this.reply('hello world');
    }
});

// Start the server
>>>>>>> 9163cb1d7287745f73f42f64d3e8328970c382fa
server.start();