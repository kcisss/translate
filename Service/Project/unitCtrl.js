appmod.controller("UnitCtrl", function ($q, $scope, $routeParams, UnitServ, $modal, IssueServ,
    ProjectServ, $mdBottomSheet, $location, $timeout, Page, MenuServ, WorkerServ, $popover) {
    $scope.ActiveMenu = "Service > unit ",
    $scope.LinkHome = "/Service/ProjectList";
    var mdObj = { type: 3 }; MenuServ.masterDropDown(mdObj);
    Page.setTitle("Unit");
    $scope.param = $routeParams;
    INITPromise.then(function () {
        $scope.unit = [];
        $scope.unitList = [];
        $scope.Comment = "";
        $scope.WorkFlow = [];
        $scope.project = [];
        $scope.projectList = [];
        $scope.Issue = [];
        // $scope.uploadPhotoIssue = {};
        $scope.GetUnitById();
        $scope.customer = {};
        $scope.GetProject();
        $scope.GetProjectList();
        $scope.GetUnitList();
        $scope.filter = 1;
        //console.log('IMGHOST', IMGHOST);
        $scope.IMGHOST = IMGHOST;
        $scope.CONTAINERNAME = CONTAINERNAME;
        //console.log('CONTAINERNAME', CONTAINERNAME);
        $scope.linkNotDone = true;
        $scope.linkOverDueDate = false;
        $scope.linkAll = false;
        $scope.DropdownProjectList = [];
        $scope.DropdownProjectList = [];
        $scope.GetIssueByWork();
        WorkerServ.getById(USER.WID).then(function (worker) {
            $scope.Avatar = (worker.ProfilePicture) ? worker.ProfilePicture : 'http://fc07.deviantart.net/fs70/i/2012/014/1/4/avatar_icon__d_by_sweetcandyteardrop-d4mdscd.png';
        });
    });
    $scope.OrderCommentSortByDateTime = function (val) {
        //เรียงใหม่ตามเวลา
        var issueActSortByTime = _.sortBy(val, function (issue) { return issue.CreateTimeStamp; });
        val = [];
        val = issueActSortByTime;
        var commentIssue = _.findWhere(val, { Note: null });
        //ตัดคอมเม้น
        val = _.reject(val, function (issue) { return issue.Note == null });
        //เอาคอมเม้นมาต่อท้ายใหม่
        val.push(commentIssue);
        return val;
    };
    $scope.GetIssueByWork = function () {
        // console.info($location.search());
        if ($location.search().work == 'overdue') {
            $scope.GetIssue(2)
        } else {
            $scope.GetIssue(1)
        }
    };
    $scope.GetUnitById = function () {
        $scope.$emit("showButterbar", "กำลังโหลดข้อมูลยูนิต...");
        UnitServ.get($scope.param.unitId).then(function (response) {
            $scope.unit = response;
        }, function (error) { });
        $scope.$emit("hideButterbar", 1000);
    };
    $scope.GetWorkFlow = function () {
        UnitServ.getWorkFlow(28).then(function (response) {
            //console.log(response);
            $scope.WorkFlow = response;
        }, function (error) { });
    };
    $scope.GetProject = function () {
        ProjectServ.get($scope.param.projectId).then(function (response) {
            $scope.project = response;
        }, function (error) { });
    };
    $scope.GetProjectList = function () {
        ProjectServ.getAll().then(function (response) {
            $scope.projectList = response;
            $scope.CreateDropdownProjectList();
        }, function (error) { });
    };
    $scope.GetUnitList = function () {
        UnitServ.getUnitForService($scope.param).then(function (response) {
            //console.log('  $scope.unitList', response);
            $scope.unitList = response;
            $scope.CreateDropdownUnitList();

        }, function (error) { });
    };
    $scope.GetIssue = function (filter) {
        //    console.log('filter', filter)
        $scope.filter = filter;
        $scope.ChangeLink();
        $scope.Issue = [];
        IssueServ.getIssueFormByProjectAndUnit($scope.param.projectId, $scope.param.unitId, filter).then(function (response) {
            angular.forEach(response, function (issue) {
                //    console.log("issue", issue);
                issue.DisplayCreateDate = moment(issue.CreateTimeStamp, "YYYYMMDDhhmm").fromNow();
                if (_.isUndefinedOrNull(issue.DoneTimeStamp)) { //isDoneDate null
                    issue.DisplayIsDone = false;
                } else {
                    issue.DisplayIsDoneDate = moment(issue.DoneTimeStamp).format("DD/MM/YYYY");
                    issue.DisplayIsDone = true;
                    $scope.GenerateDisplayDate(issue);
                }
                if (_.isUndefinedOrNull(issue.DueDate)) { //duedate null
                    issue.DisplayDueDateNull = true;
                    issue.DisplayDueDate = "";
                    //moment(issue.DueDate, "YYYYMMDD").fromNow();
                    //issue.showFinish = false;
                } else {
                    var now = new Date();
                    var result = now <= moment(issue.DueDate);
                    if (result) {
                        issue.DisplayDueDateBefore = true;
                        //issue.showFinish = true;
                    } else {
                        issue.DisplayDueDateover = true;
                        //issue.showFinish = true;
                    }
                    //issue.DisplayDueDate = moment(issue.DueDate, "YYYYMMDD").fromNow();
                    // issue.DisplayDueDate.split(" ");
                    issue.DisplayDueDate = $scope.getRemainDate(moment(issue.DueDate));
                    parseInt([issue.DisplayDueDate][0])
                    //issue.DisplayDueDate = moment() < moment(issue.DueDate).add('hours', 22) && moment() ? issue.DisplayDueDate = moment(issue.DueDate, "YYYYMMDD").fromNow() : issue.DisplayDueDate = 'วันนี้';
                }
                if (issue.IssueActivities.length > 0) {
                    angular.forEach(issue.IssueActivities, function (a) {
                        //console.log(a.CreateTimeStamp);
                        //console.log(moment(a.CreateTimeStamp).fromNow());
                        a.DisplayCreateDate = moment(a.CreateTimeStamp).fromNow();
                    });
                    issue.IssueActivities.push(IssueServ.newIssueActivity(issue, null));
                } else {
                    issue.IssueActivities.push(IssueServ.newIssueActivity(issue, null));
                }
                issue.IssueActivities = $scope.OrderCommentSortByDateTime(issue.IssueActivities);
                //console.log(issue);
                $scope.Issue.push(issue);
            });
        }, function (error) { });
    };
    $scope.getRemainDate = function (duedate) {
        var remainDate = moment(duedate).fromNow();
        var array = remainDate.split(" ")
        if (_.contains(array, 'd')) {
            return _.contains(array, 'd') ? remainDate : parseInt(array[0]) > 0 ? 'เหลืออีก 1 วัน' : 'เหลืออีก 0 วัน';
        } else if (_.contains(array, 'm')) {
            return array[0] + " เดือน";
        }
    }
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
        // console.log("$scope.DropdownProjectList", $scope.DropdownProjectList);
    };
    $scope.CreateDropdownUnitList = function () {
        $scope.DropdownUnitList = [];
        if ($scope.unitList.length > 0) {
            angular.forEach($scope.unitList, function (p) {
                var obj = {
                    text: p.unitCode,
                    "href": "#!/" + $scope.param.projectId + "/unit/" + p.unitId,
                };
                $scope.DropdownUnitList.push(obj);
            });
        }
        if (!_.isEmpty($scope.unit)) {
            var unitInfo = UnitServ.getCustomer($scope.unitList, $scope.unit);
            $scope.customer = {
                id: unitInfo.Customer,
                name: unitInfo.CustomerName,
                phone: unitInfo.CustomerContact
            };
            //console.log(" $scope.customer", $scope.customer);
        }
        // console.log("$scope.DropdownUnitList", $scope.DropdownUnitList);
    };
    $scope.showGridBottomSheet = function ($event) {
        UnitServ.param = $scope.param;
        var option = {
            templateUrl: '/Content/src/modules/Service/Project/newissue-options.html',
            controller: 'newissueOptionCtrl',
            targetEvent: $event
        };
        //  console.log('option', option);
        $mdBottomSheet.show(option).then(function (clickedItem) {
            $mdBottomSheet.hide();
        });
    };
    $scope.ChangeLink = function () {
        if ($scope.filter == 1) {
            $scope.linkNotDone = true;
            $scope.linkOverDueDate = false;
            $scope.linkAll = false;
        } else if ($scope.filter == 2) {
            $scope.linkNotDone = false;
            $scope.linkOverDueDate = true;
            $scope.linkAll = false;
        } else {
            $scope.linkNotDone = false;
            $scope.linkOverDueDate = false;
            $scope.linkAll = true;
        }
    };
    $scope.SaveIssueAct = function (issue, act) {
        IssueServ.SaveIssueAct(act).then(function (response) {
            //   console.log("response", response);
            if (response.Status.StatusCode == 200) {
                var filter = _.findWhere(issue.IssueActivities, {
                    Id: response.Method.Id
                });
                filter.DisplayCreateDate = moment(response.Method.CreateTimeStamp).fromNow();
                filter.IsNew = false;
                issue.IssueActivities.push(IssueServ.newIssueActivity(issue, null));
            }
        });
    };
    $scope.EditAct = function (issue, act) {
        var filter = _.findWhere(issue.IssueActivities, {
            IsNew: true,
            Note: null
        });
        issue.IssueActivities = _.reject(issue.IssueActivities, function (a) {
            return a.Id == filter.Id;
        });
        act.IsNew = true;
    };
    $scope.pressFinish = function (issue) {
        IssueServ.FinishIssue(issue).then(function (response) {
            //  console.log("response", response);
            if (response.Status.StatusCode == 200) {
                issue.IsDone = response.Method.IsDone;
                issue.DoneTimeStamp = response.Method.DoneTimeStamp;
                $scope.GenerateDisplayDate(issue);
                issue.DisplayIsDoneDate = moment(issue.DoneTimeStamp).format("DD/MM/YYYY");
                issue.DisplayIsDone = true;
                if ($scope.filter == 1 || $scope.filter == 2) { //เอาออกจาก list
                    //time out
                    var filter = _.findWhere($scope.Issue, {
                        Id: response.Method.Id
                    });
                    $timeout(function () {
                        $scope.Issue = _.reject($scope.Issue, function (a) {
                            return a.Id == filter.Id;
                        });
                    }, 5000);
                }
            }
        });
    };
    $scope.GenerateDisplayDate = function (issue) {
        var resultDate = moment(issue.DoneTimeStamp) < moment(issue.DueDate);
        // console.log("resultDate", resultDate);
        if (resultDate) { //before duedate
            var resultDate1 = moment(issue.DoneTimeStamp) == moment(issue.DueDate);
            if (resultDate1) {
                issue.DisplayDueDateDone = "พอดีกำหนด";
            } else {
                issue.DisplayDueDateDone = "ก่อนกำหนด" + " " + moment(issue.DoneTimeStamp).from(issue.DueDate, true);
            }
        } else { // over duedate
            issue.DisplayDueDateDone = "เกินกำหนด" + " " + moment(issue.DoneTimeStamp).from(issue.DueDate, true);
        }
    };
    //$scope.onFileSelect = function ($files, issue) {
    //    IssueServ.uploadIssuePhotoBlob($files, issue).then(function (result) {
    //        if (result.Status.StatusCode == 200) {
    //            //var i = _.findWhere($scope.Issue, { Id: result.Method.Id });
    //            // console.log(i);
    //            issue.Picture = result.Method.Picture;
    //            location.reload();
    //        }
    //    });
    //};
    //$scope.uploadPhoto = function (index) {
    //    $("#uploadPhoto" + index).click();
    //};
    //var ImgUploadPopover;
    //$scope.showPopoverTwo = function (item) {
    //    $scope.issueModel = item;
    //    ImgUploadPopover = $popover($('#editImg'), {
    //        title: "เปลี่ยนรูป",
    //        trigger: 'manual',
    //        placement: 'bottom',
    //        templateUrl: '/Content/src/modules/Shared/uploadphotomenutwo.tpl.html',
    //        animation: 'am-fade',
    //        scope: $scope
    //    });
    //    ImgUploadPopover.$promise.then(ImgUploadPopover.toggle);
    //};
    //$scope.hidePopoverTwo = function () {
    //    ImgUploadPopover.$promise.then(ImgUploadPopover.hide);
    //};
    $scope.selectFileTwo = function (file, item) {
        $scope.issueModel = item;
        if (file != null) {
            IssueServ.compressFile(file).then(function (data) { //compress img file 
                $scope.compressImgTwo = data;
                //$scope.hidePopoverTwo();
                IssueServ.uploadIssuePhotoBlob(file, $scope.issueModel).then(function (result) {
                    if (result.Status.StatusCode == 200) {
                        //var i = _.findWhere($scope.Issue, { Id: result.Method.Id });
                        // console.log(i);
                        //issue.Picture = result.Method.Picture;
                        location.reload();
                    }
                });
            });
        }
    };
    //$scope.viewFullImg = function () {
    //    var FullImgPrev = $modal({
    //        templateUrl: '/Content/src/modules/Shared/_viewFullImage.html',
    //        scope: $scope,
    //        show: false,
    //        animation: 'am-fade-and-scale',
    //        backdrop: 'static'
    //    });
    //    FullImgPrev.$promise.then(FullImgPrev.show);
    //};
});
appmod.controller('newissueOptionCtrl', function ($scope, $mdBottomSheet, UnitServ) {
    $scope.param = UnitServ.param;
    UnitServ.getWorkFlow(28).then(function (response) {
        // console.log(response);
        $scope.WorkFlow = response;
    }, function (error) { });
    $scope.listItemClick = function () {
        $mdBottomSheet.hide();
    };
});
//window.addEventListener("DOMContentLoaded", function () {
//    // Grab elements, create settings, etc.
//    var canvas = document.getElementById("canvas"),
//      context = canvas.getContext("2d"),
//      video = document.getElementById("video"),
//      videoObj = { "video": true },
//      errBack = function (error) {
//          console.log("Video capture error: ", error.code);
//      };
//    // Put video listeners into place
//    if (navigator.getUserMedia) { // Standard
//        navigator.getUserMedia(videoObj, function (stream) {
//            video.src = stream;
//            video.play();
//        }, errBack);
//    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
//        navigator.webkitGetUserMedia(videoObj, function (stream) {
//            video.src = window.webkitURL.createObjectURL(stream);
//            video.play();
//        }, errBack);
//    }
//    else if (navigator.mozGetUserMedia) { // Firefox-prefixed
//        navigator.mozGetUserMedia(videoObj, function (stream) {
//            video.src = window.URL.createObjectURL(stream);
//            video.play();
//        }, errBack);
//    }
//}, false);