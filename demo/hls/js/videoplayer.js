function init() {
    window._duration=0;
	window._curtime=0;
	window._progressBarWidth=0;
	window._volumeBarWidth=0;
	window._progressBarX0=0;
	window._volumeBarX0=0;
	document._playerPan=document.getElementById("playerPan");
	document._videoUrlInput=$("input[id='videoUrlInput']");
	// document._videoUrlInput=document.getElementById("videoUrlInput");
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
    document._buffingLogo=document.getElementById("buffingLogo");
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
	document._buffingLogo.style.display="none";
    initHls();
}

/**
 * 初始化Hls对象
 */
function initHls(){
    if (Hls.isSupported()) {
        console.log("hello hls.js!");
    }
    var video = document._video;
    if (Hls.isSupported()) {
        // bind them together
        hls.attachMedia(video);
        // MEDIA_ATTACHED event is fired by hls object once MediaSource is ready
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            console.log("video and hls.js are now bound together !");//绑定完成后才可以有播放操作
        });
    }
}

document.addEventListener("DOMContentLoaded", init, false);
document.addEventListener("webkitfullscreenchange", screenChanged);
window.addEventListener("resize",getBarX0);
var hls = new Hls();

/**
 * 获得当前进度条初始位置
 */
function getBarX0(){
	window._progressBarX0=document._playerPan.offsetLeft+88;
	window._volumeBarX0=document._playerPan.offsetLeft+document._playerPan.clientWidth-window._volumeBarWidth-2;
	showLog(document._playerPan.offsetLeft+":"+window._progressBarX0+":"+window._volumeBarX0);
}

/**
 * 获得播放地址
 */
function urlChanged() {
    var src = document._videoUrlInput.val();
    showLog(src);
    if(src.length>0 && hls.src != src){
        hlsSwitch();
	}
    // document._video.src=src;
    // hls.loadSource("https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8");
    hls.loadSource(src);
    //视频流状态监听
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        console.log("manifest loaded, found " + data.levels.length + " quality level");//视频清晰度level，可用于播放时更改清晰度
    });
    hls.on(Hls.Events.ERROR,function(event, data) {
        var errorType = data.type;
        var errorDetails = data.details;
        var errorFatal = data.fatal;

        switch(data.details) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                console.log("fatal network error encountered, try to recover");
                hls.startLoad();
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("fatal media error encountered, try to recover");
                hls.recoverMediaError();
                break;
            default:
                // cannot recover
                hls.destroy();
                break;
        }
    });
    hls.on(Hls.Events.BUFFER_APPENDING, function (event, data) {
        console.log("BUFFER_APPENDING");
        document._buffingLogo.style.display="block";
    });
    hls.on(Hls.Events.BUFFER_APPENDED, function (event, data) {
        console.log("BUFFER_APPENDED");
        document._buffingLogo.style.display="none";
    });
    hls.on(Hls.Events.BUFFER_FLUSHING , function (event, data) {
        console.log("BUFFER_FLUSHING ");
    });
    hls.on(Hls.Events.BUFFER_FLUSHED , function (event, data) {
        console.log("BUFFER_FLUSHED ");
    });
}

/**
 * 切换视频地址
 */
function hlsSwitch() {
    console.log("hlsSwitch");
    hls.destroy();
    hls = new Hls();
    initHls();
}

/**
 * 播放或暂停
 */
function playOrPause(){
	if(document._video.paused || document._video.ended){
        console.log("video play");
		document._video.play();
      	document._playBtn.src = "images/pause.png";
	}else{
		document._video.pause();
      	document._playBtn.src = "images/play.png";
	}
}

/**
 * 前后跳进10秒
 * @param bo
 */
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

/**
 * 设置进度滑块当前位置
 * @param _time
 */
function setVideoInnerPosition(_time){
	var _position=parseInt(window._progressBarWidth*(_time/window._duration));
	document._videoInner.style.left=_position+"px";
}

/**
 * 视频seek
 * @param event
 */
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

/**
 * 音量设置到指定值
 * @param event
 */
function changeVolumeByClick(event){
	var e = event || window.event;
	var currentX=e.clientX;
	var vol=(currentX-window._volumeBarX0)/window._volumeBarWidth;
	document._video.volume=vol;
	setVolInnerPosition(vol);
	showLog("vol:"+vol);
}

/**
 * 设置音量滑块当前位置
 * @param _vol
 */
function setVolInnerPosition(_vol){
	var _position=parseInt(window._volumeBarWidth*_vol);
	document._volInner.style.left=_position+"px";
	showLog("_position:"+_position);
}

/**
 * 静音
 */
function muted(){
	if(document._video.muted){
		document._video.muted=false;
		document._mutedBtn.src = "images/soundon.png";
	}else{
		document._video.muted=true
		document._mutedBtn.src = "images/soundoff.png";
	}
}

/**
 * 切换全屏
 */
function fullscreen(){
	if(document._video.webkitIsFullScreen){
		document._video.webkitCancelFullScreen();
	}else{
		document._video.webkitRequestFullScreen();
	}
}

/*listener*******************/
/**
 * 鼠标移入
 * @param obj
 */
function overPlayer(obj)
{
	document._controlsPan.className="boxfadeIn";
}

/**
 * 鼠标移出
 * @param obj
 */
function outPlayer(obj)
{
	document._controlsPan.className="boxfadeOut";
}

/**
 * 音量改变
 */
function volChanged(){
	if(document._video.muted){
		document._mutedBtn.src = "images/soundoff.png";
	}else{
		document._mutedBtn.src = "images/soundon.png";
	}
}

/**
 * 全屏状态改变
 */
function screenChanged(){
	if(document._video.webkitIsFullScreen){
		document._fullscreenBtn.src = "images/nomal.png";
	}else{
		document._fullscreenBtn.src = "images/fullscreen.png";
	}
}

/**
 * 视频播放完毕
 */
function videoEnded(){
	document._playBtn.src = "images/play.png";
	window._curtime=0;
	setVideoInnerPosition(0);
}

/**
 * 当前时间监听
 */
function getCurrentTime(){
	var seekTime=document._video.currentTime;
	document._currenttime.innerHTML=timeFormat(seekTime);
	setVideoInnerPosition(seekTime);
}

/**
 * 转换时间格式
 * @param time
 * @returns {string}
 */
function timeFormat(time){
	var minutes = parseInt(time / 60, 10);
	var seconds = parseInt(time % 60);
	if(seconds<10){
		seconds="0"+seconds;
	}
	var time_t=minutes+":"+seconds;
	return time_t;
}

/**
 * 释放Hls
 */
function destroyHle() {
    hls.destroy();
}

/*log*************************/
/**
 * 显示log信息
 * @param msg
 */
function showLog(msg){
	var testLogText=document.getElementById("testlog");
	testLogText.innerHTML=msg;
}