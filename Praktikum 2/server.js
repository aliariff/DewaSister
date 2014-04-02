// DewaSister Praktikum II
// Konsumsi datanya data.bmkg.go.id berbasis XML
// Menggunakan RPC berobjek dan RPC tanpa objek

var request = require("request");
var dnode = require("dnode");
var xml2js = require("xml2js");
var express = require("express");
var shoe = require("shoe");


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
       ambilBerkas('http://data.bmkg.go.id/cuaca_dunia_1.xml', function(data) {
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
       ambilBerkas('http://data.bmkg.go.id/aviation_id.xml', function(data) {
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
        dataCuacaIndonesia: "Nol",
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
            // Tambahi untuk data lainnya
        }
    },
    takBerobjek : {
        // Fungsine padaha, nanging menawi dipanggil langsung nyeluk soko konsumsiData
    }
};

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

app.get('/cuaca_indonesia', function(req, res) {
    res.render('viewer.ejs', {'iframe': 'cuaca_indonesia.html'})
})

sock.install(app.listen(3000), '/dnode');
