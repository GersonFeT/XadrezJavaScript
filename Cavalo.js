export function validarCavalo(tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna) {

    let diffLinha = Math.abs(inicioLinha - fimLinha);
    let diffColuna = Math.abs(inicioColuna - fimColuna);

    /*coluna+-2 linha+-1 || cooluna+-1 linha+-2*/


    const peca = tabuleiro[inicioLinha][inicioColuna];
    if (!peca) return false;
    const corCavalo = peca.cor;
    

    const destino = tabuleiro[fimLinha][fimColuna];
    if (destino && destino.cor === corCavalo) { return false; }
    

    if (diffLinha === 2 && diffColuna === 1 || diffLinha === 1 && diffColuna === 2) {
        return true;
    }
    return false;
}