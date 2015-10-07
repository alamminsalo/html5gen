var blurAmt;
var noiseAmt;
var blurTop;
var widthBox;
var heightBox;
var objAmt;
var layerAmt;
var squaresOn;
var trianglesOn;
var circlesOn;
var obSize;
var colorRand, colorPerLayer, colorCh;
var colorInput = null;
var shadowOn, shadowColor, shadowX, shadowY, shadowRad;
var depth;
var colorBalance;

function setupInterface() {
    blurAmt = document.getElementById("blurAmt");
    blurAmt.value = userOptions.blurAmount;

    noiseAmt = document.getElementById("noiseAmt");
    noiseAmt.value = userOptions.noiseOpacity;

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
    shadowColor.value = rgbToHex(userOptions.shadow_color.r, userOptions.shadow_color.g, userOptions.shadow_color.b);
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

    blurTop = document.getElementById('blurTop');
    blurTop.checked = userOptions.blurTop;

    colorBalance = document.getElementById('balanceColor');
    colorBalance.checked = userOptions.balanceColors;

    updateAll();

    createDropDownEvents();

}

function createDropDownEvents(){
    var handles = document.getElementsByClassName('controlbar');
    for (var i = 0; i < handles.length; i++){
        handles[i].addEventListener('click', function(){
            var nodes = this.parentElement.getElementsByClassName('controls');
            for (var j = 0; j < nodes.length; j++){
                nodes[j].classList.toggle('hidden');
            }
        });
        var color = getRandomColor();
        handles[i].style.background = rgbToHex(color.r,color.g,color.b);
    }
}

function updateAll() {
    updateInterfaceValue(blurAmt);
    updateInterfaceValue(noiseAmt);
    updateInterfaceValue(obSize);
    updateInterfaceValue(layerAmt);
    updateInterfaceValue(objAmt);
    updateInterfaceValue(depth);
    updateInterfaceValue(shadowRad);
    updateInterfaceValue(colorCh);
}

function updateValues() {
    userOptions.blurAmount = Number(blurAmt.value);
    userOptions.noiseOpacity = Number(noiseAmt.value);
    userOptions.objects_in_layer = Number(objAmt.value);
    userOptions.layers = layerAmt.value;
    userOptions.squares = squaresOn.checked;
    userOptions.triangles = trianglesOn.checked;
    userOptions.circles = circlesOn.checked;
    userOptions.size = Number(obSize.value);
    userOptions.randomColor = colorRand.checked;
    //userOptions.noiseExtra = noiseExtra.checked;
    userOptions.shadows = shadowOn.checked;
    var shadowRgb = hexToRgb(shadowColor.value);
    shadowRgb.a = 255;

    userOptions.shadow_color = shadowRgb;
    userOptions.shadow_offsetX = Number(shadowX.value);
    userOptions.shadow_offsetY = Number(shadowY.value);
    userOptions.shadow_radius = Number(shadowRad.value);

    userOptions.blurTop = blurTop.checked;

    userOptions.colorChAmt = colorCh.value;

    var rgb = hexToRgb(colorInput.value);
    rgb.a = 255;

    userOptions.rootColor = rgb;

    canvasOptions.width = Number(widthBox.value);
    canvasOptions.height = Number(heightBox.value);

    rootDiv.width = Number(canvasOptions.width);
    rootDiv.height = Number(canvasOptions.height);

    userOptions.depth = Number(depth.value);

    userOptions.colorPerLayer = colorPerLayer.checked;
    userOptions.balanceColors = colorBalance.checked;
    //console.log(userOptions, canvasOptions);
}

function updateInterfaceValue(self) {
    self.parentElement.getElementsByTagName("output")[0].value = self.value;
}

function generatePressed() {
    updateValues();
    generate();
}

function resizeCanvas(){
    document.getElementById('panel').classList.toggle('float');
    rootCanvas.classList.toggle('fitcontent');
}