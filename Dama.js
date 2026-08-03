import { validarTorre } from "./Torre.js"
import { validarBispo } from "./Bispo.js"

export function validarDama(tabuleiro,
    inicioLinha,
    inicioColuna,
    fimLinha,
    fimColuna) {
        if(inicioLinha !== fimLinha && inicioColuna !== fimColuna){
            return validarBispo(tabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)
        }else{
            return validarTorre(tabuleiro, inicioLinha, inicioColuna, fimLinha, fimColuna)
        }
    }