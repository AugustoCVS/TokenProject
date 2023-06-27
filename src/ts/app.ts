const inputName = document.getElementById("inputName") as HTMLInputElement;
const inputEmail = document.getElementById("inputEmail") as HTMLInputElement;
const inputPassword = document.getElementById("inputPassword") as HTMLInputElement;
const inputBalance = document.getElementById("inputBalance") as HTMLInputElement;
const btnRegisterUser = document.getElementById("btnRegisterUser") as HTMLButtonElement;

const data = {
    nome: inputName.value,
    email: inputEmail.value,
    senha: inputPassword.value,
    saldoInicial: inputBalance.value
};

function checkUserInfo(){

    fetch("http://localhost:3000/users")
        .then((response: Response) => response.json())
        .then((lista_de_usuarios: any[]) => {
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

btnRegisterUser.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();

    checkUserInfo()
});
