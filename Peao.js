export function validarPeao(tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna) {
    const peca = tabuleiro[inicioLinha][inicioColuna];
    if (!peca) return false;

    const direcao = peca.cor === "branco" ? -1 : 1;
    const linhaInicial = peca.cor === "branco" ? 6 : 1;

    const diffLinha = fimLinha - inicioLinha;
    const diffColuna = fimColuna - inicioColuna;

    const destino = tabuleiro[fimLinha][fimColuna];


    if (diffColuna === 0 &&
        diffLinha === direcao &&
        !destino) {return true;}
    
    if (inicioLinha === linhaInicial &&
        diffColuna === 0 &&
        diffLinha === direcao * 2 &&
        !destino &&
        !tabuleiro[inicioLinha + direcao][inicioColuna]) {return true;}
    
    if (Math.abs(diffColuna) === 1 &&
        diffLinha === direcao &&
        destino &&
        destino.cor !== peca.cor) {return true;}

    return false;
}