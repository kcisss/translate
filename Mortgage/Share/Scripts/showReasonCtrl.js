function ShowReasonCtrl($scope, $mdDialog, data) {
    $scope.number = data.num
    $scope.label = ''
    if ($scope.number == 1) {
        $scope.label = '#เหตุผลในการเปลี่ยนสถานะ'
    } else if ($scope.number == 2) {
        $scope.label = '#เเหตุผลในการไม่อนุมัติ'

    } else if ($scope.number == 3) {
        $scope.label = '#เหตุผลที่อนุมัติแล้วยกเลิก'

    }

    $scope.reason = data.reason
    $scope.cancel = function () {
        $mdDialog.cancel();
    }
};