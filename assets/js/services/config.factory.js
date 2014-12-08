(function (ng, app) {
    app.factory('Config', function () {
        return {
            ereader: {
                checkin: {
                    interval: 10000,
                    path: '/angular/reader'
                }
            },
            templates: {
                reader: '/angular/reader'
            }
        };
    });
})(angular, packback);

