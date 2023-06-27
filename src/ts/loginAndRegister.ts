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

  async function validateIfUserDataExistis(email: string): Promise<boolean> {
    return await fetch("http://localhost:3000/users")
      .then((response: Response) => response.json())
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

  function saveUserBalanceToLocalStorage(balance: number) {
    localStorage.setItem('userBalance', balance.toString());
  }

  function saveUserEntry() {
    localStorage.setItem('logado', 'true');
  }

  function userLogOUt(){
    localStorage.setItem('logado', 'false');
  }
  
  async function getUserBalanceFromData(email: string): Promise<number> {
    return await fetch("http://localhost:3000/users")
      .then((response: Response) => response.json())
      .then((lista_de_usuarios: any[]) => {
        for (let i in lista_de_usuarios) {
          if (email === lista_de_usuarios[i].email) {
            return Number(lista_de_usuarios[i].saldoInicial);
          }
        }
        throw new Error("Usuário não encontrado");
      });
  }
  
  function userLogin(data: UserLoginData) {
    validateIfUserDataExistis(data.email)
      .then((validate: boolean) => {
        if (!validate) {
          getUserBalanceFromData(data.email)
            .then((balance: number) => {
              saveUserBalanceToLocalStorage(balance);
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
  }

  btnRegisterUser.addEventListener('click', handleRegisterClick);
  btnLoginUser.addEventListener('click', handleLoginClick);
  btnLogOut.addEventListener('click', userLogOUt);
});