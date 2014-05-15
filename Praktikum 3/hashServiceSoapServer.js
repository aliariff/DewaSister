/**
 * hashServiceSoapServer.js
 *
 * Provided you an hasing service through a SOAP web service based protocol
 * Hashing service provided : md5, sha1, sha224
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 * @author Ali Ariff <ali11@mhs.if.its.ac.id>
 */

var fs = require('fs');
var soap = require('soap');
var request = require('request');
var http = require('http');
var crypto = require('crypto');

var hashService = {
    HashService: {
        HashPort: {
            Md5: function(args) {
                var sum = crypto.createHash('md5');
                sum.update(args.input);
                return {output: sum.digest('hex')}
            },
            Sha1: function(args) {
                var sum = crypto.createHash('sha1');
                sum.update(args.input);
                return {output: sum.digest('hex')}
            },
            Sha224: function(args) {
                var sum = crypto.createHash('sha224');
                sum.update(args.input);
                return {output: sum.digest('hex')}
            }
        }
    }
};

var xml = require('fs').readFileSync('hashService.wsdl', 'utf8');
var server = http.createServer(function(req,res) {
    res.end("404 Not Found");
});

server.listen(5000);
soap_server = soap.listen(server, '/wsdl', hashService, xml);
soap_server.log = function(type, data) {
    console.log(type);
    console.log(data);
};
