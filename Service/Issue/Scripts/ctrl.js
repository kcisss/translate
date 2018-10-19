appmod.controller('MainCtrl', function ($scope, allNewServ, $location) {
    $scope.hideSideNav = function (val) {
        return ($location.path() === '/projectlist' || $location.absUrl().indexOf('/unit/') != -1) ? true : false;
    }
});

appmod.controller('ProjectListCtrl', function ($scope, allNewServ) {

    //allNewServ.GET('project', 'getall', null, false, '').then(function (response) {
    //    $scope.getResult = response;
    //}, function (error) {
    //});
    allNewServ.GET('Project', 'GetProjectofWorker', { workerId: USER.WID }, false, '').then(function (proj) {
        $scope.getResult = proj;
    });
});

appmod.controller('UnitListCtrl', function ($scope, allNewServ, $routeParams, $location, $service) {
    if ($routeParams.workerID === '-99') {
        $scope.workerParamsId = null;
        $scope.thisWorker = { Id: '-99' };
    } else {
        $scope.workerParamsId = $routeParams.workerID
    }
    var obj = { projectId: $routeParams.id, workerId: $scope.workerParamsId };
    allNewServ.POST('issue', 'GetReUnitList', obj, false, '').then(function (reunits) {
        $scope.reunits = reunits;
    });
    $scope.goUnit = function (ReunitId, idx, from) {
        $service.setValue({ index: idx, from: from });
        $location.url('project/reunit/' + $routeParams.id + '/unit/' + ReunitId)
    }
});

