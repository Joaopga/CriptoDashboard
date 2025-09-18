import {CallAPI} from './graph.js'

// Campo para informar símbolo da(s) moeda(s)
const input = document.getElementById('input');
const coinInput = document.getElementById('coinInput');
let coin;

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    e.preventDefault();

    const value = input.value.trim();

    // Cria o "placeholder"
    coin = document.createElement('div');
    coin.className = 'coin_symbol';
    coin.textContent = value;

    // Botão de remoção
    const remove = document.createElement('span');
    remove.textContent = 'x';
    remove.onclick = () => coin.remove();

    coin.appendChild(remove);

    // Insere antes do input
    coinInput.insertBefore(coin, input);

    // Limpa o input
    input.value = '';
  }
/*
  if (e.key === 'Backspace' && (coin.className)){
    const remove = document.createElement('span');
    coin.remove();
  }*/
});


// Pega valor DOM de moedas e data
const filter = document.getElementById('filter');
const coins = document.getElementsByClassName('coin_symbol')

filter.addEventListener('click', e => {
  // Pegando informacoes de data
  const date = document.getElementById('set-date').value
  const dateValue = document.getElementById('dateInput').value
  let dateCalc = dateValue

  // Solicitando infor da moeda de todas selecionadas
  let coinName = []
  for(let i = 0; i < coins.length; i++){
    let html = coins[i].innerHTML;
    let coinFormatted= html.split('<span')[0].trim();
    coinFormatted = coinFormatted.toUpperCase()

    coinName.push(coinFormatted)

    // Define data de acordo com o selecionado
    if(date == 'week'){
      dateCalc*=7
    }

    if(date == 'month'){
      dateCalc*=30
    }

  }

  // Chama API para montagem de grafico
  CallAPI(coinName, dateCalc)
});


