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
                setSoundCategory('vol'),
                setSoundCategory('bass'),
                setSoundCategory('mids'),
                setSoundCategory('highs')
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

function setSoundCategory(soundCategory) {
  var data = s3Data.map(function(obj) {
    return obj[soundCategory];
  });

  data = data.filter(function(element) {
    return element !== undefined;
  });

  if (data.length) {
    var sum = data.reduce(function(a, b) { return a + b });
    var avg = sum / data.length;

    return Math.floor(avg);
  }

  return
}
