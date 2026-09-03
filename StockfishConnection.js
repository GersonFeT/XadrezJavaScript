const workerBlob = new Blob(
    [
        `importScripts(
            'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js'
        );`
    ],
    { type: 'application/javascript' }
);

const stockfish = new Worker(URL.createObjectURL(workerBlob));

let callbackAtual = null;

stockfish.onmessage = function (event) {
    const mensagem = event.data;

    if (typeof mensagem === "string") {
       

        if (mensagem.startsWith("bestmove")) {
            const partes = mensagem.split(" ");
            const movimento = partes[1];

            if (
                movimento &&
                movimento !== "(none)" &&
                callbackAtual
            ) {
                const callback = callbackAtual;
                callbackAtual = null;

                callback(movimento);
            }
        }
    }
};

stockfish.onerror = function (error) {
    console.error("Erro no Stockfish:", error);
};

stockfish.postMessage("uci");
stockfish.postMessage("isready");


export function engineConversion(linha, coluna) {
    const colunas = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const linhas = ["8", "7", "6", "5", "4", "3", "2", "1"];

    return colunas[coluna] + linhas[linha];
}


export function myCodeConversion(algebraico) {
    const colunas = {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7};

    const linhas = {"8": 0, "7": 1, "6": 2, "5": 3, "4": 4, "3": 5, "2": 6, "1": 7};

    return {
        linha: linhas[algebraico[1]],
        coluna: colunas[algebraico[0]]
    };
}


export function getEngineMovement(historicoEngine, callbackEngineMovement) {

    callbackAtual = callbackEngineMovement;

    const comando =
        historicoEngine.length > 0 ? `position startpos moves ${historicoEngine.join(" ")}` : "position startpos";

    stockfish.postMessage(comando);

    stockfish.postMessage("go depth 8");
}
