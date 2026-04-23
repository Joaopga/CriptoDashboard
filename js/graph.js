import { req } from "./api.js";
import { dateErr } from "./main.js";

export async function CallAPI(coinName, dateCalc) {
  let promises = [];

  for (let i = 0; i < coinName.length; i++) {
    promises.push(req(coinName[i], dateCalc));
  }
  let APIdata = await Promise.all(promises);
  
  bulildGraph(coinName, APIdata, dateCalc);
}

function variVal(APIdata, dateCalc) {
  let varDia;
  let varTotal = [];

  for (let i = 0; i < APIdata.length; i++) {
    varDia =
      parseFloat(APIdata[i][dateCalc - 1][4]) - parseFloat(APIdata[i][0][4]);
    varDia = (varDia / parseFloat(APIdata[i][0][4])) * 100;
    varTotal.push(varDia.toFixed(2));
  }

  return varTotal;
}

function calcVol(APIdata, dateCalc) {
  let dia;
  let volDia;
  let volTotal = [];

  for (let i = 0; i < APIdata.length; i++) {
    dia = 0;
    volDia = 0;

    do {
      volDia += parseFloat(APIdata[i][dia][5]);
      dia++;
    } while (dia < dateCalc);

    volTotal.push(volDia.toFixed(2));
  }

  return volTotal;
}

let lineChart, barChart, doughnutChar; // Declaro como global para apagar em caso de nova req
function bulildGraph(coinName, APIdata, dateCalc) {
 
  // Validacao de moeda digitada de forma incorreta
  for(let i = 0; i < APIdata.length; i++) {
    if (APIdata[i] === "Failed to fetch") {
      const coins = document.getElementsByClassName("coin_symbol");
      coins[i].style.animationDuration = '1200ms'
      coins[i].style.animationName = 'errorAdvice'
      coins[i].style.backgroundColor= '#ff5b5b'

      dateErr(2);
      return;
    }
  };

  const titles = [
     document.querySelector(".lineGraph"),
     document.querySelector(".barGraph"),
     document.querySelector(".doughNut")
    ]
  //Removendo 'Hidden' dos títulos
  titles.forEach((titles) => {
    titles.classList.remove("hidden");
    console.log(titles)
  });

  if (lineChart) lineChart.destroy();
  if (barChart) barChart.destroy();
  if (doughnutChar) doughnutChar.destroy();

  const barGraph = document.getElementById("barGraph").getContext("2d");
  const doughnut = document.getElementById("doughnut").getContext("2d");
  const lineGraph = document.getElementById("lineGraph").getContext("2d");
  const bgColors = [
    "#6366f1",
    "#f43f5e",
    "#14b8a6",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#8b5cf6",
    "#f97316",
    "#22c55e",
    "#ec4899",
  ];

  let coinSet = [];
  for (let i = 0; i < APIdata.length; i++) {
    coinSet.push({ APIdata });
  }

  // Criacao de Array para gráfico dividido por dias
  const hoje = new Date();

  const dayLabels = Array.from({ length: dateCalc }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - dateCalc + i);

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");

    return `${dia}/${mes}`;
  });

  const datasets = APIdata.map((coinData, i) => ({
    label: coinName[i],
    data: coinData.slice(0, dateCalc).map((day) => Number(day[4])),
    borderColor: bgColors[i],
    backgroundColor: bgColors[i] + "20",
    tension: 0.4,
    borderWidth: 2.5,
    pointRadius: 0,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: bgColors[i],
    pointHoverBorderColor: '#ffffff',
    pointHoverBorderWidth: 2,
    fill: true,
  }));

  // Line Graph
  lineChart = new Chart(lineGraph, {
    type: "line",
    data: {
      labels: dayLabels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          grid: {
            color: '#f1f5f9',
          },
          border: {
            display: false,
          },
          ticks: {
            padding: 8,
            font: {
              size: 11,
            },
            color: '#64748b',
            callback: (value) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value),
          },
        },
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            padding: 8,
            font: {
              size: 13,
            },
            color: '#64748b',
          },
        },
      },

      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: {
              size: 12,
              weight: '500',
            },
            color: '#475569',
          },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          borderColor: '#334155',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          titleFont: {
            size: 13,
            weight: '600',
          },
          bodyFont: {
            size: 12,
          },
          callbacks: {
            label: function (context) {
              // Formata para REAL BRL
              return context.dataset.label + ': ' + context.raw.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }); //
            },
          },
        },
      },
      elements: {
        line: {
          borderColor: "#8785a5ff",
        },
      },
    },
  });

  // Bar Graph
  barChart = new Chart(barGraph, {
    type: "bar",
    data: {
      labels: coinName,
      datasets: [
        {
          data: variVal(APIdata, dateCalc),
          backgroundColor: bgColors.map(c => c + 'cc'),
          borderColor: bgColors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        y: {
          grid: {
            color: '#f1f5f9',
          },
          border: {
            display: false,
          },
          ticks: {
            padding: 8,
            font: {
              size: 11,
            },
            callback: (value) => value + "%",

            color: function (context) {
              const v = context.tick.value;
              if (v === 0) return "#64748b";
              return v > 0 ? "#22c55e" : "#ef4444";
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            padding: 8,
            font: {
              size: 12,
              weight: '500',
            },
            color: '#475569',
          },
        },
      },
      plugins: {
        legend: {
          display: false, // remover a legenda
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          borderColor: '#334155',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function (context) {
              const v = context.parsed.y;
              const icon = v >= 0 ? " ▲" : " ▼";
              return Math.abs(v) + "%" + icon;
            },
          },
        },
      },
    },
  });

  function lightenColor(color) {
    return color + "55"; // adiciona transparência
  }

  // Doughnut Graph
  doughnutChar = new Chart(doughnut, {
    type: "doughnut",
    data: {
      labels: coinName,
      datasets: [
        {
          data: calcVol(APIdata, dateCalc),

          backgroundColor: bgColors.map(c => c + 'cc'),
          borderColor: '#ffffff',
          borderWidth: 3,

          hoverBorderWidth: 0,
          hoverOffset: 8,
          spacing: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '50%',
      plugins: {
        legend: {
          position: "right",
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
            font: {
              size: 15,
              weight: '500',
            },
            color: '#475569',
            generateLabels(chart) {
              const dataset = chart.data.datasets[0];

              return chart.data.labels.map((label, i) => ({
                text: label,
                strokeStyle: 'transparent',
                fillStyle: bgColors[i],
                lineWidth: 0,
                hidden: false,
                index: i,
              }));
            },
          },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          borderColor: '#334155',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
        },
      },
    },
  });
}
