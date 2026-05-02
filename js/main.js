/* ============================================================
   SHARED UTILITIES & UI LOGIC
   ============================================================ */

const parseDate = (str) => {
    if (!str) return new Date(0);
    const s = str.trim().toLowerCase();
    if (s.includes('/')) {
        const [d, m, y] = s.split('/');
        return new Date(`${y}-${m}-${d}`);
    }
    const months = {
        'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
        'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11,
        'january': 0, 'february': 1, 'march': 2, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
    };
    const parts = s.split(' ');
    if (parts.length === 3) return new Date(parts[2], months[parts[1]] || 0, parts[0]);
    return new Date(str);
};

const getTranslatedLabel = (key, fallback) => {
    const lang = localStorage.getItem('preferred_lang') || 'id';
    return lang === 'en' ? 'NEW' : 'BARU';
};

window.switchLang = function (lang) {
    localStorage.setItem('preferred_lang', lang);
    location.reload();
};

window.openProfileZoom = function () {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
};

window.closeProfileZoom = function () {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
};

window.toggleMobileMenu = function (open) {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        if (open) {
            menu.classList.remove('hidden');
            menu.classList.add('flex');
            document.body.style.overflow = 'hidden';
        } else {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
            document.body.style.overflow = '';
        }
    }
};

function updateLangUI() {
    const lang = localStorage.getItem('preferred_lang') || 'id';
    const activeClass = "bg-blue-600 text-white border-blue-600";

    const btnId = document.getElementById('btn-id');
    const btnEn = document.getElementById('btn-en');
    const mBtnId = document.getElementById('m-btn-id');
    const mBtnEn = document.getElementById('m-btn-en');

    if (lang === 'en') {
        if (btnEn) btnEn.className = `px-4 py-1.5 text-[10px] font-black rounded-full transition-all cursor-pointer ${activeClass}`;
        if (mBtnEn) mBtnEn.className = `text-sm font-black px-4 py-2 border rounded-lg transition-all ${activeClass}`;
    } else {
        if (btnId) btnId.className = `px-4 py-1.5 text-[10px] font-black rounded-full transition-all cursor-pointer ${activeClass}`;
        if (mBtnId) mBtnId.className = `text-sm font-black px-4 py-2 border rounded-lg transition-all ${activeClass}`;
    }
}

async function applyTranslations() {
    const lang = localStorage.getItem('preferred_lang') || 'id';
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) return;
        const t = await response.json();
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (t[key]) el.innerHTML = t[key];
        });
    } catch (e) { console.error("Translation Error:", e); }
}

async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const res = await fetch(file);
        if (res.ok) {
            el.innerHTML = await res.text();
            if (window.lucide) lucide.createIcons();
            updateLangUI();
            applyTranslations();
        }
    } catch (e) { console.error("Component Error:", e); }
}

// Alias for compatibility
window.loadPart = loadComponent;

window.setTheme = function(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
    }
};

// Auto apply theme
(function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') document.body.classList.add('light-theme');
})();
