function adjustHue(lightType, dataPoint) {
    var hueMap, max, min;

    hueMap = {
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

    max = hueMap[lightType].max;
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
    var body, headers, hue, hueAuth, hueIp, hueUrl, request, sat, url

    hue = adjustHue(lightType, dataPoint);
    sat = adjustSaturation(volume);

    hueIp = document.getElementById("hueIP").value;
    hueAuth = "UP5z1ZV45PMbMEgtTmeSKrahFyQ8C1Jbs98L2ADp";
    hueUrl = "http://" + hueIp + "/api/" + hueAuth;

    url = hueUrl + "/lights/" + lightNum + "/state";
    body = {
        hue: hue,
        sat: sat,
        transitiontime: transitiontime
    };

    headers = new Headers();
    headers.append("Content-Type", "application/json");

    request = new Request(url, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: headers
    });

    fetch(request).then(function (res) {
        // console.log(res);
    }, function(error) {
        // console.log(error);
    });
}


