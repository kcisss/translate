appmod.controller("issueAndWbsListCtrl", function ($scope, $q, $routeParams, MenuServ,UnitServ, ProjectServ, IssueServ, WbsServ, Page, $modal) {

    $scope.ActiveMenu = "Service > WBS",
    $scope.LinkHome = "/Service/ProjectList";
    var mdObj = { type: 3 }; MenuServ.masterDropDown(mdObj);

    Page.setTitle("Issue WBS");
    $scope.param = $routeParams;
    
    INITPromise.then(function (obj) {
        $scope.WorkerName = obj.USER.Name;
        $scope.CompanyId = obj.COMPANY.Id;
        $scope.CompanyName = obj.COMPANY.Name;
        $scope.unitList = [];
        $scope.IssueList = [];
        $scope.wbsList = [];
        $scope.childrenList = [];
        $scope.resultList = [];
        $scope.SelectIssue = [];
        $scope.SelectAddDeliveryDate = { };
        $scope.InputDate = new Date();
        $scope.InputDeliveryDate = new Date();
        $scope.projectList = [];
        
        $scope.GetProject();
        $scope.GetProjectList();
        $scope.GetData();
        //$scope.GetWbsList();
        //$scope.GetUnitAndIssueForm();
        //$scope.GetIssueForUnitWbs();
        //console.log('IMGHOST', IMGHOST);
        $scope.IMGHOST = IMGHOST;
        $scope.CONTAINERNAME = CONTAINERNAME;
        $scope.DropdownProjectList = [];
    });


    $scope.dropdown = [
       {
           "text": "เลือก App",
           "href": "/"
       },
       {
           "divider": true
       },
       {
           "text": "List Manager",
           "href": "/ListManager/ProjectManager/List"
       },
       {
           "text": "Point of sale",
           "href": "/dashboard/userproject",

       },


        {
            "text": "Service",
            "href": "/Service/ProjectList/"
        }
    ];
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
                    "href": "/service/project#!/" + p.Id + "/wbs",

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

    $scope.GetData = function () {
        var prom = [WbsServ.getAll(), IssueServ.getUnitAndIssueForm($scope.param.projectId), IssueServ.getIssueForUnitWbs($scope.param.projectId)];
        $q.all(prom).then(function (results) {
            var wbsList = results[0];
            var unitFormList = results[1];
            var issueGroupList = results[2];

            $scope.wbsList = WbsServ.sortWbs(wbsList);
            $scope.childrenList = WbsServ.GenerateChildren($scope.wbsList);

            $scope.unitList = _.sortBy(unitFormList, 'code');;

            $scope.IssueList = issueGroupList;

            $scope.resultList = IssueServ.GenerateData($scope.childrenList, $scope.unitList, $scope.IssueList);
        });

    };
    var dueDateModal = $modal({ templateUrl: '/Content/src/modules/Service/Project/_DueDate.html', scope: $scope, show: false, animation: 'am-fade-and-slide-top' });
    var deliveryDateModal = $modal({ templateUrl: '/Content/src/modules/Service/Project/_DeliveryDate.html', scope: $scope, show: false, animation: 'am-fade-and-slide-top' });
    
    $scope.Select = function(rr) {
        if (!_.isUndefined(rr.IsDone)) {
            rr.selected = false;
            return;
       }
        if(!_.isUndefined(rr.UnitId)) {

           $scope.SelectIssue = IssueServ.duplicateSelectList($scope.SelectIssue, rr);
            //if ($scope.SelectIssue.length > 0) {
            //    var find = _.findWhere($scope.SelectIssue, { UnitId: rr.UnitId, WbsId: rr.WbsId });
               
            //    if (!_.isUndefinedNullOrEmpty(find)) {
            //        rr.selected = false;

            //        $scope.SelectIssue = _.reject($scope.SelectIssue, function (s) {
            //            return s.UnitId == rr.UnitId && s.WbsId == rr.WbsId;
            //        });

            //    } else {//ยังไม่มีใน list
            //        rr.selected = true;
            //        $scope.SelectIssue.push({
            //            UnitId: rr.UnitId,
            //            WbsId: rr.WbsId
            //        });
            //    }
            //} else {


            //    rr.selected = true;
            //    $scope.SelectIssue.push({
            //        UnitId: rr.UnitId,
            //        WbsId: rr.WbsId
            //    });
            //}
            //console.log($scope.SelectIssue);
        }
    };

    $scope.plan = function () {
        
        if($scope.SelectIssue.length > 0) {
            dueDateModal.$promise.then(dueDateModal.show);
        } else {
            alert("กรุณาเลือกปัญหา");
        }
       
    };

    $scope.finish = function() {
        if ($scope.SelectIssue.length > 0) {
            
            IssueServ.SaveFinishIssueList($scope.SelectIssue).then(function (response) {
                console.log("response", response);
                if (response.Status.StatusCode == 200) {
                    $scope.SelectIssue = [];
                    $scope.InputDate = new Date();
                    $scope.resultList = IssueServ.SetBgForFinish($scope.resultList, response.Method);
                }

            }, function (error) {
            });
        } else {
            alert("กรุณาเลือกปัญหา");
        }
    };

    $scope.SaveDate = function (date) {
       
        IssueServ.SaveDueDateIssueList($scope.SelectIssue,date).then(function (response) {
          
            if (response.Status.StatusCode == 200) {
                
                $scope.SelectIssue = [];
                $scope.InputDate = new Date();
                //angular.forEach(response.Method,function (result) {
                //    var find = _.findWhere($scope.IssueList, { UnitId: result.UnitId, WbsId: result.WbsId });
                //    find.duedate = result.dueDate;
                //});
                //$scope.resultList = IssueServ.GenerateData($scope.childrenList, $scope.unitList, $scope.IssueList);
                $scope.resultList = IssueServ.CalculateDueDate($scope.resultList, response.Method);
                //console.log("$scope.resultList", $scope.resultList);
                
                dueDateModal.$promise.then(dueDateModal.hide);
            }
            
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

moment.locale('en', {
    relativeTime: {
        future: "%s",
        past: "-%s ",
        s: "seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "1 d",
        dd: "%d d",
        M: "1 m",
        MM: "%d m",
        y: "1 y",
        yy: "%d y"
    }
});