// =====================================================
// Utility Functions
// دوال مساعدة مفيدة
// =====================================================

/**
 * تنسيق الرقم بفواصل (1000 -> 1,000)
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * تحويل ثواني إلى صيغة الوقت
 */
function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
}

/**
 * قص النص الطويل
 */
function truncateText(text, length = 20) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * نسخ نص إلى الحافظة
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('تم النسخ بنجاح');
    }).catch(err => {
        console.error('فشل النسخ:', err);
    });
}

/**
 * تأخير التنفيذ (async/await)
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * التحقق من الاتصال بالإنترنت
 */
function isOnline() {
    return navigator.onLine;
}

/**
 * الحصول على بيانات localStorage بشكل آمن
 */
function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('خطأ في قراءة localStorage:', e);
        return defaultValue;
    }
}

/**
 * حفظ بيانات في localStorage بشكل آمن
 */
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('خطأ في حفظ localStorage:', e);
        return false;
    }
}

/**
 * حساب الفرق بين تاريخين
 */
function getDaysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
}

/**
 * تحويل الوقت إلى الوقت المحلي
 */
function formatTime(time) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return new Date(time).toLocaleDateString('ar-EG', options);
}

/**
 * الحصول على لون عشوائي
 */
function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * تحويل RGB إلى HEX
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * تحويل HEX إلى RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * عرض إشعار (Toast notification)
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 6px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * تصفية الكائنات من مصفوفة
 */
function filterArray(array, key, value) {
    return array.filter(item => item[key] === value);
}

/**
 * البحث في مصفوفة
 */
function searchArray(array, keyword, keys = []) {
    const lowerKeyword = keyword.toLowerCase();
    return array.filter(item => {
        return keys.some(key => 
            String(item[key]).toLowerCase().includes(lowerKeyword)
        );
    });
}

/**
 * ترتيب المصفوفة
 */
function sortArray(array, key, order = 'asc') {
    return array.sort((a, b) => {
        if (order === 'asc') {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });
}

/**
 * عد عناصر مصفوفة حسب معيار
 */
function countBy(array, key, value) {
    return array.filter(item => item[key] === value).length;
}

/**
 * تجميع عناصر مصفوفة
 */
function groupBy(array, key) {
    return array.reduce((result, item) => {
        if (!result[item[key]]) {
            result[item[key]] = [];
        }
        result[item[key]].push(item);
        return result;
    }, {});
}

/**
 * الحصول على أقصى قيمة من المصفوفة
 */
function getMax(array, key) {
    return Math.max(...array.map(item => item[key]));
}

/**
 * الحصول على أقل قيمة من المصفوفة
 */
function getMin(array, key) {
    return Math.min(...array.map(item => item[key]));
}

/**
 * حساب متوسط القيم
 */
function getAverage(array, key) {
    const sum = array.reduce((acc, item) => acc + item[key], 0);
    return sum / array.length;
}

// تصدير الدوال إذا كان الملف يستخدم مع module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        formatSeconds,
        truncateText,
        validateEmail,
        copyToClipboard,
        delay,
        isOnline,
        getLocalStorage,
        setLocalStorage,
        getDaysDifference,
        formatTime,
        getRandomColor,
        rgbToHex,
        hexToRgb,
        showNotification,
        filterArray,
        searchArray,
        sortArray,
        countBy,
        groupBy,
        getMax,
        getMin,
        getAverage
    };
}