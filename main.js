/*

  YES this is horrible code
  sincerely,
  The Author

*/

//init event, after window loads
window.addEventListener('load', function(event){
	//hide landing screen
	setTimeout(hideLandingImg, 2500);
	setCanvas();
	setMenu();
}, false);

/* save work when window size changes, device
   orientation changes, or window closes */
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
//window.addEventListener('beforeunload', saveWork, false);
//window.addEventListener('pagehide', saveWork, false);
//window.addEventListener('pageshow', lastSession, false);

/* Utility functions to reduce variable waste */
/* Copy Cat of some jQuery stuff */

//shorthand of document.getElementById('element');
var lp = {

	get: function(a){

		var b = a.slice(1, a.length);

		var e = document.getElementById(b);
			return e;

	},

	slide: function(element, speed){

		var f = lp.get(element);

		var s = f.style;
		s.height = '0px';
		var y = 0;
		var totalframes = 1000 / speed;
		var heightincrement = f.height / totalframes;
		var one_second = 1000;
		var interval = one_second / speed;
		var moveDown = function(){
			y += heightincrement;
			s.height = y + "px";
				if(y < f.height){
					setTimeout(moveDown, interval);
				}
		}

		moveDown();
	}

};


/* Open App Stuff */
var img = lp.get("#landingIMG");
img.width = window.innerWidth;
img.height = window.innerHeight;
img.style.display = 'block';
img.src = "LSPaint.png";

function hideLandingImg(){
	img.style.display = 'none';
	img.src = '';
	//open up last drawing session
	//lastSession();
};


/* Set Canvas Attributes */

var c = document.getElementById('SketchPad');
var ctx = c.getContext('2d');
var localPen = {};
var curColor = 'black';
var sizes = ['4', '8', '12'];
var curSize = sizes[0];
var ColorOptions = ['red','pink','maroon','orange','#ffff33','#cc6600','#99ff33','#66ff33','#66cc99','#66ffff','#3300ff','#000066','#660099','#9966cc','#663333','#ffffff','#000000','#808080'];
var paint = false;
var canvasPos = {
	x: c.offsetLeft,
	y: c.offsetTop
}

/* Set Menu Canvas Attributes */

var menu = document.getElementById('menu');
var menu_ctx = menu.getContext('2d');
var menuPen = {};
var ySelect;
var xSelect;
var mWidth;
var prevColor = false;
var prevSize = true;
var menuPos = {
	x: menu.offsetLeft,
	y: menu.offsetTop
}
var open = false;


/* Set SketchPad Boundaries */

function setCanvas(){
	c.width = window.innerWidth - window.innerWidth / 100;
	c.height = window.innerHeight - window.innerWidth / 100;

	//ctx.font = '10px Arial';
	//ctx.fillText("Menu", 5, 10);

	ctx.clearRect(0, 0, c.width, c.height);

	ctx.fillStyle = 'red';
	ctx.fillRect(5, 5, 10, 10);
	ctx.fillStyle = 'yellow';
	ctx.fillRect(18, 5, 10, 10);
	ctx.fillStyle = 'green';
	ctx.fillRect(5, 18, 10, 10);
	ctx.fillStyle = 'blue';
	ctx.fillRect(18, 18, 10, 10);

};




/* Set Menu Boundaries & initially Hide */

function setMenu(){
	mWidth = 120;
	menu.width = mWidth;
	menu.height = (Math.ceil(ColorOptions.length / 3) + 2) * (mWidth / 3);
	menu.style.display = 'none';
};






/*********************************
*******Desktop mouse events*******
*********************************/

/* Start Painting */

c.addEventListener('mousedown', function(event) {
	localPen = {
		x: event.pageX - canvasPos.x,
		y: event.pageY - canvasPos.y
	}
/*********TEMP MENU BUTTON***************/
	if(localPen.x <= mWidth / 3 && localPen.y <= mWidth / 3){
	//canvas temp menu button
		if(menu.style.display === 'none'){	//current show/hide menu toggle
			menu.style.display = 'block';
			lp.slide('#menu', 100);
			setColors();
			createEraser();
			createSizes();
			//recall previous selection
			if(prevColor){
			menu_ctx.strokeRect(xSelect, ySelect, mWidth / 3, mWidth / 3);
			prevColor = false;
			}

			if(prevSize){ //recall curSize
				menu_ctx.strokeRect(xSelect, ySelect, mWidth / 3, mWidth / 3);
				prevSize = false;
			}
		}
	} else {
		paint = true;
		draw(localPen.x - 0.5, localPen.y - 0.5, localPen.x, localPen.y);
		////////////////////////////
		menu.style.display = 'none';
		////////////////////////////
	}


}, false);


/* With paint = true call draw function, where'r the mouse goes! */

