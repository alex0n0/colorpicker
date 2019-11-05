const utilities = require('./utilities.js');
const fs = require('fs-extra');












var savebuttoncolorchange = 40;
var savedColors = [];



$('#savebutton').on('click', function () {
    var color = colorObj.hexStr.toUpperCase()
    if (savedColors.indexOf(color) < 0) {
        fs.appendFile('./colors.txt', color + ',', function (err) {
            if (err) {
                console.log('something went wrong: ' + err)
            }
            savedColors.push(color);
            appendSavedColor(savedColors[savedColors.length - 1]);
        });
    }
});

function appendSavedColor(hexStr) {
    var textColor;
    var rgbObj = utilities.hexToRgb(hexStr.substr(1));
    var luminance = utilities.luminanceFromRgb(rgbObj);

    // console.log((1 + 0.05) / (luminance + 0.05));
    if ((1 + 0.05) / (luminance + 0.05) <= 3.5) {
        textColor = 'black';
    } else {
        textColor = 'white';
    }

    var colorElement = $(`<div class="col-6 p-1"><button class="w-100 p-2 border border-0 rounded text-truncate" style="background-color: ${hexStr}; color: ${textColor}; font-size: 0.8rem;" data-hex=${hexStr.substr(1).toUpperCase()}>${hexStr}</button></div>`);
    $('#savedColorsRegion').append(colorElement);
    colorElement.on('click', function () {
        var hex = $(this).find('button').attr('data-hex');
        var rgbObj = utilities.hexToRgb(hex);
        setRGBSliders({ rgbObj: rgbObj });
        setColorFromRGB(rgbObj);
        $('.backdrop').click();
    });
}















// //////////////////>>>>>>>>>>>>>>>>
var hTextValid = false;
var sTextValid = false;
var vTextValid = false;

var hsvTextValid = false;

var rTextValid = false;
var gTextValid = false;
var bTextValid = false;

var rgbTextValid = false;

var hexTextValid = false;
// //////////////////<<<<<<<<<<<<<<<<



var colorObj = {};

function start() {
    var hsvObj = {
        h: 0,
        s: 0,
        v: 0
    }
    setHSVSliders({ hsvObj: hsvObj });
    setColorFromHSV(hsvObj);
    fs.readFile('./colors.txt', 'utf-8', function (err, data) {
        savedColors = data.split(',').filter(curr => {
            if (curr.length === 0) {
                return false
            }
            return true;
        });
        savedColors.forEach(curr => {
            appendSavedColor(curr);
        });
    });
}
start();



//on('change input'); change for click, input for slide
$('#hSlider, #sSlider, #vSlider').on('input', gatherHSVData);
function gatherHSVData() {
    var hsvObj = {
        h: Number($('#hSlider').val()),
        s: Number($('#sSlider').val()),
        v: Number($('#vSlider').val())
    }
    setColorFromHSV(hsvObj);
}
$('#hSlider').on('input', function () {
    var hsvObj = {
        h: Number($(this).val()),
        s: 100,
        v: 100
    }
    var rgbObj = utilities.hsvToRgb(hsvObj);
    $('.custom-range').css('--satcolor', rgbObj.rgbStr);
});
$('#vSlider').on('input', function () {
    if ($('#vSlider').val() <= savebuttoncolorchange) {
        $('#savebutton').removeClass('btn-dark');
    } else {
        $('#savebutton').addClass('btn-dark');
    }
});

