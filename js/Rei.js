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


    if (diffLinha > 1 || diffColuna > 1) {
        return false;
    }
    return true;
}

export function checkValidation(tabuleiro, id, turno, when) {
    let comecoLinha = 0;
    let comecoColuna = 0;


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
                    (destino.tipo === "bispo")) {
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

        if (tabuleiro[linhaAtual][colunaAtual] !== null &&
            tabuleiro[linhaAtual][colunaAtual].tipo === "cavalo" &&
            tabuleiro[linhaAtual][colunaAtual].cor != rei.cor) {

            if (turno === id && when === "before") {

                return false;
            } else if (turno != id && when === "after") {
                return false;
            }
        }
    }

    if (rei.cor === "branco") {
        if (tabuleiro[comecoLinha - 1][comecoColuna - 1] && tabuleiro[comecoLinha - 1][comecoColuna - 1].tipo === "peao" && tabuleiro[comecoLinha - 1][comecoColuna - 1].cor === "preto" ||
            (tabuleiro[comecoLinha - 1][comecoColuna + 1] && tabuleiro[comecoLinha - 1][comecoColuna + 1].tipo === "peao" && tabuleiro[comecoLinha - 1][comecoColuna + 1].cor === "preto")
        ) {
            if (turno === id && when === "before") {
                return false;
            } else if (turno != id && when === "after") {
                return false;
            }
        }
    } else if (rei.cor === "preto") {
        if (tabuleiro[comecoLinha + 1][comecoColuna - 1] && tabuleiro[comecoLinha + 1][comecoColuna - 1].tipo === "peao" && tabuleiro[comecoLinha + 1][comecoColuna - 1].cor === "branco" ||
            (tabuleiro[comecoLinha + 1][comecoColuna + 1] && tabuleiro[comecoLinha + 1][comecoColuna + 1].tipo === "peao" && tabuleiro[comecoLinha + 1][comecoColuna + 1].cor === "branco")
        ) {
            if (turno === id && when === "before") {
                return false;
            } else if (turno != id && when === "after") {
                return false;
            }
        }
    }

    return true;

}
export function validarXequeMate(tabuleiro, cor) {
    //vai receber quem está em xeque e mandar a outra cor    
    //igual e antes
    const copiaTabuleiro = tabuleiro.map(linha => [...linha]);
    let direcaoXeque= 0;
    const outraCor = cor === "branco" ? "preto" : "branco";

    let comecoLinha = 0;
    let comecoColuna = 0;
    let reiOriginalLinha = 0;
    let reiOriginalColuna = 0;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (copiaTabuleiro[i][j] && copiaTabuleiro[i][j].tipo === "rei" && copiaTabuleiro[i][j].cor === outraCor) {
                comecoLinha = i;
                comecoColuna = j;
            }
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (copiaTabuleiro[i][j] && copiaTabuleiro[i][j].tipo === "rei" && copiaTabuleiro[i][j].cor === cor) {
                reiOriginalLinha = i;
                reiOriginalColuna = j;
            }
        }
    }

    const rei = copiaTabuleiro[reiOriginalLinha][reiOriginalColuna];
    aLinha = 0;
    aColuna = 0;

    const direcoes = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [linha, coluna] of direcoes) {
        for (let i = 1; i < tabuleiro.length; i++) {
            const linhaAtual = aLinha + (linha * i);
            const colunaAtual = aColuna + (coluna * i);


            if (linhaAtual > 7 || linhaAtual < 0 || colunaAtual > 7 || colunaAtual < 0) { break; }

            if (tabuleiro[linhaAtual][colunaAtual] != null) {
                const destino = tabuleiro[linhaAtual][colunaAtual];

                if (rei.cor === destino.cor) { break; }

                if (destino.tipo === "peao" || destino.tipo === "cavalo" || destino.tipo === "rei") { break; }

                if (Math.abs(linhaAtual - aLinha) === Math.abs(colunaAtual - aColuna) &&
                    (destino.tipo === "dama" || destino.tipo === "bispo")) {
                    direcaoXeque = "diagonal"
                } else if (Math.abs(linhaAtual - aLinha) === Math.abs(colunaAtual - aColuna) &&
                    (destino.tipo === "torre")) {
                    break;
                } else if (linha === 0 || coluna === 0 &&
                    (destino.tipo === "dama" || destino.tipo === "torre")) {
                    direcaoXeque = linha === 0? "linha":"coluna";
                } else if (linha === 0 || coluna === 0 &&
                    (destino.tipo === "bispo")) {
                    break;
                }
                {

                }

            }
        }
    }

    const direcoesCavalo = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [linha, coluna] of direcoesCavalo) {
        const linhaAtual = aLinha + linha;
        const colunaAtual = aColuna + coluna;
        if (linhaAtual > 7 || linhaAtual < 0 || colunaAtual > 7 || colunaAtual < 0) { break; }

        if (tabuleiro[linhaAtual][colunaAtual] !== null &&
            tabuleiro[linhaAtual][colunaAtual].tipo === "cavalo" &&
            tabuleiro[linhaAtual][colunaAtual].cor != rei.cor) {
            
            direcaoXeque = "cavalo";
        }
    }

    if (rei.cor === "branco") {
        if (tabuleiro[aLinha - 1][aColuna - 1] && tabuleiro[aLinha - 1][aColuna - 1].tipo === "peao" && tabuleiro[aLinha - 1][aColuna - 1].cor === "preto" ||
            (tabuleiro[aLinha - 1][aColuna + 1] && tabuleiro[aLinha - 1][aColuna + 1].tipo === "peao" && tabuleiro[aLinha - 1][aColuna + 1].cor === "preto")
        ) {
            direcaoXeque = "peao"
        }
    } else if (rei.cor === "preto") {
        if (tabuleiro[aLinha + 1][aColuna - 1] && tabuleiro[aLinha + 1][aColuna - 1].tipo === "peao" && tabuleiro[aLinha + 1][aColuna - 1].cor === "branco" ||
            (tabuleiro[aLinha + 1][aColuna + 1] && tabuleiro[aLinha + 1][aColuna + 1].tipo === "peao" && tabuleiro[aLinha + 1][aColuna + 1].cor === "branco")
        ) {
            direcaoXeque = "peao"
        }
    }

    return true;


    checkValidation(copiaTabuleiro, outraCor)
}
