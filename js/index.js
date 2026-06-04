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
                <a href="baca.html?id=${item.id}" class="neu-card group relative bg-[#ecf0f3] overflow-hidden hover:scale-[1.01] transition-all duration-500 reveal-el flex flex-col sm:flex-row h-auto sm:h-52 w-full">
                    ${label}
                    <div class="w-full sm:w-2/5 h-36 sm:h-full overflow-hidden bg-gray-200 relative shrink-0">
                        <img src="${getVal(item, 'gambar')}" 
                             alt="${getVal(item, 'judul')}" 
                             onerror="this.src='https://placehold.co/1200x600/ecf0f3/2563eb?text=No+Image'; this.className='w-full h-full object-cover opacity-30';"
                             class="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
                    </div>
                    <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-hidden">
                        <div>
                            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-500 font-semibold mb-2">
                                <div class="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                    <i data-lucide="user" class="w-3 h-3"></i>
                                    <span>Dr. Ilham Pradani</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <i data-lucide="calendar" class="w-3 h-3"></i>
                                    <span>${getVal(item, 'tanggal')}</span>
                                </div>
                                <div class="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                    <i data-lucide="tag" class="w-3 h-3"></i>
                                    <span>${getVal(item, 'kategori')}</span>
                                </div>
                            </div>
                            <h3 class="text-base sm:text-md font-extrabold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                ${getVal(item, 'judul')}
                            </h3>
                            <p class="text-gray-600 text-xs line-clamp-2 sm:line-clamp-3 leading-relaxed mb-4 font-medium">
                                ${getVal(item, 'kutipan')}
                            </p>
                        </div>
                        <div class="flex items-center justify-between pt-3 border-t border-gray-200/50">
                            <button class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-[10px] font-black text-white uppercase tracking-widest rounded-lg shadow-[2px_2px_5px_rgba(59,130,246,0.3)] transition-all">
                                Read More &raquo;
                            </button>
                            <i data-lucide="arrow-right" class="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
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
                class="journal-tab-btn px-3 sm:px-4 py-1.5 text-[9px] font-extrabold uppercase tracking-widest bg-[#ecf0f3] rounded-full transition-all text-gray-600 shadow-[2px_2px_5px_#b8bec9,-2px_-2px_5px_#ffffff] hover:shadow-[inset_1px_1px_3px_#b8bec9,inset_-1px_-1px_3px_#ffffff] flex items-center justify-center text-center"
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
        btn.classList.remove('shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff]', 'text-blue-600', 'font-black');
        btn.classList.add('shadow-[2px_2px_5px_#b8bec9,-2px_-2px_5px_#ffffff]', 'text-gray-600');
    });
    const activeBtn = document.getElementById(`journal-tab-${category.replace(/\s+/g, '-')}`);
    if (activeBtn) {
        activeBtn.classList.remove('shadow-[2px_2px_5px_#b8bec9,-2px_-2px_5px_#ffffff]', 'text-gray-600');
        activeBtn.classList.add('shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff]', 'text-blue-600', 'font-black');
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
            <a href="${getVal(item, 'link')}" class="group flex items-center justify-between p-4 border-b border-gray-200/50 hover:bg-white/20 transition-all">
                <div class="flex items-center gap-6 overflow-hidden">
                    <span class="text-[9px] font-mono text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 font-bold">${getVal(item, 'tanggal')}</span>
                    <h4 class="text-[13px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors truncate">${getVal(item, 'judul')}</h4>
                    ${label}
                </div>
                <i data-lucide="arrow-right" class="w-3 h-3 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0"></i>
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
    tabContainer.innerHTML = categories.map(cat => {
        const count = cat === 'Semua' ? data.length : data.filter(item => item.kategori === cat).length;
        return `
            <button onclick="filterPortfolio('${cat}')" 
                    class="port-tab-btn px-3 sm:px-6 py-2 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-[#ecf0f3] rounded-full transition-all text-gray-600 shadow-[2px_2px_5px_#b8bec9,-2px_-2px_5px_#ffffff] hover:shadow-[inset_1px_1px_3px_#b8bec9,inset_-1px_-1px_3px_#ffffff] flex items-center justify-center gap-1.5"
                    id="tab-${cat.replace(/\s+/g, '-')}">
                <span>${cat}</span>
                <span class="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-mono border border-blue-100 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]">${count}</span>
            </button>
        `;
    }).join('');
    filterPortfolio('Semua');
}

window.filterPortfolio = function (category) {
    document.querySelectorAll('.port-tab-btn').forEach(btn => {
        btn.classList.remove('shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff]', 'text-blue-600', 'font-black');
        btn.classList.add('shadow-[2px_2px_5px_#b8bec9,-2px_-2px_5px_#ffffff]', 'text-gray-600');
    });
    const activeBtn = document.getElementById(`tab-${category.replace(/\s+/g, '-')}`);
    if (activeBtn) {
        activeBtn.classList.remove('shadow-[2px_2px_5px_#b8bec9,-2px_-2px_5px_#ffffff]', 'text-gray-600');
        activeBtn.classList.add('shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff]', 'text-blue-600', 'font-black');
    }
    const filtered = category === 'Semua' ? allPortfolioData : allPortfolioData.filter(item => item.kategori === category);
    renderPortfolioGrid(filtered);
};

