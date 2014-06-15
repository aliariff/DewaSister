// The Manager

var express = require('express');
var http = require('http');
var mongodb = require('mongodb');
var morgan = require('morgan');

var app = express();
app.configure(function() {
    app.use(express.static(__dirname));
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(morgan());
    app.set('views', __dirname)
});

app.listen(3000);


mongodb.MongoClient.connect("mongodb://localhost:27017/fpsister", function(err, db) {
    if(!err) {
        var dataset = db.collection('dataset');
        var centroid = db.collection('centroid');
        var worker = db.collection('worker');

        app.get('/dataset', function (req, res) {
            if(req.query.rowNumbers && req.query.workerName) {
                // Request
                var rowNumbers = parseInt(req.query.rowNumbers);
                // Maximum 1000 per request
                if(rowNumbers > 1000) {
                    rowNumbers = 1000;
                }

                // Insert as worker
                worker.save({
                    ip: req.connection.remoteAddress,
                    name: req.query.workerName
                }, function(err, worker) {
                    // Response
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    var stream = dataset.find({occupiedBy: {'$exists': false}}).limit(rowNumbers).stream();
                    res.write('[')
                    var first = true;
                    stream.on('data', function(item) {
                        if(!first) {
                          res.write(',' + JSON.stringify(item));
                        } else {
                          res.write(JSON.stringify(item));
                          first = false;
                        }
                        item.occupiedBy = {
                            workerID: worker._id,
                            startTime: new Date(),
                            finished: false
                        };
                        dataset.save(item, function(err) { });
                    });
                    stream.on('end', function() {
                        res.end(']');
                    });
                });
            } else {
                res.end('{"error": "Request body not provided"}');
            }
        });

        app.post('/dataset', function(req, res) {
            if(req.body.dataSet) {
                for(idx in req.body.dataSet) {
                    dataset.save({
                        _id: req.body.dataSet[idx].id,
                        result: req.body.dataSet[idx].result,
                        occupiedBy: {
                            endTime: new Date()
                        }
                    }, function() {
                    });
                }
            } else {
                res.end('{"error": "Request body not provided"}');
            }
        });

        app.get('/centroid', function(req, res) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            var stream = centroid.find({occupiedBy: {'$exists': false}}).stream();
            res.write('[')
            var first = true;
            stream.on('data', function(item) {
                if(!first) {
                  res.write(',' + JSON.stringify(item.data));
                } else {
                  res.write(JSON.stringify(item.data));
                  first = false;
                }
            });
            stream.on('end', function() {
                res.end(']');
            });
        });

        app.get('/property', function(req, res) {
            var result = {};
            result.dsProperty = {};
            result.worker = [];
            dataset.count(function(err, count) {
                result.dsProperty.totalRow = count;
                dataset.find({'occupiedBy.finished': true}).count(function(err, count) {
                    result.dsProperty.totalClassificated = count;
                    dataset.find({'occupiedBy.finished': false}).count(function(err, count) {
                        result.dsProperty.totalOccupied = count;
                        result.dsProperty.totalUnclassificated = result.dsProperty.totalRow - result.dsProperty.totalClassificated;
                        result.dsProperty.algorithm = "K-Means Clustering";
                        worker.find().each(function (err, item) {
                            if(item == null) {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify(result));
                            } else {
                                result.worker.push(item);
                            }
                        });
                    });
                })
            })
        });

        // Every minute, clear up occupiedBy data of dataset which its startTime beyond a hour
        setInterval(function() {
            var cue = new Date();
            cue.setHours(cue.getHours() - 1);
            console.log('Deleting orphaned dataset occupation data..')
            dataset.update({'occupiedBy.startTime': {'$lt': cue}}, {'$unset': {'occupiedBy': ""}}, {multi: true},  function(err, count) {
                console.log('Got ' + count + ' deleted');
            });
        }, 60000)

    }
});
