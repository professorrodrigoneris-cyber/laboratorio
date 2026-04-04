/* =============================================
   CALENDÁRIO DE PROVAS – APP.JS
   Sistema de gestão e geração automática
   ============================================= */

'use strict';

// =============================================
// CONSTANTES E CONFIGURAÇÃO
// =============================================
const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DIAS_SEMANA_FULL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// Arquivo JSON local (pasta db/)
const DB_URL = 'db/disciplinas.json';

// URL do Google Apps Script implantado
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzT8UHamJ29b3VDGpKicumlyRY8Gws6fldQbhz-k-Vghaf-nWHaHSAZtTfmO0VGAnl0dA/exec';

// Dados embutidos como fallback (caso fetch falhe em file://)
const DADOS_EMBUTIDOS = [
  {"id":1,"disciplina":"Inglês","turma":"5º Ano","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":2,"disciplina":"Pensamento Computacional","turma":"5º Ano","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":3,"disciplina":"Educação Física","turma":"5º Ano","professor":"Herica","eletiva":"Não","segmento":"Fundamental II"},
  {"id":4,"disciplina":"Artes","turma":"6º Ano A","professor":"Gilson Santos","eletiva":"Não","segmento":"Fundamental II"},
  {"id":5,"disciplina":"Pensamento Computacional","turma":"6º Ano A","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":6,"disciplina":"Empreendedorismo","turma":"6º Ano A","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":7,"disciplina":"Português","turma":"6º Ano A","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":8,"disciplina":"Inglês","turma":"6º Ano A","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":9,"disciplina":"Ciências","turma":"6º Ano A","professor":"Laura","eletiva":"Não","segmento":"Fundamental II"},
  {"id":10,"disciplina":"Matemática","turma":"6º Ano A","professor":"Wanderley","eletiva":"Não","segmento":"Fundamental II"},
  {"id":11,"disciplina":"História","turma":"6º Ano A","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":12,"disciplina":"Filosofia","turma":"6º Ano A","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":13,"disciplina":"Educação Física","turma":"6º Ano A","professor":"Herica","eletiva":"Não","segmento":"Fundamental II"},
  {"id":14,"disciplina":"Geografia","turma":"6º Ano A","professor":"Jordana","eletiva":"Não","segmento":"Fundamental II"},
  {"id":15,"disciplina":"Artes","turma":"6º Ano B","professor":"Gilson Santos","eletiva":"Não","segmento":"Fundamental II"},
  {"id":16,"disciplina":"Pensamento Computacional","turma":"6º Ano B","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":17,"disciplina":"Empreendedorismo","turma":"6º Ano B","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":18,"disciplina":"Português","turma":"6º Ano B","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":19,"disciplina":"Inglês","turma":"6º Ano B","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":20,"disciplina":"Ciências","turma":"6º Ano B","professor":"Laura","eletiva":"Não","segmento":"Fundamental II"},
  {"id":21,"disciplina":"Matemática","turma":"6º Ano B","professor":"Wanderley","eletiva":"Não","segmento":"Fundamental II"},
  {"id":22,"disciplina":"História","turma":"6º Ano B","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":23,"disciplina":"Filosofia","turma":"6º Ano B","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":24,"disciplina":"Educação Física","turma":"6º Ano B","professor":"Herica","eletiva":"Não","segmento":"Fundamental II"},
  {"id":25,"disciplina":"Geografia","turma":"6º Ano B","professor":"Jordana","eletiva":"Não","segmento":"Fundamental II"},
  {"id":26,"disciplina":"Artes","turma":"7º Ano","professor":"Gilson Santos","eletiva":"Não","segmento":"Fundamental II"},
  {"id":27,"disciplina":"Pensamento Computacional","turma":"7º Ano","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":28,"disciplina":"Empreendedorismo","turma":"7º Ano","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":29,"disciplina":"Português","turma":"7º Ano","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":30,"disciplina":"Inglês","turma":"7º Ano","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":31,"disciplina":"Ciências","turma":"7º Ano","professor":"Laura","eletiva":"Não","segmento":"Fundamental II"},
  {"id":32,"disciplina":"Matemática","turma":"7º Ano","professor":"Wanderley","eletiva":"Não","segmento":"Fundamental II"},
  {"id":33,"disciplina":"História","turma":"7º Ano","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":34,"disciplina":"Filosofia","turma":"7º Ano","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":35,"disciplina":"Educação Física","turma":"7º Ano","professor":"Herica","eletiva":"Não","segmento":"Fundamental II"},
  {"id":36,"disciplina":"Geografia","turma":"7º Ano","professor":"Jordana","eletiva":"Não","segmento":"Fundamental II"},
  {"id":37,"disciplina":"Artes","turma":"8º Ano","professor":"Gilson Santos","eletiva":"Não","segmento":"Fundamental II"},
  {"id":38,"disciplina":"Pensamento Computacional","turma":"8º Ano","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":39,"disciplina":"Empreendedorismo","turma":"8º Ano","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":40,"disciplina":"Inglês","turma":"8º Ano","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":41,"disciplina":"Ciências","turma":"8º Ano","professor":"Laura","eletiva":"Não","segmento":"Fundamental II"},
  {"id":42,"disciplina":"Matemática","turma":"8º Ano","professor":"Wanderley","eletiva":"Não","segmento":"Fundamental II"},
  {"id":43,"disciplina":"História","turma":"8º Ano","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":44,"disciplina":"Filosofia","turma":"8º Ano","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":45,"disciplina":"Educação Física","turma":"8º Ano","professor":"Herica","eletiva":"Não","segmento":"Fundamental II"},
  {"id":46,"disciplina":"Português","turma":"8º Ano","professor":"Jordana","eletiva":"Não","segmento":"Fundamental II"},
  {"id":47,"disciplina":"Geografia","turma":"8º Ano","professor":"Gilson Santos","eletiva":"Não","segmento":"Fundamental II"},
  {"id":48,"disciplina":"Artes","turma":"9º Ano","professor":"Gilson Santos","eletiva":"Não","segmento":"Fundamental II"},
  {"id":49,"disciplina":"Geografia","turma":"9º Ano","professor":"Gilson Santos","eletiva":"Não","segmento":"Fundamental II"},
  {"id":50,"disciplina":"Matemática","turma":"9º Ano","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":51,"disciplina":"Pensamento Computacional","turma":"9º Ano","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":52,"disciplina":"Empreendedorismo","turma":"9º Ano","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Fundamental II"},
  {"id":53,"disciplina":"Inglês","turma":"9º Ano","professor":"Gildania","eletiva":"Não","segmento":"Fundamental II"},
  {"id":54,"disciplina":"Física","turma":"9º Ano","professor":"Laura","eletiva":"Não","segmento":"Fundamental II"},
  {"id":55,"disciplina":"Química","turma":"9º Ano","professor":"Laura","eletiva":"Não","segmento":"Fundamental II"},
  {"id":56,"disciplina":"Matemática","turma":"9º Ano","professor":"Wanderley","eletiva":"Não","segmento":"Fundamental II"},
  {"id":57,"disciplina":"História","turma":"9º Ano","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":58,"disciplina":"Filosofia","turma":"9º Ano","professor":"Josiane","eletiva":"Não","segmento":"Fundamental II"},
  {"id":59,"disciplina":"Educação Física","turma":"9º Ano","professor":"Herica","eletiva":"Não","segmento":"Fundamental II"},
  {"id":60,"disciplina":"Redação","turma":"9º Ano","professor":"Jordana","eletiva":"Não","segmento":"Fundamental II"},
  {"id":61,"disciplina":"Geografia","turma":"1º Médio","professor":"Gilson Santos","eletiva":"Não","segmento":"Médio"},
  {"id":62,"disciplina":"Observatório Geográfico","turma":"1º Médio","professor":"Gilson Santos","eletiva":"Sim","segmento":"Médio"},
  {"id":63,"disciplina":"Projeto de Vida","turma":"1º Médio","professor":"Gilson Santos","eletiva":"Sim","segmento":"Médio"},
  {"id":64,"disciplina":"Núcleo de Análises Historiográficas","turma":"1º Médio","professor":"Gilson Santos","eletiva":"Sim","segmento":"Médio"},
  {"id":65,"disciplina":"Matemática","turma":"1º Médio","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Médio"},
  {"id":66,"disciplina":"Física","turma":"1º Médio","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Médio"},
  {"id":67,"disciplina":"Empreendedorismo","turma":"1º Médio","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Médio"},
  {"id":68,"disciplina":"Português","turma":"1º Médio","professor":"Janaine","eletiva":"Não","segmento":"Médio"},
  {"id":69,"disciplina":"Literatura","turma":"1º Médio","professor":"Janaine","eletiva":"Não","segmento":"Médio"},
  {"id":70,"disciplina":"Inglês","turma":"1º Médio","professor":"Gildania","eletiva":"Não","segmento":"Médio"},
  {"id":71,"disciplina":"Química","turma":"1º Médio","professor":"Laura","eletiva":"Não","segmento":"Médio"},
  {"id":72,"disciplina":"Biologia","turma":"1º Médio","professor":"Laura","eletiva":"Não","segmento":"Médio"},
  {"id":73,"disciplina":"História","turma":"1º Médio","professor":"Josiane","eletiva":"Não","segmento":"Médio"},
  {"id":74,"disciplina":"Filosofia","turma":"1º Médio","professor":"Josiane","eletiva":"Não","segmento":"Médio"},
  {"id":75,"disciplina":"Educação Física","turma":"1º Médio","professor":"Herica","eletiva":"Não","segmento":"Médio"},
  {"id":76,"disciplina":"Criação e Estudos de Artes","turma":"1º Médio","professor":"Jordana","eletiva":"Sim","segmento":"Médio"},
  {"id":77,"disciplina":"Oficina de Literatura","turma":"1º Médio","professor":"Jordana","eletiva":"Sim","segmento":"Médio"},
  {"id":78,"disciplina":"Prática de Argumentação","turma":"1º Médio","professor":"Jordana","eletiva":"Sim","segmento":"Médio"},
  {"id":79,"disciplina":"Geografia","turma":"2º Médio","professor":"Gilson Santos","eletiva":"Não","segmento":"Médio"},
  {"id":80,"disciplina":"Observatório Geográfico","turma":"2º Médio","professor":"Gilson Santos","eletiva":"Sim","segmento":"Médio"},
  {"id":81,"disciplina":"Criação e Estudos de Artes","turma":"2º Médio","professor":"Gilson Santos","eletiva":"Sim","segmento":"Médio"},
  {"id":82,"disciplina":"Núcleo de Análises Historiográficas","turma":"2º Médio","professor":"Gilson Santos","eletiva":"Sim","segmento":"Médio"},
  {"id":83,"disciplina":"Empreendedorismo","turma":"2º Médio","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Médio"},
  {"id":84,"disciplina":"Português","turma":"2º Médio","professor":"Janaine","eletiva":"Não","segmento":"Médio"},
  {"id":85,"disciplina":"Literatura","turma":"2º Médio","professor":"Janaine","eletiva":"Não","segmento":"Médio"},
  {"id":86,"disciplina":"Química","turma":"2º Médio","professor":"Janaine","eletiva":"Não","segmento":"Médio"},
  {"id":87,"disciplina":"Inglês","turma":"2º Médio","professor":"Gildania","eletiva":"Não","segmento":"Médio"},
  {"id":88,"disciplina":"Biologia","turma":"2º Médio","professor":"Laura","eletiva":"Não","segmento":"Médio"},
  {"id":89,"disciplina":"Matemática","turma":"2º Médio","professor":"Wanderley","eletiva":"Não","segmento":"Médio"},
  {"id":90,"disciplina":"Núcleo de Investigação Matemática","turma":"2º Médio","professor":"Wanderley","eletiva":"Sim","segmento":"Médio"},
  {"id":91,"disciplina":"Física","turma":"2º Médio","professor":"Wanderley","eletiva":"Não","segmento":"Médio"},
  {"id":92,"disciplina":"História","turma":"2º Médio","professor":"Josiane","eletiva":"Não","segmento":"Médio"},
  {"id":93,"disciplina":"Filosofia","turma":"2º Médio","professor":"Josiane","eletiva":"Não","segmento":"Médio"},
  {"id":94,"disciplina":"Educação Física","turma":"2º Médio","professor":"Herica","eletiva":"Não","segmento":"Médio"},
  {"id":95,"disciplina":"Oficina de Literatura","turma":"2º Médio","professor":"Jordana","eletiva":"Sim","segmento":"Médio"},
  {"id":96,"disciplina":"Prática de Argumentação","turma":"2º Médio","professor":"Jordana","eletiva":"Sim","segmento":"Médio"},
  {"id":97,"disciplina":"Artes","turma":"2º Médio","professor":"Jordana","eletiva":"Não","segmento":"Médio"},
  {"id":98,"disciplina":"Geografia","turma":"3º Médio","professor":"Gilson Santos","eletiva":"Não","segmento":"Médio"},
  {"id":99,"disciplina":"Estudos Avançados de Geografia","turma":"3º Médio","professor":"Gilson Santos","eletiva":"Sim","segmento":"Médio"},
  {"id":100,"disciplina":"Sociologia","turma":"3º Médio","professor":"Gilson Santos","eletiva":"Não","segmento":"Médio"},
  {"id":101,"disciplina":"Empreendedorismo","turma":"3º Médio","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Médio"},
  {"id":102,"disciplina":"Matemática","turma":"3º Médio","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Médio"},
  {"id":103,"disciplina":"Física","turma":"3º Médio","professor":"Rodrigo Neris","eletiva":"Não","segmento":"Médio"},
  {"id":104,"disciplina":"Português","turma":"3º Médio","professor":"Janaine","eletiva":"Não","segmento":"Médio"},
  {"id":105,"disciplina":"Literatura","turma":"3º Médio","professor":"Janaine","eletiva":"Não","segmento":"Médio"},
  {"id":106,"disciplina":"Química","turma":"3º Médio","professor":"Janaine","eletiva":"Não","segmento":"Médio"},
  {"id":107,"disciplina":"Inglês","turma":"3º Médio","professor":"Gildania","eletiva":"Não","segmento":"Médio"},
  {"id":108,"disciplina":"Biologia","turma":"3º Médio","professor":"Laura","eletiva":"Não","segmento":"Médio"},
  {"id":109,"disciplina":"Projeto de Vida","turma":"3º Médio","professor":"Laura","eletiva":"Sim","segmento":"Médio"},
  {"id":110,"disciplina":"História","turma":"3º Médio","professor":"Josiane","eletiva":"Não","segmento":"Médio"},
  {"id":111,"disciplina":"Filosofia","turma":"3º Médio","professor":"Josiane","eletiva":"Não","segmento":"Médio"},
  {"id":112,"disciplina":"Estudos Avançados História","turma":"3º Médio","professor":"Josiane","eletiva":"Sim","segmento":"Médio"},
  {"id":113,"disciplina":"Educação Física","turma":"3º Médio","professor":"Herica","eletiva":"Não","segmento":"Médio"},
  {"id":114,"disciplina":"Artes","turma":"3º Médio","professor":"Jordana","eletiva":"Não","segmento":"Médio"},
  {"id":115,"disciplina":"Análise e Produção Textual","turma":"3º Médio","professor":"Jordana","eletiva":"Sim","segmento":"Médio"},
  {"id":116,"disciplina":"Núcleo de Investigação Matemática","turma":"1º Médio","professor":"Rodrigo Neris","eletiva":"Sim","segmento":"Médio"}
];

