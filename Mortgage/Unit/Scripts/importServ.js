mortgageUnitApp.factory('$importServ', function (allNewServ, ENUM, $timeout) {
    var srvObj = {
        importProcess: function (data, pjl, CheckUnitCode, trackNoList, customerByQuotaions) {
            var w8Update = false;
            var w8Create = false;
            var val = data.output;
            //var Newproject = data.newProject;
            //var NewREUunit = data.newUnit;
            var customers = [];
            var UpdaleREunit = [];
            var customerLoans = [];
            var mortgageActs = [];
            var datetimenow = new Date();
            var NameCheck = [];
            var REUnitCheck = [];
            var Updatecustomers = [];
            var UpdatecustomerLoans = [];
            var updatebankapps = [];
            var coborrowers = [];
            var bankApps = [];
            var modelImp = {
                IDNo: 'เลขที่บัตรประจำตัวประชาชน',
                CSName: 'ชื่อผู้ดูแลโครงการ',
                CSPhone: 'เบอร์โทรศัพท์ผู้ดูแลโครงการ',
                CustomerName: 'ชื่อผู้ถือสัญญา',
                CustomerPhone: 'เบอร์โทรศัพท์ผู้ถือสัญญา',
                MaritalStatus: 'สถานภาพ',
                ProjectCode: 'รหัสโครงการ',
                SourceofIncome: 'ที่มาของรายได้',
                WorkPlace: 'สถานที่ทำงาน',
                trackNo: 'TrackingNo',
                coborrowers: 'รายชื่อ-กรรมสิทธิ์',
                Mortgagestatus: 'สถานะการยื่นกู้',
                REUnitCode: 'ยูนิตที่กู้'
            };
            //var allREUnit = _.union(CheckUnitCode[0].NotHave, CheckUnitCode[1].HaveOwner)
            var codeNameBanks = [];
            var convertYesNoToBoolean = function (value) {
                if (value) return 1
                else if (_.isUndefinedNullOrEmpty(value) || !value) return null
            }

            var findMaritalStatusFromENUM = function (value) {
                var tmp = _.findWhere(ENUM.MaritalStatus, { name: value })
                return tmp ? tmp.status : null
            }

            var maperCoborrowers = {
                Name: 'ผู้กู้ร่วมคนที่',
                MaritalStatus: 'สถานภาพผู้กู้ร่วมคนที่',
                IsOwner: 'เป็นผู้ถือกรรมสิทธิ์คนที่',
                max: 5,
                getValueFromObj: function (obj, index) {
                    return {
                        Name: obj[this.Name + index],
                        MaritalStatus: findMaritalStatusFromENUM(obj[this.MaritalStatus + index]),
                        IsOwner: convertYesNoToBoolean(obj[this.IsOwner + index])
                    }
                }
            }

            for (var j = 0; j < val.length; j++) {
                if (!_.contains(NameCheck, val[j][modelImp.CustomerName])) {
                    NameCheck.push({ idNo: val[j][modelImp.IDNo], Name: val[j][modelImp.CustomerName] });
                }
            }
            allNewServ.GET('MortgageBank', 'Get', null, false, '').then(function (Bank) {
                allNewServ.GET('customer', 'GetAllBankAppRelateForcs', null, false, null).then(function (allRelateList) {
                    for (var i = 0; i < val.length; i++) {
                        //var findCustomerByIDName = _.findWhere(CheckIdentificationCustomer, { Name: val[i][modelImp.CustomerName] });
                        var findBankAppByTrackNo = _.findWhere(allRelateList, { TrackNo: val[i][modelImp.trackNo] });
                        var tracking = _.chain(val[i])
                            .keys()
                            .contains(modelImp.trackNo)
                            .value()
                        if (!tracking) {
                            var pro = _.findWhere(pjl, { Code: val[i][modelImp.ProjectCode] });
                            var customerLoan = _.isUndefinedNullOrEmpty(val[i].REUnit.CL) ? _.newGuid() : val[i].REUnit.CL;
                            if (!_.isUndefinedNullOrEmpty(val[i].isREUnit)) {
                                var customerGuId = val[i].isREUnit.CustomerId
                                var isCustomerLoan = _.chain(customerLoans)
                                    .map(function (cusLoan) {
                                        return cusLoan.REUnitId + cusLoan.CustomerId
                                    })
                                    .contains(val[i].REUnit.ReUnitId + customerGuId)
                                    .value()
                                //REUnit.ReUnitId
                                if (_.isUndefinedNullOrEmpty(val[i].REUnit.CL) && !isCustomerLoan) {
                                    customerLoans.push({
                                        Id: customerLoan,
                                        CustomerId: customerGuId,
                                        REUnitId: val[i].REUnit.ReUnitId,
                                        ProjectId: pro.Id,
                                        Status: 1,
                                        LastModifiedTimeStamp: datetimenow,
                                    });
                                }
                                bankId = _.newGuid();

                                bankApps.push({
                                    Id: bankId,
                                    CustomerLoanId: isCustomerLoan ? _.findWhere(customerLoans, { REUnitId: val[i].REUnit.ReUnitId, CustomerId: customerGuId }).Id : customerLoan,
                                    BankId: val[i]['ธนาคารที่ยื่นกู้'] == 'ชำระด้วยเงินสด' ? _.findWhere(Bank, { Code: '000' }).Id : _.findWhere(Bank, { CodeName: val[i]['ธนาคารที่ยื่นกู้'] }).Id,
                                    TrackNo: srvObj.makeid(trackNoList),
                                    Date: datetimenow,
                                    LoanDate: _.isUndefinedOrNull(val[i]['วันที่ยื่นกู้']) ? datetimenow : allNewServ.normalizeDatePicker(moment(val[i]['วันที่ยื่นกู้'], 'DD/MM/YYYY')),
                                    LoanApprovedDate: allNewServ.normalizeDatePicker(moment(val[i]['วันที่อนุมัติ'], 'DD/MM/YYYY')),
                                    LoanAmount: val[i]['วงเงินขอกู้'],
                                    HomeLoanAmount: val[i]['วงเงินเคหะ'],
                                    DecorateAmount: val[i]['วงเงินตกแต่ง'],
                                    PremiumAmount: val[i]['ค่าเบี้ยประกัน'],
                                    OtherAmount: val[i]['วงเงินอื่นๆ'],
                                    TotalAmount: val[i]['วงเงินจำนองรวม'],
                                    UpfontExpensesAmount: val[i]['หักค่าใช้จ่ายล่วงหน้า'],
                                    BankCode: val[i]['ธนาคารที่ยื่นกู้'],
                                    BankBranch: val[i]['สาขาธนาคาร'],
                                    LoanType: val[i]['ประเภทการยื่นกู้'],
                                    RejectReason: val[i]['เหตุผลในการไม่อนุมัติ'],
                                    BankAgentName: val[i]['ชื่อเจ้าหน้าที่ธนาคาร'],
                                    BankAgentPhone: val[i]['เบอร์โทรศัพท์เจ้าหน้าที่ธนาคาร'],
                                    CustomerServiceName: val[i]['ชื่อผู้ดูแลโครงการ'],
                                    CustomerServicePhone: val[i]['เบอร์โทรศัพท์ผู้ดูแลโครงการ'],
                                    SignatureDate: allNewServ.normalizeDatePicker(moment(val[i]['วันที่นัดเซ็นสัญญา'], 'DD/MM/YYYY')),
                                    TransferDate: allNewServ.normalizeDatePicker(moment(val[i]['วันที่วันที่จำนอง/วันนัดโอน'], 'DD/MM/YYYY')),
                                    CreateBy: USER.Email,
                                    CreateTimeStamp: datetimenow,
                                    LastModifiedBy: USER.Email,
                                    LastModifiedTimeStamp: datetimenow,
                                    Grade: _.findWhere(ENUM.GradesforBankApp, { Name: val[i]['เกรด'] }).Id
                                });
                                mortgageActs.push({
                                    Id: _.newGuid(),
                                    MortgageCustomerId: customerGuId,
                                    MortgageApplicationId: bankId,
                                    MortgageStatusId: _.findWhere(ENUM.MortgageStatus, { name: val[i]['สถานะการยื่นกู้'] }).status,
                                    NoteToBank: '',
                                    Remark: val[i]['หมายเหตุ'],
                                    CreateBy: USER.Email,
                                    CreateTimeStamp: datetimenow,
                                    LastModifiedBy: USER.Email,
                                    LastModifiedTimeStamp: datetimenow
                                });
                                _.each(new Array(maperCoborrowers.max), function (obj, index) {
                                    var tmpCoborrower = maperCoborrowers.getValueFromObj(val[i], index + 1);
                                    if (!_.isUndefinedNullOrEmpty(tmpCoborrower.Name)) {
                                        coborrowers.push(
                                            _.extend(tmpCoborrower, {
                                                Id: _.newGuid(),
                                                CustomerId: val[i].REUnit.CustomerId,
                                                BankApplicationId: bankId,
                                            })
                                        )
                                    }
                                })
                                delete (bankId)
                            }


                        } else {
                            var HaveOwner = _.findWhere(CheckUnitCode[1].HaveOwner, { ProjectCode: val[i]['รหัสโครงการ'], ReUnitCode: val[i]['ยูนิตที่กู้'] })
                            if (!_.isUndefinedNullOrEmpty(HaveOwner)) {
                                var pro = _.findWhere(pjl, { Code: HaveOwner.ProjectCode })
                                if (findBankAppByTrackNo) {
                                    updatebankapps.push({
                                        Id: findBankAppByTrackNo.AppId,
                                        CustomerLoanId: findBankAppByTrackNo.CustomerLoanId,
                                        BankId: findBankAppByTrackNo.BankId,
                                        LoanDate: _.isUndefinedOrNull(val[i]['วันที่ยื่นกู้']) ? datetimenow : allNewServ.normalizeDatePicker(moment(val[i]['วันที่ยื่นกู้'], 'DD/MM/YYYY')),
                                        Date: moment(val[i]['วันที่ยื่นกู้'], 'DD/MM/YYYY').add(1, 'days')._d,
                                        TrackNo: val[i][modelImp.trackNo],
                                        LoanApprovedDate: moment(val[i]['วันที่อนุมัติ'], 'DD/MM/YYYY').add(1, 'days')._d,
                                        LoanAmount: val[i]['วงเงินขอกู้'],
                                        HomeLoanAmount: val[i]['วงเงินเคหะ'],
                                        DecorateAmount: val[i]['วงเงินตกแต่ง'],
                                        PremiumAmount: val[i]['ค่าเบี้ยประกัน'],
                                        OtherAmount: val[i]['วงเงินอื่นๆ'],
                                        TotalAmount: val[i]['วงเงินจำนองรวม'],
                                        UpfontExpensesAmount: val[i]['หักค่าใช้จ่ายล่วงหน้า'],
                                        BankCode: val[i]['ธนาคารที่ยื่นกู้'],
                                        BankBranch: val[i]['สาขาธนาคาร'],
                                        LoanType: val[i]['ประเภทการยื่นกู้'],
                                        RejectReason: val[i]['เหตุผลในการไม่อนุมัติ'],
                                        BankAgentName: val[i]['ชื่อเจ้าหน้าที่ธนาคาร'],
                                        BankAgentPhone: val[i]['เบอร์โทรศัพท์เจ้าหน้าที่ธนาคาร'],
                                        CustomerServiceName: val[i]['ชื่อผู้ดูแลโครงการ'],
                                        CustomerServicePhone: val[i]['เบอร์โทรศัพท์ผู้ดูแลโครงการ'],
                                        SignatureDate: moment(val[i]['วันที่นัดเซ็นสัญญา'], 'DD/MM/YYYY').add(1, 'days')._d,
                                        TransferDate: moment(val[i]['วันที่จำนอง/วันนัดโอน'], 'DD/MM/YYYY').add(1, 'days')._d,
                                        CreateBy: findBankAppByTrackNo.CreateBy,
                                        CreateTimeStamp: moment(findBankAppByTrackNo.CreateTimeStamp).add(1, 'days')._d,
                                        LastModifiedBy: USER.Email,
                                        LastModifiedTimeStamp: datetimenow,
                                        Grade: _.findWhere(ENUM.GradesforBankApp, { Name: val[i]['เกรด'] }).Id
                                    });
                                    mortgageActs.push({
                                        Id: _.newGuid(),
                                        MortgageCustomerId: HaveOwner.CustomerId,
                                        MortgageApplicationId: findBankAppByTrackNo.AppId,
                                        MortgageStatusId: _.findWhere(ENUM.MortgageStatus, { name: val[i]['สถานะการยื่นกู้'] }).status,
                                        Remark: val[i]['หมายเหตุ'],
                                        CreateBy: USER.Email,
                                        CreateTimeStamp: datetimenow,
                                        LastModifiedBy: USER.Email,
                                        LastModifiedTimeStamp: datetimenow
                                    });

                                    _.each(new Array(maperCoborrowers.max), function (obj, index) {
                                        var tmpCoborrower = maperCoborrowers.getValueFromObj(val[i], index + 1);
                                        if (!_.isUndefinedNullOrEmpty(tmpCoborrower.Name)) {
                                            coborrowers.push(
                                                _.extend(tmpCoborrower, {
                                                    Id: _.newGuid(),
                                                    CustomerId: HaveOwner.CustomerId,
                                                    BankApplicationId: findBankAppByTrackNo.AppId,
                                                })
                                            )
                                        }
                                    })
                                }
                            }
                        }
                    }

                    var postObj = {
                        customers: customers,
                        customerLoans: customerLoans,
                        coBorrowers: coborrowers,
                        mortgageActivities: mortgageActs,
                        bankApplications: bankApps
                        //reunits: REUnit
                    };
                    var updateobj = {
                        customers: Updatecustomers,
                        customerLoans: UpdatecustomerLoans,
                        reunits: UpdaleREunit,
                        coBorrowers: coborrowers,
                        bankApplications: updatebankapps
                    }
                    //console.log(postObj)
                    //console.log(updateobj)

                    allNewServ.POST('customer', 'ImportMortgageForSales', postObj, true, 'created').then(function (res) {
                        allNewServ.PUT('customer', 'ImportUpdateMortgageForCS', updateobj, false, null).then(function () {
                            location.reload(true);
                        });
                    });
                });
            })


        },
        checkImportErrorCase: function (code, message, errors, error, data, col) {
            errors.push({
                row: data.rowNumber,
                reason: [{
                    code: code,
                    message: message,
                    error: col
                }]
            });
            return errors;
        },
        requireColumnValidation: function (importDataJSON, projects, reunits, CodeBanks, customerByQuotaions, Banks) {
            var requireColumn = ['ยูนิตที่กู้', 'รหัสโครงการ', 'ชื่อโครงการ', 'ธนาคารที่ยื่นกู้', 'สถานะการยื่นกู้', 'เกรด']; // บังคับกรอก, ห้ามสลับที่
            var nonRequiredButCheck = ['ชื่อผู้ถือสัญญา', 'บ้านเลขที่', 'สถานภาพ', 'เบอร์โทรศัพท์ผู้ถือสัญญา', 'ที่มาของรายได้', 'สถานที่ทำงาน', 'รายชื่อ-กรรมสิทธิ์', 'ระยะเวลาในระบบ(วัน)', 'ประเภทการยื่นกู้', 'TrackingNo', 'ธนาคารที่ยื่นกู้', 'สาขาธนาคาร', 'สถานะการยื่นกู้', 'หมายเหตุ', 'เกรด', 'ระยะเวลาที่ค้างในสถานะนั้น', 'วันที่ยื่นกู้', 'วงเงินขอกู้', 'ค่าเบี้ยประกัน', 'หักค่าใช้จ่ายล่วงหน้า', 'วงเงินเคหะ', 'วงเงินตกแต่ง', 'วงเงินจำนองรวม', 'วงเงินอื่นๆ', 'วันที่นัดเซ็นสัญญา', 'วันที่อนุมัติ', 'วันที่จำนอง/วันนัดโอน', 'ระยะเวลายื่นกู้ถึงวันที่จำนอง(วัน)', 'ชื่อผู้ดูแลโครงการ', 'เบอร์โทรศัพท์ผู้ดูแลโครงการ', 'ชื่อเจ้าหน้าที่ธนาคาร', 'เบอร์โทรศัพท์เจ้าหน้าที่ธนาคาร'];
            var allColumns = _.union(requireColumn, nonRequiredButCheck);
            var nonDupCol = [nonRequiredButCheck[10]]; //ห้ามซ้ำ
            var nonDupVal = [];
            var allREUnit = _.union(reunits[0].NotHave, reunits[1].HaveOwner)
            var requireFormat = [nonRequiredButCheck[2], nonRequiredButCheck[14]]; //บังคับฟอร์แมต 
            var maritalAndGradeStatus = _.chain(ENUM.MaritalStatus)
                .pluck('name')
                .union(_.pluck(ENUM.GradesforBankApp, 'Name'))
                .value();
            
            var requireFormatStatus = [nonRequiredButCheck[12]]; //บังคับฟอร์แมต 
            var requireDate = [nonRequiredButCheck[16], nonRequiredButCheck[24], nonRequiredButCheck[25], nonRequiredButCheck[26]]; //บังคับฟอร์แมต
            var requireAmount = ['วงเงินขอกู้', 'ค่าเบี้ยประกัน', 'หักค่าใช้จ่ายล่วงหน้า', 'วงเงินเคหะ', 'วงเงินตกแต่ง', 'วงเงินจำนองรวม', 'วงเงินอื่นๆ'];
            var mortgateStatus = [
                "ยังไม่ยื่นกู้",
                //"สร้างคำขอกู้",
                "ธนาคารได้รับคำขอ",
                //"เอกสารไม่ครบ",
                "เข้าระบบธนาคาร",
                //"อยู่ระหว่างการพิจารณา",
                "เอกสารเพิ่มเติม",
                "ผลการอนุมัติ",
                "อนุมัติเบื้องต้น",
                "อนุมัติจริง",
                "ไม่อนุมัติ",
                "ลูกค้าเลือก",
                "อนุมัติแล้วยกเลิก",
                "ยกเลิก"
            ]
            var mortgateStatusForPayCash = [
                "ผลการอนุมัติ",
                "ลูกค้าเลือก",
                "ยกเลิก"
            ]
            var summary = ["ไม่กรอกข้อมูล", "ฟอร์เมตผิดพลาด/ไม่มีในระบบ", "ข้อมูลซ้ำ"]; //เช็คความผิดพลาด 3 อย่าง
            var summaryCount = {};
            for (var summaryItem in summary) { summaryCount[summary[summaryItem]] = 0; }//นับข้อมูลผิดพลาดตั้งต้น
            var errors = [];
            var txt = "ที่คอลัมน์";
            var FindLastRow = importDataJSON[importDataJSON.length - 1];

            if (!_.isUndefinedNullOrEmpty(FindLastRow)) {
                    var lastRow = FindLastRow.rowNumber;
                    for (var i = 2; i <= lastRow; i++) { //row
                        var checkErrorBool = {};
                        for (var summaryItem1 in summary) { checkErrorBool[summary[summaryItem1]] = true; }
                        var data = _.findWhere(importDataJSON, { rowNumber: i });
                        if (!_.isUndefinedNullOrEmpty(data)) {
                            if (_.isUndefinedNullOrEmpty(data.TrackingNo)) {
                                // GET REUnit
                                if (!_.isUndefinedNullOrEmpty(data['รหัสโครงการ'])) {
                                    data.REUnit = _.findWhere(allREUnit, { ProjectCode: data['รหัสโครงการ'], ReUnitCode: data['ยูนิตที่กู้'] });
                                    //customerByQuotaions
                                }
                            }
                        }
                        for (var j = 0; j < allColumns.length; j++) { //column
                            var error = _.findWhere(errors, { row: i });
                            if (!_.isUndefinedNullOrEmpty(data)) {
                                var error1 = _.findWhere(errors, { row: data.rowNumber });
                                if (_.isUndefinedNullOrEmpty(data[allColumns[j]])) { //ไม่มีค่า

                                        if (_.contains(requireColumn, allColumns[j])) {
                                            var code = 0;
                                            errors = srvObj.checkImportErrorCase(code, summary[code], errors, error1, data, allColumns[j]);
                                            checkErrorBool[summary[code]] = false;
                                        }

                                } else { //มีค่า
                                    if (_.contains(requireFormat, allColumns[j])) {
                                        if (!_.contains(maritalAndGradeStatus, data[allColumns[j]])) {
                                            var code = 1;
                                            errors = srvObj.checkImportErrorCase(code, summary[code], errors, error1, data, allColumns[j]);
                                            checkErrorBool[summary[code]] = false;
                                        }
                                    }
                                    //วันที่
                                    if (_.contains(requireDate, allColumns[j])) {
                                        var DateValid = moment(data[allColumns[j]], 'DD/MM/YYYY', true).isValid() || moment(data[allColumns[j]], 'DD-MM-YYYY', true).isValid()
                                        if (!DateValid) {
                                            var code = 1;
                                            errors = srvObj.checkImportErrorCase(code, summary[code], errors, error1, data, allColumns[j]);
                                            checkErrorBool[summary[code]] = false;
                                        }
                                    }
                                    //วงเงิน
                                    if (_.contains(requireAmount, allColumns[j])) {
                                        if (isNaN(data[allColumns[j]])) {
                                            var code11 = 1;
                                            errors = srvObj.checkImportErrorCase(code11, summary[code11] + txt, errors, error1, data, allColumns[j]);
                                            checkErrorBool[summary[code11]] = false;
                                        }
                                    }
                                }
                                if (_.isUndefinedNullOrEmpty(data.TrackingNo)) {
                                    if (!_.isUndefinedNullOrEmpty(data.REUnit)) {
                                        data.isREUnit = _.findWhere(customerByQuotaions, { REUnitId: data.REUnit.ReUnitId.toLowerCase() });
                                        if (allColumns[j] == 'ยูนิตที่กู้') {
                                            if (_.isUndefinedNullOrEmpty(data.isREUnit)) {
                                                var code = 1;
                                                errors = srvObj.checkImportErrorCase(code, summary[code], errors, error1, data, allColumns[j]);
                                                checkErrorBool[summary[code]] = false;
                                            }
                                        }
                                        if (_.contains(nonDupCol, allColumns[j])) {
                                            var NameBANK = _.findWhere(Banks, { Id: USER.BankId })
                                            if (!_.isUndefinedNullOrEmpty(USER.BankId)) {
                                                if (NameBANK.CodeName != data[allColumns[j]]) {
                                                    var code = 1;
                                                    errors = srvObj.checkImportErrorCase(code, summary[code], errors, error1, data, allColumns[j]);
                                                    checkErrorBool[summary[code]] = false;
                                                }
                                            } else if (!_.isUndefinedNullOrEmpty(data.REUnit.CL)) {
                                                var CodeBank = _.chain(CodeBanks)
                                                    .filter(function (code) {
                                                        return code.CustomerLoanId == data.REUnit.CL.toLowerCase()
                                                    })
                                                    .map(function (code) {
                                                        return code.CodeName
                                                    })
                                                    .value()
                                                if (_.contains(CodeBank, data[allColumns[j]])) {
                                                    var code = 2;
                                                    errors = srvObj.checkImportErrorCase(code, summary[code], errors, error1, data, allColumns[j]);
                                                    checkErrorBool[summary[code]] = false;
                                                }
                                            }
                                            if (!_.contains(nonDupVal, data['รหัสโครงการ'] + data['ยูนิตที่กู้'] + data[allColumns[j]])) {
                                                nonDupVal.push(data['รหัสโครงการ'] + data['ยูนิตที่กู้'] + data[allColumns[j]]);
                                            } else {
                                                var code = 2;
                                                errors = srvObj.checkImportErrorCase(code, summary[code], errors, error1, data, allColumns[j]);
                                                checkErrorBool[summary[code]] = false;
                                            }
                                        }
                                    } else {
                                        if (allColumns[j] == 'ยูนิตที่กู้') {
                                            var code = 1;
                                            errors = srvObj.checkImportErrorCase(code, summary[code], errors, error1, data, allColumns[j]);
                                            checkErrorBool[summary[code]] = false;
                                        }
                                    }
                                }
                            }
                        }
                        for (var summaryItem3 in summary) { if (!checkErrorBool[summary[summaryItem3]]) summaryCount[summary[summaryItem3]]++; }
                    }
                }
            return {
                errors: errors,
                summary: summaryCount,
                output: importDataJSON,
            };
            //else {
            //    return {
            //        errors: null,
            //        summary: null,
            //        output: null,
            //        newUnit: newUnit,
            //        newProject: newProject
            //    }
            //}

        },
        getValidDate: function (date, getDefault) {
            if (!_.isUndefinedNullOrEmpty(date)) return moment(date, "DD/MM/YYYY")._d
            else if (getDefault) return new Date();
            else return null;
        },
        requireColumnBank: function (data, checkUnits, BankId) {
            var valid = true;
            var correctData = [];
            var wrongData = [];
            var wrongCol = false
            var correctDataDetail = [];
            var countError = {
                used: 0,
                dup: 0,
                none: 0
            };
            //console.log(data);
            if (data.length === 0) {
                valid = false;
            } else {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['ยูนิตที่กู้'] === undefined || data[i]['รหัสโครงการ'] === undefined) {
                        wrongCol = true;
                        valid = false;
                    } else {
                        var findData = _.findWhere(checkUnits, { ReUnitCode: data[i]['ยูนิตที่กู้'], ProjeceCode: data[i]['รหัสโครงการ'] });
                        if (_.findWhere(correctDataDetail, { code: data[i]['ยูนิตที่กู้'], ProjeceCode: data[i]['รหัสโครงการ'] }) || _.findWhere(wrongData, { code: data[i]['ยูนิตที่กู้'], ProjeceCode: data[i]['รหัสโครงการ'] })) {
                            wrongData.push({ code: data[i]['ยูนิตที่กู้'], type: 'ซ้ำในแถว', icon: 'action:list', bgcolor: 'rgb(113, 179, 247)' });
                            countError.dup += 1;
                            valid = false;
                        } else {
                            if (findData) {
                                if (findData.HasApp === 0) {
                                    var LoanDate = srvObj.getValidDate(data[i]['วันที่ยื่นกู้'], true)
                                    findData = _.extend(findData, {
                                        LoanDate: LoanDate,
                                        BankGuid: BankId
                                    });
                                    correctData.push(findData);
                                    correctDataDetail.push({ code: data[i]['ยูนิตที่กู้'], type: 'สร้างแอพได้', icon: 'action:description', bgcolor: '#4fada8', ProjeceCode: data[i]['รหัสโครงการ'], LoanDate: LoanDate });
                                } else if (findData.HasApp === 1) {
                                    wrongData.push({ code: data[i]['ยูนิตที่กู้'], type: 'ถูกสร้างแอพแล้ว', icon: 'action:description', bgcolor: 'rgb(112, 126, 228)', ProjeceCode: data[i]['รหัสโครงการ'] });
                                    valid = false;
                                    countError.used += 1;
                                }
                            } else {
                                wrongData.push({ code: data[i]['ยูนิตที่กู้'], type: 'ไม่มีในระบบ', icon: 'av:not_interested', bgcolor: '#f59494', ProjeceCode: data[i]['รหัสโครงการ'] });
                                valid = false;
                                countError.none += 1;
                            }
                        }
                    }

                }
            }
            //console.log('wrongData', wrongData)
            return {
                data: data,
                valid: valid,
                checkUnits: _.where(checkUnits, { HasApp: 0 }),
                correctData: correctData,
                wrongData: wrongData,
                wrongCol: wrongCol,
                correctDataDetail: correctDataDetail,
                countError: countError
            };
        },
        makeid: function (trackNoList) {
            var TrackNew = "";
            var text = "";
            var text2 = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var numpPossible = "0123456789";
            for (var i = 0; i < 2; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            for (var i = 0; i < 4; i++)
                text2 += numpPossible.charAt(Math.floor(Math.random() * numpPossible.length));
            TrackNew = text + text2;
            var err = _.findWhere(trackNoList, { TrackNo: TrackNew })
            if (!_.isUndefinedNullOrEmpty(err)) {
                srvObj.makeid();
            } else {
                return TrackNew
            }
        }

    }
    return srvObj;
});