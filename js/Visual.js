import { inicializarTabuleiro } from './Tabuleiro.js';
import { movimentoValido } from "./Movimentos.js";
import { checkValidation } from './Rei.js';
import {
    engineConversion,
    getEngineMovement,
    myCodeConversion
} from './StockfishConnection.js';


/*
 * ============================================================
 * ESTADO PRINCIPAL
 * ============================================================
 */

const dadosDoTabuleiro = inicializarTabuleiro();

const tabuleiroHTML = document.getElementById("tabuleiro");

const botaoPecas = document.getElementById("trocar-pecas");
const botaoModo = document.getElementById("modo-jogo");
const botaoMenu = document.getElementById("btn-menu");

const menuHTML = document.getElementById("menu");
const modoDescricaoHTML = document.getElementById("modo-descricao");

const promocaoCSS = document.getElementById("promocao");

const botaoDama = document.getElementById("botao-dama");
const botaoTorre = document.getElementById("botao-torre");
const botaoBispo = document.getElementById("botao-bispo");
const botaoCavalo = document.getElementById("botao-cavalo");


const branco = "branco";
const preto = "preto";

let promocao = 0;
let verificacaoCheque = preto;
let turno = branco;

let clique1 = null;

let currentTheme = "default";


/*
 * 
 * Modos de jogo
 * 
 *
 * local:
 *     humano x humano
 *
 * stockfish:
 *     humano x Stockfish
 *
 * online:
 *     reservado para humano x humano pela internet
 *
 * O modo é salvo na URL para facilitar futuramente
 * a entrada em salas online.
 *
 * Exemplos:
 *
 *     ?modo=local
 *     ?modo=stockfish
 *     ?modo=online
 *
 * O padrão continua sendo Stockfish para preservar
 * o comportamento atual do projeto.
 */

const MODOS_JOGO = {
    LOCAL: "local",
    STOCKFISH: "stockfish",
    ONLINE: "online"
};


function obterModoInicial() {

    const parametros = new URLSearchParams(window.location.search);

    const modo = parametros.get("modo");

    if (Object.values(MODOS_JOGO).includes(modo)) {
        return modo;
    }

    return MODOS_JOGO.STOCKFISH;
}


let modoJogo = obterModoInicial();


/*
 * 
 * JOGADORES
 * 
 *
 * Esta é a parte importante para o futuro online.
 *
 * O jogo não precisa saber como um jogador funciona.
 * Ele só precisa saber quem controla cada cor.
 *
 * Futuramente:
 *
 *     branco: "online"
 *     preto: "online"
 *
 * poderá ser substituído por objetos/classes ligados
 * ao servidor WebSocket/Socket.IO.
 */

function obterJogadorDaCor(cor) {

    if (modoJogo === MODOS_JOGO.LOCAL) {
        return "humano";
    }

    if (modoJogo === MODOS_JOGO.STOCKFISH) {

        if (cor === branco) {
            return "humano";
        }

        return "stockfish";
    }

    if (modoJogo === MODOS_JOGO.ONLINE) {
        return "online";
    }

    return "humano";
}


function jogadorAtual() {
    return obterJogadorDaCor(turno);
}


function canPlayerPlayManually() {
    return jogadorAtual() === "humano";
}


function ActualPlayersStockfish() {
    return jogadorAtual() === "stockfish";
}


/*
 * ============================================================
 * MENU
 * ============================================================
 */

function atualizarInterfaceModo() {

    if (!botaoModo || !modoDescricaoHTML) {
        return;
    }

    if (modoJogo === MODOS_JOGO.LOCAL) {

        botaoModo.textContent = "Modo: Jogar sozinho";

        modoDescricaoHTML.textContent =
            "Você controla as duas cores.";

        return;
    }


    if (modoJogo === MODOS_JOGO.STOCKFISH) {

        botaoModo.textContent = "Modo: Stockfish";

        modoDescricaoHTML.textContent =
            "Você joga com as brancas contra o Stockfish.";

        return;
    }


    if (modoJogo === MODOS_JOGO.ONLINE) {

        botaoModo.textContent = "Modo: Online";

        modoDescricaoHTML.textContent =
            "Modo online reservado para a próxima versão.";
    }
}


