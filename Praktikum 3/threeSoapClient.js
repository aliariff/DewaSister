var soap = require('soap');
var express = require('express');
var http = require('http');

var requestStockQuote = null;
var requestConversionRate = null;
var requestCitiesByCountry = null;
var requestWeather = null;

// Komen kalau gak butuh proxy
var proxy = { proxy: "http://10.151.34.10:8080", strictSSL: false };

soap.createClient('./soapClientWSDL/stockquote.asmx.xml', function(err, client) {
	//console.log(client);

	requestStockQuote = function(symbol, callback) {
		client.GetQuote({'symbol': symbol}, function(err, result, body) {
			callback(result);
		}, proxy);
	}
	
    //console.log();
});

soap.createClient('./soapClientWSDL/CurrencyConvertor.asmx.xml', function(err, client) {
	//console.log(client);

	requestConversionRate = function(FromCurrency, ToCurrency, callback) {
		client.GetConversionRate({'FromCurrency': FromCurrency, 'ToCurrency': ToCurrency}, function(err, result, body) {
			callback(result);
		}, proxy);
	}
	
    //console.log();
});

soap.createClient('./soapClientWSDL/globalweather.asmx.xml', function(err, client) {
	//console.log(client);

	requestCitiesByCountry = function(CountryName, callback) {
		client.GetCitiesByCountry({'CountryName': CountryName}, function(err, result, body) {
			callback(result);
		}, proxy);
	}
	
	requestWeather = function(CityName, CountryName, callback) {
		client.GetCitiesByCountry({'CityName': CityName, 'CountryName': CountryName}, function(err, result, body) {
			callback(result);
		}, proxy);
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
	// Cek dulu apakah variabel requestStockQuote apa masih null, kalau iya kasih pesan error dulu (SOAP nya berarti belum ke load pas pertama kali load skrip ini
    res.render('viewStock.ejs')
});

app.get('/currency', function(req, res) {
    res.render('viewCurrency.ejs')
});

app.get('/cuaca', function(req, res) {
    res.render('viewCuaca.ejs')
});

app.listen(3000);
