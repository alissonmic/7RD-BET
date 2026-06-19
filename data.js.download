/* ============================================================================
 * data.js — Estrutura fixa da Copa do Mundo 2026 (não muda com os resultados)
 *  - TIMES: as 48 seleções (id, nome em PT, código de bandeira flagcdn)
 *  - GRUPOS: composição dos 12 grupos
 *  - JOGOS_GRUPO: os 72 jogos da fase de grupos (adversários + data, SEM placar)
 *  - KNOCKOUT: a árvore do mata-mata (jogos 73 a 104) com os "placeholders" FIFA
 *  - THIRD_SLOTS: quais grupos podem fornecer o 3º colocado de cada jogo dos 16 avos
 * Os placares reais ficam em seed.js; as edições do usuário ficam no localStorage.
 * ==========================================================================*/

const TIMES = {
  // Grupo A
  MEX:{nome:'México',          flag:'mx'}, RSA:{nome:'África do Sul',   flag:'za'},
  KOR:{nome:'Coreia do Sul',   flag:'kr'}, CZE:{nome:'Chéquia',         flag:'cz'},
  // Grupo B
  CAN:{nome:'Canadá',          flag:'ca'}, BIH:{nome:'Bósnia e Herz.',  flag:'ba'},
  QAT:{nome:'Catar',           flag:'qa'}, SUI:{nome:'Suíça',           flag:'ch'},
  // Grupo C
  BRA:{nome:'Brasil',          flag:'br'}, MAR:{nome:'Marrocos',        flag:'ma'},
  HAI:{nome:'Haiti',           flag:'ht'}, SCO:{nome:'Escócia',         flag:'gb-sct'},
  // Grupo D
  USA:{nome:'Estados Unidos',  flag:'us'}, PAR:{nome:'Paraguai',        flag:'py'},
  AUS:{nome:'Austrália',       flag:'au'}, TUR:{nome:'Turquia',         flag:'tr'},
  // Grupo E
  GER:{nome:'Alemanha',        flag:'de'}, CUW:{nome:'Curaçao',         flag:'cw'},
  CIV:{nome:'Costa do Marfim', flag:'ci'}, ECU:{nome:'Equador',         flag:'ec'},
  // Grupo F
  NED:{nome:'Holanda',         flag:'nl'}, JPN:{nome:'Japão',           flag:'jp'},
  SWE:{nome:'Suécia',          flag:'se'}, TUN:{nome:'Tunísia',         flag:'tn'},
  // Grupo G
  BEL:{nome:'Bélgica',         flag:'be'}, EGY:{nome:'Egito',           flag:'eg'},
  IRN:{nome:'Irã',             flag:'ir'}, NZL:{nome:'Nova Zelândia',   flag:'nz'},
  // Grupo H
  ESP:{nome:'Espanha',         flag:'es'}, CPV:{nome:'Cabo Verde',      flag:'cv'},
  KSA:{nome:'Arábia Saudita',  flag:'sa'}, URU:{nome:'Uruguai',         flag:'uy'},
  // Grupo I
  FRA:{nome:'França',          flag:'fr'}, SEN:{nome:'Senegal',         flag:'sn'},
  IRQ:{nome:'Iraque',          flag:'iq'}, NOR:{nome:'Noruega',         flag:'no'},
  // Grupo J
  ARG:{nome:'Argentina',       flag:'ar'}, ALG:{nome:'Argélia',         flag:'dz'},
  AUT:{nome:'Áustria',         flag:'at'}, JOR:{nome:'Jordânia',        flag:'jo'},
  // Grupo K
  POR:{nome:'Portugal',        flag:'pt'}, COD:{nome:'RD Congo',        flag:'cd'},
  UZB:{nome:'Uzbequistão',     flag:'uz'}, COL:{nome:'Colômbia',        flag:'co'},
  // Grupo L
  ENG:{nome:'Inglaterra',      flag:'gb-eng'}, CRO:{nome:'Croácia',     flag:'hr'},
  GHA:{nome:'Gana',            flag:'gh'}, PAN:{nome:'Panamá',          flag:'pa'},
};

const GRUPOS = {
  A:['MEX','RSA','KOR','CZE'], B:['CAN','BIH','QAT','SUI'],
  C:['BRA','MAR','HAI','SCO'], D:['USA','PAR','AUS','TUR'],
  E:['GER','CUW','CIV','ECU'], F:['NED','JPN','SWE','TUN'],
  G:['BEL','EGY','IRN','NZL'], H:['ESP','CPV','KSA','URU'],
  I:['FRA','SEN','IRQ','NOR'], J:['ARG','ALG','AUT','JOR'],
  K:['POR','COD','UZB','COL'], L:['ENG','CRO','GHA','PAN'],
};

