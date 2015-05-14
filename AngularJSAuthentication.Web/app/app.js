/*
“app.js” is responsible to create modules in applications, 
in our case we’ll have a single module called “AngularAuthApp”, 
we can consider the module as a collection of services, directives, filters 
which is used in the application. 

Each module has configuration block where it gets applied 
to the application during the bootstrap process.
*/

var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar'])

app.config(function ($routeProvider) {
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });
    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });
    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });
    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "/app/views/orders.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });

});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

