import { CONFIG } from './config.js';

export class Validator {
    
    static formatarNome(nome) {
        if (!nome) return "";
        return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    }

    static parseFigure(figureStr) {
        const look = {};
        if (!figureStr) return look;
        figureStr.split('.').forEach(item => {
            const parts = item.split('-');
            const tipo = parts[0];
            if (!tipo) return;
            look[tipo] = {
                id: parseInt(parts[1], 10),
                cor1: parts[2] ? parseInt(parts[2], 10) : null,
                cor2: parts[3] ? parseInt(parts[3], 10) : null,
                raw: item
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
        if (!motto || motto.trim() === "") return { valido: false, erro: "Usuário sem missão definida.", cargo: "Nenhum" };

        const regexBase = /^\[RCC\]\s+(.+?)\s+\[([^\]]+)\](.*)$/i;
        const match = motto.trim().match(regexBase);
        const cargoMissao = match ? match[1].trim() : motto.trim(); 
        
        const cargoOficial = CONFIG.GRAFIAS_PERMITIDAS.find(p => p.toLowerCase() === cargoMissao.toLowerCase());

        if (!cargoOficial) {
            return { valido: false, erro: `Abreviação ou Cargo ilegal: "${cargoMissao}"`, cargo: "Desconhecido" };
        }

        return { valido: true, cargo: cargoOficial };
    }

    static validarCursosObrigatorios(motto, cargo, systemData) {
        const regras = CONFIG.CURSOS_OBRIGATORIOS[cargo];
        if (!regras) return { valido: true, erros: [], dadosSystem: !!systemData };

        const erros = [];
        const mottoUpper = motto.toUpperCase();
        
        if (regras.tipo === "AND") {
            const possuiTexto = regras.texto.some(t => mottoUpper.includes(t.toUpperCase()));
            if (!possuiTexto) erros.push(`Ausência da tag obrigatória ${regras.texto[0]} na missão.`);
        } else if (regras.tipo === "OR") {
            const possuiTexto = ComponentOr(mottoUpper, regras.texto);
            if (!possuiTexto) erros.push(`Ausência de curso obrigatório na missão: Requer ${regras.texto.join(' ou ')}.`);
        } else if (regras.tipo === "CUSTOM_CABO") {
            const possuiTextoBase = regras.texto.some(t => mottoUpper.includes(t.toUpperCase()));
            const possuiCro = mottoUpper.includes(regras.secundario.toUpperCase());
            if (!possuiTextoBase) erros.push(`Ausência da tag de curso ${regras.texto[0]} na missão.`);
            if (!possuiCro) erros.push(`Ausência da tag de curso complementar ${regras.secundario} na missão.`);
        }

        let possuiFichaSystem = false;
        if (systemData && systemData.autenticado) {
            possuiFichaSystem = true;
            const codigosPossuidos = systemData.certificates.map(c => c.code.toUpperCase());

            if (regras.tipo === "AND") {
                regras.codigos.forEach(cod => {
                    if (!codigosPossuidos.includes(cod.toUpperCase())) erros.push(`Falta de homologação funcional: Curso [${cod}] não consta no System.`);
                });
            } else if (regras.tipo === "OR") {
                const temPeloMenosUm = '../../';
                const temPeloMenosUmCodigo = regras.codigos.some(cod => codigosPossuidos.includes(cod.toUpperCase()));
                if (!temPeloMenosUmCodigo) erros.push(`Nenhum dos cursos exigidos ([${regras.codigos.join('/')}]) foi encontrado no System.`);
            } else if (regras.tipo === "CUSTOM_CABO") {
                const temCfc = codigosPossuidos.includes("CFC-1") || codigosPossuidos.includes("CFC-2");
                const temSeg = codigosPossuidos.includes("SEG");
                const temCro = codigosPossuidos.includes("CRO");

                if (!temCfc) erros.push("Falta de homologação funcional: Curso [CFC] não consta no System.");
                if (!temSeg) erros.push("Falta de homologação funcional: Curso [SEG] não consta no System.");
                if (!temCro) erros.push("Falta de homologação funcional: Curso [CRO] não consta no System.");
            }
        }

        return {
            valido: erros.length === 0,
            erros,
            dadosSystem: possuiFichaSystem
        };
    }

    static auditoriaFardamentoCompleta(figureStr, patenteMilitar, cargoEstatutario) {
        const erros = [];
        const look = this.parseFigure(figureStr);
        
        const isFemale = look['hd'] && look['hd'].id >= 600 && look['hd'].id <= 699;
        const generoIdentificado = isFemale ? "FEMININO" : "MASCULINO";
        
        if (look['fa'] && isFemale) {
            erros.push("Fardamento Irregular: Avatares femininos estão proibidos de equipar Barbas (fa).");
        }

        const regrasPatente = CONFIG.REGRAS_POR_PATENTE ? CONFIG.REGRAS_POR_PATENTE[patenteMilitar] : null;
        
        if (cargoEstatutario === "VIP" || patenteMilitar === "Marechal" || (regrasPatente && regrasPatente.free)) {
            return { valido: erros.length === 0, erros, genero: generoIdentificado };
        }

        if (look['hd'] && CONFIG.REGRAS_FARDAMENTO.ALLOWED_HD && !CONFIG.REGRAS_FARDAMENTO.ALLOWED_HD.includes(look['hd'].id)) {
            erros.push("Modelo de Rosto (hd) inválido.");
        }
        if (look['hr'] && CONFIG.REGRAS_FARDAMENTO.ALLOWED_HR && !CONFIG.REGRAS_FARDAMENTO.ALLOWED_HR.includes(look['hr'].id)) {
            erros.push("Modelo de Cabelo (hr) inválido.");
        }

        const permissaoAcessorios = regrasPatente ? regrasPatente.facial : false;

        if (!permissaoAcessorios) {
            if (look['ea']) erros.push(`A patente de ${patenteMilitar} não possui concessão para usar Óculos.`);
            if (look['fa'] && !isFemale) erros.push(`A patente de ${patenteMilitar} não possui concessão para usar Barba.`);
        } else {
            if (look['ea']) {
                if (CONFIG.REGRAS_FARDAMENTO.ALLOWED_EA && !CONFIG.REGRAS_FARDAMENTO.ALLOWED_EA.includes(look['ea'].id)) {
                    erros.push("Modelo de Óculos (ea) fora do padrão.");
                }
                if (look['ea'].cor1 && !CONFIG.REGRAS_FARDAMENTO.ALLOWED_EA_COLORS.includes(look['ea'].cor1)) {
                    erros.push(`A cor do Óculos (${look['ea'].cor1}) não é permitida regulamentarmente.`);
                }
            }
            if (look['fa'] && !isFemale && CONFIG.REGRAS_FARDAMENTO.ALLOWED_FA && !CONFIG.REGRAS_FARDAMENTO.ALLOWED_FA.includes(look['fa'].id)) {
                erros.push("Modelo de Barba (fa) fora do padrão.");
            }
        }

        if (regrasPatente && !regrasPatente.exec) {
            const ch = look['ch']; const lg = look['lg']; const sh = look['sh']; const ha = look['ha'];
            const modeloCamisaEsperado = isFemale ? 665 : 225;
            const modeloCalcaEsperado = isFemale ? 720 : 285;
            const modeloSapatoEsperado = isFemale ? 735 : 300;

            if (ch && ch.id !== modeloCamisaEsperado) erros.push(`Modelo de Camisa incompatível. Use ch-${modeloCamisaEsperado}.`);
            if (lg && lg.id !== modeloCalcaEsperado) erros.push(`Modelo de Calça incompatível. Use lg-${modeloCalcaEsperado}.`);
            if (sh && sh.id !== modeloSapatoEsperado) erros.push(`Modelo de Sapato incompatível. Use sh-${modeloSapatoEsperado}.`);

            // VALIDAÇÃO DE COR DA CALÇA == SAPATO REMOVIDA DAQUI COM SUCESSO

            if (ha && lg && ha.cor1 !== 73 && ha.cor1 !== 100 && lg.cor1 !== ha.cor1) {
                erros.push("Quebra de Simetria: A cor da Boina deve seguir a cor da Calça.");
            }
        }

        return { valido: erros.length === 0, erros, genero: generoIdentificado };
    }
}

function ComponentOr(motto, arrayTags) {
    return arrayTags.some(tag => motto.includes(tag.toUpperCase()));
}