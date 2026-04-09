import { CallAPI } from "./graph.js";

// Campo para informar símbolo da(s) moeda(s)
const input = document.getElementById("input");
const coinInput = document.getElementById("coinInput");
let coin;

export async function dateErr(errCod) {
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
      
      case 2:
        errTxt = "Não foi possível buscar a moeda";
      break;
    }

    errMsg.innerHTML = "<span>" + errTxt + "</span>";
    formRow.insertAdjacentElement("afterend", errMsg);

    return;
  }
  if ((errMsgDiv != null) & (errCod === "remErr")) errMsgDiv.remove();
}

function removeCoin(TobeRmv) {
  TobeRmv.remove();
  let coin = document.querySelectorAll(".coin_symbol").length;

  if (coin > 0) {
    input.placeholder = "";
  } else {
    input.placeholder = "Digite o símbolo da moeda...";
  }
}

coinInput.addEventListener("click", () => {
  input.focus()
})

// Funcao de Criacao e Remocao de moedas
// (Remocao somente com Backspace)
input.addEventListener("focus", () => {
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

      coin.appendChild(remove);

      // Insere antes do input
      coinInput.insertBefore(coin, input);

      // Limpa o input
      input.value = "";

      if (document.querySelectorAll(".coin_symbol").length > 0) {
        input.placeholder = "";
      } else {
        input.placeholder = "Digite o símbolo da moeda...";
      }
    }

    if (e.key === "Backspace") {
      if(input.value === ""){
        if (document.querySelectorAll(".coin_symbol")) {
          let createdCoin = document.querySelectorAll(".coin_symbol");
          let lastCoin = createdCoin[createdCoin.length - 1];
          removeCoin(lastCoin);
        }
      }
    }
  });
});

//Remocao das moeadas ao clicar no X
document.addEventListener("click", (event) => {
  if (event.target.matches(".rmv")) {
    const coin = event.target.closest(".coin_symbol");
    if (coin) removeCoin(coin);
  }
}); 

// Pega valor DOM de moedas, data e botoes de filtrar/resetar
const filter = document.getElementById("filter");
const reset = document.getElementById("reset");
const coins = document.getElementsByClassName("coin_symbol");

filter.addEventListener("click", (event) => {
  // Pegando informacoes de data
  let date = document.getElementById("set-date").value;
  let dateValue = document.getElementById("dateInput").value;
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
    }
  }
});

reset.addEventListener("click", () => {
  let coins = document.querySelectorAll(".coin_symbol");
  let period = document.getElementById("set-date");
  let day = document.getElementById("dateInput");
  let errMsgDiv = document.querySelector("#errMsg");
  
  if (coins.length > 0){
    for (let i = 0; i < coins.length + 1; i++) {
      coins[i] ? removeCoin(coins[i]) : removeCoin(coins[i - 1]);
    }
  }

  if (errMsgDiv) errMsgDiv.remove()
  period.value = "day";
  day.value = "7";
});
