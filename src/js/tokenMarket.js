"use strict";
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
        const tokenList = document.getElementsByClassName("tokenList")[0];
        fetch("http://localhost:3000/tokens")
            .then((response) => response.json())
            .then((lista_de_tokens) => {
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
    function saveTokenIdToLocalStorage(id) {
        localStorage.setItem("tokenId", id.toString());
    }
    function handleBuyTokenClick(event) {
        const btnBuyToken = event.target;
        const tokenId = btnBuyToken.dataset.id;
        if (tokenId) {
            saveTokenIdToLocalStorage(Number(tokenId));
        }
        else {
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
    function updateTokenAmount(tokenId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`http://localhost:3000/tokens/${tokenId}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        });
    }
    function deleteToken(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`http://localhost:3000/tokens/${tokenId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
        });
    }
    function getAmountBought(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const btnConfirm = event.target;
            const tokenOption = btnConfirm.closest(".tokenOption");
            const quantityToBuy = tokenOption.querySelector(".quantityToBuy");
            const tokenId = btnConfirm.dataset.id;
            if (tokenId && quantityToBuy) {
                const response = yield fetch(`http://localhost:3000/tokens/${tokenId}`);
                const tokenData = yield response.json();
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
                if (amount <= 0) {
                    yield deleteToken(tokenId);
                }
                else {
                    yield updateTokenAmount(tokenId, tokenData);
                    yield updateUserBalance(event, requestedQuantity);
                }
                console.log(amount);
            }
        });
    }
    function updateUserBalance(event, quantityBought) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = localStorage.getItem("userId");
            const btnConfirm = event.target;
            const tokenOption = btnConfirm.closest(".tokenOption");
            const quantityToBuy = tokenOption.querySelector(".quantityToBuy");
            const tokenId = btnConfirm.dataset.id;
            if (userId && quantityToBuy && tokenId) {
                const userResponse = yield fetch(`http://localhost:3000/users/${userId}`);
                const userData = yield userResponse.json();
                const tokenResponse = yield fetch(`http://localhost:3000/tokens/${tokenId}`);
                const tokenData = yield tokenResponse.json();
                const tokenTitle = tokenData.title;
                const tokenPrice = Number(tokenData.price);
                let userBalance = Number(userData.saldoInicial);
                userBalance -= quantityBought * tokenPrice;
                if (userBalance < 0) {
                    alert("Impossível realizar esta compra, saldo insuficiente");
                    return;
                }
                else {
                    userData.saldoInicial = userBalance;
                    yield fetch(`http://localhost:3000/users/${userId}`, {
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userData),
                    });
                    yield fetch("http://localhost:3000/relatorio", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            idTokenReport: userId,
                            title: tokenTitle,
                            price: tokenPrice,
                            amount: quantityBought
                        })
                    });
                }
            }
        });
    }
    setInterval(createToken, 10 * 1000000);
    window.addEventListener("load", createTokenListFromApi);
    setInterval(attachBuyTokenListeners, 10 * 10);
});