appmod.controller('UnitCtrl', function ($scope, allNewServ, $routeParams, $mdDialog, $service, $location, API, $window) {
    moment.locale('th');
    $scope.search = { worker: null, workFlow: null, WBS: null, WBSchildren: null };
    $scope.currentNavItem = '1'
    $scope.text = [];
    $scope.subText = [];
    $scope.issue = {};
    $scope.commentImg = [];
    $scope.commentFirstImg = [];
    $scope.commentSubImg = [];
    $scope.commentSubImgReply = [];
    $scope.commentWID = USER.WID;
   
    if (_.isUndefinedNullOrEmpty($service.getValue()) || $service.getValue().index == 0) {
        $scope.currentNavItem = 1;
    }
    else if ($service.getValue().index == 1) {
        $scope.currentNavItem = 2;
    }

    var utc = moment().utcOffset() / 60;
    $scope.noImg = API.getHostUri() + '/Content/src/modules/Shared/img/noimg.png';
    $scope.WBSitem = true;

    allNewServ.GET('Unit', 'Get', { id: $routeParams.reunitId }, false, '').then(function (res) {
        $scope.unit = res
    })

    allNewServ.GET('worker', 'Get', null, false, '').then(function (workers) {
        allNewServ.GET('workflow', 'GetAll', null, false, '').then(function (workFlows) {
            allNewServ.GET('wbs', 'GetAll', null, false, '').then(function (WBS) {
                $scope.workers = workers;
                //$scope.workFlows = _.findWhere(workFlows, { UseFor: 28 });
                $scope.workFlows = workFlows[0];
                $scope.WBS = WBS;
                getData();
            })
        })
    });

    $scope.filter = function () {
        getData();
    }

    $scope.back = function () {
        $window.location.href = '/service/Issue/#!/project/reunit/' + $routeParams.id;
    }

    $scope.export = function () {
        allNewServ.ExportReport('Issue',
            'ExportIssueByUnit',
            { Id: $routeParams.reunitId, FileName: 'รายงาน Defect ยูนิต ' + $scope.unit.Code },
            true,
            'download').then(function (res) {
                console.log(status)
            })
    }

    function getData() {

        $scope.issueBacklog = [];
        $scope.issueOverdue = [];
        $scope.issueSuccesse = [];
        $scope.issueList = [];

        var obj = {
            reunitId: $routeParams.reunitId,
            workerId: $scope.search.worker,
            workFlowId: $scope.search.workFlow,
            WBSId: $scope.search.WBS,
            WBSchildrenId: $scope.search.WBSchildren
        };
        allNewServ.POST('Issue', 'GetIssue', obj, false, '').then(function (issues) {
            _.each(issues, function (value) {
                var WorkFlowName = _.findWhere($scope.workFlows.WorkStages, { Id: value.WorkFlowId })
                value.WorkFlowName = _.isUndefined(WorkFlowName) ? '' : WorkFlowName.Name

                _.each($scope.WBS, function (value2) {
                    var wbs = _.findWhere(value2.Children, { Id: value.WbsId })
                    if (!_.isUndefined(wbs)) {
                        value.WbsName = wbs.Name;
                        value.WbsMain = value2.Name;
                    }
                })
                value.isNew = false;
            })
            _.each(issues, function (value) {
                if (_.isUndefinedOrNull(value.Duedate) && value.Status == 0 || new Date(value.Duedate) >= new Date() && value.Status == 0) {
                    $scope.issueBacklog.push(value);
                }
                else if (new Date(value.Duedate) < new Date() && value.Status == 0) {
                    $scope.issueOverdue.push(value);
                }
                else {
                    $scope.issueSuccesse.push(value);
                }
            });
            $scope.issueList = issues
        })
    }

    $scope.selectWBS = function () {
        $scope.WBSitem = false;
        if ($scope.search.WBS == null) {
            $scope.WBSitem = true;
        }
        else {
            var item = _.findWhere($scope.WBS, { Id: $scope.search.WBS });
            $scope.WBSChildren = item.Children;
        }
        $scope.search.WBSchildren = null
    }

    $scope.setImgReply = function (val, pidx, idx) {
        $scope.commentSubImgReply[pidx][idx] = val;
    }

    $scope.setSubImg = function (val, idx) {
        $scope.commentSubImg[idx] = val;
    }


    $scope.setFirstImg = function (val, idx) {
        $scope.commentFirstImg[idx] = val;
    }

    $scope.setImg = function (val, idx) {
        $scope.commentImg[idx] = val;
    }
    allNewServ.GET('Issue', 'GetComment', { id: $routeParams.reunitId }, false, '').then(function (data) {
        $scope.commentList = _.groupBy(data, 'Id');
        _.each($scope.commentList, function (value) {
            _.each(value, function (value2, idx) {
                value2.check = false;
                $scope.commentSubImgReply.push([null]);
                _.each(value2.Children, function (value3, idx2) {
                    value3.check = false;
                })
            })
        })
    })

    $scope.updateComment = function (id, text, idx, issueId) {
        $scope.commentList[issueId][idx].check = false;
        $scope.commentLines = {
            Id: _.newGuid(),
            Text: text,
            Image: $scope.commentList[issueId][idx].Image,
            CreateTimeStamp: new Date(moment()),
            CommentId: id
        }
        $scope.commentList[issueId][idx].dateTime = $scope.commentLines.CreateTimeStamp;

        //allNewServ.updateCommentLines($scope.commentLines, true, 'save').then(function (data) {
        //    $scope.commentList[issueId][idx].Count += 1;
        //})

        var showToast = ($scope.commentFirstImg[idx] != undefined) ? false : true;
        var totalShowToast = ($scope.commentFirstImg[idx] != undefined) ? false : true;
        allNewServ.POST('Issue', 'updateCommentLines', $scope.commentLines, totalShowToast, 'save').then(function (dataLines) {
            if (!showToast) {
                $service.upLoadCommentPhoto($scope.commentFirstImg[idx], $scope.commentLines.Id, true, 'save').then(function (result) {
                    $scope.commentFirstImg[idx] = null;
                    $scope.commentList[issueId][idx].Count += 1;
                    $scope.commentList[issueId][idx].Image = result.data.Method.Image;
                });
            }
            else {
                $scope.commentFirstImg[idx] = null;
                $scope.commentList[issueId][idx].Count += 1;
            }
        })
    }

    $scope.updateSubComment = function (id, text, pidx, idx, issueId, parentId) {
        $scope.commentList[issueId][pidx].Children[idx].check = false;
        $scope.commentLines = {
            Id: _.newGuid(),
            Text: text,
            Image: $scope.commentList[issueId][pidx].Children[idx].Image,
            CreateTimeStamp: new Date(moment()),
            ParentId: parentId,
            CommentId: id
        }
        $scope.commentList[issueId][pidx].Children[idx].dateTime = $scope.commentLines.CreateTimeStamp;
        var showToast = ($scope.commentSubImgReply[pidx][idx] != undefined) ? false : true;
        var totalShowToast = ($scope.commentSubImgReply[pidx][idx] != undefined) ? false : true;
        allNewServ.POST('Issue', 'addCommentLines', $scope.commentLines, totalShowToast, 'save').then(function (dataLines) {
            if (!showToast) {
                $service.upLoadCommentPhoto($scope.commentSubImgReply[pidx][idx], $scope.commentLines.Id, true, 'save').then(function (result) {
                    $scope.commentSubImgReply[pidx][idx] = null;
                    $scope.commentList[issueId][pidx].Children[idx].Count += 1;
                    $scope.commentList[issueId][pidx].Children[idx].Image = result.data.Method.Image;
                });
            }
            else {
                $scope.commentSubImgReply[pidx][idx] = null;
                $scope.commentList[issueId][pidx].Children[idx].Count += 1;
            }
        })
    }

    $scope.addComment = function (idx, issueId) {

        $scope.comment = {
            Id: _.newGuid(),
            CreateTimeStamp: new Date(moment()),
            CreateBy: USER.Name,
            IssueId: issueId,
            WorkerId: USER.WID,
            WorkerImage: USER.Avatar
        }

        $scope.commentLines = {
            Id: _.newGuid(),
            Text: $scope.text[idx],
            Image: '',
            CreateTimeStamp: new Date(moment()),
            CommentId: null
        }

        var commentPush = {
            Id: issueId,
            CommentId: $scope.comment.Id,
            CommentLinesId: $scope.commentLines.Id,
            Text: $scope.commentLines.Text,
            Image: $scope.commentLines.Image,
            CreateBy: $scope.comment.CreateBy,
            dateTime: $scope.commentLines.CreateTimeStamp,
            WorkerId: $scope.comment.WorkerId,
            WorkerImage: $scope.comment.WorkerImage,
            Count: 1,
            check: false
        }

        var showToast = ($scope.commentImg[idx] != undefined) ? false : true;
        var totalShowToast = ($scope.commentImg[idx] != undefined) ? false : true;
        allNewServ.POST('Issue', 'addComment', $scope.comment, false, '').then(function (comment) {
            $scope.commentLines.CommentId = $scope.comment.Id;
            allNewServ.POST('Issue', 'addCommentLines', $scope.commentLines, totalShowToast, 'save').then(function (dataLines) {
                if (_.isUndefined($scope.commentList[issueId])) {
                    $scope.commentList[issueId] = [];
                }
                if (!showToast) {
                    $service.upLoadCommentPhoto($scope.commentImg[idx], $scope.commentLines.Id, true, 'save').then(function (result) {
                        commentPush.Image = result.data.Method.Image;
                        $scope.commentList[issueId].push(commentPush);
                        $scope.text[idx] = '';
                        $scope.commentImg[idx] = null;
                    });
                }
                else {
                    $scope.commentList[issueId].push(commentPush);
                    $scope.text[idx] = '';
                    $scope.commentImg[idx] = null;
                }
            })
        })
    }
    $scope.addSubComment = function (idx, issueId, commentLinesId) {
        $scope.comment = {
            Id: _.newGuid(),
            CreateTimeStamp: new Date(moment()),
            CreateBy: USER.Name,
            IssueId: issueId,
            WorkerId: USER.WID,
            WorkerImage: USER.Avatar
        }

        $scope.commentLines = {
            Id: _.newGuid(),
            Text: $scope.subText[idx],
            Image: '',
            CreateTimeStamp: new Date(moment()),
            ParentId: commentLinesId,
            CommentId: null
        }

        var commentPush = {
            Id: issueId,
            CommentId: $scope.comment.Id,
            CommentLinesId: $scope.commentLines.Id,
            Text: $scope.commentLines.Text,
            Image: $scope.commentLines.Image,
            CreateBy: $scope.comment.CreateBy,
            dateTime: $scope.commentLines.CreateTimeStamp,
            WorkerId: $scope.comment.WorkerId,
            WorkerImage: $scope.comment.WorkerImage,
            ParentId: $scope.commentLines.ParentId,
            Count: 1,
            check: false
        }

        var showToast = ($scope.commentSubImg[idx] != undefined) ? false : true;
        var totalShowToast = ($scope.commentSubImg[idx] != undefined) ? false : true;
        allNewServ.POST('Issue', 'addComment', $scope.comment, false, '').then(function (comment) {
            $scope.commentLines.CommentId = $scope.comment.Id;
            allNewServ.POST('Issue', 'addCommentLines', $scope.commentLines, totalShowToast, 'save').then(function (dataLines) {
                if (_.isUndefined($scope.commentList[issueId][idx].Children)) {
                    $scope.commentList[issueId][idx].Children = [];
                }
                if (!showToast) {
                    $service.upLoadCommentPhoto($scope.commentSubImg[idx], $scope.commentLines.Id, true, 'save').then(function (result) {
                        commentPush.Image = result.data.Method.Image;
                        $scope.commentList[issueId][idx].Children.push(commentPush);
                        $scope.subText[idx] = '';
                        $scope.commentSubImg[idx] = null;
                    });
                }
                else {
                    $scope.commentList[issueId][idx].Children.push(commentPush);
                    $scope.subText[idx] = '';
                    $scope.commentSubImg[idx] = null;
                }
                $scope.commentSubImgReply.push([null]);
            })

        })
    }


    $scope.deleteComment = function (ev, issueId, commentId, idx) {
        allNewServ.showConfirmDelete({
            ev: ev,
            Id: { id: commentId },
            funcDel: 'DELETE',
            con: 'Issue',
            func: 'deleteCommentLines'
        }).then(function () {
            $scope.commentList[issueId].splice(idx, 1);
        });
    }

    $scope.deleteSubComment = function (ev, issueId, commentId, pidx, idx) {
        allNewServ.showConfirmDelete({
            ev: ev,
            Id: { id: commentId },
            funcDel: 'DELETE',
            con: 'Issue',
            func: 'deleteSubCommentLines'
        }).then(function () {
            $scope.commentList[issueId][pidx].Children.splice(idx, 1);
        });
    }

    $scope.$watch(function () { return $service.getValue(); }, function (newValue, oldValue) {
        if (!_.isUndefined(newValue)) {
            $scope.tabIndex = newValue.index;
            if (newValue.from == 'list') {
                $scope.saveAndUpdateIssue('save', null);
            }
        }
    })

    $scope.dateFromNow = function (date) {
        return moment(new Date(date)).utcOffset(utc).fromNow();
    }

    $scope.dateFormat = function (date) {
        return moment(new Date(date)).utcOffset(utc).format('dddd D MMMM YYYY HH:mm:ss');
    }

    $scope.dateFromNowSuccess = function (date) {
        return moment(new Date(date)).utcOffset(utc).format('dddd D MMMM YYYY');
    }

    $scope.dateFormatSuccess = function (date) {
        return moment(new Date(date)).utcOffset(utc).format('dddd D MMMM YYYY HH:mm:ss');
    }

    $scope.checkDueDate = function (date) {
        if (new Date(moment()) >= new Date(date)) {
            return 'เกินกำหนด';
        }
    }

    $scope.showEdited = function (ev, id) {
        $mdDialog.show({
            controller: commentEditedController,
            templateUrl: '/Content/src/modules/Service/Issue/Partials/commentEdited.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                _data: {
                    id: id
                }
            }
        }).then(function (data) {
        })
    }
    $scope.postAndSaveCon = function (data, showToast, workFlows) {
        if (!showToast) {
            $service.upLoadIssuePhoto(data.img, data.issue.Id, true, 'save').then(function (result) {
                data.issue.Image = result.data.Method.Image;
                getData();
            });
        } else {
            getData();
        }
        var WorkFlowName = _.findWhere(workFlows.WorkStages, { Id: data.issue.WorkFlowId })
        data.issue.WorkFlowName = _.isUndefined(WorkFlowName) ? '' : WorkFlowName.Name
        _.each($scope.WBS, function (value2) {
            var wbs = _.findWhere(value2.Children, { Id: data.issue.WbsId })
            if (!_.isUndefined(wbs)) {
                data.issue.WbsName = wbs.Name;
                data.issue.WbsMain = value2.Name;
            }
        })

        data.issue.isNew = false;

        //if (data.type == 'save') {
        //getData();
        //}
    }
    $scope.saveAndUpdateIssue = function (type, issueData, $event) {
        var issue;
        if (_.isUndefinedOrNull(issueData)) {
            issue = null;
        } else {
            issue = issueData;
        }
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '/Content/src/modules/Service/Issue/Partials/unit.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            locals: {
                _data: {
                    workFlows: $scope.workFlows,
                    WBS: $scope.WBS,
                    issue: issue,
                    type: type
                }
            }

        }).then(function (data) {
            var showToast = (data.img != undefined) ? false : true;
            var totalShowToast = (data.img != undefined) ? false : true;

            if (data.issue.isNew) {
                allNewServ.POST('Issue', 'POST', data.issue, totalShowToast, 'created').then(function (issue) {
                    $scope.postAndSaveCon(data, showToast, $scope.workFlows);
                })
            } else {
                allNewServ.PUT('Issue', 'PUT', data.issue, totalShowToast, 'save').then(function (issue) {
                    $scope.postAndSaveCon(data, showToast, $scope.workFlows);
                })
            }
        })
    }

    $scope.success = function (issue) {
        issue.Status = 1;
        issue.SuccessTimeStamp = new Date();
        allNewServ.PUT('Issue', 'PUT', issue, true, 'save').then(function (issue) {
            getData();
        })
    }

    $scope.showConfirmDelete = function (ev, idx, id) {
        allNewServ.showConfirmDelete({
            ev: ev,
            Id: { id: id },
            funcDel: 'DELETE',
            con: 'Issue',
            func: 'Delete'
        }).then(function () {
            getData();
        });
    };

    $scope.showImage = function (ev, image) {
        $mdDialog.show({
            controller: showImage,
            templateUrl: '/Content/src/modules/Shared/showImage.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            skipHide: true, // this line does the trick
            locals: {
                image: image
            }
        }).then(function () {
        });
    };
});

