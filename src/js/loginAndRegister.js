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
    const userStatus = localStorage.getItem("logado");
    function createHeaderTitle() {
        const tokenMarketTitle = document.getElementById("tokenMarketTitle");
        if (userStatus === 'true') {
            tokenMarketTitle.innerHTML = '<a href="./tokenMarket.html">Token Market</a>';
        }
        else {
            tokenMarketTitle.innerHTML = 'Token Market';
        }
    }
    function acessDataFromApi(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(apiKey)
                .then((response) => response.json());
        });
    }
    function validateIfUserDataExistis(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return acessDataFromApi("http://localhost:3000/users")
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
    function saveUserIdToLocalStorage(id) {
        localStorage.setItem('userId', id.toString());
    }
    function saveUserEntry() {
        location.reload();
        localStorage.setItem('logado', 'true');
    }
    function userLogOUt() {
        location.reload();
        localStorage.setItem('logado', 'false');
    }
    function createDivUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfoFromApi = document.getElementById('userInfoFromApi');
            const userId = localStorage.getItem('userId');
            if (userStatus === 'true') {
                if (userId) {
                    const response = yield fetch(`http://localhost:3000/users/${userId}`);
                    const userData = yield response.json();
                    const name = userData.nome;
                    const balance = userData.saldoInicial;
                    userInfoFromApi.innerText = `Nome: ${name} | Saldo: ${balance}`;
                }
                else {
                    throw new Error("Usuário não encontrado");
                }
            }
            else {
                userInfoFromApi.innerText = ``;
            }
        });
    }
    function getUserIdFromData(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return acessDataFromApi("http://localhost:3000/users")
                .then((lista_de_usuarios) => {
                for (let i in lista_de_usuarios) {
                    if (email === lista_de_usuarios[i].email) {
                        return Number(lista_de_usuarios[i].id);
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
                getUserIdFromData(data.email)
                    .then((id) => {
                    saveUserIdToLocalStorage(id);
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
    createDivUserInfo();
    setInterval(createDivUserInfo, 5000);
    createHeaderTitle();
    btnRegisterUser.addEventListener('click', handleRegisterClick);
    btnLoginUser.addEventListener('click', handleLoginClick);
    btnLogOut.addEventListener('click', userLogOUt);
});
export {};
