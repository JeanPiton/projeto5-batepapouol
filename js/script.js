axios.defaults.headers.common['Authorization'] = 'I83FdHEe98xJAkGy3EuLeqIk';
let user;
const conteudo = document.querySelector(".conteudo");
let mensagem;
let destino = "Todos";
let tempo;

entrar();
setInterval(manter, 5000);

function entrar() {
    let usuario = { name: prompt("Nome de usuário:") };
    const promessa = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', usuario);
    promessa.catch(entrar);
    promessa.then((resp) => {
        if (resp.status == 200) {
            user = usuario;
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
            msg = response.data;
            for (i = 0; i < Object.keys(msg).length; i++) {
                renderMensagem(msg[i].time, msg[i].to, msg[i].from, msg[i].text, msg[i].type);
            }
        });
}

function renderMensagem(tempo, destino, usuario, msg, status) {
    if (status === "status") {
        conteudo.innerHTML += `<div class="mensagem ${status}">
    <p class="tempo">${tempo}</p>
    <p class="usuario">${usuario}</p>
    <p class="msg">${msg}</p>
</div>`
    }
    else {
        conteudo.innerHTML += `<div class="mensagem ${status}">
    <p class="tempo">${tempo}</p>
    <p class="usuario">${usuario}</p>
    <p class="msg">para</p>
    <p class="usuario">${destino}</p>
    <p class="msg">${msg}</p>
</div>`
    }
}