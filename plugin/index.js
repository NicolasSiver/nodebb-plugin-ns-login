(function (Plugin) {
    'use strict';

    var ExpressBrute = require('express-brute'),
        moment       = require('moment'),
        async        = require('async'),

        nodebb       = require('./nodebb'),
        utils        = nodebb.utils,
        user         = nodebb.user,
        db           = nodebb.db,
        passwordUtil = nodebb.password,
        winston      = nodebb.winston,

        store        = new ExpressBrute.MemoryStore(),
        settings     = {
            freeRetries : 5,
            proxyDepth  : 1,
            minWait     : 5 * 60 * 1000, // 5 minutes
            maxWait     : 60 * 60 * 1000, // 1 hour,
            failCallback: failCallback
        },
        userDefence  = new ExpressBrute(store, settings);

    function failCallback(req, res, next, nextValidRequestDate) {
        res.status(403).json({
            message: 'You have made too many failed attempts in a short period of time, please try again ' + moment(nextValidRequestDate).fromNow()
        });
    }

    //NodeBB list of Hooks: https://github.com/NodeBB/NodeBB/wiki/Hooks
    Plugin.hooks = {
        statics: {
            load: function (params, callback) {
                var router      = params.router,
                    middleware  = params.middleware,
                    controllers = params.controllers,
                    apiUri      = '/api/ns/login';

                router.post(
                    apiUri,
                    userDefence.getMiddleware({
                        key: function (req, res, next) {
                            // prevent too many attempts for the same username
                            next(req.body.username);
                        }
                    }),
                    function (req, res, next) {
                        var username = req.body.username, userSlug = null,
                            password = req.body.password, uid = null, userObject = null;

                        if (!username) {
                            return res.status(400).json({
                                message: 'Username is not provided, username and password are required fields'
                            });
                        }

                        if (!password) {
                            return res.status(400).json({
                                message: 'Password is empty'
                            });
                        }

                        userSlug = utils.slugify(username);

                        async.waterfall([
                            async.apply(user.getUidByUserslug, userSlug),
                            function (_uid, next) {
                                if (!_uid) {
                                    return next(new Error('User ' + userSlug + ' does not exist'));
                                }

                                uid = _uid;
                                next();
                            },
                            function (next) {
                                async.parallel({
                                    user   : async.apply(user.getUserData, uid),
                                    secure : async.apply(db.getObjectFields, 'user:' + uid, ['password', 'banned', 'passwordExpiry']),
                                    isAdmin: async.apply(user.isAdministrator, uid)
                                }, next);
                            },
                            function (payload, next) {
                                if (parseInt(payload.secure.banned) === 1) {
                                    return next(new Error('User ' + userSlug + ' is banned.'));
                                }
                                userObject = payload.user;
                                passwordUtil.compare(password, payload.secure.password, next);
                            },
                            function (passwordMatch, next) {
                                if (!passwordMatch) {
                                    return next(new Error('Invalid Password'));
                                }
                                next(null, userObject);
                            }
                        ], function (error, user) {
                            if (error) {
                                return res.status(403).json({
                                    message: error.message
                                });
                            }
                            winston.log('verbose', '[plugins/ns-login] Successful external login, uid: %d', uid);
                            res.json(user);
                        });
                    });

                callback();
            }
        }
    };

})(module.exports);