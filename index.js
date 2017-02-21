'use strict';
const Server = require('core-server').Server;

// Public
module.exports.startTestService = (name, callback) => {
    let server = null;
    server = new Server(name, null, {types:[]}, {});

    server.init().then(() => {
        server.loadHttpRoutes();
        server.listen().then(() => {
            console.log('Up and running..');
            server.query();
            callback(null, server);
        }).catch((err) => {
            console.log(err);
            callback(err, null);
        });
    }).catch((err) => {
        console.log(err);
        callback(err, null);
    });
};