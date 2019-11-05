const utilities = require('./utilities.js');
const fs = require('fs-extra');

var scoresArr = [];
// var p = path.join(__dirname, '../../data/scores.txt');
// fs.readFile(p, 'utf8', function (err, data) {
fs.readFile('./scores.txt', 'utf8', function (err, data) {
    if (err) { throw err }
    stringArr = data.substr(1).split(',');
    stringArr.splice(2, 0, NaN);
    stringArr.splice(7, 0, NaN);
    scoresArr = stringArr.map((currVal, i, arr) => {
        return { x: i + 1, y: Number(currVal) };
    });



    var ctx = document.getElementById('myChart').getContext('2d');

    var gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, "rgba(240, 188, 32, 0.6)");
    gradientFill.addColorStop(1, "rgba(190, 42, 202, 0.8)");
    
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: scoresArr.map((currVal, i) => {
                return currVal.x;
            }),
            datasets: [{
                label: 'Scores',
                data: scoresArr,
                // lineTension: 0,
                
                backgroundColor: gradientFill,
                borderColor: 'rgb(230, 230, 230)',

                pointRadius: 4,
                pointBorderWidth: 2,
                pointBackgroundColor: 'rgb(83, 33, 141)',
                pointBorderColor: 'rgb(230, 230, 230)',

                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                cubicInterpolationMode: 'monotone',

                spanGaps: false
            }],

        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        stepSize: 1
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100
                    }
                }]
            }
        }
    });
});





var savedColors = [];



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
}


function start() {
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