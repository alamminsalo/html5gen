var blurAmt = null;
var noiseAmt = null;
var blurOn = null;
var noiseOn = null;
var noiseExtra = null;
var widthBox = null;
var heightBox = null;
var objAmt = null;
var layerAmt = null;
var squaresOn = null;
var trianglesOn = null;
var circlesOn = null;
var obSize = null;
var colorRand, colorPerLayer, colorCh;
var colorInput = null;
var shadowOn, shadowColor, shadowX, shadowY, shadowRad;
var depth;

function setupInterface(){
    blurAmt = document.getElementById("blurAmt");
    blurAmt.value = userOptions.blurAmount;

    noiseAmt = document.getElementById("noiseAmt");
    noiseAmt.value = userOptions.noiseOpacity;

    blurOn = document.getElementById("blurOn");
    blurOn.checked = userOptions.blur;

    noiseOn = document.getElementById("noiseOn");
    noiseOn.checked = userOptions.noise;

    noiseExtra = document.getElementById("noiseEx");
    noiseExtra.checked = userOptions.noiseExtra;

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

    shadowOn = document.getElementById("shOn");
    shadowOn.checked = userOptions.shadows;
    shadowColor = document.getElementById("shCol");
    shadowColor.value = rgbToHex(userOptions.shadow_color.r,userOptions.shadow_color.g,userOptions.shadow_color.b);
    shadowRad = document.getElementById("shRad");
    shadowRad.value = userOptions.shadow_radius;
    shadowX = document.getElementById("shX");
    shadowX.value = userOptions.shadow_offsetX;
    shadowY = document.getElementById("shY");
    shadowY.value = userOptions.shadow_offsetY;

    colorPerLayer = document.getElementById('colorPerLayer');
    colorPerLayer.checked = userOptions.colorPerLayer;

    colorCh = document.getElementById('colorCh');
    colorCh.value = userOptions.colorChAmt;

    depth = document.getElementById('depth');
    depth.value = userOptions.depth;
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
    userOptions.noiseExtra = noiseExtra.checked;
    userOptions.shadows = shadowOn.checked;
    var shadowRgb = hexToRgb(shadowColor.value);
    shadowRgb.a = 255;

    userOptions.shadow_color = shadowRgb;
    userOptions.shadow_offsetX = shadowX.value;
    userOptions.shadow_offsetY = shadowY.value;
    userOptions.shadow_radius = shadowRad.value;

    userOptions.colorChAmt = colorCh.value;

    var rgb = hexToRgb(colorInput.value);
    rgb.a = 255;

    userOptions.rootColor = rgb;

    canvasOptions.width = widthBox.value;
    canvasOptions.height = heightBox.value;

    rootDiv.width = canvasOptions.width;
    rootDiv.height = canvasOptions.height;

    userOptions.depth = depth.value;

    userOptions.colorPerLayer = colorPerLayer.checked;
    //console.log(userOptions, canvasOptions);
}

function generatePressed(){
    updateValues();
    generate();
}