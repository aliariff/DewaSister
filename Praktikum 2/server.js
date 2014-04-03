// DewaSister Praktikum II
// Konsumsi datanya data.bmkg.go.id berbasis XML
// Menggunakan RPC berobjek dan RPC tanpa objek

var request = require("request");
var dnode = require("dnode");
var xml2js = require("xml2js");
var express = require("express");
var shoe = require("shoe");

//request = request.defaults({'proxy':'http://10.151.34.10:8080'})

var ambilBerkas = function(url, callback) {
    request(url, function(error, response, body) {
       if(!error && response.statusCode == 200) {
           callback(body);
       } else {
           callback(null);
       }
    });
}

var konsumsiData = {
    cuacaIndonesia: function(callback) {
       ambilBerkas('http://data.bmkg.go.id/cuaca_indo_1.xml', function(data) {
            if(data != null) {
                xml2js.parseString(data, {"explicitArray": false },function(err, result) {
                    callback(result);
                });
            } else {
                callback(null);
            }
       });
    },

    cuacaInternasional: function(callback) {
       ambilBerkas('http://data.bmkg.go.id/cuaca_dunia_2.xml', function(data) {
            if(data != null) {
                xml2js.parseString(data, {"explicitArray": false },function(err, result) {
                    callback(result);
                });
            } else {
                callback(null);
            }
       });

    },

    cuacaJabodetabek: function(callback) {
       ambilBerkas('http://data.bmkg.go.id/cuaca_jabodetabek_1.xml', function(data) {
            if(data != null) {
                xml2js.parseString(data, {"explicitArray": false },function(err, result) {
                    callback(result);
                });
            } else {
                callback(null);
            }
       });

    },

    cuacaBandara: function(callback) {
       ambilBerkas('http://data.bmkg.go.id/aviation_observation.xml', function(data) {
            if(data != null) {
                xml2js.parseString(data, {"explicitArray": false },function(err, result) {
                    callback(result);
                });
            } else {
                callback(null);
            }
       });

    },

    gempaTerkini: function(callback) {
       ambilBerkas('http://data.bmkg.go.id/gempaterkini.xml', function(data) {
            if(data != null) {
                xml2js.parseString(data, {"explicitArray": false },function(err, result) {
                    callback(result);
                });
            } else {
                callback(null);
            }
       });

    }

};


var rpc = {
    berobjek: {
        dataCuacaIndonesia: null,
        dataCuacaInternasional: null,
        dataCuacaJabodetabek: null,
        dataCuacaBandara: null,
        dataGempaTerkini: null,
        ambilDataCuacaIndonesia: function(callback) {
            callback(rpc.berobjek.dataCuacaIndonesia);
        },
        ambilDataCuacaInternasional: function(callback) {
            callback(rpc.berobjek.dataCuacaInternasional);
        },
        ambilDataCuacaJabodetabek: function(callback) {
            callback(rpc.berobjek.dataCuacaJabodetabek);
        },
        ambilDataCuacaBandara: function(callback) {
            callback(rpc.berobjek.dataCuacaBandara);
        },
        ambilDataGempaTerkini: function(callback) {
            callback(rpc.berobjek.dataGempaTerkini);
        },
        ambilSemuaDataDariSumber: function() {
            konsumsiData.cuacaIndonesia(function(data) {
                rpc.berobjek.dataCuacaIndonesia = data;
            });
			konsumsiData.cuacaInternasional(function(data) {
                rpc.berobjek.dataCuacaInternasional = data;
            });
			konsumsiData.cuacaJabodetabek(function(data) {
                rpc.berobjek.dataCuacaJabodetabek = data;
            });
			konsumsiData.cuacaBandara(function(data) {
                rpc.berobjek.dataCuacaBandara = data;
            });
			konsumsiData.gempaTerkini(function(data) {
                rpc.berobjek.dataGempaTerkini = data;
            });
        }
    },
    takBerobjek : {
        ambilDataCuacaIndonesia: function(callback) {
			konsumsiData.cuacaIndonesia(function(data) {
				callback(data);
			});
        },
        ambilDataCuacaInternasional: function(callback) {
            konsumsiData.cuacaInternasional(function(data) {
				callback(data);
			});
        },
        ambilDataCuacaJabodetabek: function(callback) {
            konsumsiData.cuacaJabodetabek(function(data) {
				callback(data);
			});
        },
        ambilDataCuacaBandara: function(callback) {
            konsumsiData.cuacaBandara(function(data) {
				callback(data);
			});
        },
        ambilDataGempaTerkini: function(callback) {
            konsumsiData.gempaTerkini(function(data) {
				callback(data);
			});
        }
    }
};

rpc.berobjek.ambilSemuaDataDariSumber();
setInterval(function() {
    rpc.berobjek.ambilSemuaDataDariSumber();
}, 5000);

// Server initialization part


var sock = shoe(function(stream) {
    var d = dnode(rpc);
    d.pipe(stream).pipe(d);
});

var app = express();
app.configure(function() {
    app.use(express.static(__dirname));
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.set('views', __dirname)
});

app.get('/', function(req, res) {
    res.redirect('/cuaca_indonesia');
});
app.get('/cuaca_indonesia', function(req, res) {
    res.render('viewer.ejs', {'iframe': 'cuaca_indonesia.html'})
});
app.get('/cuaca_internasional', function(req, res) {
    res.render('viewer.ejs', {'iframe': 'cuaca_internasional.html'})
});
app.get('/cuaca_jabodetabek', function(req, res) {
    res.render('viewer.ejs', {'iframe': 'cuaca_jabodetabek.html'})
});
app.get('/cuaca_bandara', function(req, res) {
    res.render('viewer.ejs', {'iframe': 'cuaca_bandara.html'})
});
app.get('/gempa_terkini', function(req, res) {
    res.render('viewer.ejs', {'iframe': 'gempa_terkini.html'})
});

sock.install(app.listen(3000), '/dnode');
