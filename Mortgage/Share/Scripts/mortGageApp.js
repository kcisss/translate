var mgGlobalApp = angular.module('mgGlobalApp', ['allNewInject', 'ngImgCrop', 'ui.mask'])

mgGlobalApp.directive('apsUploadFile', function () {
    return {
        restrict: 'E',
        template: '<input id="fileInput" type="file" class="ng-hide"> <md-button id="uploadButton" class="md-raised md-primary" aria-label="attach_file"> เลือกไฟล์ </md-button><md-input-container ng-hide="true"  md-no-float> <input id="textInput" ng-model="fileName" type="text" placeholder="No file chosen" ng-readonly="true"></md-input-container>',
        link: apsUploadFileLink
    }
});

function apsUploadFileLink(scope, element, attrs) {
    var input = $(element[0].querySelector('#fileInput'));
    var button = $(element[0].querySelector('#uploadButton'));
    var textInput = $(element[0].querySelector('#textInput'));

    if (input.length && button.length && textInput.length) {
        button.click(function (e) {
            input.click();
        });
        textInput.click(function (e) {
            input.click();
        });
    }

    input.on('change', function (e) {
        scope.hideFirst()
        scope.$apply();

        scope.handleFileSelect(e);
        scope.$apply();
    });
};

mgGlobalApp.controller('MgToolbarCtrl', function (allNewServ, $scope, MENUS, $location, $mdMedia, $mdDialog, $window, $rootScope) {
    INITPromise.then(function (obj) {
        allNewServ.GET('worker', 'Get', { id: obj.USER.WID }, false, '').then(function (worker) {
            allNewServ.GET('Config', 'Get', { token: 'abcd' }, false, '').then(function (config) {
                $scope.worker = worker;
                $scope.toolbar = config;

                $scope.MenusMG = []
                if (worker.Role == 4 || worker.Role == 2)
                    $scope.MenusMG.push({ label: 'รายงาน', path: '/Mortgage/Report/', keyMenu: 'Report' })


                if (_.contains([2, 3, 4], worker.Role)) {
                    var path = _.contains([2, 3], worker.Role) ? 'Bank/#!/' : 'Project/#!/';
                    $scope.MenusMG.unshift({ label: 'หน้าแรก', path: '/Mortgage/' + path, keyMenu: '' })
                }

                if ($location.absUrl().split('/')[3] !== '#!' && $location.absUrl().split('/')[3] !== '') {
                    if ($location.absUrl().split('/')[4] == "Bank") {
                        $rootScope.primary = "Mortgage "
                    } else {
                        $rootScope.primary = "Mortgage "
                    }
                }

            });
        });
    });

    MENUS.USER_2 = _.without(MENUS.USER_2, _.findWhere(MENUS.USER_2, { label: "คู่มือออนไลน์" }))
    $scope.menus = MENUS;
    $scope.openMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };
    $scope.goHome = function () {
        if (USER.Role != 2 && USER.Role != 3)
            $window.location.href = '/';
    }
    $scope.forClickMenu = function (type, ev) {
        if (type === 1) {
            window.$zopim || (function (d, s) {
                var z = $zopim = function (c) { z._.push(c); }, $ = z.s =
					d.createElement(s), e = d.getElementsByTagName(s)[0]; z.set = function (o) {
					    z.set.
							_.push(o);
					}; z._ = []; z.set._ = []; $.async = !0; $.setAttribute("charset", "utf-8");
                $.src = "//v2.zopim.com/?3jPQECe9n7jSfZj5FpAJrTVjKMCyez0A"; z.t = +new Date; $.
					type = "text/javascript"; e.parentNode.insertBefore($, e);
            })(document, "script");
            $zopim(function () {
                $zopim.livechat.window.show();
            });
        } else if (type === 2) {
            $mdDialog.show({
                controller: 'AboutController',
                templateUrl: '/content/src/share/modules/globalapp/partials/about.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function () {

            }, function () {

            });
        } else if (type === 99) {
            $mdDialog.show({
                controller: 'InfoControlller',
                templateUrl: '/content/src/share/modules/globalapp/partials/infoUser.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                locals: { params: $scope.worker },
            }).then(function () {

            }, function () {

            });
        }
    };
});
mgGlobalApp.controller('InfoControlller', function ($scope, allNewServ, mgGlobapServ, $mdDialog, params) {
    $scope.worker = params
    $scope.startSave = false;
    var elem = null;
    $scope.hideChangePassword = true;
    $scope.previewImg = $scope.worker.ProfilePicture;
    $scope.passwordMatching = function () {
        if (!_.isUndefinedNullOrEmpty($scope.worker.repeatPassword) && ($scope.worker.Password != $scope.worker.repeatPassword)) {
            $scope.passwordNotMathching = "รหัสผ่านไม่ตรงกัน!";
        } else {
            $scope.passwordNotMathching = false;
        }
    };
    $scope.changePassword = function () {
        $scope.startSave = true;
        $scope.passwordNotMathching = "";
        var model = {};
        model.Token2 = allNewServ.BASE64().encode(angular.toJson({
            UserNameOrEmail: $scope.worker.UserName,
            Password: $scope.worker.Password,
            CompanyGuid: COMPANY.Id,
            ApplicationGuid: GLOBALMODELCONFIG.application_clientId,
        }));
        mgGlobapServ.changePassword(model).then(function (success) {
            $scope.startSave = false;
            $scope.worker.Password = $scope.worker.repeatPassword = "";
        });
    };
    $scope.myImage = '';
    $scope.dataURItoBlob = function (dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {
            type: mimeString
        });
    };
    $scope.close = function () {
        $mdDialog.cancel();
    }
    $scope.hideFirst = function () {
        elem = document.getElementById('firstDialog')
        elem.style.opacity = 0;
    };
    $scope.handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '/content/src/modules/listmanager/setting/partials/crop.tmpl.html',
                    locals: {
                        myImage: $scope.myImage
                    },
                    skipHide: true
                }).then(function (val) {
                    elem.style.opacity = 1;
                    $scope.previewImg = '';
                    $scope.previewImg = val;
                }, function () {
                });
            });
        };
        reader.readAsDataURL(file);
    };
    $scope.uploadPhoto = function (showToast, fileImg, response) {
        if (!showToast) {
            mgGlobapServ.uploadCoverPhoto(fileImg, response.Id, true, 'save').then(function (result) {
                location.reload(true);
            });
        } else {
            location.reload(true);
        }
    };
    $scope.save = function () {
        if ($scope.previewImg.split('/')[0] !== "https:" && !_.isUndefinedNullOrEmpty($scope.previewImg)) {
            $scope.fileImg = $scope.dataURItoBlob($scope.previewImg);
            $scope.fileImg.name = _.newGuid();
        }

        var showToast = ($scope.fileImg != undefined) ? false : true;
        if ($scope.worker.Id > 0) {
            allNewServ.PUT('worker', 'PUT', $scope.worker, showToast, 'save').then(function (response) {
                $scope.uploadPhoto(showToast, $scope.fileImg, response);
            })
        } else {
            allNewServ.POST('worker', 'POST', $scope.worker, showToast, 'created').then(function (response) {
                $scope.uploadPhoto(showToast, $scope.fileImg, response);
            })
        }
    };
    $scope.showImage = function (ev, image) {
        //image = _.isUndefinedNullOrEmpty($scope.projCoverImg) ? image : $scope.projCoverImg
        $mdDialog.show({
            controller: showImage,
            templateUrl: '/Content/src/modules/Shared/showImage.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            skipHide: true, // this line does the trick
            locals: {
                image: image
            }
        }).then(function () {
        });
    };

    function DialogController($scope, $mdDialog, myImage) {
        $scope.myImage = myImage;
        $scope.myCroppedImage = '';

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.confirm = function () {
            $mdDialog.hide($scope.myCroppedImage);
        };
    };
});