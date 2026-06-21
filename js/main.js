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

    const btnId = document.getElementById('btn-id');
    const btnEn = document.getElementById('btn-en');
    const mBtnId = document.getElementById('m-btn-id');
    const mBtnEn = document.getElementById('m-btn-en');
    const fBtnId = document.getElementById('f-btn-id');
    const fBtnEn = document.getElementById('f-btn-en');

    // Desktop buttons
    if (btnId && btnEn) {
        if (lang === 'en') {
            btnEn.className = "px-4 py-1.5 text-[10px] font-black rounded-full transition-all cursor-pointer text-blue-600 shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff]";
            btnId.className = "px-4 py-1.5 text-[10px] font-black rounded-full transition-all cursor-pointer text-gray-600";
        } else {
            btnId.className = "px-4 py-1.5 text-[10px] font-black rounded-full transition-all cursor-pointer text-blue-600 shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff]";
            btnEn.className = "px-4 py-1.5 text-[10px] font-black rounded-full transition-all cursor-pointer text-gray-600";
        }
    }

    // Mobile buttons
    if (mBtnId && mBtnEn) {
        if (lang === 'en') {
            mBtnEn.className = "text-sm font-black text-blue-600 px-4 py-2 bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff] rounded-lg transition-all";
            mBtnId.className = "text-sm font-black text-gray-700 px-4 py-2 bg-[#ecf0f3] shadow-[3px_3px_6px_#b8bec9,-3px_-3px_6px_#ffffff] rounded-lg transition-all";
        } else {
            mBtnId.className = "text-sm font-black text-blue-600 px-4 py-2 bg-[#ecf0f3] shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff] rounded-lg transition-all";
            mBtnEn.className = "text-sm font-black text-gray-700 px-4 py-2 bg-[#ecf0f3] shadow-[3px_3px_6px_#b8bec9,-3px_-3px_6px_#ffffff] rounded-lg transition-all";
        }
    }

    // Footer buttons
    const fActiveLang = document.getElementById('f-active-lang');
    if (fActiveLang) {
        fActiveLang.textContent = lang.toUpperCase();
    }
    if (fBtnId && fBtnEn) {
        if (lang === 'en') {
            fBtnEn.className = "block w-full text-left px-2 py-1 text-[9px] font-black text-blue-400 bg-gray-950 rounded transition-colors";
            fBtnId.className = "block w-full text-left px-2 py-1 text-[9px] font-extrabold text-gray-400 hover:text-white rounded transition-colors";
        } else {
            fBtnId.className = "block w-full text-left px-2 py-1 text-[9px] font-black text-blue-400 bg-gray-950 rounded transition-colors";
            fBtnEn.className = "block w-full text-left px-2 py-1 text-[9px] font-extrabold text-gray-400 hover:text-white rounded transition-colors";
        }
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

// Lenis Smooth Scroll Initialization
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.1,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis scroll with hash links
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            try {
                const url = new URL(href, window.location.href);
                const currentPath = window.location.pathname;
                const targetPath = url.pathname;
                
                // If it's a hash link pointing to the current page
                if (url.hash && (
                    targetPath === currentPath || 
                    targetPath === '/' || 
                    (currentPath.endsWith('/') && targetPath.endsWith('index.html')) ||
                    (currentPath.endsWith('index.html') && targetPath.endsWith('/'))
                )) {
                    const targetEl = document.getElementById(url.hash.substring(1));
                    if (targetEl) {
                        e.preventDefault();
                        lenis.scrollTo(targetEl, {
                            offset: -80,
                            duration: 1.2,
                        });
                    }
                }
            } catch (err) {
                // Fallback for simple relative hashes
                if (href.startsWith('#')) {
                    const targetEl = document.getElementById(href.substring(1));
                    if (targetEl) {
                        e.preventDefault();
                        lenis.scrollTo(targetEl, {
                            offset: -80,
                            duration: 1.2,
                        });
                    }
                }
            }
        });
    });
}
