var soap = require('soap');
var express = require('express');
var http = require('http');
var xml2js = require("xml2js");

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
			xml2js.parseString(result.GetQuoteResult, {"explicitArray": false }, function(errXml, resultXml) {
				callback(resultXml.StockQuotes.Stock);
			});
		}, proxy);
	}
	
    //console.log();
});

soap.createClient('./soapClientWSDL/CurrencyConvertor.asmx.xml', function(err, client) {
	//console.log(client);

	requestConversionRate = function(FromCurrency, ToCurrency, callback) {
		client.ConversionRate({'FromCurrency': FromCurrency, 'ToCurrency': ToCurrency}, function(err, result, body) {
			callback(result.ConversionRateResult);
		}, proxy);
	}
	
    //console.log();
});

soap.createClient('./soapClientWSDL/globalweather.asmx.xml', function(err, client) {
	//console.log(client);

	requestCitiesByCountry = function(CountryName, callback) {
		client.GetCitiesByCountry({'CountryName': CountryName}, function(err, result, body) {
			//console.log(result.GetCitiesByCountryResult);
			if (typeof result.GetCitiesByCountryResult != 'undefined') {
				xml2js.parseString(result.GetCitiesByCountryResult, {"explicitArray": false }, function(errXml, resultXml) {
					//console.log(resultXml.NewDataSet.Table);
					callback(resultXml.NewDataSet.Table);
				});
			} else {
				callback(null);
			}
		}, proxy);
	}
	
	requestWeather = function(CityName, CountryName, callback) {
		client.GetWeather({'CityName': CityName, 'CountryName': CountryName}, function(err, result, body) {			
			//console.log(result);
			xml2js.parseString(result.GetWeatherResult, {"explicitArray": false }, function(errXml, resultXml) {
				//console.log(resultXml);
				if (typeof resultXml != 'undefined') {
					//console.log(resultXml.CurrentWeather);
					callback(resultXml.CurrentWeather);
				} else {
					callback(null);
				}
			});
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
	if (requestStockQuote == null) {
		return;
	}
	
	var hasil = requestStockQuote(req.params.param, function(result) {
		//console.log(result);
		res.render('viewStock.ejs', {'result': result});
	});
	
});

app.get('/currency/:from/:to', function(req, res) {
	if (requestConversionRate == null) {
		return;
	}
	
	var from  = req.params.from.toUpperCase();
	var to  = req.params.to.toUpperCase();
	var hasil = requestConversionRate(from, to, function(result) {
		//console.log(result);
		result_array = {
			from: from,
			to: to,
			value: result
		};
		res.render('viewCurrency.ejs', {'result': result_array});
	});
	
});

app.get('/cuaca/:negara', function(req, res) {
	if (requestCitiesByCountry == null) {
		return;
	}
	
	var negara  = req.params.negara;
	var hasil = requestCitiesByCountry(negara, function(result) {
		//console.log(result);
		if (result != null) {
			res.render('viewKota.ejs', {'result': result});
		} else {
			res.render('viewError.ejs');
		}
	});
	
});

app.get('/cuaca/:negara/:kota', function(req, res) {
	if (requestWeather == null) {
		return;
	}
	
	var negara  = req.params.negara;
	var kota  = req.params.kota;
	var hasil = requestWeather(kota, negara, function(result) {
		//console.log(result);
		if (result != null) {
			res.render('viewCuaca.ejs', {'result': result});
		} else {
			res.render('viewError.ejs');
		}
	});
	
});

app.listen(3000);
