mgGlobalApp.factory('mgGlobapServ', function (allNewServ, API, $q, $http, $rootScope, Upload, $cookieStore) {
    var srvObj = {
        getToken: function () {
            var deferred = $q.defer();
            allNewServ.GET('worker', 'Get', { id: USER.WID }, false, '').then(function (worker) {
                data = 'grant_type=password&username=' + worker.UserName + '&password=' + srvObj.getPwd() + '&client_id=' + GLOBALMODELCONFIG.application_clientId;
                $http.post(GLOBALMODELCONFIG.authentication_host + 'oauth2/token', data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (err) {
                    deferred.reject(err);
                });
            });
            return deferred.promise;
        },
        getPwd: function () {
            return $cookieStore.get('auth.' + 'pwd');
        },
        changePassword: function (model) {
            var deferred = $q.defer();
            $rootScope.pageLoading = true;
            srvObj.getToken().then(function (token) {
                $http({
                    method: 'POST',
                    url: GLOBALMODELCONFIG.authres_host + "Api/User/ChangeUserPasswordnotcheckOld",
                    data: model,
                    headers: {
                        'Authorization': 'Bearer ' + token.access_token
                    }
                }).success(function (response) {
                    $rootScope.pageLoading = false;
                    allNewServ.delayPageLoading(deferred, response, 'change');
                }).error(function (error) {
                    deferred.reject(error.message);
                });
            });
            return deferred.promise;
        },
        uploadCoverPhoto: function (file, id, showToast, type) {
            $rootScope.pageLoading = true;
            var deferred = $q.defer();
            Upload.upload({
                url: API.getHostUri() + 'api/worker/uploadProfilePhoto',
                data: {
                    file: file,
                    containerName: COMPANY.Id,
                    workerId: id,
                    fileName: file.name
                }
            }).then(function (data) {
                if (showToast) allNewServ.delayPageLoading(deferred, data, type);
                else deferred.resolve(data);
            }, function (resp) {
                deferred.reject(resp)
            }, function (evt) {
                //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
            return deferred.promise;
        },
    }
    return srvObj;
})