var blurAmt = null;
var noiseAmt = null;
var blurOn = null;
var noiseOn = null;
var widthBox = null;
var heightBox = null;
var objAmt = null;
var layerAmt = null;
var squaresOn = null;
var trianglesOn = null;
var circlesOn = null;
var obSize = null;
var colorRand = null;
var colorInput = null;

function setupInterface(){
    blurAmt = document.getElementById("blurAmt");
    blurAmt.value = userOptions.blurAmount;

    noiseAmt = document.getElementById("noiseAmt");
    noiseAmt.value = userOptions.noiseOpacity;

    blurOn = document.getElementById("blurOn");
    blurOn.checked = userOptions.blur;

    noiseOn = document.getElementById("noiseOn");
    noiseOn.checked = userOptions.noise;

    widthBox = document.getElementById("widthBox");
    widthBox.value = canvasOptions.width;

    heightBox = document.getElementById("heightBox");
    heightBox.value = canvasOptions.height;

    objAmt = document.getElementById("obAmt");
    objAmt.value = userOptions.objects_in_layer;

    layerAmt = document.getElementById("layerAmt");
    layerAmt.value = userOptions.layers;

    squaresOn = document.getElementById("sqOn");
    squaresOn.checked = userOptions.squares;

    trianglesOn = document.getElementById("triOn");
    trianglesOn.checked = userOptions.triangles;

    circlesOn = document.getElementById("ciOn");
    circlesOn.checked = userOptions.circles;

    obSize = document.getElementById("sizeVal");
    obSize.value = userOptions.size;

    colorInput = document.getElementById("colorInput");

    colorRand = document.getElementById("randColorOn");
    colorRand.checked = userOptions.randomColor;
}

function updateValues(){
    userOptions.blur = blurOn.checked;
    userOptions.noise = noiseOn.checked;
    userOptions.blurAmount = blurAmt.value;
    userOptions.noiseOpacity = noiseAmt.value;
    userOptions.objects_in_layer = objAmt.value;
    userOptions.layers = layerAmt.value;
    userOptions.squares = squaresOn.checked;
    userOptions.triangles = trianglesOn.checked;
    userOptions.circles = circlesOn.checked;
    userOptions.size = obSize.value;
    userOptions.randomColor = colorRand.checked;

    var rgb = hexToRgb(colorInput.value);
    rgb.a = 255;

    userOptions.rootColor = rgb;

    canvasOptions.width = widthBox.value;
    canvasOptions.height = heightBox.value;

    rootDiv.width = canvasOptions.width;
    rootDiv.height = canvasOptions.height;

    console.log(userOptions, canvasOptions);
}

function generatePressed(){
    updateValues();
    generate();
}