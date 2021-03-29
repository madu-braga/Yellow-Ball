
       


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
                largura: 30 + Math.floor(21 * Math.random()), 
                altura: 30 + Math.floor(120 * Math.random()), 
                cor: this.cores[Math.floor(6 * Math.random())],
            });
            this.tempoInsere = 50;
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
            bloco.velocidade = 0;
            bloco.y = 0;
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
        else if(estadoAtual == estados.perdeu){
            obstaculos.limpa();
        }
     }

    function desenha() {
        ctx.fillStyle = "#50beff";
        ctx.fillRect(0, 0, LARGURA, ALTURA);

        chao.desenha();
        if(estadoAtual == estados.jogar){
            ctx.fillStyle = "green";
            ctx.fillRect(LARGURA/2 - 50, ALTURA/2 - 50, 100, 100);
        }
        
        else if(estadoAtual == estados.perdeu){
            ctx.fillStyle = "red";
            ctx.fillRect(LARGURA/2 - 50, ALTURA/2 - 50, 100, 100)
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
