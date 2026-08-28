// =====================================================
// API Integration Module
// للاتصال بسيرفر MTA وجلب البيانات
// =====================================================

class MTA_API {
    constructor(host = 'localhost', port = 8080) {
        this.host = host;
        this.port = port;
        this.baseURL = `http://${host}:${port}/api`;
        this.connected = false;
    }

    /**
     * الاتصال بـ API السيرفر
     */
    async connect() {
        try {
            const response = await fetch(`${this.baseURL}/status`);
            this.connected = response.ok;
            return this.connected;
        } catch (error) {
            console.error('فشل الاتصال بالسيرفر:', error);
            this.connected = false;
            return false;
        }
    }

    /**
     * جلب قائمة اللاعبين
     */
    async getPlayers() {
        if (!this.connected) await this.connect();
        
        try {
            const response = await fetch(`${this.baseURL}/players`);
            const data = await response.json();
            return data.players || [];
        } catch (error) {
            console.error('خطأ في جلب اللاعبين:', error);
            return [];
        }
    }

    /**
     * جلب بيانات لاعب معين
     */
    async getPlayer(playerId) {
        try {
            const response = await fetch(`${this.baseURL}/players/${playerId}`);
            return await response.json();
        } catch (error) {
            console.error('خطأ في جلب بيانات اللاعب:', error);
            return null;
        }
    }

    /**
     * جلب إحصائيات السيرفر
     */
    async getServerStats() {
        try {
            const response = await fetch(`${this.baseURL}/stats`);
            return await response.json();
        } catch (error) {
            console.error('خطأ في جلب الإحصائيات:', error);
            return null;
        }
    }

    /**
     * جلب السجلات (Logs)
     */
    async getLogs(limit = 100) {
        try {
            const response = await fetch(`${this.baseURL}/logs?limit=${limit}`);
            return await response.json();
        } catch (error) {
            console.error('خطأ في جلب السجلات:', error);
            return [];
        }
    }

    /**
     * تحديث بيانات لاعب
     */
    async updatePlayer(playerId, data) {
        try {
            const response = await fetch(`${this.baseURL}/players/${playerId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('خطأ في تحديث بيانات اللاعب:', error);
            return null;
        }
    }

    /**
     * طرد لاعب من السيرفر
     */
    async kickPlayer(playerId, reason = '') {
        try {
            const response = await fetch(`${this.baseURL}/players/${playerId}/kick`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason })
            });
            return await response.json();
        } catch (error) {
            console.error('خطأ في طرد اللاعب:', error);
            return null;
        }
    }

    /**
     * حظر لاعب
     */
    async banPlayer(playerId, reason = '', duration = 0) {
        try {
            const response = await fetch(`${this.baseAPI}/players/${playerId}/ban`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason, duration })
            });
            return await response.json();
        } catch (error) {
            console.error('خطأ في حظر اللاعب:', error);
            return null;
        }
    }

    /**
     * إرسال رسالة سيرفر
     */
    async sendMessage(message) {
        try {
            const response = await fetch(`${this.baseURL}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            return await response.json();
        } catch (error) {
            console.error('خطأ في إرسال الرسالة:', error);
            return null;
        }
    }

    /**
     * الحصول على حالة السيرفر
     */
    async getServerStatus() {
        try {
            const response = await fetch(`${this.baseURL}/status`);
            return await response.json();
        } catch (error) {
            console.error('خطأ في جلب حالة السيرفر:', error);
            return null;
        }
    }

    /**
     * التحقق من وجود متصل
     */
    isConnected() {
        return this.connected;
    }
}

// تصدير الـ API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MTA_API;
}
