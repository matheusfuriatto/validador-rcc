export class UiController {
    constructor() {
        this.pane = document.getElementById('result-pane');
        this.logsContainer = document.getElementById('validation-logs');
        this.statusGeral = document.getElementById('status-geral');
        this.nameEl = document.getElementById('habbo-name');
        this.avatarHeadEl = document.getElementById('habbo-avatar-head');
        this.avatarDisplayEl = document.getElementById('avatar-display');
    }

    showLoading() {
        this.pane.classList.remove('hidden');
        this.logsContainer.innerHTML = `<div class="tag-log warning"><span class="tag-icon">🔄</span> <strong>Processando dados da API...</strong></div>`;
        this.statusGeral.className = "status-indicator";
        this.statusGeral.innerText = "Auditando...";
    }

    renderProfile(name, figureString) {
        this.nameEl.innerText = name;
        this.avatarHeadEl.src = `https://www.habbo.com.br/habbo-imaging/avatarimage?figure=${figureString}&headonly=1&size=m`;
        this.avatarDisplayEl.style.backgroundImage = `url('https://www.habbo.com.br/habbo-imaging/avatarimage?figure=${figureString}&direction=4&head_direction=3&img_format=png&gesture=sad&size=l')`;
    }

    clearLogs() {
        this.logsContainer.innerHTML = "";
    }

    addLog(texto, tipo) {
        const div = document.createElement('div');
        div.className = `tag-log ${tipo}`;
        div.innerHTML = `<span class="tag-icon">${tipo === 'success' ? '🔹' : '🔸'}</span> <strong>${texto}</strong>`;
        this.logsContainer.appendChild(div);
    }

    setStatus(isError, message = "") {
        this.statusGeral.innerText = message || (isError ? "❌ REPROVADO" : "✔️ APROVADO");
        this.statusGeral.className = `status-indicator ${isError ? 'danger' : 'success'}`;
    }
}