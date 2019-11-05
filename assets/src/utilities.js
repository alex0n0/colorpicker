function helloworldfromutilities() {
    console.log('hello world from utilities');
}



/**
 * HSV -> RGB
 */
function hsvToRgb(hsvObj) {
    //0 <= h <= 360 //0 <= s <= 1 //0 <= v <= 1
    var h = hsvObj.h;
    var s = hsvObj.s / 100;
    var v = hsvObj.v / 100;

    var c = v * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = v - c;

    var rDash, gDash, bDash;
    var r, g, b;

    if (h >= 0 && h < 60) {
        rDash = c;
        gDash = x;
        bDash = 0;
    } else if (h >= 60 && h < 120) {
        rDash = x;
        gDash = c;
        bDash = 0;
    } else if (h >= 120 && h < 180) {
        rDash = 0;
        gDash = c;
        bDash = x;
    } else if (h >= 180 && h < 240) {
        rDash = 0;
        gDash = x;
        bDash = c;
    } else if (h >= 240 && h < 300) {
        rDash = x;
        gDash = 0;
        bDash = c;
    } else {
        rDash = c;
        gDash = 0;
        bDash = x;
    }

    r = Math.round((rDash + m) * 255);
    g = Math.round((gDash + m) * 255);
    b = Math.round((bDash + m) * 255);
    // r = (rDash + m) * 255;
    // g = (gDash + m) * 255;
    // b = (bDash + m) * 255;

    return {
        r: r,
        g: g,
        b: b,
        rgbStr: `rgb(${r}, ${g}, ${b})`
    }
}
/**
 * RGB -> HSV
 */
function rgbToHsv(rgbObj) {
    //0 <= r <= 1 //0 <= g <= 1 //0 <= b <= 1
    var rDash = rgbObj.r / 255;
    var gDash = rgbObj.g / 255;
    var bDash = rgbObj.b / 255;

    var cMax = Math.max(rDash, gDash, bDash);
    var cMin = Math.min(rDash, gDash, bDash);
    var delta = cMax - cMin;

    var h;
    var s;
    var v;

    if (delta == 0) {
        h = 0;
    } else if (cMax == rDash) {
        h = 60 * (((gDash - bDash) / delta) % 6);
    } else if (cMax == gDash) {
        h = 60 * (((bDash - rDash) / delta) + 2);
    } else if (cMax == bDash) {
        h = 60 * (((rDash - gDash) / delta) + 4);
    }

    if (h < 0) {
        h = 360 + h;
    }


    if (delta == 0) {
        s = 0;
    } else {
        s = delta / cMax;
    }

    v = cMax;

    h = Math.round(h);
    s = Math.round(s * 100);
    v = Math.round(v * 100);
    return {
        h: h,
        s: s,
        v: v,
        hsvStr: `hsv(${h}, ${s}%, ${v}%)`
    }
}





















/** RGB and HEX
 * RGB -> HEX
 */
function rgbToHex(rgbObj) {
    return '#' + formatDecToHex(rgbObj.r) + formatDecToHex(rgbObj.g) + formatDecToHex(rgbObj.b);
}
function formatDecToHex(num) {
    var hexStr = num.toString(16);
    hexStr = hexStr.length === 1 ? '0' + hexStr : hexStr;
    return hexStr;
}

/** RGB and HEX
 * HEX -> RGB
 */
function hexToRgb(hexStr) {
    var hexStrR, hexStrG, hexStrB;

    if (hexStr.length == 3) {
        hexStrR = hexStr.substr(0, 1) + hexStr.substr(0, 1);
        hexStrG = hexStr.substr(1, 1) + hexStr.substr(1, 1);
        hexStrB = hexStr.substr(2, 1) + hexStr.substr(2, 1);
    } else {
        hexStrR = hexStr.substr(0, 2);
        hexStrG = hexStr.substr(2, 2);
        hexStrB = hexStr.substr(4, 2);
    }

    var r = formatHexToDec(hexStrR);
    var g = formatHexToDec(hexStrG);
    var b = formatHexToDec(hexStrB);
    return {
        r: r,
        g: g,
        b: b,
        rgbStr: `rgb(${r}, ${g}, ${b})`
    }
}
function formatHexToDec(hexStr) {
    var num = parseInt(hexStr, 16);
    return num;
}


function luminanceFromRgb(rgbObj) {
    var r = rgbObj.r <= 10 ? rgbObj.r/3294: Math.pow((rgbObj.r/269 + 0.0513), 2.4);
    var g = rgbObj.r <= 10 ? rgbObj.g/3294: Math.pow((rgbObj.g/269 + 0.0513), 2.4);
    var b = rgbObj.r <= 10 ? rgbObj.b/3294: Math.pow((rgbObj.b/269 + 0.0513), 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}



module.exports = {
    helloworldfromutilities: helloworldfromutilities,
    hsvToRgb: hsvToRgb,
    rgbToHsv: rgbToHsv,
    rgbToHex: rgbToHex,
    hexToRgb: hexToRgb,
    luminanceFromRgb: luminanceFromRgb
}