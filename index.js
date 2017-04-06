'use strict';
const Server = require('core-server').Server;
const Promise = require('promise');
const uuid = require('node-uuid');
const Proxy = require('discovery-proxy').Proxy;

const startTestService = (name, options, callback) => {
    let server = null;
    server = new Server(name, null, {types:[]}, options);

    server.init().then(() => {
        server.loadHttpRoutes();
        server.listen().then(() => {
            server.query();
            callback(null, server);
        }).catch((err) => {
            callback(err, null);
        });
    }).catch((err) => {
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