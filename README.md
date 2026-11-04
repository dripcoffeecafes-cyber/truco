# 🃏 Carteado — placar de Truco, Pontinho, Três Sete e Canastra

App de celular (PWA) pra marcar o jogo de baralho com os amigos. Funciona offline, instala direto do navegador, sem loja de apps.

**Acesse:** https://dripcoffeecafes-cyber.github.io/truco/

## O que tem

- **Truco** — Gaudério (24 tentos, malas/boas, truco/retruco/vale 4, envido, real envido, falta envido, flor, contraflor) e Paulista (12 tentos, truco/seis/nove/doze, mão de 11). Contagem em palitos como na mesa.
- **Pontinho** — todos começam com 100, quem zera estoura (com efeito 💀), botão pra "voltar pagando", vence o último que sobrar.
- **Três Sete** — calculadora da mão (ases, figuras ÷ 3, última vaza, acusações), partida até 21/31/41.
- **Canastra** — calculadora da mão (limpas, sujas, batida, mesa, cartas na mão, morto), partida até 1.500/3.000/5.000.
- **Efeitos** — flash de TRUCO!, confete, fogos, fanfarra sintetizada, vibração e frases de zoeira pra quem perde.
- **Hall da Fama** — ranking de vitórias por jogador e histórico de partidas.
- **Regras oficiais** de cada jogo numa aba própria.
- Desfazer, histórico de tentos, nomes salvos, tudo guardado no próprio celular.

## Instalar no celular

- **Android (Chrome):** abre o link → menu ⋮ → *Instalar app* (ou aceita o aviso "Instalar" na tela inicial).
- **iPhone (Safari):** abre o link → botão Compartilhar ⬆️ → *Adicionar à Tela de Início*.

Depois disso o app abre em tela cheia e funciona sem internet.

## Rodar local

É só HTML/CSS/JS puro, sem build:

```bash
python3 -m http.server 8080
# abre http://localhost:8080
```

## Estrutura

```
index.html      shell do app + ícones SVG
css/style.css   tema (mesa de feltro, duplas vermelha/azul)
js/app.js       telas, placares, hall, instalação
js/fx.js        confete, fogos, sons (Web Audio), vibração
js/rules.js     texto das regras
sw.js           service worker (offline)
manifest.json   manifesto PWA
icons/          ícones do app
```

Pra publicar uma atualização, basta dar push na `main` — o GitHub Pages serve direto da raiz. Quando mudar arquivos, troque o `VERSION` em `sw.js` pra forçar os celulares a baixarem a versão nova.