appmod.controller('WbsListCtrl', function ($scope, allNewServ, $routeParams) {

    $scope.tableHeight = window.innerHeight - 64 - 91 - 18 + 'px';
    allNewServ.POST('unit', 'getAllREUnitAndAllRelate', { ProjectId: $routeParams.id }, false, '').then(function (reunits) {
        $scope.reunits = reunits;
        $scope.emp = USER;
    });
    $scope.menus = [
        {
            id: 1,
            name: 'ระหว่างก่อสร้าง',
            items: ['ฐานราก', 'โครงสร้าง', 'พื้นและพนัง', 'ฟ้าเพดานและหลังคา', 'รั้วและกำแพง']
        }
        ,
        {
            id: 2,
            name: 'ตรวจโอน',
            items: ['ฐานราก', 'โครงสร้าง', 'พื้นและพนัง']
        }
        ,
        {
            id: 3,
            name: 'งานสี',
            items: ['ประตู', 'รั้ว', 'ภายใน', 'ภายนอก']
        }
    ]

    $scope.wbschild = []
    _.each($scope.menus, function (parent) {
        _.each(parent.items, function (child) {
            $scope.wbschild.push(child)
        })
    })

});

appmod.controller('IssueListCtrl', function ($scope, allNewServ, $routeParams) {
    $scope.issues = [
        {
            id: 1,
            subject: 'ขัดไม้ให้เรียบ',
            wbs: 'งานไม้',
            unit: 'A001',
            detail: 'หน้าบริเวณบ้าน',
            assign: 'ช่างนนท์',
            duedate: new Date('10/8/2016')
        },
        {
            id: 2,
            subject: 'สีผนังเเตก',
            wbs: 'แตก ร่อน',
            unit: 'A010',
            detial: '',
            assign: 'ช่างสม',
            duedate: new Date('/09/26/2016')
        },
        {
            id: 3,
            subject: 'ไม้หลุด',
            wbs: 'งานไม้ประตู',
            unit: 'A001',
            detial: '',
            assign: 'ช่างหลุด',
            duedate: new Date('/09/27/2016')
        },
    ]
});