function alterarModoJogo() {

    if (modoJogo === MODOS_JOGO.STOCKFISH) {

        modoJogo = MODOS_JOGO.LOCAL;

    } else {

        modoJogo = MODOS_JOGO.STOCKFISH;
    }


    /*
     * Reiniciar a página é intencional.
     *
     * O tabuleiro, histórico do Stockfish, turno,
     * promoção etc. precisam começar limpos quando
     * o tipo de jogador muda.
     */

    const parametros = new URLSearchParams(window.location.search);

    parametros.set("modo", modoJogo);

    window.location.search = parametros.toString();
}


if (botaoModo) {
    botaoModo.addEventListener("click", alterarModoJogo);
}


if (botaoMenu && menuHTML) {

    botaoMenu.addEventListener("click", () => {

        const menuAberto =
            menuHTML.classList.toggle("aberto");

        botaoMenu.setAttribute(
            "aria-expanded",
            menuAberto ? "true" : "false"
        );
    });
}


atualizarInterfaceModo();


/*
 * ============================================================
 * TROCA DE TEMA
 * ============================================================
 */

if (botaoPecas) {

    botaoPecas.addEventListener("click", () => {

        currentTheme =
            currentTheme === "default"
                ? "pixelart"
                : "default";

        if (currentTheme === "pixelart") {

            tabuleiroHTML.classList.add("pixelart");

        } else {

            tabuleiroHTML.classList.remove("pixelart");
        }

        atualizarTabuleiro();
    });
}


/*
 * ============================================================
 * CLIQUE NO TABULEIRO
 * ============================================================
 */

function clique(linha, coluna, casa) {

    /*
     * Se não for um jogador humano,
     * o clique do usuário não deve movimentar a peça.
     *
     * Isso também deixa o modo online preparado:
     * futuramente o servidor poderá decidir se o jogador
     * local pode ou não realizar aquele movimento.
     */

    if (!canPlayerPlayManually()) {
        return;
    }


    if (promocao === 1) {
        return;
    }


    if (clique1 === null) {

        const peca = dadosDoTabuleiro[linha][coluna];

        if (!peca) {
            return;
        }


        if (peca.cor !== turno) {
            return;
        }


        clique1 = {
            linha,
            coluna,
            elemento: casa
        };

        casa.classList.add("selecionada");

    } else {

        const destino =
            dadosDoTabuleiro[linha][coluna];

        const peca =
            dadosDoTabuleiro[
                clique1.linha
            ][
                clique1.coluna
            ];


        if (destino && peca.cor === destino.cor) {

            clique1.elemento.classList.remove(
                "selecionada"
            );

            clique1 = {
                linha,
                coluna,
                elemento: casa
            };

            casa.classList.add("selecionada");

            return;
        }


        if (
            clique1.linha === linha &&
            clique1.coluna === coluna
        ) {

            clique1.elemento.classList.remove(
                "selecionada"
            );

            clique1 = null;

            return;
        }


        const moveu = tentarMover(
            clique1.linha,
            clique1.coluna,
            linha,
            coluna
        );


        if (clique1 && clique1.elemento) {

            clique1.elemento.classList.remove(
                "selecionada"
            );
        }

        clique1 = null;


        /*
         * tentarMover() já agenda o próximo jogador.
         */
    }
}


/*
 * ============================================================
 * MOVIMENTO
 * ============================================================
 */

