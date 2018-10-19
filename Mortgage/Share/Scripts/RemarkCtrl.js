mortgageUnitApp.controller('RemarkController', function ($scope, $mdDialog) {
    $scope.note = '';
    $scope.remark = '';

    $scope.cancel = function () {
        $mdDialog.cancel();
    }

    $scope.saveRemark = function () {
        $mdDialog.hide({
            note: null,
            remark: $scope.remark
        });
    }

    $scope.checkDisable = function () {
        return _.isUndefinedNullOrEmpty($scope.remark)
    }
});