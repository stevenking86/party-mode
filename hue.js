var hueIp = "192.168.1.52"
var hueAuth = 'UP5z1ZV45PMbMEgtTmeSKrahFyQ8C1Jbs98L2ADp';
var hueUrl = "http://" + hueIp + "/api/" + hueAuth;

function generateData() {
    var bass = Math.floor(Math.random() * (60 - 10 + 1)) + 10,
        highs = Math.floor(Math.random() * (60 - 10 + 1)) + 10,
        mids = Math.floor(Math.random() * (60 - 10 + 1)) + 10,
        volume = Math.floor(Math.random() * 150);

    return {
        bass,
        highs,
        mids,
        volume
    };
}

function adjustHue(lightType, dataPoint) {
    var hueMap = {
        bass: {
            min: 0,
            max: 18000
        },
        mids: {
            min: 0,
            max: 65535
        },
        highs: {
            min: 30000,
            max: 58000
        }
    };

    var max = hueMap[lightType].max,
        min = hueMap[lightType].min;

    return Math.round((dataPoint - 10) / (60 - 10) * (max - min) + min);
}

function adjustSaturation(volume) {
    return Math.round(volume / 150 * (200 - 25) + 25);
}

// Y = (X-A)/(B-A) * (D-C) + C
// Saturation Range: 25 (most saturated) to 200 (white)
// Hue range: 0 to 65535

function updateLight(lightType, lightNum, dataPoint, volume, transitiontime) {
    var hue = adjustHue(lightType, dataPoint),
        sat = adjustSaturation(volume);

    // var hueIp = "192.168.1.52"
    var hueIp = document.getElementById('hueIP').value
    var hueAuth = 'UP5z1ZV45PMbMEgtTmeSKrahFyQ8C1Jbs98L2ADp';
    var hueUrl = "http://" + hueIp + "/api/" + hueAuth;

    var url = hueUrl + "/lights/" + lightNum + "/state"
    var body = {
        hue: hue,
        sat: sat,
        transitiontime: transitiontime
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
// }

    var request = new Request(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: myHeaders
    })

    fetch(request).then(function (res) {
        // console.log(res);
    }, function(error) {
        // console.log(error);
    })
}