function tentarMover(
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna,
    promocaoEngine = null
) {

    const peca =
        dadosDoTabuleiro[inicioLinha][inicioColuna];

    const destino =
        dadosDoTabuleiro[fimLinha][fimColuna];


    if (!peca) {
        return false;
    }


    if (promocao === 1) {
        return false;
    }


    if (destino && destino.cor === peca.cor) {
        return false;
    }


    if (
        !movimentoValido(
            dadosDoTabuleiro,
            inicioLinha,
            inicioColuna,
            fimLinha,
            fimColuna
        )
    ) {
        return false;
    }


    /*
     * Cria uma cópia para validar se o movimento
     * deixaria o próprio rei em xeque.
     */

    const copiaTabuleiro =
        dadosDoTabuleiro.map(linha => [...linha]);


    copiaTabuleiro[fimLinha][fimColuna] =
        copiaTabuleiro[inicioLinha][inicioColuna];

    copiaTabuleiro[inicioLinha][inicioColuna] =
        null;


    if (
        !checkValidation(
            copiaTabuleiro,
            "branco",
            turno,
            "before"
        )
    ) {
        return false;
    }


    if (
        !checkValidation(
            copiaTabuleiro,
            "preto",
            turno,
            "before"
        )
    ) {
        return false;
    }


    /*
     * En passant
     */

    if (
        Math.abs(fimColuna - inicioColuna) === 1 &&
        (
            fimLinha - inicioLinha === -1 ||
            fimLinha - inicioLinha === 1
        ) &&
        dadosDoTabuleiro[inicioLinha][fimColuna] &&
        dadosDoTabuleiro[inicioLinha][fimColuna]
            .enPassant === true
    ) {

        peca.enPassant = false;

        dadosDoTabuleiro[inicioLinha][fimColuna] =
            null;
    }


    /*
     * Roque
     */

    if (
        peca.tipo === "rei" &&
        Math.abs(inicioColuna - fimColuna) === 2
    ) {

        if (fimColuna < inicioColuna) {

            const torre =
                dadosDoTabuleiro[inicioLinha][0];

            dadosDoTabuleiro[inicioLinha][3] =
                torre;

            dadosDoTabuleiro[inicioLinha][0] =
                null;

            if (torre) {
                torre.moveu = true;
            }

        } else {

            const torre =
                dadosDoTabuleiro[inicioLinha][7];

            dadosDoTabuleiro[inicioLinha][5] =
                torre;

            dadosDoTabuleiro[inicioLinha][7] =
                null;

            if (torre) {
                torre.moveu = true;
            }
        }
    }


    /*
     * Promoção
     *
     * Se o movimento veio do usuário,
     * o menu abre normalmente.
     *
     * Se veio do Stockfish, a peça indicada pelo UCI
     * é usada.
     */

    if (
        peca.tipo === "peao" &&
        (fimLinha === 0 || fimLinha === 7)
    ) {

        if (promocaoEngine) {

            finalizarPromocao(
                inicioLinha,
                inicioColuna,
                fimLinha,
                fimColuna,
                promocaoEngine
            );

        } else {

            abrirPromocao(
                inicioLinha,
                inicioColuna,
                fimLinha,
                fimColuna
            );
        }

    } else {

        finalizarMovimento(
            inicioLinha,
            inicioColuna,
            fimLinha,
            fimColuna
        );
    }


    return true;
}


/*
 * ============================================================
 * FINALIZA MOVIMENTO
 * ============================================================
 */

function finalizarMovimento(
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna
) {

    const peca =
        dadosDoTabuleiro[inicioLinha][inicioColuna];


    const inicioEngine =
        engineConversion(
            inicioLinha,
            inicioColuna
        );

    const fimEngine =
        engineConversion(
            fimLinha,
            fimColuna
        );


    /*
     * O histórico em UCI é mantido mesmo no modo local.
     *
     * Isso permite trocar para Stockfish durante uma
     * futura reconstrução da partida sem precisar criar
     * outro formato de histórico.
     */

    historicoEngine.push(
        inicioEngine + fimEngine
    );


    dadosDoTabuleiro[fimLinha][fimColuna] =
        peca;

    dadosDoTabuleiro[inicioLinha][inicioColuna] =
        null;


    atualizarEstadoDepoisDoMovimento(
        peca
    );


    atualizarTabuleiro();


    /*
     * Agora o controle passa para o próximo jogador.
     */

    agendarJogadorDaVez();
}


/*
 * ============================================================
 * PROMOÇÃO
 * ============================================================
 */

let promocaoPendente = null;


function abrirPromocao(
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna
) {

    promocaoPendente = {
        inicioLinha,
        inicioColuna,
        fimLinha,
        fimColuna
    };


    promocao = 1;

    promocaoCSS.style.display = "flex";
}


