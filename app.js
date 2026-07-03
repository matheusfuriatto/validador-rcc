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

        // Requisições assíncronas paralelas (Habbo API + System Atlas API Interceptação)
        const [userData, systemCerts] = await Promise.all([
            apiService.fetchUserData(inputUsername),
            apiService.fetchSystemCertificates(inputUsername)
        ]);

        const { motto, figureString, name, groups } = userData;

        const valMissao = Validator.validarMissaoEstatuto(motto || "");
        let patenteMilitar = "Desconhecido";
        let cargoEstatutario = "Nenhum";

        if (!valMissao.valido) {
            temErroGeral = true;
        } else {
            cargoEstatutario = valMissao.cargo;
            patenteMilitar = CONFIG.MAPA_CARGOS[valMissao.cargo] || "Desconhecido";
        }

        const auditoriaFarda = Validator.auditoriaFardamentoCompleta(figureString, patenteMilitar, cargoEstatutario);

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
        else ui.addLog("Nickname Autorizado no Saguão", "success");

        // 2. Logs de Missão Básica
        if (!valMissao.valido) {
            ui.addLog(`Sintaxe Militar: ${valMissao.erro}`, "danger");
        } else {
            ui.addLog(`Hierarquia OK: Escalão (${valMissao.cargo})`, "success");
        }

        // 3. NOVO: Validação Ortogonal de Cursos
        if (valMissao.valido) {
            const valCursos = Validator.validarCursosObrigatorios(motto || "", valMissao.cargo, systemCerts);
            if (valCursos.dadosSystem) {
                ui.addLog("Sincronização com o Atlas: Integrado com sucesso.", "success");
            } else {
                ui.addLog("Aviso: Dados lidos localmente. Logue no System para validar fichas.", "warning");
            }

            if (!valCursos.valido) {
                temErroGeral = true;
                valCursos.erros.forEach(err => ui.addLog(err, "danger"));
            } else {
                ui.addLog("Cursos e Instruções Obrigatórias em Conformidade", "success");
            }
        }

        // 4. Associações
        const valGrupos = Validator.validarGrupos(groups);
        if (!valGrupos.valido) {
            ui.addLog(`Associações: Rival Encontrada -> ${valGrupos.rivais.join(', ')}`, "danger");
            temErroGeral = true;
        } else {
            ui.addLog("Associações Limpas", "success");
        }

        // 5. Parâmetros Visuais de Fardamento
        if (patenteMilitar !== "Desconhecido") {
            if (!auditoriaFarda.valido) {
                temErroGeral = true;
                auditoriaFarda.erros.forEach(erro => ui.addLog(erro, "danger"));
            } else {
                ui.addLog("Parâmetros de Uniforme Aprovados", "success");
            }
        } else {
            ui.addLog("Auditoria de Fardamento Abortada", "danger");
            temErroGeral = true;
        }

        ui.setStatus(temErroGeral);

    } catch (error) {
        ui.clearLogs();
        ui.addLog(`Erro Operacional: ${error.message}`, "danger");
        ui.setStatus(true);
    }
});