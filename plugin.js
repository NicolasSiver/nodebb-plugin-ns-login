(function (Plugin) {
    'use strict';

    //NodeBB list of Hooks: https://github.com/NodeBB/NodeBB/wiki/Hooks
    Plugin.hooks = {
        statics: {
            load: function (params, callback) {
                var router      = params.router,
                    middleware  = params.middleware,
                    controllers = params.controllers,
                    apiUri      = '/api/ns/login';

                router.post(apiUri, function (req, res, next) {
                    res.json({
                        status: 'OK'
                    });
                });

                callback();
            }
        }
    };

})(module.exports);