appmod.controller('LeftCtrl', function ($scope, allNewServ, $routeParams, $location, $service) {
    $scope.thisWorker = { Id: -99 }

    $scope.$on('$locationChangeSuccess', function (evt, absNewUrl, absOldUrl) {
        var url = window.location.hash.substr(11)
        $scope.displayType = url.substr(0, url.indexOf('/'));
        allNewServ.GET('project', 'getall', null, false, '').then(function (projects) {
            $scope.projects = projects;
            $scope.thisProject = _.findWhere($scope.projects, { Id: $routeParams.id });
            allNewServ.GET('worker', 'Get', null, false, '').then(function (workers) {
                $scope.workers = workers;
                if (!_.isUndefinedNullOrEmpty($routeParams.workerID)) {
                    $scope.thisWorker = _.findWhere($scope.workers, { Id: parseInt($routeParams.workerID) })
                }
            });
        });
    });

    $scope.searchSubmit = function () {
        if ($scope.thisWorker.Id == -99) {
            $location.url('/project/' + $scope.displayType + '/' + $scope.thisProject.Id)
        } else {
            $location.url('/project/' + $scope.displayType + '/' + $scope.thisProject.Id + '/' + $scope.thisWorker.Id)
        }
    }

    $scope.onSearchChange = function ($event) {
        $event.stopPropagation();
    }

    $scope.changeView = function (target) {
        $scope.displayType = target
        $scope.thisWorker.Id = -99
        $location.url('/project/' + target + '/' + $routeParams.id)
    }

});

