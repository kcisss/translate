appmod.controller('MainCtrl', function ($scope, $routeParams, MenuServ, WorkerServ) {
    $scope.msg = "Hey! Main";
    $scope.param = $routeParams;
    $scope.ActiveMenu = "Service > list",
    $scope.LinkHome = "/Service/ProjectList";
    var mdObj = { type: 3 }; MenuServ.masterDropDown(mdObj);
    INITPromise.then(function (obj) {
        $scope.WorkerName = obj.USER.Name;
        $scope.CompanyId = obj.COMPANY.Id;
        $scope.CompanyName = obj.COMPANY.Name;
        $scope.IMGHOST = IMGHOST;
        //console.log('IMGHOSTjs', IMGHOST);
        $scope.CONTAINERNAME = CONTAINERNAME;
    });
    //$scope.GetAllUnit = function() {
    //};
});