$('#rSlider, #gSlider, #bSlider').on('input', gatherRGBData);
function gatherRGBData() {
    var rgbObj = {
        r: Number($('#rSlider').val()),
        g: Number($('#gSlider').val()),
        b: Number($('#bSlider').val())
    }
    setColorFromRGB(rgbObj);
}
function setColorFromHSV(hsvObj) {
    hsvObj.hsvStr = `hsv(${hsvObj.h}, ${hsvObj.s}%, ${hsvObj.v}%)`
    colorObj.hsvObj = hsvObj;
    colorObj.rgbObj = utilities.hsvToRgb(hsvObj);
    colorObj.hexStr = utilities.rgbToHex(colorObj.rgbObj);
    setRGBSliders(colorObj);
    setUI(colorObj);
}
function setColorFromRGB(rgbObj) {
    rgbObj.rgbStr = `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`
    colorObj.rgbObj = rgbObj;
    colorObj.hsvObj = utilities.rgbToHsv(rgbObj);
    colorObj.hexStr = utilities.rgbToHex(rgbObj);
    setHSVSliders(colorObj);
    setUI(colorObj);
}
function setHSVSliders(colorObj) {
    $('#hSlider').val(colorObj.hsvObj.h);
    $('#sSlider').val(colorObj.hsvObj.s);
    $('#vSlider').val(colorObj.hsvObj.v);

    var hsvObj = {
        h: colorObj.hsvObj.h,
        s: 100,
        v: 100
    }
    var rgbObj = utilities.hsvToRgb(hsvObj);
    $('.custom-range').css('--satcolor', rgbObj.rgbStr);

    if (colorObj.hsvObj.v <= savebuttoncolorchange) {
        $('#savebutton').removeClass('btn-dark');
    } else {
        $('#savebutton').addClass('btn-dark');
    }
}
function setRGBSliders(colorObj) {
    $('#rSlider').val(colorObj.rgbObj.r);
    $('#gSlider').val(colorObj.rgbObj.g);
    $('#bSlider').val(colorObj.rgbObj.b);
}

function setUI(colorObj) {
    setHSVLabels(colorObj);
    setRGBLabels(colorObj);
    //////////////////>>>>>>>>>>>>>>>>
    hTextValid = true;
    sTextValid = true;
    vTextValid = true;
    hsvTextValid = true;
    setHSVText(colorObj);

    rTextValid = true;
    gTextValid = true;
    bTextValid = true;
    rgbTextValid = true;
    setRGBText(colorObj);

    hexTextValid = true;
    setHEXText(colorObj);
    //////////////////<<<<<<<<<<<<<<<<
    $('#labelHSV').val(colorObj.hsvObj.hsvStr);
    $('#labelRGB').val(colorObj.rgbObj.rgbStr);
    $('#labelHEX').val(colorObj.hexStr.toUpperCase());

    $('#colorDisplay').css('background-color', colorObj.rgbObj.rgbStr);
}

function setHSVLabels(colorObj) {
    $('#hLabel').html(colorObj.hsvObj.h + '&deg;');
    $('#sLabel').text(colorObj.hsvObj.s + '%');
    $('#vLabel').text(colorObj.hsvObj.v + '%');


}
function setRGBLabels(colorObj) {
    $('#rLabel').text(colorObj.rgbObj.r);
    $('#gLabel').text(colorObj.rgbObj.g);
    $('#bLabel').text(colorObj.rgbObj.b);
}

function setHSVText(colorObj) {
    $('#hText').val(colorObj.hsvObj.h);
    $('#sText').val(colorObj.hsvObj.s);
    $('#vText').val(colorObj.hsvObj.v);
    $('#hsvText').val(colorObj.hsvObj.h + ', ' + colorObj.hsvObj.s + ', ' + colorObj.hsvObj.v);
    $('#hsvSplitGo').attr('disabled', false);

    $('#hsvText').attr('data-h', colorObj.hsvObj.h);
    $('#hsvText').attr('data-s', colorObj.hsvObj.s);
    $('#hsvText').attr('data-v', colorObj.hsvObj.v);
    $('#hsvFullGo').attr('disabled', false);
}
function setRGBText(colorObj) {
    $('#rText').val(colorObj.rgbObj.r);
    $('#gText').val(colorObj.rgbObj.g);
    $('#bText').val(colorObj.rgbObj.b);
    $('#rgbText').val(colorObj.rgbObj.rgbStr);
    $('#rgbSplitGo').attr('disabled', false);

    $('#rgbText').attr('data-r', colorObj.rgbObj.r);
    $('#rgbText').attr('data-g', colorObj.rgbObj.g);
    $('#rgbText').attr('data-b', colorObj.rgbObj.b);
    $('#rgbFullGo').attr('disabled', false);
}
function setHEXText(colorObj) {
    $('#hexText').val(colorObj.hexStr.toUpperCase());
    $('#hexText').attr('data-hex', colorObj.hexStr.substr(1).toUpperCase());
    $('#hexFullGo').attr('disabled', false);
}