function DialogController($scope, allNewServ, $mdDialog, $routeParams, _data) {

    $scope.WBSDisabled = true;
    $scope.WBSitem = true;
    $scope.checkDisableAddIssue = true;

    if (!_.isUndefined(_data.workFlows) && !_.isUndefined(_data.WBS)) {
        $scope.workFlows = _data.workFlows;
        $scope.WBSALL = _data.WBS;
    } else {
        allNewServ.GET('workflow', 'GetAll', null, false, '').then(function (workFlows) {
            $scope.workFlows = workFlows[0]
        });
        allNewServ.GET('wbs', 'GetAll', null, false, '').then(function (WBS) {
            $scope.WBSALL = WBS;
        });
    }

    $scope.type = _data.type;

    $scope.selectWBS = function () {
        $scope.WBSitem = false;
        var item = _.findWhere($scope.WBSALL, { Id: $scope.WBS });
        $scope.WBSChildrenALL = item.Children;
    }

    if (_data.type == 'edit') {
        var tempIssue = _.pick(_data.issue, 'ContractorName', 'CreateBy', 'CreateName', 'CreateTimeStamp', 'Description', 'Duedate', 'Id', 'Image', 'Image', 'LastModifiedTimeStamp', 'Name', 'REUnitId', 'Status', 'Type', 'WbsId', 'WbsMain', 'WbsName', 'WorkFlowId', 'WorkFlowName', 'WorkerId', 'isNew');
        $scope.issue = tempIssue
        if (_.isUndefinedNullOrEmpty($scope.issue.Duedate)) {
            $scope.issue.Duedate = allNewServ.normalizeDatePicker(new Date());
        } else {
            $scope.issue.Duedate = new Date(tempIssue.Duedate);
        }
        $scope.WBSDisabled = false;
        $scope.currImg = tempIssue.Image;
        $scope.issue.isNew = false;
        _.each($scope.WBSALL, function (value) {
            _.each(value.Children, function (children) {
                if (children.Id == tempIssue.WbsId) {
                    $scope.WBS = children.ParentId
                    $scope.selectWBS();
                }
            })
        })
    } else {
        $scope.issue = {
            Id: _.newGuid(),
            Name: '',
            Description: '',
            ContractorName: '',
            Type: '1',
            Image: '',
            Comment: [],
            Duedate: allNewServ.normalizeDatePicker(new Date()),
            CreateBy: '',
            CreateTimeStamp: '',
            LastModifiedBy: '',
            LastModifiedTimeStamp: '',
            WorkerId: '',
            REUnitId: $routeParams.reunitId,
            WorkFlowId: '',
            WbsId: '',
            CreateName: USER.Name,
            isNew: true
        }
    }
    allNewServ.GET('worker', 'Get', null, false, '').then(function (workers) {
        $scope.workers = workers
    })

    $scope.selectWorkflow = function () {
        $scope.WBSDisabled = false;
    }

    $scope.setImg = function (val) {
        $scope.fileImg = val;
    }
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.showImage = function (ev, image) {
        $mdDialog.show({
            controller: showImage,
            templateUrl: '/Content/src/modules/Shared/showImage.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            skipHide: true, // this line does the trick
            locals: {
                image: image
            }
        }).then(function () {
        });
    };

    $scope.onSearchChange = function ($event) {
        $event.stopPropagation();
    }

    $scope.close = function () {
        $mdDialog.cancel();
    }
    $scope.add = function () {
        if ($scope.issue.isNew == true) {
            $scope.issue.CreateTimeStamp = new Date(moment());
            $scope.issue.CreateBy = USER.Email;
            $scope.issue.WorkerId = USER.WID;
            $scope.issue.Status = 0;
        }

        if ($scope.issue.Type === '1' || $scope.issue.Type === '2') {
            $scope.issue.DueDate = null;
        }

        $scope.issue.LastModifiedTimeStamp = new Date(moment());
        $scope.issue.LastModifiedBy = USER.Email;

        $mdDialog.hide({ issue: $scope.issue, img: $scope.fileImg, type: $scope.type });
    }
    $scope.$watch(function checkAdd() {
        //console.log($scope.checkDisableAddIssue)
        if (!_.isUndefinedNullOrEmpty($scope.issue.Name) &&
            !_.isUndefinedNullOrEmpty($scope.issue.WorkerId) &&
            !_.isUndefinedNullOrEmpty($scope.issue.WbsId)) {
            $scope.checkDisableAddIssue = false;
        } else {
            $scope.checkDisableAddIssue = true;
        }
    });
}