c.addEventListener('mousemove', function(e) {
	var mousePos = {
		x: e.pageX - canvasPos.x,
		y: e.pageY - canvasPos.y
	}

	if(paint) {
		draw(localPen.x, localPen.y, mousePos.x, mousePos.y);
	}

	localPen.x = mousePos.x;
	localPen.y = mousePos.y;

}, false);


/* End paint if outside of canvas */

c.addEventListener('mouseleave', function(e) {
	paint = false;
	c.removeEventListener('mousedown');
}, false);


/* End paint if mouse up */

c.addEventListener('mouseup', function(e) {
	paint = false;
	//save as we go!
	//saveWork();
}, false);


/* Draw Touch inputs */
c.addEventListener('touchstart', function(event){
	event.preventDefault();
	localPen = {
			x: event.targetTouches[0].pageX - canvasPos.x,
			y: event.targetTouches[0].pageY - canvasPos.y
		}
	/*********TEMP MENU BUTTON***************/
		if(localPen.x <= mWidth / 3 && localPen.y <= mWidth / 3){
		//canvas temp menu button
			if(menu.style.display === 'none'){	//current show/hide menu toggle
				menu.style.display = 'block';
				lp.slide('#menu', 100);
				setColors();
				createEraser();
				createSizes();
				//recall previous selection
				if(prevColor){
				menu_ctx.strokeRect(xSelect, ySelect, mWidth / 3, mWidth / 3);
				prevColor = false;
				}

				if(prevSize){
					menu_ctx.strokeRect(xSelect, ySelect, mWidth / 3, mWidth / 3);
					prevSize = false;
				}

			}
		} else {
			paint = true;
			draw(localPen.x - 0.5, localPen.y - 0.5, localPen.x, localPen.y);
			////////////////////////////
			menu.style.display = 'none';
			////////////////////////////
		}
}, false);

/* DRAW SOMETHING -- TOUCH */
c.addEventListener('touchmove', function(event){
	event.preventDefault();
		var touchPos = {
		x: event.targetTouches[0].pageX - canvasPos.x,
		y: event.targetTouches[0].pageY - canvasPos.y
	}

	if(paint) {
		draw(localPen.x, localPen.y, touchPos.x, touchPos.y);
	}

	localPen.x = touchPos.x;
	localPen.y = touchPos.y;

}, false);

c.addEventListener('touchend', function(event){
	event.preventDefault();
	paint = false;

	//save as we go!
	//saveWork();

}, false);


/* Magic line drawing */

function draw(begX, begY, endX, endY){
	ctx.lineJoin = 'round';
	ctx.lineWidth = curSize;
	ctx.beginPath();
	ctx.moveTo(begX, begY);
	ctx.lineTo(endX, endY);
	ctx.closePath();
	ctx.strokeStyle = curColor;
	ctx.stroke();

};


/* Start of Menu */

/* Drawing COLORS & Selection logic */


/* MENU */

menu.addEventListener('mousedown', function(e){

	menuPen = {
		x: e.pageX - menuPos.x,
		y: e.pageY - menuPos.y
	}


	//close menu
	if(menuPen.x <= (mWidth / 3) && menuPen.y <= (mWidth / 3)){

		menu.style.display = 'none';

	} else if(menuPen.x >= (mWidth / 3) * 2 && menuPen.y <= (mWidth / 3)){

		//save previous state
		ctx.save();

		//change for eraser attributes
		ctx.globalCompositeOperation = "destination-out";
		curColor = ("rgba(0, 0, 0, 1.0)");

	} else if(menuPen.x >= (mWidth / 3) && menuPen.x < (mWidth / 3) * 2 && menuPen.y <= (mWidth / 3)){ //clear/new page
		setCanvas();
	}

	selectColor();
	createEraser();
	createSizes();

}, false);

menu.addEventListener('touchstart', function(e){

	menuPen = {
		x: e.targetTouches[0].pageX - menuPos.x,
		y: e.targetTouches[0].pageY - menuPos.y
	}


	//close menu
	if(menuPen.x <= (mWidth / 3) && menuPen.y <= (mWidth / 3)){

		menu.style.display = 'none';

	} else if(menuPen.x >= (mWidth / 3) * 2 && menuPen.y <= (mWidth / 3)){

		//save previous state
		ctx.save();

		//change for eraser attributes
		ctx.globalCompositeOperation = "destination-out";
		curColor = ("rgba(0, 0, 0, 1.0)");

	} else if(menuPen.x >= (mWidth / 3) && menuPen.x < (mWidth / 3) * 2 && menuPen.y <= (mWidth / 3)){ //clear/new page
		setCanvas();
	}

	selectColor();
	createEraser();
	createSizes();

}, false);

/*================*/
/* Menu Utilities */
/*================*/