const ORDEM_GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

/* Os 72 jogos de grupo: [id, grupo, mandante, visitante, data] (placar vem do seed/edição) */
const JOGOS_GRUPO = [
  ['A1','A','MEX','RSA','2026-06-11'], ['A2','A','KOR','CZE','2026-06-11'],
  ['A3','A','CZE','RSA','2026-06-18'], ['A4','A','MEX','KOR','2026-06-18'],
  ['A5','A','CZE','MEX','2026-06-24'], ['A6','A','RSA','KOR','2026-06-24'],

  ['B1','B','CAN','BIH','2026-06-12'], ['B2','B','QAT','SUI','2026-06-13'],
  ['B3','B','SUI','BIH','2026-06-18'], ['B4','B','CAN','QAT','2026-06-18'],
  ['B5','B','SUI','CAN','2026-06-24'], ['B6','B','BIH','QAT','2026-06-24'],

  ['C1','C','BRA','MAR','2026-06-13'], ['C2','C','HAI','SCO','2026-06-13'],
  ['C3','C','SCO','MAR','2026-06-19'], ['C4','C','BRA','HAI','2026-06-19'],
  ['C5','C','SCO','BRA','2026-06-24'], ['C6','C','MAR','HAI','2026-06-24'],

  ['D1','D','USA','PAR','2026-06-12'], ['D2','D','AUS','TUR','2026-06-13'],
  ['D3','D','USA','AUS','2026-06-19'], ['D4','D','TUR','PAR','2026-06-19'],
  ['D5','D','TUR','USA','2026-06-25'], ['D6','D','PAR','AUS','2026-06-25'],

  ['E1','E','GER','CUW','2026-06-14'], ['E2','E','CIV','ECU','2026-06-14'],
  ['E3','E','GER','CIV','2026-06-20'], ['E4','E','ECU','CUW','2026-06-20'],
  ['E5','E','CUW','CIV','2026-06-25'], ['E6','E','ECU','GER','2026-06-25'],

  ['F1','F','NED','JPN','2026-06-14'], ['F2','F','SWE','TUN','2026-06-14'],
  ['F3','F','NED','SWE','2026-06-20'], ['F4','F','TUN','JPN','2026-06-20'],
  ['F5','F','JPN','SWE','2026-06-25'], ['F6','F','TUN','NED','2026-06-25'],

  ['G1','G','BEL','EGY','2026-06-15'], ['G2','G','IRN','NZL','2026-06-15'],
  ['G3','G','BEL','IRN','2026-06-21'], ['G4','G','NZL','EGY','2026-06-21'],
  ['G5','G','EGY','IRN','2026-06-26'], ['G6','G','NZL','BEL','2026-06-26'],

  ['H1','H','ESP','CPV','2026-06-15'], ['H2','H','KSA','URU','2026-06-15'],
  ['H3','H','ESP','KSA','2026-06-21'], ['H4','H','URU','CPV','2026-06-21'],
  ['H5','H','CPV','KSA','2026-06-26'], ['H6','H','URU','ESP','2026-06-26'],

  ['I1','I','FRA','SEN','2026-06-16'], ['I2','I','IRQ','NOR','2026-06-16'],
  ['I3','I','FRA','IRQ','2026-06-22'], ['I4','I','NOR','SEN','2026-06-22'],
  ['I5','I','NOR','FRA','2026-06-26'], ['I6','I','SEN','IRQ','2026-06-26'],

  ['J1','J','ARG','ALG','2026-06-16'], ['J2','J','AUT','JOR','2026-06-16'],
  ['J3','J','ARG','AUT','2026-06-22'], ['J4','J','JOR','ALG','2026-06-22'],
  ['J5','J','ALG','AUT','2026-06-27'], ['J6','J','JOR','ARG','2026-06-27'],

  ['K1','K','POR','COD','2026-06-17'], ['K2','K','UZB','COL','2026-06-17'],
  ['K3','K','POR','UZB','2026-06-23'], ['K4','K','COL','COD','2026-06-23'],
  ['K5','K','COL','POR','2026-06-27'], ['K6','K','COD','UZB','2026-06-27'],

  ['L1','L','ENG','CRO','2026-06-17'], ['L2','L','GHA','PAN','2026-06-17'],
  ['L3','L','ENG','GHA','2026-06-23'], ['L4','L','PAN','CRO','2026-06-23'],
  ['L5','L','PAN','ENG','2026-06-27'], ['L6','L','CRO','GHA','2026-06-27'],
];

