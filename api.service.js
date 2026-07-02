import { CONFIG } from './config.js';

class ApiService {
    constructor() {
        this.cache = new Map();
    }

    async fetchUserData(username) {
        const usernameLower = username.toLowerCase();
        
        // Retorna do cache se já pesquisado nesta sessão
        if (this.cache.has(usernameLower)) {
            return this.cache.get(usernameLower);
        }

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/users?name=${encodeURIComponent(username)}`);
            if (!res.ok) throw new Error('Usuário não localizado no hotel.');
            
            const userData = await res.json();
            
            // Busca grupos se o perfil for público
            let groups = [];
            try {
                const profileRes = await fetch(`${CONFIG.API_BASE_URL}/users/${userData.uniqueId}/profile`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    groups = profileData.groups || [];
                }
            } catch (e) {
                console.info("Perfil privado: Ignorando varredura profunda de grupos.");
            }

            const finalData = { ...userData, groups };
            this.cache.set(usernameLower, finalData); // Salva no cache
            
            return finalData;
            
        } catch (error) {
            throw error;
        }
    }
}

export const apiService = new ApiService();