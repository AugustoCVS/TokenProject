import { TokenClass } from "./classes/tokenClass.js";

const tokenMarketTitle = document.getElementById("tokenMarketTitle") as HTMLElement;
const userStatus = localStorage.getItem('logado');

function validateUserLogin() {
  if (userStatus === 'true') {
    tokenMarketTitle.innerHTML = '<a href="./tokenMarket.html">Token Market</a>';
  } else {
    tokenMarketTitle.innerHTML = 'Token Market';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  validateUserLogin();

  function createToken() {
    const token = new TokenClass('titulo 1');
    token.generateRandomValues();
  
    console.log(token);
  
    setTimeout(createToken, 50000);
  }
  
  createToken();
});


