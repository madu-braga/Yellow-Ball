//var do meu game
    var canvas, ctx // desenho e contexto
    var ALTURA, LARGURA, frames=0, maxPulos = 3 // tela e contagem 

        chao = { // chão
        y: 550,
        altura: 50,
        cor: "#99d98c",

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
        cor: "#fdd103",
        gravidade: 1.5,
        velocidade: 0,
        forcaDoPulo: 22,
        QntPulos: 0,

        atualiza: function(){
            this.velocidade += this.gravidade;
            this.y += this.velocidade;

            if (this.y > chao.y - this.altura) {
                this.y = chao.y - this.altura;
                this.velocidade = 0;
            }
        },

        pula: function() {
            if (this.QntPulos < maxPulos){
                this.velocidade = -this.forcaDoPulo;
                this.QntPulos++; 
            }
        },

        desenha: function(){
            ctx.fillStyle = this.cor;
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
        }
    };

//funções do meu game
    function clique(event){
        bloco.pula();    
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

     }

    function desenha() {
        ctx.fillStyle = "#50beff";
        ctx.fillRect(0, 0, LARGURA, ALTURA);

        chao.desenha();
        bloco.desenha();
     }

    main() //chamando a função principal para começar o game



 
  