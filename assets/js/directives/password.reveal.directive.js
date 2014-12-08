(function (ng, app) {
    app.directive("passwordReveal", function() {
            return {
                controller: 'PasswordController'
            };
        }
    );
})(angular, packback);
