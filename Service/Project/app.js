var appmod = angular.module("ServiceProjectApp", ['inject', 'angularFileUpload']);
appmod.config(function ($routeProvider) {
    $routeProvider.when('/:projectId', {
        templateUrl: '/Content/src/modules/Service/Project/_UnitList.html'
    }).when('/:projectId/finish/:unitId', {
        templateUrl: '/Content/src/modules/Service/Project/_Finish.html'
    }).when('/:projectId/wbs', {
        templateUrl: '/Content/src/modules/Service/Project/_wbs.html'
    }).when('/:projectId/issue', {
        templateUrl: '/Content/src/modules/Service/Project/_issueList.html'
    }).when('/:projectId/unit/:unitId', {
        templateUrl: '/Content/src/modules/Service/Project/_Unit.html'
    }).when('/:projectId/unit/:unitId', {
        templateUrl: '/Content/src/modules/Service/Project/_Unit.html'
    }).when('/:projectId/unit/:unitId/IssueForm/:stageId', {
        templateUrl: '/Content/src/modules/Service/Project/_IssueForm.html'
    }).when('/servicereport', {
        controller: 'ServiceReportCtrl',
        templateUrl: '/Content/src/modules/POS/Report/ServiceReport.html',
        reloadOnSearch: false
    }).otherwise({
        redirectTo: '/:projectId'
    });
});
appmod.filter("dudayToThai", function ($sce) {
    return function (text) {
        var replaceText = { 'd': ' วัน', '-': 'เกินกำหนด  ', 'm': ' เดือน' };
        if (!_.isUndefinedNullOrEmpty(text)) {
            return text.replace(/d|-|m/g, function (match) {
                console.log('match', match)
                return replaceText[match];
            });
        } else {
        };
    };
});
appmod.filter("dayToThai", function ($sce) {
    return function (text) {
        //console.log(text);
        var replaceText = {
            '-': 'เมื่อ ',
            'seconds': 'สักครู่',
            'a minute': ' 1 นาทีที่แล้ว',
            'minutes': ' นาทีที่แล้ว',
            'an hour': ' 1 ชม.ที่แล้ว',
            'hours': ' ชม.ที่แล้ว',
            'd': ' วันที่แล้ว',
        };
        if (!_.isUndefinedNullOrEmpty(text)) {
            return text.replace(/-|seconds|a minute|minutes|an hour|hours|d/g, function (match) {
                return replaceText[match];
            });
        } else {
        };
    };
});