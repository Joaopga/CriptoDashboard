import { req } from "./api.js";

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

function bulildGraph(coinName, APIdata, dateCalc) {
  const barGraph = document.getElementById("barGraph").getContext("2d");
  const doughnut = document.getElementById("doughnut").getContext("2d");
  const lineGraph = document.getElementById("lineGraph").getContext("2d");
  const bgColors = [
    "#514da4",
    "#ff6f61",
    "#4db6ac",
    "#ffd700",
    "#d32f2f",
    "#1976d2",
    "#8e24aa",
    "#ff8f00",
    "#388e3c",
    "#c2185b",
  ];

  let coinSet = [];
  for (let i = 0; i < APIdata.length; i++) {
    coinSet.push({ APIdata });
  }

  console.log(APIdata);

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
    backgroundColor: bgColors[i] + "33",
    tension: 0.3,
  }));

  // Line Graph
  new Chart(lineGraph, {
    type: "line",
    data: {
      labels: dayLabels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        y: {
          ticks: {
            callback: (value) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value),
          },
        },
      },

      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              // Formata para REAL BRL
              return context.raw.toLocaleString("pt-BR", {
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
  new Chart(barGraph, {
    type: "bar",
    data: {
      labels: coinName,
      datasets: [
        {
          data: variVal(APIdata, dateCalc),
          backgroundColor: bgColors,
        },
      ],
    },
    options: {
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => value + "%",

            color: function (context) {
              const v = context.tick.value;
              if (v === 0) return "#000000";
              return v > 0 ? "#22c55e" : "#ef4444";
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false, // remover a legenda
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const v = context.parsed.y;
              const icon = v >= 0 ? "▲ " : "▼ ";
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
  new Chart(doughnut, {
    type: "doughnut",
    data: {
      labels: coinName,
      datasets: [
        {
          data: calcVol(APIdata, dateCalc),

          backgroundColor: bgColors, // centro mais escuro
          borderColor: bgColors.map((c) => c + "AA"), // borda ainda mais marcada
          borderWidth: 3,

          hoverBorderWidth: 4,
          spacing: 6, // separação maior entre fatias
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "right",
          labels: {
            generateLabels(chart) {
              const dataset = chart.data.datasets[0];

              return chart.data.labels.map((label, i) => ({
                text: label,
                strokeStyle: dataset.borderColor[i],
                fillStyle: dataset.backgroundColor[i] + "33",
                lineWidth: 2,
                hidden: false,
                index: i,
              }));
            },
          },
        },
      },
    },
  });
}
