var http = require('http');
var dgram = require('dgram');
var express = require('express');
var querystring = require('querystring');
var bodyParser = require('body-parser');

var app = express();

var PORT = 3000;
var ESPHOST = '192.168.4.1';
var ESPUDPPORT = 7777;
var ESPTCPPORT = 80;
var ledCount = 30;
var cnt = 0;
var packets = 0;
var sending = false;

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

app.get('/testing', function(req, res) {
  res.send('Hello World!');
});
var updateLEDs = function() {
  var arr = [0x00, 0x00, 0x00];
  for (var i = 0;i < ledCount;i++) {
    var colour = HSVtoRGB(((cnt + i) / ledCount) % 1, 1, 1);
    arr = arr.concat([0xff & colour.g, 0xff & colour.r, 0xff & colour.b]);    
  }
  cnt++;
  if (cnt > ledCount) { cnt = 0; }
  var buff = new Buffer(arr);
  var client = dgram.createSocket('udp4');
  client.send(buff, 0, buff.length, ESPUDPPORT, ESPHOST, function(err) {
    if (err) {
      console.log('error sending datagram:');
      console.log(err);
    } else {
      console.log('sent ' + arr.length + ' bytes - packet ' + ++packets);
      setTimeout(updateLEDs, 20);
    }
    client.close();
  });
};
var timeoutFunc;
app.get('/sendudp', function(req, res) {
    if (sending) {        
      sending = false;
      clearTimeout(timeoutFunc);
    } else {
      timeoutFunc = setTimeout(updateLEDs, 20);
      sending = true;
    }
  res.send('Worked');
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