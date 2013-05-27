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
server.start();