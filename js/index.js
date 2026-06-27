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
                <a href="baca.html?id=${item.id}" class="swiper-slide neu-card group relative bg-[#ecf0f3] overflow-hidden hover:scale-[1.01] transition-all duration-500 reveal-el flex flex-col sm:flex-row h-auto sm:h-52 w-full">
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
                                    <span>Dr. Ilham Pradani C.L.</span>
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
                            <p class="text-gray-650 text-xs line-clamp-2 sm:line-clamp-3 leading-relaxed mb-4 font-medium">
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

        // Initialize Swiper for articles
        if (window.Swiper) {
            new Swiper('.articles-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    }
                },
                pagination: {
                    el: '.articles-pagination',
                    clickable: true
                }
            });
        }
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

function initServicesTabs() {
    const tabsList = document.getElementById('services-tabs-list');
    const contentPanel = document.getElementById('services-content-panel');
    if (!tabsList || !contentPanel) return;

    const cards = Array.from(contentPanel.children);
    tabsList.innerHTML = '';

    const serviceBgImages = [
        "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
    ];

    const bgOverlay = document.getElementById('services-bg-overlay');
    if (bgOverlay && serviceBgImages[0]) {
        bgOverlay.style.backgroundImage = `url('${serviceBgImages[0]}')`;
    }

    cards.forEach((card, index) => {
        const titleEl = card.querySelector('[data-t^="s_"][data-t$="_t"]');
        const iconEl = card.querySelector('[data-lucide]');
        const iconName = iconEl ? iconEl.getAttribute('data-lucide') : 'layout';
        const titleText = titleEl ? titleEl.textContent : `Service ${index + 1}`;
        const dataT = titleEl ? titleEl.getAttribute('data-t') : '';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `service-tab-btn flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 text-left rounded-lg md:rounded-xl transition-all w-full min-w-0 bg-[#ecf0f3]
            ${index === 0 ? 'shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff] text-blue-600 font-bold' : 'shadow-[3px_3px_6px_#b8bec9,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff] text-gray-700'}`;
        btn.innerHTML = `
            <div class="w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg flex items-center justify-center shrink-0 ${index === 0 ? 'bg-blue-600 text-white shadow-sm' : 'bg-[#ecf0f3] shadow-[inset_1px_1px_2px_#b8bec9,inset_-1px_-1px_2px_#ffffff] text-gray-500'}">
                <i data-lucide="${iconName}" class="w-3 h-3 md:w-3.5 md:h-3.5"></i>
            </div>
            <span class="text-[7.5px] md:text-[9.5px] uppercase tracking-wider font-extrabold truncate min-w-0" ${dataT ? `data-t="${dataT.replace('_t', '_tab')}"` : ''}>${titleText}</span>
        `;
        
        btn.addEventListener('click', () => {
            cards.forEach(c => c.classList.add('hidden'));
            card.classList.remove('hidden');
            card.className = "neu-card w-full h-full p-4 sm:p-8 bg-[#ecf0f3] flex flex-col justify-center reveal-el transition-all duration-300";
 
            if (bgOverlay && serviceBgImages[index]) {
                bgOverlay.style.backgroundImage = `url('${serviceBgImages[index]}')`;
            }

            document.querySelectorAll('.service-tab-btn').forEach((b, idx) => {
                b.className = `service-tab-btn flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 text-left rounded-lg md:rounded-xl transition-all w-full min-w-0 bg-[#ecf0f3]
                    ${idx === index ? 'shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff] text-blue-600 font-bold' : 'shadow-[3px_3px_6px_#b8bec9,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#b8bec9,inset_-2px_-2px_4px_#ffffff] text-gray-700'}`;
                
                const iconContainer = b.querySelector('div');
                if (iconContainer) {
                    iconContainer.className = `w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg flex items-center justify-center shrink-0
                        ${idx === index ? 'bg-blue-600 text-white shadow-sm' : 'bg-[#ecf0f3] shadow-[inset_1px_1px_2px_#b8bec9,inset_-1px_-1px_2px_#ffffff] text-gray-500'}`;
                }
            });
        });

        tabsList.appendChild(btn);

        if (index > 0) {
            card.classList.add('hidden');
        } else {
            card.className = "neu-card w-full h-full p-4 sm:p-8 bg-[#ecf0f3] flex flex-col justify-center reveal-el transition-all duration-300";
        }
    });

    // Touch Swipe navigation support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    contentPanel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    contentPanel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) < 50) return;
        
        let activeIndex = cards.findIndex(c => !c.classList.contains('hidden'));
        if (activeIndex === -1) return;
        
        let newIndex = diff > 0 ? (activeIndex + 1) % cards.length : (activeIndex - 1 + cards.length) % cards.length;
        const buttons = Array.from(tabsList.children);
        if (buttons[newIndex]) {
            buttons[newIndex].click();
        }
    }, { passive: true });

    if (window.lucide) lucide.createIcons();
}

