import { inicializarTabuleiro } from './Tabuleiro.js';
import { movimentoValido } from "./Movimentos.js";

const dadosDoTabuleiro = inicializarTabuleiro();

const tabuleiroHTML = document.getElementById("tabuleiro");

const botaoPecas = document.getElementById("trocar-pecas");

const promocaoCSS = document.getElementById("promocao");

const branco = "branco";
const preto = "preto";
let turno = branco;

let clique1 = null;

let currentTheme = 'default';

botaoPecas.addEventListener('click', () => {
    currentTheme = (currentTheme === 'default') ? 'pixelart' : 'default';
    if (currentTheme === 'pixelart') {
        tabuleiroHTML.classList.add('pixelart');
    } else {
        tabuleiroHTML.classList.remove('pixelart');
    }
    atualizarTabuleiro();
});

function clique(linha, coluna, casa) {
    if (clique1 === null) {
        const peca = dadosDoTabuleiro[linha][coluna];
        if (peca) {
            if (peca.cor !== turno) {
                return
            }
            clique1 = { linha, coluna, elemento: casa };
            casa.classList.add("selecionada");

        }
    } else {
        const destino = dadosDoTabuleiro[linha][coluna];
        const peca = dadosDoTabuleiro[clique1.linha][clique1.coluna];

        if (destino && peca.cor === destino.cor) {
            clique1.elemento.classList.remove("selecionada");
            clique1 = { linha, coluna, elemento: casa };
            casa.classList.add("selecionada");
            return;
        }
        if (
            clique1.linha === linha &&
            clique1.coluna === coluna
        ) {
            clique1.elemento.classList.remove("selecionada");
            clique1 = null;
            return;
        }
        tentarMover(clique1.linha, clique1.coluna, linha, coluna);

        clique1.elemento.classList.remove("selecionada");
        clique1 = null;
    }

}

function tentarMover(inicioLinha, inicioColuna, fimLinha, fimColuna) {

    const peca = dadosDoTabuleiro[inicioLinha][inicioColuna];
    const destino = dadosDoTabuleiro[fimLinha][fimColuna];

    if (destino && destino.cor === peca.cor) {
        return false
    }

    if (!movimentoValido(dadosDoTabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)) {
        return false;
    }



    if (destino && destino.cor === peca.cor) {
        return false
    }

    if (peca.tipo === "peao" && (fimLinha === 0 || fimLinha === 7)) {
        for(let i = 1; i <= 4; i++){
            const divpeca = document.createElement("div");
            
            if(peca.cor === "branco"){
                switch(i){
                    case 1: currentTheme === 'default'? divpeca.classList.add("opcao-promocao", "peca", "dama", "branco", "default")
                    :promocaoCSS.classList.add("opcao-promocao", "peca", "dama", "branco", "pixelart");
                    break; 

                    case 2: currentTheme === 'default'? divpeca.classList.add("opcao-promocao", "peca", "torre", "branco", "default")
                    :promocaoCSS.classList.add("opcao-promocao", "peca", "torre", "branco", "pixelart");
                    break;

                    case 3: currentTheme === 'default'? divpeca.classList.add("opcao-promocao", "peca", "bispo", "branco", "default")
                    :promocaoCSS.classList.add("opcao-promocao", "peca", "bispo", "branco", "pixelart");
                    break;

                    case 4: currentTheme === 'default'? divpeca.classList.add("opcao-promocao", "peca", "cavalo", "branco", "default")
                    :promocaoCSS.classList.add("opcao-promocao", "peca", "cavalo", "branco", "pixelart");
                    break;
                }
            } else{
                switch(i){
                    case 1: currentTheme === 'default'? divpeca.classList.add("opcao-promocao", "peca", "dama", "preto", "default")
                    :promocaoCSS.classList.add("opcao-promocao", "peca", "dama", "preto", "pixelart");
                    break; 

                    case 2: currentTheme === 'default'? divpeca.classList.add("opcao-promocao", "peca", "torre", "preto", "default")
                    :promocaoCSS.classList.add("opcao-promocao", "peca", "torre", "preto", "pixelart");
                    break;

                    case 3: currentTheme === 'default'? divpeca.classList.add("opcao-promocao", "peca", "bispo", "preto", "default")
                    :promocaoCSS.classList.add("opcao-promocao", "peca", "bispo", "preto", "pixelart");
                    break;

                    case 4: currentTheme === 'default'? divpeca.classList.add("opcao-promocao", "peca", "cavalo", "preto", "default")
                    :promocaoCSS.classList.add("opcao-promocao", "peca", "cavalo", "preto", "pixelart");
                    break;
                }
            }
            promocaoCSS.appendChild(divpeca);
        }
    }

    if (peca.tipo === "rei" && Math.abs(inicioColuna - fimColuna) === 2) {

        if (fimColuna < inicioColuna) {
            const torre = dadosDoTabuleiro[inicioLinha][0];
            dadosDoTabuleiro[inicioLinha][3] = torre;
            dadosDoTabuleiro[inicioLinha][0] = null;
            if (torre) torre.moveu = true;
        }

        else {
            const torre = dadosDoTabuleiro[inicioLinha][7];
            dadosDoTabuleiro[inicioLinha][5] = torre;
            dadosDoTabuleiro[inicioLinha][7] = null;
            if (torre) torre.moveu = true;
        }
    }



    dadosDoTabuleiro[fimLinha][fimColuna] = peca;
    dadosDoTabuleiro[inicioLinha][inicioColuna] = null;


    peca.moveu = true;

    turno === branco ? turno = preto : turno = branco;

    atualizarTabuleiro();
}

function coisarTabuleiro() {
    for (let linha = 0; linha < 8; linha++) {

        for (let coluna = 0; coluna < 8; coluna++) {

            const peca = dadosDoTabuleiro[linha][coluna];

            const casa = document.createElement("div");
            casa.addEventListener("click", () => {
                clique(linha, coluna, casa);
            });

            if (peca) {
                casa.classList.add("peca")
                casa.classList.add(peca.tipo)
                casa.classList.add(peca.cor)
                casa.classList.add(currentTheme);
            }

            casa.dataset.linha = linha;
            casa.dataset.coluna = coluna;

            if ((linha + coluna) % 2 === 0) {
                casa.classList.add("casabranca");
            } else {
                casa.classList.add("casapreta");
            }
            if (currentTheme === "pixelart") {
                casa.classList.add("pixelart")
            }

            tabuleiroHTML.appendChild(casa);
        }
    }
}
function atualizarTabuleiro() {
    tabuleiroHTML.innerHTML = "";
    coisarTabuleiro();
}



coisarTabuleiro();
