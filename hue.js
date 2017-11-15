var hueAuth;

hueAuth = "UP5z1ZV45PMbMEgtTmeSKrahFyQ8C1Jbs98L2ADp";

function getNumLights(hueIp, numLights, callback) {
    var headers, hueUrl, request, url;

    if (numLights) {
        callback(numLights);
    } else {
        requestNumLights(hueIp, function (lights) {
            callback(lights);
        });
    }
}

function requestNumLights(hueIp, callback) {
    hueUrl = "http://" + hueIp + "/api/" + hueAuth;
    url = hueUrl + "/lights/";

    headers = new Headers();
    headers.append("Content-Type", "application/json");

    request = new Request(url, {
        method: "GET",
        headers: headers
    });

    fetch(request).then(function (res) {
        res.json().then(function (data) {
            callback(Object.keys(data).length);
        });
    }, function(error) {
        if (error) {
            console.log(error);
        }
    });
}

function calculateHue(lightType, dataPoint) {
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

function calculateSaturation(volume) {
    return Math.round(volume / 150 * (200 - 25) + 25);
}

function calculateTransitionTime(volume) {
    if (volume >= 85) {
        volume = 85;
    }

    return Math.round(25 - volume / 85 * 25);
}

// Y = (X-A)/(B-A) * (D-C) + C
// Saturation Range: 25 (most saturated) to 200 (white)
// Hue range: 0 to 65535

function updateLight(lightType, lightNum, dataPoint, volume, hueIp) {
    var body, headers, hue, hueUrl, request, sat, transitionTime, url;

    hue = calculateHue(lightType, dataPoint);
    sat = calculateSaturation(volume);
    transitionTime = calculateTransitionTime(volume);

    hueUrl = "http://" + hueIp + "/api/" + hueAuth;
    url = hueUrl + "/lights/" + lightNum + "/state";
    body = {
        hue: hue,
        sat: sat,
        transitiontime: transitionTime
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
        console.log(error);
    });
}


