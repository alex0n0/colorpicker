const utilities = require('./utilities.js');
const fs = require('fs-extra');







var difficulty = 'difficulty3';
var easyMode = false;
var rangeOfError = 10;

var rounds;
var correctCount;
var roundCount;
var answerHsvObj = { h: 0, s: 0, v: 0, hMin: 0, hMax: 0, sMin: 0, sMax: 0, vMin: 0, vMax: 0 };









var savebuttoncolorchange = 40;
var savedColors = [];



$('#savebutton').on('click', function () {
    // var color = colorObj.hexStr.toUpperCase();
    var rgbObj = utilities.hsvToRgb(answerHsvObj);
    var color = utilities.rgbToHex(rgbObj);
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
        setColorFromRGB(rgbObj);
        $('.backdrop').click();
    });
}















// //////////////////>>>>>>>>>>>>>>>>
var hTextValid = false;
var sTextValid = false;
var vTextValid = false;

var hsvTextValid = false;
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
function gatherHSVData(e) {
    var hsvObj = {
        h: Number($('#hSlider').val()),
        s: Number($('#sSlider').val()),
        v: Number($('#vSlider').val())
    }
    setColorFromHSV(hsvObj);
    if (easyMode) {
        checkWithinRange(e.target.id, colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v);
    }
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

function setColorFromHSV(hsvObj) {
    hsvObj.hsvStr = `hsv(${hsvObj.h}, ${hsvObj.s}%, ${hsvObj.v}%)`
    colorObj.hsvObj = hsvObj;
    colorObj.rgbObj = utilities.hsvToRgb(hsvObj);
    colorObj.hexStr = utilities.rgbToHex(colorObj.rgbObj);
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
    if (easyMode) {
        checkWithinRange('hSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v);
        checkWithinRange('sSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v);
        checkWithinRange('vSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v);
    }
}


function setUI(colorObj) {
    setHSVLabels(colorObj);
    //////////////////>>>>>>>>>>>>>>>>
    hTextValid = true;
    sTextValid = true;
    vTextValid = true;
    hsvTextValid = true;
    setHSVText(colorObj);
    setRGBText(colorObj);
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
    $('#rgbText').val(colorObj.rgbObj.rgbStr);

}
function setHEXText(colorObj) {
    $('#hexText').val(colorObj.hexStr.toUpperCase());
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



$('#switchHSV').on('click', function () {
    $('.hsvsection').toggleClass('sectionslid');
});



$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});















loadPage();
function loadPage() {
    rounds = undefined;
    correctCount = undefined;
    roundCount = undefined;
    $('#mainStart').removeClass('d-none');
    $('#mainGame').addClass('d-none');
    $('#mainEnd').addClass('d-none');
    $('#roundsInput').val('10')

    startRadios(difficulty);
    $('#windowMessage').text(`::`);
}

$('#difficulty1, #difficulty2, #difficulty3').on('change', function (e) {
    difficulty = e.target.id;
    startRadios(difficulty);
});
function startRadios(target) {
    var message = 'error message';
    switch (target) {
        case 'difficulty1':
            message = "hue only";
            easyMode = true;
            rangeOfError = 10;
            break;
        case 'difficulty2':
            message = "hue and saturation";
            easyMode = true;
            rangeOfError = 5;
            break;
        case 'difficulty3':
            message = "hue, saturation and value";
            easyMode = false;
            rangeOfError = 15;
            break;
    }
    $('#difficultyMessage').text(message);
}

$('#startForm').on('submit', function (e) {
    e.preventDefault();
    rounds = Number($('#roundsInput').val());
    correctCount = 0;
    roundCount = 0;
    $('#mainStart').addClass('d-none');
    $('#mainGame').removeClass('d-none');
    loadRound();
});

function loadRound() {
    roundCount++;
    var hsvObj = {
        h: 0,
        s: 0,
        v: 0
    }
    setHSVSliders({ hsvObj: hsvObj });
    setColorFromHSV(hsvObj);

    $('#windowMessage').text(`::Correct: ${correctCount}/${roundCount - 1} | Round: ${roundCount}/${rounds}`);

    if (easyMode) {
        $('#hSlider').addClass('hue');
        $('#sSlider').addClass('sat');
        $('#vSlider').addClass('val');
    } else {
        $('#hSlider').removeClass('hue');
        $('#sSlider').removeClass('sat');
        $('#vSlider').removeClass('val');
    }

    answerHsvObj.h = Math.round(Math.random() * 360);
    answerHsvObj.s = Math.round(Math.random() * 100);
    answerHsvObj.v = Math.round(Math.random() * 75) + 25;

    answerHsvObj.hMin = answerHsvObj.h - rangeOfError;
    answerHsvObj.hMax = answerHsvObj.h + rangeOfError;
    answerHsvObj.sMin = answerHsvObj.s - rangeOfError < 0 ? 0 : answerHsvObj.s - rangeOfError;
    answerHsvObj.sMax = answerHsvObj.s + rangeOfError > 100 ? 100 : answerHsvObj.s + rangeOfError;
    answerHsvObj.vMin = answerHsvObj.v - rangeOfError < 0 ? 0 : answerHsvObj.v - rangeOfError;
    answerHsvObj.vMax = answerHsvObj.v + rangeOfError > 100 ? 100 : answerHsvObj.v + rangeOfError;

    $('#hueSuccess').addClass('d-none');
    $('#satSuccess').addClass('d-none');
    $('#valSuccess').addClass('d-none');

    checkWithinRange('hSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v);
    checkWithinRange('sSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v);
    checkWithinRange('vSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v);

    var rgbObj = utilities.hsvToRgb(answerHsvObj);
    $('#windowMessage').text($('#windowMessage').text() + '| H:' + answerHsvObj.h + ' S:' + answerHsvObj.s + ' V:' + answerHsvObj.v);

    $('#divColorAnswer').css('background-color', rgbObj.rgbStr);
}

$('#roundSubmit').on('click', function () {
    if (checkWithinRange('hSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v)
        && checkWithinRange('sSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v)
        && checkWithinRange('vSlider', colorObj.hsvObj.h, colorObj.hsvObj.s, colorObj.hsvObj.v)) {
        correctCount++;
    }


    if (roundCount === rounds) {
        loadEnd();
    } else {
        loadRound();
    }
});

$('#roundQuit').on('click', function () {
    loadPage();
});

function loadEnd() {
    $('#windowMessage').text(`::Correct: ${correctCount}/${roundCount} | Round: ${roundCount}/${rounds}`);
    $('#mainGame').addClass('d-none');
    $('#mainEnd').removeClass('d-none');
    $('#endTally').text(`${correctCount}/${roundCount}`);
    $('#endPercentage').text(`${Math.round((correctCount / roundCount) * 100)} %`);

    fs.appendFile('./scores.txt', `,${Math.round((correctCount / roundCount) * 100)}`, function (err) {
        if (err) { throw err };
        // console.log('Updated!');
    });
}

$('#roundsDone').on('click', function () {
    $('#mainStart').removeClass('d-none');
    $('#mainGame').addClass('d-none');
    $('#mainEnd').addClass('d-none');
    loadPage();
});















// // only in easy mode
function checkWithinRange(id, hue, sat, val) {
    switch (id) {
        case 'hSlider':
            if (answerHsvObj.hMin < 0) {
                if ((hue >= 0 && hue <= answerHsvObj.hMax) || (hue >= 360 + answerHsvObj.hMin && hue <= 360)) {
                    if (easyMode) {
                        $('#hueSuccess').removeClass('d-none');
                    }
                    return true;
                } else {
                    $('#hueSuccess').addClass('d-none');
                    return false;
                }
            } else if (answerHsvObj.hMax > 360) {
                if ((hue >= answerHsvObj.hMin && hue <= 360) || (hue >= 0 && hue <= answerHsvObj.hMax - 360)) {
                    if (easyMode) {
                        $('#hueSuccess').removeClass('d-none');
                    }
                    return true;
                } else {
                    $('#hueSuccess').addClass('d-none');
                    return false;
                }
            } else {
                if (hue >= answerHsvObj.hMin && hue <= answerHsvObj.hMax) {
                    if (easyMode) {
                        $('#hueSuccess').removeClass('d-none');
                    }
                    return true;
                } else {
                    $('#hueSuccess').addClass('d-none');
                    return false;
                }
            }
        case 'sSlider':
            if (sat >= answerHsvObj.sMin && sat <= answerHsvObj.sMax) {
                if (easyMode) {
                    $('#satSuccess').removeClass('d-none');
                }
                return true;
            } else {
                $('#satSuccess').addClass('d-none');
                return false;
            }
        case 'vSlider':
            if (val >= answerHsvObj.vMin && val <= answerHsvObj.vMax) {
                if (easyMode) {
                    $('#valSuccess').removeClass('d-none');
                }
                return true;
            } else {
                $('#valSuccess').addClass('d-none');
                return false;
            }
    }
}