// =====================================================
// Advanced Admin Panel
// لوحة تحكم متقدمة للمسؤولين
// =====================================================

class AdminPanel {
    constructor(apiInstance) {
        this.api = apiInstance;
        this.selectedPlayer = null;
        this.adminMode = false;
    }

    /**
     * فتح لوحة التحكم
     */
    openAdminPanel() {
        if (!this.validateAdminPermission()) {
            alert('ليس لديك صلاحيات كافية');
            return false;
        }

        this.adminMode = true;
        this.renderAdminPanel();
        return true;
    }

    /**
     * التحقق من صلاحيات الإدارة
     */
    validateAdminPermission() {
        // يتم التحقق من localStorage أو sessionStorage
        const adminToken = localStorage.getItem('adminToken');
        return adminToken && this.isTokenValid(adminToken);
    }

    /**
     * التحقق من صحة التوكن
     */
    isTokenValid(token) {
        // يمكن إضافة تحقق من الخادم هنا
        return token && token.length > 0;
    }

    /**
     * اختيار لاعب
     */
    selectPlayer(playerId) {
        this.selectedPlayer = playerId;
        this.updatePlayerDetails();
    }

    /**
     * تحديث تفاصيل اللاعب المختار
     */
    async updatePlayerDetails() {
        if (!this.selectedPlayer) return;

        const player = await this.api.getPlayer(this.selectedPlayer);
        if (player) {
            this.renderPlayerDetails(player);
        }
    }

    /**
     * طرد لاعب مع السبب
     */
    async kickPlayerWithReason(playerId, reason) {
        if (!confirm(`هل تريد طرد ${playerId} بسبب: ${reason}؟`)) {
            return false;
        }

        const result = await this.api.kickPlayer(playerId, reason);
        if (result && result.success) {
            alert('تم طرد اللاعب بنجاح');
            return true;
        } else {
            alert('فشل في طرد اللاعب');
            return false;
        }
    }

    /**
     * حظر لاعب
     */
    async banPlayerWithReason(playerId, reason, duration) {
        if (!confirm(`هل تريد حظر ${playerId}؟\nالمدة: ${duration} ساعة`)) {
            return false;
        }

        const result = await this.api.banPlayer(playerId, reason, duration);
        if (result && result.success) {
            alert('تم حظر اللاعب بنجاح');
            return true;
        } else {
            alert('فشل في حظر اللاعب');
            return false;
        }
    }

    /**
     * إرسال تحذير لاعب
     */
    async warnPlayer(playerId, warningText) {
        const message = `تحذير للاعب #${playerId}: ${warningText}`;
        const result = await this.api.sendMessage(message);
        return result && result.success;
    }

    /**
     * إعطاء أموال للاعب
     */
    async givePlayerMoney(playerId, amount) {
        return await this.api.updatePlayer(playerId, { money_change: amount });
    }

    /**
     * رفع مستوى اللاعب
     */
    async levelUpPlayer(playerId, levels = 1) {
        return await this.api.updatePlayer(playerId, { level_change: levels });
    }

    /**
     * إعادة تعيين كلمة المرور
     */
    async resetPlayerPassword(playerId) {
        if (!confirm('هل تريد حقا إعادة تعيين كلمة مرور هذا اللاعب؟')) {
            return false;
        }

        const result = await this.api.updatePlayer(playerId, { reset_password: true });
        return result && result.success;
    }

