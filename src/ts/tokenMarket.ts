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
          tokenList.innerHTML += `
            <div class="tokenOption">
              <h3>${lista_de_tokens[i].title}</h3>
              <p>R$: ${lista_de_tokens[i].price},00</p>
              <p>Quantidade: ${lista_de_tokens[i].amount}</p>
              <button class="btnBuyToken">Comprar</button>
            </div>
          `;
        }
      });
  }

  function saveTokenIdToLocalStorage(id: number) {
    localStorage.setItem('tokenId', id.toString());
  }
  
  async function getTokenIdFromApi(id: number): Promise<number> {
    const response = await fetch("http://localhost:3000/tokens");
    const tokens = await response.json();
  
    for (const token of tokens) {
      if (id === token.id) {
        return Number(token.id);
      }
    }
    throw new Error("Token not found");
  }

  
  setInterval(createToken, 10 * 1000000); // Chama createToken a cada 10 segundos (em milissegundos)
  setInterval(createTokenListFromApi, 10 * 10); // Chama createTokenListFromApi a cada 10 segundos (em milissegundos)
});

//   function tokenId() {
//     const tokenOptions = document.getElementsByClassName("tokenOption");
  
//     function handleBuyTokenClick(event: Event) {
//       const btnBuyToken = event.target as HTMLButtonElement;
//       const tokenOption = btnBuyToken.closest('.tokenOption');
//       const index = Array.prototype.indexOf.call(tokenOptions, tokenOption);
  
//       fetch("http://localhost:3000/tokens")
//         .then((response) => response.json())
//         .then(async (lista_de_tokens: any[]) => {
//           const token = lista_de_tokens[index];
//           const tokenId = await getTokenIdFromApi(token.id);
//           saveTokenIdToLocalStorage(tokenId);
//         });
//     }
  
//     for (let i = 0; i < tokenOptions.length; i++) {
//       const btnBuyToken = tokenOptions[i].querySelector(".btnBuyToken") as HTMLButtonElement;
//       btnBuyToken.addEventListener("click", handleBuyTokenClick);
//     }
//   }

//   const btnBuyToken = document.getElementById('btnBuyToken') as HTMLButtonElement;
//   btnBuyToken.addEventListener('click', tokenId);

// async function createTokenSelectedModal(): Promise<void>{

//     const divModal = document.getElementById("divModal") as HTMLDivElement;
//     const tokenId = localStorage.getItem('tokenId')
    
// }  

//   async function createDivUserInfo(): Promise<void> {
//     const userInfoFromApi = document.getElementById('userInfoFromApi') as HTMLDivElement;
//     const userId = localStorage.getItem('userId');
  
//     if(userStatus === 'true'){
//         if (userId) {
//           const response = await fetch(`http://localhost:3000/users/${userId}`);
//           const userData = await response.json();
      
//           const name = userData.nome;
//           const balance = userData.saldoInicial;
      
//           userInfoFromApi.innerText = `Nome: ${name} | Saldo: ${balance}`;
//         } else {
//         throw new Error("Usuário não encontrado");
//       }
//     }else{
//       userInfoFromApi.innerText = ``;
//     }
//   }

// <div id="modal" class="modal">
//   <div class="modal-content">
//     <h3 id="modalTitle"></h3>
//     <p id="modalPrice"></p>
//     <p id="modalAmount"></p>
//     <input type="number" id="inputQuantity" placeholder="Quantidade">
//     <button id="btnConfirm">Confirmar</button>
//   </div>
// </div>