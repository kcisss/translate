function importMortgageCustomerDialogCtrl($scope, $mdDialog, data) {

   
    $scope.tableHeader = [
        { Name: "แถวที่", width: '32px'},
        { Name: "ยูนิตที่กู้", width: '150px' },
        { Name: "รหัสโครงการ", width: '150px' },
        { Name: "ชื่อโครงการ", width: '200px' },
        { Name: "วันที่ยื่นกู้", width: '150px' },
        { Name: "ชื่อผู้กู้", width: '200px' },
        { Name: "เบอร์โทรศัพท์ผู้กู้", width: '150px' },
        { Name: "ธนาคารที่ยื่นกู้", width: '120px' },
        { Name: "สาขาธนาคาร", width: '120px' },
        { Name: "สถานะการยื่นกู้", width: '120px' },
        { Name: "เกรด", width: '40px' },
        { Name: "หมายเหตุ", width: '100px' },
        { Name: "ประเภทการยื่นกู้", width: '100px' },
        { Name: "วันที่อนุมัติ", width: '80px' },
        { Name: "วันที่จำนอง", width: '80px' },
        { Name: "วงเงินขอกู้", width: '80px' },
        { Name: "ค่าเบี้ยประกัน", width: '80px' },
        { Name: "หักค่าใช้จ่ายล่วงหน้า", width: '100px' },
        { Name: "วงเงินเคหะ", width: '80px' },
        { Name: "วงเงินตกแต่ง", width: '80px' },
        { Name: "วงเงินจำนองรวม", width: '80px' },
        { Name: "วงเงินอื่นๆ", width: '80px' },
        { Name: "ชื่อเจ้าหน้าที่ธนาคาร", width: '120px' },
        { Name: "เบอร์โทรศัพท์เจ้าหน้าที่ธนาคาร", width: '120px' },
        { Name: "ผู้ดูแลโครงการ", width: '120px' },
        { Name: "เบอร์โทรศัพท์ผู้ดูแลโครงการ", width: '120px' }
    ];
    $scope.errors = data.errors;
    $scope.summary = data.summary;
    $scope.errRow = _.chain($scope.errors)
        .groupBy(function (err) {
            return err.row;
        })
        .map(function (grouped) {
            return grouped[0];
        })
        .value()
    $scope.errfield = _.chain(data.errors)
        .map(function (val) {
            return { row: val.row, field: val.reason[0].error }
        })
        .groupBy(function (err) {
            return err.field;
        })
        .value()
    $scope.countField = _.chain($scope.errfield)
        .map(function (val) {
            return { field: val }
        })
        .value()
    if (data.output !== null) {
        var FindLastRow = data.output[data.output.length - 1];
        if (!_.isUndefinedNullOrEmpty(FindLastRow)) {
            var lastRow = FindLastRow.rowNumber;
            $scope.allData = [];
            for (var i = 2; i <= lastRow; i++) {
                $scope.allData.push(_.findWhere(data.output, { rowNumber: i }))
            }
        }
    } else {
        $scope.allData = data.output;
    }


    $scope.cancel = function () {
        $mdDialog.cancel();
    }

    $scope.submit = function () {
        $mdDialog.hide(data);
    }
    $scope.checkIcon = function (row) {
        return _.findWhere($scope.errors, { row: row })
    }
    $scope.checkWarning = function (row) {
        return _.findWhere($scope.newProject, { ProjectCode: row['รหัสโครงการ'], ProjectName: row['ชื่อโครงการ'] }) || _.findWhere($scope.newUnit, { UnitCode: row['ยูนิตที่ขาย'] })
    }
    $scope.getColor = function (row) {
        if (_.findWhere($scope.errors, { row: row })) {
            return '#e01e1e';
        } else {
            row = $scope.allData[row - 2]
            if (_.findWhere($scope.newProject, { ProjectCode: row['รหัสโครงการ'], ProjectName: row['ชื่อโครงการ'] }) || _.findWhere($scope.newUnit, { UnitCode: row['ยูนิตที่ขาย'] })) {
                return '#FFD54F';
            } else
                return '#52a356';
        }
    }

    $scope.getErrorField = function (val) {
        var result = _.chain($scope.errors)
            .filter(function (err) {
                return err.row === val.row
            })
            .map(function (err) {
                return { reason: err.reason[0].error}
            })
            .pluck('reason')
            .contains(val.field)
            .value()
        return result;
    }
    $scope.getField = function (val) {
        var result = _.chain($scope.errors)
            .filter(function (err) {
                return err.row === val.row && err.reason[0].error == val.field
            })
            .map(function (err) {
                return { reason: err.reason[0].message }
            })
            .pluck('reason')
            .first()
            .value()
        return result;
    }

}