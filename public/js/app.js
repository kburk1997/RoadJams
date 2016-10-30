(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
 * Client side operations.
 * TODO: 1. Start socket.io connection to server
 *       2. Build <li>s
 */

var socket = io.connect();

socket.on('connect', function() {
    //console.log(data);
    console.log('Connected to server');

});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('playlist', function(tracks){
    console.log("a client received a playlist");
    var table = $('.playlist-table');
    //console.log(table);
    // for each in data track in tracks
    for (var i=0; i<tracks.length; i++) {
        //console.log(tracks[i]);

        for(var j=0; j<tracks[i].length;j++){
            //console.log(tracks[i][j])
            // Build tr
            var tr = $('<tr></tr>');

            /*var art_img = $('<img>');
            art_img.src = tracks[i][j]['album_art'];
            console.log(tr);
            console.log(art_img);
            var td_art = $('<td></td>');
            console.log(td_art);
            td_art.append(art_img);
            console.log(td_art);*/
            tr.append("<td><img src=\""+tracks[i][j]['album_art']+"\"></td>");
            //console.log(tr);
            tr.append('<td>'+tracks[i][j].track_name+'</td>');
            //console.log(tr);
            tr.append('<td>'+tracks[i][j].artist_name+'</td>');

            //td_duration.text = tracks[i][j].duration;
            var seconds=tracks[i][j].duration/1000;
            //console.log();
            //console.log();
            //console.log(seconds);
            var minutes=Math.floor(seconds/60);
            var remainder=Math.floor(seconds %60);
            if(Math.floor(remainder/10)==0){
                remainder="0"+remainder;
            }
            tr.append('<td>'+minutes+':'+remainder+'</td>');
            //console.log(tr);
            var td_like_button  = $('<td></td>');
            td_like_button.text = tracks[i][j].numLikes;
            tr.append(td_like_button);
            //console.log(tr);
            var td_dislike_button  = $('<td></td>');
            td_dislike_button.text = tracks[i][j].numDislikes;
            tr.append(td_dislike_button);
            //console.log(tr);
            table.append(tr);
            //console.log(table);
        }
        
    }
});

var callback = function(tracks) {

    // Grab

    //table.append();
}

// socket.on('newMessage', function(message) {
//     console.log('newMessage', message);
//     var li = jQuery('<li></li>');
//     li.text(`${message.from}: ${message.text}`);
//
//     jQuery('#messages').append(li);
// });
//
// socket.on('newLocationMessage', function(message) {
//     var li = jQuery('<li></li>');
//     // _blank opens new tab
//     var a = jQuery('<a href="_blank">My current location</a>');
//
//     // jQuery methods are escaped. Prevent malicious injections
//     li.text(`${message.from}: `);
//     a.attr('href', message.url);
//     li.append(a);
//     jQuery('#messages').append(li);
// });
//
// var locationButton = jQuery('#send-location');
// locationButton.on('click', function () {
//     if (!navigator.geolocation) {
//         return alert('Geolocation not supported by your browser');
//     }
//
//     // Success, Fail/Error Handler
//     navigator.geolocation.getCurrentPosition(function (position) {
//         socket.emit('createLocationMessage', {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//         })
//     },
//     function () {
//         alert('Unable to fetch location')
//     });
// });
//
// jQuery('#message-form').on('submit', function (e) {
//     // Prevent submit's default refresh
//     e.preventDefault();
//
//     socket.emit('createMessage', {
//         from: 'User',
//         text: jQuery('[name=message]').val()
//     }, function () {
//         jQuery('[name=message]').val('');
//     });
// });

},{}]},{},[1]);
