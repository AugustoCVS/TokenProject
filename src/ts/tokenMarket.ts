// import { TokenClass } from "./classes/tokenClass";

class TokenClass {
    public title: string;
    public price: number;
    public amount: number;
  
    constructor(title: string) {
      this.title = title;
      this.price = 0;
      this.amount = 0;
    }
  
    public generateRandomValues() {
      this.price = Math.floor(100 * Math.random());
      this.amount = Math.floor(100 * Math.random());
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    function createToken() {
      const token = new TokenClass('Token');
      token.generateRandomValues();
  
      fetch("http://localhost:3000/tokens", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(token)
      })
        .catch((error) => {
          console.error(error);
        });
    }
  
    function createTokenListFromApi() {
      const tokenList = document.getElementsByClassName('tokenList')[0] as HTMLElement;
  
      fetch("http://localhost:3000/tokens")
        .then(response => response.json())
        .then((lista_de_tokens: any[]) => {
          tokenList.innerHTML = "";
  
          for (let i in lista_de_tokens) {
            const tokenId = lista_de_tokens[i].id;
            tokenList.innerHTML += `
              <div class="tokenOption">
                <h3>${lista_de_tokens[i].title}</h3>
                <p>R$: ${lista_de_tokens[i].price},00</p>
                <p>Quantidade: ${lista_de_tokens[i].amount}</p>
                <button class="btnBuyToken" data-id="${tokenId}">Comprar</button>
              </div>
            `;
          }
  
          attachBuyTokenListeners();
        });
    }
  
    function saveTokenIdToLocalStorage(id: number) {
      localStorage.setItem('tokenId', id.toString());
    }
  
    function handleBuyTokenClick(event: Event): void {
      const btnBuyToken = event.target as HTMLButtonElement;
      const tokenId = btnBuyToken.dataset.id;
  
      if (tokenId) {
        saveTokenIdToLocalStorage(Number(tokenId));
      } else {
        console.error('Token ID not found');
      }
    }
  
    function attachBuyTokenListeners() {
      const btnBuyTokens = document.querySelectorAll(".btnBuyToken");
      btnBuyTokens.forEach((btnBuyToken) => {
        btnBuyToken.addEventListener("click", handleBuyTokenClick, { once: true });
      });
    }

    async function createTokenSelectedModal(): Promise<void>{

    const modal = document.getElementById("modal") as HTMLDivElement;
    const tokenId = localStorage.getItem('tokenId')
    
    if(tokenId){
        const response = await fetch(`http://localhost:3000/tokens/${tokenId}`);
        const tokenData = await response.json()

        const title = tokenData.title;
        const price = tokenData.price;
        const amount = tokenData.amount;

        modal.innerHTML = `
            <div class="modal-content">
                <h3 id="modalTitle">${title}</h3>
                <p id="modalPrice">R$${price},00</p>
                <p id="modalAmount">Quantidade${amount}</p>
                <input type="number" id="inputQuantity" placeholder="Quantidade">
                <button id="btnConfirm">Confirmar</button>
            </div>
        `
        }

    }  
  
    setInterval(createToken, 10 * 1000000);
    setInterval(createTokenListFromApi, 10 * 10);
  });
  