/* Quais grupos podem fornecer o 3º colocado de cada jogo dos 16 avos (parâmetro FIFA).
   A combinação exata depende de QUAIS 8 grupos classificam um 3º — resolvida em thirds-table.js */
const THIRD_SLOTS = [
  {jogo:74, grupos:['A','B','C','D','F']},
  {jogo:77, grupos:['C','D','F','G','H']},
  {jogo:79, grupos:['C','E','F','H','I']},
  {jogo:80, grupos:['E','H','I','J','K']},
  {jogo:81, grupos:['B','E','F','I','J']},
  {jogo:82, grupos:['A','E','H','I','J']},
  {jogo:85, grupos:['E','F','G','I','J']},
  {jogo:87, grupos:['D','E','I','J','L']},
];

/* Referências de "vaga" (slot) usadas no mata-mata:
   {t:'pos', pos:1|2, g:'E'}      -> 1º/2º do grupo E
   {t:'terceiro', jogo:74}        -> melhor 3º alocado ao jogo 74 (via THIRD_SLOTS)
   {t:'vencedor', jogo:73}        -> vencedor do jogo 73
   {t:'perdedor', jogo:101}       -> perdedor do jogo 101 (disputa de 3º lugar) */
const KNOCKOUT = [
  // 16 AVOS DE FINAL (73–88)  — lado: esq / dir para o layout espelhado
  {id:73, fase:'16avos', lado:'esq', casa:{t:'pos',pos:2,g:'A'}, fora:{t:'pos',pos:2,g:'B'}},
  {id:74, fase:'16avos', lado:'esq', casa:{t:'pos',pos:1,g:'E'}, fora:{t:'terceiro',jogo:74}},
  {id:75, fase:'16avos', lado:'esq', casa:{t:'pos',pos:1,g:'F'}, fora:{t:'pos',pos:2,g:'C'}},
  {id:77, fase:'16avos', lado:'esq', casa:{t:'pos',pos:1,g:'I'}, fora:{t:'terceiro',jogo:77}},
  {id:81, fase:'16avos', lado:'esq', casa:{t:'pos',pos:1,g:'D'}, fora:{t:'terceiro',jogo:81}},
  {id:82, fase:'16avos', lado:'esq', casa:{t:'pos',pos:1,g:'G'}, fora:{t:'terceiro',jogo:82}},
  {id:83, fase:'16avos', lado:'esq', casa:{t:'pos',pos:2,g:'K'}, fora:{t:'pos',pos:2,g:'L'}},
  {id:84, fase:'16avos', lado:'esq', casa:{t:'pos',pos:1,g:'H'}, fora:{t:'pos',pos:2,g:'J'}},

  {id:76, fase:'16avos', lado:'dir', casa:{t:'pos',pos:1,g:'C'}, fora:{t:'pos',pos:2,g:'F'}},
  {id:78, fase:'16avos', lado:'dir', casa:{t:'pos',pos:2,g:'E'}, fora:{t:'pos',pos:2,g:'I'}},
  {id:79, fase:'16avos', lado:'dir', casa:{t:'pos',pos:1,g:'A'}, fora:{t:'terceiro',jogo:79}},
  {id:80, fase:'16avos', lado:'dir', casa:{t:'pos',pos:1,g:'L'}, fora:{t:'terceiro',jogo:80}},
  {id:85, fase:'16avos', lado:'dir', casa:{t:'pos',pos:1,g:'B'}, fora:{t:'terceiro',jogo:85}},
  {id:86, fase:'16avos', lado:'dir', casa:{t:'pos',pos:1,g:'J'}, fora:{t:'pos',pos:2,g:'H'}},
  {id:87, fase:'16avos', lado:'dir', casa:{t:'pos',pos:1,g:'K'}, fora:{t:'terceiro',jogo:87}},
  {id:88, fase:'16avos', lado:'dir', casa:{t:'pos',pos:2,g:'D'}, fora:{t:'pos',pos:2,g:'G'}},

  // OITAVAS DE FINAL (89–96)
  {id:89, fase:'oitavas', lado:'esq', casa:{t:'vencedor',jogo:74}, fora:{t:'vencedor',jogo:77}},
  {id:90, fase:'oitavas', lado:'esq', casa:{t:'vencedor',jogo:73}, fora:{t:'vencedor',jogo:75}},
  {id:93, fase:'oitavas', lado:'esq', casa:{t:'vencedor',jogo:83}, fora:{t:'vencedor',jogo:84}},
  {id:94, fase:'oitavas', lado:'esq', casa:{t:'vencedor',jogo:81}, fora:{t:'vencedor',jogo:82}},

  {id:91, fase:'oitavas', lado:'dir', casa:{t:'vencedor',jogo:76}, fora:{t:'vencedor',jogo:78}},
  {id:92, fase:'oitavas', lado:'dir', casa:{t:'vencedor',jogo:79}, fora:{t:'vencedor',jogo:80}},
  {id:95, fase:'oitavas', lado:'dir', casa:{t:'vencedor',jogo:86}, fora:{t:'vencedor',jogo:88}},
  {id:96, fase:'oitavas', lado:'dir', casa:{t:'vencedor',jogo:85}, fora:{t:'vencedor',jogo:87}},

  // QUARTAS DE FINAL (97–100)
  {id:97,  fase:'quartas', lado:'esq', casa:{t:'vencedor',jogo:89}, fora:{t:'vencedor',jogo:90}},
  {id:98,  fase:'quartas', lado:'esq', casa:{t:'vencedor',jogo:93}, fora:{t:'vencedor',jogo:94}},
  {id:99,  fase:'quartas', lado:'dir', casa:{t:'vencedor',jogo:91}, fora:{t:'vencedor',jogo:92}},
  {id:100, fase:'quartas', lado:'dir', casa:{t:'vencedor',jogo:95}, fora:{t:'vencedor',jogo:96}},

  // SEMIFINAIS (101–102)
  {id:101, fase:'semis', lado:'esq', casa:{t:'vencedor',jogo:97}, fora:{t:'vencedor',jogo:98}},
  {id:102, fase:'semis', lado:'dir', casa:{t:'vencedor',jogo:99}, fora:{t:'vencedor',jogo:100}},

  // DISPUTA DE 3º LUGAR (103) e FINAL (104)
  {id:103, fase:'terceiro', lado:'centro', casa:{t:'perdedor',jogo:101}, fora:{t:'perdedor',jogo:102}},
  {id:104, fase:'final',    lado:'centro', casa:{t:'vencedor',jogo:101}, fora:{t:'vencedor',jogo:102}},
];

