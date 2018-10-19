function deleteDialogCtrl($scope, $mdDialog, allNewServ, $route, dataToPass) {
    $scope.Bank = [];
    $scope.Bank = dataToPass;
    console.log(dataToPass)
    $scope.emtry = []

    

    $scope.deleteAddNewBankList = function (id) {
        var deleteBank = _.findWhere($scope.Bank.Bank, { Id: id })
        deleteBank = _.reject($scope.Bank.Bank, function (showlist) { return showlist == deleteBank })
        var deleteBank2 = _.without($scope.Bank.listBankId, id)
        $scope.Bank.Bank = deleteBank;
        $scope.Bank.listBankId = deleteBank2;

    }

    $scope.deleteAddNewBankAppAll = function () {
        $scope.Bank.Bank = [];
        $scope.Bank.listBankId = [];
    }
    

    $scope.cancel = function () {
        console.log($scope.Bank.Bank)
        if ($scope.Bank.Bank.length == 0) {
            $scope.Bank = $scope.Bank.REUnitId
            console.log($scope.Bank)
            $mdDialog.hide($scope.Bank);
        } else {
        $mdDialog.hide($scope.Bank);
        }
    }
}