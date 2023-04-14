axios.defaults.headers.common['Authorization'] = 'I83FdHEe98xJAkGy3EuLeqIk';
let user;
let destino = "Todos";
let tipo = "message";
const conteudo = document.querySelector(".conteudo");
const input = document.querySelector(".inputMessage");
const nome = document.querySelector(".inputNome");
const btnNome = document.querySelector(".btnEntrar");
const barra = document.querySelector(".barra");
const participants = document.querySelector(".participantes");
const legenda = document.querySelector(".legenda");

function entrar() {
    const usuario = nome.value;
    user = {name:usuario};
    const promessa =  axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', user);
    nome.style.display = "none";
    btnNome.style.display = "none";
    document.querySelector(".loading").style.display = "block";
    promessa.then(entrou);
    promessa.catch(naoEntrou);
}

function entrou(resp){
    if (resp.status === 200) {
        Object.freeze(user);
        buscar();
        manter();
        participantes();
        select(document.querySelector("[data-value='tipo']"));
        //setInterval(buscar, 3000);
        setInterval(manter, 5000);
        setInterval(participantes, 10000);
        document.querySelector(".telaEntrada").style.display = "none";
    }
}

function naoEntrou(resp){
    if(resp.response.status === 400){
        alert("Escolha outro nome");
        window.location.reload();
    }
}

function manter() {
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', user).catch(resp=>{
        window.location.reload();
    });
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

function participantes(){
    let part = {};
    let seleciona = false;
    axios.get("https://mock-api.driven.com.br/api/vm/uol/participants")
        .then(response => {
            participants.innerHTML = `<li data-value="participante" class="" onclick="select(this)" data-test="all"><div><ion-icon name="people-sharp"></ion-icon>Todos</div><div><ion-icon name="checkmark-sharp" class="check"></ion-icon></div></li>`;
            part = response.data;
            for (i = 0; i < Object.keys(part).length; i++) {
                if(part[i].name == user.name){

                }else if(part[i].name==destino){
                    renderParticipantes(part[i].name,"selecionado");
                    seleciona=true;
                }
                else{
                    renderParticipantes(part[i].name,"");
                }
            }
            if(seleciona==false){
                select(document.querySelector("[data-value='participante']"));
            }
        });
}

function renderMensagem(tempo, destino, usuario, msg, status) {
    if (status === "status") {
        conteudo.innerHTML += `<div class="mensagem ${status}" data-test="message">
    <p class="tempo">${tempo}</p>
    <p class="usuario">${usuario}</p>
    <div class="msg">${msg}</div>
</div>`
    }/*else if(status === "private_message" && (destino != user.name && usuario != user.name)){

    }*/
    else {
        conteudo.innerHTML += `<div class="mensagem ${status}" data-test="message">
    <p class="tempo">${tempo}</p>
    <p class="usuario">${usuario}</p>
    <p class="texto">para</p>
    <p class="usuario">${destino}</p>
    <div class="msg">${msg}</div>
</div>`
    }
}

function renderParticipantes(nome,classe){
    participants.innerHTML += `<li data-value="participante" class="${classe}" onclick="select(this)" data-test="participant"><div><ion-icon name="person-circle-sharp"></ion-icon>${nome}</div><div><ion-icon name="checkmark-sharp" class="check" data-test="check"></ion-icon></div></li>`;
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

function mostrarBarra(){
    barra.style.display = "flex";
}

function esconderBarra(){
    barra.style.display = "none";
}

function select(elemento){
    let todos = document.querySelectorAll(`[data-value=${elemento.dataset.value}]`);
    for(i=0;i<todos.length;i++){
        todos[i].classList.remove("selecionado");
    }
    elemento.classList.add("selecionado");
    if(elemento.dataset.value == 'participante'){
        destino = elemento.innerText;
    }else if(elemento.dataset.value == 'tipo'){
        if(elemento.innerText == 'Público'){
            tipo = 'message';
        }else if(elemento.innerText == 'Reservadamente'){
            tipo = 'private_message';
        }
    }
    if(destino=='Todos'&&tipo!='message'){
        select(document.querySelector("[data-value='tipo']"));
    }
    renderLegenda();
}

function renderLegenda(){
    if(tipo == "message"){
        legenda.innerHTML = `Escrevendo para ${destino}`;
    }else if(tipo == "private_message"){
        legenda.innerHTML = `Escrevendo para ${destino} (reservadamente)`;
    }
}