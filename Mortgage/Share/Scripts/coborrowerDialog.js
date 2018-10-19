mortgageUnitApp.controller('coborrowerDialogCtrl', function ($scope, $mdDialog, data, ENUM) {
    data = _.reject(data, function (val) { return val.Id == null })
    angular.forEach(data, function (val) {
        val.isOwner = val.isOwner == 1 ? true : false;
    })
    console.log(data)
    var bckup = angular.toJson(data)
    $scope.CoBorrowers = [];
    $scope.maritalStatus = ENUM.MaritalStatus;
    if (!_.isUndefined(data)) $scope.CoBorrowers = angular.fromJson(bckup)
    $scope.addCoBorrowers = function () {
        if ($scope.CoBorrowers.length == 5) {

        } else {
            $scope.CoBorrowers.push({ Id: _.newGuid(), Name: null })
        }
    }

    $scope.removeCoBorrowers = function (id) {
        $scope.CoBorrowers = _.reject($scope.CoBorrowers, { Id: id });
    }

    $scope.submit = function () {
        $scope.CoBorrowers = _.reject($scope.CoBorrowers, function (val) { return val.Name == null || val.Name == '' })
        _.each($scope.CoBorrowers, function (co, index) {
            (co.isOwner) ? co.isOwner = 1 : co.isOwner = 0;
        })
        $mdDialog.hide($scope.CoBorrowers);
    }

    $scope.cancel = function () {
        $mdDialog.cancel();
    }
});