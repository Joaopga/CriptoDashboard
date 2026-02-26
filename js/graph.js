import {req} from './api.js'

export async function CallAPI(coinName, dateCalc) {
    let promises = [];

    for (let i = 0; i < coinName.length; i++){
        promises.push(req(coinName[i], dateCalc))
    }
    let APIdata = await Promise.all(promises)

    bulildGraph(coinName, APIdata, dateCalc)
}

function calcVol(APIdata, dateCalc){
    let dia    
    let volDia
    let volTotal = []
    
    for (let i = 0; i < APIdata.length; i++){
    dia = 0
    volDia = 0

        do {
            volDia += parseFloat(APIdata[i][dia][5])
            dia++
        } while (dia < dateCalc)

    volTotal.push(volDia.toFixed(2))
    }
        
    return volTotal
    
}


function bulildGraph(coinName, APIdata, dateCalc){
    const barGraph = document.getElementById('barGraph').getContext('2d')
    const doughnut = document.getElementById('doughnut').getContext('2d')
    const lineGraph = document.getElementById('lineGraph').getContext('2d')
    const bgColors = ['#514da4','#ff6f61','#4db6ac','#ffd700','#d32f2f','#1976d2','#8e24aa','#ff8f00','#388e3c','#c2185b']

    let coinSet = []
    for (let i = 0; i < APIdata.length; i++){
        coinSet.push({APIdata})
    }

    console.log(APIdata)


    // Criacao de Array para gráfico dividido por dias
    const dayLabels = Array.from({
            length: dateCalc 
        },(_, i) => `Dia ${i + 1}`)

    const datasets = APIdata.map((coinData, i) => ({
        label: coinName[i],
        data: coinData.slice(0, dateCalc).map(day => Number(day[4])),
        borderColor: bgColors[i],
        backgroundColor: bgColors[i] + '33',
        tension: 0.3
    }))

    // Line Graph
    new Chart(lineGraph, {
        type: 'line',
        data: {
            labels: dayLabels,
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            // Formata para REAL BRL
                            return context.raw.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency:'BRL'
                            }); //
                        }
                    }
                }
            },
            elements: {
                line: {
                    borderColor: '#8785a5ff'
                }
            }
        }
    })


    // Bar Graph
    new Chart(barGraph, {
        type: 'bar',
        data: {
            labels: coinName,
            datasets: [{
                data: calcVol(APIdata, dateCalc),
                backgroundColor: bgColors
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false // remover a legenda
                }
            }
        }
    })
    
    // Pizza Graph
    new Chart(doughnut, {
        type: 'doughnut',
        data: {
            labels: coinName,
            datasets: [{
                data: calcVol(APIdata, dateCalc),
                backgroundColor: bgColors
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false // remover a legenda
                }
            }
        }
    })



}
