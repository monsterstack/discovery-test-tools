'use strict';
const Server = require('core-server').Server;
const Promise = require('promise');


const startTestService = (name, callback) => {
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
}

const sideLoadServiceDescriptor = (service, descriptor) => {
    let p = new Promise((resolve, reject) => {
        descriptor.id = uuid.v1();
        if(service.boundProxy) {
            service.getApp().proxy = service.boundProxy;

            service.boundProxy.sideLoadService(descriptor).then(() => {
                return service.boundProxy.table();
            }).then((cache) => {
                console.log(cache);
                resolve(); 
            }).catch((err) => {
                reject(err);
            });
        } else {
            service.boundProxy = new Proxy();
            service.getApp().proxy = service.boundProxy;
            service.boundProxy.sideLoadService(descriptor).then(() => {
                return service.boundProxy.table();
            }).then((cache) => {
                console.log(cache);
                resolve(); 
            }).catch((err) => {
                reject(err);
            });
        }
    });
    return p;
}

// Public
module.exports.startTestService = startTestService;
module.exports.sideLoadServiceDescriptor = sideLoadServiceDescriptor;