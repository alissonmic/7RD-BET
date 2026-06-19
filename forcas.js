/* ============================================================================
 * forcas.js — Força de ATAQUE e DEFESA de cada seleção (gols por jogo)
 *   gf = gols que costuma FAZER por jogo · ga = gols que costuma LEVAR por jogo
 *   Snapshot calibrado a partir do nível real de cada time (eliminatórias +
 *   1ª rodada da Copa) e do favoritismo das casas. Edite à vontade.
 *
 *   OVER_UNDER (opcional): linha de total de gols das casas para jogos
 *   específicos — quando preenchida, o modelo ajusta o total esperado do jogo
 *   para bater com o mercado. Vazio = usa o total vindo de gf/ga. Formato:
 *   { idJogo: 2.5 }
 * ==========================================================================*/
const FORCAS = {
  // A
  MEX:{gf:1.5,ga:1.0}, RSA:{gf:0.9,ga:1.5}, KOR:{gf:1.4,ga:1.1}, CZE:{gf:1.2,ga:1.3},
  // B
  CAN:{gf:1.3,ga:1.1}, BIH:{gf:1.2,ga:1.3}, QAT:{gf:1.1,ga:1.4}, SUI:{gf:1.5,ga:0.9},
  // C
  BRA:{gf:2.0,ga:0.8}, MAR:{gf:1.5,ga:0.9}, HAI:{gf:0.8,ga:1.8}, SCO:{gf:1.2,ga:1.2},
  // D
  USA:{gf:1.7,ga:1.0}, PAR:{gf:1.0,ga:1.1}, AUS:{gf:1.2,ga:1.1}, TUR:{gf:1.5,ga:1.1},
  // E
  GER:{gf:2.1,ga:0.9}, CUW:{gf:0.7,ga:2.1}, CIV:{gf:1.4,ga:1.0}, ECU:{gf:1.2,ga:0.8},
  // F
  NED:{gf:1.9,ga:1.0}, JPN:{gf:1.6,ga:1.0}, SWE:{gf:1.6,ga:1.1}, TUN:{gf:1.0,ga:1.2},
  // G
  BEL:{gf:1.8,ga:1.0}, EGY:{gf:1.3,ga:1.0}, IRN:{gf:1.1,ga:1.0}, NZL:{gf:0.9,ga:1.5},
  // H
  ESP:{gf:2.1,ga:0.7}, CPV:{gf:0.9,ga:1.4}, KSA:{gf:1.0,ga:1.4}, URU:{gf:1.5,ga:0.9},
  // I
  FRA:{gf:2.1,ga:0.8}, SEN:{gf:1.5,ga:0.9}, IRQ:{gf:0.9,ga:1.4}, NOR:{gf:1.7,ga:1.0},
  // J
  ARG:{gf:2.0,ga:0.8}, ALG:{gf:1.3,ga:1.2}, AUT:{gf:1.6,ga:1.1}, JOR:{gf:0.9,ga:1.4},
  // K
  POR:{gf:1.9,ga:0.9}, COD:{gf:1.1,ga:1.3}, UZB:{gf:1.0,ga:1.2}, COL:{gf:1.6,ga:0.9},
  // L
  ENG:{gf:1.9,ga:0.8}, CRO:{gf:1.5,ga:1.1}, GHA:{gf:1.3,ga:1.3}, PAN:{gf:1.0,ga:1.4},
};

// Linhas de over/under (total de gols) por jogo, quando houver mercado. Opcional.
const OVER_UNDER = {
  // exemplos prontos para editar/ampliar:
  // D3: 2.5,  C4: 3.0,  J3: 2.5,  K3: 2.5
};
