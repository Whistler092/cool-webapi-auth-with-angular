/*
This AngularJS service will be responsible for 
    signing up new users, 
    log-in/log-out registered users, 
    and store the generated token in client local storage 
        so this token can be sent with each request to access secure resources on the back-end API
*/

'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {
    var serviceBase = 'http://localhost:64082/';
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    // HTTP POST 
    var _saveRegistration = function (registration) {
        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration)
            .then(function (response) {
                return response;
            });
    };

    /*
        Send HTTP POST request to http://localhost:64082/token it will validate the credentials 
        Si funciona, retornará un access_token y será guardado en el localStorageService
    */
    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });

                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

        return deferred.promise;
    };

    var _logOut = function () {
        localStorageService.remove('authorizationData');
        _authentication.isAuth = false;
        _authentication.userName = "";
    };

    var _fillAuthData = function () {
        var authData = localStorageService.get('authorizationData');
        if(authData)
        {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }
    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;

    return authServiceFactory;
}]);