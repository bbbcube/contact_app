"use strict"

const contactInfoTemplate = require('./contactinfo.html')
const createContactTemplate = require('./createcontact.html')

angular
    .module('contactInfo', ['ngMessages'])
    .config(config)
    .controller('contactInfoCtrl', contactInfoCtrl)
    .controller('contactCtrl', contactCtrl);

function config($routeProvider) {
    $routeProvider.when('/contact/', {
        templateUrl: createContactTemplate,
        controller: 'contactCtrl',
        controllerAs: 'vm',
    });
    $routeProvider.when('/contact/:Index', {
        templateUrl: contactInfoTemplate,
        controller: 'contactInfoCtrl',
        controllerAs: 'vm',
    });
}

function contactCtrl($rootScope, apiService) {
    let vm = this;
    vm.contact = {};
    vm.saveContactDetails = saveContactDetails;

    function saveContactDetails() {
        apiService
            .post('contacts', { data: vm.contact }) 
            .then(
                () => {
                    $rootScope.contacts.push(vm.contact);
                },
                () => {
                    console.log('error', 'Contact could not save');
                }
            )
    }
}

function contactInfoCtrl($rootScope, apiService, $mdDialog, $routeParams, $location) {
    
    // scope variables
    let vm = this;
    vm.contactEdit = false;
    // let cIndex = $routeParams.Index;
    // if (typeof $routeParams.Index === 'undefined') {
    //     cIndex = 0;
    // }
    vm.contact = $rootScope.contacts[$routeParams.Index];

    // scope functions
    vm.editContactInfo = editContactInfo;
    vm.sendMessage = sendMessage;
    vm.saveChanges = saveChanges;
    vm.cancelEditing = cancelEditing;
    vm.deleteContact = deleteContact;

    function editContactInfo() {
        vm.contactEdit = true;
        vm.cont = angular.copy(vm.contact);
    }

    function saveChanges() {
        apiService
            .post('contacts', { data: vm.cont })
            .then(
                () => {
                    $rootScope.contacts[$routeParams.Index] = vm.contact;
                    vm.contactEdit = false;
                },
                () => {
                    console.log('error', 'Contact could not save changes');
                }
            )
    }

    function cancelEditing(dirty, ev) {
        apiService.close(dirty, ev)
            .then(function () {
                vm.contactEdit = false;
            })
    }

    function deleteContact() {

        apiService
            .delete('contacts/' + vm.contact._id.$oid)
            .then(
                (resp) => {
                    $rootScope.contacts.splice($routeParams.Index, 1);
                    $location.path('/');
                }
            )
    }

    function sendMessage(ev) {
        $mdDialog.show({
            templateUrl: 'routes/contact/dialogs/sendMessage.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.,
            controller: messageCtrl
        })
        .then(function (data) {
            console.log(data);
            alert("Message Succesfully Sent");
        }, function (error) {
            console.log(error);
        });
    }

    function messageCtrl($scope, $mdDialog) {
        let otp = Math.floor(1000 + Math.random() * 900000);
        $scope.message = "Hi.  Your  OTP  is:  " + otp;

        $scope.sendMessage = () => {
            let data = {
                'message' : $scope.message,
                'otp': otp,
                'mobile': vm.contact.mobile
            };

            apiService
                .post('messages', {data: data})
                .then(
                    (resp) => {
                        if (resp.data.error == "ok") {
                            $mdDialog.hide(resp.data.data);                            
                        } else {
                            $mdDialog.cancel(resp.data.error);
                        }
                    },
                    (error) => {
                        $mdDialog.cancel("Unable to send message:" + error.data);
                    }
                )
        };

        $scope.cancel = (dirty, ev) => {
            apiService.close(dirty, ev)
            .then(function () {
                $mdDialog.cancel(false);
            })
        }
    }
}