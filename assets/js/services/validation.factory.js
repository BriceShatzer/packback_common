(function (ng, app) {
    app.factory('Validation', ['$http', function($http) {
        return {
            validateEmail: function (email) {
                return this._isEmail(email);
            },
            validatePassword: function (password) {
                return this._isMin(password, 4);
            },
            validatePasswordMatches: function (password, confirmation) {
                return this._isMatch(password, confirmation);
            },
            _isMatch: function (first, second) {
                return first === second;
            },
            _isEmail: function (subject) {
                var re = new RegExp(/\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/i);
                return this._isRegex(subject, re);
            },
            _isRegex: function (subject, pattern) {
                subject = subject || '';
                pattern = pattern || new RegExp(/.*/);
                return pattern.test(subject);
            },
            _isMin: function (subject, length) {
                length = length || 0;
                var re = new RegExp("^.{"+length+",}$");
                return this._isRegex(subject, re);
            },
            _isMax: function (subject, length) {
                length = length || 0;
                var re = new RegExp("^.{,"+length+"}$");
                return this._isRegex(subject, re);
            }
        };
    }]);
})(angular, packback);