function initParallaxScroll() {
    const sections = Array.from(document.querySelectorAll('main > section'));
    
    sections.forEach((section, index) => {
        section.style.zIndex = index + 1;
        section.classList.add('scroll-section');
    });

    let sectionOffsets = [];
    const calculateOffsets = () => {
        const scrollTop = window.scrollY;
        sectionOffsets = sections.map(sec => {
            const rect = sec.getBoundingClientRect();
            return {
                top: rect.top + scrollTop,
                height: rect.height
            };
        });
    };
    calculateOffsets();
    window.addEventListener('resize', calculateOffsets);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // 1. Transparent/Glassmorphic Header in Hero section
        const navbar = document.getElementById('top-navbar');
        if (navbar) {
            if (scrollTop < 80) {
                navbar.className = "fixed w-full z-50 bg-[#ecf0f3]/40 backdrop-blur-md border-b border-white/20 shadow-none transition-all duration-300";
            } else {
                navbar.className = "fixed w-full z-50 bg-[#ecf0f3] shadow-[0_4px_20px_rgba(163,177,198,0.35)] border-transparent transition-all duration-300";
            }
        }

        // 2. Active Section Navigation Link Highlight (Scroll Spy)
        let currentIndex = 0;
        let minDiff = Infinity;
        const viewportCenter = scrollTop + viewportHeight / 2;
        sectionOffsets.forEach((offset, idx) => {
            const secCenter = offset.top + offset.height / 2;
            const diff = Math.abs(secCenter - viewportCenter);
            if (diff < minDiff) {
                minDiff = diff;
                currentIndex = idx;
            }
        });
        const activeSection = sections[currentIndex];
        const activeId = activeSection ? activeSection.getAttribute('id') : '';

        // Highlight Top-Level triggers
        const mainTrigger = document.querySelector('[data-t="nav_main_menu"]');
        if (mainTrigger) {
            const isMainActive = ['services', 'partnership', 'teacher', 'portofolio', 'reviews', 'daftar-jurnal', 'awards'].includes(activeId);
            if (isMainActive) {
                mainTrigger.className = "hover:text-blue-600 transition-colors flex items-center gap-1.5 uppercase h-full text-blue-600 font-black";
            } else {
                mainTrigger.className = "hover:text-blue-600 transition-colors flex items-center gap-1.5 uppercase h-full text-gray-600 font-bold";
            }
        }

        const contactTrigger = document.querySelector('[data-t="nav_contact"]');
        if (contactTrigger) {
            if (activeId === 'contact') {
                contactTrigger.className = "hover:text-blue-600 transition-colors flex items-center gap-1.5 uppercase h-full text-blue-600 font-black";
            } else {
                contactTrigger.className = "hover:text-blue-600 transition-colors flex items-center gap-1.5 uppercase h-full text-gray-600 font-bold";
            }
        }

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const secId = link.getAttribute('data-section');
            if (secId === activeId) {
                link.className = "nav-link hover:text-blue-600 transition-all duration-300 px-2.5 py-1.5 rounded-full text-blue-600 font-extrabold shadow-[inset_1.5px_1.5px_3px_#b8bec9,inset_-1.5px_-1.5px_3px_#ffffff] flex items-center gap-2 text-xs";
            } else {
                link.className = "nav-link hover:text-blue-600 transition-all duration-300 px-2.5 py-1.5 rounded-full text-gray-700 font-bold flex items-center gap-2 text-xs";
            }
        });

        const mNavLinks = document.querySelectorAll('.m-nav-link');
        mNavLinks.forEach(link => {
            const secId = link.getAttribute('data-section');
            if (secId === activeId) {
                link.className = "m-nav-link text-blue-600 hover:text-blue-600 font-black transition-colors flex items-center gap-2 text-[11px]";
            } else {
                link.className = "m-nav-link text-gray-700 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 text-[11px]";
            }
        });

        sections.forEach((section, index) => {
            const inner = section.querySelector('.section-inner');
            if (inner) {
                if (window.innerWidth < 1024) {
                    inner.style.transform = '';
                    inner.style.opacity = '';
                    return;
                }
                const sectionTop = index * viewportHeight;
                const relativeScroll = scrollTop - sectionTop;
                if (relativeScroll > 0 && relativeScroll < viewportHeight) {
                    const progress = relativeScroll / viewportHeight; // 0 to 1
                    const scale = 1 - (0.06 * progress); // Scale from 1 to 0.94
                    const translateY = -15 * progress; // Translate up to -15vh
                    const opacity = 1 - (0.5 * progress); // Fade from 1 to 0.5
                    inner.style.transform = `translateY(${translateY}vh) scale(${scale})`;
                    inner.style.opacity = `${opacity}`;
                } else if (relativeScroll >= viewportHeight) {
                    inner.style.transform = `translateY(-15vh) scale(0.94)`;
                    inner.style.opacity = `0.5`;
                } else {
                    inner.style.transform = `translateY(0) scale(1)`;
                    inner.style.opacity = `1`;
                }
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
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

    const prevBtn = document.getElementById('portfolio-prev');
    const nextBtn = document.getElementById('portfolio-next');
    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.preventDefault();
            if (activeIndex > 0) {
                activeIndex--;
            } else {
                activeIndex = count - 1;
            }
            animate(activeIndex);
        };
    }
    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.preventDefault();
            if (activeIndex < count - 1) {
                activeIndex++;
            } else {
                activeIndex = 0;
            }
            animate(activeIndex);
        };
    }
    
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

