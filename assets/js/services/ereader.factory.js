(function (ng, app, crocodoc) {
    app.factory('Ereader', ['$http', '$interval', 'Config', function($http, $interval, config) {
        var providers = {
            CROCODOC: 'crocodoc'
        };

        var BaseReader = function () {
            this.reader = null;
            this.currentPage = null;
            this.totalPages = null;
        };

        BaseReader.prototype.zoomIn = function () { return false; };
        BaseReader.prototype.zoomOut = function () { return false; };
        BaseReader.prototype.goToPage = function () { return false; };
        BaseReader.prototype.nextPage = function () { return false; };
        BaseReader.prototype.previousPage = function () { return false; };
        BaseReader.prototype.getCurrentPage = function () { return false; };
        BaseReader.prototype.getTotalPages = function () { return false; };

        var createCrocodocReader = function (session, selector, callbacks) {
            try {
                var viewer = crocodoc.createViewer(selector, {
                    url: 'https://view-api.box.com/1/sessions/'+session+'/assets/',
                    layout: crocodoc.LAYOUT_VERTICAL_SINGLE_COLUMN,
                    plugins: {
                        realtime: {
                            url: 'https://view-api.box.com/sse/'+session
                        }
                    }
                });
                viewer.load();
                viewer.on('ready', function (event) {
                    callbacks.updatePageStatus(event.data.page, event.data.numPages);
                });
                viewer.on('pagefocus', function (event) {
                    callbacks.updatePageStatus(event.data.page, event.data.numPages);
                });
                viewer.on('fail', function (event) {
                    console.log(event);
                });
                stayInTouch(callbacks);

                var CrocodocReader = function (reader) {
                    this.reader = reader;
                };
                CrocodocReader.prototype = BaseReader.prototype;
                CrocodocReader.prototype.zoomIn = function () {
                    this.reader.zoom(crocodoc.ZOOM_IN);
                };
                CrocodocReader.prototype.zoomOut = function () {
                    this.reader.zoom(crocodoc.ZOOM_OUT);
                };
                CrocodocReader.prototype.goToPage = function (page) {
                    this.reader.scrollTo(page);
                };
                CrocodocReader.prototype.nextPage = function () {
                    this.reader.scrollTo(crocodoc.SCROLL_NEXT);
                };
                CrocodocReader.prototype.previousPage = function () {
                    this.reader.scrollTo(crocodoc.SCROLL_PREVIOUS);
                };
                CrocodocReader.prototype.getCurrentPage = function () {
                    return this.currentPage;
                };
                CrocodocReader.prototype.getTotalPages = function () {
                    return this.totalPages;
                };
                CrocodocReader.prototype.destroy = function () {
                    this.reader.destroy();
                    stayInTouch = null;
                }

                return new CrocodocReader(viewer);
            } catch (err) {
                console.log(err);
            }
        };

        var stayInTouch = function (callbacks) {
            var checkin = $interval(function() {
                $http.get(config.ereader.checkin.path)
                .success(function(data, status, headers, config) {
                    callbacks.updateConnectionStatus(true);
                })
                .error(function(data, status, headers, config) {
                    callbacks.updateConnectionStatus(false);
                });
            }, config.ereader.checkin.interval);
        }

        return {
            build: function (build_config) {
                console.log(build_config);
                switch (build_config.provider) {
                    case providers.CROCODOC:
                        return new createCrocodocReader(
                            build_config.session,
                            build_config.selector,
                            build_config.callbacks
                        );
                    default:
                        return null;
                }
            }
        };
    }]);
})(angular, packback, Crocodoc);
