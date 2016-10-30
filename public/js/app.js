
/*
 * Client side operations.
 * TODO: 1. Start socket.io connection to server
 *       2. Build <li>s
 */

var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

var callback = function(tracks) {

    // Grab
    var table = jQuery('#playlist-table');

    

    // for each in data track in tracks
    for (var i=0; i<tracks.length; i++) {
        // Build tr
        var tr = jQuery('<tr></tr>');
        var art_img = jQuery('<img>');
        art_img.src = tracks[i].album_art;

        var td_art = jQuery('<td></td>');
        td_art.append(art_img);
        tr.append(td_art);

        var td_track = jQuery('<td></td>');
        td_track.text = tracks[i].track_name;
        tr.append(td_track);

        var td_artist = jQuery('<td></td>');
        td_artist.text = tracks[i].artist_name;
        tr.append(td_artist);

        var td_duration = jQuery('<td></td>');
        td_duration.text = tracks[i].duration;
        tr.append(td_duration);

        var td_like_button  = jQuery('<td></td>');
        td_like_button.text = tracks[i].numLikes;
        tr.append(td_like_button);

        var td_dislike_button  = jQuery('<td></td>');
        td_dislike_button.text = tracks[i].numDislikes;
        tr.append(td_dislike_button);

        table.append(tr);
    }
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
