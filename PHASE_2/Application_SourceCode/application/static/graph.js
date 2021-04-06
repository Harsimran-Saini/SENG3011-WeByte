
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function getRandomNumbers(min, max, size) {
    var currTime = moment().startOf('day').add();
    console.log(currTime);
    return [{x:currTime, y:0}];
}

const data = {
  datasets: [
      {
        label: 'COVID Cases',
        borderColor: 'rgb(255, 99, 132)',
        data: getRandomNumbers(0, 100, 12),
        fill: false,
        tension: 0
      },
     {
        label: 'COVID Related Articles',
        borderColor: 'rgb(0, 99, 132)',
        data: getRandomNumbers(0, 100, 12),
        fill: false,
        tension: 0
      },

  ]
};

const config = {
    type: 'line',
    data: data,
//    options: {
//        scales: {
//            x: {
//                type: 'timeseries',
//            }
//        }
//    }
};

var ctx = document.getElementById('stockChart').getContext('2d');
ctx.canvas.width = window.innerWidth*(3/4);
ctx.canvas.height = window.innerHeight*(1/3);
lineChart = new Chart(ctx, config);
