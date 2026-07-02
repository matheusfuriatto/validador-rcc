import { CONFIG } from './config.js';
import { apiService } from './api.service.js';
import { Validator } from './validator.js';
import { UiController } from './ui.controller.js';

const ui = new UiController();

document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita o reload da página
    
    const inputUsername = document.getElementById('input-username').value.trim();
    if (!inputUsername) return;

    ui.showLoading();
    let temErroGeral = false;

    try {
        const valNick = Validator.validarNickname(inputUsername);
        if (!valNick.valido) temErroGeral = true;

        // Requisição passando pela camada de serviço (com cache ativo)
        const userData = await apiService.fetchUserData(inputUsername);
        const { motto, figureString, name, groups } = userData;

        ui.renderProfile(Validator.formatarNome(name), figureString);
        ui.clearLogs();

        // 1. Logs de Nickname
        if (!valNick.valido) ui.addLog(`❌ ${valNick.erro}`, "danger");
        else ui.addLog("✔️ Nickname Aprovado", "success");

        // 2. Missão e Patente
        const valMissao = Validator.validarMissaoEstatuto(motto || "");
        let patenteMilitar = "Nenhuma";

        if (!valMissao.valido) {
            ui.addLog(`❌ Missão: ${valMissao.erro}`, "danger");
            temErroGeral = true;
        } else {
            ui.addLog(`✔️ Missão OK (${valMissao.cargo})`, "success");
            patenteMilitar = CONFIG.MAPA_CARGOS[valMissao.cargo] || "Nenhuma";
        }

        // 3. Facções
        const valGrupos = Validator.validarGrupos(groups);
        if (!valGrupos.valido) {
            ui.addLog(`❌ Facção Rival: ${valGrupos.rivais.join(', ')}`, "danger");
            temErroGeral = true;
        } else {
            ui.addLog("✔️ Associações OK", "success");
        }

        // 4. Parâmetros Visuais
        const look = Validator.parseFigure(figureString);
        const isSargento = CONFIG.PRIVILEGIOS.SARGENTO_OU_SUPERIOR.includes(patenteMilitar);
        const isVIP = CONFIG.PRIVILEGIOS.COMANDANTE_VIP_MAIS.includes(patenteMilitar);

        // Pele
        if (look['hd'] && CONFIG.CORES.PELE_PERMITIDAS.includes(look['hd'].cor1)) {
            ui.addLog("✔️ Tom de Pele Correto", "success");
        } else {
            ui.addLog("❌ Pele Inválida", "danger");
            temErroGeral = true;
        }

        // Barba
        const temBarba = (look['hd'] && !CONFIG.CATALOGO.ROSTOS_LISOS.includes(look['hd'].id)) || look['fa'];
        if (temBarba) {
            if (!isSargento) {
                ui.addLog("❌ Barba Restrita (Sargento+)", "danger");
                temErroGeral = true;
            } else if (look['fa'] && CONFIG.CATALOGO.BARBAS_VIP.includes(look['fa'].id) && !isVIP) {
                ui.addLog("❌ Barba VIP Restrita", "danger");
                temErroGeral = true;
            } else {
                ui.addLog("✔️ Barba Autorizada", "success");
            }
        }

        // Óculos
        if (look['ea']) {
            if (!isSargento) {
                ui.addLog("❌ Óculos Restritos (Sargento+)", "danger");
                temErroGeral = true;
            } else if (!CONFIG.CORES.OCULOS_PERMITIDAS.includes(look['ea'].cor1)) {
                ui.addLog("❌ Óculos (Cor Fora do Padrão)", "danger");
                temErroGeral = true;
            } else {
                ui.addLog("✔️ Óculos Autorizado", "success");
            }
        }

        // Finaliza renderizando o status principal
        ui.setStatus(temErroGeral);

    } catch (error) {
        ui.clearLogs();
        ui.addLog(`⚠️ Erro Crítico: ${error.message}`, "danger");
        ui.setStatus(true, "Falha de Conexão");
    }
});