function init3DCarousel(container) {
    const items = container.querySelectorAll('.portfolio-3d-item');
    if (!items.length) return;
    
    const count = items.length;
    let activeIndex = 0;
    
    const animate = (active) => {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 768;
        const shiftX = isMobile ? (screenWidth * 0.45) : 220;
        const shiftY = isMobile ? 25 : 40;
        const hiddenShiftX = isMobile ? (screenWidth * 0.75) : 340;

        items.forEach((item, index) => {
            const diff = index - active;
            const zIndex = diff === 0 ? count : count - Math.abs(diff);
            
            let translateX = 0;
            let translateY = 0;
            let rotate = 0;
            let scale = 1;
            let opacity = 1;

            if (diff === 0) {
                translateX = 0;
                translateY = 0;
                rotate = 0;
                scale = 1;
                opacity = 1;
            } else if (diff === -1) {
                translateX = -shiftX;
                translateY = -shiftY;
                rotate = -12;
                scale = 0.9;
                opacity = 0.85;
            } else if (diff === 1) {
                translateX = shiftX;
                translateY = shiftY;
                rotate = 12;
                scale = 0.9;
                opacity = 0.85;
            } else if (diff < -1) {
                translateX = -hiddenShiftX;
                translateY = -shiftY * 1.8;
                rotate = -20;
                scale = 0.8;
                opacity = 0;
            } else if (diff > 1) {
                translateX = hiddenShiftX;
                translateY = shiftY * 1.8;
                rotate = 20;
                scale = 0.8;
                opacity = 0;
            }

            item.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
            item.style.opacity = opacity;
            item.style.zIndex = zIndex;
        });
    };
    
    animate(activeIndex);
    
    // Bind click events on items
    items.forEach((item, i) => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            activeIndex = i;
            animate(activeIndex);
        });
    });
    
    // Explicitly reset any previous handlers
    container.onwheel = null;
    container.onmousedown = null;
    container.onmousemove = null;
    container.onmouseup = null;
    container.onmouseleave = null;
    let startX = 0;
    let isSwiping = false;

    container.ontouchstart = (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    };

    container.ontouchmove = (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        if (Math.abs(diffX) > 50) {
            isSwiping = false;
            if (diffX > 0) {
                if (activeIndex > 0) {
                    activeIndex--;
                    animate(activeIndex);
                }
            } else {
                if (activeIndex < count - 1) {
                    activeIndex++;
                    animate(activeIndex);
                }
            }
        }
    };

    container.ontouchend = () => {
        isSwiping = false;
    };

    if (container._cleanupResize) {
        window.removeEventListener('resize', container._cleanupResize);
    }
    const handleResize = () => animate(activeIndex);
    window.addEventListener('resize', handleResize);
    container._cleanupResize = handleResize;
}

function renderPortfolioGrid(data) {
    const container = document.getElementById('portofolio-container');
    if (!container) return;
    
    container.className = "portfolio-3d-container reveal-el transition-all duration-500";
    
    container.innerHTML = data.map((item, index) => {
        const numStr = String(index + 1).padStart(2, '0');
        const techBadges = item.tech.split(',').map(t => `
            <span class="text-[8px] px-2 py-0.5 bg-gray-200/70 text-gray-700 rounded-md font-mono border border-white/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]">
                ${t.trim()}
            </span>
        `).join('');

        return `
            <div class="portfolio-3d-item group" data-index="${index}">
                <div class="portfolio-3d-box relative flex flex-col p-4 h-full w-full">
                    <!-- Image Card Area -->
                    <div class="w-full h-[120px] sm:h-[150px] md:h-[220px] overflow-hidden rounded-2xl bg-gray-200 relative shadow-[inset_2px_2px_5px_#b8bec9,inset_-2px_-2px_5px_#ffffff] mb-4 flex-shrink-0">
                        <img src="${item.gambar}" 
                             alt="${item.judul}" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 pointer-events-none">
                        
                        <!-- Top Category Badge & Number -->
                        <div class="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                            <span class="text-[8px] font-extrabold text-white bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/10 shadow-sm">
                                ${item.kategori}
                            </span>
                            <span class="text-xl font-bold font-mono text-white/40">
                                ${numStr}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Content Card Area -->
                    <div class="flex-1 flex flex-col justify-between overflow-hidden">
                        <div>
                            <h3 class="text-sm md:text-base font-extrabold text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">
                                ${item.judul}
                            </h3>
                            
                            <!-- Tech badges -->
                            <div class="flex flex-wrap gap-1 mb-2">
                                ${techBadges}
                            </div>
                            
                            <!-- Description -->
                            <p class="text-gray-600 text-[10px] md:text-[11px] leading-relaxed font-semibold line-clamp-3">
                                ${item.deskripsi}
                            </p>
                        </div>
                        
                        <!-- CTA Link -->
                        <div class="mt-3 flex justify-between items-center flex-shrink-0">
                            <a href="${item.link}" target="_blank" class="inline-flex items-center gap-1.5 text-[9px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                                <span>View Project</span>
                                <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    if (window.lucide) lucide.createIcons();
    init3DCarousel(container);
}

// EXECUTION
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('header-placeholder', 'include/header.html');
    await loadComponent('footer-placeholder', 'include/footer.html');
    await applyTranslations();
    await loadArtikel();
    await loadPortofolio();
    
    // Initialize Award Slider (Swiper)
    if (window.Swiper) {
        new Swiper('.blog-slider', {
            spaceBetween: 30,
            effect: 'fade',
            loop: true,
            mousewheel: {
                invert: false,
            },
            navigation: {
                nextEl: '.award-next',
                prevEl: '.award-prev',
            },
            pagination: {
                el: '.blog-slider__pagination',
                clickable: true,
            }
        });
    }
});
