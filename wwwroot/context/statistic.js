function createChart(dataLabel, dataValue, chart, label) {
  var maxWidth = 120 / dataValue.length;
  var maxValue = Math.max(...dataValue) + 5;

  const data = {
    type: "bar",
    data: {
      labels: dataLabel,
      datasets: [
        {
          label: "bills",
          data: dataValue[0],
          borderWidth: 1,
          barThickness: maxWidth,
        },
        {
          label: "$",
          data: dataValue[1],
          borderWidth: 1,
          barThickness: maxWidth,
        },
        {
          label: "product",
          data: dataValue[2],
          borderWidth: 1,
          barThickness: maxWidth,
        },
      ],
    },
    options: {
      scales: {
        y: {
          suggestedMax: maxValue,
          beginAtZero: true,
        },
      },
    },
  };

  new Chart(document.getElementById(chart), data);
}

function showStatistic() {
  $.ajax({
      url: "/SellerInfoSeller/GetValueForStatistics",
      data: {
          year: 2023
      },
      datatype: "json",
      success: function (response) {
        createChart(
          response.month,
          [response.bill, response.revenue, response.product],
          "statistic-element",
          "count"
        );
      }
  });
}

showStatistic();