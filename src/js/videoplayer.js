function init() {
	window._duration=0;
	window._curtime=0;
    document._video = document.getElementById("mainVideo");
    document._playBtn=document.getElementById("playBtn");
    document._mutedBtn=document.getElementById("mutedBtn");
    document._fullscreenBtn=document.getElementById("fullscreenBtn");
    document._currenttime=document.getElementById("currenttime");
    document._alltime=document.getElementById("alltime");
    document._progressBar=document.getElementById("progressBar");
    document._volumeBar=document.getElementById("volumeBar");
    document._video.controls = false;
    //获得视频长度
    var i=setInterval(function() {
		if(document._video.readyState > 0) {
			document._alltime.innerHTML=timeFormat(document._video.duration);
			document._video.addEventListener("timeupdate",getCurrentTime);
			document._video.addEventListener("volumechange",volChanged);
			clearInterval(i);
		}
	}, 200);
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

//视频seek
function videoSeekByClick(e){
	alert("click");
	alert(e.pageX);
}

//音量放大或缩小0.1
// function changeVolume(bo){
// 	if(bo){
// 		document._video.volume+=0.1;
// 	}else{
// 		document._video.volume-=0.1;
// 	}
// }

//音量设置到指定值
function changeVolumeByClick(e){
	document._video.volume=vol;
}

//静音
function muted(){
	if(document._video.muted){
		document._video.muted=false;
		document._mutedBtn.src = "images/soundon.png";
	}else{
		document._video.muted=true
		document._mutedBtn.src = "images/soundoff.png";
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

//音量改变
function volChangee(){
	if(document._video.muted){
		document._mutedBtn.src = "images/soundoff.png";
	}else{
		document._mutedBtn.src = "images/soundon.png";
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

//当前时间监听
function getCurrentTime(){
	document._currenttime.innerHTML=timeFormat(document._video.currentTime);
}

//转换时间格式
function timeFormat(time){
	var minutes = parseInt(time / 60, 10);
	var seconds = parseInt(time % 60);
	if(seconds<10){
		seconds="0"+seconds;
	}
	var time_t=minutes+":"+seconds;
	return time_t;
}

//显示log信息
function showLog(msg){
	var testLogText=document.getElementById("testlog");
	testLogText.innerHTML=msg;
}