function confirmExportMortgageCtrl($scope, $mdDialog) {
    $scope.submit = function () {
        $mdDialog.hide($scope.choose);
    }
    $scope.cancel = function () {
        $mdDialog.cancel();
    }
}