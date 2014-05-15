/**
 * hashServiceSoapTestClient.js
 *
 * Used for testing purposes in addition with hashServiceSoapServer.js
 *
 * @author Putu Wiramaswara Widya <wiramaswara11@mhs.if.its.ac.id>
 * @author Ali Ariff <ali11@mhs.if.its.ac.id>
 */

var soap = require('soap');
var url = 'http://localhost:5000/wsdl?wsdl';

soap.createClient(url, function(err, client) {
    client.Md5({input: 'asdasd'}, function(err, result, body) {
        console.log(result.output);
    });
});