$('#copyHSV').on('click', function () {
    $('#labelHSV').select();
    $(this).tooltip('show');
    setTimeout(() => {
        $('#copyHSV').tooltip('hide');
    }, 600);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
});
$('#copyRGB').on('click', function () {
    $('#labelRGB').select();
    $(this).tooltip('show');
    setTimeout(() => {
        $('#copyRGB').tooltip('hide');
    }, 600);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
});
$('#copyHEX').on('click', function () {
    $('#labelHEX').select();
    $(this).tooltip('show');
    setTimeout(() => {
        $('#copyHEX').tooltip('hide');
    }, 600);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
});

$('input[type="text"]').on('focus', function (e) {
    e.target.select();
});






















$('#hText, #sText, #vText').on('input', function () {
    switch (this.id) {
        case 'hText':
            hTextValid = checkValueHue(this.value);
            break;
        case 'sText':
            sTextValid = checkValueSatVal(this.value);
            break;
        case 'vText':
            vTextValid = checkValueSatVal(this.value);
            break;
    }

    if (hTextValid && sTextValid && vTextValid) {
        $('#hsvSplitGo').attr('disabled', false);
    } else {
        $('#hsvSplitGo').attr('disabled', true);
    }
});
function checkValueHue(value) {
    value = value.trim();
    return value.length > 0 && Number(value) >= 0 && Number(value) <= 360 && value.search(/[a-z]/gi) == -1;
}
function checkValueSatVal(value) {
    value = value.trim();
    return value.length > 0 && Number(value) >= 0 && Number(value) <= 100 && value.search(/[a-z]/gi) == -1;
}
$('#hsvSplitGo').on('click', function () {
    var hsvObj = {
        h: Number($('#hText').val()),
        s: Number($('#sText').val()),
        v: Number($('#vText').val())
    }
    setHSVSliders({ hsvObj: hsvObj });
    setColorFromHSV(hsvObj);
});


$('#hsvText').on('input', function () {
    hsvTextValid = checkValueFullHSV(this.value);

    if (hsvTextValid) {
        $('#hsvFullGo').attr('disabled', false);
    } else {
        $('#hsvFullGo').attr('disabled', true);
    }
});
function checkValueFullHSV(value) {
    var valueArr = value.split(',');
    if (valueArr.length !== 3) {
        return false;
    }
    var h = valueArr[0];
    var s = valueArr[1];
    var v = valueArr[2];

    if (checkValueHue(h) && checkValueSatVal(s) && checkValueSatVal(v)) {
        $('#hsvText').attr('data-h', h);
        $('#hsvText').attr('data-s', s);
        $('#hsvText').attr('data-v', v);
        return true;
    } else {
        return false;
    }
}
$('#hsvFullGo').on('click', function () {
    var hsvObj = {
        h: Number($('#hsvText').attr('data-h')),
        s: Number($('#hsvText').attr('data-s')),
        v: Number($('#hsvText').attr('data-v'))
    }
    $('#hsvText').removeAttr('data-h');
    $('#hsvText').removeAttr('data-s');
    $('#hsvText').removeAttr('data-v');
    setHSVSliders({ hsvObj: hsvObj });
    setColorFromHSV(hsvObj);
});









$('#rText, #gText, #bText').on('input', function () {
    switch (this.id) {
        case 'rText':
            rTextValid = checkValueRGB(this.value);
            break;
        case 'gText':
            gTextValid = checkValueRGB(this.value);
            break;
        case 'bText':
            bTextValid = checkValueRGB(this.value);
            break;
    }

    if (rTextValid && gTextValid && bTextValid) {
        $('#rgbSplitGo').attr('disabled', false);
    } else {
        $('#rgbSplitGo').attr('disabled', true);
    }
});
$('#rgbSplitGo').on('click', function () {
    var rgbObj = {
        r: Number($('#rText').val()),
        g: Number($('#gText').val()),
        b: Number($('#bText').val())
    }
    setRGBSliders({ rgbObj: rgbObj });
    setColorFromRGB(rgbObj);

});
function checkValueRGB(value) {
    value = value.trim();
    return value.length > 0 && Number(value) >= 0 && Number(value) <= 255 && value.search(/[a-z]/gi) == -1;
}


