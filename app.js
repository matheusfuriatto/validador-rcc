import { CONFIG } from './config.js';
import { apiService } from './api.service.js';
import { Validator } from './validator.js';
import { UiController } from './ui.controller.js';

const ui = new UiController();

document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const inputUsername = document.getElementById('input-username').value.trim();
    if (!inputUsername) return;

    ui.showLoading();
    let temErroGeral = false;

    try {
        const valNick = Validator.validarNickname(inputUsername);
        if (!valNick.valido) temErroGeral = true;

        const userData = await apiService.fetchUserData(inputUsername);
        const { motto, figureString, name, groups } = userData;

        // Processa missão, cargo e patente corporativa
        const valMissao = Validator.validarMissaoEstatuto(motto || "");
        let patenteMilitar = "Desconhecido";
        let cargoEstatutario = "Nenhum";

        if (!valMissao.valido) {
            temErroGeral = true;
        } else {
            cargoEstatutario = valMissao.cargo;
            patenteMilitar = CONFIG.MAPA_CARGOS[valMissao.cargo] || "Desconhecido";
        }

        // Executa auditoria estrita trazendo o Gênero Biológico decodificado pelo ID hd
        const auditoriaFarda = Validator.auditoriaFardamentoCompleta(figureString, patenteMilitar, cargoEstatutario);

        // Renderização forçada dos metadados extraídos no cabeçalho futurista
        ui.renderProfile(
            Validator.formatarNome(name), 
            figureString, 
            auditoriaFarda.genero, 
            motto, 
            patenteMilitar
        );
        ui.clearLogs();

        // 1. Logs de Nickname
        if (!valNick.valido) ui.addLog(`Nickname: ${valNick.erro}`, "danger");
        else ui.addLog("Nickname Aprovado e Homologado", "success");

        // 2. Missão e Estatuto
        if (!valMissao.valido) {
            ui.addLog(`Missão: ${valMissao.erro}`, "danger");
        } else {
            ui.addLog(`Missão Válida (${valMissao.cargo})`, "success");
        }

        // 3. Associações
        const valGrupos = Validator.validarGrupos(groups);
        if (!valGrupos.valido) {
            ui.addLog(`Associações: Rival Encontrada -> ${valGrupos.rivais.join(', ')}`, "danger");
            temErroGeral = true;
        } else {
            ui.addLog("Associações e Facções Limpas", "success");
        }

        // 4. Parâmetros Visuais e de Fardamento
        if (patenteMilitar !== "Desconhecido") {
            if (!auditoriaFarda.valido) {
                temErroGeral = true;
                auditoriaFarda.erros.forEach(erro => {
                    ui.addLog(erro, "danger");
                });
            } else {
                ui.addLog("Fardamento e Parâmetros Visuais em Conformidade", "success");
            }
        } else {
            ui.addLog("Auditoria de Fardamento Cancelada (Patente Inválida)", "danger");
            temErroGeral = true;
        }

        ui.setStatus(temErroGeral);

    } catch (error) {
        ui.clearLogs();
        ui.addLog(`Erro Crítico Operacional: ${error.message}`, "danger");
        ui.setStatus(true);
    }
});