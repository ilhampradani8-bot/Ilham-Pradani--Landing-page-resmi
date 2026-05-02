/* ============================================================
   INDEX PAGE LOGIC
   ============================================================ */

let allJournalsData = [];
let isShowAllJournals = false;
let currentJournalCategory = 'Semua';

async function loadArtikel() {
    try {
        const sheetId = '1eD1ElFcjBpVrS8DGShVlPrmuLI1bZIo4QEcxG1kBCAc';
        const res = await fetch(`https://opensheet.elk.sh/${sheetId}/Sheet1`);
        const data = await res.json();
        
        data.sort((a, b) => parseDate(b.tanggal || b.Tanggal) - parseDate(a.tanggal || a.Tanggal));
        allJournalsData = data;

        const gridContainer = document.getElementById('artikel-container');
        if (!gridContainer) return;

        const getVal = (item, k) => {
            const key = Object.keys(item).find(key => key.trim().toLowerCase() === k);
            return item[key] || '';
        };

        let gridHtml = '';
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        data.slice(0, 6).forEach(item => {
            const itemDate = parseDate(getVal(item, 'tanggal'));
            const isToday = itemDate.getTime() === now.getTime();
            const labelText = getTranslatedLabel('badge_new', 'NEW');
            const label = isToday ? `<span class="absolute top-4 right-4 px-2 py-1 bg-red-600 text-white text-[9px] font-black rounded-sm animate-pulse z-10">${labelText}</span>` : '';

            gridHtml += `
                <a href="baca.html?id=${item.id}" class="group relative bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 reveal-el flex flex-col">
                    ${label}
                    <div class="aspect-video overflow-hidden bg-slate-900">
                        <img src="${getVal(item, 'gambar')}" 
                             alt="${getVal(item, 'judul')}" 
                             onerror="this.src='https://placehold.co/1200x600/0a0a0a/3b82f6?text=Image+Not+Found'; this.className='w-full h-full object-cover opacity-20';"
                             class="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
                    </div>
                    <div class="p-8 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center gap-3 mb-4">
                                <span class="text-[9px] font-bold text-blue-500 uppercase tracking-widest">${getVal(item, 'kategori')}</span>
                                <span class="w-1 h-1 rounded-full bg-white/20"></span>
                                <span class="text-[9px] font-mono text-slate-500 uppercase">${getVal(item, 'tanggal')}</span>
                            </div>
                            <h3 class="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">${getVal(item, 'judul')}</h3>
                            <p class="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">${getVal(item, 'kutipan')}</p>
                        </div>
                        <div class="flex items-center justify-between pt-6 border-t border-white/5">
                            <span class="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-blue-400 transition-all" data-t="hero_cta_1">Baca Jurnal</span>
                            <i data-lucide="arrow-right" class="w-4 h-4 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
                        </div>
                    </div>
                </a>`;
        });
        gridContainer.innerHTML = gridHtml;

        renderJournalCategories();
        renderJournalList();

        if (window.lucide) lucide.createIcons();
        initScrollAnimations();
    } catch (e) { console.error("Article Error:", e); }
}

function renderJournalCategories() {
    const container = document.getElementById('jurnal-categories');
    if (!container) return;

    const categories = ['Semua', ...new Set(allJournalsData.map(item => item.kategori || 'Uncategorized'))];
    container.innerHTML = categories.map(cat => `
        <button onclick="filterJournals('${cat}')" 
                class="journal-tab-btn px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest border border-white/5 rounded-full transition-all hover:bg-white/5 text-slate-500"
                id="journal-tab-${cat.replace(/\s+/g, '-')}">
            ${cat}
        </button>
    `).join('');
    
    updateJournalTabVisuals('Semua');
}

window.filterJournals = function(category) {
    currentJournalCategory = category;
    isShowAllJournals = false;
    updateJournalTabVisuals(category);
    renderJournalList();
}

