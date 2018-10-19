function addBankAppCtrl($mdDialog, $scope, data, allNewServ) {
    data.BankDetail = _.reject(data.BankDetail, { BankApplicationId: null });
    $scope.data = data;
    $scope.listBankForSave = [];
    $scope.dataSave = {
        customerId: data.CustomerId,
        reunitId: data.ReUnitId,
        bankId: []
    }
    $scope.selectAll = false;
    $scope.postAPI = false;
    $scope.selectLoan = 'undefined';
    var bank;
    allNewServ.GET('MortgageBank', 'Get', null, false, '').then(function (res) {
        $scope.bckupBank = res;
        res = _.reject(res, { Code: '000' });
        res = _.sortBy(res, 'Code');
        //data.unshift({ ThaiName: 'ทุกธนาคาร', Id: null })
        $scope.bankList = _.sortBy(res, 'Rank');
        var payByCashId = _.findWhere($scope.bckupBank, { Code: '000' }).Id.toUpperCase();
        $scope.payByCash = _.isUndefined(_.findWhere(data.BankDetail, { BankId: payByCashId })) ? false : true;

        $scope.checkBank = function (bankId) {
            bank = _.findWhere(data.BankDetail, { BankId: bankId.toUpperCase() });
            return _.isUndefined(bank) ? false : true;
           
        }

        $scope.checkLengthBankDetail = function () {
            return $scope.payByCash ? $scope.data.BankDetail.length - 1 : $scope.data.BankDetail.length;
        }

        $scope.checkSelectAll = function () {
            var selectAll = _.find($scope.listBankForSave, function (val) { return val == 'เลือกทั้งหมด' });
            if ($scope.selectAll) {
                angular.forEach($scope.bankList, function (val) {
                    var tmp = _.find($scope.listBankForSave, function (value) { return val.Id == value });
                    if (_.isUndefined(tmp)) $scope.listBankForSave.push(val.Id);
                })
            } else {
                var tmp = _.pluck($scope.data.BankDetail, 'BankId');
                $scope.listBankForSave = _.reject($scope.listBankForSave, function (val) {
                    return !_.contains(tmp, val.toUpperCase());
                })
            }
        }

        $scope.checkToggleAll = function () {
            if ($scope.listBankForSave.length == $scope.bankList.length) {
                return true;
            } else {
                return false;
            }
        }
        console.log(bank);
    });

    $scope.cancel = function () {
        $mdDialog.cancel();
    }

    $scope.submit = function () {
        $scope.postAPI = true;
        if ($scope.selectLoan == 'payByCash') {
            $scope.dataSave.bankId.push(_.findWhere($scope.bckupBank, { Code: '000' }).Id);
        } else {
            $scope.listBankForSave = _.reject($scope.listBankForSave, function (val) {
                return !_.isUndefined(_.findWhere(data.BankDetail, { BankId: val.toUpperCase() }))
            });
            $scope.dataSave.bankId = $scope.listBankForSave;
        }
        allNewServ.POST('bankApplication', 'addBankApplication', $scope.dataSave, false, '').then(function (res) {
            $mdDialog.hide(res);
        });
    }
}
