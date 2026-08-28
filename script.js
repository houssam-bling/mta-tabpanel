// ===========================
// THE NORTH ROLEPLAY - TabPanel
// JavaScript Logic
// ===========================

// بيانات اللاعبين (محاكاة - يمكن جلبها من API)
let allPlayers = [];
let filteredPlayers = [];
let currentPage = 1;
const playersPerPage = 15;
let currentFilter = 'all';

// البيانات الوهمية للتطوير
const mockPlayers = [
    { id: 10335, name: 'Messi Leffler', rank: 'Player', status: 'online', playtime: '2h 30m', ping: 66 },
    { id: 1, name: 'Johan Johnson', rank: 'Player', status: 'online', playtime: '2h 30m', ping: 123 },
    { id: 15, name: 'Lama Ackerman', rank: 'Player', status: 'online', playtime: '17h 25m', ping: 74 },
    { id: 20, name: 'Ahmed Al Najjar', rank: 'Founder', status: 'online', playtime: '9h 10m', ping: 63 },
    { id: 22, name: 'Karim El Shahat', rank: 'Player', status: 'online', playtime: '41m 40s', ping: 68 },
    { id: 24, name: 'Aspect Marks', rank: 'Admin', status: 'online', playtime: '46m 40s', ping: 103 },
    { id: 29, name: 'Ahmed Alsatar', rank: 'Player', status: 'online', playtime: '3h 10m', ping: 61 },
    { id: 31, name: 'Levai Ackerman', rank: 'Moderator', status: 'online', playtime: '30m 50s', ping: 62 },
    { id: 107, name: 'Glow R\'Escobar', rank: 'Player', status: 'online', playtime: '20m', ping: 239 },
    { id: 116, name: 'Adem Mh Mariot', rank: 'Player', status: 'online', playtime: '15m 50s', ping: 142 },
    { id: 120, name: 'Nidai Ackerman', rank: 'VIP', status: 'online', playtime: '1h 6m 40s', ping: 2776 },
    { id: 122, name: 'Molten El Shahat', rank: 'VIP', status: 'online', playtime: '2h 50m', ping: 75 },
    { id: 409, name: 'Nex M\'Cartel', rank: 'Player', status: 'online', playtime: '25m 50s', ping: 78 },
    { id: 429, name: 'Derx Tanize', rank: 'Player', status: 'online', playtime: '19m 10s', ping: 148 },
    { id: 465, name: 'Smoke EL Shahat', rank: 'Player', status: 'online', playtime: '3h 51m 40s', ping: 98 },
];

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    allPlayers = [...mockPlayers];
    filteredPlayers = [...mockPlayers];
    
    updatePlayerCount();
    renderTable();
    setupEventListeners();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // البحث
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        currentPage = 1;
        filterPlayers();
    });

    // الفلاتر
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1;
            filterPlayers();
        });
    });

    // التصفح
    document.getElementById('prevBtn').addEventListener('click', previousPage);
    document.getElementById('nextBtn').addEventListener('click', nextPage);
}

// فلترة اللاعبين
function filterPlayers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredPlayers = allPlayers.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchTerm) || 
                            player.id.toString().includes(searchTerm);
        
        const matchesFilter = 
            currentFilter === 'all' ||
            (currentFilter === 'admin' && ['Admin', 'Founder'].includes(player.rank)) ||
            (currentFilter === 'vip' && player.rank === 'VIP') ||
            (currentFilter === 'online' && player.status === 'online');
        
        return matchesSearch && matchesFilter;
    });

    renderTable();
    updatePagination();
}

// تحديث عدد اللاعبين
function updatePlayerCount() {
    const onlineCount = allPlayers.filter(p => p.status === 'online').length;
    document.getElementById('playerCount').textContent = `${onlineCount} / 512`;
}

// رسم الجدول
function renderTable() {
    const tbody = document.getElementById('playersTableBody');
    tbody.innerHTML = '';

    if (filteredPlayers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    <h3>لا توجد نتائج</h3>
                    <p>جرب البحث أو تغيير الفلتر</p>
                </td>
            </tr>
        `;
        return;
    }

    const startIdx = (currentPage - 1) * playersPerPage;
    const endIdx = startIdx + playersPerPage;
    const pageData = filteredPlayers.slice(startIdx, endIdx);

    pageData.forEach((player, index) => {
        const row = document.createElement('tr');
        
        // رقم اللاعب الفعلي
        const realIndex = startIdx + index + 1;
        
        // تحديد لون وتصنيف الرتبة
        let rankClass = 'rank-player';
        if (player.rank === 'Admin' || player.rank === 'Founder') rankClass = 'rank-admin';
        else if (player.rank === 'Moderator') rankClass = 'rank-moderator';
        else if (player.rank === 'VIP') rankClass = 'rank-vip';

        // تحديد جودة الـ Ping
        let pingClass = 'good';
        if (player.ping > 150) pingClass = 'high';
        else if (player.ping > 100) pingClass = 'medium';

        row.innerHTML = `
            <td class="player-id">${player.id}</td>
            <td class="player-name">${player.name}</td>
            <td><span class="player-rank ${rankClass}">${player.rank}</span></td>
            <td class="player-status">
                <span class="status-indicator ${player.status === 'online' ? 'status-online' : 'status-offline'}"></span>
                ${player.status === 'online' ? 'نشط' : 'غير متصل'}
            </td>
            <td class="playtime">${player.playtime}</td>
            <td class="ping ${pingClass}">${player.ping} ms</td>
            <td class="connection-status ${player.status === 'online' ? 'connected' : 'disconnected'}">
                ${player.status === 'online' ? '✓' : '✕'}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// تحديث التصفح
function updatePagination() {
    const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
    
    document.getElementById('pageInfo').textContent = 
        `الصفحة ${currentPage} من ${totalPages || 1}`;
    
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages || totalPages === 0;
}

// الصفحة السابقة
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// الصفحة التالية
function nextPage() {
    const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// دالة لإضافة لاعب جديد (يمكن استدعاؤها من API)
function addPlayer(player) {
    allPlayers.push(player);
    allPlayers.sort((a, b) => b.id - a.id);
    updatePlayerCount();
    filterPlayers();
}

// دالة لإزالة لاعب (عند خروجه)
function removePlayer(playerId) {
    allPlayers = allPlayers.filter(p => p.id !== playerId);
    updatePlayerCount();
    filterPlayers();
}

// دالة لتحديث معلومات لاعب
function updatePlayer(playerId, newData) {
    const player = allPlayers.find(p => p.id === playerId);
    if (player) {
        Object.assign(player, newData);
        filterPlayers();
    }
}

// تحديث البيانات كل 5 ثواني (محاكاة)
setInterval(() => {
    // هنا يمكن جلب البيانات من API
    // updatePlayerCount();
    // renderTable();
}, 5000);