// Cores por disciplina (para chips)
const CHIP_COLORS = {
  'Matemática':'chip-matematica','Português':'chip-portugues',
  'História':'chip-historia','Ciências':'chip-ciencias',
  'Inglês':'chip-ingles'
};

// =============================================
// ESTADO GLOBAL
// =============================================
const STATE = {
  disciplinas: [],        // Array de todas disciplinas
  criterios: {
    professores: {},      // { 'Nome': { dias: [1,2,3,4,5] } }
    preferencias: {},     // { 'id': { prioridade, ordem, diaFixo } }
    config: {
      maxProvasDia: 2,
      intervaloMinimo: 1,
      incluirFDS: false,
      datasBloqueadas: [],  // [{data, motivo}]
    }
  },
  turmas: {
    ativas: new Set(),    // Set de turmas selecionadas
    config: {},           // { 'turma': { maxProvas, disciplinasAtivas } }
  },
  calendario:   null,       // Resultado gerado
  naoCouberem:  [],         // Disciplinas que não couberam no período
};

// =============================================
// INICIALIZAÇÃO
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
});

async function carregarDados() {
  // Primeiro tenta localStorage
  const salvo = localStorage.getItem('provas_disciplinas');
  if (salvo) {
    try {
      STATE.disciplinas = JSON.parse(salvo);
      finalizarCarregamento();
      return;
    } catch(e) { /* segue */ }
  }

  // Tenta carregar o JSON local
  try {
    const r = await fetch(DB_URL + '?v=' + Date.now());
    if (!r.ok) throw new Error('Não encontrado');
    STATE.disciplinas = await r.json();
    localStorage.setItem('provas_disciplinas', JSON.stringify(STATE.disciplinas));
    finalizarCarregamento();
    toast('Dados carregados de disciplinas.json!', 'success');
  } catch(e) {
    // Usa dados embutidos como fallback (funciona em file:// local)
    if (DADOS_EMBUTIDOS && DADOS_EMBUTIDOS.length) {
      STATE.disciplinas = JSON.parse(JSON.stringify(DADOS_EMBUTIDOS));
      localStorage.setItem('provas_disciplinas', JSON.stringify(STATE.disciplinas));
      finalizarCarregamento();
      toast('✅ Banco carregado com ' + STATE.disciplinas.length + ' disciplinas!', 'success');
    } else {
      STATE.disciplinas = [];
      finalizarCarregamento();
      toast('Iniciando com banco vazio. Importe ou cadastre disciplinas.', 'info');
    }
  }
}

function finalizarCarregamento() {
  // Carrega critérios salvos
  const crit = localStorage.getItem('provas_criterios');
  if (crit) STATE.criterios = JSON.parse(crit);

  // Carrega turmas salvas
  const turmas = localStorage.getItem('provas_turmas');
  if (turmas) {
    const t = JSON.parse(turmas);
    STATE.turmas.ativas = new Set(t.ativas || []);
    STATE.turmas.config  = t.config || {};
  }

  // Inicializa critérios de disponibilidade para cada professor
  const profs = getProfessores();
  profs.forEach(p => {
    if (!STATE.criterios.professores[p]) {
      STATE.criterios.professores[p] = { dias: [1,2,3,4,5] }; // seg-sex padrão
    }
  });

  // Inicializa preferências para cada disciplina
  STATE.disciplinas.forEach(d => {
    const key = String(d.id);
    if (!STATE.criterios.preferencias[key]) {
      STATE.criterios.preferencias[key] = {
        prioridade: 'Media',
        ordem: '',
        diaFixo: ''
      };
    }
  });

  renderAll();
  updateStatus();
}

function updateStatus() {
  const dot  = document.querySelector('.status-dot');
  const txt  = document.getElementById('status-text');
  if (STATE.disciplinas.length > 0) {
    dot.className = 'status-dot ok';
    txt.textContent = STATE.disciplinas.length + ' disciplinas';
  } else {
    dot.className = 'status-dot err';
    txt.textContent = 'Banco vazio';
  }
}

