export function validarRei(tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna) {
    let diffLinha = Math.abs(inicioLinha - fimLinha)
    let diffColuna = Math.abs(inicioColuna - fimColuna)

    const rei = tabuleiro[inicioLinha][inicioColuna];
    if (!rei) return false;
    const corRei = rei.cor;


    const destino = tabuleiro[fimLinha][fimColuna];
    if (destino && destino.cor === corRei) { return false; }
    
    if(diffLinha === 0 && diffColuna === 2 && rei.moveu === false){
        console.log("asdasdasdasd")
    }

    if (diffLinha > 1 || diffColuna > 1) {
        return false;
    }
    return true;
}