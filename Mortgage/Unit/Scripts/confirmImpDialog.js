function confirmImportDialog($scope, $mdDialog, data) {

    var rowErr = _.pluck(data.errors, 'row')
    $scope.impSuccess = data.output.length - _.uniq(rowErr).length
    $scope.impErr = _.uniq(rowErr).length
    $scope.cancel = function () {
        $mdDialog.cancel();
    }

    $scope.submit = function () {
        $mdDialog.hide(data);
    }
}