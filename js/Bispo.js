export function validarBispo(tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna) {
    
    let distancia = 0;
    let passeColuna = 0;
    let passeLinha = 0;
    let diffColuna = (fimColuna - inicioColuna);
    let diffLinha = (fimLinha - inicioLinha);


    if (Math.abs(diffColuna) !== Math.abs(diffLinha)) { return false; }

    distancia = Math.abs(diffColuna)

    for (let i = 1; i < distancia; i++) {
        
        fimColuna > inicioColuna ? passeColuna = 1 : passeColuna = -1;
        fimLinha > inicioLinha ? passeLinha = 1 : passeLinha = -1;

        const linhaAtual = inicioLinha + passeLinha * i;
        const colunaAtual = inicioColuna + passeColuna * i;
        if (tabuleiro[linhaAtual][colunaAtual] !== null) { return false }
    }
    return true;
}
