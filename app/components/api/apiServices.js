"use strict"

angular
    .module('api.service', [])
    .factory('apiService', apiService);

function apiService($q, $location, $http, $mdDialog) {

    var endpoint = '';

    var api = {};
    api.get = get;
    api.put = put;
    api.post = post;
    api.delInit = deleteInitiate;
    api.close = closeDialog;
    api.delete = deleteRequest;
    api.httpBSON = httpBSON;

    return api;

    // API GET Request
    function get(url, params) {

        // Default headers
        var headers = {
            'Content-Type': 'application/json',
        };

        // If we are passed a string in "url" we treat this as a simple
        // API get call with default settings. If url is not a string, it
        // should be an object containing our settings.
        var req = {
            method: 'GET',
            cache: true,
            params: params,
            headers: headers
        };

        return request(url, req);
    }

    // API POST Request
    function post(url, data) {

        // Default headers
        var headers = {
            'Content-Type': 'application/json',
        };

        // If we are passed a string in "url" we treat this as a simple
        // API get call with default settings. If url is not a string, it
        // should be an object containing our settings.
        var req = {
            method: 'POST',
            cache: true,
            headers: headers,
            data: data
        };

        return request(url, req);
    }

    // API PUT Request
    function put(url, data) {

        // Default headers
        var headers = {
            'Content-Type': 'application/json',
        };

        // If we are passed a string in "url" we treat this as a simple
        // API get call with default settings. If url is not a string, it
        // should be an object containing our settings.
        var req = {
            method: 'PUT',
            cache: true,
            headers: headers,
            data: data
        };

        return request(url, req);
    }

    // Cancel edited form
    function closeDialog(edited) {
        let q = $q.defer();

        if (edited) {
            var con = confirm("Would you like to discard changes?");
            if (con) {
                q.resolve(true);
            } else {
                q.reject(false);
            }
        } else {
            q.resolve(true);
        }

        return q.promise;
    }

    // API DELETE initiate
    function deleteInitiate(ev) {
        let q = $q.defer();
        
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete this?')
            .ariaLabel('Comfirm Delete Action')
            .targetEvent(ev)
            .ok('Please do it!')
            .cancel('No');
    
        $mdDialog.show(confirm).then(function() {
            q.resolve(true);
        }, function() {
            q.reject(false);
        });

        return q.promise;
    }

    // API DELETE Request
    function deleteRequest(url, data) {

        // Default headers
        var headers = {
            'Content-Type': 'application/json',
        };

        // If we are passed a string in "url" we treat this as a simple
        // API get call with default settings. If url is not a string, it
        // should be an object containing our settings.
        var req = {
            method: 'DELETE',
            cache: false,
            headers: headers,
            data: data
        };

        return request(url, req);
    }

    // API Request
    function request(url, req) {
        // Set a simple url endpoint
        req.url = '/' + url;

        // Grab the endpoint and call it
        return getDomain().then(function(endpoint) {
            req.url = endpoint + req.url;
            return httpBSON(req);
        });
    }

    // Post-process incoming data to fixup Mongo BSON style values
    function httpBSON(req) {

        return $q(function(resolve, reject) {

            $http(req)
            .then(function(resp) {
                // Check for Mongo BSON types and fix them up
                function fixup(obj) {
                    var k;
                    var has = Object.prototype.hasOwnProperty.bind(obj);
                    for (k in obj) {
                        if (has(k)) {
                            // Dates to Javascript native Date
                            if (k == '$date') {
                                obj[k] = new Date(obj[k]);
                            }
                            // Recursively
                            if (typeof obj[k] == 'object') {
                                fixup(obj[k]);
                            }
                        }
                    }
                }
                // Fixup data
                fixup(resp.data);
                // Return
                resolve(resp);
            })
            .catch(function(resp) {
                reject(resp);
            });

        });
    }

    // Determine the correct API endpoint to use
    function getDomain() {

        return $q(function(resolve, reject) {

            if (endpoint != '') {
                resolve(endpoint);
                return;
            }
            // Yes, so use it
            endpoint = LOCAL_API;
            resolve(LOCAL_API);
            
        });
    }
}