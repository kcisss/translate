var appmod = angular.module('DevApp', ['ngMaterial', 'ngRoute', 'LocalStorageModule']);
appmod.run(["$rootScope", "$location", "localStorageService", function ($rootScope, $location, localStorageService) {
    $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
        if (error === "AUTH_REQUIRED") {
            $location.path("/login");
        } else if (error === "AUTH_NOTREQUIRED") {
            $location.path("/home");
        }
    });
    $rootScope.$on("$routeChangeStart", function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            $rootScope.loggedIn = true;
            $rootScope.CurrUser = authData;
        } else {
            $rootScope.loggedIn = false;
        }
    });
}]);
appmod.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/login", {
        controller: "LoginCtrl",
        templateUrl: "/Content/src/modules/DeveloperCenter/Partials/login.html",
        resolve: {
            "currentAuth": ["Auth", function (Auth) {
                return Auth.$requireSignOut();
            }]
        }
    }).when("/signup", {
        controller: "SignUpCtrl",
        templateUrl: "/Content/src/modules/DeveloperCenter/Partials/signup.html",
        resolve: {
            "currentAuth": ["Auth", function (Auth) {
                return Auth.$requireSignOut();
            }]
        }
    }).when("/home", {
        controller: "HomeCtrl",
        templateUrl: "/Content/src/modules/DeveloperCenter/Partials/home.html",
        resolve: {
            "currentAuth": ["Auth", function (Auth) {
                return Auth.$requireSignIn();
            }]
        }
    }).when("/detail/:id", {
        controller: "detailCtrl",
        templateUrl: "/Content/src/modules/DeveloperCenter/Partials/detail.html",
        resolve: {
            "currentAuth": ["Auth", function (Auth) {
                return Auth.$requireSignIn();
            }]
        }
    }).when("/account", {
        controller: "AccountCtrl",
        templateUrl: "/Content/src/modules/DeveloperCenter/Partials/account.html",
        resolve: {
            "currentAuth": ["Auth", function (Auth) {
                return Auth.$requireSignIn();
            }]
        }
    }).otherwise({
        redirectTo: '/login'
    });
}]);