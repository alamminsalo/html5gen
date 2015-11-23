
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(color) {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

Object.prototype.clone = Array.prototype.clone = function()
{
    if (Object.prototype.toString.call(this) === '[object Array]')
    {
        var clone = [];
        for (var i=0; i<this.length; i++)
            clone[i] = this[i].clone();

        return clone;
    } 
    else if (typeof(this)=="object")
    {
        var clone = {};
        for (var prop in this)
            if (this.hasOwnProperty(prop))
                clone[prop] = this[prop].clone();

        return clone;
    }
    else
        return this;
}

function getRand1(){
	return Math.random() > .5 ? 1 : -1;
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

function addToColorRand(color,value){
	var r = Math.random() * 3;
	if (r < 1){
		color.r = clamp(0,255,color.r + value)
	} else if (r < 2) {
		color.g = clamp(0,255,color.g + value)
	} else {
		color.b = clamp(0,255,color.b + value)
	}
}

function clamp(min, max, value){
	return Math.max(0, Math.min(max, value));	
}

function rad(deg){
	return deg * Math.PI / 180;
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


function cloneColor(a){
	return {
		r: a.r,
		g: a.g,
		b: a.b,
		a: a.a
	};
}

