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

    if (diffLinha === 0 && (inicioColuna - fimColuna) === -2 && rei.moveu === false) {

        const torre = tabuleiro[inicioLinha][inicioColuna + 3]

        if (torre.moveu === false) {
            if(tabuleiro[inicioLinha][5] || tabuleiro[inicioLinha][6]){
                return false;
            }else{
                return true;
            }

        } else {
            return false;
        }

    } else if (diffLinha === 0 && (inicioColuna - fimColuna) === 2) {

        const torre = tabuleiro[inicioLinha][inicioColuna - 4]

        if (torre.moveu === false) {
            if(tabuleiro[inicioLinha][3] || tabuleiro[inicioLinha][2] || tabuleiro[inicioLinha][1]){
                return false;
            }else{
                return true;
            }
        } else {
            return false;
        }

    }
    if (diffLinha > 1 || diffColuna > 1) {
            return false;
        }
        return true;
}
