/*
 * Functions for various generation tasks and creating objects. 
 * userOptions and canvasOptions contain interface data which user has access to modify.
 */

var rootDiv = null;
var rootCanvas = null;

var canvasOptions = {
    x: 0,
    y: 0,
    width: screen.width,
    height: screen.height 
}

var userOptions = {
	align: true,
    blurAmount: 60,
    noiseOpacity: 10,
    shadows: false,
    shadow_color: {r: 0, g: 0, b: 0, a: 255},
    shadow_radius: 1,
    shadow_offsetX: 0,
    shadow_offsetY: 0,
    objects_in_layer: 10,
    depth: 3,
    layers: 10,
	hex: false,
    triangles: false,
    squares: false,
    circles: true,
    size: 10 * screen.height / 768, //Some initial scaling to settings which looked nice on 1366x768 display
    rootColor: {r: 2, g: 12, b: 15, a: 1},
    randomColor: true,
    colorPerLayer: false,
    colorChAmt: 100,
	colorAlpha: 150,
    blurTop: false,
    balanceColors: false,
	colorMutate: true
}



window.onload = function () {
    init();
}

function init() {
    rootDiv = document.getElementById("root");
	document.getElementById('genwrap').style.background = rgbToHex(getRandomColor());
    setupInterface();
    generate();
}

function generate() {
    clear();

    if (userOptions.randomColor) {
        userOptions.rootColor = getRandomBackgroundColor();
    }
    colorInput.value = rgbToHex(userOptions.rootColor);
    shadowColor.value = rgbToHex(userOptions.shadow_color)

    var noiseCanvas = null;
    if (userOptions.noiseOpacity > 0) {
        noiseCanvas = document.createElement("canvas");
        noiseCanvas.width = canvasOptions.width;
        noiseCanvas.height = canvasOptions.height;
        generateNoise(noiseCanvas, userOptions.noiseOpacity);
    }

    generateBackground(userOptions.rootColor, noiseCanvas); //Create root canvas

    var object_size = userOptions.size;

	var objColor = userOptions.rootColor;
	objColor.a = clamp(0, 255, userOptions.colorAlpha) / 255;

    for (var i = 0; i < userOptions.layers; i++) {
        if (i > 0) { //Do not blur bottom layer alone
            blur(rootCanvas, userOptions.blurAmount);
        }

        object_size += userOptions.depth * i;

        if (userOptions.triangles) {
            generateTriangles(
                rootCanvas,
                userOptions.objects_in_layer,
                objColor,
                userOptions.colorChAmt,
                noiseCanvas,
                object_size
            );
        }
        if (userOptions.squares) {
            generateSquares(
                rootCanvas,
                userOptions.objects_in_layer,
                objColor,
                userOptions.colorChAmt,
                noiseCanvas,
                object_size
            );
        }
        if (userOptions.circles) {
            generateCircles(
                rootCanvas,
                userOptions.objects_in_layer,
                objColor,
                userOptions.colorChAmt,
                noiseCanvas,
                object_size
            );
        }
        if (userOptions.hex) {
            generateHexagons(
                rootCanvas,
                userOptions.objects_in_layer,
                objColor,
                userOptions.colorChAmt,
                noiseCanvas,
                object_size
            );
		}
    }

    //Finishing touches
    if (userOptions.blurTop){
        blur(rootCanvas, userOptions.blurAmount);
    }
    if (userOptions.noiseOpacity > 0) {
        drawRectangle(rootCanvas, canvasOptions, null, noiseCanvas);
    }
}

function clear() {
    if (rootCanvas) {
        rootCanvas.getContext('2d').clearRect(canvasOptions.x, canvasOptions.y, canvasOptions.width, canvasOptions.height);
    }
}

function getCanvas() {
    var canvas = document.getElementById("canvas");
    canvas.x = canvasOptions.x;
    canvas.y = canvasOptions.y;
    canvas.width = canvasOptions.width;
    canvas.height = canvasOptions.height;
    return canvas;
}

