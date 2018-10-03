var socket = new WebSocket("ws://162.245.144.188:4000");

let sendSockets = true;

socket.addEventListener("open", function(evt) {
    socket.send("NEW CONNECTION");
});

socket.onmessage = function(msg) {
    sendSockets = false;

    console.log('woo!', msg)

    setTimeout(() => {
        sendSockets = true
    }, 500)

    switch (msg.data) {
        case 'PLAY':
            player.playVideo()
            break;
        case 'STOP':
            player.pauseVideo()
            break;
        default: // timestamp
            player.seekTo(msg.data)
            break;
    }

};

 // 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // 3. This function creates an <iframe> (and YouTube player)
 //    after the API code downloads.
 var player;
 function onYouTubeIframeAPIReady() {
   player = new YT.Player('player', {
     height: '390',
     width: '640',
     videoId: 'WydS8bIKjVo',
     events: {
       'onReady': onPlayerReady,
       'onStateChange': onPlayerStateChange
     }
   });
 }

 // 4. The API will call this function when the video player is ready.
 function onPlayerReady(event) {
//    event.target.playVideo();
 }

 // 5. The API calls this function when the player's state changes.
 //    The function indicates that when playing a video (state=1),
 //    the player should play for six seconds and then stop.
 function onPlayerStateChange(event) {
   if (event.data === YT.PlayerState.PLAYING && sendSockets) {
    console.log(event)
    socket.send('PLAY')
    socket.send(JSON.stringify(player.getCurrentTime()))
   } else if (event.data !== YT.PlayerState.PLAYING && sendSockets) {
    socket.send('STOP')
   }
 }

 function playVideo() {
     player.playVideo();
 }

 function stopVideo() {
   player.stopVideo();
 }