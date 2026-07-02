// Utilitário para congelamento profundo de objetos aninhados
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
    PRIVILEGIOS: {
        SOLDADO_TRAINEE_MAIS: ["Soldado", "Cabo", "Sargento", "Subtenente", "Aspirante a Oficial", "Tenente", "Capitão", "Coronel", "General", "Marechal", "Comandante", "Comandante-Geral"],
        SARGENTO_OU_SUPERIOR: ["Sargento", "Subtenente", "Aspirante a Oficial", "Tenente", "Capitão", "Coronel", "General", "Marechal", "Comandante", "Comandante-Geral"],
        COMANDANTE_VIP_MAIS: ["Marechal", "Comandante", "Comandante-Geral"]
    },
    POLICIAS_CONCORRENTES: ["DPH", "DOH", "DME", "DIC", "CSI", "PMH"],
    COMANDOS_PROIBIDOS: [
        "porta1", "pk1", "visu01", "iniciartempo", "zerartempo", "fecharportas", 
        "limparsaguao", "sentido", "continencia", "idle", "sit", "kickall", "mute"
    ],
    CORES: {
        OCULOS_PERMITIDAS: [18, 19, 20], 
        PELE_PERMITIDAS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    CATALOGO: {
        ROSTOS_LISOS: [180, 190, 200, 210], 
        BARBAS_VIP: [260, 261],             
        CINTOS_SOLDADO: [400]              
    },
    API_BASE_URL: "https://www.habbo.com.br/api/public"
});