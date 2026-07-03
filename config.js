const deepFreeze = obj => {
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
    });
    return Object.freeze(obj);
};

export const CONFIG = deepFreeze({
    MAPA_CARGOS: {
        "Trainee": "Soldado", "Soldado": "Soldado",
        "Assessor": "Cabo", "Cabo": "Cabo",
        "Secretário": "Sargento", "Secretário-Chefe": "Sargento", "Secretário-C.": "Sargento", "Sargento": "Sargento",
        "Assistente": "Subtenente", "Assistente-Chefe": "Subtenente", "Assistente-C.": "Subtenente", "Subtenente": "Subtenente",
        "Analista": "Aspirante a Oficial", "Analista-Chefe": "Aspirante a Oficial", "Analista-C.": "Aspirante a Oficial", "Aspirante a Oficial": "Aspirante a Oficial", "Asp. a Oficial": "Aspirante a Oficial",
        "Supervisor": "Tenente", "Supervisor-Geral": "Tenente", "Supervisor-G.": "Tenente", "Tenente": "Tenente",
        "Inspetor": "Capitão", "Inspetor-Geral": "Capitão", "Inspetor-G.": "Capitão", "Capitão": "Capitão",
        "Coordenador": "Coronel", "Coordenador-Geral": "Coronel", "Coordenador-G.": "Coronel", "Coronel": "Coronel",
        "Superintendente": "General", "Superintendente-Geral": "General", "Superintendente-G.": "General", "General": "General",
        "VIP": "Marechal", "Vice-Presidente": "Marechal", "Marechal": "Marechal",
        "Presidente": "Comandante", "Acionista Majoritário": "Comandante", "Acionista M.": "Comandante", "Comandante": "Comandante",
        "Chanceler": "Comandante-Geral", "Comandante-Geral": "Comandante-Geral", "CoGer": "Comandante-Geral"
    },
    GRAFIAS_PERMITIDAS: [
        "Soldado", "Cabo", "Sargento", "Subtenente", "Aspirante a Oficial", "Asp. a Oficial",
        "Tenente", "Capitão", "Coronel", "General", "Marechal", "Comandante", "Comandante-Geral", "CoGer",
        "Trainee", "Assessor", "Secretário", "Secretário-C.", "Assistente", "Assistente-C.",
        "Analista", "Analista-C.", "Supervisor", "Supervisor-G.", "Inspetor", "Inspetor-G.",
        "Coordenador", "Coordenador-G.", "Superintendente", "Superintendente-G.",
        "VIP", "Vice-Presidente", "Presidente", "Acionista Majoritário", "Acionista M.", "Chanceler"
    ],
    CURSOS_OBRIGATORIOS: {
        "Soldado": { texto: ["[CAS/SUP]", "[SUP/CAS]"], codigos: ["CAS", "SUP"], tipo: "AND" },
        "Cabo": { texto: ["[CFC/SEG]", "[SEG/CFC]"], secundario: "[CRO]", codigos: ["CFC-1", "CFC-2", "SEG", "CRO"], tipo: "CUSTOM_CABO" },
        "Sargento": { texto: ["[CFS/CAC]", "[CAC/CFS]"], codigos: ["CFS", "CAC"], tipo: "AND" },
        "Subtenente": { texto: ["[CAP/PRO]", "[PRO/CAP]"], codigos: ["CAP", "PRO"], tipo: "AND" },
        "Aspirante a Oficial": { texto: ["[CFO]"], codigos: ["CFO"], tipo: "AND" },
        "Trainee": { texto: ["[APB]"], codigos: ["APB"], tipo: "AND" },
        "Assessor": { texto: ["[API/SEG]", "[SEG/API]"], codigos: ["API", "SEG"], tipo: "AND" },
        "Secretário": { texto: ["[APA/CAC]", "[CAC/APA]"], codigos: ["APA", "CAC"], tipo: "AND" },
        "Secretário-C.": { texto: ["[APA/CAC]", "[CAC/APA]"], codigos: ["APA", "CAC"], tipo: "AND" },
        "Assistente": { texto: ["[AFP]"], codigos: ["AFP"], tipo: "AND" },
        "Assistente-C.": { texto: ["[AFP]"], codigos: ["AFP"], tipo: "AND" },
        "Analista": { texto: ["[AFP]", "[CFO]"], codigos: ["AFP", "CFO"], tipo: "OR" },
        "Analista-C.": { texto: ["[AFP]", "[CFO]"], codigos: ["AFP", "CFO"], tipo: "OR" },
        "Supervisor": { texto: ["[AFO]", "[CFO]"], codigos: ["AFO", "CFO"], tipo: "OR" }
    },
    POLICIAS_CONCORRENTES: ["DPH", "DOH", "DME", "DIC", "CSI", "PMH"],
    COMANDOS_PROIBIDOS: [
        "porta1", "pk1", "visu01", "iniciartempo", "zerartempo", "fecharportas", 
        "limparsaguao", "sentido", "continencia", "idle", "sit", "kickall", "mute"
    ],
    REGRAS_FARDAMENTO: {
        ALLOWED_WAIST: [3263],
        ALLOWED_WAIST_COLORS: [110, 64, 92, 1408],
        ALLOWED_HE: [1605],
        ALLOWED_CC_EXEC: [260, 3008],
        ALLOWED_CH_EXEC: [3076, 820, 225],
        ALLOWED_HD: [180, 185, 190, 195, 200, 205, 206, 207, 208, 209, 3091, 3092, 3093, 3094, 3095, 3101, 3102, 3103, 3997, 600, 605, 610, 615, 620, 625, 626, 627, 628, 629, 3096, 3097, 3098, 3099, 3100, 3104, 3105, 3106],
        ALLOWED_EA: [1403, 1402, 1401, 1404, 3169, 3107, 3168, 3484, 5135, 5576, 5897, 6196, 6270, 5626],
        ALLOWED_EA_COLORS: [64, 110, 1408, 92],
        ALLOWED_FA: [1201, 1206, 1208, 3344, 3993, 5211, 5386, 5636, 4283],
        ALLOWED_HR: [893, 3531, 155, 5772, 4117, 828, 5791, 3936, 115, 832, 3163, 540, 530, 555, 835, 681, 836, 834, 811, 864, 867, 869, 890, 874, 3004, 3012, 3090, 3322, 3499, 3569, 3568, 3665, 3676, 3625, 3519, 3785, 3786, 3829, 3746, 3994, 3998, 4090, 4162, 4298, 5019, 5275, 5437, 5606, 5617, 6034, 5971, 9534]
    },
    REGRAS_POR_PATENTE: {
        "Soldado": { shirt: [90, 67], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: false, waist: false, exec: false },
        "Cabo": { shirt: [1320, 89], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: false, waist: false, exec: false },
        "Sargento": { shirt: [1408, 92], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: true, waist: true, exec: false },
        "Subtenente": { shirt: [82, 1425], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: true, waist: true, exec: false },
        "Aspirante a Oficial": { shirt: [81, 106], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: true, waist: true, exec: false },
        "Tenente": { shirt: [72, 94], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: true, waist: true, exec: false },
        "Capitão": { shirt: [73, 100], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: true, waist: true, exec: false },
        "Coronel": { shirt: [76, 79], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: true, waist: true, exec: false },
        "General": { shirt: [85, 1336, 109], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: true, waist: true, exec: false },
        "Marechal": { shirt: [66, 93, 1321], pants: [64, 110], shoes: [64, 110], hat: [64, 110, 73, 100], facial: true, waist: true, exec: false },
        "Trainee": { coat: [90, 67], pants: [64, 110], shoes: [1408, 92], facial: true, waist: true, exec: true },
        "Assessor": { coat: [1320, 89], pants: [64, 110], shoes: [1408, 92], facial: true, waist: true, exec: true },
        "Comandante": { free: true }, "Comandante-Geral": { free: true }
    },
    API_BASE_URL: "https://www.habbo.com.br/api/public",
    ATLAS_API_URL: "https://atlas.policercc.com.br"
});