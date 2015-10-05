/**
 * Created by antti on 5.10.2015.
 */

var rootDiv = null;
var worker = undefined;
var rootCanvas = null;

window.onload = function () {
    init();
}

function init() { //Default options come here
    var userOptions = {
        blur: true,
        blurAmount: 100,
        noise: false,
        noiseOpacity: 0.2,
        shadows: false,
        shadow_size: 1,
        objects_in_layer: 10,
        layers: 4,
        triangles: false,
        squares: true,
        circles: false,
        size: 4,
        rootColor: {r: 0, g: 0, b: 0, a: 1},
        randomColor: true
    }
    var canvasOptions = {
        x: 0,
        y: 0,
        width: 800,
        height: 640
    }

    rootDiv = document.getElementById("rootCanvas");
    rootCanvas = document.getElementById("canvas");
    rootCanvas.width = canvasOptions.width;
    rootCanvas.height = canvasOptions.height;

    setupInterface({user: userOptions,canvas: canvasOptions});
    generate(rootCanvas.getContext('2d'), getUpdatedValues());
}