// =============================================
// HELPERS / UTILS
// =============================================
function getProfessores() {
  return [...new Set(STATE.disciplinas.map(d => d.professor))].sort();
}
function getTurmas() {
  return [...new Set(STATE.disciplinas.map(d => d.turma))].sort((a,b) => sortTurma(a,b));
}
function sortTurma(a, b) {
  const order = (t) => {
    if (t.includes('1º Ano')) return 1;
    if (t.includes('2º Ano')) return 2;
    if (t.includes('3º Ano')) return 3;
    if (t.includes('4º Ano')) return 4;
    if (t.includes('5º Ano')) return 5;
    if (t.includes('6º Ano A')) return 6;
    if (t.includes('6º Ano B')) return 7;
    if (t.includes('7º Ano')) return 8;
    if (t.includes('8º Ano')) return 9;
    if (t.includes('9º Ano')) return 10;
    if (t.includes('1º Médio')) return 11;
    if (t.includes('2º Médio')) return 12;
    if (t.includes('3º Médio')) return 13;
    return 99;
  };
  return order(a) - order(b);
}
function getSegmento(turma) {
  const t = STATE.disciplinas.find(d => d.turma === turma);
  return t ? t.segmento : '';
}
function nextId() {
  if (!STATE.disciplinas.length) return 1;
  return Math.max(...STATE.disciplinas.map(d => d.id)) + 1;
}
function salvarDisciplinasLocal() {
  localStorage.setItem('provas_disciplinas', JSON.stringify(STATE.disciplinas));
  updateStatus();
}
function salvarCriteriosLocal() {
  localStorage.setItem('provas_criterios', JSON.stringify(STATE.criterios));
}
function salvarTurmasLocal() {
  localStorage.setItem('provas_turmas', JSON.stringify({
    ativas: [...STATE.turmas.ativas],
    config: STATE.turmas.config
  }));
}
function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('pt-BR');
}
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}
function getDayOfWeek(dateStr) {
  return new Date(dateStr + 'T12:00:00').getDay(); // 0=Dom, 6=Sáb
}
function getChipClass(disciplina) {
  for (const [k,v] of Object.entries(CHIP_COLORS)) {
    if (disciplina.includes(k)) return v;
  }
  return 'chip-default';
}

// =============================================
// RENDER ALL
// =============================================
function renderAll() {
  renderTabCadastro();
  renderTabCriterios();
  renderTabTurmas();
  renderTurmasSummary();
}

// =============================================
// NAVEGAÇÃO DE ABAS
// =============================================
const TAB_CONFIG = {
  cadastro: { title: 'Cadastro de Disciplinas', desc: 'Gerencie professores, turmas e disciplinas' },
  criterios: { title: 'Critérios de Aplicação', desc: 'Configure disponibilidade, prioridades e regras gerais' },
  turmas:    { title: 'Turmas no Calendário',    desc: 'Selecione e configure as turmas participantes' },
  calendario:{ title: 'Gerar Calendário',        desc: 'Configure o período e gere o calendário automático' },
};

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('page-title').textContent = TAB_CONFIG[tab].title;
  document.getElementById('page-desc').textContent  = TAB_CONFIG[tab].desc;

  if (tab === 'calendario') renderTurmasSummary();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main    = document.querySelector('.main-content');
  sidebar.classList.toggle('open');
  sidebar.classList.toggle('collapsed');
  main.classList.toggle('full');
}

// =============================================
// TAB: CADASTRO
// =============================================
function renderTabCadastro() {
  renderDatalistProfessores();
  renderDatalistTurmas();
  renderFiltrosProfessores();
  filtrarDisciplinas();
}

function renderDatalistProfessores() {
  const dl = document.getElementById('list-professores');
  dl.innerHTML = getProfessores().map(p => `<option value="${p}">`).join('');
}
function renderDatalistTurmas() {
  const dl = document.getElementById('list-turmas');
  dl.innerHTML = getTurmas().map(t => `<option value="${t}">`).join('');
}
function renderFiltrosProfessores() {
  const sel = document.getElementById('filtro-professor');
  const val = sel.value;
  sel.innerHTML = '<option value="">Todos professores</option>' +
    getProfessores().map(p => `<option value="${p}">${p}</option>`).join('');
  sel.value = val;
}

function filtrarDisciplinas() {
  const busca   = (document.getElementById('filtro-busca').value || '').toLowerCase();
  const seg     = document.getElementById('filtro-segmento').value;
  const prof    = document.getElementById('filtro-professor').value;

  const lista = STATE.disciplinas.filter(d => {
    const matchBusca = !busca || d.disciplina.toLowerCase().includes(busca)
                               || d.turma.toLowerCase().includes(busca)
                               || d.professor.toLowerCase().includes(busca);
    const matchSeg   = !seg  || d.segmento === seg;
    const matchProf  = !prof || d.professor === prof;
    return matchBusca && matchSeg && matchProf;
  });

  renderTabelaDisciplinas(lista);

  const total   = STATE.disciplinas.length;
  const eletivas= STATE.disciplinas.filter(d => d.eletiva === 'Sim').length;
  document.getElementById('total-badge').textContent   = total + ' disciplinas';
  document.getElementById('eletiva-badge').textContent = eletivas + ' eletivas';
}

