mortgageUnitApp.controller('UnitListCtrl', ['$scope', '$service', '$mdDialog', 'allNewServ', 'ENUM', 'localStorageService', '$timeout', '$window', '$importServ', '$rootScope', 'allNewMortgageServ', 'globalFilterClientServ', '$routeParams', '$location', '$mdSelect',
    function ($scope, $service, $mdDialog, allNewServ, ENUM, localStorageService, $timeout, $window, $importServ, $rootScope, allNewMortgageServ, globalFilterClientServ, $routeParams, $location, $mdSelect) {
        INITPromise.then(function (initObj) {
            $rootScope.secondary = "หน้าแรก";
            $scope.updating = false;
            $scope.BANK = [];
            $scope.BANK.push(USER.BankId);
            $scope.customerByQuotaions = [];
            $scope.showAll = true;
            $scope.listTableWidth = '3320px';
            $scope.contentHeight = window.innerHeight - 64 + 'px';
            $scope.contentWidth = window.innerWidth + 'px';
            $scope.tableHeight = window.innerHeight - 64 - 131 - 80 - 52 - 46;
            $scope.mgStatus = ENUM.MortgageStatus;
            $scope.maritalStatus = ENUM.MaritalStatus;
            $scope.IsBank = !_.isUndefinedNullOrEmpty(USER.BankId);
            $scope.filter = {
                StatusHeader: null,
                StatusSubHeader: null,
                HeadFilter: null,
                ValueFilter: null,
                IsBank: false,
                HasOwner: false,
                BankId: $scope.IsBank ? $scope.BANK : null
            };
            var backUpData = null;

            $scope.index = false;
            $scope.backUpCo = null;

            $scope.myObject = globalFilterClientServ.getDefaultFilterReport("/mortgage");


            $scope.changeGlobalFilter = function (returnFilter) {
                $scope.filter = {};
                $scope.filter.BankId = _.isUndefinedNullOrEmpty(USER.BankId) ? returnFilter.bankId : $scope.BANK;
                $scope.filter.Search = returnFilter.search;
                $scope.filter.companyId = returnFilter.companyId;
                $scope.filter.projectId = returnFilter.projectId;
                $scope.filter.skip = 0;
                $scope.filter.take = 7;
                if (!$scope.loading) {
                    $scope.dataList = [];
                    loadingData($scope.filter);
                    countApplication($scope.filter);
                }
                countHeaderUnit($scope.filter);
            };

            $scope.selectStatus = null;
            $scope.editeRowSelect = [];
            $scope.editeRowSelectAll = [];

            $scope.tableHeader = [
                { Name: "ข้อมูลยูนิต", width: '180px', widthInt: 180 },
                { Name: "ชื่อผู้จองตามสัญญา", width: '180px', widthInt: 180 },
                { Name: "รายชื่อผู้กู้ร่วม", width: '300px', widthInt: 300 },
                { Name: "วันที่ยื่นกู้", width: '150px', widthInt: 150 },
                { Name: "การยื่นกู้", width: '250px', widthInt: 250, sumValue: null },
                { Name: "เกรด", width: '100px', widthInt: 100 },
                { Name: "เหตุผลที่เปลี่ยนเป็นสถานะนี้", width: '200px', widthInt: 200 },
                { Name: "เวลาในระบบ", width: '110px', widthInt: 110 },
                { Name: "เปลี่ยนแปลงล่าสุด", width: '150px', widthInt: 150 },
                { Name: "Tracking No.", width: '150px', widthInt: 150 },
                { Name: "วันที่อนุมัติ", width: '150px', widthInt: 150 },
                { Name: "วันที่จำนอง", width: '150px', widthInt: 150 },
                { Name: "วงเงินขอกู้", width: '150px', widthInt: 150 },
                { Name: "วงเงินจำนองรวม", width: '180px', widthInt: 180 },
                { Name: "เหตุผลในการไม่อนุมัติ", width: '220px', widthInt: 220 },
                { Name: "เหตุผลที่อนุมัติแล้วยกเลิก", width: '220px', widthInt: 220 },
                { Name: "จนท.ธนาคาร", width: '250px', widthInt: 250 },
                { Name: "ผู้ดูแลโครงการ", width: '250px', widthInt: 250 }
            ];
            $scope.countStatus = [
                { Status: 1, Name: "ทั้งหมด", Count: 0, realStatus: null },
                {
                    Status: 2, Name: "ก่อนเข้าระบบ", Count: 0, realStatus: [3, 4], SubMenu: [
                        { status: 1, Name: "ทั้งหมด", Count: 0, realStatus: [3, 4] },
                        { status: 2, Name: "ธนาคารได้รับคำขอ", Count: 0, realStatus: [3] }
                    ]
                },
                {
                    Status: 3, Name: "รอผลธนาคาร", Count: 0, realStatus: [5, 6, 7, 8], SubMenu: [
                        { status: 1, Name: "ทั้งหมด", Count: 0, realStatus: [5, 6, 7, 8] },
                        { status: 2, Name: "เข้าระบบธนาคาร", Count: 0, realStatus: [5] },
                        { status: 4, Name: "ขอเอกสารเพิ่มเติม", Count: 0, realStatus: [7] },
                        { status: 5, Name: "ผลการอนุมัติ", Count: 0, realStatus: [8] }
                    ]
                },
                {
                    Status: 4, Name: "ผลการยื่นกู้", Count: 0, realStatus: [9, 10, 11], SubMenu: [
                        { status: 1, Name: "ทั้งหมด", Count: 0, realStatus: [9, 10, 11] },
                        { status: 2, Name: "อนุมัติเบื้องต้น", Count: 0, realStatus: [9] },
                        { status: 3, Name: "อนุมัติจริง", Count: 0, realStatus: [10] },
                        { status: 4, Name: "ไม่อนุมัติ", Count: 0, realStatus: [11] }
                    ]
                },
                {
                    Status: 5, Name: "เลือกกู้", Count: 0, realStatus: [12, 13], SubMenu: [
                        { status: 1, Name: "ทั้งหมด", Count: 0, realStatus: [12, 13] },
                        { status: 2, Name: "ลูกค้าเลือก", Count: 0, realStatus: [12] },
                        { status: 3, Name: "อนุมัติแล้วยกเลิก", Count: 0, realStatus: [13] }
                    ]
                },
                {
                    Status: 6, Name: "อื่นๆ", Count: 0, realStatus: [1, 14, 0], SubMenu: [
                        { status: 1, Name: "ทั้งหมด", Count: 0, realStatus: [1, 14, 0] },
                        { status: 2, Name: "ยังไม่ได้ยื่นกู้", Count: 0, realStatus: [1] },
                        { status: 3, Name: "ยกเลิกกู้", Count: 0, realStatus: [14] },
                        { status: 4, Name: "ยูนิตว่าง", Count: 0, realStatus: [0] }
                    ]
                }
            ];

            $scope.grades = [
                { Id: 0, Name: "ไม่ระบุ" },
                { Id: 1, Name: "A" },
                { Id: 2, Name: "B" },
                { Id: 3, Name: "C" },
                { Id: 4, Name: "D" },
                { Id: 5, Name: "F" }
            ];

            var backUpCount = angular.toJson($scope.countStatus);

            var CustomerCanEdit = ["CustomerName", "CustomerPhone", "IdentificationNo", "MaritalStatus"];
            var RealCustomerFeild = [
                { ShowField: "CustomerName", DatabaseField: "Name", DatabaseDocId: 1 },
                { ShowField: "CustomerPhone", DatabaseField: "Phone", DatabaseDocId: 1 },
                { ShowField: "IdentificationNo", DatabaseField: "IdentificationNo", DatabaseDocId: 1 },
                { ShowField: "MaritalStatus", DatabaseField: "MaritalStatus", DatabaseDocId: 1 }
            ];
            var BankAppCanEdit = ["CoBorrower", "CustomerServiceName", "CustomerServicePhone", "BankAgentName", "BankAgentPhone", "TotalAmount", "LoanAmount", "LoanDate", "LoanApproveDate", "MortgageStatus", "TransferDate", "Grade"];
            var RealBankAppFeild = [
                { ShowField: "CoBorrower", DatabaseField: "Name", DatabaseDocId: 4 },
                { ShowField: "CustomerServiceName", DatabaseField: "CustomerServiceName", DatabaseDocId: 3 },
                { ShowField: "CustomerServicePhone", DatabaseField: "CustomerServicePhone", DatabaseDocId: 3 },
                { ShowField: "BankAgentName", DatabaseField: "BankAgentName", DatabaseDocId: 3 },
                { ShowField: "BankAgentPhone", DatabaseField: "BankAgentPhone", DatabaseDocId: 3 },
                { ShowField: "LoanAmount", DatabaseField: "LoanAmount", DatabaseDocId: 3 },
                { ShowField: "TotalAmount", DatabaseField: "TotalAmount", DatabaseDocId: 3 },
                { ShowField: "LoanDate", DatabaseField: "LoanDate", DatabaseDocId: 3 },
                { ShowField: "LoanApproveDate", DatabaseField: "LoanApprovedDate", DatabaseDocId: 3 },
                { ShowField: "TransferDate", DatabaseField: "TransferDate", DatabaseDocId: 3 },
                { ShowField: "Grade", DatabaseField: "Grade", DatabaseDocId: 3 }
            ];


            function countHeaderUnit(filter) {
                allNewServ.POST('CustomerService', 'GetCountStatus', filter, false, '').then(function (res) {
                    _.each($scope.countStatus, function (head, keyhead) {
                        head.Count = 0;
                        var tmpHead = _.findWhere(res.unit, { HeaderStatus: head.Status });
                        if (!_.isUndefined(tmpHead)) {
                            head.Count = tmpHead.CountHeader;
                            if (!_.isUndefinedNullOrEmpty(head.SubMenu)) {
                                tmpHead.SubheaderDetail = angular.fromJson(tmpHead.SubheaderDetail);
                                _.each(head.SubMenu, function (subval) {
                                    subval.Count = 0;
                                    var tmpSub = _.findWhere(tmpHead.SubheaderDetail, { MortgageStatusId: subval.realStatus[0] });
                                    if (subval.status === 1)
                                        subval.Count = tmpHead.CountHeader;
                                    if (!_.isUndefinedNullOrEmpty(tmpSub)) {
                                        subval.Count = subval.status === 1 ? tmpHead.CountHeader : tmpSub.CountSubMenu;
                                    }
                                });
                            }
                        }
                    });
                });
            }

            function countApplication(filter) {
                allNewServ.POST('CustomerService', 'CountApp', filter, false).then(function (count) {
                    $scope.tableHeader[4].sumValue = count;
                });
            }
            allNewServ.GET('unit', 'GetCheckUnitCode', null, false, null).then(function (checkUnitCodeList) {
                $scope.checkUnitCodeList = checkUnitCodeList;
            });
            allNewServ.GET('BankApplication', 'GetTrackNo', null, false, null).then(function (data) {
                $scope.trackNoList = [];
                $scope.bankApp = [];
                if (!_.isUndefinedNullOrEmpty(data)) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.trackNoList.push({ TrackNo: data[i].TrackNo });
                        $scope.bankApp.push(data[i]);
                    }
                }
            });


            function loadingData(filter) {
                $scope.loading = true;
                allNewServ.POST('CustomerService', 'getListUnitMortgage', filter, false, '').then(function (data) {
                    angular.forEach(data, function (val) {
                        angular.forEach(val.BankDetail, function (value) {
                            value.LoanDate = !_.isNull(value.LoanDate) ? new Date(value.LoanDate) : null;
                            value.LoanApproveDate = !_.isNull(value.LoanApproveDate) ? new Date(value.LoanApproveDate) : null;
                            value.TransferDate = !_.isNull(value.TransferDate) ? new Date(value.TransferDate) : null;
                        });
                    });
                    console.log(data)
                    allNewServ.GET('Project', 'GetAll', null, false, '').then(function (data) {
                        $scope.projectList = data;
                        $scope.projectList.unshift({ Name: 'ทุกโครงการ', Id: null });
                    });
                    allNewServ.GET('BankApplication', 'GetBankCodeForValidate', null, false, '').then(function (bankApps) {
                        $scope.bankAppCode = bankApps;
                    });
                    allNewServ.GET('CustomerService', 'GetCustomerByREUnit', null, false, '').then(function (res) {
                        $scope.customerByQuotaions = res;
                    });
                    allNewServ.GET('MortgageBank', 'Get', null, false, '').then(function (Bank) {
                        $scope.Banks = Bank;
                    });
                    $scope.loading = false;

                    _.each(data, function (val) {
                        $scope.dataList.push(val);
                    });

                    if ($scope.filter.skip === 0) {
                        backUpData = angular.toJson(data);
                    } else {
                        var tmp = angular.fromJson(backUpData);
                        _.each(data, function (val) {
                            tmp.push(val);
                        });
                        backUpData = angular.toJson(tmp);
                    }

                    $scope.findChooseBank = function (listApp, app) {
                        var findChoose = _.chain(listApp)
                            .find(function (listApp) { return listApp.MortgageStatus === 12; })
                            .isUndefinedNullOrEmpty()
                            .value();
                        return findChoose || app.MortgageStatus === 12 ? false : true;
                    };

                    $scope.updating = false;
                });

            }

            $scope.addunitCS = function (ev) {
                $mdDialog.show({
                    controller: addUnitCtrl,
                    templateUrl: '/content/src/modules/mortgage/Share/partials/addUnitDialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: { data: USER }
                }).then(function () { });
            };
            $scope.addCustomer = function (data, ev) {
                $mdDialog.show({
                    controller: AddCustomerCtrl,
                    templateUrl: '/content/src/modules/mortgage/unit/partials/_AddCustomer.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: { data: data },
                    clickOutsideToClose: false
                }).then(function () { });
            };

            $scope.changElementNav = function (status, realStatus) {
                $scope.filter.StatusHeader = status;
                $scope.currentNavItem = status;
                var backupColor = "rgba(0, 0, 0, 0.54)";
                _.each($scope.countStatus, function (val) {
                    var elem = document.getElementById('nav' + val.Status);
                    if (val.Status === status) {
                        elem.style.background = "#FFF";
                        elem.style.height = "96px";
                        elem.childNodes[3].style.color = "#FF4365";
                    } else {
                        elem.style.background = "#EEEEEE";
                        elem.style.height = "95px";
                        elem.childNodes[3].style.color = backupColor;
                    }
                });
                $scope.selectStatus = _.findWhere($scope.countStatus, { Status: status });
            };
            $timeout(function () { $scope.changElementNav(1, null), 200; });
            $scope.changeNav = function (status, realStatus) {
                $scope.tableHeight = status !== 1 ? window.innerHeight - 64 - 131 - 80 - 52 - 46 - 56 : window.innerHeight - 64 - 131 - 80 - 52 - 46;
                $scope.changElementNav(status, realStatus);
                $scope.changsubMenu(1, realStatus);
            };

            $scope.changsubMenu = function (subStatus, realStatus) {
                if (!$scope.loading) {
                    $scope.dataList = [];
                    $scope.filter.skip = 0;
                    $scope.filter.take = 7;
                    $scope.filter.status = realStatus;
                    $scope.filter.StatusSubHeader = subStatus;
                    loadingData($scope.filter);
                    countHeaderUnit($scope.filter);
                    countApplication($scope.filter);
                }
            };

            $scope.closeSugges = function () {
                $scope.showSugges = !$scope.showSugges;
                if ($scope.dontShowSugges) {
                    localStorageService.set('showSuggestion', true);
                }
            };

            $scope.getHeight = function (id) {
                var tmpelem = document.getElementById('detail' + id);
                if (!_.isUndefinedNullOrEmpty(tmpelem)) {
                    if (tmpelem.offsetHeight > 90) return tmpelem.offsetHeight + 'px';
                    else return '90px';
                } else {
                    return '90px';
                }
            };

            $scope.ShowConfirmDelete = function (ev, id) {
                var confirm = $mdDialog.confirm()
                    .title('คุณต้องการลบแอพพลิเคชันของธนาคารนี้หรือไม่?')
                    .ariaLabel('Alert Dialog Demo')
                    .targetEvent(ev)
                    .ok('ยืนยัน')
                    .cancel('ยกเลิก');
                $mdDialog.show(confirm).then(function () {
                    allNewServ.deleteBankappById(id, true, 'delete').then(function () {
                        location.reload();
                    });
                }, function () { });
            };

            $scope.loadMore = function () {
                if (!$rootScope.pageLoading) {
                    $rootScope.pageLoading = true;
                    $scope.filter.skip += 7;
                    loadingData($scope.filter);
                }
            };

            $scope.addRowtoEdit = function (obj) {
                $scope.editeRowSelect.push(obj);
            };

            $scope.rowEditExist = function (obj) {
                return _.findWhere($scope.editeRowSelect, { ReUnitId: obj.ReUnitId });
            };

            $scope.deleteRowtoEdit = function (obj) {
                $scope.index = false;
                $scope.backUpCo = null;
                var tmpDelete = _.findWhere($scope.editeRowSelect, { ReUnitId: obj.ReUnitId });
                if (!_.isUndefinedNullOrEmpty(tmpDelete)) {
                    $scope.editeRowSelect = _.without($scope.editeRowSelect, tmpDelete);
                }
            };

            $scope.cancelAllEdit = function () {
                _.each($scope.editeRowSelect, function (val) {
                    $scope.deleteRowtoEdit(val, _.indexOf($scope.dataList, val));
                });
            };

            $scope.getDataSheetAction = function (returnAction) {
                if (returnAction === "Export") {
                    var filter = $scope.filter;
                    filter.FileName = 'รายชื่อผู้ยื่นกู้';
                    $mdDialog.show({
                        controller: confirmExportMortgageCtrl,
                        templateUrl: '/content/src/modules/mortgage/unit/partials/confirmExportMortgage.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: Event,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    }).then(function (answer) {
                        filter.typeExport = answer;
                        allNewServ.ExportReport('ExportforMortgage', 'ExportMortgageList', filter, false, 'download').then(function () {

                        });
                    });
                } else if (returnAction === 'Import') {
                    document.getElementById('import-button').click();
                } else if (returnAction === 'AddApp') {
                    $scope.addunitCS();
                }
            };
            $scope.saveEdit = function () {
                $scope.updating = true;
                var EditList = [];
                var EditStatusList = [];
                _.each($scope.editeRowSelect, function (selected) {
                    var tmpOld = _.findWhere(angular.fromJson(backUpData), { CustomerLoanId: selected.CustomerLoanId });
                    for (var key in selected) {
                        if (_.contains(CustomerCanEdit, key)) {
                            if (selected[key] !== tmpOld[key]) {
                                var tmpField = _.findWhere(RealCustomerFeild, { ShowField: key });
                                EditList.push({
                                    Guid: selected.CustomerId,
                                    newVal: selected[key],
                                    FieldName: tmpField.DatabaseField,
                                    DocId: tmpField.DatabaseDocId,
                                    EditType: 2,
                                    CustomerLoanId: selected.CustomerLoanId
                                });
                            }
                        } else if (key === 'BankDetail') {
                            _.each(selected[key], function (bankApp) {
                                var tmpOldApp = _.findWhere(tmpOld.BankDetail, { BankApplicationId: bankApp.BankApplicationId });
                                // find new And Update

                                for (var key2 in bankApp) {
                                    if (key2 === "CoBorrower") {
                                        var tmpField = _.findWhere(RealBankAppFeild, { ShowField: "CoBorrower" });
                                        _.each(bankApp.CoBorrower, function (Co) {
                                            if (!_.isNull(Co.Id)) {
                                                var oldCo = _.findWhere(tmpOldApp.CoBorrower, { Id: Co.Id });
                                                if (oldCo) {
                                                    if (Co.Name !== oldCo.Name) {
                                                        EditList.push({
                                                            Guid: Co.Id,
                                                            newVal: Co.Name,
                                                            FieldName: tmpField.DatabaseField,
                                                            DocId: tmpField.DatabaseDocId,
                                                            EditType: 2,
                                                            ParentDocId: 3,
                                                            ParentGuid: bankApp.BankApplicationId,
                                                            CustomerLoanId: selected.CustomerLoanId
                                                        });
                                                    } else if (Co.MaritalStatus !== oldCo.MaritalStatus) {
                                                        EditList.push({
                                                            Guid: Co.Id,
                                                            newVal: Co.MaritalStatus,
                                                            FieldName: 'MaritalStatus',
                                                            DocId: tmpField.DatabaseDocId,
                                                            EditType: 2,
                                                            ParentDocId: 3,
                                                            ParentGuid: bankApp.BankApplicationId,
                                                            CustomerLoanId: selected.CustomerLoanId
                                                        });
                                                    } else if (Co.IsOwner !== oldCo.IsOwner) {
                                                        EditList.push({
                                                            Guid: Co.Id,
                                                            newVal: Co.isOwner,
                                                            FieldName: 'isOwner',
                                                            DocId: tmpField.DatabaseDocId,
                                                            EditType: 2,
                                                            ParentDocId: 3,
                                                            ParentGuid: bankApp.BankApplicationId,
                                                            CustomerLoanId: selected.CustomerLoanId
                                                        });
                                                    }
                                                } else {

                                                    EditList.push({
                                                        Guid: Co.Id,
                                                        newVal: Co.Name,
                                                        FieldName: 'Name',
                                                        DocId: 4,
                                                        EditType: 1,
                                                        ParentDocId: 3,
                                                        ParentGuid: bankApp.BankApplicationId,
                                                        CustomerLoanId: selected.CustomerLoanId
                                                    });

                                                    EditList.push({
                                                        Guid: Co.Id,
                                                        newVal: Co.MaritalStatus,
                                                        FieldName: 'MaritalStatus',
                                                        DocId: 4,
                                                        EditType: 1,
                                                        ParentDocId: 3,
                                                        ParentGuid: bankApp.BankApplicationId,
                                                        CustomerLoanId: selected.CustomerLoanId
                                                    });

                                                    EditList.push({
                                                        Guid: Co.Id,
                                                        newVal: Co.isOwner,
                                                        FieldName: 'isOwner',
                                                        DocId: 4,
                                                        EditType: 1,
                                                        ParentDocId: 3,
                                                        ParentGuid: bankApp.BankApplicationId,
                                                        CustomerLoanId: selected.CustomerLoanId
                                                    });
                                                }
                                            }
                                        });

                                        // find Remove
                                        _.each(tmpOldApp.CoBorrower, function (oldCo) {
                                            if (!_.findWhere(bankApp.CoBorrower, { Id: oldCo.Id })) {
                                                EditList.push({
                                                    Guid: oldCo.Id,
                                                    DocId: 4,
                                                    EditType: 3,
                                                    ParentDocId: 3,
                                                    ParentGuid: bankApp.BankApplicationId,
                                                    CustomerLoanId: selected.CustomerLoanId
                                                });
                                            }
                                        });
                                    } else if (_.contains(BankAppCanEdit, key2)) {
                                        var tmpFieldBankApp = _.findWhere(RealBankAppFeild, { ShowField: key2 });
                                        if (key2.toLowerCase().indexOf('date') > -1 || key2.toLowerCase().indexOf('timestamp') > -1) {
                                            var newDate = new Date(bankApp[key2]);
                                            var oldDate = new Date(tmpOldApp[key2]);
                                            if (newDate.getDate() !== oldDate.getDate() || newDate.getMonth() !== oldDate.getMonth() || newDate.getFullYear() !== oldDate.getFullYear()) {
                                                EditList.push({
                                                    Guid: bankApp.BankApplicationId,
                                                    newVal: allNewServ.normalizeDatePicker(newDate),
                                                    FieldName: tmpFieldBankApp.DatabaseField,
                                                    DocId: tmpFieldBankApp.DatabaseDocId,
                                                    EditType: 2,
                                                    ParentDocId: 2,
                                                    ParentGuid: selected.CustomerLoanId,
                                                    CustomerLoanId: selected.CustomerLoanId
                                                });
                                            }
                                        } else if (key2 === "MortgageStatus") {
                                            if (bankApp[key2] !== tmpOldApp[key2]) {
                                                EditStatusList.push({
                                                    Id: _.newGuid(),
                                                    MortgageCustomerId: selected.CustomerId,
                                                    MortgageApplicationId: bankApp.BankApplicationId,
                                                    MortgageStatusId: bankApp[key2],
                                                    Remark: bankApp["Remark"],
                                                    CreateBy: USER.Email,
                                                    CreateTimeStamp: new Date(),
                                                    LastModifiedTimeStamp: new Date(),
                                                    LastModifiedBy: USER.Email,
                                                    CustomerLoanId: selected.CustomerLoanId
                                                });
                                            }
                                        } else {
                                            if (bankApp[key2] !== tmpOldApp[key2]) {
                                                EditList.push({
                                                    Guid: bankApp.BankApplicationId,
                                                    newVal: bankApp[key2],
                                                    FieldName: tmpFieldBankApp.DatabaseField,
                                                    DocId: tmpFieldBankApp.DatabaseDocId,
                                                    EditType: 2,
                                                    ParentDocId: 2,
                                                    ParentGuid: selected.CustomerLoanId,
                                                    CustomerLoanId: selected.CustomerLoanId
                                                });
                                            }
                                        }

                                    }
                                }
                            });
                        }
                    }
                });

                allNewServ.POST('BankApplication', 'UpdateList', { EditList: EditList, EditStatusList: EditStatusList }, true, 'save').then(function (res) {
                    location.reload(true);
                });
            };
            $scope.setCoEdit = function (oldCo, cus, bank, co) {
                $scope.backUpCo = angular.toJson(oldCo);
                var id = 'coeditC' + cus + 'B' + bank + 'Co' + co;
                $timeout(function () {
                    var element = $window.document.getElementById(id);
                    if (element) {
                        element.focus();
                        if (element.value === "กรุณากรอกชื่อผู้ถือกรรมสิทธิ์")
                            element.select();
                    }
                });
            };

            $scope.addRowtoEditCo = function (customerLoanId, bankAppId, listCo, ev) {
                $mdDialog.show({
                    controller: 'coborrowerDialogCtrl',
                    templateUrl: '/Content/src/modules/Mortgage/Share/Partials/coborrowerDialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        data: listCo
                    },
                    clickOutsideToClose: false
                }).then(function (answer) {
                    var findBankApp = _.chain($scope.dataList)
                        .findWhere({ CustomerLoanId: customerLoanId })
                        .pick('BankDetail').values().flatten()
                        .findWhere({ BankApplicationId: bankAppId })
                        .value();
                    if (findBankApp) findBankApp.CoBorrower = answer;
                });
            };
            $scope.openMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };
            $scope.updateMortgageStatus = function (ev, parentList, childBank) {
                $mdSelect.hide();
                $mdDialog.show({
                    controller: 'RemarkController',
                    templateUrl: '/Content/src/modules/Mortgage/Share/Partials/RemarkDialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: false
                }).then(function (result) {
                    var tmp = _.findWhere($scope.dataList, { CustomerLoanId: parentList.CustomerLoanId });
                    var tmpBank = _.findWhere(tmp.BankDetail, { BankApplicationId: childBank.BankApplicationId });
                    tmpBank.Remark = result.remark;
                }, function (reject) {
                    var backUp = _.findWhere(angular.fromJson(backUpData), { CustomerLoanId: parentList.CustomerLoanId });
                    var bankApp = _.findWhere(backUp.BankDetail, { BankApplicationId: childBank.BankApplicationId });
                    childBank.MortgageStatus = bankApp.MortgageStatus;
                });
            };
            $scope.checkUnitCodeList = null;
            $scope.showDetailReason = function (ev, reason, num) {
                $mdDialog.show({
                    controller: ShowReasonCtrl,
                    templateUrl: '/Content/src/modules/Mortgage/Share/Partials/showReason.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        data: {
                            reason: reason,
                            num: num
                        }
                    }
                }).then(function (result) { });
            };

            $scope.showDetailREunit = function (ev) {
                $mdDialog.show({
                    controller: showDetailREunitDialogCtrl,
                    templateUrl: '/Content/src/modules/Mortgage/project/start/partials/showDetailREunitDialog.templ.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        data: {
                            checkUnitCode: $scope.checkUnitCodeList
                        }
                    }
                }).then(function () { });
            };
            $scope.ImportMortgage = function (file, ev) {
                if (file !== null) {
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        output = $service.process_wb(XLSX.read(btoa($service.fixdata(e.target.result)), {
                            type: 'base64'
                        }), XLSX);
                        $mdDialog.show({
                            controller: importMortgageCustomerDialogCtrl,
                            templateUrl: '/content/src/modules/mortgage/unit/partials/_importMortgageDialog.tmpl.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            locals: { data: $importServ.requireColumnValidation(output, $scope.projectList, $scope.checkUnitCodeList, $scope.bankAppCode, $scope.customerByQuotaions, $scope.Banks) },
                            clickOutsideToClose: true
                        }).then(function (val) {
                            $scope.ShowConfirmImportMortgage(ev, val);
                        }, function () {
                            //if cancel button
                        });
                    };
                }
            };

            $scope.ShowConfirmImportMortgage = function (ev, val) {
                var output = [];
                var rowErr = _.pluck(val.errors, 'row');

                $mdDialog.show({
                    controller: confirmImportDialog,
                    templateUrl: '/content/src/modules/mortgage/unit/partials/_ConfirmImport.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: { data: val },
                    clickOutsideToClose: true
                }).then(function (val) {
                    _.each(val.output, function (element, index) {
                        if (!_.contains(rowErr, element.rowNumber))
                            output.push(element);
                    });
                    val.output = output;
                    $importServ.importProcess(val, $scope.projectList, $scope.checkUnitCodeList, $scope.trackNoList, $scope.customerByQuotaions);
                }, function () { });
            };

            $scope.addApp = function (data, ev) {
                allNewMortgageServ.addBankAppByUnit(data, ev).then(function (data) {
                    location.reload();
                });
            };

            $scope.gotoUnitDetail = function (data) {
                if (_.isNull(data.CustomerId)) window.open("/pos/unit/#!/" + data.ReUnitId);
                else window.open("/pos/unit/#!/" + data.ReUnitId + "/MortgageDetail");
            };
        });
    }
]);

function showDetailREunitDialogCtrl($scope, $mdDialog, allNewServ, data) {
    //checkUnitCode
    var haveisnot = data.checkUnitCode;
    allNewServ.GET('Project', 'GetAll', null, false, '').then(function (data) {
        $scope.projectList = data;
    });
    $scope.toggleProjectUnit = function (projId, idx) {
        $scope.units = [];
        if (idx === $scope.showUnitList) {
            $scope.showPlanList = -1;
        } else {
            $scope.showUnitList = idx;
            allNewServ.GET('unit', 'GetUnitByProjId', { id: projId.Id }, false, '').then(function (data) {
                $scope.units = data;
                for (var i = 0; i < $scope.units.length; i++) {
                    var REID = $scope.units[i].Id.toUpperCase();
                    var HaveOwner = _.findWhere(haveisnot[1].HaveOwner, { ReUnitId: REID });
                    if (!_.isUndefinedNullOrEmpty(HaveOwner)) _.extend($scope.units[i], { HaveOwner: true });
                    else _.extend($scope.units[i], { HaveOwner: false });
                }
            });
        }
    };
    $scope.cancel = function () {
        $mdDialog.hide();
    };
}
