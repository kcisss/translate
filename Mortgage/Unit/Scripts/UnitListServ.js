mortgageUnitApp.factory('$service', function (allNewServ, ENUM) {
    var ws_array = [];
    var srvObj = {
        findMaritalStatusFromENUM: function (value) {
            var tmp = _.findWhere(ENUM.MaritalStatus, { status: String(value) })
            return tmp ? tmp.name : ""
        },
        process_wb: function (wb, X) {
            var output = "";
            var converted = srvObj.to_json(wb, X);
            var objHasRowNumber = converted[converted.firstSheetName];
            if (!_.isUndefinedNullOrEmpty(objHasRowNumber)) {
                for (var i = 0; i < objHasRowNumber.length; i++) {
                    objHasRowNumber[i].rowNumber = Number(objHasRowNumber[i].__rowNum__) + 1;
                }
                output = JSON.stringify(objHasRowNumber, 2, 2);

                var result = angular.fromJson(output);

                return result;
            } else {
                return [];
            }
            return [];
        },
        to_json: function (workbook, X) {
            var result = {};
            var i = 0;
            workbook.SheetNames.forEach(function (sheetName) {
                if (i === 0) result.firstSheetName = sheetName;
                ++i;
                var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    result[sheetName] = roa;
                }
            });
            return result;
        },
        exportTmpForAddApp: function (bankname) {
            var ws_arr = [];
            var ws_name = ['Input Data'];
            //ws_arr.push(_.keys(exportModel)); //header
            //-----------------------------------------//

            var topic = ['รหัสโครงการ', 'ยูนิตที่ขาย', 'วันที่ยื่นกู้'];
            var row_arr = [];
            _.each(topic, function (val) { row_arr.push(val); })
            ws_arr.push(row_arr);
            var wb = srvObj.newWorkBook(),
                ws = srvObj.sheet_from_array_of_arrays(ws_arr);

            /* add worksheet to workbook */
            wb.SheetNames.push(ws_name[0]);
            wb.Sheets[ws_name[0]] = ws;

            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "การสร้างAppของธนาคาร" + bankname + ".xlsx")
        },
        exportMortgageProject: function (cards, select, bank) {
            cards = _.sortBy(cards, 'REUnitCode');

            var ws_arr = [];
            var header = [];
            ws_array = _.pluck(select, 'name')
            var ws_name = ['Input Data', 'Instruction'];

            // Create Header
            _.each(select, function (obj, key) {
                if (obj.name == "CoBorrower") {
                    header = _.union(header, [
                        "ผู้กู้ร่วมคนที่1", "สถานภาพผู้กู้ร่วมคนที่1", "เป็นผู้ถือกรรมสิทธิ์คนที่1",
                        "ผู้กู้ร่วมคนที่2", "สถานภาพผู้กู้ร่วมคนที่2", "เป็นผู้ถือกรรมสิทธิ์คนที่2",
                        "ผู้กู้ร่วมคนที่3", "สถานภาพผู้กู้ร่วมคนที่3", "เป็นผู้ถือกรรมสิทธิ์คนที่3",
                        "ผู้กู้ร่วมคนที่4", "สถานภาพผู้กู้ร่วมคนที่4", "เป็นผู้ถือกรรมสิทธิ์คนที่4",
                        "ผู้กู้ร่วมคนที่5", "สถานภาพผู้กู้ร่วมคนที่5", "เป็นผู้ถือกรรมสิทธิ์คนที่5"
                    ]
                    )
                } else header.push(obj.sub)
            })
            ws_arr.push(header);

            _.each(cards, function (card, rowIndex) {
                var row_arr = [];
                _.each(ws_array, function (key, index) {
                    if (key == 'REUnitCode') {
                        row_arr.push(card.REUnitCode)
                    } else if (key == 'REPrice') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.REPrice) ? 0 : parseInt(card.REPrice))
                    } else if (key == 'ProjectName') {
                        row_arr.push(card.ProjectName)
                    } else if (key == 'AddressNo') {
                        row_arr.push(card.AddressNo)
                    } else if (key == 'CustomerName') {
                        row_arr.push(card.CustomerName)
                    } else if (key.indexOf('CoBorrower') > -1) {
                        var maxCorrower = new Array(5);
                        var values = [];
                        _.chain(maxCorrower)
                            .each(function (round, index) {
                                var tmpCorrower = card.CoBorrowerDetail[index]
                                if (tmpCorrower) {
                                    _.each(tmpCorrower, function (value, key) {
                                        if (key == "IsOwner") row_arr.push(_.isUndefinedNullOrEmpty(value) && !value ? "" : "Y")
                                        else if (key == "MaritalStatus") row_arr.push(srvObj.findMaritalStatusFromENUM(value))
                                        else row_arr.push(_.isUndefinedNullOrEmpty(value) ? "" : value)
                                    })
                                } else {
                                    row_arr.push("", "", "")
                                }
                            })
                    } else if (key == 'CustomerPhone') {
                        row_arr.push(card.CustomerPhone)
                    } else if (key == 'TrackingNo') {
                        row_arr.push(card.TrackingNo)
                    } else if (key == 'LoanDate') {
                        if (!_.isUndefinedNullOrEmpty(card.LoanDate)) {
                            row_arr.push(moment(card.LoanDate).format('DD/MM/YYYY'));
                        } else {
                            row_arr.push('');
                        }
                    } else if (key == 'LoanApproveDate') {
                        if (!_.isUndefinedNullOrEmpty(card.LoanApproveDate)) {
                            row_arr.push(moment(card.LoanApproveDate).format('DD/MM/YYYY'))
                        } else {
                            row_arr.push('');
                        }
                    } else if (key == 'SignatureDate') {
                        if (!_.isUndefinedNullOrEmpty(card.SignatureDate)) {
                            row_arr.push(moment(card.SignatureDate).format('DD/MM/YYYY'))
                        } else {
                            row_arr.push('');
                        }
                    } else if (key == 'TransferDate') {
                        if (!_.isUndefinedNullOrEmpty(card.TransferDate)) {
                            row_arr.push(moment(card.TransferDate).format('DD/MM/YYYY'))
                        } else {
                            row_arr.push('');
                        }
                    } else if (key == 'LoanAmount') {
                        row_arr.push(card.LoanAmount)
                    } else if (key == 'HomeLoanAmount') {
                        row_arr.push(card.HomeLoanAmount)
                    } else if (key == 'DecorateAmount') {
                        row_arr.push(card.DecorateAmount)
                    } else if (key == 'PremiumAmount') {
                        row_arr.push(card.PremiumAmount)
                    } else if (key == 'OtherAmount') {
                        row_arr.push(card.OtherAmount)
                    } else if (key == 'TotalAmount') {
                        row_arr.push(card.TotalAmount)
                    } else if (key == 'UpfontExpensesAmount') {
                        row_arr.push(card.UpfontExpensesAmount)
                    } else if (key == 'BankCode') {
                        row_arr.push(card.BankCode)
                    } else if (key == 'IdentificationNo') {
                        row_arr.push(card.IdentificationNo)
                    } else if (key == 'LoanStatus') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.LoanStatus) ? '' : card.LoanStatus)
                    } else if (key == 'BankRejectReason') {
                        row_arr.push(card.BankRejectReason)
                    } else if (key == 'WorkerName') {
                        row_arr.push(card.WorkerName)
                    } else if (key == 'WorkerPhone') {
                        row_arr.push(card.WorkerPhone)
                    } else if (key == 'LoanDateToTransferDate') {
                        row_arr.push(card.LoanDateToTransferDate)
                    } else if (key == 'Remark') {
                        row_arr.push(card.Remark)
                    } else if (key == 'BankBranch') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.BankBranch) ? '' : card.BankBranch)
                    } else if (key == 'MortgageStatusId') {
                        var status = _.findWhere(ENUM.MortgageStatus, { status: card.MortgageStatusId })
                        if (status) row_arr.push(status.name)
                        else row_arr.push('')
                    } else if (key == 'BankCode') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.BankCode) ? '' : card.BankCode)
                    } else if (key == 'ProjectCode') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.ProjectCode) ? '' : card.ProjectCode)
                    } else if (key == 'PeriodDate') {
                        row_arr.push(card.PeriodDate)
                    } else if (key == 'PeriodStatus') {
                        row_arr.push(card.PeriodStatus)
                    } else if (key == 'CustomerRejectReason') {
                        row_arr.push(card.CustomerRejectReason)
                    } else if (key == 'LoanType') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.LoanType) ? '' : card.LoanType)
                    } else if (key == 'SourceOfIncome') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.SourceOfIncome) ? '' : card.SourceOfIncome)
                    } else if (key == 'WorkPlace') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.WorkPlace) ? '' : card.WorkPlace)
                    } else if (key == 'BankAgentName') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.BankAgentName) ? '' : card.BankAgentName)
                    } else if (key == 'BankAgentPhone') {
                        row_arr.push(_.isUndefinedNullOrEmpty(card.BankAgentPhone) ? '' : card.BankAgentPhone)
                    }
                })
                ws_arr.push(row_arr);
            })


            var status = [
                { name: 'ยังไม่ยื่นกู้' },
                { name: 'สร้างคำขอกู้' },
                { name: 'ธนาคารได้รับคำขอ' },
                { name: 'เอกสารไม่ครบ' },
                { name: 'เข้าระบบธนาคาร' },
                { name: 'อยู่ระหว่างการพิจารณา' },
                { name: 'เอกสารเพิ่มเติม' },
                { name: 'แจ้งผลการอนุมัติ' },
                { name: 'อนุมัติเบื้องต้น' },
                { name: 'อนุมติจริง' },
                { name: 'ไม่อนุมัติ' },
                { name: 'ลูกค้าเลือก' },
                { name: 'อนุมัติแล้วยกเลิก' },
                { name: 'ยกเลิก' }
            ]
            ws_arr1 = [];
            for (var i = 0; i < status.length; i++) {
                var statusToArray = []
                statusToArray.push(i + 1, status[i].name);
                ws_arr1.push(statusToArray)
            }
            var wb = srvObj.newWorkBook(),
                ws = srvObj.sheet_from_array_of_arrays(ws_arr);
            ws1 = srvObj.sheet_from_array_of_arrays(ws_arr1);

            /* add worksheet to workbook */
            wb.SheetNames.push(ws_name[0], ws_name[1]);
            wb.Sheets[ws_name[0]] = ws;
            wb.Sheets[ws_name[1]] = ws1;

            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "รายชื่อผู้ยื่นกู้_CS.xlsx")

        },
        newWorkBook: function () {
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }
            return new Workbook();
        },
        sheet_from_array_of_arrays: function (data, opts) {
            var ws = {};
            var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
            for (var R = 0; R != data.length; ++R) {
                for (var C = 0; C != data[R].length; ++C) {
                    if (range.s.r > R) range.s.r = R;
                    if (range.s.c > C) range.s.c = C;
                    if (range.e.r < R) range.e.r = R;
                    if (range.e.c < C) range.e.c = C;
                    var cell = { v: data[R][C] };
                    if (cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                    if (typeof cell.v === 'number') cell.t = 'n';
                    else if (typeof cell.v === 'boolean') cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 'n';
                        cell.z = XLSX.SSF._table[14];
                        cell.v = datenum(cell.v);
                    } else cell.t = 's';

                    ws[cell_ref] = cell;
                }
            }
            if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        },
        fixdata: function (data) {
            var o = "",
                l = 0,
                w = 10240;
            for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        }
    };
    return srvObj;
});