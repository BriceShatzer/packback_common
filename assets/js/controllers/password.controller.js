(function (ng, app) {
    app.controller("PasswordController", ['$scope', 'Validation', function ($scope, validation) {
        $scope.user = {};
        $scope.readyFor = function (state) {
            switch (state) {
                case 'password':
                    return this.readyForPassword();
                case 'password.confirm':
                    return this.readyForPasswordConfirmation();
                case 'submit':
                    return this.readyForSubmit();
            }
            return false;
        };
        $scope.readyForPassword = function () {
            return validation.validateEmail($scope.user.email);
        };
        $scope.readyForPasswordConfirmation = function () {
            return this.readyForPassword()
                && validation.validatePassword($scope.user.password);
        };
        $scope.readyForSubmit = function () {
            return this.readyForPasswordConfirmation()
                && validation.validatePasswordMatches($scope.user.password, $scope.user.password_confirmation);
        };
    }]);
})(angular, packback);
