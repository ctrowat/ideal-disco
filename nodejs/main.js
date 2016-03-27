var express = require('express');
var app = express();
var PORT = 3000;

app.get('/testing', function(req, res) {
  res.send('Hello World!');
});
app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
})