function init() {
    document._video = document.getElementById("video");
    document._playBtn=document.getElementById("playBtn");
    document._mutedBtn=document.getElementById("mutedBtn");
    // document._video.controls = false;
}

document.addEventListener("DOMContentLoaded", init, false);

function switchVideo(n) {
	if (n >= videos.length) n = 0;
	document._video.setAttribute("poster", videos[n][0]);
	document._video.setAttribute("src", videos[n][1]);
  	document._video.load();
}

function playOrPause(){
	if(document._video.paused || document._video.ended){
		document._video.play();
      	document._playBtn.innerHTML = "pause";
	}else{
		document._video.pause();
      	document._playBtn.innerHTML = "play";
	}
}

function videoSkip(bo){
	if(bo){
		document._video.currentTime+=10;
	}else{
		document._video.currentTime-=10;
	}
}

function changeSpeed(bo){
	if(bo){
		document._video.playbackRate+=0.1;
	}else{
		document._video.playbackRate-=0.1;
	}
}

function changeVolume(bo){
	if(bo){
		document._video.volume+=0.1;
	}else{
		document._video.volume-=0.1;
	}
}

function muted(){
	if(document._video.muted){
		document._video.muted=false;
		document._mutedBtn.innerHTML = "muted";
	}else{
		document._video.muted=true
		document._mutedBtn.innerHTML = "mute";
	}
}