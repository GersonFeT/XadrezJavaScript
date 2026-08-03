import { validarPeao } from "./Peao.js"
import { validarTorre } from "./Torre.js"
import { validarBispo } from "./Bispo.js"
import { validarCavalo } from "./Cavalo.js"
import { validarDama } from "./Dama.js"
import { validarRei } from "./Rei.js"

export function movimentoValido(
    tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna
){
    const peca = tabuleiro[inicioLinha][inicioColuna]

    if (peca.tipo === "peao"){
        return validarPeao(tabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna) //tem que adicionar isso pra cada peça e fazer os arquivos de validação respectivamente
    }
    else if (peca.tipo === "torre"){
        return validarTorre(tabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)
    }
    else if(peca.tipo === "cavalo"){
        return validarCavalo(tabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)
    }
    else if (peca.tipo === "bispo"){
        return validarBispo(tabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)
    }
    else if (peca.tipo === "dama"){
        return validarDama(tabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)
    }
    else if (peca.tipo === "rei"){
        return validarRei(tabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)
    }

}