var http = require('http');
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var express = require('express');
var querystring = require('querystring');
var bodyParser = require('body-parser');

var app = express();

var PORT = 3000;
var ESPHOST = 'localhost';
var ESPUDPPORT = 41234;
var ESPTCPPORT = 80;

app.get('/testing', function(req, res) {
  res.send('Hello World!');
});
app.post('/sendudp', function(req, res) {
  var message = new Buffer(req.body.message);
  client.send(message, ESPUDPPORT, ESPHOST, function(err) {
    if (err) {
      console.log('error sending datagram:');
      console.log(err);
    }
    client.close();
  });
});
app.post('/sendpost', function(req, res) {
  // maybe try grabbing the data from the post request and wrapping it into the one that goes to the ESP
  var post_data = querystring.stringify({
    'field1':'field1value'
  });
  var post_options = {
    host: ESPHOST,
    port: ESPTCPPORT,
    path: '/posttest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencodes',
      'Content-Length': Buffer.byteLength(post_data)
    }
  };
  var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      console.log('Response: ' + chunk);
    });
    res.on('end', function() {
      console.log('Finished');
    });
  });
  post_req.write(post_data);
  post_req.end();
})
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
})