function updateJournalTabVisuals(category) {
    document.querySelectorAll('.journal-tab-btn').forEach(btn => {
        btn.classList.remove('bg-white/10', 'text-white', 'border-white/20');
        btn.classList.add('text-slate-500', 'border-white/5');
    });
    const activeBtn = document.getElementById(`journal-tab-${category.replace(/\s+/g, '-')}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-white/10', 'text-white', 'border-white/20');
        activeBtn.classList.remove('text-slate-500', 'border-white/5');
    }
}

function renderJournalList() {
    const listContainer = document.getElementById('jurnal-list-container');
    const counterVal = document.getElementById('journal-count-val');
    const showMoreBtn = document.getElementById('jurnal-show-more-container');
    if (!listContainer) return;

    const filtered = currentJournalCategory === 'Semua' 
        ? allJournalsData 
        : allJournalsData.filter(item => item.kategori === currentJournalCategory);

    counterVal.innerText = allJournalsData.length;

    const getVal = (item, k) => {
        const key = Object.keys(item).find(key => key.trim().toLowerCase() === k);
        return item[key] || '';
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const isMobile = window.innerWidth < 768;
    const displayData = (isMobile && !isShowAllJournals) ? filtered.slice(0, 5) : filtered;

    if (isMobile && filtered.length > 5) {
        showMoreBtn.style.display = isShowAllJournals ? 'none' : 'flex';
    } else {
        showMoreBtn.style.display = 'none';
    }

    listContainer.innerHTML = displayData.map(item => {
        const itemDate = parseDate(getVal(item, 'tanggal'));
        const isToday = itemDate.getTime() === now.getTime();
        const labelText = getTranslatedLabel('badge_new', 'NEW');
        const label = isToday ? `<span class="px-1.5 py-0.5 bg-red-600 text-white text-[7px] font-black rounded animate-pulse ml-2">${labelText}</span>` : '';

        return `
            <a href="${getVal(item, 'link')}" class="group flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/[0.02] transition-all">
                <div class="flex items-center gap-6 overflow-hidden">
                    <span class="text-[9px] font-mono text-slate-700 group-hover:text-blue-500 transition-colors shrink-0">${getVal(item, 'tanggal')}</span>
                    <h4 class="text-[13px] font-medium text-slate-500 group-hover:text-white transition-colors truncate">${getVal(item, 'judul')}</h4>
                    ${label}
                </div>
                <i data-lucide="arrow-right" class="w-3 h-3 text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0"></i>
            </a>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

window.toggleMoreJournals = function() {
    isShowAllJournals = true;
    renderJournalList();
}

window.addEventListener('resize', () => {
    renderJournalList();
});

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-el').forEach(el => {
        el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
        observer.observe(el);
    });
}

let allPortfolioData = [];

async function loadPortofolio() {
    try {
        const sheetId = '1eD1ElFcjBpVrS8DGShVlPrmuLI1bZIo4QEcxG1kBCAc';
        const res = await fetch(`https://opensheet.elk.sh/${sheetId}/Portofolio`);
        allPortfolioData = await res.json();
        renderPortfolioTabs(allPortfolioData);
        renderPortfolioGrid(allPortfolioData);
    } catch (e) { console.error("Portfolio Error:", e); }
}

function renderPortfolioTabs(data) {
    const tabContainer = document.getElementById('portofolio-tabs');
    if (!tabContainer) return;
    const categories = ['Semua', ...new Set(data.map(item => item.kategori))];
    tabContainer.innerHTML = categories.map(cat => `
        <button onclick="filterPortfolio('${cat}')" 
                class="port-tab-btn px-6 py-2 text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-full transition-all hover:bg-white/5 text-slate-400"
                id="tab-${cat.replace(/\s+/g, '-')}">
            ${cat}
        </button>
    `).join('');
    filterPortfolio('Semua');
}

window.filterPortfolio = function (category) {
    document.querySelectorAll('.port-tab-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        btn.classList.add('text-slate-400', 'border-white/10');
    });
    const activeBtn = document.getElementById(`tab-${category.replace(/\s+/g, '-')}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        activeBtn.classList.remove('text-slate-400', 'border-white/10');
    }
    const filtered = category === 'Semua' ? allPortfolioData : allPortfolioData.filter(item => item.kategori === category);
    const container = document.getElementById('portofolio-container');
    if (category === 'Semua' && filtered.length > 4) {
        container.classList.remove('grid', 'md:grid-cols-2', 'lg:grid-cols-3');
        container.classList.add('portfolio-scroll');
    } else {
        container.classList.add('grid', 'md:grid-cols-2', 'lg:grid-cols-3');
        container.classList.remove('portfolio-scroll');
    }
    renderPortfolioGrid(filtered);
};

function renderPortfolioGrid(data) {
    const container = document.getElementById('portofolio-container');
    if (!container) return;
    container.innerHTML = data.map(item => `
        <div class="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-blue-500/50">
            <div class="aspect-video overflow-hidden">
                <img src="${item.gambar}" class="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
            </div>
            <div class="p-5">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-[8px] font-bold text-blue-500 uppercase tracking-[0.2em]">${item.kategori}</span>
                </div>
                <h3 class="text-lg font-bold text-white mb-2">${item.judul}</h3>
                <p class="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed">${item.deskripsi}</p>
                <div class="flex flex-wrap gap-1.5 mb-6">
                    ${item.tech.split(',').map(t => `<span class="text-[8px] px-1.5 py-0.5 bg-white/5 text-slate-400 rounded-sm font-mono">${t.trim()}</span>`).join('')}
                </div>
                <a href="${item.link}" target="_blank" class="inline-flex items-center gap-2 text-[10px] font-bold text-white hover:text-blue-400 transition-colors">
                    View Project <i data-lucide="arrow-up-right" class="w-3 h-3"></i>
                </a>
            </div>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
}

// EXECUTION
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('header-placeholder', 'include/header.html');
    await loadComponent('footer-placeholder', 'include/footer.html');
    await applyTranslations();
    await loadArtikel();
    await loadPortofolio();

    const slider = document.getElementById('portofolio-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        if (!slider.classList.contains('portfolio-scroll')) return;
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; });
    slider.addEventListener('mouseup', () => { isDown = false; });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown || !slider.classList.contains('portfolio-scroll')) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
});
