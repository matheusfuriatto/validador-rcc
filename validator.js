import { CONFIG } from './config.js';

export class Validator {
    
    // Padroniza string (Title Case)
    static formatarNome(nome) {
        if (!nome) return "";
        return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    }

    static parseFigure(figureStr) {
        const look = {};
        if (!figureStr) return look;
        
        figureStr.split('.').forEach(item => {
            const [tipo, id, cor1, cor2] = item.split('-');
            look[tipo] = {
                id: parseInt(id, 10),
                cor1: cor1 ? parseInt(cor1, 10) : null,
                cor2: cor2 ? parseInt(cor2, 10) : null
            };
        });
        return look;
    }

    static validarNickname(username) {
        const nickLower = username.toLowerCase();
        const temRepeticao = /(.)\1\1+/.test(nickLower);
        const possuiComando = CONFIG.COMANDOS_PROIBIDOS.some(c => nickLower.includes(c));
        return { valido: !temRepeticao && !possuiComando, erro: "Nick com comandos ou repetições ilegais." };
    }

    static validarGrupos(grupos) {
        let rivais = [];
        grupos.forEach(g => {
            const nome = g.name.toUpperCase();
            CONFIG.POLICIAS_CONCORRENTES.forEach(sigla => {
                if (new RegExp(`\\b${sigla}\\b`).test(nome) && !rivais.includes(sigla)) {
                    rivais.push(sigla);
                }
            });
        });
        return { valido: rivais.length === 0, rivais };
    }

    static validarMissaoEstatuto(motto) {
        const regexBase = /^\[RCC\]\s+(.+?)\s+\[([^\]]+)\](.*)$/i;
        const match = motto.trim().match(regexBase);

        if (!match) return { valido: false, erro: "Padrão inválido. Exija: [RCC] Patente [TAG]" };

        const cargoMissao = match[1].trim(); 
        const cargoOficial = CONFIG.GRAFIAS_PERMITIDAS.find(p => p.toLowerCase() === cargoMissao.toLowerCase());

        if (!cargoOficial) return { valido: false, erro: `Abreviação ilegal: "${cargoMissao}"` };

        return { valido: true, cargo: cargoOficial };
    }
}