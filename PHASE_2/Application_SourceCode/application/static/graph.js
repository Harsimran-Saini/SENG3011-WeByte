const labels = [
  "Jan 20'",
  "February 20'",
  "March 20'",
  "April 20'",
  "May 20'",
  "June 20'",
  "July 20'",
  "August 20'",
  "September 20'",
  "October 20'",
  "November 20'",
  "December 20'"
];

function getRandomNumber(min, max) {
    return Math.floor((Math.random() * (max-min)) + min);
}

function getRandomNumbers(min, max, size) {
    numbers = [];

    for (var i=0; i<size; i++) {
        numbers.push(getRandomNumber(min, max))
    }

    return numbers;
}

const data = {
  labels: labels,
  datasets: [
      {
        label: 'COVID Cases',
//        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: getRandomNumbers(0, 100, 12),
        fill: false,
        tension: 0
      },
     {
        label: 'COVID Related Articles',
//        backgroundColor: 'rgb(255, 99, 132)',
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
  options: {
      responsive: true,
  }
};

var ctx = document.getElementById('stockChart').getContext('2d');
ctx.canvas.width = window.innerWidth*(3/4);
ctx.canvas.height = window.innerHeight*(1/3);
lineChart = new Chart(ctx, config);
