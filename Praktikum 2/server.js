// DewaSister Praktikum II
// Konsumsi datanya data.bmkg.go.id berbasis XML
// Menggunakan RPC berobjek dan RPC tanpa objek

var request = require("request");
var dnode = require("dnode");
var xml2js = require("xml2js");


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


var rpcBerobjek = {
    dataCuacaIndonesia: null,
    dataCuacaInternasional: null,
    dataCuacaJabodetabek: null,
    dataCuacaBandara: null,
    dataGempaTerkini: null,
    ambilDataCuacaIndonesia: function(callback) {
        callback(rpbBerobjek.dataCuacaIndonesia);
    },
    ambilDataCuacaInternasional: function(callback) {
        callback(rpbBerobjek.dataCuacaInternasional);
    },
    ambilDataCuacaJabodetabek: function(callback) {
        callback(rpbBerobjek.dataCuacaJabodetabek);
    },
    ambilDataCuacaBandara: function(callback) {
        callback(rpbBerobjek.dataCuacaBandara);
    },
    ambilDataGempaTerkini: function(callback) {
        callback(rpbBerobjek.dataGempaTerkini);
    },
    ambilSemuaDataDariSumber: function() {
        konsumsiData.cuacaIndonesia(function(data) {
            rpbBerobjek.dataCuacaIndonesia = data;
        });
    }
};

setInterval(function() {
    rpbBerobjek.ambilSemuaDataDariSumber();
}, 5000);

var rpcTanpaObjek = {
    // Fungsine padaha, nanging menawi dipanggil langsung nyeluk soko konsumsiData

};

konsumsiData.gempaTerkini(function(data) {
    console.log(JSON.stringify(data));
})

