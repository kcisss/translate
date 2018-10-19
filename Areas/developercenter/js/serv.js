appmod.factory("Auth", function ($q, localStorageService) {
    return {
        $waitForSignIn: function () {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        },
        $requireSignIn: function () {
            var deferred = $q.defer();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                deferred.resolve(true);
            } else {
                deferred.reject("AUTH_REQUIRED");
            }
            return deferred.promise;
        },
        $requireSignOut: function () {
            var deferred = $q.defer();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                deferred.reject("AUTH_NOTREQUIRED");
            } else {
                deferred.resolve(true);
            }
            return deferred.promise;
        }
    };
});
appmod.factory("$service", function ($http, $q, $location, localStorageService,$rootScope) {
    return {
        createClient: function (client) {
            var deferred = $q.defer();
            client.AccountId = $rootScope.CurrUser.UID;
            $http({
                method: 'POST',
                url: $location.protocol() + '://' + location.host + '/api/Client/Post',
                data: client
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
        getClients: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $location.protocol() + '://' + location.host + '/api/Client/GetByAccId',
                params: { id: $rootScope.CurrUser.UID }
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
        getClient: function (id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $location.protocol() + '://' + location.host + '/api/Client/Get',
                params: { id: id }
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
        addClientLine: function (conn) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $location.protocol() + '://' + location.host + '/api/ClientLine/POST',
                data: conn
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
        getConnections: function (id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: $location.protocol() + '://' + location.host + '/api/ClientLine/GetByClient',
                params: { id: id }
            }).then(function (res) {
                deferred.resolve(res.data)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
        register: function (user) {
            console.log($location.protocol() + '://' + location.host + '/api/ployaccount/register', user)
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $location.protocol() + '://' + location.host + '/api/AccountPloy/Register',
                data: user
            }).then(function (res) {
                deferred.resolve(res)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
        login: function (user) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $location.protocol() + '://' + location.host + '/api/AccountPloy/Login',
                data: {
                    username: user.UserName,
                    password: user.Password,
                    confirmPassword: user.Password
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
            }).then(function (res) {
                //console.log(res)
                localStorageService.set('authorizationData', {
                    access_token: "thisistoken",
                    userName: res.data.UserName,
                    UID: res.data.Id
                });
                deferred.resolve(res.data)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
    };
});