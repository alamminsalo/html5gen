//UserOptions
var userOptions;

//Interface doms
var blurAmt;
var noiseAmt;
var cMutate;
var blurTop; var widthBox; var heightBox;
var objAmt;
var layerAmt;
var squaresOn;
var hexOn;
var trianglesOn;
var circlesOn;
var obSize;
var colorRand, colorPerLayer, colorCh;
var colorInput = null;
var shadowOn, shadowColor, shadowX, shadowY, shadowRad;
var depth;
var colorBalance;
var colorAlpha;
var align;
var genButton;

function updateInterface(){
    widthBox.value = canvasOptions.width;
    heightBox.value = canvasOptions.height;
    blurAmt.value = userOptions.blurAmount;
    noiseAmt.value = userOptions.noiseOpacity;
    objAmt.value = userOptions.objects_in_layer;
	align.checked = userOptions.align;
    layerAmt.value = userOptions.layers;
    squaresOn.checked = userOptions.squares;
    hexOn.checked = userOptions.hex;
    trianglesOn.checked = userOptions.triangles;
	cMutate.checked = userOptions.colorMutate;
    circlesOn.checked = userOptions.circles;
    obSize.value = userOptions.size;
    colorRand.checked = userOptions.randomColor;
    shadowOn.checked = userOptions.shadows;
    shadowColor.value = rgbToHex(userOptions.shadow_color);
    shadowRad.value = userOptions.shadow_radius;
    colorPerLayer.checked = userOptions.colorPerLayer;
    colorCh.value = userOptions.colorChAmt;
    depth.value = userOptions.depth;
    blurTop.checked = userOptions.blurTop;
    colorBalance.checked = userOptions.balanceColors;
	colorAlpha.value = userOptions.colorAlpha;
    shadowX.value = userOptions.shadow_offsetX;
    shadowY.value = userOptions.shadow_offsetY;

	updateDoms();
}

function setupInterface() {
	genButton = document.getElementById('genwrap');
    blurAmt = document.getElementById("blurAmt");
    noiseAmt = document.getElementById("noiseAmt");
    widthBox = document.getElementById("widthBox");
    heightBox = document.getElementById("heightBox");
    objAmt = document.getElementById("obAmt");
	align = document.getElementById("align");
    layerAmt = document.getElementById("layerAmt");
	squaresOn = document.getElementById("sqOn");
    hexOn = document.getElementById("hexOn");
    trianglesOn = document.getElementById("triOn");
	cMutate = document.getElementById("cmut");
    circlesOn = document.getElementById("ciOn");
    obSize = document.getElementById("sizeVal");
    colorInput = document.getElementById("colorInput");
    colorRand = document.getElementById("randColorOn");
    shadowOn = document.getElementById("shOn");
    shadowColor = document.getElementById("shCol");
    shadowRad = document.getElementById("shRad");
    shadowX = document.getElementById("shX");
    shadowY = document.getElementById("shY");
    colorPerLayer = document.getElementById('colorPerLayer');
    colorCh = document.getElementById('colorCh');
    depth = document.getElementById('depth');
    blurTop = document.getElementById('blurTop');
    colorBalance = document.getElementById('balanceColor');
	colorAlpha = document.getElementById('alpha');

	updateInterface()

    createDropDownEvents();

    document.getElementById('generate').addEventListener('click',generatePressed, true);
    document.getElementById('root').addEventListener('click', resizeCanvas, false);
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
        handles[i].style.background = rgbToHex(color);
    }
}

function updateDoms() {
    updateInterfaceValue(blurAmt);
    updateInterfaceValue(noiseAmt); updateInterfaceValue(obSize);
    updateInterfaceValue(layerAmt);
    updateInterfaceValue(objAmt);
    updateInterfaceValue(depth);
    updateInterfaceValue(shadowRad);
    updateInterfaceValue(colorCh);
    updateInterfaceValue(colorAlpha);
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

	userOptions.colorAlpha = colorAlpha.value;

	userOptions.hex = hexOn.checked;

    userOptions.shadow_color = shadowRgb;
    userOptions.shadow_offsetX = Number(shadowX.value);
    userOptions.shadow_offsetY = Number(shadowY.value);
    userOptions.shadow_radius = Number(shadowRad.value);

    userOptions.blurTop = blurTop.checked;

    userOptions.colorChAmt = colorCh.value;

    var rgb = hexToRgb(colorInput.value);
    rgb.a = 255;

    userOptions.rootColor = rgb;

	userOptions.align = align.checked;

    canvasOptions.width = Number(widthBox.value);
    canvasOptions.height = Number(heightBox.value);

    rootDiv.width = Number(canvasOptions.width);
    rootDiv.height = Number(canvasOptions.height);

    userOptions.depth = Number(depth.value);

    userOptions.colorPerLayer = colorPerLayer.checked;
    userOptions.balanceColors = colorBalance.checked;
	userOptions.colorMutate = cMutate.checked;
}

function updateInterfaceValue(self) {
    self.parentElement.getElementsByTagName("output")[0].value = self.value;
}

function generatePressed(e) {
	if (e)
		e.stopPropagation();
    updateValues();
	genButton.classList.add('disabled');
	genButton.children[0].innerText = 'Generating...';
	setTimeout(function(){
		generate();
		genButton.classList.remove('disabled');
		genButton.children[0].innerText = 'Generate!';
	},100);
}

function resizeCanvas(){
    document.getElementById('panel').classList.toggle('float');
    rootCanvas.classList.toggle('fitcontent');
}

function onPresetSelected(){
	var select = document.getElementById("preset");
	console.log("Selecting preset: ",select.value);
	switch(select.value){
		case "flatc":
			userOptions = getFlatCirclesPreset();
			break;

		case "flats":
			userOptions = getFlatSquaresPreset();
			break;

		case "circles":
			userOptions = getSmoothCirclesPreset();
			break;

		case "ambient":
			userOptions = getAmbientPreset();
			break;

		case "hex":
			userOptions = getHexPreset();
			break;
	}
	updateInterface();
	generatePressed();
}
