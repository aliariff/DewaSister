var soap = require('soap');

soap.createClient('http://10.151.34.10:8080', {
    wsdl_options: {
        path : 'http://www.webservicex.net/stockquote.asmx?WSDL'
    }
}, function(err, client) {
    console.log(client);
});
