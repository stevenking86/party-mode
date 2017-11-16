function setChart() {
  var chartEl = document.getElementById("myChart")
  chartEl.setAttribute('data-built', 'true')
  var ctx = chartEl.getContext('2d');

  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["Volume", "Highs", "Mids", "Bass"],
          datasets: [{
              label: 'Average Global Listener Values',
              data: [
                setVols(),
                setHighs(),
                setMids(),
                setBass()
                ],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}

function setVols() {
  var volumes = allData.map(function(obj) {
    return obj.vol
  });

  volumes = volumes.filter(function( element ) {
    return element !== undefined;
  });

  var volumeSum = volumes.reduce(function(a, b) { return a + b; });
  var avg = volumeSum / volumes.length;

  return Math.floor(avg)
}

function setBass() {
  var bass = allData.map(function(obj) {
    return obj.bass
  });

  bass = bass.filter(function( element ) {
    return element !== undefined;
  });

  var bassSum = bass.reduce(function(a, b) { return a + b; });
  var avg = bassSum / bass.length;

  return Math.floor(avg)
}

function setMids() {
  var mids = allData.map(function(obj) {
    return obj.mids
  });

  mids = mids.filter(function( element ) {
    return element !== undefined;
  });

  var midsSum = mids.reduce(function(a, b) { return a + b; });
  var avg = midsSum / mids.length;

  return Math.floor(avg)
}

function setHighs() {
  var highs = allData.map(function(obj) {
    return obj.highs
  });

  highs = highs.filter(function( element ) {
    return element !== undefined;
  });

  var highsSum = highs.reduce(function(a, b) { return a + b; });
  var avg = highsSum / highs.length;

  return Math.floor(avg)
}
