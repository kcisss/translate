var appmod = angular.module('IssueApp', ['allNewInject', 'ngRoute', 'angular.filter', 'ngFileUpload']);
appmod.run(function ($rootScope, $route) {
    $rootScope.$on("$routeChangeSuccess", function () {
        document.title = $route.current.title;
    });
});
appmod.config(function ($routeProvider) {
    $routeProvider.when('/projectlist', {
        templateUrl: '/content/src/modules/service/issue/partials/projectlist.html',
        controller: 'ProjectListCtrl',
        title: 'รายการโครงการ - Issue | Service'
    }).when('/project/reunit/:id', {
        templateUrl: '/content/src/modules/service/issue/partials/unitlist.html',
        controller: 'UnitListCtrl',
        title: 'รายการยูนิต - Issue | Service'
    }).when('/project/reunit/:id/:workerID', {
        templateUrl: '/content/src/modules/service/issue/partials/unitlist.html',
        controller: 'UnitListCtrl',
        title: 'รายการยูนิต - Issue | Service'
    }).when('/project/reunit/:id/unit/:reunitId', {
        templateUrl: '/content/src/modules/service/issue/partials/unit.html',
        controller: 'UnitCtrl',
        title: 'รายการ Issue | Service'
    }).when('/project/wbs/:id', {
        templateUrl: '/content/src/modules/service/issue/partials/wbslist.html',
        controller: 'WbsListCtrl',
        title: 'รายการยูนิต - Issue | Service'
    }).when('/project/issue/:id', {
        templateUrl: '/content/src/modules/service/issue/partials/issuelist.html',
        controller: 'IssueListCtrl',
        title: 'รายการยูนิต - Issue | Service'
    }).otherwise({
        redirectTo: '/projectlist'
    });
});