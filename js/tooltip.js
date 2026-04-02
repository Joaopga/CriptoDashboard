// Salvando dados DOM das Tooltips
const coinTP = document.getElementById("coin-tooltip");

function openModal() {
  const modalBg = document.createElement("div");
  modalBg.className = "modalBg";
  const modal = document.createElement("div");
  modal.className = "tpBox";

  modal.innerHTML = `
      <div class="tpContent">
        <span id="tpTitle">Adicionar Criptomoedas</span>
        <span id="tpSubTitle">Guia rápido de uso</span>
        <div class="tpAddCoin">
          <span>Como adicionar moedas</span>
          <ul>
            <li>
              Digite a sigla da moeda (ex: BTC, ETH, SOL...) no campo de busca
            </li>
            <li>
              Pressione <span class="key">Enter</span> para adicionar ao filtro
            </li>
            <li>
              A moeda será incluída automaticamente na lista de acompanhamento
            </li>
          </ul>
          <span>Dicas</span>
          <ul>
            <li>Use siglas padrão do mercado</li>
            <li>Você pode adicionar várias moedas seguidas</li>
            <li>
              Para remover, utilize o "X" de exclusão na lista ou pressione
              <span class="key">Backspace</span>
            </li>
          </ul>
        </div>
        <div class="tpButton">
          <button id="tpbtn">Entendi!</button>
        </div>
      </div>
    `;

  document.body.appendChild(modalBg);
  document.body.appendChild(modal);
}

function removeModal() {
  if (document.querySelector(".modalBg")) {
    let modalBg = document.querySelector(".modalBg");
    modalBg.remove();
  }
  if (document.querySelector(".tpBox")) {
    let modal = document.querySelector(".tpBox");
    modal.remove();
  }
}

coinTP.addEventListener("click", () => {
  openModal();
});

document.addEventListener("click", (event) => {
  if (event.target.matches(".modalBg") || event.target.matches("#tpbtn")) removeModal();
});
