// Salvando dados DOM das Tooltips
const coinTP = document.getElementById("coin-tooltip");

function openModal(){
    const modal = document.createElemente('div')
    modal.className = 'tpBox'

    modal.innerHTML = `
    
    
    `
}

coinTP.addEventListener("click", () => {
  //removeModal()
  openModal()
})