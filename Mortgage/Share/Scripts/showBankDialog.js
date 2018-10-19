function showBankDialogCtrl($scope, $mdDialog, allNewServ, $route, dataToPass2, listbank) {
    $scope.showbank = [];
    $scope.showbank = dataToPass2;
    $scope.listBank = [];
    $scope.listBank = listbank;

   
    $scope.testshowbank = function (value2) {
        $scope.test = _.findWhere($scope.listBank, { Id: value2 })
        return $scope.test;
    }
 
    $scope.cancel = function () {
        $mdDialog.hide();
    }
}