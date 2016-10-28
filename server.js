var client_id = 'xxxxxxxxxxxxxxxxxxx'; // Your client id
var client_secret = 'xxxxxxxxxxxxxxxxxxxxxxx'; // Your secret
var redirect_uri = 'http://localhost:8888/callback/'; // Your redirect uri


var scopes = 'user-read-private user-read-email'

/* Load the HTTP library */
var http = require("http");

/* Create an HTTP server to handle responses */
http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8888);
