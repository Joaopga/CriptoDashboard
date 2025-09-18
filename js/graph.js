import {req} from './api.js'

export async function CallAPI(coinName, dateCalc) {
    let promises = [];

    for (let i = 0; i < coinName.length; i++){
        promises.push(req(coinName[i], dateCalc))
    }
    let APIdata = await Promise.all(promises)

    bulildGraph(coinName, APIdata)
}


function bulildGraph(coinName, APIdata){
    const barGraph = document.getElementById('barGraph').getContext('2d')
    const doughnut = document.getElementById('doughnut').getContext('2d')
    const lineGraph = document.getElementById('lineGraph').getContext('2d')
    const bgColors = ['#514da4','#ff6f61','#4db6ac','#ffd700','#d32f2f','#1976d2','#8e24aa','#ff8f00','#388e3c','#c2185b']

    
    console.log(APIdata)

    let coinSet = []
    for (let i = 0; i < APIdata.length; i++){
        coinSet.push({APIdata})
    }

    // Line Graph
    new Chart(lineGraph, {
        type: 'line',
        data: {
            labels: coinName,
            datasets: [{
                data: APIdata.map(item => parseFloat(item[0][4])),
                backgroundColor: bgColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false, // remover a legenda
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
                data: APIdata.map(item => parseFloat(item[0][4])),
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
                data: APIdata.map(item => parseFloat(item[0][4])),
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
