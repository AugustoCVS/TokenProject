import { UserRegisterData } from "./interfaces/userRegisterData";
import { UserLoginData } from "./interfaces/userLoginData";

document.addEventListener("DOMContentLoaded", () => {
  const btnRegisterUser = document.getElementById("btnRegisterUser") as HTMLButtonElement;
  const inputName = document.getElementById("inputName") as HTMLInputElement;
  const inputEmail = document.getElementById("inputEmail") as HTMLInputElement;
  const inputPassword = document.getElementById("inputPassword") as HTMLInputElement;
  const inputBalance = document.getElementById("inputBalance") as HTMLInputElement;
  const inputLoginEmail = document.getElementById("inputLoginEmail") as HTMLInputElement;
  const inputLoginPassword = document.getElementById("inputLoginPassword") as HTMLInputElement;
  const btnLoginUser = document.getElementById("btnLoginUser") as HTMLButtonElement;
  const btnLogOut = document.getElementById("btnLogOut") as HTMLButtonElement;

  const userStatus = localStorage.getItem("logado")

  function createHeaderTitle(){
    const tokenMarketTitle = document.getElementById("tokenMarketTitle") as HTMLElement;
    if(userStatus === 'true'){
      tokenMarketTitle.innerHTML = '<a href="./tokenMarket.html">Token Market</a>'
    }else{
      tokenMarketTitle.innerHTML = 'Token Market'
    }
  }

  async function acessDataFromApi(apiKey: string){
    return await fetch(apiKey)
      .then((response: Response) => response.json())
  }

  async function validateIfUserDataExistis(email: string): Promise<boolean> {
    return acessDataFromApi("http://localhost:3000/users")
      .then((lista_de_usuarios: any[]) => {
        for (let i in lista_de_usuarios) {
          if (email === lista_de_usuarios[i].email) {
            return false;
          }
        }
        return true;
      });
  }

  function exportUserDataToApi(data: UserRegisterData) {
    validateIfUserDataExistis(data.email)
      .then((validate: boolean) => {
        if (validate) {
          fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          })
          alert("Deu bom");
        }
      });
  }

  function saveUserIdToLocalStorage(id: number) {
    localStorage.setItem('userId', id.toString());
  }

  function saveUserEntry() {
    location.reload()
    localStorage.setItem('logado', 'true');
  }

  function userLogOUt(){
    location.reload()
    localStorage.setItem('logado', 'false');
  }

  async function createDivUserInfo(): Promise<void> {
    const userInfoFromApi = document.getElementById('userInfoFromApi') as HTMLDivElement;
    const userId = localStorage.getItem('userId');
  
    if(userStatus === 'true'){
        if (userId) {
          const response = await fetch(`http://localhost:3000/users/${userId}`);
          const userData = await response.json();
      
          const name = userData.nome;
          const balance = userData.saldoInicial;
      
          userInfoFromApi.innerText = `Nome: ${name} | Saldo: ${balance}`;
        } else {
        throw new Error("Usuário não encontrado");
      }
    }else{
      userInfoFromApi.innerText = ``;
    }
  }
  
  async function getUserIdFromData(email: string): Promise<number> {
    return acessDataFromApi("http://localhost:3000/users")
      .then((lista_de_usuarios: any[]) => {
        for (let i in lista_de_usuarios) {
          if (email === lista_de_usuarios[i].email) {
            return Number(lista_de_usuarios[i].id);
          }
        }
        throw new Error("Usuário não encontrado");
      });
  }
  
  function userLogin(data: UserLoginData) {
    validateIfUserDataExistis(data.email)
      .then((validate: boolean) => {
        if (!validate) {
          getUserIdFromData(data.email)
            .then((id: number) => {
              saveUserIdToLocalStorage(id);
            })
          saveUserEntry()
        }
      });
  }  
  
  function handleRegisterClick(event: MouseEvent) {
    event.preventDefault();

    const userRegisterData: UserRegisterData = {
      nome: inputName.value,
      email: inputEmail.value,
      senha: inputPassword.value,
      saldoInicial: Number(inputBalance.value)
    };

    exportUserDataToApi(userRegisterData);
  }

  function handleLoginClick(e: MouseEvent) {
    e.preventDefault();

    const userLoginData: UserLoginData = {
      email: inputLoginEmail.value,
      senha: inputLoginPassword.value
    };

    userLogin(userLoginData);
  };

  createDivUserInfo();
  setInterval(createDivUserInfo, 5000);
  createHeaderTitle()

  btnRegisterUser.addEventListener('click', handleRegisterClick);
  btnLoginUser.addEventListener('click', handleLoginClick);
  btnLogOut.addEventListener('click', userLogOUt);
});