    /**
     * عرض لوحة التحكم
     */
    renderAdminPanel() {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'adminPanel';
        adminPanel.className = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-panel-content">
                <div class="admin-header">
                    <h2>🛡️ لوحة التحكم - إدارة السيرفر</h2>
                    <button class="close-btn" onclick="closeAdminPanel()">✕</button>
                </div>

                <div class="admin-tabs">
                    <button class="admin-tab-btn active" data-tab="players">اللاعبين</button>
                    <button class="admin-tab-btn" data-tab="server">السيرفر</button>
                    <button class="admin-tab-btn" data-tab="logs">السجلات</button>
                    <button class="admin-tab-btn" data-tab="settings">الإعدادات</button>
                </div>

                <div class="admin-content">
                    <!-- قسم اللاعبين -->
                    <div class="admin-tab-content active" data-tab="players">
                        <h3>إدارة اللاعبين</h3>
                        <div id="playerActions" class="player-actions">
                            <button class="action-btn danger" onclick="adminPanel.kickPlayerWithReason(selectedPlayerId, prompt('سبب الطرد:'))">🚪 طرد اللاعب</button>
                            <button class="action-btn danger" onclick="adminPanel.banPlayerWithReason(selectedPlayerId, prompt('سبب الحظر:'), prompt('المدة بالساعات:'))">🔒 حظر اللاعب</button>
                            <button class="action-btn warning" onclick="adminPanel.warnPlayer(selectedPlayerId, prompt('نص التحذير:'))">⚠️ تحذير اللاعب</button>
                            <button class="action-btn success" onclick="adminPanel.givePlayerMoney(selectedPlayerId, parseInt(prompt('المبلغ:')))">💰 إعطاء أموال</button>
                            <button class="action-btn info" onclick="adminPanel.levelUpPlayer(selectedPlayerId, parseInt(prompt('عدد المستويات:')))">⬆️ رفع المستوى</button>
                        </div>
                        <div id="playerDetails" class="player-details">
                            <!-- سيتم ملء التفاصيل هنا -->
                        </div>
                    </div>

                    <!-- قسم السيرفر -->
                    <div class="admin-tab-content" data-tab="server">
                        <h3>معلومات السيرفر</h3>
                        <div id="serverStats" class="server-stats">
                            <!-- سيتم ملء الإحصائيات هنا -->
                        </div>
                    </div>

                    <!-- قسم السجلات -->
                    <div class="admin-tab-content" data-tab="logs">
                        <h3>سجلات السيرفر</h3>
                        <div id="serverLogs" class="server-logs">
                            <!-- سيتم ملء السجلات هنا -->
                        </div>
                    </div>

                    <!-- قسم الإعدادات -->
                    <div class="admin-tab-content" data-tab="settings">
                        <h3>إعدادات السيرفر</h3>
                        <div id="serverSettings" class="server-settings">
                            <!-- سيتم ملء الإعدادات هنا -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(adminPanel);
        this.setupAdminTabs();
    }

    /**
     * إعداد علامات التبويب
     */
    setupAdminTabs() {
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        const tabContents = document.querySelectorAll('.admin-tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
            });
        });
    }

    /**
     * عرض تفاصيل اللاعب
     */
    renderPlayerDetails(player) {
        const detailsDiv = document.getElementById('playerDetails');
        if (detailsDiv) {
            detailsDiv.innerHTML = `
                <div class="detail-item">
                    <span class="label">الاسم:</span>
                    <span class="value">${player.name}</span>
                </div>
                <div class="detail-item">
                    <span class="label">الرقم:</span>
                    <span class="value">${player.id}</span>
                </div>
                <div class="detail-item">
                    <span class="label">المستوى:</span>
                    <span class="value">${player.level || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="label">الأموال:</span>
                    <span class="value">$${player.money || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="label">وقت اللعب:</span>
                    <span class="value">${player.playtime || '0h 0m'}</span>
                </div>
            `;
        }
    }

    /**
     * إغلاق لوحة التحكم
     */
    closePanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.remove();
        }
        this.adminMode = false;
    }
}

// إنشاء مثيل من لوحة التحكم
let adminPanel = null;

function initializeAdminPanel(apiInstance) {
    adminPanel = new AdminPanel(apiInstance);
}

function closeAdminPanel() {
    if (adminPanel) {
        adminPanel.closePanel();
    }
}
