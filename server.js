/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 *
 * NOTE: Must have a PostgreSQL DB called 'track' running
 *       and create an 'items' table with column definitions
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var https = require('https');

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/track';

var client_id = '4d8d3b35b0944cbbb34903443245b33c'; // Your client id
var client_secret = 'fbfe652692fa4fb6a73c9153dc272c79'; // Your secret
//This is obsolete(used as placeholder) -- replace with new one!
var redirect_uri = 'http://localhost:8888/callback/'; // Your redirect uri


var group=[];
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());


// Spotify Auth
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-top-read user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options_user = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
        var user={};
        // use the access token to access the Spotify Web API
        request.get(options_user, function(error, response, body) {
          //console.log(body);
          console.log(body.display_name);
          console.log(body.id);

          user['display_name']=body.display_name;
          user['user_id']=body.id;
          user['profile_picture']=body.images[0].url;
          console.log(user);
        });

        var options_top_artists = {
          url: 'https://api.spotify.com/v1/me/top/artists',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options_top_artists, function(error, response, body) {
          //console.log(body);
          artist_seeds=[];
          var i;
          //console.log(JSON.parse(body)['items']);
          //console.log(body['items']);
          //console.log(body['items'].length);
          for (i=0; i<body['items'].length; i++){
            artist_seeds.push([body['items'][i].name,body['items'][i].id, body['items'][i].genres]);
          }
          //console.log(artist_seeds);
          //TODO- do something with these seeds

          //Create the user

          //var user=[];
          user['artists']=artist_seeds;
          console.log(user);

          group.push(user);

          console.log(group);

          console.log(group.length);

            // TODO
          var shuffle = function(tracks) {
            return 1;
          };

          var getRecommendedTracksFromArtists = function(artist_seeds) {
            var artist_ids=[];
            var tracks=[];
            var i;
            for(i=0;i<artist_seeds.length;i++){
              var id=artist_seeds[i][1];
              artist_ids.push(id);
            }
            console.log(artist_ids);

            //Call API here
            for(i=0;i<artist_ids.length;i++){
              var options_recommended_tracks = {
                url: 'https://api.spotify.com/v1/recommendations?seed_artists='+artist_ids[i]+'&limit=5',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
              };

              request.get(options_recommended_tracks, function(error, response, body){
                console.log(body);
                var j;
                console.log(body.tracks.length);
                for (j=0;j<body.tracks.length;j++){
                  //console.log(body.tracks[j]);
                  //console.log(body.tracks[j].album);
                  var album_art=body.tracks[j].album.images[2].url;
                  //console.log(album_art);
                  var artist_name=body.tracks[j].artists[0].name;
                  //console.log(artist_name);
                  var duration=body.tracks[j].duration_ms;
                  //console.log(duration);
                  var track_name=body.tracks[j].name;
                  //console.log(track_name);

                  var track={
                    'album_art':album_art,
                    'artist_name':artist_name,
                    'duration': duration,
                    'track_name':track_name
                  };

                  tracks.push(track);

                  //console.log(track);
                }

                console.log(tracks);
              });
            }
            

            return 1;
          };

          var playlist = [];

          console.log(group.length);

          for (var i = 0; i<group.length; i++) {
            

            var artist_seeds = group[i].artists;
            console.log(artist_seeds);
            group[i]['recommendedTracks'] = getRecommendedTracksFromArtists(artist_seeds);
            playlist.push(group[i]['recommendedTracks']);
          }

          shuffle(playlist);
        });

        

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/my_preferences', function(req,res){});

// Database operations
app.get('/api/v1/tracks', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

app.post('/api/v1/tracks', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

app.put('/api/v1/tracks/:track_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.track_id;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

app.delete('/api/v1/tracks/:track_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.track_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM items WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

console.log('Listening on 8888');
app.listen(8888);
