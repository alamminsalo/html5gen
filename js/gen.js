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
    triangles: false,
    squares: false,
    circles: true,
    size: 10,
    rootColor: {r: 2, g: 12, b: 15, a: 1},
    randomColor: true,
    colorPerLayer: false,
    colorChAmt: 255,
	colorAlpha: 150,
    blurTop: false,
    balanceColors: false 
}

function getRandomColor(alpha) { //Gives nice darkish midtone-colors
    return {
        r: clamp(0, 255, Math.floor(Math.random() * 100 + 120)),
        g: clamp(0, 255, Math.floor(Math.random() * 100 + 120)),
        b: clamp(0, 255, Math.floor(Math.random() * 100 + 120)),
        a: alpha | userOptions.colorAlpha 
    };
}

function getRandomBackgroundColor(){
    return {
        r: clamp(0, 255, Math.floor(Math.random() * 50)),
        g: clamp(0, 255, Math.floor(Math.random() * 50)),
        b: clamp(0, 255, Math.floor(Math.random() * 50)),
        a: alpha | userOptions.colorAlpha 
    };
}

function addToColor(color,value){
    color.r += value;
    color.g += value;
    color.b += value;
    color.r = clamp(0, 255, color.r);
    color.g = clamp(0, 255, color.g); 
    color.b = clamp(0, 255, color.b); 
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

function clamp(min, max, value){
	return Math.max(0, Math.min(max, value));	
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

function flattenImage() {
    var rootctx = rootCanvas.getContext('2d');
    for (var i in canvasStack) {
        if (canvasStack[i] != rootCanvas) {
            rootctx.drawImage(canvasStack[i], 0, 0)
        }
    }
    while (canvasStack.length > 1) {
        canvasStack.pop();
    }
}

function getRandomPoint(parent) {
    return {
        x: Math.floor(Math.random() * parent.width + parent.x - 50),
        y: Math.floor(Math.random() * parent.height + parent.y - 50)
    };
}

function getRandomPointFrom(point, dist){
	return {
		x: point.x + (Math.random() * dist * 4 - dist * 2),
		y: point.y + (Math.random() * dist * 4 - dist * 2)
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

function getRandomAlignedTriangle(parent, size) {
    var point1 = getRandomPoint(parent); //Top
    var point2 = {
        x: point1.x - size/2,
        y: point1.y + size/2
    };
    var point3 = {
        x: point1.x + size/2,
        y: point1.y + size/2
    };
    return [
        point1,
        point2,
        point3
    ];
}

function getVariatedColor(color, amount) {
    var r = color.r + (Math.random() - (userOptions.balanceColors ? .5 : 0)) * amount;
    var g = color.g + (Math.random() - (userOptions.balanceColors ? .5 : 0)) * amount;
    var b = color.b + (Math.random() - (userOptions.balanceColors ? .5 : 0)) * amount;
    r = clamp(0, 255, r);
    g = clamp(0, 255, g);
    b = clamp(0, 255, b);
    return {
        r: Math.floor(r),
        g: Math.floor(g),
        b: Math.floor(b),
        a: color.a
    };
}

function generateTriangles(parent, amount, color, cvar, noise, size) {
    var color2 = getVariatedColor(color, cvar);
    for (var i = 0; i < amount; i++) {
        if (!userOptions.colorPerLayer){
            color2 = getVariatedColor(color, cvar);
        }
        drawTriangle(parent, getRandomTriangle(parent, Math.random() * 10 + size), color2, noise);
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
    var color2 = getVariatedColor(color, cvar);
    for (var i = 0; i < amount; i++) {
        if (!userOptions.colorPerLayer){
            color2 = getVariatedColor(color, cvar);
        }
        drawRectangle(parent, getRandomRectangle(parent, Math.random() * 10 +  size), color2, noise);
    }
}

function getRandomRectangle(parent, size) {
    var point1 = getRandomPoint(parent);
    return {
        x: point1.x,
        y: point1.y,
        width: size,
        height: size
    }
}

function generateNoise(canvas, alpha, x, y, width, height) {
    x = x || 0;
    y = y || 0;
    width = width || canvas.width;
    height = height || canvas.height;
    alpha = alpha || 255;
    var g = canvas.getContext("2d"),
        imageData = g.getImageData(x, y, width, height),
        random = Math.random,
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
    var color2 = getVariatedColor(color, cvar);
    for (var i = 0; i < amount; i++) {
        if (!userOptions.colorPerLayer){
            color2 = getVariatedColor(color, cvar);
        }
        drawCircle(parent, getRandomPoint(parent), color2,Math.random() * 10 +  size, noise);
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

