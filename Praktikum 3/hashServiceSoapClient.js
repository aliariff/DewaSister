var soap = require('soap');
var express = require('express');
var app = express();
app.configure(function() {
    app.use(express.static(__dirname));
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.set('views', __dirname)
});


var service = {};
url = 'http://localhost:5000/wsdl?wsdl';

soap.createClient(url, function(err, client) {
    service.getMd5 = function(input, callback) {
        client.Md5(input, function(err, result, body) {
            callback(result);
        });
    };

    service.getSha1 = function(input, callback) {
        client.Sha1(input, function(err, result, body) {
            callback(result);
        });
    };

    service.getSha224 = function(input, callback) {
        client.Sha224(input, function(err, result, body) {
            callback(result);
        });
    };
});


app.get('/', function(req, res) {
    res.render('hashServiceWebClient.ejs')
});

// REST API part
app.post('/:method', function(req, res) {
    var input = req.body;
    var method = req.params.method;
    if(method == "md5" && service.getMd5) {
        service.getMd5(input, function(result) {
            res.json(result);
        });
    } else if(method == "sha1" && service.getSha1) {
        service.getSha1(input, function(result) {
            res.json(result);
        });
    } else if(method == "sha224" && service.getSha224) {
        service.getSha224(input, function(result) {
            res.json(result);
        });
    }
});

app.listen(4000);
