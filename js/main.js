import { CallAPI } from "./graph.js";

// Campo para informar símbolo da(s) moeda(s)
const input = document.getElementById("input");
const coinInput = document.getElementById("coinInput");
let coin;

function dateErr(errCod) {
  let formRow = document.querySelector(".form-row");
  let errMsg = document.createElement("div");
  let errMsgDiv = document.querySelector("#errMsg");
  let errTxt = "";
  errMsg.id = "errMsg";

  if (errCod != "remErr" && !document.querySelector("#errMsg")) {
    switch (errCod) {
      case 0:
        errTxt = "Deve ser escolhida ao menos 1 moeda";
        break;

      case 1:
        errTxt = "A data precisa ser maior que um dia";
        break;
    }

    errMsg.innerHTML = errTxt;
    formRow.insertAdjacentElement("afterend", errMsg);

    return;
  }
  if ((errMsgDiv != null) & (errCod === "remErr")) errMsgDiv.remove();
}

// Funcao de Criaca e Remocao de moedas
// (Remocao somente com Backspace)
input.addEventListener('focus', () => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      e.preventDefault();

      const value = input.value.trim();

      // Cria o "placeholder"
      coin = document.createElement("div");
      coin.className = "coin_symbol";
      coin.textContent = value;

      // Botão de remoção
      const remove = document.createElement("span");
      remove.className = "rmv";
      remove.textContent = "x";
      remove.onclick = () => coin.remove();

      coin.appendChild(remove);

      // Insere antes do input
      coinInput.insertBefore(coin, input);

      // Limpa o input
      input.value = "";
    }
    
    if (e.key === 'Backspace'){
      if (document.querySelectorAll('.coin_symbol')) {
        let createdCoin = document.querySelectorAll('.coin_symbol')
        let lastCoin = createdCoin[createdCoin.length - 1]
        lastCoin.remove();
      }
    }
  });
})

//Remocao das moeadas ao clicar no X
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('rmv')){
    console.log('achou')
    const coin = event.target.closest('.coin_symbol')
    if (coin) coin.remove()
  }
})

// Pega valor DOM de moedas e data
const filter = document.getElementById("filter");
const coins = document.getElementsByClassName("coin_symbol");
const titles = document.querySelectorAll(".graphs #graph-title");

filter.addEventListener("click", (e) => {
  // Pegando informacoes de data
  const date = document.getElementById("set-date").value;
  const dateValue = document.getElementById("dateInput").value;
  let dateCalc = dateValue;

  // Valida se foi digitada pelo menos 1 moeda
  if (coins.length < 1) {
    dateErr(0);
  } else {
    dateErr("remErr");

    // Define data de acordo com o selecionado
    if (date == "week") {
      dateCalc *= 7;
    }

    if (date == "month") {
      dateCalc *= 30;
    }

    // Valida se data eh maior que 1
    if (dateCalc <= 1) {
      dateErr(1);
    } else {
      dateErr("remErr");

      // Solicitando info de todas as moedas selecionadas
      let coinName = [];
      for (let i = 0; i < coins.length; i++) {
        let html = coins[i].innerHTML;
        let coinFormatted = html.split("<span")[0].trim();
        coinFormatted = coinFormatted.toUpperCase();

        coinName.push(coinFormatted);
      }

      // Chama API para montagem de grafico
      CallAPI(coinName, dateCalc);

      //Removendo 'Hidden' dos títulos
      titles.forEach((titles) => {
        titles.classList.remove("hidden");
      });
    }
  }
});