function renderTabelaDisciplinas(lista) {
  const tbody = document.getElementById('tbody-disciplinas');
  if (!lista.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Nenhuma disciplina encontrada</td></tr>';
    return;
  }
  tbody.innerHTML = lista.map(d => `
    <tr>
      <td><strong>${d.disciplina}</strong></td>
      <td>${d.turma}</td>
      <td>${d.professor}</td>
      <td>${badgeSegmento(d.segmento)}</td>
      <td>${d.eletiva==='Sim' ? '<span class="badge badge-eletiva">✨ Eletiva</span>' : '<span class="badge badge-regular">Regular</span>'}</td>
      <td>
        <div style="display:flex;gap:5px">
          <button class="btn-edit" onclick="editarDisciplina(${d.id})" title="Editar">✏️</button>
          <button class="btn-del"  onclick="confirmarExclusao(${d.id})" title="Excluir">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function badgeSegmento(s) {
  const map = { 'Fundamental I': 'badge-fi', 'Fundamental II': 'badge-fii', 'Médio': 'badge-medio' };
  return `<span class="badge ${map[s]||''}">${s||'—'}</span>`;
}

function salvarDisciplina(e) {
  e.preventDefault();
  const id    = document.getElementById('edit-id').value;
  const dados = {
    professor:  document.getElementById('inp-professor').value.trim(),
    turma:      document.getElementById('inp-turma').value.trim(),
    disciplina: document.getElementById('inp-disciplina').value.trim(),
    segmento:   document.getElementById('inp-segmento').value,
    eletiva:    document.getElementById('inp-eletiva').checked ? 'Sim' : 'Não',
  };

  if (!dados.professor || !dados.turma || !dados.disciplina || !dados.segmento) {
    toast('Preencha todos os campos obrigatórios!', 'error'); return;
  }

  if (id) {
    // Editar
    const idx = STATE.disciplinas.findIndex(d => String(d.id) === id);
    if (idx >= 0) {
      STATE.disciplinas[idx] = { ...STATE.disciplinas[idx], ...dados };
      toast('Disciplina atualizada!', 'success');
    }
  } else {
    // Novo
    STATE.disciplinas.push({ id: nextId(), ...dados });
    toast('Disciplina cadastrada!', 'success');
  }

  salvarDisciplinasLocal();
  // Reinicializa preferência se nova
  if (!id) {
    const newId = String(STATE.disciplinas[STATE.disciplinas.length-1].id);
    STATE.criterios.preferencias[newId] = { prioridade: 'Media', ordem: '', diaFixo: '' };
    salvarCriteriosLocal();
  }

  limparFormCadastro();
  renderAll();
}

function limparFormCadastro() {
  document.getElementById('form-disciplina').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('form-mode-icon').textContent = '➕';
  document.getElementById('form-mode-label').textContent = 'Nova Disciplina';
  document.getElementById('btn-salvar').textContent = '✅ Salvar';
}

function editarDisciplina(id) {
  const d = STATE.disciplinas.find(x => x.id === id);
  if (!d) return;
  document.getElementById('edit-id').value       = id;
  document.getElementById('inp-professor').value = d.professor;
  document.getElementById('inp-turma').value     = d.turma;
  document.getElementById('inp-disciplina').value= d.disciplina;
  document.getElementById('inp-segmento').value  = d.segmento || '';
  document.getElementById('inp-eletiva').checked = d.eletiva === 'Sim';
  document.getElementById('form-mode-icon').textContent  = '✏️';
  document.getElementById('form-mode-label').textContent = 'Editando Disciplina';
  document.getElementById('btn-salvar').textContent      = '💾 Atualizar';
  // Scroll ao form
  document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function confirmarExclusao(id) {
  const d = STATE.disciplinas.find(x => x.id === id);
  if (!d) return;
  abrirConfirm(
    '🗑️', 'Excluir Disciplina',
    `Deseja realmente excluir "<strong>${d.disciplina}</strong>" (${d.turma})?`,
    () => {
      STATE.disciplinas = STATE.disciplinas.filter(x => x.id !== id);
      delete STATE.criterios.preferencias[String(id)];
      salvarDisciplinasLocal(); salvarCriteriosLocal();
      renderAll();
      toast('Disciplina excluída!', 'success');
    }
  );
}

// =============================================
// EXPORT / IMPORT (dados do banco)
// =============================================
function exportData() {
  const payload = {
    disciplinas: STATE.disciplinas,
    criterios:   STATE.criterios,
    turmas: {
      ativas: [...STATE.turmas.ativas],
      config: STATE.turmas.config
    },
    exportedAt: new Date().toISOString()
  };
  downloadJSON(payload, 'dados_provas.json');
  toast('Dados exportados!', 'success');
}

function importData() {
  document.getElementById('import-file').click();
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.disciplinas && Array.isArray(data.disciplinas)) {
        STATE.disciplinas = data.disciplinas;
        if (data.criterios) STATE.criterios = data.criterios;
        if (data.turmas)    {
          STATE.turmas.ativas = new Set(data.turmas.ativas || []);
          STATE.turmas.config = data.turmas.config || {};
        }
        salvarDisciplinasLocal(); salvarCriteriosLocal(); salvarTurmasLocal();
        renderAll();
        updateStatus();
        toast('Dados importados com sucesso!', 'success');
      } else {
        toast('Arquivo inválido. Deve ter campo "disciplinas".', 'error');
      }
    } catch(err) {
      toast('Erro ao ler arquivo JSON.', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  a.click(); URL.revokeObjectURL(url);
}

// =============================================
// TAB: CRITÉRIOS
// =============================================
function renderTabCriterios() {
  renderDisponibilidade();
  renderPreferencias();
  renderConfigGeral();
  renderDatasBloqueadas();
  preencherFiltroPrefTurma();
}

function renderDisponibilidade() {
  const container = document.getElementById('disponibilidade-container');
  const profs = getProfessores();
  if (!profs.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">👩‍🏫</div><p>Nenhum professor cadastrado</p></div>';
    return;
  }

  // Garante que todos os profs estão no state
  profs.forEach(p => {
    if (!STATE.criterios.professores[p]) {
      STATE.criterios.professores[p] = { dias: [1,2,3,4,5] };
    }
  });

  container.innerHTML = profs.map(p => {
    const diasAtivos = STATE.criterios.professores[p]?.dias || [1,2,3,4,5];
    const dias = [1,2,3,4,5,6,0]; // Seg a Dom
    const labels = ['S','T','Q','Q','S','S','D'];
    const fullNames = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
    return `
    <div class="prof-availability">
      <span class="prof-name">👩‍🏫 ${p}</span>
      <div class="days-grid">
        ${dias.map((dia, i) => `
          <label class="day-check" data-tooltip="${fullNames[i]}">
            <input type="checkbox" ${diasAtivos.includes(dia) ? 'checked' : ''}
              onchange="toggleDiaProf('${p}', ${dia}, this.checked)" />
            <span class="day-chip">${labels[i]}</span>
          </label>
        `).join('')}
      </div>
    </div>`;
  }).join('');
}

function toggleDiaProf(prof, dia, checked) {
  if (!STATE.criterios.professores[prof]) {
    STATE.criterios.professores[prof] = { dias: [] };
  }
  const dias = STATE.criterios.professores[prof].dias;
  if (checked && !dias.includes(dia)) dias.push(dia);
  if (!checked) {
    const idx = dias.indexOf(dia);
    if (idx >= 0) dias.splice(idx, 1);
  }
  salvarCriteriosLocal();
}

function renderPreferencias() {
  const tbody      = document.getElementById('tbody-preferencias');
  const buscaEl    = document.getElementById('pref-busca');
  const turmaEl    = document.getElementById('pref-turma-filter');
  const busca      = (buscaEl?.value || '').toLowerCase();
  const turmaFilt  = turmaEl?.value || '';

  const lista = STATE.disciplinas.filter(d => {
    const matchB = !busca || d.disciplina.toLowerCase().includes(busca) || d.turma.toLowerCase().includes(busca);
    const matchT = !turmaFilt || d.turma === turmaFilt;
    return matchB && matchT;
  });

  if (!lista.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Nenhuma disciplina</td></tr>';
    return;
  }

  tbody.innerHTML = lista.map(d => {
    const key  = String(d.id);
    const pref = STATE.criterios.preferencias[key] || { prioridade:'Media', ordem:'', diaFixo:'' };
    return `
    <tr>
      <td><strong>${d.disciplina}</strong></td>
      <td><small>${d.turma}</small></td>
      <td>
        <select class="form-select" style="padding:5px 8px;font-size:12px"
          onchange="setPref(${d.id},'prioridade',this.value)">
          <option value="Alta"  ${pref.prioridade==='Alta'  ?'selected':''}>🔴 Alta</option>
          <option value="Media" ${pref.prioridade==='Media' ||!pref.prioridade?'selected':''}>🟡 Média</option>
          <option value="Baixa" ${pref.prioridade==='Baixa' ?'selected':''}>🟢 Baixa</option>
        </select>
      </td>
      <td>
        <select class="form-select" style="padding:5px 8px;font-size:12px"
          onchange="setPref(${d.id},'ordem',this.value)">
          <option value=""  ${!pref.ordem?'selected':''}>— Livre</option>
          <option value="1" ${pref.ordem==='1'?'selected':''}>1ª Prova</option>
          <option value="2" ${pref.ordem==='2'?'selected':''}>2ª Prova</option>
          <option value="3" ${pref.ordem==='3'?'selected':''}>3ª Prova</option>
          <option value="4" ${pref.ordem==='4'?'selected':''}>4ª Prova</option>
          <option value="5" ${pref.ordem==='5'?'selected':''}>5ª Prova</option>
        </select>
      </td>
      <td>
        <select class="form-select" style="padding:5px 8px;font-size:12px"
          onchange="setPref(${d.id},'diaFixo',this.value)">
          <option value="">— Qualquer dia</option>
          ${[1,2,3,4,5].map(d2 => `<option value="${d2}" ${pref.diaFixo==d2?'selected':''}>${DIAS_SEMANA_FULL[d2]}</option>`).join('')}
        </select>
      </td>
    </tr>`;
  }).join('');
}

function setPref(id, campo, valor) {
  const key = String(id);
  if (!STATE.criterios.preferencias[key]) {
    STATE.criterios.preferencias[key] = { prioridade:'Media', ordem:'', diaFixo:'' };
  }
  STATE.criterios.preferencias[key][campo] = valor;
  salvarCriteriosLocal();
}

function filtrarPreferencias() {
  renderPreferencias();
}

function preencherFiltroPrefTurma() {
  const sel = document.getElementById('pref-turma-filter');
  if (!sel) return;
  const val = sel.value;
  sel.innerHTML = '<option value="">Todas as turmas</option>' +
    getTurmas().map(t => `<option value="${t}">${t}</option>`).join('');
  sel.value = val;
}

function renderConfigGeral() {
  const cfg = STATE.criterios.config;
  const maxEl = document.getElementById('config-max-provas');
  const intEl = document.getElementById('config-intervalo');
  const fdsEl = document.getElementById('config-fds');
  if (maxEl) maxEl.value = cfg.maxProvasDia ?? 2;
  if (intEl) intEl.value = cfg.intervaloMinimo ?? 1;
  if (fdsEl) fdsEl.checked = cfg.incluirFDS ?? false;
}

function salvarConfig() {
  STATE.criterios.config.maxProvasDia   = parseInt(document.getElementById('config-max-provas').value) || 2;
  STATE.criterios.config.intervaloMinimo= parseInt(document.getElementById('config-intervalo').value)  || 1;
  STATE.criterios.config.incluirFDS     = document.getElementById('config-fds').checked;
  salvarCriteriosLocal();
  toast('Configurações salvas!', 'success');
}

function adicionarDataBloqueada() {
  const data   = document.getElementById('nova-data-bloqueada').value;
  const motivo = document.getElementById('motivo-data-bloqueada').value.trim();
  if (!data) { toast('Selecione uma data!', 'warning'); return; }
  const existing = STATE.criterios.config.datasBloqueadas.find(x => x.data === data);
  if (existing) { toast('Data já bloqueada!', 'warning'); return; }
  STATE.criterios.config.datasBloqueadas.push({ data, motivo });
  STATE.criterios.config.datasBloqueadas.sort((a,b) => a.data.localeCompare(b.data));
  salvarCriteriosLocal();
  document.getElementById('nova-data-bloqueada').value = '';
  document.getElementById('motivo-data-bloqueada').value = '';
  renderDatasBloqueadas();
  toast('Data bloqueada adicionada!', 'success');
}

function renderDatasBloqueadas() {
  const ul = document.getElementById('blocked-dates-list');
  if (!ul) return;
  const datas = STATE.criterios.config.datasBloqueadas || [];
  if (!datas.length) {
    ul.innerHTML = '<li style="color:var(--text-muted);font-size:12px;padding:6px">Nenhuma data bloqueada</li>';
    return;
  }
  ul.innerHTML = datas.map((item, i) => `
    <li class="blocked-date-item">
      <span>🚫 ${formatDate(item.data)} ${item.motivo ? '– '+item.motivo : ''}</span>
      <button class="blocked-date-rm" onclick="removerDataBloqueada(${i})" title="Remover">✕</button>
    </li>
  `).join('');
}

function removerDataBloqueada(idx) {
  STATE.criterios.config.datasBloqueadas.splice(idx, 1);
  salvarCriteriosLocal();
  renderDatasBloqueadas();
}

// =============================================
// TAB: TURMAS
// =============================================
function renderTabTurmas() {
  renderTurmasCheckboxes('todos');
  renderTurmaConfigPanel();
  preencherSelectTurmaDisc();
}

let currentSegFilter = 'todos';

function filtrarTurmasPorSegmento(seg, btn) {
  currentSegFilter = seg;
  document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTurmasCheckboxes(seg);
}

function renderTurmasCheckboxes(segFilt) {
  const container = document.getElementById('turmas-checkboxes');
  const turmas    = getTurmas();
  const filtradas = segFilt === 'todos' ? turmas : turmas.filter(t => getSegmento(t) === segFilt);

  if (!filtradas.length) {
    container.innerHTML = '<div class="empty-state" style="padding:20px"><p>Nenhuma turma neste segmento</p></div>';
    return;
  }

  container.innerHTML = filtradas.map(t => {
    const ativa = STATE.turmas.ativas.has(t);
    const seg   = getSegmento(t);
    return `
    <label class="turma-check-item ${ativa ? 'selected' : ''}" id="turma-item-${encodeId(t)}">
      <input type="checkbox" ${ativa ? 'checked' : ''}
        onchange="toggleTurma('${t}', this.checked, this.closest('label'))" />
      <span class="turma-check-label">${t}</span>
      <span class="turma-seg-tag">${seg}</span>
    </label>`;
  }).join('');
}

function encodeId(str) {
  return str.replace(/[^a-zA-Z0-9]/g,'_');
}

function toggleTurma(turma, ativa, labelEl) {
  if (ativa) {
    STATE.turmas.ativas.add(turma);
    labelEl?.classList.add('selected');
    // Inicializa config se necessário
    if (!STATE.turmas.config[turma]) {
      STATE.turmas.config[turma] = {
        maxProvas: STATE.criterios.config.maxProvasDia,
        disciplinasAtivas: STATE.disciplinas.filter(d => d.turma === turma).map(d => d.id)
      };
    }
  } else {
    STATE.turmas.ativas.delete(turma);
    labelEl?.classList.remove('selected');
  }
  salvarTurmasLocal();
  renderTurmaConfigPanel();
  renderTurmasSummary();
}

function selecionarTodasTurmas(ativar) {
  const turmas = getTurmas();
  const filtradas = currentSegFilter === 'todos' ? turmas : turmas.filter(t => getSegmento(t) === currentSegFilter);

  filtradas.forEach(t => {
    if (ativar) {
      STATE.turmas.ativas.add(t);
      if (!STATE.turmas.config[t]) {
        STATE.turmas.config[t] = {
          maxProvas: STATE.criterios.config.maxProvasDia,
          disciplinasAtivas: STATE.disciplinas.filter(d => d.turma === t).map(d => d.id)
        };
      }
    } else {
      STATE.turmas.ativas.delete(t);
    }
  });
  salvarTurmasLocal();
  renderTurmasCheckboxes(currentSegFilter);
  renderTurmaConfigPanel();
  renderTurmasSummary();
}

function renderTurmaConfigPanel() {
  const container = document.getElementById('turma-config-list');
  const ativas    = [...STATE.turmas.ativas].sort((a,b) => sortTurma(a,b));

  if (!ativas.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🏫</div><p>Selecione turmas ao lado para configurar</p></div>';
    return;
  }

  container.innerHTML = ativas.map(t => {
    const cfg = STATE.turmas.config[t] || { maxProvas: 2 };
    return `
    <div class="turma-config-item">
      <div class="turma-config-title">🏫 ${t}</div>
      <div class="turma-config-row">
        <label>Máx. provas/dia</label>
        <input type="number" min="1" max="5" value="${cfg.maxProvas || 2}"
          class="form-input" style="width:70px"
          onchange="setTurmaConfig('${t}','maxProvas',+this.value)" />
      </div>
    </div>`;
  }).join('');
}

function setTurmaConfig(turma, campo, valor) {
  if (!STATE.turmas.config[turma]) STATE.turmas.config[turma] = {};
  STATE.turmas.config[turma][campo] = valor;
  salvarTurmasLocal();
}

function preencherSelectTurmaDisc() {
  const sel = document.getElementById('turma-disc-view');
  const val = sel.value;
  sel.innerHTML = '<option value="">-- Selecione uma turma --</option>' +
    getTurmas().map(t => `<option value="${t}">${t}</option>`).join('');
  if (val) sel.value = val;
}

function renderDisciplinasTurma() {
  const turma   = document.getElementById('turma-disc-view').value;
  const body    = document.getElementById('disciplinas-turma-body');
  if (!turma) {
    body.innerHTML = '<div class="empty-state"><div class="empty-icon">📚</div><p>Selecione uma turma acima</p></div>';
    return;
  }

  const discTurma = STATE.disciplinas.filter(d => d.turma === turma);
  if (!discTurma.length) {
    body.innerHTML = '<div class="empty-state"><p>Nenhuma disciplina nesta turma</p></div>';
    return;
  }

  // Inicializa config de disciplinas ativas se necessário
  if (!STATE.turmas.config[turma]) {
    STATE.turmas.config[turma] = { maxProvas: 2, disciplinasAtivas: discTurma.map(d => d.id) };
  }
  if (!STATE.turmas.config[turma].disciplinasAtivas) {
    STATE.turmas.config[turma].disciplinasAtivas = discTurma.map(d => d.id);
  }

  const ativas = new Set(STATE.turmas.config[turma].disciplinasAtivas);

  body.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 0">
      <button class="btn btn-ghost small" onclick="toggleAllDiscTurma('${turma}', true)">✅ Todas</button>
      <button class="btn btn-ghost small" onclick="toggleAllDiscTurma('${turma}', false)">❌ Nenhuma</button>
      <button class="btn btn-ghost small" onclick="toggleEletivasTurma('${turma}')">⚡ Excluir Eletivas</button>
    </div>
    <div style="display:flex;flex-wrap:wrap;margin-top:10px">
      ${discTurma.map(d => {
        const at = ativas.has(d.id);
        return `
        <span class="disc-tag ${at ? 'ativa' : 'inativa'}" id="disc-tag-${d.id}">
          ${at ? '✅' : '⬜'} ${d.disciplina}
          ${d.eletiva==='Sim'?'<small>(E)</small>':''}
          <span class="disc-toggle" onclick="toggleDiscAt('${turma}',${d.id})" title="${at?'Desativar':'Ativar'}">
            ${at ? '✕' : '+'}
          </span>
        </span>`;
      }).join('')}
    </div>`;
}

function toggleDiscAt(turma, discId) {
  if (!STATE.turmas.config[turma]) STATE.turmas.config[turma] = { disciplinasAtivas: [] };
  const ativas = STATE.turmas.config[turma].disciplinasAtivas;
  const idx = ativas.indexOf(discId);
  if (idx >= 0) ativas.splice(idx, 1);
  else ativas.push(discId);
  salvarTurmasLocal();
  renderDisciplinasTurma();
}

function toggleAllDiscTurma(turma, ativar) {
  const discTurma = STATE.disciplinas.filter(d => d.turma === turma).map(d => d.id);
  if (!STATE.turmas.config[turma]) STATE.turmas.config[turma] = {};
  STATE.turmas.config[turma].disciplinasAtivas = ativar ? [...discTurma] : [];
  salvarTurmasLocal();
  renderDisciplinasTurma();
}

function toggleEletivasTurma(turma) {
  const discTurma   = STATE.disciplinas.filter(d => d.turma === turma);
  const regulares   = discTurma.filter(d => d.eletiva !== 'Sim').map(d => d.id);
  if (!STATE.turmas.config[turma]) STATE.turmas.config[turma] = {};
  STATE.turmas.config[turma].disciplinasAtivas = regulares;
  salvarTurmasLocal();
  renderDisciplinasTurma();
}

function renderTurmasSummary() {
  const el    = document.getElementById('turmas-summary');
  if (!el) return;
  const ativas = [...STATE.turmas.ativas].sort((a,b) => sortTurma(a,b));
  if (!ativas.length) {
    el.textContent = 'Nenhuma turma selecionada. Configure na aba Turmas.';
    return;
  }
  el.textContent = ativas.join(' · ');
}

// =============================================
// TAB: CALENDÁRIO – GERAÇÃO
// =============================================
function gerarCalendario() {
  const inicio = document.getElementById('cal-data-inicio').value;
  const fim    = document.getElementById('cal-data-fim').value;

  if (!inicio || !fim) {
    toast('Selecione a data inicial e final!', 'warning'); return;
  }
  if (inicio > fim) {
    toast('Data inicial deve ser anterior à data final!', 'error'); return;
  }
  if (!STATE.turmas.ativas.size) {
    toast('Selecione ao menos uma turma na aba Turmas!', 'warning'); return;
  }

  // Mostrar loading
  const btn = document.getElementById('btn-gerar');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Gerando...';

  setTimeout(() => {
    try {
      const { resultado, naoCouberem } = algoritmoGeracao(inicio, fim);
      STATE.calendario    = resultado;
      STATE.naoCouberem   = naoCouberem;
      renderCalendario();
      renderNaoCouberem();
      document.getElementById('calendario-resultado').style.display = 'block';
      document.getElementById('calendario-resultado').scrollIntoView({ behavior:'smooth' });
      const aviso = naoCouberem.length
        ? ` ⚠️ ${naoCouberem.length} disciplina(s) não couberam no período.`
        : '';
      toast(`✅ ${contarTotalProvas(resultado)} provas distribuídas.${aviso}`,
             naoCouberem.length ? 'warning' : 'success');
    } catch(err) {
      toast('Erro ao gerar calendário: ' + err.message, 'error');
      console.error(err);
    }
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">⚡</span> Gerar Calendário Automático';
  }, 100);
}

// =============================================
// ALGORITMO DE GERAÇÃO (v3 – dia a dia, turma a turma)
// =============================================
function algoritmoGeracao(inicio, fim) {
  const cfg       = STATE.criterios.config;
  const maxDia    = cfg.maxProvasDia || 2;
  const intervalo = cfg.intervaloMinimo || 1;
  const bloqueadas = new Set((cfg.datasBloqueadas || []).map(x => x.data));
  const priorMap   = { 'Alta': 0, 'Media': 1, 'Baixa': 2 };

  // ---- Dias disponíveis ----
  const diasDisponiveis = [];
  let d = inicio;
  while (d <= fim) {
    const dow = getDayOfWeek(d);
    if (!bloqueadas.has(d) && (dow !== 0 && dow !== 6 || cfg.incluirFDS)) {
      diasDisponiveis.push(d);
    }
    d = addDays(d, 1);
  }
  if (!diasDisponiveis.length) throw new Error('Nenhum dia disponível no período selecionado!');

  // ---- Monta disciplinas PENDENTES por turma (ordenadas por prioridade) ----
  // Cada item tem uma chave única para rastrear alocação
  const pendentePorTurma = {}; // { turma: [disc, ...] }
  const turmasOrdem = [...STATE.turmas.ativas].sort((a, b) => sortTurma(a, b));

  turmasOrdem.forEach(turma => {
    const turmaConfig   = STATE.turmas.config[turma] || {};
    const discIdsAtivas = turmaConfig.disciplinasAtivas;
    let discList = STATE.disciplinas.filter(x => x.turma === turma);
    if (discIdsAtivas && discIdsAtivas.length) {
      discList = discList.filter(x => discIdsAtivas.includes(x.id));
    }
   // ====================================================
    // ORDENAÇÃO POR PROFESSOR AGRUPADO
    // Objetivo: se um professor tem 2+ disciplinas na turma,
    // elas ficam em sequência (bloco consecutivo de dias).
    // 
    // Cada professor recebe uma "nota" baseada na sua
    // MELHOR disciplina (mais prioritária / menor ordem).
    // O professor mais prioritário vem primeiro como bloco.
    // ====================================================

    // 1) Calcula, para cada professor desta turma, a sua melhor nota
    const profBestPrio  = {}; // { prof: menor valor numérico de prioridade }
    const profBestOrder = {}; // { prof: menor ordem configurada }
    discList.forEach(disc => {
      const pref  = STATE.criterios.preferencias[String(disc.id)] || {};
      const order = pref.ordem ? parseInt(pref.ordem) : 99;
      const prio  = priorMap[pref.prioridade || 'Media'] ?? 1;
      const prof  = disc.professor;
      if (profBestPrio[prof]  === undefined || prio  < profBestPrio[prof])  profBestPrio[prof]  = prio;
      if (profBestOrder[prof] === undefined || order < profBestOrder[prof]) profBestOrder[prof] = order;
    });

    // 2) Ordena: agrupa por professor (bloco), professores ordenados pela sua melhor nota
    discList = discList.slice().sort((a, b) => {
      const profA = a.professor, profB = b.professor;
      const pa = STATE.criterios.preferencias[String(a.id)] || {};
      const pb = STATE.criterios.preferencias[String(b.id)] || {};

      if (profA !== profB) {
        // Professores diferentes → ordena pelo professor mais prioritário
        const pDiff = profBestPrio[profA]  - profBestPrio[profB];
        if (pDiff !== 0) return pDiff;
        const oDiff = profBestOrder[profA] - profBestOrder[profB];
        if (oDiff !== 0) return oDiff;
        return profA.localeCompare(profB); // desempate alfabético
      }

      // Mesmo professor → ordena pela ordem/prioridade da própria disciplina
      const orderA = pa.ordem ? parseInt(pa.ordem) : 99;
      const orderB = pb.ordem ? parseInt(pb.ordem) : 99;
      const prioA  = priorMap[pa.prioridade || 'Media'] ?? 1;
      const prioB  = priorMap[pb.prioridade || 'Media'] ?? 1;
      if (orderA !== orderB) return orderA - orderB;
      return prioA - prioB;
    });

    // Marca cada uma com alocada = false
    pendentePorTurma[turma] = discList.map(x => ({ ...x, _alocada: false }));
  });

  // Re-ordena turmas: turmas com MAIS disciplinas são alocadas primeiro
  // para garantir que seus professores sejam priorizados
  turmasOrdem.sort((a, b) => {
    const countA = (pendentePorTurma[a] || []).length;
    const countB = (pendentePorTurma[b] || []).length;
    return countB - countA; // decrescente
  });


  const resultado          = {};  // { data: [{ turma, disciplina, ... }] }
  const naoCouberem        = [];  // disciplinas que sobraram
  const professorDiaGlobal = {};  // { 'prof|data': true } — professor em 1 turma/dia
  const ultimaDiaMap       = {};  // { 'turma|disc': ultimaData }

  // =====================================================
  // HELPER: tenta alocar provas para uma turma num dia
  // Retorna quantas provas foram alocadas
  // =====================================================
  function alocarTurmaNoDay(turma, data, dow, maxSlots, checkProfConflict) {
    const pendentes = pendentePorTurma[turma];
    if (!pendentes || !pendentes.length) return 0;

    let slotsUsados = 0;

    // Agrupa disciplinas pendentes por professor
    const profGroups = [];
    const visitedProfs = new Set();
    pendentes.forEach(d => {
      if (!d._alocada && !visitedProfs.has(d.professor)) {
        visitedProfs.add(d.professor);
        profGroups.push(pendentes.filter(x => !x._alocada && x.professor === d.professor));
      }
    });

    // Ordena: prefere grupos que cabem nos slots e são maiores
    profGroups.sort((a, b) => {
      const aFits = a.length <= maxSlots;
      const bFits = b.length <= maxSlots;
      if (aFits !== bFits) return aFits ? -1 : 1;
      if (aFits && bFits && a.length !== b.length) return b.length - a.length;
      return 0;
    });

    for (const group of profGroups) {
      if (slotsUsados >= maxSlots) break;

      const prof = group[0].professor;
      const diasProf = STATE.criterios.professores[prof]?.dias || [1,2,3,4,5];
      if (!diasProf.includes(dow)) continue;

      // Conflito de professor (pode ser relaxado)
      const profKeyGlobal = prof + '|' + data;
      if (checkProfConflict) {
        if (professorDiaGlobal[profKeyGlobal] && professorDiaGlobal[profKeyGlobal] !== turma) continue;
      }

      const elegíveis = group.filter(disc => {
        const pref = STATE.criterios.preferencias[String(disc.id)] || {};
        const diaFixo = pref.diaFixo ? parseInt(pref.diaFixo) : null;
        if (diaFixo !== null && dow !== diaFixo) return false;
        const keyCont = turma + '|' + disc.disciplina;
        if (ultimaDiaMap[keyCont] && daysBetween(ultimaDiaMap[keyCont], data) < intervalo) return false;
        return true;
      });

      if (!elegíveis.length) continue;

      const slotsRestantes = maxSlots - slotsUsados;
      const chunk = elegíveis.slice(0, slotsRestantes);

      for (const disc of chunk) {
        if (!resultado[data]) resultado[data] = [];
        const pref = STATE.criterios.preferencias[String(disc.id)] || {};

        resultado[data].push({
          turma,
          disciplina: disc.disciplina,
          professor:  prof,
          eletiva:    disc.eletiva,
          segmento:   disc.segmento,
          prioridade: pref.prioridade || 'Media',
          discId:     disc.id,
          observacao: '',
        });

        professorDiaGlobal[profKeyGlobal] = turma;
        const keyCont = turma + '|' + disc.disciplina;
        ultimaDiaMap[keyCont] = data;
        disc._alocada = true;
        slotsUsados++;
      }
    }
    return slotsUsados;
  }

  // =====================================================
  // ESTRATÉGIA: DUAS PASSADAS POR DIA
  // Pass 1: garante pelo menos 1 prova por turma (todas turmas com prova todo dia)
  // Pass 2: preenche slots restantes até effectiveMax
  // =====================================================
  const turmaSlotsDia = {}; // { 'turma|data': count }

  for (let di = 0; di < diasDisponiveis.length; di++) {
    const data = diasDisponiveis[di];
    const dow  = getDayOfWeek(data);
    const daysLeft = diasDisponiveis.length - di;

    // ========== PASS 1: 1 prova por turma (conflito de professor estrito) ==========
    for (const turma of turmasOrdem) {
      const remaining = (pendentePorTurma[turma] || []).filter(x => !x._alocada).length;
      if (remaining === 0) continue;

      const allocated = alocarTurmaNoDay(turma, data, dow, 1, true);
      turmaSlotsDia[turma + '|' + data] = allocated;
    }

    // ========== PASS 1.5: turmas que ficaram com 0 — relaxa conflito de professor ==========
    for (const turma of turmasOrdem) {
      if ((turmaSlotsDia[turma + '|' + data] || 0) > 0) continue;
      const remaining = (pendentePorTurma[turma] || []).filter(x => !x._alocada).length;
      if (remaining === 0) continue;

      const allocated = alocarTurmaNoDay(turma, data, dow, 1, false);
      turmaSlotsDia[turma + '|' + data] = allocated;
    }

    // ========== PASS 2: preenche slots extras até effectiveMax ==========
    for (const turma of turmasOrdem) {
      const turmaConfig = STATE.turmas.config[turma] || {};
      const maxTurma = turmaConfig.maxProvas || maxDia;
      const remaining = (pendentePorTurma[turma] || []).filter(x => !x._alocada).length;
      if (remaining === 0) continue;

      const effectiveMax = Math.min(maxTurma, Math.max(1, Math.ceil(remaining / daysLeft)));
      const jaAlocados = turmaSlotsDia[turma + '|' + data] || 0;
      const slotsExtras = effectiveMax - jaAlocados;
      if (slotsExtras <= 0) continue;

      const allocated = alocarTurmaNoDay(turma, data, dow, slotsExtras, true);
      turmaSlotsDia[turma + '|' + data] = jaAlocados + allocated;
    }
  }

  // ---- Coleta não alocadas ----
  turmasOrdem.forEach(turma => {
    (pendentePorTurma[turma] || []).forEach(disc => {
      if (!disc._alocada) {
        const pref = STATE.criterios.preferencias[String(disc.id)] || {};
        naoCouberem.push({
          turma,
          disciplina: disc.disciplina,
          professor:  disc.professor,
          eletiva:    disc.eletiva,
          segmento:   disc.segmento,
          discId:     disc.id,
          motivo:     'Período insuficiente ou professor ocupado em outra turma',
          observacao: '',
          dataManual: '',
        });
      }
    });
  });

  return { resultado, naoCouberem };
}






function daysBetween(d1, d2) {
  const a = new Date(d1 + 'T12:00:00');
  const b = new Date(d2 + 'T12:00:00');
  return Math.round((b - a) / 86400000);
}

function contarTotalProvas(cal) {
  if (!cal) return 0;
  return Object.values(cal).reduce((s, arr) => s + arr.length, 0);
}

// =============================================
// PAINEL: DISCIPLINAS NÃO ALOCADAS
// =============================================
function renderNaoCouberem() {
  const painel = document.getElementById('painel-nao-couberam');
  if (!painel) return;

  // O painel separado não é mais usado — as disciplinas não alocadas
  // agora aparecem inline dentro de cada turma na "Visão por Turma"
  painel.style.display = 'none';

  // Re-renderiza a lista para atualizar as disciplinas inline
  renderVisualizacaoLista();
}

function setNaoDataManual(idx, data) {
  if (STATE.naoCouberem[idx]) {
    STATE.naoCouberem[idx].dataManual = data;
    // Ativa o botão de inserir
    const btn = document.querySelector(`#nao-row-${idx} .btn-secondary`);
    if (btn) btn.disabled = !data;
  }
}

function setNaoObservacao(idx, obs) {
  if (STATE.naoCouberem[idx]) STATE.naoCouberem[idx].observacao = obs;
}

function inserirNaoAlocado(idx) {
  const item = STATE.naoCouberem[idx];
  if (!item || !item.dataManual) {
    toast('Selecione uma data para inserir!', 'warning'); return;
  }

  if (!STATE.calendario[item.dataManual]) STATE.calendario[item.dataManual] = [];
  STATE.calendario[item.dataManual].push({
    turma:      item.turma,
    disciplina: item.disciplina,
    professor:  item.professor,
    eletiva:    item.eletiva,
    segmento:   item.segmento,
    prioridade: item.eletiva === 'Sim' ? 'Baixa' : 'Media',
    discId:     item.discId,
    observacao: item.observacao || '',
    manual:     true,
  });

  STATE.naoCouberem.splice(idx, 1);
  renderCalendario();
  renderNaoCouberem();
  toast(`✅ "${item.disciplina}" inserida em ${formatDate(item.dataManual)}!`, 'success');
}

function descartarNaoAlocado(idx) {
  const item = STATE.naoCouberem[idx];
  if (!item) return;
  abrirConfirm('🗑️', 'Descartar Disciplina',
    `Deseja remover "<strong>${item.disciplina}</strong>" (${item.turma}) da lista de pendências?`,
    () => {
      STATE.naoCouberem.splice(idx, 1);
      renderNaoCouberem();
      toast('Disciplina descartada da lista.', 'info');
    });
}



// =============================================
// RENDERIZAÇÃO DO CALENDÁRIO
// =============================================
function renderCalendario() {
  renderVisualizacaoGrid();
  renderVisualizacaoLista();
  renderVisualizacaoProfessor();
}

function mudarVisualizacao(tipo, btn) {
  document.querySelectorAll('.cal-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cal-view').forEach(v => v.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('cal-view-' + tipo).classList.add('active');
}

/* ---- VISÃO GRID ---- */
function renderVisualizacaoGrid() {
  if (!STATE.calendario) return;
  const container = document.getElementById('calendario-grid');

  const todasDatas = Object.keys(STATE.calendario).sort();
  if (!todasDatas.length) {
    container.innerHTML = '<div class="empty-state"><p>Nenhuma prova foi alocada</p></div>';
    return;
  }

  const inicio = todasDatas[0];
  const fim    = todasDatas[todasDatas.length - 1];

  // Agrupa por mês
  const meses = {};
  let cur = inicio;
  while (cur <= addDays(fim, 6)) {
    const mes = cur.slice(0,7);
    if (!meses[mes]) meses[mes] = [];
    meses[mes].push(cur);
    cur = addDays(cur, 1);
  }

  container.innerHTML = Object.entries(meses).map(([mes, dias]) => {
    const [ano, mesNum] = mes.split('-');
    const primeiroDia   = getDayOfWeek(mes + '-01');
    const totalDias     = new Date(parseInt(ano), parseInt(mesNum), 0).getDate();
    const cells         = [];
    // blanks before
    for (let i = 0; i < primeiroDia; i++) cells.push('<div class="cal-day outside"></div>');
    // days
    for (let day = 1; day <= totalDias; day++) {
      const dateStr = mes + '-' + String(day).padStart(2,'0');
      const provas  = STATE.calendario[dateStr] || [];
      const dow     = getDayOfWeek(dateStr);
      const isWeekend = dow === 0 || dow === 6;
      const isToday   = dateStr === new Date().toISOString().split('T')[0];
      const inRange   = dateStr >= inicio && dateStr <= fim;

      let classes = 'cal-day';
      if (isWeekend) classes += ' weekend';
      if (isToday)   classes += ' today';
      if (!inRange)  classes += ' outside';

      cells.push(`
        <div class="${classes}">
          <div class="cal-day-num">${day}</div>
          <div class="cal-provas-list">
            ${provas.slice(0,4).map(p => {
                const chipClass = p.manual ? 'chip-manual' : getChipClass(p.disciplina);
                const obsHint = p.observacao ? ` 📝 ${p.observacao}` : '';
                const manualHint = p.manual ? ' ⚠️ Inserção manual' : '';
                const title = `${p.disciplina} – ${p.turma} (${p.professor})${manualHint}${obsHint}`;
                return `
              <div class="cal-prova-chip ${chipClass}" title="${title}">
                ${p.manual ? '📝 ' : ''}${p.disciplina.substring(0,11)}${p.disciplina.length>11?'…':''}
              </div>`;
              }).join('')}
            ${provas.length > 4 ? `<div class="cal-prova-chip chip-default">+${provas.length-4}</div>` : ''}
          </div>
        </div>`);
    }

    return `
    <div class="cal-month-section">
      <div class="cal-month-title">${MESES[parseInt(mesNum)-1]} ${ano}</div>
      <div class="cal-week-grid">
        ${DIAS_SEMANA.map(d => `<div class="cal-day-header">${d}</div>`).join('')}
        ${cells.join('')}
      </div>
    </div>`;
  }).join('');
}

/* ---- VISÃO LISTA ---- */
function renderVisualizacaoLista() {
  if (!STATE.calendario) return;
  const container = document.getElementById('calendario-lista');

  const porTurma = {};
  Object.entries(STATE.calendario).forEach(([data, provas]) => {
    provas.forEach(p => {
      if (!porTurma[p.turma]) porTurma[p.turma] = [];
      porTurma[p.turma].push({ data, ...p });
    });
  });

  // Agrupa não-alocadas por turma
  const naoPorTurma = {};
  (STATE.naoCouberem || []).forEach((item, idx) => {
    if (!naoPorTurma[item.turma]) naoPorTurma[item.turma] = [];
    naoPorTurma[item.turma].push({ ...item, _idx: idx });
  });

  // Junta todas as turmas (alocadas + não alocadas)
  const todasTurmas = new Set([...Object.keys(porTurma), ...Object.keys(naoPorTurma)]);
  const turmasOrdenadas = [...todasTurmas].sort((a,b) => sortTurma(a,b));

  if (!turmasOrdenadas.length) {
    container.innerHTML = '<div class="empty-state"><p>Nenhuma prova alocada</p></div>';
    return;
  }

  container.innerHTML = turmasOrdenadas.map(turma => {
    const provas = (porTurma[turma] || []).sort((a,b) => a.data.localeCompare(b.data));
    const naoAlocadas = naoPorTurma[turma] || [];
    const totalCount = provas.length + naoAlocadas.length;

    // Linhas das provas alocadas
    const provasHTML = provas.map((p,i) => `
      <tr ${p.manual ? 'style="background:rgba(245,166,35,.06)"' : ''}>
        <td>${formatDate(p.data)}</td>
        <td>${DIAS_SEMANA_FULL[getDayOfWeek(p.data)]}</td>
        <td><strong>${p.disciplina}</strong>${p.manual ? ' <span class="badge badge-fi" style="font-size:9px">Manual</span>' : ''}</td>
        <td>${p.professor}</td>
        <td>${p.eletiva==='Sim'?'<span class="badge badge-eletiva">Eletiva</span>':'<span class="badge badge-regular">Regular</span>'}</td>
        <td><small style="color:var(--text-muted)">${p.observacao || '—'}</small></td>
      </tr>`).join('');

    // Linhas das disciplinas não alocadas (mesmo estilo/função do painel antigo)
    const naoAlocadasHTML = naoAlocadas.length ? `
      <tr style="background:rgba(245,166,35,.08)">
        <td colspan="6" style="padding:10px 14px;border-top:2px solid rgba(245,166,35,.3)">
          <span style="font-weight:600;color:var(--brand-accent)">⚠️ Disciplinas Fora do Período (${naoAlocadas.length})</span>
        </td>
      </tr>
      ${naoAlocadas.map(item => `
        <tr class="nao-couberam-row" id="nao-row-${item._idx}" style="background:rgba(245,166,35,.04)">
          <td colspan="2" style="text-align:center">
            <input type="date" class="form-input small" style="width:130px"
              id="nao-data-${item._idx}"
              value="${item.dataManual || ''}"
              onchange="setNaoDataManual(${item._idx}, this.value)" />
          </td>
          <td><strong>${item.disciplina}</strong></td>
          <td>${item.professor}</td>
          <td>${item.eletiva==='Sim'?'<span class="badge badge-eletiva">Eletiva</span>':'<span class="badge badge-regular">Regular</span>'}</td>
          <td>
            <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">
              <input type="text" class="form-input small" style="min-width:140px;flex:1"
                id="nao-obs-${item._idx}"
                value="${item.observacao || ''}"
                placeholder="Observação"
                oninput="setNaoObservacao(${item._idx}, this.value)" />
              <button class="btn btn-secondary small"
                onclick="inserirNaoAlocado(${item._idx})"
                title="Inserir no calendário" ${!item.dataManual?'disabled':''}>
                ➕ Inserir
              </button>
              <button class="btn btn-ghost small"
                onclick="descartarNaoAlocado(${item._idx})"
                title="Descartar">
                🗑️
              </button>
            </div>
          </td>
        </tr>`).join('')}` : '';

    return `
    <div class="turma-cal-section">
      <div class="turma-cal-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='none'?'block':'none'">
        <span class="turma-cal-name">🏫 ${turma}</span>
        <span class="turma-cal-count">${provas.length} provas${naoAlocadas.length ? ` · <span style="color:var(--brand-accent)">${naoAlocadas.length} pendente(s)</span>` : ''}</span>
      </div>
      <div class="turma-cal-body">
        <table class="data-table">
          <thead><tr><th>Data</th><th>Dia</th><th>Disciplina</th><th>Professor</th><th>Tipo</th><th>Observação</th></tr></thead>
          <tbody>
            ${provasHTML}
            ${naoAlocadasHTML}
          </tbody>
        </table>
      </div>
    </div>`;
  }).join('');
}


/* ---- VISÃO PROFESSOR ---- */
function renderVisualizacaoProfessor() {
  if (!STATE.calendario) return;
  const container = document.getElementById('calendario-professor');

  const porProf = {};
  Object.entries(STATE.calendario).forEach(([data, provas]) => {
    provas.forEach(p => {
      if (!porProf[p.professor]) porProf[p.professor] = [];
      porProf[p.professor].push({ data, ...p });
    });
  });

  const profs = Object.keys(porProf).sort();
  if (!profs.length) {
    container.innerHTML = '<div class="empty-state"><p>Nenhuma prova alocada</p></div>';
    return;
  }

  container.innerHTML = profs.map(prof => {
    const provas = porProf[prof].sort((a,b) => a.data.localeCompare(b.data));
    return `
    <div class="prof-cal-block">
      <div class="prof-cal-header">👩‍🏫 ${prof} — ${provas.length} aplicações</div>
      <table class="data-table">
        <thead><tr><th>Data</th><th>Dia</th><th>Turma</th><th>Disciplina</th></tr></thead>
        <tbody>
          ${provas.map(p => `
            <tr>
              <td>${formatDate(p.data)}</td>
              <td>${DIAS_SEMANA_FULL[getDayOfWeek(p.data)]}</td>
              <td>${p.turma}</td>
              <td>${p.disciplina}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }).join('');
}

// =============================================
// CALENDÁRIO – SALVAR / ABRIR (Google Drive)
// =============================================

async function salvarCalendarioDrive() {
  if (!STATE.calendario) { toast('Gere um calendário primeiro!', 'warning'); return; }

  const payload = {
    calendario:  STATE.calendario,
    geradoEm:    new Date().toISOString(),
    periodo: {
      inicio: document.getElementById('cal-data-inicio').value,
      fim:    document.getElementById('cal-data-fim').value,
    },
    turmas:      [...STATE.turmas.ativas],
    totalProvas: contarTotalProvas(STATE.calendario),
  };
  const nome = `quadro_provas_${new Date().toISOString().slice(0,10)}.json`;

  // Tenta salvar no Drive via Apps Script
  const btn = document.querySelector('[onclick="salvarCalendarioDrive()"]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Salvando...'; }

  try {
    const resp = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:   'save',
        filename:  nome,
        content:   JSON.stringify(payload, null, 2)
      })
    });
    const result = await resp.json();
    if (result.success) {
      toast(`✅ Calendário salvo no Drive! Arquivo: ${result.filename}`, 'success');
    } else {
      throw new Error(result.error || 'Erro desconhecido');
    }
  } catch(err) {
    // Fallback: download local
    downloadJSON(payload, nome);
    toast('⚠️ Drive indisponível. Arquivo baixado localmente.', 'warning');
    console.warn('Erro ao salvar no Drive:', err);
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '☁️ Salvar no Drive'; }
  }
}

