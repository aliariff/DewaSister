var soap = require('soap');
var express = require('express');
var http = require('http');

var requestStockQuote = null;

soap.createClient('./soapClientWSDL/stockquote.asmx.xml', function(err, client) {
	//console.log(client);

	requestStockQuote = function(symbol) {
		client.GetQuote({'symbol': symbol}, function(err, result, body) {
			console.log(result);
		}, {
			proxy: "http://10.151.34.10:8080",
			strictSSL: false
		});
	}
	
    //console.log();
});

var app = express();
app.configure(function() {
    app.use(express.static(__dirname));
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.set('views', __dirname)
});

app.get('/stock/:param', function(req, res) {
    res.render('viewStock.ejs')
});

app.get('/currency', function(req, res) {
    res.render('viewCurrency.ejs')
});

app.get('/cuaca', function(req, res) {
    res.render('viewCuaca.ejs')
});

app.listen(3000);