function commentEditedController($scope, allNewServ, $mdDialog, _data) {

    var utc = moment().utcOffset() / 60;
    allNewServ.GET('Issue', 'GetCommentEdited', { id: _data.id }, false, '').then(function (value) {
        $scope.commentList = value;
    })

    $scope.dateFormat = function (date) {
        return moment(new Date(date)).utcOffset(utc).format('dddd D MMMM YYYY HH:mm:ss');
    }

    $scope.dateFromNow = function (date) {
        return moment(new Date(date)).utcOffset(utc).fromNow();
    }
    $scope.showTextImage = function (idx) {
        if (idx == $scope.commentList.length - 1 && $scope.commentList[idx].Image != '') {
            return 'เพิ่มรูปภาพในความคิดเห็น';
        }
        else if (idx != $scope.commentList.length - 1 && $scope.commentList[idx].Image == '' && $scope.commentList[idx + 1].Image != '') {
            return 'ลบรูปภาพในความคิดเห็น';
        }
        else if (idx != $scope.commentList.length - 1 && $scope.commentList[idx].Image != '' && $scope.commentList[idx + 1].Image == '') {
            return 'เพิ่มรูปภาพในความคิดเห็น';
        }
        else if (idx != $scope.commentList.length - 1 && $scope.commentList[idx].Image != $scope.commentList[idx + 1].Image) {
            return 'อัพเดทรูปภาพในความคิดเห็น';
        }
    }
    $scope.showImage = function (ev, image) {
        $mdDialog.show({
            controller: showImage,
            templateUrl: '/Content/src/modules/Shared/showImage.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            skipHide: true, // this line does the trick
            locals: {
                image: image
            }
        }).then(function () {
        });
    };

    $scope.close = function () {
        $mdDialog.cancel();
    }
}