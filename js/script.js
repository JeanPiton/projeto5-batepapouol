axios.defaults.headers.common['Authorization'] = 'I83FdHEe98xJAkGy3EuLeqIk';
let user;
let destino = "Todos";
let tipo = "message";
const conteudo = document.querySelector(".conteudo");
const input = document.querySelector("input");

entrar();

function entrar() {
    let usuario = { name: prompt("Nome de usuário:") };
    const promessa = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', usuario);
    promessa.catch(resp => {
        console.log("deu ruim");
        entrar();
    })
    promessa.then((resp) => {
        if (resp.status == 200) {
            user = usuario;
            console.log("entrou");
            buscar();
            setInterval(buscar, 3000);
            setInterval(manter, 5000);
        }
    })
}

function manter() {
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', user);
}

function buscar() {
    let msg = {};
    axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
        .then(response => {
            conteudo.innerHTML = "";
            msg = response.data;
            for (i = 0; i < Object.keys(msg).length; i++) {
                renderMensagem(msg[i].time, msg[i].to, msg[i].from, msg[i].text, msg[i].type);
            }
        });
}

function renderMensagem(tempo, destino, usuario, msg, status) {
    if (status === "status") {
        conteudo.innerHTML += `<div class="mensagem ${status}" data-test="message">
    <p class="tempo">${tempo}</p>
    <p class="usuario">${usuario}</p>
    <p class="msg">${msg}</p>
</div>`
    }/*else if(status === "private_message" && (destino != user.name && usuario != user.name)){

    }*/
    else {
        conteudo.innerHTML += `<div class="mensagem ${status}" data-test="message">
    <p class="tempo">${tempo}</p>
    <p class="usuario">${usuario}</p>
    <p class="msg">para</p>
    <p class="usuario">${destino}</p>
    <p class="msg">${msg}</p>
</div>`
    }
}

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnEnviar").click();
    }
})

function enviar() {
    let msg = input.value;
    if (user != undefined) {
        mensagem = {
            from: user.name,
            to: destino,
            text: msg,
            type: tipo
        }
        let promisse = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", mensagem);
        promisse.then(buscar);
        promisse.catch(res => {
            window.location.reload();
        });
        input.value = "";
        window.scrollTo(0, conteudo.scrollHeight);
    }
}