function finalizarPromocao(
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna,
    tipoPromocao
) {

    const peca =
        dadosDoTabuleiro[inicioLinha][inicioColuna];


    if (!peca) {
        return;
    }


    /*
     * Registra o movimento no formato UCI.
     *
     * dama  -> q
     * torre -> r
     * bispo -> b
     * cavalo -> n
     */

    const conversaoPromocao = {
        dama: "q",
        torre: "r",
        bispo: "b",
        cavalo: "n"
    };


    const inicioEngine =
        engineConversion(
            inicioLinha,
            inicioColuna
        );

    const fimEngine =
        engineConversion(
            fimLinha,
            fimColuna
        );


    const codigoPromocao =
        conversaoPromocao[tipoPromocao];


    if (codigoPromocao) {

        historicoEngine.push(
            inicioEngine +
            fimEngine +
            codigoPromocao
        );
    }


    dadosDoTabuleiro[fimLinha][fimColuna] =
        peca;

    dadosDoTabuleiro[inicioLinha][inicioColuna] =
        null;


    peca.tipo = tipoPromocao;
    peca.moveu = true;


    promocaoPendente = null;
    promocao = 0;


    if (promocaoCSS) {
        promocaoCSS.style.display = "none";
    }


    atualizarEstadoDepoisDoMovimento(
        peca
    );


    atualizarTabuleiro();


    /*
     * Depois da promoção, o próximo jogador assume.
     */

    agendarJogadorDaVez();
}


function promocaoPeca(
    tipo
) {

    if (!promocaoPendente) {
        return;
    }


    const {
        inicioLinha,
        inicioColuna,
        fimLinha,
        fimColuna
    } = promocaoPendente;


    finalizarPromocao(
        inicioLinha,
        inicioColuna,
        fimLinha,
        fimColuna,
        tipo
    );
}


/*
 * Botões de promoção.
 *
 * Os listeners são registrados uma única vez.
 */

botaoDama.addEventListener(
    "click",
    () => promocaoPeca("dama")
);

botaoTorre.addEventListener(
    "click",
    () => promocaoPeca("torre")
);

botaoBispo.addEventListener(
    "click",
    () => promocaoPeca("bispo")
);

botaoCavalo.addEventListener(
    "click",
    () => promocaoPeca("cavalo")
);


/*
 * ============================================================
 * ESTADO DEPOIS DO MOVIMENTO
 * ============================================================
 */

function atualizarEstadoDepoisDoMovimento(peca) {

    /*
     * Limpa marcações de xeque do rei da vez anterior.
     */

    for (let i = 0; i < 8; i++) {

        for (let j = 0; j < 8; j++) {

            const pecaAtual =
                dadosDoTabuleiro[i][j];


            if (
                pecaAtual &&
                pecaAtual.tipo === "rei" &&
                pecaAtual.cor === turno
            ) {

                pecaAtual.check = false;
            }


            if (
                pecaAtual &&
                pecaAtual.tipo === "peao" &&
                pecaAtual.cor !== turno
            ) {

                pecaAtual.enPassant = false;
            }
        }
    }


    /*
     * Verifica xeque no próximo estado.
     */

    if (
        checkValidation(
            dadosDoTabuleiro,
            verificacaoCheque,
            turno,
            "after"
        ) === false
    ) {

        let comecoLinha = 0;
        let comecoColuna = 0;


        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 8; j++) {

                const pecaAtual =
                    dadosDoTabuleiro[i][j];


                if (
                    pecaAtual &&
                    pecaAtual.tipo === "rei" &&
                    pecaAtual.cor === verificacaoCheque
                ) {

                    comecoLinha = i;
                    comecoColuna = j;
                }
            }
        }


        const rei =
            dadosDoTabuleiro[
                comecoLinha
            ][
                comecoColuna
            ];


        if (rei) {
            rei.check = true;
        }
    }


    if (peca) {
        peca.moveu = true;
    }


    verificacaoCheque =
        verificacaoCheque === preto
            ? branco
            : preto;


    turno =
        turno === branco
            ? preto
            : branco;
}


