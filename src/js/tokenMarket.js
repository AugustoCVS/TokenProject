"use strict";
// import { TokenClass } from "./classes/tokenClass";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class TokenClass {
    constructor(title) {
        this.title = title;
        this.price = 0;
        this.amount = 0;
    }
    generateRandomValues() {
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
        const tokenList = document.getElementsByClassName('tokenList')[0];
        fetch("http://localhost:3000/tokens")
            .then(response => response.json())
            .then((lista_de_tokens) => {
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
    function saveTokenIdToLocalStorage(id) {
        localStorage.setItem('tokenId', id.toString());
    }
    function handleBuyTokenClick(event) {
        const btnBuyToken = event.target;
        const tokenId = btnBuyToken.dataset.id;
        if (tokenId) {
            saveTokenIdToLocalStorage(Number(tokenId));
        }
        else {
            console.error('Token ID not found');
        }
    }
    function attachBuyTokenListeners() {
        const btnBuyTokens = document.querySelectorAll(".btnBuyToken");
        btnBuyTokens.forEach((btnBuyToken) => {
            btnBuyToken.addEventListener("click", handleBuyTokenClick, { once: true });
        });
    }
    function createTokenSelectedModal() {
        return __awaiter(this, void 0, void 0, function* () {
            const modal = document.getElementById("modal");
            const tokenId = localStorage.getItem('tokenId');
            if (tokenId) {
                const response = yield fetch(`http://localhost:3000/tokens/${tokenId}`);
                const tokenData = yield response.json();
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
        `;
            }
        });
    }
    setInterval(createToken, 10 * 1000000);
    setInterval(createTokenListFromApi, 10 * 10);
});
