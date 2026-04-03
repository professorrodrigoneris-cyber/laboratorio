/**
 * GOOGLE APPS SCRIPT – BACKEND PARA CALENDÁRIO DE PROVAS
 * 
 * COMO INSTALAR:
 * 1. Acesse script.google.com
 * 2. Crie novo projeto: "CalendarioProvas API"
 * 3. Cole TODO este código
 * 4. Salve (Ctrl+S)
 * 5. Clique em "Implantar" → "Nova implantação"
 * 6. Tipo: Web App
 * 7. Executar como: "Eu (sua conta)"
 * 8. Quem pode acessar: "Qualquer pessoa"
 * 9. Copie a URL gerada e cole em app.js onde indicado
 */

const FOLDER_ID = '1XIQgISAMwC0EYogPfxdZrL6n-TzvjjUQ';

function doGet(e) {
  const action = e.parameter.action || 'list';

  if (action === 'list') {
    return listFiles();
  }

  if (action === 'get') {
    const fileId = e.parameter.fileId;
    return getFile(fileId);
  }

  return jsonResponse({ error: 'Ação inválida' }, 400);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action  = payload.action || 'save';

    if (action === 'save') {
      return saveFile(payload.filename, payload.content);
    }

    return jsonResponse({ error: 'Ação inválida' }, 400);
  } catch(err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function listFiles() {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files  = folder.getFilesByType('application/json');
    const result = [];

    while (files.hasNext()) {
      const f = files.next();
      result.push({
        id:       f.getId(),
        name:     f.getName(),
        modified: f.getLastUpdated().toISOString(),
        size:     f.getSize(),
      });
    }

    result.sort((a,b) => b.modified.localeCompare(a.modified));
    return jsonResponse({ files: result });
  } catch(err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function getFile(fileId) {
  try {
    const file    = DriveApp.getFileById(fileId);
    const content = file.getBlob().getDataAsString();
    return ContentService.createTextOutput(content)
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function saveFile(filename, content) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    // Verifica se arquivo já existe (atualiza ao invés de criar novo)
    const existing = folder.getFilesByName(filename);
    if (existing.hasNext()) {
      const file = existing.next();
      file.setContent(content);
      return jsonResponse({ success: true, fileId: file.getId(), action: 'updated', filename });
    }
    
    // Cria novo arquivo
    const blob = Utilities.newBlob(content, 'application/json', filename);
    const file = folder.createFile(blob);
    return jsonResponse({ success: true, fileId: file.getId(), action: 'created', filename });
  } catch(err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(data, code) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
