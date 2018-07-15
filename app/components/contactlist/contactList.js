'use strict'

var template = require('./contactlist.html');

angular
    .module('api.contacts', [])
    .controller('contactListCtrl', contactListCtrl)
    .directive('contactList', contactList);


function contactListCtrl($scope, $rootScope) {
    console.log($scope.contacts);
}

function contactList(apiService, $rootScope) {
    return {
        restrict: 'A',
        templateUrl: template,
        link: function(scope) {
            apiService
                .get('contacts/')
                .then(
                    (resp) => {
                        $rootScope.contacts = resp.data;
                        scope.contacts = $rootScope.contacts;
                    }
                )
        },
    };
}