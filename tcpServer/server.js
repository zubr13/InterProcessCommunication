var api = {};
global.api = api;
api.net = require('net');
api.cluster = require('cluster');
api.os = require('os');

var initialArr = [3, 5, -3, 5.3, 20,  -9, 43, -23.7];
var results = [];
var cpuCount = api.os.cpus().length;
var clients = [];
var index = {};

var server = api.net.createServer(function(socket) {
  clients.push(socket);
  index[socket] = clients.length;
  console.log('Connected: ' + socket.localAddress);
  console.log("Cpu count: " + cpuCount)
  console.log("The number of clients: " + clients.length);

  var start = initialArr.length / cpuCount * (clients.length - 1);
  var end = start + initialArr.length / cpuCount;

  var slicedArr = JSON.stringify(initialArr.slice(start, end));
  socket.write(slicedArr);
  socket.on('data', function(data) {
    console.log('Data received (by server): ' + data);
    results[index[socket]] = JSON.parse(data);
    console.log("Results: " + results);
  });
}).listen(2000);