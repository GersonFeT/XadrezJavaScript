export function validarCavalo(tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna) {

    let diffLinha = Math.abs(inicioLinha - fimLinha);
    let diffColuna = Math.abs(inicioColuna - fimColuna);

    if (diffLinha === 2 && diffColuna === 1 || diffLinha === 1 && diffColuna === 2) {
        return true;
    }
    return false;
}
