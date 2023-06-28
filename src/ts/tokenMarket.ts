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
    const token = new TokenClass("Token");
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
    updateUserBalance(event);
  }

  function attachBuyTokenListeners() {
    const btnBuyTokens = document.querySelectorAll(".btnBuyToken");
    btnBuyTokens.forEach((btnBuyToken) => {
      btnBuyToken.addEventListener("click", handleBuyTokenClick);
    });
  }

  async function getAmountBought(event: Event): Promise<void> {
    const btnConfirm = event.target as HTMLButtonElement;
    const tokenOption = btnConfirm.closest(".tokenOption") as HTMLElement;
    const quantityToBuy = tokenOption.querySelector(
      ".quantityToBuy"
    ) as HTMLInputElement;
    const tokenId = btnConfirm.dataset.id;

    if (tokenId && quantityToBuy) {
      const response = await fetch(`http://localhost:3000/tokens/${tokenId}`);
      const tokenData = await response.json();

      //const price = tokenData.price;
      let amount = Number(tokenData.amount);

      amount -= Number(quantityToBuy.value);
      tokenData.amount = amount;

      await fetch(`http://localhost:3000/tokens/${tokenId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tokenData),
      });

      console.log(amount);
    }
  }

  async function updateUserBalance(event: Event): Promise<void> {
    const userId = localStorage.getItem("userId");
    const btnConfirm = event.target as HTMLButtonElement;
    const tokenOption = btnConfirm.closest(".tokenOption") as HTMLElement;
    const quantityToBuy = tokenOption.querySelector(
      ".quantityToBuy"
    ) as HTMLInputElement;
    const tokenId = btnConfirm.dataset.id;

    if (userId) {
      const userResponse = await fetch(`http://localhost:3000/users/${userId}`);
      const userData = await userResponse.json();

      const tokenResponse = await fetch(
        `http://localhost:3000/tokens/${tokenId}`
      );
      const tokenData = await tokenResponse.json();

      let tokenAmount = Number(quantityToBuy.value);
      let tokenPrice = Number(tokenData.price);
      let userBalance = Number(userData.saldoInicial);
      userBalance = userBalance - tokenAmount * tokenPrice;

      userData.saldoInicial = userBalance;

      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
    }
  }

  async function createUserMarketReport(): Promise<void> {
    const sectionMarketReport = document.getElementById(
      "sectionMarketReport"
    ) as HTMLElement;

    const response = await fetch("http://localhost:3000/relatorio");
    const report_list = await response.json();

    sectionMarketReport.innerHTML = "";

    for (const report of report_list) {
      const reportHTML = `
            <div class="report">
              <h3 class="report-title">Relatório de Compras</h3>
              <div class="report-info">
                <p><span class="label">Token:</span> <span class="value">${report.title}</span></p>
                <p><span class="label">Preço:</span> <span class="value price">R$${report.price},00</span></p>
                <p><span class="label">Quantidade:</span> <span class="value amount">${report.amount}</span></p>
              </div>
            </div>
          `;

      sectionMarketReport.insertAdjacentHTML("beforeend", reportHTML);
    }
  }

  window.addEventListener("load", createUserMarketReport);
  setInterval(createToken, 10 * 1000000);
  window.addEventListener("load", createTokenListFromApi);
  setInterval(attachBuyTokenListeners, 10 * 10);
});
