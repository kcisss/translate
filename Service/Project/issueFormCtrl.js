appmod.controller("issueFormCtrl", function ($rootScope, $scope, $routeParams, UnitServ, IssueServ, $modal, WorkerServ) {
    //$scope.msg = "Hey! Issue";
    $scope.param = $routeParams;
    // console.log('$scope.param', $scope.param);
    //$scope.obj = {
    //    date: new Date(),
    //    date2:null
    //};
    //console.log($scope.obj.date,_.isUndefined($scope.obj.date), _.isUndefinedNullOrEmpty($scope.obj.date));
    //console.log($scope.obj.date2,_.isUndefined($scope.obj.date2), _.isUndefinedNullOrEmpty($scope.obj.date2));
    INITPromise.then(function (obj) {
        $scope.WorkerId = obj.USER.WID;
        $scope.WorkerName = obj.USER.Name;
        $scope.CompanyId = obj.COMPANY.Id;
        $scope.CompanyName = obj.COMPANY.Name;
        $scope.IssueForm = [];
        $scope.issueFormLineList = [];
        $scope.TypeList = [];
        $scope.IssueList = [];
        $scope.CreateIssueForm();
        //console.log('IMGHOST', IMGHOST);
        $scope.IMGHOST = IMGHOST;
        $scope.CONTAINERNAME = CONTAINERNAME;
        $scope.DisplayDate = true;
        $scope.TypeList.push({
            name: " ความคืบหน้า",
            value: 0
        }, {
            name: " ต้องการแก้ไข",
            value: 1
        }, {
            name: " ดีเยี่ยม",
            value: 2
        }, {
            name: " ขอข้อมูล",
            value: 3
        }, {
            name: " จุดบกพร่อง",
            value: 4
        });
        $scope.getWorker($scope.param.projectId);
    });
    var issueModal = $modal({ templateUrl: '/Content/src/modules/Service/Project/_Issue.html', scope: $scope, show: false, animation: 'am-fade-and-slide-top' });
    $scope.CreateIssueForm = function () {
        $scope.$emit("showButterbar", "กำลังโหลดข้อมูล...");
        //check IssueForm exsit && save newIssueForm
        UnitServ.CheckIssueForm($scope.param.stageId, $scope.param.unitId).then(function (response) {
            // console.log("response", response);
            $scope.IssueForm = response.issueForm;
            $scope.IssueList = response.issue;
            //group issueFormLine
            $scope.DisplayIssueFormLine();
        });
        $scope.$emit("hideButterbar", 1000);
    };
    $scope.DisplayIssueFormLine = function () {
        $scope.issueFormLineList = [];
        var parent = _.sortBy(_.filter($scope.IssueForm.IssueFormLines, function (item) {
            return item.ParentWbsId == null;
        }), 'WbsCode');
        angular.forEach(parent, function (p) {
            var issueFormLine = {
                parent: {},
                children: []
            };
            issueFormLine.parent = p;
            issueFormLine.children = _.sortBy(_.filter($scope.IssueForm.IssueFormLines, function (item) {
                return item.ParentWbsId == p.WbsId;
            }), 'Order');
            //issueList
            angular.forEach(issueFormLine.children, function (c) {
                var issueList = _.filter($scope.IssueList, function (s) {
                    return s.IssueFormLineId == c.Id;
                });
                c.IssueList = issueList;
            });
            $scope.issueFormLineList.push(issueFormLine);
        });
        //console.log("issueFormLineList", $scope.issueFormLineList);
    };
    $scope.getWorker = function (projectId) {
        $scope.Worker = [];
        WorkerServ.getWorkerIssue(projectId).then(function (data) {
            $scope.Worker = data;
        });
    },
    $scope.AddChild = function (parent, child) {
        $scope.header = child.WbsCode + ":" + child.WbsName;
        $scope.Issue = IssueServ.newIssue(parent, child, $scope.IssueForm);
        $scope.Issue.WorkerId = $scope.WorkerId;
        $scope.Issue.WorkerName = $scope.WorkerName;
        if ($scope.Worker.length > 0) {
            var find = _.find($scope.Worker, function (e) { return e.Id == $scope.WorkerId; });
            //$scope.Issue.WorkerCode = find.Code;
            issueModal.$promise.then(issueModal.show);
        } else {
            alert('คุณไม่ใช่ Admin หรือ SiteAdmin!');
        }
    };
    $scope.saveIssue = function (issue) {
        var isValid = IssueServ.validate(issue);
        if (isValid.notValid) {
        }
       // console.log("issueSave", issue);
        IssueServ.SaveIssue(issue).then(function (response) {
            $rootScope.$emit("showButterbar", 'บันทึก Issue แล้วเรียบร้อย', "success");
            //  console.log("response", response);
            if (response.Status.StatusCode == 200) {
                // if (response.Method.IsNew === true) { //create
                response.Method.IsNew = false;
                $scope.AddIssueToChild(response.Method);
                $scope.DisplayDate = true;
                // }
            }
            $scope.$emit("hideButterbar", 1000);
            issueModal.$promise.then(issueModal.hide);
        });
    };
    $scope.AddIssueToChild = function (issue) {
        var filterChild = _.findWhere($scope.IssueForm.IssueFormLines, { Id: issue.IssueFormLineId });
        if (_.isUndefinedNullOrEmpty(filterChild.IssueList)) {
            filterChild.IssueList = [];
        }
        if (filterChild.IssueList.length > 0) {
            var findIssueList = _.findWhere(filterChild.IssueList, { Id: issue.Id });
            if (_.isUndefinedNullOrEmpty(findIssueList)) { //not exsit in issueList
                filterChild.IssueList.push(issue);
            }
        } else {
            filterChild.IssueList.push(issue);
        }
    };
    $scope.DeleteIssue = function (issue, child, index) {
        if (issue.IsNew === true) {
            child.IssueList = _.reject(child.IssueList, function (s) {
                return s.Id == issue.Id;
            });
        } else {
            var answer = confirm("ท่านต้องการลบรายการนี้หรือไม่?");
            if (answer) {
                IssueServ.DeleteIssue(issue.Id).then(function (result) {
                    console.log(result);
                    if (result.Status.StatusCode == 200) {
                        child.IssueList = _.reject(child.IssueList, function (s) {
                            return s.Id == issue.Id;
                        });
                    }
                });
            }
        }
    };
    $scope.EditIssue = function (issue) {
        $scope.Issue = issue;
        issueModal.$promise.then(issueModal.show);
    };
    $scope.selectType = function (type, issue) {
        if (type.value == 0 || type.value == 2) {
            $scope.DisplayDate = false;
            issue.DueDate = null;
        } else {
            $scope.DisplayDate = true;
            //issue.DueDate = new Date();
            issue.IsDone = false;
        }
    };
    $scope.SetWorker = function (issue) {
        var find = _.find($scope.Worker, function (e) { return e.Id == issue.WorkerId; });
        //issue.WorkerCode = find.Code;
        issue.WorkerName = find.Name;
    };
});