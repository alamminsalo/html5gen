//var canvasStack = [];
//var topCanvas = null;

Array.prototype.last = function () {
    return this[this.length - 1];
}

var rootDiv = null;
var rootCanvas = null;

var canvasOptions = {
    x: 0,
    y: 0,
    width: 800,
    height: 640
}

var userOptions = {
    blur: false,
    blurAmount: .3,
    noise: false,
    noiseOpacity: 0.4,
    shadows: true,
    shadow_size: 1,
    objects_in_layer: 10,
    layers: 4,
    triangles: false,
    squares: true,
    circles: false,
    size: 2,
    rootColor: {r: 0, g: 0, b: 0, a: 1},
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

window.onload = function () {
    setupInterface();
    init();
}

function init() {
    rootDiv = document.getElementById("rootCanvas");
    rootDiv.style.width = canvasOptions.width + 'px';
    rootDiv.style.height = canvasOptions.height + 'px';

    generate();
}

function generate() {
    clear();

    addSpinner();

    if (userOptions.randomColor) {
        userOptions.rootColor = getRandomColor();
    }
    colorInput.value = rgbToHex(userOptions.rootColor.r,userOptions.rootColor.g,userOptions.rootColor.b);

    generateBackground(userOptions.rootColor, userOptions.noise ? userOptions.noiseOpacity : null); //Create root canvas

    if (!userOptions.objects_in_layer || userOptions.objects_in_layer < 1){
        console.log('error:', userOptions.objects_in_layer);
        return;
    }

    for (var i=0; i < userOptions.layers; i++) {
        console.log(i);
        if (userOptions.blur && i > 0) { //Do not blur bottom layer alone
            blur(rootCanvas, userOptions.blurAmount);
        }
        if (userOptions.triangles) {
            generateTriangles(
                rootCanvas,
                userOptions.objects_in_layer,
                userOptions.rootColor,
                100,
                userOptions.noise ? userOptions.noiseOpacity : null,
                Math.random() * 10 + 20 + i * userOptions.size
            );
        }
        if (userOptions.squares) {
            generateSquares(
                rootCanvas,
                userOptions.objects_in_layer,
                userOptions.rootColor,
                100,
                userOptions.noise ? userOptions.noiseOpacity : null,
                Math.random() * 10 + 20 + i * userOptions.size
            );
        }
        if (userOptions.circles) {
            //TODO
        }
    }
    //Finishing touches
    if (userOptions.blur && userOptions.noise) {
        generateNoise(rootCanvas, userOptions.noise);
    }
    removeSpinner();
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
    //console.log('TRI:', parent, points, color);
    var c2 = parent.getContext('2d');
    c2.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
    c2.beginPath();
    c2.moveTo(points[0].x, points[0].y);
    c2.lineTo(points[1].x, points[1].y);
    c2.lineTo(points[2].x, points[2].y);
    c2.closePath();
    c2.fill();

    //c2.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.g + ',' + '255' + ')';
    //c2.stroke();

    if (noise) {
        c2.save();
        c2.clip();
        var box = {
            x: Math.min(points[0].x, points[1].x, points[2].x),
            y: Math.min(points[0].y, points[1].y, points[2].y),
            x2: Math.max(points[0].x, points[1].x, points[2].x),
            y2: Math.max(points[0].y, points[1].y, points[2].y)
        }
        //console.log(box, box.width(), box.height());
        for (var x = box.x; x < box.x2; x++) {
            for (var y = box.y; y < box.y2; y++) {
                var number = Math.floor(Math.random() * 60);
                c2.fillStyle = "rgba(" + number + "," + number + "," + number + "," + noise + ")";
                c2.fillRect(x, y, 1, 1);
            }
        }
        c2.restore();

    }
}

function blur(parent, radius) {
    if (parent == null)
        return;
    StackBlur.canvasRGBA(parent, parent.x, parent.y, parent.width, parent.height, radius);
}

function blurStacks(radius) {
    for (var i = 0; i < canvasStack.length - 1; i++) {
        var r = Math.floor(radius * (canvasStack.length - i - 1));
        console.log(r);
        blur(canvasStack[i], r);
    }
}


function generateNoise(parent, opacity) {
    if (parent == null)
        return;
    var ctx = parent.getContext('2d');
    console.log(ctx);
    opacity = opacity || .2;

    for (var x = 0; x < parent.width; x++) {
        for (var y = 0; y < parent.height; y++) {
            var number = Math.floor(Math.random() * 60);

            var pixel = ctx.getImageData(x, y, 1, 1);
            if (!pixel.data[0] && !pixel.data[1] && !pixel.data[2]) {
                ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

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
    //flattenImage();
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

function drawRectangle(parent, rect, color, noise) {
    var c2 = parent.getContext('2d');
    c2.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    c2.fillRect(rect.x, rect.y, rect.width, rect.height);
    if (noise) {
        for (var x = rect.x; x < rect.x + rect.width; x++) {
            for (var y = rect.y; y < rect.y + rect.height; y++) {
                var number = Math.floor(Math.random() * 60);
                c2.fillStyle = "rgba(" + number + "," + number + "," + number + "," + noise + ")";
                c2.fillRect(x, y, 1, 1);
            }
        }
    }
}

function drawShape(parent, points, color) {
    var c2 = parent.getContext('2d');
    c2.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    c2.beginPath();
    c2.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++)
        c2.lineTo(points[i].x, points[i].y);
    c2.closePath();
    c2.fill();
}