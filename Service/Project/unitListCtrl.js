appmod.controller("UnitListCtrl", function ($scope, $routeParams, MenuServ, UnitServ, ProjectServ, IssueServ, WbsServ, Page) {
    $scope.ActiveMenu = "Service > unit list",
    $scope.LinkHome = "/Service/ProjectList";
    var mdObj = { type: 3 }; MenuServ.masterDropDown(mdObj);
    Page.setTitle("Unit List");
    $scope.param = $routeParams;
    $scope.param.workerId = null;
    var skip = 0;
    var take = 20;
    var notloadmoreitem = false;
    INITPromise.then(function (obj) {
        $scope.WorkerName = obj.USER.Name;
        $scope.CompanyId = obj.COMPANY.Id;
        $scope.CompanyName = obj.COMPANY.Name;
        $scope.unitList = [];
        $scope.IssueFormList = [];
        $scope.wbsList = [];
        $scope.parent = [];
        $scope.project = "";
        $scope.projectList = [];
        //$scope.GetUnitByProject();  
        $scope.GetProject();
        $scope.GetProjectList();
        $scope.GetUnitForService();
        $scope.GetWbsList();
        //console.log('IMGHOST', IMGHOST);
        $scope.IMGHOST = IMGHOST;
        $scope.CONTAINERNAME = CONTAINERNAME;
        $scope.DropdownProjectList = [];
    });
    $scope.GetProjectList = function () {
        $scope.$emit("showButterbar", "กำลังโหลดข้อมูลโครงการ...");
        ProjectServ.getAll().then(function (response) {
            $scope.projectList = response;
            $scope.CreateDropdownProjectList();
        }, function (error) {
        });
        $scope.$emit("hideButterbar", 1000);
    };
    $scope.CreateDropdownProjectList = function () {
        $scope.DropdownProjectList = [];
        if ($scope.projectList.length > 0) {
            angular.forEach($scope.projectList, function (p) {
                var obj = {
                    "text": p.Name,
                    "href": "/service/project#!/" + p.Id + "/",
                };
                $scope.DropdownProjectList.push(obj);
            });
        }
    };
    $scope.GetWbsList = function () {
        WbsServ.getAll().then(function (response) {
            //console.log(response);
            $scope.wbsList = response;
        }, function (error) {
        });
    };
    $scope.WorkerList = [{
        name: "ทุกผู้ดูแล"
    }];
    $scope.GetUnitForService = function () {
        $scope.$emit("showButterbar", "กำลังโหลดข้อมูลโครงการ...");
        UnitServ.getUnitForService($scope.param).then(function (response) {
            $scope.WorkerList = [{
                name: "ทุกผู้ดูแล"
            }];
            $scope.workerNames = _.reject(
                                    _.keys(
                                        _.indexBy(response, function (res) {
                                            return res.WorkerName;
                                        })), function (r) {
                                            return r == "null";
                                        });
            angular.forEach($scope.workerNames, function (workerName) {
                $scope.WorkerList.push({
                    id: _.findWhere(response, { WorkerName: workerName }).WorkerId,
                    name: workerName
                });
            });
            $scope.unitList = response;
            for (var i = 0; i < $scope.unitList.length; i++) {
                frmNw = moment($scope.unitList[i].LastModifiedTimestamp).fromNow();
                $scope.unitList[i].LastModifiedTimestamp = (frmNw != "Invalid date") ? frmNw : null;
            }
            $scope.GetIssueFormByProject();
        }, function (error) {
        });
    };
    $scope.ChangeWorker = function () {
        $scope.unitList = [];
        $scope.$emit("showButterbar", "กำลังโหลดข้อมูลโครงการ...");
        UnitServ.getUnitForService($scope.param).then(function (response) {
            $scope.unitList = response;
            for (var i = 0; i < $scope.unitList.length; i++) {
                frmNw = moment($scope.unitList[i].LastModifiedTimestamp).fromNow();
                $scope.unitList[i].LastModifiedTimestamp = (frmNw != "Invalid date") ? frmNw : null;
            }
            $scope.GetIssueFormByProject();
        });
    }
    $scope.GetProject = function () {
        ProjectServ.get($scope.param.projectId).then(function (response) {
            $scope.project = response;
        }, function (error) {
        });
    };
    $scope.GetIssueFormByProject = function () {
        IssueServ.getIssueFormByProject($scope.param.projectId).then(function (response) {
            //console.log(response)
            $scope.IssueFormList = response;
            $scope.MapIssueFormToUnit();
            $scope.$emit("hideButterbar", 1000);
        }, function (error) {
        });
    };
    $scope.MapIssueFormToUnit = function () {
        angular.forEach($scope.IssueFormList, function (s) {
            var filterUnit = _.findWhere($scope.unitList, { Id: s.REUnitId });
            if (_.isUndefinedNullOrEmpty(filterUnit)) {
                filterUnit = {};
            }
            if (_.isUndefinedNullOrEmpty(filterUnit.IssueFormList)) {
                filterUnit.IssueFormList = [];
            }
            filterUnit.IssueFormList.push(s);
        });
    };
});