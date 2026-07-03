export class UiController {
    constructor() {
        this.pane = document.getElementById('result-pane');
        this.logsContainer = document.getElementById('validation-logs');
        this.statusGeral = document.getElementById('status-geral');
        this.nameEl = document.getElementById('habbo-name');
        this.avatarHeadEl = document.getElementById('habbo-avatar-head');
        this.avatarDisplayEl = document.getElementById('avatar-display');
        
        // Correção de vinculação com os IDs recuperados do documento principal
        this.missionEl = document.getElementById('user-mission-text');
        this.genderEl = document.getElementById('user-gender-text');
        this.rankBadge = document.getElementById('rank-badge-element');
    }

    showLoading() {
        this.pane.classList.remove('hidden');
        this.logsContainer.innerHTML = `<div class="loading-box"><div class="spinner"></div><span style="letter-spacing:0.05em">SINCRONIZANDO BANCO ESTATUTÁRIO...</span></div>`;
        this.statusGeral.innerText = "Processando...";
        this.statusGeral.className = "status-indicator rank-desconhecido";
    }

    renderProfile(name, figureString, genero, missao, patente) {
        this.nameEl.innerText = name;
        
        // Exibição forçada de metadados cruciais na interface moderna
        if (this.missionEl) this.missionEl.innerText = missao || "NÃO DEFINIDA";
        if (this.genderEl) this.genderEl.innerText = genero || "DESCONHECIDO";
        
        // Atualização dinâmica da Badge militar polimórfica
        if (this.rankBadge) {
            this.rankBadge.innerText = patente || "Desconhecido";
            const classeBadge = patente ? patente.toLowerCase().replace(/\s+/g, '-') : 'desconhecido';
            this.rankBadge.className = `rank-badge rank-${classeBadge}`;
        }

        this.avatarHeadEl.src = `https://www.habbo.com.br/habbo-imaging/avatarimage?figure=${figureString}&headonly=1&size=m`;
        
        // Injeta o Manequim na div de visualização com renderização pixelada
        this.avatarDisplayEl.innerHTML = `<img src="https://www.habbo.com.br/habbo-imaging/avatarimage?figure=${figureString}&direction=4&head_direction=3&img_format=png&size=l" style="image-rendering: pixelated; height: 160px; margin-top: -10px;" alt="Mannequin">`;
    }

    clearLogs() {
        this.logsContainer.innerHTML = "";
    }

    addLog(texto, tipo) {
        const div = document.createElement('div');
        div.className = `tag-log ${tipo}`;
        
        const icon = tipo === 'success' ? '✔' : (tipo === 'danger' ? '❌' : '⚠️');
        div.innerHTML = `<span class="tag-icon">${icon}</span> <strong>${texto}</strong>`;
        this.logsContainer.appendChild(div);
    }

    setStatus(isError) {
        this.statusGeral.innerText = isError ? "❌ REPROVADO" : "✔ APROVADO";
        this.statusGeral.className = `status-indicator ${isError ? 'danger' : 'success'}`;
        
        const wrapper = document.getElementById('avatar-preview-box');
        if (wrapper) {
            wrapper.className = `avatar-wrap ${isError ? 'fail' : 'ok'}`;
        }
    }
}