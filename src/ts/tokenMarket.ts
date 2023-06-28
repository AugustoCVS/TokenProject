import { TokenClass } from "./classes/tokenClass.js";


document.addEventListener("DOMContentLoaded", () => {
    
  function createToken() {
    const token = new TokenClass('titulo 1');
    token.generateRandomValues();
  
    console.log(token);
  
    setTimeout(createToken, 50000);
  }
  
  createToken();
});


