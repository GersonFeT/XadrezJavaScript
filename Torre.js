export function validarTorre(tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna) {

    let distancia = 0;
    let passeColuna = 0;
    let passeLinha = 0;
    let diffColuna = Math.abs(fimColuna - inicioColuna);
    let diffLinha = Math.abs(fimLinha - inicioLinha);

    if (inicioLinha !== fimLinha && inicioColuna !== fimColuna) {return false;}

    const peca = tabuleiro[inicioLinha][inicioColuna];
    if (!peca) return false;
    const corTorre = peca.cor;

    
    const destino = tabuleiro[fimLinha][fimColuna];
    if (destino && destino.cor === corTorre) {
        return false; 
    }

    diffColuna > diffLinha ? distancia = diffColuna : distancia = diffLinha
    
    for (let i = 1; i < distancia; i++) {

        fimColuna === inicioColuna ? passeColuna = 0 : fimColuna > inicioColuna ? passeColuna = 1 : passeColuna = -1;
        fimLinha === inicioLinha ? passeLinha = 0 : fimLinha > inicioLinha ? passeLinha = 1 : passeLinha = -1;

        const linhaAtual = inicioLinha + passeLinha * i;
        const colunaAtual = inicioColuna + passeColuna * i;

        if (tabuleiro[linhaAtual][colunaAtual] !== null) { return false; }
    }
    
    return true;

}