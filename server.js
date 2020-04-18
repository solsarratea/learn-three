var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('views'));
app.use(express.static('node_modules/three'));  
app.use(express.static(__dirname +'/node_modules/three/examples/js/controls'));
app.use(express.static('node_modules/three/build'));
app.use(express.static('node_modules/dat.gui/build'));
app.use(express.static('node_modules/three/examples/js/controls'));
app.use(express.static('node_modules/three/examples/js/renderers'));

// listen for requests :)
var listener = app.listen(8080, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get("/plane", (request, response) => {
  response.sendFile(__dirname + "/views/index-plano.html");
});

app.get("/feedback", (request, response) => {
  response.sendFile(__dirname + "/views/feedback.html");
});

app.get("/grayscott", (request, response) => {
  response.sendFile(__dirname + "/views/grayscott.html");
});

app.get("/torus", (request, response) => {
  response.sendFile(__dirname + "/views/torus.html");
});

app.get("/gsvideo", (request, response) => {
  response.sendFile(__dirname + "/views/gs-video.html");
});
