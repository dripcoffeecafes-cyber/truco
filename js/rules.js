/* ============================================================
   REGRAS OFICIAIS — Truco (gaudério e paulista), Pontinho,
   Três Sete e Canastra. Texto próprio, baseado nas regras
   tradicionais e nos regulamentos de campeonatos (CBTG/MTG,
   Jogos de Integração, regulamentos de clubes).
   ============================================================ */
const RULES = {
  truco: {
    title: 'Truco',
    subtitle: 'Paulista (12 tentos) e Gaudério (24 tentos)',
    color: '#e5383b',
    sections: [
      {
        t: 'Truco Paulista — o básico',
        h: `
<p><b>Baralho:</b> 40 cartas (sem 8, 9, 10 e coringas) — no paulista joga-se com o baralho francês comum.</p>
<p><b>Objetivo:</b> fazer <b>12 tentos</b>. Cada mão vale 1 tento; vence a mão quem ganha 2 das 3 vazas.</p>
<p><b>Vira e manilha:</b> após distribuir, vira-se uma carta. A manilha é a carta <b>seguinte</b> à vira (vira 4 → manilha 5; vira 3 → manilha 4). Ordem das manilhas: <b>♣ Paus (zap)</b> &gt; <b>♥ Copas</b> &gt; <b>♠ Espadas</b> &gt; <b>♦ Ouros (pica-fumo)</b>.</p>
<div class="cardrank"><span class="hi">Manilha ♣</span><span class="hi r">Manilha ♥</span><span class="hi">Manilha ♠</span><span class="hi r">Manilha ♦</span><span>3</span><span>2</span><span>A</span><span>K</span><span>J</span><span>Q</span><span>7</span><span>6</span><span>5</span><span>4</span></div>
<p>Repare: valete (J) vale mais que a dama (Q).</p>`
      },
      {
        t: 'Truco Paulista — apostas, empates e mão de 11',
        h: `
<table><tr><th>Pedido</th><th>Aceito</th><th>Recusado</th></tr>
<tr><td>Truco</td><td>3</td><td>1 para quem pediu</td></tr>
<tr><td>Seis</td><td>6</td><td>3 para quem pediu</td></tr>
<tr><td>Nove</td><td>9</td><td>6 para quem pediu</td></tr>
<tr><td>Doze</td><td>12</td><td>9 para quem pediu</td></tr></table>
<p><b>Empates:</b> se a 1ª vaza empata ("empacha"), quem ganhar a 2ª leva a mão. Se a 2ª empata, vence quem ganhou a 1ª. Se todas empatam, ninguém pontua.</p>
<p><b>Mão de 11:</b> a dupla com 11 tentos pode olhar as cartas do parceiro e decidir jogar (mão vale 3) ou correr (adversário ganha 1). Não se pode trucar na mão de 11.</p>
<p><b>Mão de ferro (11 x 11):</b> joga-se com as cartas viradas, sem olhar, valendo 1 tento.</p>`
      },
      {
        t: 'Truco Gaudério — o básico',
        h: `
<p><b>Jogadores:</b> 4, em duas duplas sentadas alternadas (também se joga em 2 ou 6).</p>
<p><b>Baralho:</b> espanhol de 40 cartas (sem 8, 9 e coringas). Naipes: espadas, bastos (paus), ouros e copas.</p>
<p><b>Objetivo:</b> fazer <b>24 tentos</b>. Os primeiros 12 são as <b>"malas"</b> (ou "ruins") e os últimos 12 as <b>"boas"</b>. Marca-se com palitos ou feijões: cada quadradinho de 4 palitos + 1 riscado vale 5.</p>
<p>Cada <b>mão</b> tem 3 cartas por jogador e é disputada em 3 <b>vazas</b>. Vence a mão quem ganha 2 vazas. Em caso de empate na vaza ("parda"), vale a regra: quem ganhar a vaza seguinte leva; se a primeira empatou, quem ganhar a segunda vence a mão; se todas empatarem, ganha quem é <b>mão</b> (o primeiro a jogar).</p>
<p>O <b>mão</b> é o jogador à direita de quem dá as cartas; o carteador é o <b>pé</b>. A cada mão gira o carteador. Joga-se no sentido anti-horário.</p>
<div class="tip">No truco gaudério os <b>sinais</b> entre parceiros são permitidos e fazem parte do jogo — o que não pode é falar os pontos em voz alta fora da hora.</div>`
      },
      {
        t: 'Ordem das cartas (gaudério)',
        h: `
<p>Da mais forte para a mais fraca:</p>
<div class="cardrank">
<span class="hi">1♠ Espadão</span><span class="hi">1♣ Bastão</span><span class="hi">7♠ Sete de espadas</span><span class="hi r">7♦ Sete de ouros</span>
<span>3</span><span>2</span><span>1♥ / 1♦ (ases falsos)</span><span>12 (Rei)</span><span>11 (Cavalo)</span><span>10 (Valete)</span><span>7♥ / 7♣</span><span>6</span><span>5</span><span>4</span>
</div>
<p>As quatro primeiras são as <b>cartas bravas</b>. Entre cartas iguais (dois 3, dois reis…) a vaza fica <b>parda</b> (empatada), não há desempate por naipe.</p>`
      },
      {
        t: 'Truco, Retruco e Vale Quatro',
        h: `
<table><tr><th>Pedido</th><th>Se aceito (quero)</th><th>Se recusado (não quero)</th></tr>
<tr><td>Mão sem pedido</td><td>1 tento</td><td>—</td></tr>
<tr><td><b>Truco</b></td><td>2 tentos</td><td>1 tento para quem pediu</td></tr>
<tr><td><b>Retruco</b></td><td>3 tentos</td><td>2 tentos para quem pediu</td></tr>
<tr><td><b>Vale quatro</b></td><td>4 tentos</td><td>3 tentos para quem pediu</td></tr></table>
<p>A ordem é obrigatória: truco → retruco → vale quatro. Só pode aumentar a aposta a dupla que <b>não</b> fez o último pedido. Só se pede retruco ou vale quatro depois de dizer "quero".</p>
<p>O truco pode ser pedido a qualquer momento da mão, antes de jogar a carta ou depois de ver a carta do adversário. Quem pede truco e perde a mão, perde os mesmos tentos.</p>
<p>Correr ("não quero", "me achico", "vai pra cuia") entrega os tentos da aposta anterior ao adversário.</p>`
      },
      {
        t: 'Envido',
        h: `
<p>Disputa-se <b>antes da primeira carta</b> ser jogada (ou logo após o mão jogar, se o pé ainda não jogou). Só vale uma vez por mão.</p>
<p><b>Como contar:</b> com duas cartas do mesmo naipe, soma-se o valor delas + 20. Figuras (10, 11, 12) valem 0; as demais valem o número. Com uma carta só de cada naipe, vale a carta mais alta. Máximo: 33 (7 + 6 + 20).</p>
<p>Quem é mão canta os pontos primeiro; o adversário responde "são boas" se não supera, ou canta seus pontos. <b>Em empate, ganha quem é mão.</b></p>
<table><tr><th>Pedido</th><th>Quero</th><th>Não quero</th></tr>
<tr><td>Envido</td><td>2</td><td>1</td></tr>
<tr><td>Real envido</td><td>3</td><td>1</td></tr>
<tr><td>Envido + envido</td><td>4</td><td>2</td></tr>
<tr><td>Envido + real envido</td><td>5</td><td>2</td></tr>
<tr><td>Envido + envido + real envido</td><td>7</td><td>4</td></tr>
<tr><td><b>Falta envido</b></td><td>o que falta ao adversário para fechar as malas (se as duas duplas estão nas malas) ou para fechar os 24 (se alguém já está nas boas)</td><td>o valor do envido pedido antes (ou 1)</td></tr></table>
<p>Se alguém pede truco e o adversário ainda não jogou, ele pode responder "envido" (o envido vem primeiro, chamado de <i>"envido está primeiro"</i>); resolve-se o envido e depois volta-se ao truco.</p>`
      },
      {
        t: 'Flor',
        h: `
<p><b>Flor</b> é ter as 3 cartas do mesmo naipe. Deve ser cantada antes de jogar a primeira carta. A flor <b>anula o envido</b>: se alguém cantou envido e outro tem flor, o envido não vale.</p>
<table><tr><th>Situação</th><th>Tentos</th></tr>
<tr><td>Flor (só uma dupla tem)</td><td>3 tentos</td></tr>
<tr><td>Flor contra flor (as duas duplas têm) — vence a maior; empate ganha o mão</td><td>3 por flor cantada, para quem vence (6 se cada dupla cantou uma)</td></tr>
<tr><td>Contraflor pedida e aceita</td><td>6 tentos</td></tr>
<tr><td>Contraflor não querida ("me achico")</td><td>4 tentos (3 da flor + 1)</td></tr>
<tr><td>Contraflor e o resto</td><td>o que falta para fechar a partida</td></tr></table>
<p>Os pontos da flor contam como o envido (três cartas + 20). Quem não canta a flor e é descoberto perde os tentos dela para o adversário.</p>`
      }
    ]
  },

  pontinho: {
    title: 'Pontinho',
    subtitle: 'Família do Pif-Paf — quem chega a zero estoura',
    color: '#3a86ff',
    sections: [
      {
        t: 'O básico',
        h: `
<p><b>Jogadores:</b> de 3 a 8 (ideal 4 a 6), cada um por si.</p>
<p><b>Baralho:</b> dois baralhos de 52 cartas (104). Em muitas mesas os coringas também entram, valendo 20 pontos.</p>
<p><b>Objetivo:</b> ficar sem cartas na mão (<b>bater</b>) baixando trincas e sequências. Todos começam com <b>100 pontos</b>; a cada mão, quem não bateu perde os pontos das cartas que sobraram na mão. Quem chega a <b>zero ou menos</b> "estoura" e sai do jogo. <b>Ganha o último que sobrar.</b></p>`
      },
      {
        t: 'Distribuição e coringa da mão',
        h: `
<p>Embaralha, o jogador à direita corta, e o carteador dá <b>9 cartas</b> para cada um, de três em três, no sentido horário. O restante é o monte de compra (o "bagaço").</p>
<p>Quem cortou vira uma carta na mesa: a carta <b>seguinte, da mesma cor</b>, é o coringa da mão (virou 7♣ → os 8♣ e 8♠ são coringa). Em mesas que usam o coringa do baralho (joker), ele também vale como coringa.</p>`
      },
      {
        t: 'Jogos válidos',
        h: `
<ul>
<li><b>Trinca:</b> 3 cartas do mesmo valor, obrigatoriamente de <b>naipes diferentes</b>. Na trinca pode-se encaixar depois a 4ª carta do naipe que falta.</li>
<li><b>Sequência:</b> 3 ou mais cartas do mesmo naipe em ordem (A-2-3, 10-J-Q-K; o Ás pode ser usado antes do 2 ou depois do K, não "dando a volta").</li>
</ul>
<p>Pode-se baixar os jogos de uma vez ou aos poucos, e <b>pode-se encaixar cartas nos jogos dos outros jogadores</b> (é o que deixa o pontinho rápido).</p>
<p>O coringa pode ser usado no meio de uma sequência ou numa trinca. Quem tiver a carta verdadeira pode, na sua vez, trocá-la pelo coringa e usá-lo em outro jogo — e, se for para bater, pode pegá-lo na hora.</p>`
      },
      {
        t: 'A rodada',
        h: `
<ol>
<li>Na sua vez, compre uma carta do monte <b>ou</b> a última do lixo.</li>
<li>Baixe os jogos que quiser (ou encaixe cartas nos jogos da mesa).</li>
<li>Descarte uma carta no lixo.</li>
</ol>
<p>Só é permitido comprar fora da vez para <b>bater</b> na hora. Quem tem só uma carta na mão não pode comprar do lixo.</p>
<p>Bate quem baixa a última carta (pode ser descartando-a). O jogador que bateu <b>não perde pontos</b>.</p>`
      },
      {
        t: 'Contagem de pontos (o que se perde)',
        h: `
<table><tr><th>Carta na mão</th><th>Pontos perdidos</th></tr>
<tr><td>Coringa</td><td>20</td></tr>
<tr><td>Ás</td><td>15</td></tr>
<tr><td>K, Q, J</td><td>10 cada</td></tr>
<tr><td>2 a 10</td><td>valor da carta</td></tr></table>
<p>Quando alguém bate, cada um dos outros desconta a soma das cartas que ficaram na mão. Chegou a zero ou abaixo: <b>estourou</b>.</p>
<div class="tip"><b>Comprar de volta:</b> em muitas mesas quem estoura pode "pagar" para voltar, entrando com a mesma pontuação do pior colocado que ainda está no jogo (regra opcional — o app tem um botão pra isso).</div>
<p>Se dois jogadores batem com a mesma carta e os demais estouram juntos, o jogo continua entre eles.</p>`
      }
    ]
  },

  tressete: {
    title: 'Três Sete',
    subtitle: 'Tressette — jogo de vazas em duplas, sem trunfo',
    color: '#ff8c42',
    sections: [
      {
        t: 'O básico',
        h: `
<p><b>Jogadores:</b> 4 em duas duplas (parceiros sentados em frente). Também se joga em 2.</p>
<p><b>Baralho:</b> 40 cartas (sem 8, 9, 10 e coringas), espanhol ou francês. Cada jogador recebe <b>10 cartas</b> — o baralho inteiro.</p>
<p><b>Objetivo:</b> ser a primeira dupla a chegar a <b>21 pontos</b> (muitas mesas jogam até 31 ou 41). A partida se divide em mãos; ao fim de cada mão somam-se os pontos das cartas conquistadas nas vazas.</p>
<p><b>Não há trunfo</b> e não há manilha: ganha a vaza a carta mais alta do naipe que saiu.</p>`
      },
      {
        t: 'Ordem das cartas',
        h: `
<div class="cardrank"><span class="hi">3</span><span class="hi">2</span><span class="hi">Ás</span><span>Rei (K)</span><span>Cavalo / Dama (Q)</span><span>Valete (J)</span><span>7</span><span>6</span><span>5</span><span>4</span></div>
<p>O <b>3 é a carta mais forte</b>, seguido do 2 e do Ás — daí o nome do jogo. Dentro de cada naipe essa é a ordem; cartas de outro naipe nunca ganham a vaza.</p>`
      },
      {
        t: 'Como se joga',
        h: `
<ol>
<li>Joga-se no sentido anti-horário. Começa quem está à direita do carteador.</li>
<li>É <b>obrigatório seguir o naipe</b> da primeira carta da vaza. Quem não tem o naipe joga qualquer carta (ela não ganha a vaza).</li>
<li>Vence a vaza a carta mais alta do naipe puxado; quem vence recolhe as 4 cartas viradas e puxa a próxima vaza.</li>
<li>A mão termina após as 10 vazas. A dupla que ganha a <b>última vaza</b> ganha 1 ponto extra.</li>
</ol>`
      },
      {
        t: 'Pontuação',
        h: `
<table><tr><th>Carta</th><th>Valor</th></tr>
<tr><td>Ás</td><td>1 ponto</td></tr>
<tr><td>3, 2, Rei, Cavalo (Q), Valete (J)</td><td>⅓ de ponto cada</td></tr>
<tr><td>7, 6, 5, 4</td><td>0 (cartas "brancas")</td></tr>
<tr><td>Última vaza</td><td>1 ponto</td></tr></table>
<p>Há 11 pontos por mão (4 ases + 16 figuras ÷ 3 = 9⅓, mais a última). Ao fim da mão, cada dupla soma e <b>despreza as frações</b> (3 figuras = 1 ponto; sobra não conta). Conta rápida: <b>pontos = ases + (figuras ÷ 3, só a parte inteira) + última</b>.</p>
<div class="tip">Se as duas duplas passam de 21 na mesma mão, vence quem tem mais pontos; em empate, joga-se outra mão.</div>`
      },
      {
        t: 'Acusações (bônus)',
        h: `
<p>Antes de jogar a primeira carta, o jogador pode "acusar" combinações que tem na mão e marcar pontos extras na hora:</p>
<table><tr><th>Combinação</th><th>Pontos</th></tr>
<tr><td>Três ases, três 2 ou três 3</td><td>3 pontos</td></tr>
<tr><td>Quatro ases, quatro 2 ou quatro 3</td><td>4 pontos</td></tr>
<tr><td><b>Napolitana</b>: Ás, 2 e 3 do mesmo naipe</td><td>3 pontos</td></tr></table>
<p>Nem toda mesa joga com acusações — combine antes. No app, as acusações entram no campo "bônus" da mão.</p>`
      },
      {
        t: 'Sinais permitidos (a "fala" do jogo)',
        h: `
<p>No Três Sete tradicional é proibido conversar, mas são permitidos três avisos ao parceiro, feitos ao jogar a carta:</p>
<ul>
<li><b>Bater na mesa ("busso"):</b> peço que você jogue a carta mais alta deste naipe e devolva o naipe.</li>
<li><b>Arrastar a carta ("striscio"):</b> tenho muitas cartas deste naipe.</li>
<li><b>Jogar levantando a carta ("volo"):</b> esta é minha última carta deste naipe.</li>
</ul>`
      }
    ]
  },

  canastra: {
    title: 'Canastra',
    subtitle: 'Buraco em duplas — 3.000 pontos com morto',
    color: '#9d4edd',
    sections: [
      {
        t: 'O básico',
        h: `
<p><b>Jogadores:</b> 4 em duas duplas (parceiros em frente). Também se joga em 2.</p>
<p><b>Baralho:</b> dois baralhos de 52 cartas com 4 coringas (108 cartas).</p>
<p><b>Objetivo:</b> ser a primeira dupla a chegar a <b>3.000 pontos</b> (combinam-se também 1.500 ou 5.000). Os pontos vêm das cartas baixadas na mesa, das <b>canastras</b> (jogos de 7 ou mais cartas) e da <b>batida</b>.</p>
<p>Cada jogador recebe <b>11 cartas</b>. Separam-se dois <b>mortos</b> de 11 cartas cada. O restante vira o monte de compra; a primeira carta virada abre o lixo.</p>`
      },
      {
        t: 'Jogos e coringas',
        h: `
<ul>
<li><b>Sequência:</b> 3 ou mais cartas do mesmo naipe em ordem. O Ás pode ser usado antes do 2 ou depois do Rei (K-A), não "dá a volta".</li>
<li><b>Trinca:</b> na canastra tradicional gaúcha <b>não vale trinca</b> (só sequências). Mesas que jogam "com trinca" aceitam 3 ou mais cartas do mesmo valor — combine antes.</li>
<li><b>Coringas:</b> o joker e todos os <b>2</b> servem de coringa. Só pode haver <b>um coringa por jogo</b>. O 2 usado na posição natural (A-2-3 do mesmo naipe) não é coringa.</li>
</ul>
<p>Pode-se baixar jogos novos ou acrescentar cartas aos jogos da própria dupla. Um coringa no jogo pode ser deslocado quando chega a carta verdadeira.</p>`
      },
      {
        t: 'Canastras',
        h: `
<table><tr><th>Tipo</th><th>Descrição</th><th>Pontos</th></tr>
<tr><td><b>Suja (simples)</b></td><td>7+ cartas com coringa</td><td>100</td></tr>
<tr><td><b>Limpa (real)</b></td><td>7+ cartas sem coringa</td><td>200</td></tr>
<tr><td><b>Mil / de Ás a Ás</b></td><td>A-2-3…K-A do mesmo naipe sem coringa (14 cartas)</td><td>1.000 (variação regional; muitas mesas não usam)</td></tr></table>
<p>Uma canastra suja vira limpa se o coringa for retirado (substituído pela carta certa) e deslocado para fora do jogo — ou colocado como "2" na posição natural.</p>`
      },
      {
        t: 'A rodada, o lixo e o morto',
        h: `
<ol>
<li>Compre uma carta do monte <b>ou</b> pegue o lixo <b>inteiro</b>. Para pegar o lixo, a carta do topo precisa ser usada na hora num jogo da mesa ou com duas cartas da sua mão.</li>
<li>Baixe jogos à vontade.</li>
<li>Descarte uma carta no lixo. Na canastra o lixo <b>não tranca</b> com coringa (isso é regra do jogo "Tranca", não daqui).</li>
</ol>
<p><b>Morto:</b> quando um jogador baixa todas as cartas da mão (descartando ou não), ele pega o morto e continua jogando com ele. Cada dupla só pode pegar <b>um</b> morto. Se os dois mortos já foram pegos, quem fica sem cartas bate.</p>
<p>Se a dupla <b>não pega o morto</b> até o fim da mão: <b>−100</b>. Se pegou e ficou com cartas na mão, elas contam negativo normalmente.</p>`
      },
      {
        t: 'Bater e contar os pontos',
        h: `
<p>Para <b>bater</b> (encerrar a mão) a dupla precisa ter pego o morto e ter <b>pelo menos uma canastra limpa</b> (há mesas que aceitam suja). Bate quem fica sem cartas na mão após descartar — pode ser necessário avisar "posso bater?" ao parceiro.</p>
<table><tr><th>Item</th><th>Pontos</th></tr>
<tr><td>Batida</td><td>+100</td></tr>
<tr><td>Canastra limpa</td><td>+200 cada</td></tr>
<tr><td>Canastra suja</td><td>+100 cada</td></tr>
<tr><td>Cartas baixadas na mesa (as duas duplas contam)</td><td>valor de cada carta</td></tr>
<tr><td>Cartas que sobraram na mão</td><td>− valor de cada carta</td></tr>
<tr><td>Não pegou o morto</td><td>−100</td></tr></table>
<table><tr><th>Carta</th><th>Valor</th></tr>
<tr><td>Joker</td><td>20 (há mesas que usam 50)</td></tr>
<tr><td>2 (como coringa ou natural)</td><td>10</td></tr>
<tr><td>Ás</td><td>15</td></tr>
<tr><td>8, 9, 10, J, Q, K</td><td>10</td></tr>
<tr><td>3, 4, 5, 6, 7</td><td>5</td></tr></table>
<div class="tip">O app faz a conta: você informa canastras, batida, soma das cartas na mesa e na mão, e ele calcula a mão de cada dupla. Se as duas duplas passam de 3.000 na mesma mão, vence quem tem mais pontos.</div>`
      }
    ]
  }
};
