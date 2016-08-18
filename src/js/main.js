$(document).ready(function () {
  var slider  = $('.slider');

  slider.hide();
  $('.volume').click(function(e) {
    e.stopPropagation();
    slider.toggle();
  });

  $('.player').on('click', '.share', function(e) {
    e.stopPropagation();
    $('.sharePanel').toggle();
  });

  $(document).click(function() {
    slider.hide();
    $('.sharePanel').hide();
  });

  slider.slider({
    orientation: 'vertical',
    range: 'min',
    min: 1,
    max: 100,
    value: 50,
    slide: function(event, ui) {
      var value = slider.slider('value');
      var volume = $('.volume');
      music.volume = ui.value/100;
    },
    stop: function(event, ui) {
      slider.hide();
    },
  });
});

var tracks = document.getElementsByClassName('track');
var index = 0;
var music = tracks[index];
var duration; 

$('.song-name').text(music.getAttribute('data-title'));

var pButton = document.getElementById('pButton'); 
var playhead = document.getElementById('playhead'); 
var timeline = document.getElementById('timeline');
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

music.addEventListener("timeupdate", timeUpdate, false);

timeline.addEventListener("click", function (event) {
  moveplayhead(event);
  music.currentTime = duration * clickPercent(event);
}, false);

function clickPercent(e) {
  return (e.pageX - timeline.offsetLeft) / timelineWidth;
}

playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

var onplayhead = false;

function mouseDown() {
  onplayhead = true;
  window.addEventListener('mousemove', moveplayhead, true);
  music.removeEventListener('timeupdate', timeUpdate, false);
}

function mouseUp(e) {
  if (onplayhead == true) {
    moveplayhead(e);
    window.removeEventListener('mousemove', moveplayhead, true);

    music.currentTime = duration * clickPercent(e);
    music.addEventListener('timeupdate', timeUpdate, false);
  }
  onplayhead = false;
}

function moveplayhead(e) {
  var newMargLeft = e.pageX - timeline.offsetLeft;
  if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
    playhead.style.marginLeft = newMargLeft + "px";
  }
  if (newMargLeft < 0) {
    playhead.style.marginLeft = "0px";
  }
  if (newMargLeft > timelineWidth) {
    playhead.style.marginLeft = timelineWidth + "px";
  }
}

function str_pad_left(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}

function readableTime(time) {
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time - minutes * 60);
  return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
}

function timeUpdate() {
  var playPercent = timelineWidth * (music.currentTime / duration);
  playhead.style.marginLeft = playPercent + "px";
  if (music.currentTime == duration) {
    index++;
    music = tracks[index];
    music.addEventListener("timeupdate", timeUpdate, false);
    timeline.addEventListener("click", function (event) {
      moveplayhead(event);
      music.currentTime = duration * clickPercent(event);
    }, false);
    music.play();
    $('.song-name').text(music.getAttribute('data-title'));
  }
  $('#length').text(readableTime(music.currentTime));
}

var firstClick = true;

function play() {
  if(firstClick) {
    [].forEach.call(tracks, function(track)  {
      track.play();
      track.pause();
    });
    firstClick = false;
  }
  if (music.paused) {
    music.play();
    pButton.className = "pause";
  } else { 
    music.pause();
    pButton.className = "play";
  }
}

music.addEventListener("canplaythrough", function () {
  duration = music.duration;  
}, false);