$('#rgbText').on('input', function () {
    rgbTextValid = checkValueFullRGB(this.value);

    if (rgbTextValid) {
        $('#rgbFullGo').attr('disabled', false);
    } else {
        $('#rgbFullGo').attr('disabled', true);
    }
});
function checkValueFullRGB(value) {
    value = value.trim();
    if (value.indexOf('rgb(') === 0 && value.indexOf(')') === value.length - 1) {
        value = value.substring(4, value.length - 1);
    }

    var rgbArr = value.split(',');
    if (rgbArr.length !== 3) {
        return false;
    }
    var r = rgbArr[0].trim();
    var g = rgbArr[1].trim();
    var b = rgbArr[2].trim();

    if (checkValueRGB(r) && checkValueRGB(g) && checkValueRGB(b)) {
        $('#rgbText').attr('data-r', r);
        $('#rgbText').attr('data-g', g);
        $('#rgbText').attr('data-b', b);
        return true;
    } else {
        return false;
    }

}
$('#rgbFullGo').on('click', function () {
    var r = Number($('#rgbText').attr('data-r'));
    var g = Number($('#rgbText').attr('data-g'));
    var b = Number($('#rgbText').attr('data-b'));

    var rgbObj = {
        r: r,
        g: g,
        b: b
    };
    setRGBSliders({ rgbObj: rgbObj });
    setColorFromRGB(rgbObj);
});







$('#hexText').on('input', function () {
    hexTextValid = checkValueHEX(this.value);

    if (hexTextValid) {
        $('#hexFullGo').attr('disabled', false);
    } else {
        $('#hexFullGo').attr('disabled', true);
    }
});
function checkValueHEX(value) {
    value = value.trim();
    // if length is 4 or 7
    // // ONE (#) must be present at START of string
    if (value.length === 4 || value.length === 7) {
        if (value.match(/#/gi)) {
            if (value.match(/#/gi).length > 1) {
                return false;
            }
        } else {
            return false;
        }
        value = value.substr(1);
    }
    // hex string can be 3 OR 6 chars long
    // // it must only contain 0-9 and a-f (because (#) was previously removed)
    if ((value.length === 3 || value.length === 6) && value.search(/[^0-9a-f]/gi) < 0) {
        $('#hexText').attr('data-hex', value);
        return true;
    } else {
        return false;
    }
}
$('#hexFullGo').on('click', function () {
    var hex = $('#hexText').attr('data-hex');
    $('#hexText').removeAttr('data-hex');
    var rgbObj = utilities.hexToRgb(hex);
    setRGBSliders({ rgbObj: rgbObj });
    setColorFromRGB(rgbObj);
});
// //////////////////<<<<<<<<<<<<<<<<













$('.buttonAsideNav').on('click', function () {
    $('.backdrop').css('--zindex', '99');
    $('#asideNav').toggleClass('d-none');
    $('#mainContent').toggleClass('open');
    $('.backdrop').toggleClass('d-none');

    $('#asideList').addClass('d-none');
});
$('.buttonAsideList').on('click', function () {
    $('#asideList').toggleClass('d-none');
    $('#mainContent').toggleClass('open');
    $('.backdrop').css('--zindex', '105');
    $('.backdrop').toggleClass('d-none');

    $('#asideNav').addClass('d-none');
});
$('.backdrop').on('click', function () {
    $(this).addClass('d-none');
    $(this).css('--zindex, 99');
    $('#asideNav').addClass('d-none');
    $('#asideList').addClass('d-none');
    $('#mainContent').removeClass('open');
});


$('#switchSliders').on('click', function () {
    $('.slidersection').toggleClass('sectionslid');
});
$('#switchHSV').on('click', function () {
    $('.hsvsection').toggleClass('sectionslid');
});
$('#switchRGB').on('click', function () {
    $('.rgbsection').toggleClass('sectionslid');
});


// $(window).resize(function (e) {
//     // console.log(e.target.innerWidth);
//     if (e.target.innerWidth >= 768) {
//         $('.backdrop').addClass('d-none');
//         $('.backdrop').css('--zindex, 99');

//         $('#asideNav').addClass('d-none');
//         $('#asideList').addClass('d-none');

//         $('#mainContent').removeClass('open');
//     }
//     if (e.target.innerWidth >= 1200) {

//     }
// });


$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});