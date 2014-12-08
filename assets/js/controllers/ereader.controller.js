(function (ng, app) {
    app.controller("EreaderController", ['$scope', '$timeout', 'Ereader', function ($scope, $timeout, ereader) {
        var states = {
            ACTIVE: 'active',
            LOADING: 'loading',
            NO_CONNECTION: 'no.connection',
            EXPIRED_SESSION: 'expired.session'
        };

        $scope.config = {};
        $scope.reader = null;
        $scope.currentpage = null;
        $scope.totalpages = null;
        $scope.status = states.LOADING;

        $scope.$watch('config', function(newValues, oldValues) {
            if (newValues !== {}) {
                try {
                    newValues.callbacks = callbacks;
                    $scope.reader = ereader.build(
                        newValues
                    );
                } catch (err) {
                    console.log(err);
                }
            }
        });

        $scope.$watch('status', function (value) {
            if (value == states.NO_CONNECTION) {
                $scope.reader.destroy();
            }
        });

        $scope.statusIs = function (status) {
            return status == $scope.status;
        };

        $scope.zoomIn = function () {
            $scope.reader.zoomIn();
        };

        $scope.zoomOut = function () {
            $scope.reader.zoomOut();
        };

        $scope.nextPage = function () {
            $scope.reader.nextPage();
        };

        $scope.previousPage = function () {
            $scope.reader.previousPage();
        };

        $scope.goToPage = function () {
            if ($scope.currentpage) {
                $scope.reader.goToPage($scope.currentpage);
            }
        };

        var callbacks = {
            updateConnectionStatus: function (is_connected) {
                $timeout(function() {
                    is_connected = is_connected || false;
                    $scope.status = is_connected ? states.ACTIVE : states.NO_CONNECTION;
                    $scope.$apply();
                });
            },
            updatePageStatus: function (currentpage, totalpages) {
                $timeout(function() {
                    $scope.status = states.ACTIVE;
                    $scope.currentpage = currentpage;
                    $scope.totalpages = totalpages;
                    $scope.$apply();
                });
            }
        };
    }]);
})(angular, packback);
