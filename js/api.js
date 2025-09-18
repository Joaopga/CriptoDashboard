export async function req(coin, date) {
    let url =`https://api.binance.com/api/v3/klines?symbol=${coin}BRL&interval=1d&limit=${date}`
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }
    let JSONdata = await response.json();
    
    return JSONdata;
}




/*
    1719878400000,     // Open time (timestamp) - 0
    "65920.00",         // Open - 1
    "66100.00",         // High - 2
    "65800.00",         // Low - 3 
    "66050.00",         // Close - 4 
    "123.45",           // Volume - 5
    1719964799999,      // Close time - 6
*/

// IDEIA:
// GRAFICO FECHAMENTO (LINE)
// GRAFICO DE QUEM MAIS AUMENTOU NO PERÍODO (BAR)
// GRAFICO VOLUME DE VENDA (DOUGHNUT)