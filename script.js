//var do meu game
var canvas, ctx; // desenho e contexto
var ALTURA, LARGURA, frames=0, maxPulos = 3, velocidade = 6; // tela e contagem 
var estadoAtual, record, 



    chao = { // chão
    y: 550,
    altura: 50,
    cor: "#7cfc00",

    desenha: function(){ // criando método pro objeto
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, this.altura);

    }
},

bloco = {
    x: 50,
    y: 0,
    altura: 50,
    largura: 50,
    cor: "#ffdb18",
    gravidade: 1.5,
    velocidade: 0,
    forcaDoPulo: 22,
    qntPulos: 0,
    score: 0,

    atualiza: function(){
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
            this.y = chao.y - this.altura;
            this.qntPulos = 0;
            this.velocidade = 0;
        }
    },

    pula: function() {
        if (this.qntPulos < maxPulos){
            this.velocidade = -this.forcaDoPulo;
            this.qntPulos++; 
        }
    },

    reset: function(){
        this.velocidade = 0;
        this.y = 0;

        if(this.score > record){
            localStorage.setItem("record", this.score);
            record = this.score;
        }

        this.score = 0;
    },

    desenha: function(){
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
},

obstaculos = {
    _obs: [],
    cores: ["#218380", "#52796f", "#774936", "#7f5539", "#9c6644", "#0b525b"],
    tempoInsere: 0,

    insere: function(){
        this._obs.push({
            x: LARGURA,
            largura: 50,
            altura: 30 + Math.floor(120 * Math.random()), 
            cor: this.cores[Math.floor(6 * Math.random())],
        });
        if(bloco.score < 9){
            this.tempoInsere = 50;
        }
        else if(bloco.score >= 9 && bloco.score < 29){
            this.tempoInsere = 48;
        }
        else if(bloco.score >= 29 && bloco.score < 49){
            this.tempoInsere = 47;
        }
        else{
            this.tempoInsere = 46;
        }
    },

    atualiza: function(){
        if(this.tempoInsere == 0)
            this.insere();
        else
            this.tempoInsere--;

        for (var i = 0, tam=this._obs.length - 1; i < tam; i++) {
            var obs = this._obs[i];

            obs.x -= velocidade;

            if(bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && 
                bloco.y + bloco.altura >= chao.y - obs.altura){
                estadoAtual = estados.perdeu;
            }

            else if(obs.x == 0){
                bloco.score++;
            }

            else if(obs.x <= -obs.largura){
                this._obs.splice(i, 1); 
                tam--;
                i--;
            }
        }
    },

    limpa: function(){
        this._obs = [];
    },

    desenha: function(){
        tam = this._obs.length;

        for (var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i];

                ctx.fillStyle = obs.cor;
                ctx.fillRect( obs.x, chao.y - obs.altura, obs.largura, obs.altura);
        }
    }
};

//funções do meu game
function clique(event){
    if(estadoAtual == estados.jogando){
        bloco.pula();    
    }
    else if(estadoAtual == estados.jogar){
        estadoAtual = estados.jogando;
    }
    else if(estadoAtual == estados.perdeu){
        estadoAtual = estados.jogar;
        obstaculos.limpa();
        bloco.reset()
    }
}

function main(){ //funções de minha engine, principal
    ALTURA = window.innerHeight; //tamanho da janela do usuário
    LARGURA = window.innerWidth; //tamanho da janela do usuário

    if (LARGURA >= 500){ //se a largura for menor ou igual 500px forçar ela a ter um valor fixo
        LARGURA = 600;
        ALTURA = 600;
    }

    canvas = document.createElement("canvas");
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000";

    ctx = canvas.getContext("2d");

    document.body.appendChild(canvas);

    document.addEventListener("mousedown",clique);

    estadoAtual = estados.jogar;
    record = localStorage.getItem("record");

    if (record == null){
        record = 0;
    }

    roda();
 }

function roda() {
    atualiza();
    desenha();

    window.requestAnimationFrame(roda);

 }

function atualiza() {
    frames++;

    bloco.atualiza();

    if(estadoAtual == estados.jogando){
        obstaculos.atualiza();
    }
    
 }

function desenha() {
    ctx.fillStyle = "#50beff";
    ctx.fillRect(0, 0, LARGURA, ALTURA);
    chao.desenha();

    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText(bloco.score, 28, 62);
  
    if(estadoAtual == estados.jogar){
        ctx.fillStyle = "green";
        ctx.fillRect(LARGURA/2 - 50, ALTURA/2 - 50, 100, 100);
    }
    
    else if(estadoAtual == estados.perdeu){
        ctx.fillStyle = "red";
        ctx.fillRect(LARGURA/2 - 50, ALTURA/2 - 50, 100, 100)

        ctx.save();
        ctx.translate(LARGURA/2, ALTURA/2);
        ctx.fillStyle = "#fff";
        ctx.font = "50px Arial";

        if(bloco.score > record){
            ctx.fillText("Novo Record!", -150, -65);
        }

        else if(record < 10){
            ctx.fillText("Record " + record, -99, -65);
        }

        else if(record >= 10 && record < 10){
            ctx.fillText("Record " + record, -122, -65);
        }

        else{
            ctx.fillText("Record " + record, -125, -65);
        }

        if(bloco.score < 10){
            ctx.fillText(bloco.score, -14, 18);
        }
        else if(bloco.score >= 10 && bloco.score < 100){
            ctx.fillText(bloco.score, -28, 18);
        }
        else {
            ctx.fillText(bloco.score, -42, 18);
        }

        ctx.restore();
    }

    else if(estadoAtual == estados.jogando){
        obstaculos.desenha();
        chao.desenha();
        bloco.desenha();
    }

    obstaculos.desenha();
    bloco.desenha();
 }

main() //chamando a função principal para começar o game
