smsApp.factory('SMSServ', function ($http, $q) {
    var apiSMSApprove;
    INITPromise.then(function () {
        apiSMSApprove = GLOBALMODELCONFIG.ployapiservice_host + 'api/SMSApprove';
    });
    var srvObj = {
        sendSMS: function (obj) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: apiSMSApprove + '/POST',
                data: obj
            }).success(function (success) {
                deferred.resolve(success);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        },
        sendSMSContract: function (obj) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: apiSMSApprove + '/SendSMSContract',
                data: obj
            }).success(function (success) {
                deferred.resolve(success);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        },
        getMemoryCacheByQuotationId: function (quotationId) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: apiSMSApprove + '/GetMemoryCacheByQuotationId',
                params: { QuotationId: quotationId }
            }).success(function (success) {
                deferred.resolve(success);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        },
        verifyOTP: function (obj) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: apiSMSApprove + '/VerifyOTP',
                data: obj
            }).success(function (success) {
                deferred.resolve(success);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        },
        verifyOTPContract: function (obj) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: apiSMSApprove + '/VerifyOTPContract',
                data: obj
            }).success(function (success) {
                deferred.resolve(success);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        },
        reject: function (quotationId) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: apiSMSApprove + '/Reject',
                params: { QuotationId: quotationId }
            }).success(function (success) {
                deferred.resolve(success);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        },
        rejectContract: function (quotationId) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: apiSMSApprove + '/RejectContract',
                params: { QuotationId: quotationId }
            }).success(function (success) {
                deferred.resolve(success);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        }
    };
    return srvObj;
});
smsApp.value('SMSVal', {
    sender: "PLOY",
    msg: "ขออนุมัติเอกสาร OTP= "
});