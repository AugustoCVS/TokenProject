var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    const btnRegisterUser = document.getElementById("btnRegisterUser");
    const inputName = document.getElementById("inputName");
    const inputEmail = document.getElementById("inputEmail");
    const inputPassword = document.getElementById("inputPassword");
    const inputBalance = document.getElementById("inputBalance");
    const inputLoginEmail = document.getElementById("inputLoginEmail");
    const inputLoginPassword = document.getElementById("inputLoginPassword");
    const btnLoginUser = document.getElementById("btnLoginUser");
    const btnLogOut = document.getElementById("btnLogOut");
    function validateIfUserDataExistis(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch("http://localhost:3000/users")
                .then((response) => response.json())
                .then((lista_de_usuarios) => {
                for (let i in lista_de_usuarios) {
                    if (email === lista_de_usuarios[i].email) {
                        return false;
                    }
                }
                return true;
            });
        });
    }
    function exportUserDataToApi(data) {
        validateIfUserDataExistis(data.email)
            .then((validate) => {
            if (validate) {
                fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                alert("Deu bom");
            }
        });
    }
    function saveUserBalanceToLocalStorage(balance) {
        localStorage.setItem('userBalance', balance.toString());
    }
    function saveUserEntry() {
        localStorage.setItem('logado', 'true');
    }
    function userLogOUt() {
        localStorage.setItem('logado', 'false');
    }
    function getUserBalanceFromData(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch("http://localhost:3000/users")
                .then((response) => response.json())
                .then((lista_de_usuarios) => {
                for (let i in lista_de_usuarios) {
                    if (email === lista_de_usuarios[i].email) {
                        return Number(lista_de_usuarios[i].saldoInicial);
                    }
                }
                throw new Error("Usuário não encontrado");
            });
        });
    }
    function userLogin(data) {
        validateIfUserDataExistis(data.email)
            .then((validate) => {
            if (!validate) {
                getUserBalanceFromData(data.email)
                    .then((balance) => {
                    saveUserBalanceToLocalStorage(balance);
                });
                saveUserEntry();
            }
        });
    }
    function handleRegisterClick(event) {
        event.preventDefault();
        const userRegisterData = {
            nome: inputName.value,
            email: inputEmail.value,
            senha: inputPassword.value,
            saldoInicial: Number(inputBalance.value)
        };
        exportUserDataToApi(userRegisterData);
    }
    function handleLoginClick(e) {
        e.preventDefault();
        const userLoginData = {
            email: inputLoginEmail.value,
            senha: inputLoginPassword.value
        };
        userLogin(userLoginData);
    }
    btnRegisterUser.addEventListener('click', handleRegisterClick);
    btnLoginUser.addEventListener('click', handleLoginClick);
    btnLogOut.addEventListener('click', userLogOUt);
});
export {};
