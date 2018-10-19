appmod.controller('MainCtrl', function ($scope, $routeParams, ProjectServ, MenuServ) {

    $scope.ActiveMenu = "Service > list",
     $scope.LinkHome = "/Service/ProjectList";
    var mdObj = { type: 3 }; MenuServ.masterDropDown(mdObj);
   
    $scope.param = $routeParams;

    INITPromise.then(function (obj) {
        $scope.WorkerName = obj.USER.Name;
        $scope.CompanyId = obj.COMPANY.Id;
        $scope.CompanyName = obj.COMPANY.Name;
        $scope.projectList = [];
        $scope.GetAllProject();
        //console.log('IMGHOST', IMGHOST);
        $scope.IMGHOST = IMGHOST;
        $scope.CONTAINERNAME = CONTAINERNAME;
    });
   


    $scope.GetAllProject = function () {
        $scope.$emit("showButterbar", "กำลังโหลดข้อมูล...");
        ProjectServ.getAll().then(function(response) {
            console.log(response);
            $scope.projectList = response;
        }, function(error) {
        });
        $scope.$emit("hideButterbar", 1000);
    };
});