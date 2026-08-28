export function validarRei(tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna) {
    let diffLinha = Math.abs(inicioLinha - fimLinha)
    let diffColuna = Math.abs(inicioColuna - fimColuna)
    const rei = tabuleiro[inicioLinha][inicioColuna]

    if (diffLinha === 0 && (inicioColuna - fimColuna) === -2 && rei.moveu === false) {

        const torre = tabuleiro[inicioLinha][inicioColuna + 3]

        if (torre.moveu === false) {
            if (tabuleiro[inicioLinha][5] || tabuleiro[inicioLinha][6]) {
                return false;
            } else {
                return true;
            }

        } else {
            return false;
        }

    } else if (diffLinha === 0 && (inicioColuna - fimColuna) === 2) {

        const torre = tabuleiro[inicioLinha][inicioColuna - 4]

        if (torre.moveu === false) {
            if (tabuleiro[inicioLinha][3] || tabuleiro[inicioLinha][2] || tabuleiro[inicioLinha][1]) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    const direcoes = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [linha, coluna] of direcoes) {
        for (let i = 1; i < tabuleiro.length; i++) {
            const linhaAtual = fimLinha + (linha * i);
            const colunaAtual = fimColuna + (coluna * i);


            if (linhaAtual > 7 || linhaAtual < 0 || colunaAtual > 7 || colunaAtual < 0) { break; }

            if (tabuleiro[linhaAtual][colunaAtual] != null) {
                const destino = tabuleiro[linhaAtual][colunaAtual];

                if (rei.cor === destino.cor) { break; }

                if (destino.tipo === "peao" || destino.tipo === "cavalo" || destino.tipo === "rei") { break; }

                if (Math.abs(linhaAtual - fimLinha) === Math.abs(colunaAtual - fimColuna) &&
                    (destino.tipo === "dama" || destino.tipo === "bispo")) {
                    console.log("sadasdasd | " + linhaAtual + "|" + colunaAtual)
                    return false;
                } else if (
                    (destino.tipo === "dama" || destino.tipo === "torre")) {
                    console.log("poweproiwed | " + linhaAtual + "|" + colunaAtual)
                    return false;
                }
            }
        }
    }

    const direcoesCavalo = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [linha, coluna] of direcoesCavalo) {
        const linhaAtual = fimLinha + linha;
        const colunaAtual = fimColuna + coluna;
        if (linhaAtual > 7 || linhaAtual < 0 || colunaAtual > 7 || colunaAtual < 0) { break; }

        if (tabuleiro[linhaAtual][colunaAtual] !== null && tabuleiro[linhaAtual][colunaAtual].tipo === "cavalo" && tabuleiro[linhaAtual][colunaAtual].cor != rei.cor) { return false; }
    }

    if (rei.cor === "branco") {
        if (tabuleiro[fimLinha - 1][fimColuna - 1] && tabuleiro[fimLinha - 1][fimColuna - 1].tipo === "peao" && tabuleiro[fimLinha - 1][fimColuna - 1].cor === "preto" ||
            (tabuleiro[fimLinha - 1][fimColuna + 1] && tabuleiro[fimLinha - 1][fimColuna + 1].tipo === "peao" && tabuleiro[fimLinha - 1][fimColuna + 1].cor === "preto")
        ) {
            return false;
        }
    } else if (rei.cor === "preto") {
        if (tabuleiro[fimLinha + 1][fimColuna - 1] && tabuleiro[fimLinha + 1][fimColuna - 1].tipo === "peao" && tabuleiro[fimLinha + 1][fimColuna - 1].cor === "branco" ||
            (tabuleiro[fimLinha + 1][fimColuna + 1] && tabuleiro[fimLinha + 1][fimColuna + 1].tipo === "peao" && tabuleiro[fimLinha + 1][fimColuna + 1].cor === "branco")
        ) {
            return false;
        }
    }


    if (diffLinha > 1 || diffColuna > 1) {
        return false;
    }
    return true;
}