function getRandomPoint(parent) {
    return {
        x: Math.floor(Math.random() * parent.width + parent.x - 50),
        y: Math.floor(Math.random() * parent.height + parent.y - 50)
    };
}

function getRandomPointFrom(point, dist){
	return {
		x: point.x + (Math.random() * dist * getRand1()),
		y: point.y + (Math.random() * dist * getRand1())
	};
}

function getRandomTriangle(parent, size) {
    var c1 = getRandomPointFrom(getRandomPoint(parent), size);
    var c2 = getRandomPointFrom(c1, size);
    var c3 = getRandomPointFrom(c2, size);
    return [
        c1,
        c2,
        c3
    ];
}

function getTriangle(point1, size) {
	//Triangle height
	var h = (size / 2) * Math.tan(rad(60));

    var point2 = {
        x: point1.x + size/2,
        y: point1.y + h
    };
    var point3 = {
        x: point2.x - size,
        y: point2.y
    };
	
    return [
        point1,
        point2,
        point3
    ];
}

function generateTriangles(parent, amount, color, cvar, noise, size) {
	if (userOptions.align){
		generateTriangle(parent,amount,color,cvar,noise,size,getRandomPoint(parent));
	} else {
		var color2 = getVariatedColor(color, cvar);
		for (var i = 0; i < amount; i++) {
			if (!userOptions.colorPerLayer){
				color2 = getVariatedColor(userOptions.colorMutate ? color2 : color, cvar);
			}
			drawShape(parent, getTriangle(getRandomPoint(parent), Math.random() * 10 + size), color2, noise);
		}
	}
}

function drawTriangle(parent, points, color, noise) {
    if (parent == null)
        return;
    var c2 = parent.getContext('2d');
    if (color) {
        c2.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        c2.beginPath();
        c2.moveTo(points[0].x, points[0].y);
        c2.lineTo(points[1].x, points[1].y);
        c2.lineTo(points[2].x, points[2].y);
        c2.closePath();
        if (userOptions.shadows){
            c2.shadowColor = 'rgb(' + userOptions.shadow_color.r + ',' + userOptions.shadow_color.g + ',' + userOptions.shadow_color.b + ')';
            c2.shadowBlur = userOptions.shadow_radius;
            c2.shadowOffsetX = userOptions.shadow_offsetX;
            c2.shadowOffsetY = userOptions.shadow_offsetY;
        }
        c2.fill();
    }

    if (noise) {
        c2.save();
        c2.clip();
        var box = {
            x: Math.min(points[0].x, points[1].x, points[2].x),
            y: Math.min(points[0].y, points[1].y, points[2].y),
            x2: Math.max(points[0].x, points[1].x, points[2].x),
            y2: Math.max(points[0].y, points[1].y, points[2].y)
        };

        c2.drawImage(noise,box.x,box.y,box.x2-box.x,box.y2-box.y);
        c2.restore();

    }
}

function blur(parent, radius) {
    if (parent == null || radius == 0)
        return;
    StackBlur.canvasRGBA(parent, parent.x, parent.y, parent.width, parent.height, radius);
}

function generateBackground(color, noise) {
    rootCanvas = getCanvas();
    if (rootCanvas) {
        drawRectangle(
            rootCanvas,
            canvasOptions,
            color,
            noise
        )
        rootDiv.appendChild(rootCanvas);
    }
}

function generateSquares(parent, amount, color, cvar, noise, size) {
	if (userOptions.align){
		generateSquare(parent, amount, color, cvar, noise, size, getRandomPoint(parent));
	} else {
		var color2 = getVariatedColor(color, cvar);
		for (var i = 0; i < amount; i++) {
			if (!userOptions.colorPerLayer){
				color2 = getVariatedColor(userOptions.colorMutate ? color2 : color, cvar);
			}
			drawShape(parent, getRectangle(getRandomPoint(parent), Math.random() * 10 +  size), color2, noise);
		}
	}
}

function getRectangle(point, size) {
	var p2 = {x: point.x + size, y: point.y};
	var p3 = {x: p2.x, y: p2.y + size};
	var p4 = {x: p3.x - size, y: p3.y};
    return [
		point,
		p2,
		p3,
		p4
	]
}

