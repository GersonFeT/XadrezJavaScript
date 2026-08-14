# Xadrez JavaScript

Jogo de xadrez feito em JavaScript, HTML e CSS.

O projeto possui um tabuleiro 8x8, movimentação das peças e controle de turnos entre as peças brancas e pretas.

## Tecnologias

* HTML
* CSS
* JavaScript

## Estrutura

```text
XadrezJavaScript/
├── Imagens/
├── js/
│   ├── Bispo.js
│   ├── Cavalo.js
│   ├── Dama.js
│   ├── Movimentos.js
│   ├── Peao.js
│   ├── Rei.js
│   ├── Tabuleiro.js
│   ├── Torre.js
│   └── Visual.js
├── Index.html
├── Style.css
└── README.md
```

Cada peça possui seu próprio arquivo para validação de movimentos. O arquivo `Tabuleiro.js` é responsável pela criação do tabuleiro e das peças, enquanto `Movimentos.js` reúne a validação dos movimentos. A parte visual e a interação com o tabuleiro ficam em `Visual.js`.

## Como executar

Baixe ou clone o repositório e abra o arquivo `Index.html` em um navegador.

```bash
git clone https://github.com/GersonFeT/XadrezJavaScript.git
```

Depois, abra o `Index.html`.

## Estilos das peças

O jogo possui dois estilos visuais para as peças. Eles podem ser alternados pelo botão **"Trocar estilo das peças"**.

## Status

Projeto funcional de xadrez desenvolvido em JavaScript.

## Autor

Gerson Tomaz