function exportarCalendarioCSV() {
  if (!STATE.calendario) { toast('Gere um calendário primeiro!', 'warning'); return; }
  let csv = 'Data,Dia da Semana,Turma,Disciplina,Professor,Tipo,Segmento\n';
  Object.entries(STATE.calendario).sort((a,b) => a[0].localeCompare(b[0])).forEach(([data, provas]) => {
    provas.forEach(p => {
      csv += `${formatDate(data)},${DIAS_SEMANA_FULL[getDayOfWeek(data)]},${p.turma},${p.disciplina},${p.professor},${p.eletiva==='Sim'?'Eletiva':'Regular'},${p.segmento}\n`;
    });
  });
  const blob = new Blob(['\ufeff'+csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `quadro_provas_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  toast('CSV exportado!', 'success');
}

function imprimirCalendario() {
  window.print();
}

function limparCalendario() {
  STATE.calendario = null;
  document.getElementById('calendario-resultado').style.display = 'none';
  toast('Calendário limpo.', 'info');
}

// ---- Abrir calendário do Drive ----
async function abrirCalendarioSalvo() {
  abrirModal('modal-abrir-cal');
  await listarCalendariosDrive();
}

async function listarCalendariosDrive() {
  const lista = document.getElementById('drive-files-list');
  if (!lista) return;
  lista.innerHTML = '<div style="text-align:center;padding:16px"><span class="spinner"></span> Buscando arquivos no Drive...</div>';

  try {
    const resp = await fetch(`${APPS_SCRIPT_URL}?action=list&t=${Date.now()}`);
    const data = await resp.json();

    if (data.error) throw new Error(data.error);

    const files = data.files || [];
    if (!files.length) {
      lista.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:16px">Nenhum arquivo salvo no Drive</p>';
      return;
    }

    lista.innerHTML = files.map(f => `
      <div class="drive-file-item" onclick="carregarDoDrive('${f.id}', '${f.name}')">
        <div class="drive-file-icon">📄</div>
        <div class="drive-file-info">
          <div class="drive-file-name">${f.name}</div>
          <div class="drive-file-date">${new Date(f.modified).toLocaleString('pt-BR')}</div>
        </div>
        <div class="drive-file-btn">📥 Abrir</div>
      </div>
    `).join('');
  } catch(err) {
    lista.innerHTML = `
      <div style="text-align:center;padding:16px;color:var(--brand-accent)">
        ⚠️ Não foi possível listar arquivos do Drive.<br>
        <small>Use o upload manual abaixo.</small>
      </div>`;
    console.warn('Erro ao listar Drive:', err);
  }
}

async function carregarDoDrive(fileId, fileName) {
  const lista = document.getElementById('drive-files-list');
  if (lista) lista.innerHTML = `<div style="text-align:center;padding:16px"><span class="spinner"></span> Carregando ${fileName}...</div>`;

  try {
    const resp = await fetch(`${APPS_SCRIPT_URL}?action=get&fileId=${fileId}&t=${Date.now()}`);
    const data = await resp.json();

    if (data.error) throw new Error(data.error);
    if (!data.calendario) throw new Error('Arquivo sem campo calendário');

    STATE.calendario = data.calendario;
    if (data.periodo) {
      document.getElementById('cal-data-inicio').value = data.periodo.inicio || '';
      document.getElementById('cal-data-fim').value    = data.periodo.fim    || '';
    }
    renderCalendario();
    document.getElementById('calendario-resultado').style.display = 'block';
    fecharModal('modal-abrir-cal');
    toast(`✅ Calendário "${fileName}" carregado! ${contarTotalProvas(STATE.calendario)} provas.`, 'success');
  } catch(err) {
    toast('Erro ao carregar do Drive: ' + err.message, 'error');
    console.error(err);
    if (lista) listarCalendariosDrive();
  }
}

function carregarCalendarioArquivo(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.calendario) {
        STATE.calendario = data.calendario;
        if (data.periodo) {
          document.getElementById('cal-data-inicio').value = data.periodo.inicio || '';
          document.getElementById('cal-data-fim').value    = data.periodo.fim    || '';
        }
        renderCalendario();
        document.getElementById('calendario-resultado').style.display = 'block';
        fecharModal('modal-abrir-cal');
        toast('Calendário carregado! ' + contarTotalProvas(STATE.calendario) + ' provas.', 'success');
      } else {
        toast('Arquivo não contém calendário válido!', 'error');
      }
    } catch(err) {
      toast('Erro ao ler arquivo!', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// =============================================
// MODAIS
// =============================================
function abrirModal(id) {
  document.getElementById(id).classList.add('open');
}
function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
}

let _confirmCallback = null;
function abrirConfirm(icon, titulo, corpo, callback) {
  document.getElementById('modal-icon').textContent   = icon;
  document.getElementById('modal-title').textContent  = titulo;
  document.getElementById('modal-body').innerHTML     = corpo;
  _confirmCallback = callback;
  document.getElementById('modal-confirm-btn').onclick = () => {
    fecharModal('modal-confirm');
    if (_confirmCallback) _confirmCallback();
  };
  abrirModal('modal-confirm');
}

// =============================================
// TOAST
// =============================================
function toast(msg, tipo = 'info') {
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const el = document.createElement('div');
  el.className = `toast ${tipo}`;
  el.innerHTML = `<span>${icons[tipo]||'•'}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

// =============================================
// ATALHOS DE TECLADO
// =============================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});
