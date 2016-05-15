var api = {};
global.api = api;
api.net = require('net');
api.cluster = require('cluster');
api.os = require('os');

var initialArr = [3, 5, -3, 5.3, 20,  -9, 43, -23.7, 65, 76, 34, 56];
var results = [];
var cpuCount = api.os.cpus().length;
var clients = [];

var server = api.net.createServer(function(socket) {
  clients.push(socket);
  console.log('Connected: ' + socket.localAddress);
  console.log("Cpu count: " + cpuCount);
  console.log("The number of clients: " + clients.length);

  var taskNumber;
  var start = 0;
  var end;
  results = [];
  for(var i = 0; i < clients.length; i++) {
    taskNumber = initialArr.length / clients.length;
    end = start + taskNumber;
    if(i === clients.length - 1 && end < initialArr.length){
      end = initialArr.length;
    }
    console.log("Start: " + start);
    console.log("End: " + end);
    clients[i].write(JSON.stringify(initialArr.slice(start, end)));
    start = end;
  }

  socket.on('data', function(data) {
    console.log('Data received (by server): ' + data);
    var result = JSON.parse(data);
    result.forEach(function(item, i, arr){
      results.push(item);
    });
    console.log("Results: " + results);
  });
}).listen(2000);
