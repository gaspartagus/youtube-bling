console.log("glow",$("body"));


function sum(arr){
  return _.reduce(arr,function(s,n) {return s+n;});
}

function mean(arr){
	return arr.length ? sum(arr) / arr.length : 0;
}

function hslToRgb(h, s, l){
  var r, g, b;

  if(s === 0){
    r = g = b = l; // achromatic
  }else{
    function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  }else{
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}





var ratio = 2,
    lumRatios = [1,1.2,1.8], // luminance ratio
    satRatios = [1,1.2,1.8], // saturation ratios
    // 0: black, 1: no change, Infinity: pure color
    width = 100, // sampling ratio
    actions = ["Stop","Extend","Glow"];

function create() {

  var video = document.getElementsByTagName("video")[0];
  // var canvas = document.getElementById('ambi');
  var canvas = document.createElement("canvas");

  var back = document.getElementById("theater-background");

  var bar = document.getElementsByClassName("html5-player-chrome")[0];

  var context = canvas.getContext("2d");

  var action = 0;

  function snap() {
  	var debut = performance.now();

    ratio = video.videoWidth/video.videoHeight;

    context.drawImage(video, 0, 0, width, width/ratio);

    var image = context.getImageData(0, 0, width, width/ratio);

    var r = 0,
    		g = 0,
    		b = 0,
    		n = 0;

    for(var i = image.height-1; i>=0; i -= 1){
    	for(var j = image.width-1; j>=0; j -= 1){
    		n ++;
    		r += image.data[((i*(image.width*4)) + (j*4)) + 0];
    		g += image.data[((i*(image.width*4)) + (j*4)) + 1];
    		b += image.data[((i*(image.width*4)) + (j*4)) + 2];
    	}
    }
    r = Math.floor(r/n);
    g = Math.floor(g/n);
    b = Math.floor(b/n);

    // Physiologic luminance parameter
    // var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // convert rgb -> hue/saturation/luminance -> rgb
    // to adjust luminance and saturation
    var hsl = rgbToHsl(r,g,b);
    var rgb = hslToRgb(
      hsl[0],
      Math.pow( hsl[1], 1/satRatios[action] ), // allows to saturate/fade the color for a better effect
      Math.pow( hsl[2], 1/lumRatios[action] )
    );

    // console.log(Math.floor((performance.now()-debut)*1), image.width, image.height);

    // console.log(r,g,b, debut-performance.now())

    switch(action){
      case 1:
        setColor(rgb);
      break;
      case 2:
        video.style.boxShadow = "0px 0px 100px rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",1)";
      break;
      default:
        video.style.boxShadow = "none";
        // back.css("background-color",originalColor);
    }

    if(action) {
      requestAnimationFrame(snap);
    }
  }

  function trigger(){

    video.style.boxShadow = "none";
    back.style.backgroundColor = "transparent";

    action = (action+1) % actions.length;
    if(action) {
      requestAnimationFrame(snap);
    }
    return actions[(action+1) % actions.length];
  }

  function setColor(rgb){
    back.style.backgroundColor = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",1)";
  }

  var button = document.createElement("button");
  button.setAttribute("class","ytp-button ytp-button-bling");
  button.innerHTML = "B";

  button.addEventListener("click",function(){
    console.log("click");
    trigger();
  });

  bar.appendChild(button);
}

if(document.getElementsByTagName("video")){
  create();
}

window.onhashchange = function(){
  if(document.getElementsByTagName("video")){
    create();
  }
}


