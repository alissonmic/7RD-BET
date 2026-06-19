# Copa do Mundo 2026 — Chaveamento ao vivo 🏆

Site local que mostra, a partir dos resultados das rodadas, como fica **ao vivo** o
chaveamento da Copa de 2026 (48 seleções, 12 grupos), seguindo os parâmetros de
confronto definidos pela FIFA.

## Como abrir

**Opção 1 — duplo clique:** abra `index.html` no navegador.

**Opção 2 — servidor local (recomendado, evita qualquer restrição):**
```
cd "Chaveamento Atualizado"
python -m http.server 8000
```
Depois acesse <http://localhost:8000> no navegador.

> As bandeiras são carregadas da internet (flagcdn). Sem internet, o site funciona
> igual, apenas sem as bandeirinhas.

## Como usar

- **Fase de Grupos** (topo): edite qualquer placar nos campos `× ` — a classificação e
  o chaveamento recalculam **na hora**.
- **Mata-mata**: bracket espelhado (lado esquerdo ↔ direito) com a final no centro, mostrando
  **apenas os times** (sem placar). **Clique num time para avançá-lo** — ele é destacado com ✓ e
  aparece na rodada seguinte; clicar no outro troca; clicar de novo no mesmo desfaz. Assim você
  monta o caminho até o **campeão** (e a disputa de 3º lugar). Enquanto os grupos não terminam,
  as vagas aparecem **tracejadas/provisórias**.
- **📊 Pelas odds**: preenche os jogos de grupo que **ainda não aconteceram** com placares
  **realistas**. O modelo combina **gols que cada seleção costuma fazer/levar** ([`data/forcas.js`](data/forcas.js)),
  o **over/under** (total de gols, quando informado) e a **chance de vitória** (odds de campeão,
  [`data/odds.js`](data/odds.js)): o total de gols sai dos dados reais e as odds só decidem quem
  faz mais. É probabilístico — clique de novo para um novo cenário. Os 24 jogos já disputados são mantidos.
- **🎲 Simular resto**: preenche TODOS os jogos restantes (grupos + mata-mata) pelas odds,
  avançando o favorito de cada confronto até o campeão (com poucas zebras).
- **Restaurar dados oficiais**: volta aos placares reais da 1ª rodada (18/06/2026).
- **Limpar tudo**: zera todos os placares para você simular do começo.
- Tudo que você edita fica salvo no navegador (`localStorage`) e sobrevive ao recarregar.
- **💾 Backup / 📂 Restaurar** (no topo das duas páginas): baixa um arquivo `.json` com **tudo**
  (grupos, mata-mata e bolão) e restaura quando quiser. Use para ter uma cópia segura ou levar os
  dados para **outro navegador/computador**. Restaurar **substitui** os dados atuais (pede confirmação).

## 7RD BET — página do bolão 🎲

Clique em **🎲 7RD BET** no topo para abrir a **página própria** do bolão ([`bet.html`](bet.html)),
que tem uma **legenda completa com as regras**. Bolão entre você e os colegas, até o fim da fase de grupos.

- **Jogo do dia**: em **dia útil** entra o jogo mais próximo das **13h (Brasília)**; **todos os
  jogos do Brasil** entram sempre (qualquer dia/horário); **fim de semana** só com Brasil; se dois
  jogos forem no mesmo horário, **entram os dois**. (Os horários estão em [`data/horarios.js`](data/horarios.js).)
- **Apostadores**: digite o nome e clique **+ Adicionar** (ou Enter). Remova no “×” do nome.
- **Palpites**: para cada jogo, lance o placar de cada apostador. Quando o jogo acabar, preencha
  o **Resultado real** (ou clique **↓ da aba Grupos** para puxar o placar que você lançou lá).
- **Pontuação**: placar exato = **10** · acertou vencedor **e** saldo = **7** · só o vencedor = **5**
  · **+1** para cada placar de time que você cravar. O **ranking** soma tudo e mostra as cravadas.
- O bolão é **preservado** quando você usa “Restaurar dados oficiais” ou “Limpar tudo”.

## Como atualizar com novos resultados

Os placares oficiais ficam em [`data/seed.js`](data/seed.js), no formato
`idDoJogo:[golsMandante, golsVisitante]` (ex.: `A3:[1,0]`). Você pode:

1. **Pela tela** — só digitar os placares (mais fácil); ou
2. **Editando `seed.js`** — adicionar as novas linhas e clicar em "Restaurar dados oficiais".

Ou me peça: *"busque os resultados atualizados e atualize o seed"* que eu pesquiso e
preencho para você.

## Sobre a alocação dos "melhores 3º colocados"

A FIFA define, por regulamento, de quais grupos cada jogo dos 16 avos pode receber um 3º
colocado (74:A/B/C/D/F, 77:C/D/F/G/H, 79:C/E/F/H/I, 80:E/H/I/J/K, 81:B/E/F/I/J,
82:A/E/H/I/J, 85:E/F/G/I/J, 87:D/E/I/J/L). O site resolve o emparelhamento respeitando
exatamente essas restrições (e a regra de não revanche com o vencedor do próprio grupo).
Verifiquei que **todas as 495 combinações possíveis** de 8 grupos têm um emparelhamento
válido.

## Arquivos

```
index.html            página única (grupos + bracket)
css/styles.css        tema "Copa"
js/data.js            12 grupos, 72 jogos, árvore do mata-mata (73–104)
js/thirds-table.js    alocação dos 8 melhores 3º colocados
js/standings.js       classificação + critérios de desempate FIFA
js/bracket.js         monta o mata-mata e propaga os vencedores
js/storage.js         persistência (localStorage)
js/app.js             interface + edição ao vivo
data/seed.js          placares reais (1ª rodada, 18/06/2026)
```
