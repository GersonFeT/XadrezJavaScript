export function criarPeca(tipo, cor) {
    return { tipo, cor, moveu: false, enPassant: false};
}

export function inicializarTabuleiro() {

    const tabuleiro = Array.from({ length: 8 }, () =>
        Array(8).fill(null)
    )

    const pretas = [
        "torre", "cavalo", "bispo", "dama",
        "rei", "bispo", "cavalo", "torre"
    ]

    const brancas = [
        "torre", "cavalo", "bispo", "dama",
        "rei", "bispo", "cavalo", "torre"
    ]

    
    for (let c = 0; c < 8; c++) {
        tabuleiro[0][c] = criarPeca(pretas[c], "preto")
    }

    
    for (let c = 0; c < 8; c++) {
        tabuleiro[1][c] = criarPeca("peao", "preto")
    }

  
    for (let c = 0; c < 8; c++) {
        tabuleiro[6][c] = criarPeca("peao", "branco")
    }

    
    for (let c = 0; c < 8; c++) {
        tabuleiro[7][c] = criarPeca(brancas[c], "branco")
    }

    return tabuleiro
}