function selectColor(){

	var p = menu_ctx.getImageData(menuPen.x, menuPen.y, 1, 1).data;

	if(menuPen.x <= mWidth && menuPen.y <= ColorOptions.length * (mWidth / 3)){

		menu_ctx.clearRect(0, 0, menu.width, (menu.height / 8) * 7);

		setColors();

		ySelect = Math.floor(menuPen.y / (mWidth / 3)) * mWidth / 3;
		xSelect = Math.floor(menuPen.x / (mWidth / 3)) * mWidth / 3;

		menu_ctx.strokeStyle = 'black';
		menu_ctx.lineWidth = '2';

			if(ySelect >= (menu.height / 8) && ySelect < (menu.height / 8) * 7 && ColorOptions){ //select colors
				menu_ctx.strokeRect(xSelect, ySelect, mWidth / 3, mWidth / 3);
				curColor = rgbToHex(p[0], p[1], p[2]);
				prevColor = true;
			} else if(xSelect >= (mWidth / 3) * 2 && ySelect <= mWidth / 3){ //select eraser
				menu_ctx.strokeRect(xSelect, ySelect, mWidth / 3, mWidth / 3);
				return false;

			} else if(xSelect >= 0 && xSelect <= (mWidth  / 3) * 2 && ySelect >= (menu.height / 8) * 7){ //select sizes
				menu_ctx.clearRect(0, (menu.height / 8) * 7, menu.width, menu.height / 8);
				menu_ctx.strokeRect(xSelect, ySelect, mWidth / 3, mWidth / 3);
				//console.log('getting here');
				if(xSelect >= 0 && xSelect < (mWidth / 3) && ySelect >= (menu.height / 8) * 7){
					curSize = sizes[0];
					prevSize = true;
				} else if(xSelect >= (mWidth / 3) && xSelect < (mWidth / 3) * 2){
					curSize = sizes[1];
					prevSize = true;
				} else if(xSelect >= (mWidth / 3) * 2){
					curSize = sizes[2];
					prevSize = true;
				}

				return false;

			} else {
				return false;
			}

	}

	//restore previous state so color selection still works
	ctx.restore();
};




function setColors(){ ///draw colors

	var x = 0;
	var y = mWidth / 3;

	for(var i=0;i < ColorOptions.length;i++){

		menu_ctx.fillStyle = ColorOptions[i];

		menu_ctx.fillRect(x, y, mWidth / 3, mWidth / 3);

		x += (mWidth / 3);

		if(x === mWidth){

			y += (mWidth / 3);
			x = 0;
		}

	}


};


/* Drawing TOOLS */

/* Eraser */
function createEraser(){
		//menu_ctx.font = '10px Arial';
		var eraserIMG = lp.get("#eraserIMG");
		menu_ctx.drawImage(eraserIMG, mWidth * 0.70, mWidth * 0.05, 32, 32);

		var newPage = lp.get("#newPage");
		menu_ctx.drawImage(newPage, (mWidth * 0.35), mWidth * 0.05);

	//menu_ctx.fillText("Eraser", (mWidth * 0.70), mWidth * 0.20);
    //menu_ctx.fillText("Clear", (mWidth * 0.45), mWidth * 0.20);
};

/* Pen Sizes */
function createSizes(){
	menu_ctx.fillStyle = 'black';

	//smallest size '4'
	menu_ctx.beginPath();
	menu_ctx.arc((mWidth * .17), (menu.height * .9375), 2, 0, Math.PI * 2);
	menu_ctx.stroke();
	menu_ctx.fill();
	menu_ctx.closePath();

	//normal size '8'
	menu_ctx.beginPath();
	menu_ctx.arc((mWidth * .50), (menu.height * .9375), 4, 0, Math.PI * 2);
	menu_ctx.stroke();
	menu_ctx.fill();
	menu_ctx.closePath();

	//large size '12'
	menu_ctx.beginPath();
	menu_ctx.arc((mWidth * .83), (menu.height * .9375), 6, 0, Math.PI * 2);
	menu_ctx.stroke();
	menu_ctx.fill();
	menu_ctx.closePath();
};


/* Utility Functions for getting selected color */

/* Convert each r, g, b value to Hex value */
function componentToHex(c){
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

/* Take r, g, b components and combine to 1 hex value */
function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/* for canvas resize / orientation change */
function resizeCanvas(){
	var imgData = ctx.getImageData(0, 0, c.width, c.height);

	c.width = window.innerWidth - window.innerWidth / 100;
	c.height = window.innerHeight - window.innerHeight / 100;

	ctx.putImageData(imgData, 0, 0);
};

function saveWork(){
   localStorage.clear();
	localStorage.setItem("SketchPad", c.toDataURL());
};

function lastSession(){
	//load previous work
	if(typeof(Storage) !== 'undefined'){
			var startImg = new Image();
			startImg.onload = function(){
				ctx.drawImage(startImg, 0, 0);
			}

			startImg.src = localStorage.getItem("SketchPad");

	} else {
		console.log("localStorage not supported");
	}
};