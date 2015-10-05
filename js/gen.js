
var rootDiv = null;
var rootCanvas = null;

var canvasOptions = {
    x: 0,
    y: 0,
    width: 1920,
    height: 1080
}

var userOptions = {
    blur: false,
    blurAmount: 8,
    noise: false,
    noiseExtra: true,
    noiseOpacity: 40,
    shadows: false,
    shadow_color: {r: 0, g: 0, b: 0, a: 255},
    shadow_radius: 2,
    shadow_offsetX: 2,
    shadow_offsetY: 2,
    objects_in_layer: 10,
    layers: 4,
    triangles: false,
    squares: true,
    circles: false,
    size: 5,
    rootColor: {r: 0, g: 0, b: 0, a: 255},
    randomColor: true
}

function getRandomColor() { //Gives nice midtone-colors
    return {
        r: Math.floor(Math.random() * 100 + 100),
        g: Math.floor(Math.random() * 100 + 100),
        b: Math.floor(Math.random() * 100 + 100),
        a: 255
    };
}

function addToColor(color,value){
    color.r += value;
    color.g += value;
    color.b += value;
    color.r = Math.min(Math.max(color.r,0),255);
    color.g = Math.min(Math.max(color.g,0),255);
    color.b = Math.min(Math.max(color.b,0),255);
}

window.onload = function () {
    setupInterface();
    init();
}

var size = 100;
function resizeCanvas(){
    size = size < 100 ? 100 : 60;
    rootCanvas.style.height = size + '%';
}


function init() {
    rootDiv = document.getElementById("rootCanvas");
    rootDiv.style.width = canvasOptions.width + 'px';
    rootDiv.style.height = canvasOptions.height + 'px';

    generate();
}

function generate() {
    clear();

    //addSpinner();

    if (userOptions.randomColor) {
        userOptions.rootColor = getRandomColor();
    }
    colorInput.value = rgbToHex(userOptions.rootColor.r,userOptions.rootColor.g,userOptions.rootColor.b);
    shadowColor.value = rgbToHex(userOptions.shadow_color.r,userOptions.shadow_color.g,userOptions.shadow_color.b)

    var noiseCanvas = null;
    if (userOptions.noise) {
        noiseCanvas = document.createElement("canvas");
        noiseCanvas.width = canvasOptions.width;
        noiseCanvas.height = canvasOptions.height;
        generateNoise(noiseCanvas, userOptions.noiseOpacity);
    }

    generateBackground(userOptions.rootColor, noiseCanvas); //Create root canvas

    if (!userOptions.objects_in_layer || userOptions.objects_in_layer < 1){
        console.log('error:', userOptions.objects_in_layer);
        return;
    }

    for (var i=0; i < userOptions.layers; i++) {
        if (userOptions.blur && i > 0) { //Do not blur bottom layer alone
            blur(rootCanvas, userOptions.blurAmount);
        }
        if (userOptions.triangles) {
            generateTriangles(
                rootCanvas,
                userOptions.objects_in_layer,
                userOptions.rootColor,
                100,
                noiseCanvas,
                Math.random() * 10 + 20 + i * userOptions.size
            );
        }
        if (userOptions.squares) {
            generateSquares(
                rootCanvas,
                userOptions.objects_in_layer,
                userOptions.rootColor,
                100,
                noiseCanvas,
                Math.random() * 10 + 20 + i * userOptions.size
            );
        }
        if (userOptions.circles) {
            //TODO
        }
    }
    //Finishing touches
    if (userOptions.noise && userOptions.noiseExtra) {
        drawRectangle(rootCanvas, canvasOptions, null, noiseCanvas);
    }
    rootCanvas.style.height = size + '%';
}

function clear() {
    if (rootCanvas) {
        rootCanvas.getContext('2d').clearRect(canvasOptions.x, canvasOptions.y, canvasOptions.width, canvasOptions.height);
        rootDiv.removeChild(rootCanvas);
        rootCanvas = null;
    }
}

function getCanvas() {
    var canvas = document.createElement("canvas");
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
        x: Math.floor(Math.random() * parent.width + parent.x),
        y: Math.floor(Math.random() * parent.height + parent.y)
    };
}

function getRandomTriangle(parent) {
    var point1 = getRandomPoint(parent);
    var point2 = getRandomPoint(parent);
    var point3 = {
        x: point2.x,
        y: point1.y
    };
    return [
        point1,
        point2,
        point3
    ];
}

function getRandomAlignedTriangle(parent, size) {
    var point1 = getRandomPoint(parent); //Top
    var point2 = {
        x: point1.x - size / 2,
        y: point1.y + size / 2
    };
    var point3 = {
        x: point1.x + size / 2,
        y: point1.y + size / 2
    };
    return [
        point1,
        point2,
        point3
    ];
}

function getVariatedColor(color, amount) {
    var r = color.r + (Math.random() - .5) * amount;
    var g = color.g + (Math.random() - .5) * amount;
    var b = color.b + (Math.random() - .5) * amount;
    r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);
    return {
        r: Math.floor(r),
        g: Math.floor(g),
        b: Math.floor(b),
        a: color.a
    };
}

function generateTriangles(parent, amount, color, cvar, noise, size) {
    for (var i = 0; i < amount; i++) {
        drawTriangle(parent, getRandomAlignedTriangle(parent, size), getVariatedColor(color, cvar), noise);
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
            c2.shadowColor = 'rgba(' + userOptions.shadow_color.r + ',' + userOptions.shadow_color.g + ',' + userOptions.shadow_color.b + ')';
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
    if (parent == null)
        return;
    StackBlur.canvasRGBA(parent, parent.x, parent.y, parent.width, parent.height, radius);
}

/*function blurStacks(radius) {
    for (var i = 0; i < canvasStack.length - 1; i++) {
        var r = Math.floor(radius * (canvasStack.length - i - 1));
        blur(canvasStack[i], r);
    }
}*/

function generateBackground(color, noise) {
    rootCanvas = rootCanvas != null ? rootCanvas : getCanvas();
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
    for (var i = 0; i < amount; i++) {
        drawRectangle(parent, getRandomRectangle(parent, (Math.random() + .5) * size), getVariatedColor(color, cvar), noise);
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
        c2.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
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
