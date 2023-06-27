"use strict";
const inputName = document.getElementById("inputName");
const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");
const inputBalance = document.getElementById("inputBalance");
const btnRegisterUser = document.getElementById("btnRegisterUser");
const data = {
    nome: inputName.value,
    email: inputEmail.value,
    senha: inputPassword.value,
    saldoInicial: inputBalance.value
};
function checkUserInfo() {
    fetch("http://localhost:3000/users")
        .then((response) => response.json())
        .then((lista_de_usuarios) => {
        let userEmail = inputEmail.value;
        let validate = true;
        for (let i in lista_de_usuarios) {
            if (userEmail === lista_de_usuarios[i].email) {
                alert("E-mail já cadastrado");
                return validate = false;
            }
        }
    });
}
btnRegisterUser.addEventListener('click', (event) => {
    event.preventDefault();
    checkUserInfo();
});
