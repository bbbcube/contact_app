"use strict"

// Application level requirement
require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material/angular-material.min.js');
require('angular-route');
require('angular-messages');
require('./components/api/apiServices.js');
require('./components/contactlist/contactList.js');
require('./routes/contact/contact.js')
require('./routes/message/message.js')

angular
    .module("contactApp", [
        "ngMaterial",
        "ngRoute",
        "api.service",
        "api.contacts",
        "contactInfo",
        "messageList"
    ])
    .config(config)
    .run(run);

function config($compileProvider, $locationProvider, $routeProvider) {

    $compileProvider.debugInfoEnabled(true);

    // Default to home page if we don't find the route requested
    $routeProvider.otherwise('/');

    // HTML 5 mode
    $locationProvider.html5Mode(true);

}

function run($rootScope, apiService) {
    console.log('Application run()');

    $rootScope.api = apiService
}