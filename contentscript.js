// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var regex = /sandwich/gi;
matches = document.body.innerText.match(regex);
if (matches) {
  var payload = {
    count: matches.length    // Pass the number of matches back.
  };
  chrome.extension.sendRequest(payload, function(response) {});
}
$('body').append('<div id="avion"></div>');



mAvion = 1;
mSouris = 500;
G = 1;
k = 0.2;
R2 = 100;
lim = 1500;

var x = -100;
var y = 0;
vx = 0;
vy = 0;
ax = 0;
ay = 0;
mousex = 600;
mousey = 350;
nImage1 = 0;

dt = 8;

x = x + vx * dt + ax * dt ^ 2;

var avion = $('#avion');

avion.css("display", "block")

function force(Dx,Dy)
{
    D3 = Math.pow(Math.pow(Dx, 2) + Math.pow(Dy, 2), 3 / 2);
	D4 = Math.pow(Math.pow(Dx, 2) + Math.pow(Dy, 2), 5 / 2);

     ax = G * mAvion * mSouris * Dx * (Math.pow(k, 2) / D3 - 2 * Math.pow(k, 3) / D4) * 8;
	 ay = G * mAvion * mSouris * Dy * (Math.pow(k, 2) / D3 - 2 * Math.pow(k, 3) / D4) * 8;
}


intervalleID = setInterval(
	function step()	{

	    Dx = mousex - x;
        Dy = mousey - y;
        D2 = Math.pow(Dx, 2) + Math.pow(Dy, 2); D3 = Math.pow(D2, 3 / 2);
        D4 = D2 * D2; ax = G * mSouris * Dx * (1 / D3 - R2 / D4) + (-1 / 2 + (vx * Dy - vy * Dx > 0)) * k * Dy / D2 + Math.min(Math.max(0, Dx - lim), Dx + lim);
        ay = G * mSouris * Dy * (1 / D3 - R2 / D4) - (-1 / 2 + (vx * Dy - vy * Dx > 0)) * k * Dx / D2 + Math.min(Math.max(0, Dy - lim), Dy + lim);

	    vx = (vx + ax * dt); vy = (vy + ay * dt);
        Nv = Math.pow(vx * vx + vy * vy, 1 / 2);
        vy = vy / Math.max(1, Nv);
        vx = vx / Math.max(1, Nv);

	    if (vx > 0)
	    {
	        angle = Math.atan(vy / vx) + 1.57079633;
	    }
	    else
	        angle = Math.atan(vy / vx) - 1.57079633; x = x + vx * dt;
	    y = y + vy * dt;

	    avion.css("transform", "translate("+x+"px,"+y+"px)");
	    // avion.css("left", x);

	    nImage2 = Math.max(1, Math.min(21, Math.round(2500 * (-ay * vx + ax * vy) / (Nv * Nv * Nv)) + 11));
	    if (nImage2 != nImage1)
	        avion.html("<img src='http://brasspackers.org/paperplane/avion/avion" + Math.max(1, Math.min(21, Math.round(2500 * (-ay * vx + ax * vy) / (Nv * Nv * Nv)) + 11)) + ".png' >");
	    nImage1 = nImage2;
	    $("#avion img").css("transform", "rotate(" + angle + "rad)");

	    //$("#temoin").html("x, y = " + x + ", " + y + ", ax = " + ax + ", vx = " + vx + ", Dx = " + Dx + ", mousex, mousey = " + mousex + ", " + mousey);

	}
	, 40
);

    $(document).bind('mousemove', function (e)
    {
        //$("#temoin").text("e.pageX: " + e.pageX + ", e.pageY: " + e.pageY);
        mousex = e.pageX;
        mousey = e.pageY;
    });

