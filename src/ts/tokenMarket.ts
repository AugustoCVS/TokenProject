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

    function generateRandomName() {
        const adjectives = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Black", "White", "Silver", "Golden"];
        const nouns = ["Coin", "Token", "Gem", "Diamond", "Star", "Crystal", "Jewel", "Artifact", "Charm", "Medallion"];
        
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${randomAdjective} ${randomNoun}`;
      }

  function createToken() {
    const token = new TokenClass(generateRandomName());
    token.generateRandomValues();

    fetch("http://localhost:3000/tokens", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    }).catch((error) => {
      console.error(error);
    });
  }

  function createTokenListFromApi() {
    const tokenList = document.getElementsByClassName(
      "tokenList"
    )[0] as HTMLElement;

    fetch("http://localhost:3000/tokens")
      .then((response) => response.json())
      .then((lista_de_tokens: any[]) => {
        tokenList.innerHTML = "";

        for (let i in lista_de_tokens) {
          const tokenId = lista_de_tokens[i].id;
          tokenList.innerHTML += `
              <div class="tokenOption">
                <h3>${lista_de_tokens[i].title}</h3>
                <p>R$: ${lista_de_tokens[i].price},00</p>
                <p>Quantidade: ${lista_de_tokens[i].amount}</p>
                <input name="inputBuy" class="quantityToBuy"/>
                <button class="btnBuyToken" data-id="${tokenId}">Comprar</button>
              </div>
            `;
        }
      });
  }

  function saveTokenIdToLocalStorage(id: number) {
    localStorage.setItem("tokenId", id.toString());
  }

  function handleBuyTokenClick(event: Event): void {
    const btnBuyToken = event.target as HTMLButtonElement;

    const tokenId = btnBuyToken.dataset.id;
    if (tokenId) {
      saveTokenIdToLocalStorage(Number(tokenId));
    } else {
      console.error("Token ID not found");
    }

    getAmountBought(event);
  }

  function attachBuyTokenListeners() {
    const btnBuyTokens = document.querySelectorAll(".btnBuyToken");
    btnBuyTokens.forEach((btnBuyToken) => {
      btnBuyToken.addEventListener("click", handleBuyTokenClick);
    });
  }


async function updateTokenAmount(tokenId: string, data: any[]): Promise<Response> {
    return await fetch(`http://localhost:3000/tokens/${tokenId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  
  async function deleteToken(tokenId: string): Promise<Response> {
    return await fetch(`http://localhost:3000/tokens/${tokenId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }

  async function getAmountBought(event: Event): Promise<void> {
    const btnConfirm = event.target as HTMLButtonElement;
    const tokenOption = btnConfirm.closest(".tokenOption") as HTMLElement;
    const quantityToBuy = tokenOption.querySelector(".quantityToBuy") as HTMLInputElement;
    const tokenId = btnConfirm.dataset.id;
  
    if (tokenId && quantityToBuy) {
      const response = await fetch(`http://localhost:3000/tokens/${tokenId}`);
      const tokenData = await response.json();
  
      let amount = Number(tokenData.amount);
  
      const requestedQuantity = Number(quantityToBuy.value);
  
      if (requestedQuantity <= 0) {
        alert("Quantidade inválida. Insira um valor maior que zero.");
        return;
      }
  
      if (requestedQuantity > amount) {
        alert("Impossível comprar. A quantidade desejada é maior do que a disponível.");
        return;
      }
  
      amount -= requestedQuantity;
      tokenData.amount = amount;
      tokenData.price = (tokenData.price * 1.05).toFixed(2);
  
      if (amount <= 0) {
        await deleteToken(tokenId);
      } else {
        await updateTokenAmount(tokenId, tokenData);
        await updateUserBalance(event, requestedQuantity);
      }
  
      console.log(amount);
    }
  }

  async function updateUserBalance(event: Event, quantityBought: number): Promise<void> {
    const userId = localStorage.getItem("userId");
    const btnConfirm = event.target as HTMLButtonElement;
    const tokenOption = btnConfirm.closest(".tokenOption") as HTMLElement;
    const quantityToBuy = tokenOption.querySelector(".quantityToBuy") as HTMLInputElement;
    const tokenId = btnConfirm.dataset.id;
  
    if (userId && quantityToBuy && tokenId) {
      const userResponse = await fetch(`http://localhost:3000/users/${userId}`);
      const userData = await userResponse.json();
  
      const tokenResponse = await fetch(`http://localhost:3000/tokens/${tokenId}`);
      const tokenData = await tokenResponse.json();
        
      const tokenTitle = tokenData.title
      let tokenPrice = Number(tokenData.price);
      let userBalance = Number(userData.saldoInicial);
      userBalance = parseFloat((userBalance - quantityBought * tokenPrice).toFixed(2));
  
      if (userBalance < 0) {
        alert("Impossível realizar esta compra, saldo insuficiente");
        return;
      } else {
        userData.saldoInicial = userBalance;

        await fetch(`http://localhost:3000/users/${userId}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        await fetch("http://localhost:3000/relatorio", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idTokenReport: userId,
                title: tokenTitle,
                price: tokenData.price,
                amount: quantityBought
            })
        })
      }
    }
  }

  setInterval(createToken, 10 * 100000);
  window.addEventListener("load", createTokenListFromApi);
  setInterval(attachBuyTokenListeners, 10 * 10);
});