function generateNoise(canvas, alpha, x, y, width, height) {
    x = x || 0;
    y = y || 0;
    width = width || canvas.width;
    height = height || canvas.height;
    alpha = alpha || 255;
    var g = canvas.getContext("2d"),
        imageData = g.getImageData(x, y, width, height), random = Math.random,
        pixels = imageData.data,
        n = pixels.length,
        i = 0;
    while (i < n) {
        pixels[i++] = pixels[i++] = pixels[i++] = (random() * 60) | 0;
        pixels[i++] = alpha;
    }
    g.putImageData(imageData, x, y);
}

function drawRectangle(parent, rect, color, noise) {
    var c2 = parent.getContext('2d');
    if (color) {
        c2.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        if (userOptions.shadows){
            c2.shadowColor = 'rgb(' + userOptions.shadow_color.r + ',' + userOptions.shadow_color.g + ',' + userOptions.shadow_color.b + ')';
            c2.shadowBlur = userOptions.shadow_radius;
            c2.shadowOffsetX = userOptions.shadow_offsetX;
            c2.shadowOffsetY = userOptions.shadow_offsetY;
        }
        c2.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
    if (noise) {
        c2.drawImage(noise, rect.x, rect.y, rect.width, rect.height);
    }
}

function generateCircles(parent, amount, color, cvar, noise, size){
	if (userOptions.align){
		generateCircle(parent,amount,color,cvar,noise,size,getRandomPoint(parent));
	} else {
		var color2 = getVariatedColor(color, cvar);
		for (var i = 0; i < amount; i++) {
			if (!userOptions.colorPerLayer){
				color2 = getVariatedColor(userOptions.colorMutate ? color2 : color, cvar);
			}
			drawCircle(parent, getRandomPoint(parent), color2,Math.random() * 10 +  size, noise);
		}
	}
}

function drawCircle(parent, point, color, size, noise){
    if (parent == null)
        return;
    var c2 = parent.getContext('2d');
    var radius = size/2;
    if (color) {
        c2.beginPath();
        c2.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        c2.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
        if (userOptions.shadows){
            c2.shadowColor = 'rgb(' + userOptions.shadow_color.r + ',' + userOptions.shadow_color.g + ',' + userOptions.shadow_color.b + ')';
            c2.shadowBlur = userOptions.shadow_radius;
            c2.shadowOffsetX = userOptions.shadow_offsetX;
            c2.shadowOffsetY = userOptions.shadow_offsetY;
        }
        c2.fill();
    }

    if (noise) {
        c2.save();
        c2.clip();
        var box = {
            x: point.x - radius,
            y: point.y - radius,
            x2: point.x + radius,
            y2: point.y + radius
        };

        c2.drawImage(noise,box.x,box.y,box.x2-box.x,box.y2-box.y);
        c2.restore();

    }
}

function getHexagon(p1, size){
	var r = size / 2;
	var b = Math.cos(rad(30)) * r;
	var a = Math.sin(rad(30)) * r;
	var p2 = {
		x: p1.x + r,
		y: p1.y
	};
	var p3 = {
		x: p2.x + a,
		y: p2.y + b
	};
	var p4 = {
		x: p3.x - a,
		y: p3.y + b
	};
	var p5 = {
		x: p4.x - r,
		y: p4.y
	};
	var p6 = {
		x: p5.x - a,
		y: p5.y - b
	}
	
	return [
		p1,
		p2,
		p3,
		p4,
		p5,
		p6
	];
}

function getBounds(points){
	var x1 = Number.MAX_VALUE;
	var x2 = Number.MIN_VALUE;
	var y1 = Number.MAX_VALUE;
	var y2 = Number.MIN_VALUE;

	for (var i in points){
		x1 = Math.min(points[i].x, x1);
		y1 = Math.min(points[i].y, y1);
		x2 = Math.max(points[i].x, x2);
		y2 = Math.max(points[i].y, y2);
	}

	return {
		x: x1,
		y: y1,
		x2: x2,
		y2: y2
	};
}

function drawShape(parent, points, color, noise) {
	if (parent == null)
        return;
    var c2 = parent.getContext('2d');
    if (color) {
        c2.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        c2.beginPath();
		for (var i in points){
			if (i == 0)
				c2.moveTo(points[i].x, points[i].y);
			else
				c2.lineTo(points[i].x, points[i].y);
		}
        c2.closePath();
        if (userOptions.shadows){
            c2.shadowColor = 'rgb(' + userOptions.shadow_color.r + ',' + userOptions.shadow_color.g + ',' + userOptions.shadow_color.b + ')';
            c2.shadowBlur = userOptions.shadow_radius;
            c2.shadowOffsetX = userOptions.shadow_offsetX;
            c2.shadowOffsetY = userOptions.shadow_offsetY;
        }
        c2.fill();
    }

    if (noise) {
        c2.save();
        c2.clip();
        var box = getBounds(points);
        c2.drawImage(noise,box.x,box.y,box.x2-box.x,box.y2-box.y);
        c2.restore();
    }
}

function generateCircle(parent, amount, color, cvar, noise, size, point){
	if (!userOptions.colorPerLayer){
		var color2 = getVariatedColor(color, cvar);
	}
	drawCircle(parent, point, color2, size, noise);
	if (--amount > 0){
		var d = size * 1.1;
		var randX = Math.random() > .5 ? true : false;
		var point2 = {
			x: randX ? point.x + d * getRand1() : point.x, 
			y: !randX ? point.y + d * getRand1() : point.y
		};
		generateCircle(parent, amount, userOptions.colorMutate ? color2 : color, cvar, noise, size, point2);
	}
}

function generateSquare(parent, amount, color, cvar, noise, size, point){
	if (!userOptions.colorPerLayer){
		var color2 = getVariatedColor(color, cvar);
	}
	drawShape(parent, getRectangle(point, size), color2, noise);
	if (--amount > 0){
		var d = size * 1.1;
		var randX = Math.random() > .5 ? true : false;
		var point2 = {
			x: randX ? point.x + d * getRand1() : point.x, 
			y: !randX ? point.y + d * getRand1() : point.y
		};
		generateSquare(parent, amount, userOptions.colorMutate ? color2 : color, cvar, noise, size, point2);
	}
}

function generateHexagon(parent, amount, color, cvar, noise, size, point) {
	if (!userOptions.colorPerLayer)
		var color2 = getVariatedColor(color, cvar);
	drawShape(parent, getHexagon(point, size), color2, noise);
	if (--amount > 0){
		var point2 = {x: point.x + getRand1() * size * .86, y: point.y - getRand1() * size / 2};
		generateHexagon(parent, amount, userOptions.colorMutate ? color2 : color, cvar, noise, size, point2);
	}
}

function generateHexagons(parent, amount, color, cvar, noise, size) {
	if (userOptions.align){
		generateHexagon(parent, amount, color, cvar, noise, size, getRandomPoint(parent));
	} else {
		var color2 = getVariatedColor(color, cvar);
		for (var i = 0; i < amount; i++) {
			if (!userOptions.colorPerLayer){
				color2 = getVariatedColor(userOptions.colorMutate ? color2 : color, cvar);
			}
			drawShape(parent, getHexagon(getRandomPoint(parent), Math.random() * 10 + size), color2, noise);
		}
	}
}


function generateTriangle(parent, amount, color, cvar, noise, size, point){
	if (!userOptions.colorPerLayer)
		var color2 = getVariatedColor(color, cvar);
	drawShape(parent, getTriangle(point, size), color2, noise);
	if (--amount > 0){
		var d = size * 1.1;
		var randX = Math.random() > .5 ? true : false;
		var point2 = {
			x: randX ? point.x + d * getRand1() : point.x, 
			y: !randX ? point.y + d * getRand1() : point.y
		};
		generateTriangle(parent, amount, userOptions.colorMutate ? color2 : color, cvar, noise, size, point2);
	}
}
