function addUnitCtrl($scope, $mdDialog, allNewServ, $route , data) {
    $scope.filter = {
        BankId: '',
        ProjectId: '',
    };
    $scope.user = data;

    var bank2;
    var testbank;
    $scope.selectLoan = 'undefined';
    var testdataselect;

    var mockdatabank = [];
    var mockselectbank = [] ;
    allNewServ.GET('MortgageBank', 'get', null, false, '').then(function (bank) {
        bank = _.sortBy(bank, 'Rank');
        testbank = _.reject(bank, function (bank) { return bank.Code != 000 })
        bank = _.reject(bank, function (bank) { return bank.Code == 000 })
        $scope.listBank = bank
        
    })

    allNewServ.GET('Project', 'GetProjectofWorker', {workerId: USER.WID}, false, '').then(function (project) {
        $scope.listProject = project
     
    })

    $scope.cancel = function () {
        $mdDialog.hide();
    }
    $scope.addNewBankAppp = ''

    $scope.selectUnit = function () {
        $scope.addNewBankAppp = ''
       
        testdataselect = $scope.selectLoan;
        var obj = { projectId: $scope.filter.ProjectId, bankId: $scope.filter.BankId };
        
        if ($scope.selectLoan != 'payByCash') {
            if ($scope.user.BankCode != null) {
                mockdatabank.push($scope.user.BankId);
                mockselectbank = $scope.user.BankCode;
                var obj = { projectId: $scope.filter.ProjectId, bankId: mockdatabank };
                allNewServ.POST('BankApplication', 'getUnitForAddAppDialog', obj, false, '').then(function (val) {
                    $scope.newBankAppList2 = val;
                });
               
            }
            else if (_.isUndefinedNullOrEmpty(obj.bankId)) {
                console.log('test1')
            }
            else {
            allNewServ.POST('BankApplication', 'getUnitForAddAppDialog', obj, false, '').then(function (val) {
                $scope.newBankAppList2 = val;
                $scope.checkBank = function (bankId2) {
                    bank2 = _.findWhere($scope.newBankAppList2.bankId, { bankId: bankId2 });
                    return _.isUndefined(bank2) ? false : true;
                }
                });
                
            }
        } else if (testdataselect === 'payByCash' ) {
            var testdata = ["7F7D11DD-2E7A-4007-AAE4-57872090408D"]
            var obj = { projectId: $scope.filter.ProjectId, bankId: testdata };
            allNewServ.POST('BankApplication', 'getUnitForAddAppDialog', obj, false, '').then(function (val) {
                $scope.newBankAppList2 = val;
            });
        }
    }

    var thisBank;
    var dataToPass = [];
    var testwaitsave = [];
    $scope.newBankAppList = [];
    $scope.newBankAppList2 = [];
    var splitUnitByCommas

  
    $scope.addNewBankAppFunc = function (unit) {
        if (angular.isArray(unit)) {
            splitUnitByCommas = unit;
        } else {
            splitUnitByCommas = unit.split(',');
        }
        //console.log(splitUnitByCommas)
        _.each(splitUnitByCommas, function (reunitCode, key) {
            thisBank = _.findWhere($scope.newBankAppList2, { REUnitId: reunitCode });

            var selectBank = _.chain($scope.listBank)
                .filter(function (obj) {
                    return _.contains($scope.filter.BankId, obj.Id)
                })
                .value()

            var AllBank = _.chain($scope.listBank)
                .filter(function (obj) {
                    return _.contains(thisBank.listBankId, obj.Id.toUpperCase())
                })
                .value()
          
            var Banklogo = _.findWhere($scope.newBankAppList, { REUnitId: reunitCode })

            var testBanknotnull = _.findWhere($scope.newBankAppList2, { REUnitId: reunitCode })

            //findwhere bank

            var testwaittakedata = _.chain($scope.listBank)
                .filter(function (obj) {
                    return _.contains(thisBank.listBankId ,obj.Id)
                })
                .value()


            if (Banklogo) {
                if (Banklogo != null) {
                    if (testdataselect === 'payByCash' && testBanknotnull.bankId != null) {
                        var addBank3 = _.union(Banklogo.Bank, testbank)
                        var addBankid = _.union(Banklogo.listBankId, ['7f7d11dd-2e7a-4007-aae4-57872090408d'])
                        Banklogo.Bank = addBank3;
                        Banklogo.listBankId = addBankid;
                    }
                    else if (testdataselect === 'payByCash' && testBanknotnull.bankId == null) {
                        var addBank3 = _.union(Banklogo.Bank, testbank)
                        var addBankid = _.union(Banklogo.listBankId, ['7f7d11dd-2e7a-4007-aae4-57872090408d'])
                        Banklogo.Bank = addBank3;
                        Banklogo.listBankId = addBankid;
                    }
                    else if ($scope.user.BankCode != null && testBanknotnull.bankId == null) {
                        var addBank2 = _.union(Banklogo.Bank, testwaittakedata)
                        var addBankid = _.union(Banklogo.listBankId, thisBank.listBankId)
                        Banklogo.Bank = addBank2;
                        Banklogo.listBankId = addBankid;
                    }

                    else if (testBanknotnull.bankId != null) {
                        var addBank = _.union(Banklogo.Bank, AllBank)
                        var addBankid = _.union(Banklogo.listBankId, _.pluck(AllBank, 'Id'))
                        Banklogo.Bank = addBank;
                        Banklogo.listBankId = addBankid;

                    } else if (testBanknotnull.bankId == null) {
                        var addBank2 = _.union(Banklogo.Bank, selectBank)
                        var addBankid = _.union(Banklogo.listBankId, _.pluck(selectBank, 'Id'))
                        Banklogo.Bank = addBank2;
                        Banklogo.listBankId = addBankid;
                    }
                    
                } else {
                }
            }

            else if (testdataselect === 'payByCash' && testBanknotnull.bankId != null) {
                $scope.newBankAppList.push({
                    unit: thisBank.REUnitCode,
                    ProjectName: thisBank.ProjectName,
                    LoanDate: new Date(),
                    Bank: testbank,
                    listBankId: _.pluck(testbank, 'Id'),
                    CustomerName: thisBank.CustomerName,
                    REUnitCode: thisBank.REUnitCode,
                    customerId: thisBank.customerId,
                    projectId: thisBank.projectId,
                    REUnitId: thisBank.REUnitId,
                    bankId: thisBank.bankId,
                    customerLoanId: thisBank.customerLoanId
                })
            }

            else if (testdataselect === 'payByCash' && testBanknotnull.bankId == null) {
                $scope.newBankAppList.push({
                    unit: thisBank.REUnitCode,
                    ProjectName: thisBank.ProjectName,
                    LoanDate: new Date(),
                    Bank: testbank,
                    listBankId: _.pluck(testbank, 'Id'),
                    CustomerName: thisBank.CustomerName,
                    REUnitCode: thisBank.REUnitCode,
                    customerId: thisBank.customerId,
                    projectId: thisBank.projectId,
                    REUnitId: thisBank.REUnitId,
                    bankId: thisBank.bankId,
                    customerLoanId: thisBank.customerLoanId
                })
            }
            else if ($scope.user.BankCode != null) {
                $scope.newBankAppList.push({
                    unit: thisBank.REUnitCode,
                    ProjectName: thisBank.ProjectName,
                    LoanDate: new Date(),
                    Bank: testwaittakedata,
                    listBankId: thisBank.listBankId,
                    CustomerName: thisBank.CustomerName,
                    REUnitCode: thisBank.REUnitCode,
                    customerId: thisBank.customerId,
                    projectId: thisBank.projectId,
                    REUnitId: thisBank.REUnitId,
                    bankId: thisBank.bankId,
                    customerLoanId: thisBank.customerLoanId
                })
            }

            else if (testBanknotnull.bankId != null) {
                $scope.newBankAppList.push({
                    unit: thisBank.REUnitCode,
                    ProjectName: thisBank.ProjectName,
                    LoanDate: new Date(),
                    Bank: AllBank,
                    listBankId: thisBank.listBankId,
                    CustomerName: thisBank.CustomerName,
                    REUnitCode: thisBank.REUnitCode,
                    customerId: thisBank.customerId,
                    projectId: thisBank.projectId,
                    REUnitId: thisBank.REUnitId,
                    bankId: thisBank.bankId,
                    customerLoanId: thisBank.customerLoanId
                })
            }

            else if (testBanknotnull.bankId == null) {
                $scope.newBankAppList.push({
                    unit: thisBank.REUnitCode,
                    ProjectName: thisBank.ProjectName,
                    LoanDate: new Date(),
                    Bank: selectBank,
                    listBankId: _.pluck(selectBank, 'Id'),
                    CustomerName: thisBank.CustomerName,
                    REUnitCode: thisBank.REUnitCode,
                    customerId: thisBank.customerId,
                    projectId: thisBank.projectId,
                    REUnitId: thisBank.REUnitId,
                    bankId: thisBank.bankId,
                    customerLoanId: thisBank.customerLoanId
                })
                
            }
            else { 
            }
        });
     
        
       
        testwaitsave = $scope.newBankAppList
    };

    $scope.btnCheckBank = function (ev, unit) {
        banknotnull = _.chain($scope.newBankAppList)
            .reject(function (bank) {
                return bank.bankId == null
            }).map(function (bank) {
                return {
                    unitCode: bank.REUnitCode,
                    bankId: bank.bankId.toLowerCase().split(','),
                    CustomerName: bank.CustomerName,
                    ProjectName: bank.ProjectName,
                    REUnitId: bank.REUnitId
                }
            })
            .value()

        var checkdata = _.reject(banknotnull, function (check) { return check.REUnitId != unit })
        if (banknotnull.length != 0) {
            $mdDialog.show({
                locals: { dataToPass2: checkdata, listbank: $scope.listBank },
                controller: showBankDialogCtrl,
                templateUrl: '/content/src/modules/mortgage/Share/partials/showBankDialog.tmpl.html',
                skipHide: true,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
            }).then(function (res) {

            });
        }
    }
    
    $scope.setTime = function (date) {
        return allNewServ.normalizeDatePicker(date)
    }

    $scope.showAdvanced = function (ev, unit) {
        $mdDialog.show({
            locals: { dataToPass: _.findWhere($scope.newBankAppList, { unit: unit }) },
            controller: deleteDialogCtrl,
            templateUrl: '/content/src/modules/mortgage/Share/partials/deleteBankdialog.tmpl.html',
            skipHide: true,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            
        }).then(function (res) {
            if (angular.isString(res)) {
                var deleteBank = _.findWhere($scope.newBankAppList, { REUnitId: res })
                deleteBank = _.reject($scope.newBankAppList, function (showlist) { return showlist == deleteBank })
                testwaitsave = $scope.newBankAppList = deleteBank;
            }
        });
        
    }

    $scope.deleteAddNewBankAppAll = function () {
        $scope.newBankAppList = [];
    }

    $scope.deletevalue = function () {
        $scope.filter = {
            BankId: null,
            ProjectId: null
        };
        $scope.addNewBankAppp = ''
    }

    $scope.deleteAddNewBankList = function (id) {
        var deleteBank = _.findWhere($scope.newBankAppList, { unit: id })
        deleteBank = _.reject($scope.newBankAppList, function (showlist) { return showlist == deleteBank })
        $scope.newBankAppList = deleteBank;
    }
    $scope.newBankAppList2 = [];
    $scope.ChangBank = function () {

        var obj = { projectId: $scope.filter.ProjectId, bankId: $scope.filter.BankId };
        if (_.isUndefinedNullOrEmpty(obj.bankId)) {
        } else {
            allNewServ.POST('BankApplication', 'getUnitForAddAppDialog', obj, false, '').then(function (val) {
                $scope.newBankAppList2 = val;

                $scope.checkBank = function (bankId2) {
                    bank2 = _.findWhere($scope.newBankAppList2.bankId, { bankId: bankId2 });
                    return _.isUndefined(bank2) ? false : true;
                }
            });
        }
    }


    $scope.submit = function () {
        allNewServ.POST('BankApplication', 'addMutipleBankApplication', testwaitsave, false, '').then(function (val) {
            $mdDialog.hide();
            $route.reload();
        });
    }

}