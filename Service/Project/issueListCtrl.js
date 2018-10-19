appmod.controller("issueListCtrl", function ($scope, $q, $routeParams, UnitServ, ProjectServ, IssueServ, WbsServ, Page, $timeout, MenuServ) {
     Page.setTitle("Issue WBS");
    $scope.param = $routeParams;
    
    $scope.ActiveMenu = "Service > Issue WBS",
     $scope.LinkHome = "/Service/ProjectList";
    var mdObj = { type: 3 }; MenuServ.masterDropDown(mdObj);
    

    INITPromise.then(function (obj) {
        $scope.unitList = [];
        $scope.IssueList = [];
        $scope.WorkerName = obj.USER.Name;
        $scope.CompanyId = obj.COMPANY.Id;
        $scope.CompanyName = obj.COMPANY.Name;
        $scope.reverse = false;
        $scope.projectList = [];
        $scope.GetIssueList();
        $scope.GetProject();
        $scope.GetProjectList();
       // $scope.GetData();
       
        //console.log('IMGHOST', IMGHOST);
        $scope.IMGHOST = IMGHOST;
        $scope.CONTAINERNAME = CONTAINERNAME;
        $scope.DropdownProjectList = [];
    });
    $scope.GetProjectList = function () {
        $scope.$emit("showButterbar", "กำลังโหลดข้อมูล...");
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
                    "href": "/service/project#!/" + p.Id + "/issue",

                };

                $scope.DropdownProjectList.push(obj);
            });
        }
    };
    $scope.GetProject = function () {
        ProjectServ.get($scope.param.projectId).then(function (response) {
            $scope.project = response;

        }, function (error) {
        });
    };
    $scope.GetIssueList = function() {
        IssueServ.getIssueByProject($scope.param.projectId).then(function (response) {
            $scope.IssueList = response;
        });
    };
    $scope.pressFinish = function (issue) {
        issue.DoneTimeStamp = new Date();
        console.log(issue);
        IssueServ.FinishIssue(issue).then(function(response) {
            console.log("response", response);
            if (response.Status.StatusCode == 200) {

                //time out

                var filter = _.findWhere($scope.IssueList, { Id: response.Method.Id });

                $timeout(function() {
                    $scope.IssueList = _.reject($scope.IssueList, function(a) { return a.Id == filter.Id; });
                }, 5000);
          //     console.log('$scope.IssueList ', $scope.IssueList)
            }
        });

    };
   
    $scope.SaveDate = function (issue) {
        
        
        IssueServ.SaveIssue(issue).then(function (response) {
            console.log("response", response);
            //if (response.Status.StatusCode == 200) {
                
            //    $scope.SelectIssue = [];
            //    $scope.InputDate = new Date();
              
            //    $scope.resultList = IssueServ.CalculateDueDate($scope.resultList, response.Method);
              
            //    dueDateModal.$promise.then(dueDateModal.hide);
            //}
            
        }, function (error) {
        });
    };

    $scope.addDeleveryDate = function (item) {
        $scope.SelectAddDeliveryDate = item;
        deliveryDateModal.$promise.then(deliveryDateModal.show);
    };

    $scope.SaveDeliveryDate = function(date) {
        IssueServ.SaveDeliveryDate($scope.SelectAddDeliveryDate.id, date).then(function (response) {

            if (response.Status.StatusCode == 200) {
                
                $scope.InputDeliveryDate = new Date();
               
                $scope.resultList = IssueServ.SetDeliveryDate($scope.resultList, date, $scope.SelectAddDeliveryDate.id);
                //console.log("$scope.resultList", $scope.resultList);

                deliveryDateModal.$promise.then(deliveryDateModal.hide);
            }

        }, function (error) {
        });
    };
});

