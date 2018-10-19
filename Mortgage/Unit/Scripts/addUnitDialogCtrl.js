function AddUnitDialogCtrl($mdDialog, $scope, allNewServ, $routeParams, data, $service, $importServ) {
    $scope.selectProject = null;
    $scope.selectBank = null;
    $scope.selectUnit = null;
    $scope.trackNoList = data;
    $scope.showGrid = true;
    $scope.showList = false;
    $scope.selectAllBool = false;
    $scope.error = false;
    var mortgageActs = [];
    var bankApps = [];
    $scope.filter = {
        project: null,
        BankId: null,
        Search: null
    };
    INITPromise.then(function (obj) {

        allNewServ.GET('Project', 'GetAll', null, false, '').then(function (projects) {
            $scope.projectList = projects
        })
        allNewServ.GET('MortgageBank', 'Get', null, false, '').then(function (data) {
            data = _.sortBy(data, 'Code');
            data.unshift({ ThaiName: 'กรุณาเลือกธนาคาร', Id: null })

            $scope.bankList = data;
            console.log($scope.bankList)
            //$scope.filter.BankId = $scope.bankList[0].Id;
        })
    })
    $scope.newBankAppList = [];
    $scope.addNewBankAppFunc = function (unit) {
        $scope.addNewBankApp = "";
        $scope.unitNotFound = [];
        $scope.unitHasApp = [];
        $scope.unitIsSelected = [];
        var thisBank = _.findWhere($scope.bankList, { Id: $scope.filter.BankId });
        var proCode = _.findWhere($scope.projectList, { Id: $scope.filter.ProjectId }).Code;
        var splitUnitByCommas = unit.split(',');
        console.log(splitUnitByCommas)
        console.log(proCode)
        for (var i = 0; i < splitUnitByCommas.length; i++) {
            var findUnit = _.findWhere($scope.units, { ReUnitCode: splitUnitByCommas[i].trim(), ProjeceCode: proCode });
            console.log(findUnit)
            if (_.isUndefinedNullOrEmpty(findUnit)) {
                $scope.unitNotFound.push(splitUnitByCommas[i].trim());
            } else if (findUnit.HasApp === 1) {
                $scope.unitHasApp.push(splitUnitByCommas[i].trim());
            } else if (_.findWhere($scope.newBankAppList, { ReUnitCode: splitUnitByCommas[i].trim(), BankGuid: $scope.filter.BankId, ProjeceCode: proCode })) {
                $scope.unitIsSelected.push(splitUnitByCommas[i].trim());
            } else {
                $scope.newBankAppList.push(_.extend(findUnit, {
                    BankGuid: $scope.filter.BankId,
                    BankName: thisBank.ThaiName
                }));
            }
        }
    };
    $scope.deleteAddNewBankAppAll = function () {
        $scope.newBankAppList = [];
    };
    $scope.deleteAddNewBankList = function (item) {
        $scope.newBankAppList = _.reject($scope.newBankAppList, function (ba) {
            return ba.ReUnitCode === item.ReUnitCode && ba.BankGuid === item.BankGuid;
        });
    };
    $scope.deleteUnitNotFound = function (idx) {
        if (idx > -1) {
            $scope.unitNotFound.splice(idx, 1);
        }
    };
    $scope.deleteUnitHasApp = function (idx) {
        if (idx > -1) {
            $scope.unitHasApp.splice(idx, 1);
        }
    };
    $scope.deleteUnitIsSelected = function (idx) {
        if (idx > -1) {
            $scope.unitIsSelected.splice(idx, 1);
        }
    };
    $scope.Changfilter = function () {
        $scope.selected = [];
        if (!_.isUndefinedOrNull($scope.filter.BankId))
            allNewServ.POST('MortgageBank', 'GetStatusUnit', $scope.filter, false, '').then(function (data) {
                $scope.units = data;
            });
    }
    $scope.exportAddBankApp = function () {
        var bankname = _.findWhere($scope.bankList, { Id: $scope.filter.BankId })
        $service.exportTmpForAddApp(bankname.ThaiName);
    }

    $scope.ImportAddApp = function (file, ev) {
        allNewServ.POST('MortgageBank', 'GetStatusUnit', {
            ProjectId: null,
            BankId: $scope.filter.BankId,
            Search: null
        }, false, null).then(function (data) {
            //$scope.GetAvailableUnits = _.where(data, { HasApp: 0 });
            $scope.GetAvailableUnits = data;
            if (file !== null) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = function (e) {
                    output = $service.process_wb(XLSX.read(btoa($service.fixdata(e.target.result)), {
                        type: 'base64'
                    }), XLSX);
                    $mdDialog.show({
                        controller: ImportMortgageBankUnitDialogCtrl,
                        templateUrl: '/content/src/modules/mortgage/bank/start/partials/_ImportMortgageBankUnitCtrlDialog.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: { data: $importServ.requireColumnBank(output, $scope.GetAvailableUnits, $scope.filter.BankId) },
                        clickOutsideToClose: true,
                        skipHide: true
                    }).then(function (val) {
                        var result = $scope.submit2(val);
                        allNewServ.POST('BankApplication', 'Create', result, true, 'created').then(function () {
                            location.reload();
                        });
                    }, function () {
                    });
                }
            }
        });
    };

    $scope.MultipleSelected = [];
    $scope.MultipleEditCheck = [];
    $scope.selected = [];
    $scope.unitSelected = [];
    $scope.SelectAll = function () {
        if ($scope.selected.length === _.filter($scope.units, function (u) { return u.HasApp === 0; }).length) {
            $scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
            $scope.selected = _.filter($scope.units, function (u) {
                return u.HasApp === 0;
            });
            // $scope.selected = $scope.units.slice(0);         
        }
    };
    $scope.toggle = function (units, list) {
        var idx = list.indexOf(units);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            $scope.selected.push(units);
        }
    };
    $scope.exists = function (units, list) {
        return list.indexOf(units) > -1;
    };
    $scope.setdata = function (val) {
        $scope.error = false;
        mortgageActs = [];
        bankApps = [];
        console.log('val', val)

        var datetimenow = new Date();
        for (var i = 0; i < val.length; i++) {
            bankApps.push({
                Id: _.newGuid(),
                CustomerLoanId: val[i].CustomerLoanId,
                BankId: val[i].BankGuid,
                TrackNo: $scope.makeid(),
                Date: datetimenow,
                LoanDate: _.isUndefinedOrNull(val[i].LoanDate) ? datetimenow : allNewServ.normalizeDatePicker(val[i].LoanDate),
                LoanApprovedDate: '',
                TransferDate: '',
                TotalAmount: '',
                LoanStatus: '',
                CustomerServiceName: val[i].CustomerServiceName,
                CustomerServicePhone: val[i].customerservicephone,
                RejectReason: '',
                CreateBy: USER.Email,
                CreateTimeStamp: datetimenow,
                LastModifiedBy: USER.Email,
                LastModifiedTimeStamp: datetimenow
            });
            mortgageActs.push({
                Id: _.newGuid(),
                MortgageCustomerId: val[i].CustomerId,
                MortgageApplicationId: bankApps[i].Id,
                MortgageStatusId: 3,
                NoteToBank: '',
                CreateBy: USER.Email,
                CreateTimeStamp: datetimenow,
                LastModifiedBy: USER.Email,
                LastModifiedTimeStamp: datetimenow

            });
        }
        return bankApps, mortgageActs
    }
    $scope.submit = function () {
        //console.log($scope.selected);
        //$scope.setdata($scope.selected);
        //console.log(bankApps)
        $scope.setdata($scope.newBankAppList);

        var Track = []
        for (var i = 0; i < bankApps.length - 1; i++) {
            Track.push(bankApps[i].TrackNo)
        }
        var nums2 = Track;
        var result2 = nums2.filter(a => (nums2.filter(b => (a == b)).length != 1));
        if (result2.length > 0) {
            $scope.submit();

        } else {
            var CreateApp = {
                ListApp: bankApps,
                ListAct: mortgageActs
            }
            $mdDialog.hide(CreateApp);
        }

    }
    $scope.submit2 = function (val) {
        $scope.setdata(val);
        var result = null;
        for (var i = 0; i < bankApps.length - 1; i++) {
            if (bankApps[i + 1].TrackNo == bankApps[i].TrackNo) {
                $scope.error = true
            }
        }
        if ($scope.error) {
            $scope.submit2(val);

        } else {
            var CreateApp = {
                ListApp: bankApps,
                ListAct: mortgageActs
            }
            result = CreateApp;
        }
        return result;
    }
    $scope.makeid = function () {
        var TrackNew = "";
        var text = "";
        var text2 = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numpPossible = "0123456789";
        for (var i = 0; i < 2; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        for (var i = 0; i < 4; i++)
            text2 += numpPossible.charAt(Math.floor(Math.random() * numpPossible.length));
        TrackNew = text + text2;
        var err = _.findWhere($scope.trackNoList, { TrackNo: TrackNew })
        if (!_.isUndefinedNullOrEmpty(err)) {
            $scope.makeid();
        } else {
            return TrackNew
        }
    }
    $scope.cancel = function () {
        $mdDialog.cancel();
    }
    $scope.clear = function () {
        $scope.selected = [];
    }
    $scope.close = function () {
        $scope.selected = [];
        $mdDialog.cancel();
    }
}
function ImportMortgageBankUnitDialogCtrl($scope, $mdDialog, data) {
    $scope.importdata = data;

    $scope.cancel = function () {
        $mdDialog.cancel();
    }
    $scope.submit = function () {
        $mdDialog.hide(data.correctData);
    }
}