"use strict"

const messageListTemplate = require('./messageList.html');

angular
    .module('messageList', ['ngMessages'])
    .config(config)
    .controller('messageCtrl', messageCtrl);

function config($routeProvider) {
    $routeProvider.when('/messages/', {
        templateUrl: messageListTemplate,
        controller: 'messageCtrl',
        controllerAs: 'vm',
    });
}

function messageCtrl(apiService) {

    let vm = this;

    apiService
        .get('messages')
        .then(
            (resp) => {
                vm.messages = resp.data;
            }
        )
}