(function (window, ng) {
    window.packback = ng.module('Packback', []);
})(window, angular);

(function (ng, app) {
    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    });
})(angular, packback);

(function ($) {
    $(document)
    .foundation()
    .ready(function() {

    });
})($);