// Floating Page Navigation Indicator
function initPageNavIndicator() {
    let container = document.getElementById('page-nav-indicator');
    if (!container) {
        container = document.createElement('div');
        container.id = 'page-nav-indicator';
        container.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-1.5 px-2.5 py-1 bg-[#ecf0f3]/50 backdrop-blur-md rounded-full border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.05)] items-center justify-center pointer-events-auto transition-opacity duration-300';
        document.body.appendChild(container);
    }

    const sections = Array.from(document.querySelectorAll('main > section.scroll-section'));
    if (sections.length === 0) return;

    let sectionOffsets = [];
    const calculateOffsets = () => {
        const scrollTop = window.scrollY;
        sectionOffsets = sections.map(sec => {
            const rect = sec.getBoundingClientRect();
            return {
                top: rect.top + scrollTop,
                height: rect.height
            };
        });
    };
    calculateOffsets();
    window.addEventListener('resize', () => {
        calculateOffsets();
        updateActiveDot();
    });

    const lang = localStorage.getItem('preferred_lang') || 'id';
    const sectionNames = {
        id: {
            'home': 'Beranda',
            'services': 'Layanan',
            'partnership': 'Mitra',
            'teacher': 'Akademis',
            'portofolio': 'Karya',
            'reviews': 'Ulasan',
            'artikel': 'Artikel',
            'daftar-jurnal': 'Jurnal',
            'awards': 'Sertifikat',
            'contact': 'Kontak'
        },
        en: {
            'home': 'Home',
            'services': 'Services',
            'partnership': 'Partnership',
            'teacher': 'Academic',
            'portofolio': 'Portfolio',
            'reviews': 'Reviews',
            'artikel': 'Articles',
            'daftar-jurnal': 'Journals',
            'awards': 'Certificates',
            'contact': 'Contact'
        }
    };

    container.innerHTML = '';

    sections.forEach((section, index) => {
        const id = section.getAttribute('id');
        const name = (sectionNames[lang] && sectionNames[lang][id]) ? sectionNames[lang][id] : id;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'group relative p-1 focus:outline-none flex items-center justify-center';
        btn.setAttribute('aria-label', name);
        
        const dot = document.createElement('span');
        dot.className = `h-1.5 rounded-full transition-all duration-300 ${index === 0 ? 'w-4 bg-blue-600' : 'w-1.5 bg-gray-400/60 group-hover:bg-gray-600/90'}`;
        btn.appendChild(dot);

        const tooltip = document.createElement('span');
        tooltip.className = 'absolute bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[9px] font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50';
        tooltip.textContent = name;
        btn.appendChild(tooltip);

        btn.addEventListener('click', () => {
            const targetElement = sections[index];
            if (targetElement) {
                if (window.lenis) {
                    window.lenis.scrollTo(targetElement, { duration: 1.2 });
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        container.appendChild(btn);
    });

    const updateActiveDot = () => {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const viewportCenter = scrollTop + viewportHeight / 2;

        let currentIndex = 0;
        let minDiff = Infinity;
        sectionOffsets.forEach((offset, idx) => {
            const secCenter = offset.top + offset.height / 2;
            const diff = Math.abs(secCenter - viewportCenter);
            if (diff < minDiff) {
                minDiff = diff;
                currentIndex = idx;
            }
        });

        const buttons = container.querySelectorAll('button');
        buttons.forEach((btn, idx) => {
            const dot = btn.querySelector('span');
            if (dot) {
                if (idx === currentIndex) {
                    dot.className = 'h-1.5 w-4 bg-blue-600 rounded-full transition-all duration-300';
                } else {
                    dot.className = 'h-1.5 w-1.5 bg-gray-400/60 group-hover:bg-gray-600/90 rounded-full transition-all duration-300';
                }
            }
        });
    };

    window.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();
}

// EXECUTION
document.addEventListener('DOMContentLoaded', async () => {
    if (window.setLoadingProgress) window.setLoadingProgress(5);
    await loadComponent('header-placeholder', 'include/header.html');
    if (window.setLoadingProgress) window.setLoadingProgress(25);
    await loadComponent('footer-placeholder', 'include/footer.html');
    if (window.setLoadingProgress) window.setLoadingProgress(45);
    initServicesTabs();
    await applyTranslations();
    if (window.setLoadingProgress) window.setLoadingProgress(55);
    await loadArtikel();
    if (window.setLoadingProgress) window.setLoadingProgress(75);
    await loadPortofolio();
    if (window.setLoadingProgress) window.setLoadingProgress(85);
    
    // Initialize Swiper sliders
    if (window.Swiper) {
        // Award Slider
        new Swiper('.blog-slider', {
            spaceBetween: 0,
            effect: 'fade',
            loop: true,
            autoHeight: true,
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

        // Partnership Slider
        new Swiper('.partnership-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            navigation: {
                nextEl: '.partnership-next',
                prevEl: '.partnership-prev',
            },
            pagination: {
                el: '.partnership-swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                }
            }
        });

        // Google Reviews Slider
        new Swiper('.reviews-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            navigation: {
                nextEl: '.reviews-next',
                prevEl: '.reviews-prev',
            },
            pagination: {
                el: '.reviews-swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
                1150: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
    }

    // Initialize Parallax Scroll Stack Effect
    initParallaxScroll();

    // Initialize Floating Page Navigation Indicator
    initPageNavIndicator();

    if (window.setLoadingProgress) window.setLoadingProgress(100);

    // Journal Scroll Navigation
    const jUpBtn = document.getElementById('journal-scroll-up');
    const jDownBtn = document.getElementById('journal-scroll-down');
    const jContainer = document.getElementById('jurnal-list-container');
    if (jUpBtn && jContainer) {
        jUpBtn.onclick = (e) => {
            e.preventDefault();
            jContainer.scrollBy({ top: -180, behavior: 'smooth' });
        };
    }
    if (jDownBtn && jContainer) {
        jDownBtn.onclick = (e) => {
            e.preventDefault();
            jContainer.scrollBy({ top: 180, behavior: 'smooth' });
        };
    }
});
