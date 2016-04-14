var express = require('express');
var router = express.Router();

var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');

router.get('/info',
    function(req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`.  It is typically used to indicate scope of the token,
        // and used in access control checks.  For illustrative purposes, this
        // example simply returns the scope in the response.
        res.json({ 
        	user_id: req.user.userId, 
        	name: req.user.username, 
        	scope: req.authInfo.scope 
        });
    }
);

module.exports = router;