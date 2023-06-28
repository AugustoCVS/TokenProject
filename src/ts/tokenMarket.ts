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
        tokenList.innerHTML = ""; // Limpa o conteúdo existente antes de adicionar os novos tokens

        for (let i in lista_de_tokens) {
          tokenList.innerHTML += `
            <div class="tokenOption">
              <h3>${lista_de_tokens[i].title}</h3>
              <p>R$: ${lista_de_tokens[i].price},00</p>
              <p>Quantidade: ${lista_de_tokens[i].amount}</p>
              <button>Comprar</button>
            </div>
          `;
        }
      });
  }

  setInterval(createToken, 10 * 100000); // Chama createToken a cada 10 segundos (em milissegundos)
  setInterval(createTokenListFromApi, 10 * 10); // Chama createTokenListFromApi a cada 10 segundos (em milissegundos)
});
