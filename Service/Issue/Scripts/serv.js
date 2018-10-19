appmod.factory('$service', function ($http, $q, $rootScope, Upload, API, allNewServ) {
    var projects = workers = null;
    var value;
    var srvObj = {
        upLoadIssuePhoto: function (file, id, showToast, type) {
            $rootScope.pageLoading = true;
            var deferred = $q.defer();
            Upload.upload({
                url: API.getHostUri() + 'api/issue/upLoadIssuePhoto',
                data: {
                    file: file,
                    containerName: COMPANY.Id,
                    fileName: file.name,
                    issueId: id,
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
        upLoadCommentPhoto: function (file, id, showToast, type) {
            $rootScope.pageLoading = true;
            var deferred = $q.defer();
            Upload.upload({
                url: API.getHostUri() + 'api/issue/upLoadCommentPhoto',
                data: {
                    file: file,
                    containerName: COMPANY.Id,
                    fileName: file.name,
                    commentId: id,
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
        setProjects: function (obj) {
            projects = obj
        },
        getProjects: function () {
            return projects;
        },
        setWorkers: function (obj) {
            workers = obj
        },
        getWorkers: function () {
            return workers;
        },
        setValue: function (val) {
            value = val
        },
        getValue: function () {
            return value
        },
    };
    return srvObj;
});