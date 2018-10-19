function AddCustomerCtrl($mdDialog, $scope, allNewServ, $routeParams, data, $service, ENUM) {

    $scope.Err = false
    var datetimenow = new Date();
    $scope.states = ENUM.MaritalStatus
    allNewServ.GET('unit', 'Get', { id: data.ReUnitId }, false, null).then(function (res) {
        $scope.unit = res

    });
    $scope.save = function () {
        var customers = []
        var mortgageActs = []
        var customerLoans = []
        var REUnits = []
        if (!_.isUndefinedOrNull($scope.user)) {
            var findMaritalStatusId = _.findWhere(ENUM.MaritalStatus, { name: $scope.user.customerMaritalStatus });
        }
        customers.push({
            Id: _.newGuid(),
            Name: $scope.user.customerName,
            Phone: !_.isUndefinedNullOrEmpty($scope.user.customerPhone) ?   $scope.user.customerPhone : ""   ,
            MaritalStatus: !_.isUndefinedNullOrEmpty(findMaritalStatusId) ? findMaritalStatusId.status : ""
        });
        customerLoans.push({
            Id: _.newGuid(),
            CustomerId: customers[0].Id,
            REUnitId: data.ReUnitId,
            ProjectId: data.ProjectId,
            Status: 1,
            LastModifiedTimeStamp: datetimenow,
        });
        mortgageActs.push({
            Id: _.newGuid(),
            MortgageCustomerId: customers[0].Id,
            MortgageApplicationId: null,
            MortgageStatusId: 1,
            NoteToBank: '',
            CreateBy: USER.Email,
            CreateTimeStamp: datetimenow,
            LastModifiedBy: USER.Email,
            LastModifiedTimeStamp: datetimenow

        });
        REUnits.push({
            Id: data.ReUnitId,
            ProjectId: data.ProjectId,
            Code: $scope.unit.Code,
            AddressNo: $scope.unit.AddressNo,
            SellingPrice: $scope.unit.SellingPrice,
        });

        var postObj = {
            customers: customers,
            customerLoans: customerLoans,
            mortgageActivities: mortgageActs,
            reunits: REUnits

        };
        if (_.isUndefinedOrNull($scope.user.customerName) || $scope.user.customerName == ""){
            $scope.Err = true
        } else {
            $scope.Err = false

        }
        if (_.isUndefinedOrNull($scope.user.customerPhone) || $scope.user.customerPhone == "") { $scope.Err = true}
        if (!$scope.Err) {
            allNewServ.POST('customer', 'AddCustomer', postObj, true, 'created').then(function (res) {
                    location.reload(true);

            });
        }
    }
    $scope.cancel = function () {
        $mdDialog.cancel()
    }
}

