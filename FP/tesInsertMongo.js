var csv = require('csv');
var lblReader = require('line-by-line');
var Server = require('mongo-sync').Server;

var lr = new lblReader('./kddcup.data.corrected');

var server = new Server('127.0.0.1');
var count = 0;
lr.on('line', function(line) {
    count++;
    csv.parse(line,  function(err, output) {
        server.db('fpsister').getCollection('dataset').insert({data: output});
    });
});
lr.on('end', function() {
    console.log(count);
})

