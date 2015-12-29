function init() {
    document._video = document.getElementById("mainPlayer");
    document._playBtn=document.getElementById("playBtn");
    document._mutedBtn=document.getElementById("mutedBtn");
    document._fullscreenBtn=document.getElementById("fullscreenBtn");
    document._video.controls = false;
}

document.addEventListener("DOMContentLoaded", init, false);
document.addEventListener("webkitfullscreenchange", screenChanged);

//切换视频源
function switchVideo(n) {
	if (n >= videos.length) n = 0;
	document._video.setAttribute("poster", videos[n][0]);
	document._video.setAttribute("src", videos[n][1]);
  	document._video.load();
}

//鼠标移入
function mOver(obj)
{
	showLog("over player");
}

//鼠标移出
function mOut(obj)
{
	showLog("out player");
}

//播放或暂停
function playOrPause(){
	if(document._video.paused || document._video.ended){
		document._video.play();
      	document._playBtn.src = "images/pause.png";
	}else{
		document._video.pause();
      	document._playBtn.src = "images/play.png";
	}
}

//前后跳进10秒
function videoSkip(bo){
	if(bo){
		document._video.currentTime+=10;
	}else{
		document._video.currentTime-=10;
	}
}

//改变播放速率
function changeSpeed(bo){
	if(bo){
		document._video.playbackRate+=0.1;
	}else{
		document._video.playbackRate-=0.1;
	}
}

//音量放大或缩小0.1
function changeVolume(bo){
	if(bo){
		document._video.volume+=0.1;
	}else{
		document._video.volume-=0.1;
	}
}

//音量设置到指定值
function changeVolumeByNumber(vol){
	document._video.volume=vol;
}

//静音
function muted(){
	if(document._video.muted){
		document._video.muted=false;
		document._mutedBtn.src = "images/soundoff.png";
	}else{
		document._video.muted=true
		document._mutedBtn.src = "images/soundon.png";
	}
}

//切换全屏
function fullscreen(){
	if(document._video.webkitIsFullScreen){
		document._video.webkitCancelFullScreen();
	}else{
		document._video.webkitRequestFullScreen();
	}
}

//全屏状态改变
function screenChanged(){
	if(document._video.webkitIsFullScreen){
		document._fullscreenBtn.src = "images/nomal.png";
	}else{
		document._fullscreenBtn.src = "images/fullscreen.png";
	}
}

//显示log信息
function showLog(msg){
	var testLogText=document.getElementById("testlog");
	testLogText.innerHTML=msg;
}