export function checkValidation(tabuleiro, id, turno, when) {
    let comecoLinha = 0;
    let comecoColuna = 0;

    console.log(id)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (tabuleiro[i][j] && tabuleiro[i][j].tipo === "rei" && tabuleiro[i][j].cor === id) {
                comecoLinha = i;
                comecoColuna = j;
            }
        }
    }

    const rei = tabuleiro[comecoLinha][comecoColuna];

    const direcoes = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [linha, coluna] of direcoes) {
        for (let i = 1; i < tabuleiro.length; i++) {
            const linhaAtual = comecoLinha + (linha * i);
            const colunaAtual = comecoColuna + (coluna * i);


            if (linhaAtual > 7 || linhaAtual < 0 || colunaAtual > 7 || colunaAtual < 0) { break; }

            if (tabuleiro[linhaAtual][colunaAtual] != null) {
                const destino = tabuleiro[linhaAtual][colunaAtual];

                if (rei.cor === destino.cor) { break; }

                if (destino.tipo === "peao" || destino.tipo === "cavalo" || destino.tipo === "rei") { break; }

                if (Math.abs(linhaAtual - comecoLinha) === Math.abs(colunaAtual - comecoColuna) &&
                    (destino.tipo === "dama" || destino.tipo === "bispo")) {
                    if (turno === id && when === "before") {
                        return false;
                    } else if (turno != id && when === "after") {
                        return false;
                    }
                } else if (Math.abs(linhaAtual - comecoLinha) === Math.abs(colunaAtual - comecoColuna) &&
                    (destino.tipo === "torre")) {
                        break;
                } else if (linha === 0 || coluna === 0 && 
                    (destino.tipo === "dama" || destino.tipo === "torre")) {
                    if (turno === id) {
                        return false;
                    } else if (turno != id && when === "after") {
                        return false;
                    }
                } else if (linha === 0 || coluna === 0 &&
                        (destino.tipo === "bispo")){
                            break;
                        }
                {

                }

            }
        }
    }

    const direcoesCavalo = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [linha, coluna] of direcoesCavalo) {
        const linhaAtual = comecoLinha + linha;
        const colunaAtual = comecoColuna + coluna;
        if (linhaAtual > 7 || linhaAtual < 0 || colunaAtual > 7 || colunaAtual < 0) { break; }

        if (tabuleiro[linhaAtual][colunaAtual] !== null && tabuleiro[linhaAtual][colunaAtual].tipo === "cavalo" && tabuleiro[linhaAtual][colunaAtual].cor != rei.cor) { return false; }
    }

    if (rei.cor === "branco") {
        if (tabuleiro[comecoLinha - 1][comecoColuna - 1] && tabuleiro[comecoLinha - 1][comecoColuna - 1].tipo === "peao" && tabuleiro[comecoLinha - 1][comecoColuna - 1].cor === "preto" ||
            (tabuleiro[comecoLinha - 1][comecoColuna + 1] && tabuleiro[comecoLinha - 1][comecoColuna + 1].tipo === "peao" && tabuleiro[comecoLinha - 1][comecoColuna + 1].cor === "preto")
        ) {
            if (turno === id) {
                return false;
            } else if (turno != id && when === "after") {
                return true;
            }
        }
    } else if (rei.cor === "preto") {
        if (tabuleiro[comecoLinha + 1][comecoColuna - 1] && tabuleiro[comecoLinha + 1][comecoColuna - 1].tipo === "peao" && tabuleiro[comecoLinha + 1][comecoColuna - 1].cor === "branco" ||
            (tabuleiro[comecoLinha + 1][comecoColuna + 1] && tabuleiro[comecoLinha + 1][comecoColuna + 1].tipo === "peao" && tabuleiro[comecoLinha + 1][comecoColuna + 1].cor === "branco")
        ) {
            if (turno === id) {
                return false;
            } else if (turno != id && when === "after") {
                return true;
            }
        }
    }

    return true;

}
