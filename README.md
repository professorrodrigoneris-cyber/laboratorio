# 📅 Calendário de Provas – Sistema de Gestão

Sistema web completo para geração automática de calendários de provas escolares, com gerenciamento de professores, turmas, disciplinas e critérios de aplicação.

---

## 📁 Estrutura de Arquivos

```
site_calendario_prova/
├── index.html              ← Página principal do site
├── style.css               ← Estilos (tema dark premium)
├── app.js                  ← Toda a lógica JavaScript
├── google_apps_script.js   ← Backend para Google Drive (instalar separado)
├── disciplinas.csv         ← Arquivo original (referência)
└── db/
    └── disciplinas.json    ← Banco de dados JSON (carregado pelo site)
```

---

## 🚀 Como Usar o Site

### Passo 1 – Abrir o site
- Localmente: abra `index.html` no navegador
- No GitHub Pages: após publicar, acesse pela URL do GitHub

> **Importante:** O site carrega automaticamente `db/disciplinas.json` na primeira vez. Depois, os dados ficam salvos no `localStorage` do navegador.

---

## 🗂️ Abas do Sistema

### 1️⃣ Aba: Cadastro
- **Cadastre** professores, turmas, disciplinas
- Classifique como **Fundamental I, II ou Médio**
- Marque se é **eletiva**
- Edite ou remova registros existentes
- Use os filtros para localizar rapidamente

### 2️⃣ Aba: Critérios
**Disponibilidade de Professores:**
- Clique nos círculos dos dias da semana para marcar quais dias cada professor está na escola
- Por padrão todos estão disponíveis de Segunda a Sexta

**Preferências de Disciplinas:**
- **Prioridade**: Alta, Média ou Baixa (influencia a ordem de alocação)
- **Ordem**: Se deve ser 1ª, 2ª, 3ª... prova do período
- **Dia Fixo**: Se a disciplina deve ser sempre em um dia específico da semana

**Configuração Geral:**
- Máximo de provas por dia (padrão geral)
- Intervalo mínimo entre provas da mesma turma
- Permitir provas nos fins de semana
- Bloquear datas específicas (feriados, eventos)

### 3️⃣ Aba: Turmas
- Selecione quais turmas participam do calendário de provas
- Filtre por segmento (Fundamental I, II, Médio)
- Configure o **máximo de provas por dia** individualmente por turma
- Ative/desative disciplinas específicas por turma (ex: excluir eletivas)

### 4️⃣ Aba: Gerar Calendário
1. Defina a **data inicial** e **data final** do período
2. Clique em **⚡ Gerar Calendário Automático**
3. Visualize nas 3 visões:
   - 📅 **Visão Calendário** – grade mensal com chips coloridos
   - 📋 **Visão por Turma** – tabela ordenada por turma
   - 👩‍🏫 **Visão por Professor** – todas as aplicações por professor

---

## 💾 Salvar e Abrir Calendários

### Opção A: Download local
Clique em **☁️ Salvar no Drive** → o arquivo `.json` será baixado.
Salve-o manualmente na pasta do Google Drive:
`https://drive.google.com/drive/folders/1XIQgISAMwC0EYogPfxdZrL6n-TzvjjUQ`

### Opção B: Integração automática com Google Drive (avançado)
Configure o Google Apps Script para salvar/carregar diretamente sem download:

**Passo a passo:**
1. Acesse [script.google.com](https://script.google.com)
2. Crie novo projeto → chame de **"CalendarioProvas API"**
3. Apague o código padrão e cole o conteúdo de `google_apps_script.js`
4. Salve (Ctrl+S)
5. Clique em **Implantar** → **Nova implantação**
6. Tipo: `Aplicativo da Web`
7. Executar como: `Eu (sua conta Google)`
8. Quem pode acessar: `Qualquer pessoa`
9. Autorize as permissões solicitadas
10. **Copie a URL** gerada (ex: `https://script.google.com/macros/s/ABC123.../exec`)
11. Abra `app.js` e encontre a linha:
    ```javascript
    // const APPS_SCRIPT_URL = 'COLE_A_URL_AQUI';
    ```
    Descomente e cole sua URL.

---

## 🌐 Publicar no GitHub Pages

### Passo a passo:
1. Crie um repositório no GitHub (ex: `calendario-provas`)
2. Faça upload de todos os arquivos **exceto** `google_apps_script.js`
3. Vá em **Settings** → **Pages**
4. Source: `Deploy from a branch`
5. Branch: `main` / pasta: `/ (root)`
6. Clique em **Save**
7. Aguarde ~2 minutos e acesse a URL `https://seu-usuario.github.io/calendario-provas`

> ✅ O arquivo `db/disciplinas.json` precisa estar na pasta `db/` do repositório.

---

## 📤 Exportar Dados

| Botão | Função |
|-------|--------|
| 💾 Exportar | Salva todos os dados (disciplinas + critérios + turmas) em JSON |
| 📂 Importar | Carrega dados de um JSON exportado anteriormente |
| ⬇️ Exportar CSV | Exporta o calendário gerado em planilha CSV |
| ☁️ Salvar no Drive | Baixa o arquivo JSON do calendário |
| 🖨️ Imprimir | Abre o diálogo de impressão do navegador |

---

## 🧠 Como funciona o algoritmo de geração

O algoritmo aplica as seguintes regras em ordem:

1. **Ordena as disciplinas** por:
   - Ordem de prova definida (1ª, 2ª, 3ª...)
   - Prioridade (Alta → Média → Baixa)

2. **Para cada disciplina**, percorre os dias disponíveis verificando:
   - ✅ O professor está disponível naquele dia da semana
   - ✅ Há vaga na cota máxima de provas daquele dia para a turma
   - ✅ O intervalo mínimo desde a última prova daquela disciplina foi respeitado
   - ✅ O mesmo professor não está com outra prova na mesma turma no mesmo dia
   - ✅ O dia não está na lista de datas bloqueadas
   - ✅ Se houver dia fixo definido, é respeitado

3. **Aloca no primeiro dia válido** encontrado

---

## ⚠️ Avisos Importantes

- Os dados ficam salvos no **localStorage** do navegador — se limpar o cache, os dados serão perdidos. Use **Exportar** regularmente!
- O arquivo `disciplinas.csv` original é apenas referência. O sistema usa `db/disciplinas.json`.
- Para múltiplos usuários, implemente o Google Apps Script para centralizar os dados no Drive.

---

## 🛠️ Tecnologias Usadas

- HTML5 + CSS3 Vanilla (sem frameworks)
- JavaScript ES6+ (sem dependências externas)
- localStorage para persistência local
- Google Apps Script (opcional, para integração Drive)
- GitHub Pages para hospedagem gratuita