/*
 * ============================================================
 * CONTROLE DO JOGADOR
 * ============================================================
 *
 * Este é o ponto central para o futuro online.
 *
 * Hoje:
 *
 *     humano
 *     stockfish
 *
 * Futuramente:
 *
 *     online
 *
 * O restante do jogo não precisa saber como o jogador
 * remoto será implementado.
 */

function agendarJogadorDaVez() {

    if (ActualPlayersStockfish()) {

        setTimeout(
            engineMoveExecution,
            250
        );

        return;
    }


    /*
     * No modo local não fazemos absolutamente nada.
     *
     * O usuário poderá clicar para jogar a próxima cor.
     *
     * No futuro, "online" poderá chamar aqui a conexão
     * com o servidor ou simplesmente aguardar uma mensagem
     * recebida pelo socket.
     */
}


/*
 * ============================================================
 * STOCKFISH
 * ============================================================
 */

const historicoEngine = [];


function engineMoveExecution() {

    /*
     * Segurança:
     * nunca executa Stockfish fora do modo correto.
     */

    if (!ActualPlayersStockfish()) {
        return;
    }


    getEngineMovement(
        historicoEngine,
        (EngineMovement) => {

            if (!EngineMovement) {
                return;
            }


            const inicioStrEngine =
                EngineMovement.substring(0, 2);

            const fimStrEngine =
                EngineMovement.substring(2, 4);


            const inicio =
                myCodeConversion(
                    inicioStrEngine
                );

            const fim =
                myCodeConversion(
                    fimStrEngine
                );


            /*
             * O quinto caractere do UCI indica promoção.
             *
             * e7e8q
             * e7e8r
             * e7e8b
             * e7e8n
             */

            const promocaoEngine =
                EngineMovement.length >= 5
                    ? converterPromocaoEngine(
                        EngineMovement[4]
                    )
                    : null;


            tentarMover(
                inicio.linha,
                inicio.coluna,
                fim.linha,
                fim.coluna,
                promocaoEngine
            );
        }
    );
}


function converterPromocaoEngine(codigo) {

    const conversao = {
        q: "dama",
        r: "torre",
        b: "bispo",
        n: "cavalo"
    };


    return conversao[codigo] || null;
}


/*
 * ============================================================
 * TABULEIRO
 * ============================================================
 */

function coisarTabuleiro() {

    for (let linha = 0; linha < 8; linha++) {

        for (let coluna = 0; coluna < 8; coluna++) {

            const peca =
                dadosDoTabuleiro[linha][coluna];


            const casa =
                document.createElement("div");


            casa.addEventListener(
                "click",
                () => {
                    clique(
                        linha,
                        coluna,
                        casa
                    );
                }
            );


            if (peca) {

                casa.classList.add("peca");

                casa.classList.add(
                    peca.tipo
                );

                casa.classList.add(
                    peca.cor
                );

                casa.classList.add(
                    currentTheme
                );


                if (peca.check) {

                    casa.classList.add(
                        "xeque"
                    );
                }
            }


            casa.dataset.linha = linha;
            casa.dataset.coluna = coluna;


            if (
                (linha + coluna) % 2 === 0
            ) {

                casa.classList.add(
                    "casabranca"
                );

            } else {

                casa.classList.add(
                    "casapreta"
                );
            }


            if (currentTheme === "pixelart") {

                casa.classList.add(
                    "pixelart"
                );
            }


            tabuleiroHTML.appendChild(
                casa
            );
        }
    }
}


function atualizarTabuleiro() {

    tabuleiroHTML.innerHTML = "";

    coisarTabuleiro();
}


/*
 * ============================================================
 * INICIALIZAÇÃO
 * ============================================================
 */

coisarTabuleiro();


/*
 * Se o modo inicial for Stockfish, o jogador das brancas
 * é humano, portanto não iniciamos o engine.
 *
 * Se futuramente houver um modo em que o Stockfish seja
 * branco, esta mesma função poderá iniciar automaticamente.
 */

if (ActualPlayersStockfish()) {
    agendarJogadorDaVez();
}