const KNOCKOUT_POR_ID = {};
KNOCKOUT.forEach(k => { KNOCKOUT_POR_ID[k.id] = k; });

/* Agenda oficial do mata-mata: data e sede de cada jogo (73–104) */
const KO_AGENDA = {
  73:{data:'2026-06-28', local:'Inglewood'},      74:{data:'2026-06-29', local:'Foxborough'},
  75:{data:'2026-06-29', local:'Guadalupe'},      76:{data:'2026-06-29', local:'Houston'},
  77:{data:'2026-06-30', local:'East Rutherford'},78:{data:'2026-06-30', local:'Arlington'},
  79:{data:'2026-06-30', local:'Cidade do México'},80:{data:'2026-07-01', local:'Atlanta'},
  81:{data:'2026-07-01', local:'Santa Clara'},    82:{data:'2026-07-01', local:'Seattle'},
  83:{data:'2026-07-02', local:'Toronto'},        84:{data:'2026-07-02', local:'Inglewood'},
  85:{data:'2026-07-02', local:'Vancouver'},      86:{data:'2026-07-03', local:'Miami Gardens'},
  87:{data:'2026-07-03', local:'Kansas City'},    88:{data:'2026-07-03', local:'Arlington'},
  89:{data:'2026-07-04', local:'Filadélfia'},     90:{data:'2026-07-04', local:'Houston'},
  91:{data:'2026-07-05', local:'East Rutherford'},92:{data:'2026-07-05', local:'Cidade do México'},
  93:{data:'2026-07-06', local:'Arlington'},      94:{data:'2026-07-06', local:'Seattle'},
  95:{data:'2026-07-07', local:'Atlanta'},        96:{data:'2026-07-07', local:'Vancouver'},
  97:{data:'2026-07-09', local:'Foxborough'},     98:{data:'2026-07-10', local:'Inglewood'},
  99:{data:'2026-07-11', local:'Miami Gardens'},  100:{data:'2026-07-11', local:'Kansas City'},
  101:{data:'2026-07-14', local:'Arlington'},     102:{data:'2026-07-15', local:'Atlanta'},
  103:{data:'2026-07-18', local:'Miami Gardens'}, 104:{data:'2026-07-19', local:'East Rutherford'},
};

const NOME_FASE = {
  '16avos':'16 avos de final', 'oitavas':'Oitavas de final',
  'quartas':'Quartas de final', 'semis':'Semifinais',
  'terceiro':'Disputa de 3º lugar', 'final':'Final',
};
