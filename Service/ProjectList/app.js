var appmod = angular.module("ServiceProjectApp", ['inject']);

appmod.config(function ($routeProvider, $locationProvider) {
    $routeProvider
     .when('/:projectId', {
         templateUrl: '/Content/src/Service/Project/_UnitList.html',
         controller: 'UnitListCtrl'
     })
    .when('/:projectId/unit/:unitId', {
        templateUrl: '/Content/src/Service/Project/_Unit.html',
        controller: 'UnitCtrl'
    });

   
});