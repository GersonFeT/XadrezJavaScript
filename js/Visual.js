import { inicializarTabuleiro } from './Tabuleiro.js';
import { movimentoValido } from "./Movimentos.js";
import { checkValidation } from './Rei.js';

const dadosDoTabuleiro = inicializarTabuleiro();

const tabuleiroHTML = document.getElementById("tabuleiro");

const botaoPecas = document.getElementById("trocar-pecas");

const promocaoCSS = document.getElementById("promocao");

const branco = "branco";
const preto = "preto";
let promocao = 0;
let verificacaoCheque = preto;
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

    if (promocao === 1) {
        return
    }

    if (destino && destino.cor === peca.cor) {
        return false;
    }

    if (!movimentoValido(dadosDoTabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)) {
        return false;
    }

    const copiaTabuleiro = dadosDoTabuleiro.map(linha => [...linha]);

    copiaTabuleiro[fimLinha][fimColuna] = copiaTabuleiro[inicioLinha][inicioColuna];
    copiaTabuleiro[inicioLinha][inicioColuna] = null;

    if (!checkValidation(copiaTabuleiro, "branco", turno, "before")) {
        return false;
    } else if (!checkValidation(copiaTabuleiro, "preto", turno, "before")) {
        return false;
    }

    if (Math.abs(fimColuna - inicioColuna) === 1 &&
        ((fimLinha - inicioLinha === -1) || (fimLinha - inicioLinha === 1)) &&
        dadosDoTabuleiro[inicioLinha][fimColuna] &&
        dadosDoTabuleiro[inicioLinha][fimColuna].enPassant === true) {
        peca.enPassant = false;
        dadosDoTabuleiro[inicioLinha][fimColuna] = null;
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


    if (peca.tipo === "peao" && (fimLinha === 0 || fimLinha === 7)) {
        promocaoCSS.style.display = "flex";
        promocao = 1

        const botaoDama = document.getElementById("botao-dama");
        const botaoTorre = document.getElementById("botao-torre");
        const botaoBispo = document.getElementById("botao-bispo");
        const botaoCavalo = document.getElementById("botao-cavalo");


        botaoDama.addEventListener("click", () => {
            promocaoPeca(inicioLinha, inicioColuna, fimLinha, fimColuna, "dama")
        });

        botaoTorre.addEventListener("click", () => {
            promocaoPeca(inicioLinha, inicioColuna, fimLinha, fimColuna, "torre")
        });

        botaoBispo.addEventListener("click", () => {
            promocaoPeca(inicioLinha, inicioColuna, fimLinha, fimColuna, "bispo")
        });

        botaoCavalo.addEventListener("click", () => {
            promocaoPeca(inicioLinha, inicioColuna, fimLinha, fimColuna, "cavalo")
        });
    } else {
        dadosDoTabuleiro[fimLinha][fimColuna] = peca;
        dadosDoTabuleiro[inicioLinha][inicioColuna] = null;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (dadosDoTabuleiro[i][j] && dadosDoTabuleiro[i][j].tipo === "rei" &&
                    dadosDoTabuleiro[i][j].cor === turno) {
                    const rei = dadosDoTabuleiro[i][j];
                    rei.check = false;
                }
                if (dadosDoTabuleiro[i][j] && dadosDoTabuleiro[i][j].tipo === "peao" &&
                    dadosDoTabuleiro[i][j].cor != turno) {
                    const tirarPeao = dadosDoTabuleiro[i][j];
                    tirarPeao.enPassant = false
                }
            }
        }


        if (checkValidation(copiaTabuleiro, verificacaoCheque, turno, "after") === false) {
            let comecoLinha = 0;
            let comecoColuna = 0;

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (dadosDoTabuleiro[i][j] && dadosDoTabuleiro[i][j].tipo === "rei" && dadosDoTabuleiro[i][j].cor === verificacaoCheque) {
                        comecoLinha = i;
                        comecoColuna = j;
                    }
                }
            }
            const rei = dadosDoTabuleiro[comecoLinha][comecoColuna];
            rei.check = true;
        }
        

        peca.moveu = true;

        verificacaoCheque === preto ? verificacaoCheque = branco : verificacaoCheque = preto;
        turno === branco ? turno = preto : turno = branco;
    }



    atualizarTabuleiro();
}

function promocaoPeca(inicioLinha, inicioColuna, fimLinha, fimColuna, id) {
    dadosDoTabuleiro[fimLinha][fimColuna] = dadosDoTabuleiro[inicioLinha][inicioColuna]
    dadosDoTabuleiro[fimLinha][fimColuna].tipo = id;
    dadosDoTabuleiro[inicioLinha][inicioColuna] = null
    atualizarTabuleiro();
    promocaoCSS.style.display = "none";
    promocao = 0;
    turno === branco ? turno = preto : turno = branco;
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
                if (peca.check) {
                    casa.classList.add("xeque")
                }
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
