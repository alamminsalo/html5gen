//Default preset
function getSmoothCirclesPreset(){
	return {
		brightness: 55,
		align: true,
		blurAmount: 80,
		noiseOpacity: 0,
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
		colorChAmt: 150,
		colorAlpha: 180,
		blurTop: false,
		balanceColors: false,
		colorMutate: true
	}
}

function getFlatCirclesPreset(){
	return {
		brightness: 180,
		align: true,
		blurAmount: 0,
		noiseOpacity: 0,
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
		rootColor: getRandomColor(255),
		randomColor: true,
		colorPerLayer: false,
		colorChAmt: 230,
		colorAlpha: 255,
		blurTop: false,
		balanceColors: false,
		colorMutate: false,
	}
}

function getFlatSquaresPreset(){
	return {
		brightness: 200,
		align: true,
		blurAmount: 0,
		noiseOpacity: 15,
		shadows: false,
		shadow_color: {r: 0, g: 0, b: 0, a: 255},
		shadow_radius: 1,
		shadow_offsetX: 0,
		shadow_offsetY: 0,
		objects_in_layer: 16,
		depth: 0,
		layers: 1,
		hex: false,
		triangles: false,
		squares: true,
		circles: false,
		size: 200 * screen.height / 768, //Some initial scaling to settings which looked nice on 1366x768 display
		rootColor: getRandomColor(255),
		randomColor: true,
		colorPerLayer: false,
		colorChAmt: 15,
		colorAlpha: 255,
		blurTop: false,
		balanceColors: false,
		colorMutate: true,
	}
}

function getAmbientPreset(){
	return {
		brightness: 40,
		align: true,
		blurAmount: 128,
		noiseOpacity: 0,
		shadows: false,
		shadow_color: {r: 0, g: 0, b: 0, a: 255},
		shadow_radius: 1,
		shadow_offsetX: 0,
		shadow_offsetY: 0,
		objects_in_layer: 15,
		depth: 2,
		layers: 10,
		hex: false,
		triangles: false,
		squares: false,
		circles: true,
		size: 25 * screen.height / 768, //Some initial scaling to settings which looked nice on 1366x768 display
		rootColor: {r: 2, g: 12, b: 15, a: 1},
		randomColor: true,
		colorPerLayer: false,
		colorChAmt: 35,
		colorAlpha: 255,
		blurTop: true,
		balanceColors: false,
		colorMutate: true
	}
}

function getHexPreset(){
	return {
		brightness: 20,
		align: true,
		blurAmount: 90,
		noiseOpacity: 0,
		shadows: false,
		shadow_color: {r: 0, g: 0, b: 0, a: 255},
		shadow_radius: 1,
		shadow_offsetX: 0,
		shadow_offsetY: 0,
		objects_in_layer: 6,
		depth: 2,
		layers: 6,
		hex: true,
		triangles: false,
		squares: false,
		circles: false,
		size: 160 * screen.height / 768, //Some initial scaling to settings which looked nice on 1366x768 display
		rootColor: getRandomColor(255),
		randomColor: true,
		colorPerLayer: false,
		colorChAmt: 255,
		colorAlpha: 180,
		blurTop: false,
		balanceColors: false,
		colorMutate: false 
	}
}
