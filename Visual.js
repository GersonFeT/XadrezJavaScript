import { inicializarTabuleiro } from './Tabuleiro.js';
import { movimentoValido } from "./Movimentos.js";

const dadosDoTabuleiro = inicializarTabuleiro();

const tabuleiroHTML = document.getElementById("tabuleiro");

let clique1 = null;

function clique(linha, coluna, casa) {
    if (clique1 === null) {
        const peca = dadosDoTabuleiro[linha][coluna];
        if (peca) {
            clique1 = { linha, coluna, elemento: casa };
            casa.classList.add("selecionada");
        }
    } else {
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

    const podeMover = movimentoValido(
        dadosDoTabuleiro,
        inicioLinha,
        inicioColuna,
        fimLinha,
        fimColuna
    );

    if (!podeMover) {
        return;
    }

  
    const peca = dadosDoTabuleiro[inicioLinha][inicioColuna];

    
    dadosDoTabuleiro[fimLinha][fimColuna] = peca;
    dadosDoTabuleiro[inicioLinha][inicioColuna] = null;

    
    peca.moveu = true;

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
            }

            casa.dataset.linha = linha;
            casa.dataset.coluna = coluna;

            if ((linha + coluna) % 2 === 0) {
                casa.classList.add("casabranca");
            } else {
                casa.classList.add("casapreta");
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