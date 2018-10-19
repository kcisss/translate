appmod.controller("LayoutCtrl", function ($scope, $service, localStorageService, $location) {
    $scope.LogOut = function () {
        localStorageService.remove('authorizationData');
        $location.path('/login');
    };
});
appmod.controller("LoginCtrl", function (currentAuth, $scope, $service, localStorageService, $location) {
    $scope.Login = function (user) {
        $service.login(user).then(function (res) {
            $location.path('/home');
        }, function (err) {
            console.log(err);
        });
    };
});
appmod.controller("SignUpCtrl", function (currentAuth, $scope, $location, $service) {
    $scope.Register = function (user) {
        $service.register(user).then(function (res1) {
            console.log(res1)
            $service.login(user).then(function (res2) {
                $location.path('/home');
            }, function (err1) {
                console.log(err1);
            });
        }, function (err2) {
            console.log(err2);
        });
    };
});
appmod.controller("HomeCtrl", function (currentAuth, $service, $scope) {
    $service.getClients().then(function (res) {
        $scope.allClients = res;
    });
    $scope.trimDash = function (str) {
        return str.split('-').join('');
    }
});
appmod.controller("detailCtrl", function ($routeParams, $service, $scope, $mdToast) {
    $service.getClient($routeParams.id).then(function (res) {
        $scope.client = res;
        //console.log($scope.client)
    });
    $service.getConnections($routeParams.id).then(function (res) {
        $scope.allConnections = res;
        //console.log($scope.client)
    });
    $scope.addConnection = function (conn) {
        conn.ClientId = $routeParams.id;
        conn.Id = guid();
        //console.log(conn)
        var Id = conn.Id.split('-').join('');
        var cId = conn.ClientId.split('-').join('');
        //console.log(sha256(cId + $scope.client.Origin + Id));
        conn.Hash = sha256(cId + $scope.client.Origin + Id);
        $service.addClientLine(conn).then(function (res) {
            $mdToast.show($mdToast.simple().textContent('เพิ่มสำเร็จ!').position('bottom left').hideDelay(3000));
        });
    };
    $scope.trimDash = function (str) {
        return str.split('-').join('');
    };
});
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}
appmod.controller("AccountCtrl", function (currentAuth, $service, $scope, $mdToast) {
    $scope.CreateClient = function (client) {
        $service.createClient(client).then(function (res) {
            $mdToast.show($mdToast.simple().textContent('สร้างสำเร็จ!').position('bottom left').hideDelay(3000));
        }, function () { });
    };
});