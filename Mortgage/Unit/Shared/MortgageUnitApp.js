var mortgageUnitApp = angular.module('MortgageUnitApp', ['allNewInject', 'LocalStorageModule', 'countTo']);

mortgageUnitApp.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/Content/src/modules/Mortgage/Unit/Partials/Index.html',
        controller: 'UnitListCtrl'
    });
});