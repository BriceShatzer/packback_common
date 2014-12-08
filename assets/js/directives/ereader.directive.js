(function (ng, app, window) {
    app.directive("ereader", ['Config', function(config) {
            var keyBuffer = [];

            var arrays_equal = function (a, b) {
                return !(a < b || b < a);
            };

            return {
                restrict: 'E',
                templateUrl: config.templates.reader,
                replace: true,
                controller : "EreaderController",
                link: function(scope, elem, attrs) {
                    scope.config = {
                        session: attrs.session,
                        provider: attrs.provider,
                        selector: '#'+attrs.id+' .viewer',
                        expiration: window.Date.parse(attrs.expiration)
                    }
                    elem.css({height: '100%', width: '100%'})
                    .bind("contextmenu", function (e) {
                        e.preventDefault();
                    })
                    .bind("keydown", function (e) {
                        if (keyBuffer.length > 2) {
                            keyBuffer = [];
                        }
                        keyBuffer.push(e.keyCode);
                        console.log(keyBuffer);
                        var CmdA = [91,65];
                        var CmdC = [91,67];
                        var CtrlA = [17,65];
                        var CtrlC = [17,67];
                        if (arrays_equal(CmdA, keyBuffer)
                            || arrays_equal(CmdC, keyBuffer)
                            || arrays_equal(CtrlA, keyBuffer)
                            || arrays_equal(CtrlC, keyBuffer)) {
                            keyBuffer = [];
                            return false;
                        }
                    });
                }
            };
        }
    ]);
})(angular, packback, window);
