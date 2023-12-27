$(document).ready(function () {
  function createChart(dataLabel, dataValue, chart, label) {
    var maxWidth = 360 / dataValue.length;
    var maxValue = Number(String(Math.max(...dataValue)).charAt(0)) * Math.pow(10, String(Math.max(...dataValue)).length - 1);
  
    const data = {
      type: "bar",
      data: {
        labels: dataLabel,
        datasets: [
          {
            label: label,
            data: dataValue,
            borderWidth: 1,
            barThickness: maxWidth,
          }
        ],
      },
      options: {
        scales: {
          y: {
            suggestedMax: maxValue,
            beginAtZero: true,
            ticks: {
              stepSize: Math.ceil(maxValue * 0.1)
            }
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
            response.bill,
            "statistic-element-1",
            "bills"
          );
          createChart(
            response.month,
            response.revenue,
            "statistic-element-2",
            "$"
          );
          createChart(
            response.month,
            response.product,
            "statistic-element-3",
            "products"
          );
        }
    });
  }
  
  showStatistic();

  $("canvas").hide();
  $("#statistic-element-1").show();

  $("#show-bill-statistic").click(function() {
    $("canvas").hide();
    $("#statistic-element-1").show();
  });

  $("#show-revenue-statistic").click(function() {
    $("canvas").hide();
    $("#statistic-element-2").show();
  });

  $("#show-product-statistic").click(function() {
    $("canvas").hide();
    $("#statistic-element-3").show();
  });
});