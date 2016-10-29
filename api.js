// get walking directions from central park to the empire state building
var https = require("https");
    url = "https://api.spotify.com/v1/me/top/tracks";

// get is a simple wrapper for request()
// which sets the https method to GET
var request = https.get(url, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event
    var buffer = "",
        data,

    response.on("data", function (chunk) {
        buffer += chunk;
    });

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        console.log(buffer);
        console.log("\n");
        data = JSON.parse(buffer);
        console.log(data);

    });
});

module.exports = request;
