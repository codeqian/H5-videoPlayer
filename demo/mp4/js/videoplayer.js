function init() {
	window._duration=0;
	window._curtime=0;
	window._progressBarWidth=0;
	window._volumeBarWidth=0;
	window._progressBarX0=0;
	window._volumeBarX0=0;
	document._playerPan=document.getElementById("playerPan");
	document._controlsPan=document.getElementById("controlsPan");
    document._video = document.getElementById("mainVideo");
    document._playBtn=document.getElementById("playBtn");
    document._mutedBtn=document.getElementById("mutedBtn");
    document._fullscreenBtn=document.getElementById("fullscreenBtn");
    document._currenttime=document.getElementById("currenttime");
    document._alltime=document.getElementById("alltime");
    document._progressBar=document.getElementById("progressBar");
    document._volumeBar=document.getElementById("volumeBar");
    document._videoInner=document.getElementById("videoInnerBar");
    document._volInner=document.getElementById("volInnerBar");
    document._video.controls = false;
    //获得视频长度
    var i=setInterval(function() {
		if(document._video.readyState > 0) {
			window._duration=document._video.duration;
			document._alltime.innerHTML=timeFormat(window._duration);
			document._video.addEventListener("timeupdate",getCurrentTime);
			document._video.addEventListener("volumechange",volChanged);
			document._video.addEventListener("ended",videoEnded);
			clearInterval(i);
		}
	}, 200);

	window._progressBarWidth=document._progressBar.clientWidth-document._videoInner.clientWidth;
	window._volumeBarWidth=document._volumeBar.clientWidth-document._volInner.clientWidth;
	getBarX0();
	document._controlsPan.className="boxfadeOut";
}

document.addEventListener("DOMContentLoaded", init, false);
document.addEventListener("webkitfullscreenchange", screenChanged);
window.addEventListener("resize",getBarX0);

//获得当前进度条初始位置
function getBarX0(){
	window._progressBarX0=document._playerPan.offsetLeft+88;
	window._volumeBarX0=document._playerPan.offsetLeft+document._playerPan.clientWidth-window._volumeBarWidth-2;
	showLog(document._playerPan.offsetLeft+":"+window._progressBarX0+":"+window._volumeBarX0);
}

//播放或暂停
function playOrPause(){
	if(document._video.paused || document._video.ended){
		document._video.play();
        document._video.playbackRate+=15;
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
// function changeSpeed(bo){
// 	if(bo){
// 		document._video.playbackRate+=0.1;
// 	}else{
// 		document._video.playbackRate-=0.1;
// 	}
// }

//设置进度滑块当前位置
function setVideoInnerPosition(_time){
	var _position=parseInt(window._progressBarWidth*(_time/window._duration));
	document._videoInner.style.left=_position+"px";
}

//视频seek
function videoSeekByClick(event){//firefox没有window.event，所以要传递一个event进来。
	var e = event || window.event;
	showLog("get click event"+e);
	var currentX=e.pageX;
	// showLog(currentX);
	var seekTime=window._duration*((currentX-window._progressBarX0)/window._progressBarWidth);
	// showLog("seek to:"+seekTime);
	document._video.currentTime=seekTime;
	setInnerBarPosition(seekTime);
}

//音量设置到指定值
function changeVolumeByClick(event){
	var e = event || window.event;
	var currentX=e.clientX;
	var vol=(currentX-window._volumeBarX0)/window._volumeBarWidth;
	document._video.volume=vol;
	setVolInnerPosition(vol);
	showLog("vol:"+vol);
}

//设置音量滑块当前位置
function setVolInnerPosition(_vol){
	var _position=parseInt(window._volumeBarWidth*_vol);
	document._volInner.style.left=_position+"px";
	showLog("_position:"+_position);
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

/*listener*******************/
//鼠标移入
function overPlayer(obj)
{
	document._controlsPan.className="boxfadeIn";
}

//鼠标移出
function outPlayer(obj)
{
	document._controlsPan.className="boxfadeOut";
}

//音量改变
function volChanged(){
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

//视频播放完毕
function videoEnded(){
	document._playBtn.src = "images/play.png";
	window._curtime=0;
	setVideoInnerPosition(0);
}

//当前时间监听
function getCurrentTime(){
	var seekTime=document._video.currentTime;
	document._currenttime.innerHTML=timeFormat(seekTime);
	setVideoInnerPosition(seekTime);
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

/*log*************************/
//显示log信息
function showLog(msg){
	var testLogText=document.getElementById("testlog");
	testLogText.innerHTML=msg;
}