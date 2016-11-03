'use strict';

var https = require('https');
var qs = require('querystring');
var stream = require('stream');
var log = require('debug')('faust');

var pullout = require('pullout');
var exec = require('execon');

var GithubAuth      = {
    host: 'github.com',
    port: 443,
    path: '/login/oauth/access_token',
    method: 'POST'
};

module.exports = function(key, secret) {
    return auth.bind(null, key, secret);
};
 
function auth(key, secret, req, callback) {
    var code,
        isReq   = req instanceof stream.Readable;
    
    if (!isReq)
        code    = req;
    
    exec.if(!isReq, function() {
        code    = code.replace('code=', '');
        
        log(code);
        
        authenticate(key, secret, code, function(error, token) {
            var result = { 'token': token };
            log(error || result);
            
            callback(error, result);
        });
    }, function(fn) {
        pullout(req, 'string', function(error, body) {
            code = body;
            
            if (error)
                callback(error);
            else
                fn();
        });
    });
}

function authenticate(key, secret, code, callback) {
    var req,
        data            = qs.stringify({
            client_id       : key,
            client_secret   : secret,
            code            : code
        });
    
    log(key, secret, data);
    
    GithubAuth.headers  = { 'content-length': data.length };
    
    req = https.request(GithubAuth, function(res) {
        pullout(res, 'string', function(error, body) {
            var parsed, token;
            
            if (!error) {
                parsed  =  qs.parse(body);
                
                if (parsed)
                    token   =  parsed.access_token;
            }
            
            callback(error, token);
        });
    });
    
    req.end(data);
    
    req.on('error', callback);
}
