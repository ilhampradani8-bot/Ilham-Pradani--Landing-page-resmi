/* ============================================================
   BACA PAGE LOGIC
   ============================================================ */

window.toggleSidebar = function(open) {
    const sidebar = document.getElementById('sidebar-nav');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
        if (open) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('opacity-100'), 10);
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.remove('opacity-100');
            setTimeout(() => {
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
    }
};

async function renderFullContent() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.getElementById('content-area');
    const sidebarList = document.getElementById('sidebar-list');

    if (!container) return;

    try {
        const sheetId = '1eD1ElFcjBpVrS8DGShVlPrmuLI1bZIo4QEcxG1kBCAc';
        const res = await fetch(`https://opensheet.elk.sh/${sheetId}/Sheet1`);
        const data = await res.json();

        const getVal = (obj, key) => {
            const foundKey = Object.keys(obj).find(k => k.trim().toLowerCase() === key.toLowerCase());
            return obj[foundKey] || '';
        };

        data.sort((a, b) => parseDate(getVal(b, 'tanggal')) - parseDate(getVal(a, 'tanggal')));

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (sidebarList) {
            sidebarList.innerHTML = data.map(item => {
                const isCurrent = item.id === id;
                const itemDate = parseDate(getVal(item, 'tanggal'));
                const isToday = itemDate.getTime() === now.getTime();
                const activeClass = isCurrent ? 'text-blue-600 font-extrabold border-blue-300 bg-blue-50 shadow-[inset_1.5px_1.5px_3px_#b8bec9,inset_-1.5px_-1.5px_3px_#ffffff]' : 'text-gray-600 hover:text-blue-600 border-transparent bg-[#ecf0f3] shadow-[2px_2px_4px_#b8bec9,-2px_-2px_4px_#ffffff] hover:shadow-[inset_1px_1px_2px_#b8bec9,inset_-1px_-1px_2px_#ffffff]';
                const labelText = getTranslatedLabel('badge_new', 'NEW');
                const label = isToday ? `<span class="px-1.5 py-0.5 bg-red-600 text-white text-[7px] font-black rounded animate-pulse ml-2">${labelText}</span>` : '';

                return `
                    <a href="baca.html?id=${item.id}" class="block p-3 rounded-lg border transition-all text-sm ${activeClass}">
                        <div class="flex justify-between items-start gap-2">
                            <div class="line-clamp-2">${getVal(item, 'judul')}</div>
                            ${label}
                        </div>
                        <div class="text-[9px] font-mono mt-1 text-gray-400 uppercase font-semibold">${getVal(item, 'tanggal')}</div>
                    </a>
                `;
            }).join('');
        }

        const artikel = data.find(item => item.id === id);

        if (artikel) {
            const judul = getVal(artikel, 'judul');
            const konten = getVal(artikel, 'konten');
            const gambar = getVal(artikel, 'gambar');
            const tanggal = getVal(artikel, 'tanggal');
            const kutipan = getVal(artikel, 'kutipan');

            document.title = `${judul} | Dr. Ilham Pradani C.L.`;
            
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', kutipan || judul);

            const updateMeta = (property, content) => {
                let el = document.querySelector(`meta[property="${property}"]`);
                if (!el) {
                    el = document.createElement('meta');
                    el.setAttribute('property', property);
                    document.head.appendChild(el);
                }
                el.setAttribute('content', content);
            };
            updateMeta('og:title', judul);
            updateMeta('og:description', kutipan || judul);
            updateMeta('og:image', gambar);
            updateMeta('og:url', window.location.href);

            let schemaScript = document.getElementById('schema-jsonld');
            if (!schemaScript) {
                schemaScript = document.createElement('script');
                schemaScript.id = 'schema-jsonld';
                schemaScript.type = 'application/ld+json';
                document.head.appendChild(schemaScript);
            }
            const schemaData = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": judul,
                "image": [gambar],
                "datePublished": parseDate(tanggal).toISOString(),
                "author": [{
                    "@type": "Person",
                    "name": "Dr. Ilham Pradani C.L.",
                    "url": "https://www.ilhampradani.me"
                }]
            };
            schemaScript.text = JSON.stringify(schemaData);

            const artikelLain = data.filter(item => item.id !== id).slice(0, 4);
            let bottomRekomendasi = '';

            if (artikelLain.length > 0) {
                bottomRekomendasi = `
                    <div class="mt-24 pt-12 border-t border-gray-200/70">
                        <h3 class="text-gray-900 text-sm font-bold uppercase tracking-widest mb-8">Eksplorasi Jurnal Lainnya</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${artikelLain.map(item => {
                                const itemDate = parseDate(getVal(item, 'tanggal'));
                                const isToday = itemDate.getTime() === now.getTime();
                                const labelText = getTranslatedLabel('badge_new', 'NEW');
                                const label = isToday ? `<span class="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black rounded animate-pulse">${labelText}</span>` : '';
                                return `
                                    <a href="baca.html?id=${item.id}" class="neu-card group p-5 bg-[#ecf0f3] hover:scale-[1.01] transition-all flex flex-col justify-between">
                                        <div class="flex justify-between items-start mb-4 gap-2">
                                            <h4 class="text-gray-900 font-extrabold text-sm group-hover:text-blue-600 transition-colors line-clamp-2">${getVal(item, 'judul')}</h4>
                                            ${label}
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span class="text-[10px] text-gray-500 font-mono uppercase font-semibold">${getVal(item, 'tanggal')}</span>
                                            <i data-lucide="arrow-right" class="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                                        </div>
                                    </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="reveal-el">
                    <div class="px-6 md:px-12 flex items-center justify-between mb-10">
                        <a href="index.html#artikel" class="inline-flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:text-blue-700 transition-colors group">
                            <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i> Kembali
                        </a>
 
                        <div class="flex items-center gap-2 bg-gray-200/50 p-1 rounded-full border border-gray-300/30">
                            <button onclick="setTheme('dark')" id="theme-dark-btn" class="p-2 rounded-full text-gray-500 hover:text-blue-600 transition-all">
                                <i data-lucide="moon" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="setTheme('light')" id="theme-light-btn" class="p-2 rounded-full text-gray-500 hover:text-blue-600 transition-all">
                                <i data-lucide="sun" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
 
                        <button onclick="toggleSidebar(true)" class="inline-flex items-center gap-2 text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors group">
                            Lihat Lainnya <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </div>
                    
                    <div class="relative h-[400px] md:h-[600px] w-full mb-16 full-image overflow-hidden shadow-[4px_4px_12px_#b8bec9,-4px_-4px_12px_#ffffff] border border-white/40 bg-gray-200">
                        <img src="${gambar}" onerror="this.src='https://placehold.co/1200x600/ecf0f3/2563eb?text=No+Image'; this.className='w-full h-full object-cover opacity-30';" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-gray-100/40 via-transparent to-transparent"></div>
                    </div>
 
                    <div class="full-content-padding px-6">
                        <div class="flex items-center gap-4 mb-8 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
                            <span class="px-3 py-1 bg-blue-600 text-white rounded-full font-bold">${tanggal}</span>
                            <span class="hidden md:block">Verified Article • Dr. Ilham Pradani C.L.</span>
                        </div>
 
                        <h1 class="text-4xl md:text-8xl font-black text-gray-900 leading-[1] tracking-tighter mb-16">${judul}</h1>
                        
                        <div class="prose prose-blue max-w-none text-gray-700 leading-relaxed text-xl border-l-4 border-blue-600 pl-8 md:pl-16 mb-24 font-medium">
                            ${konten}
                        </div>
 
                        <!-- ADSTERRA BANNER -->
                        <div id="ad-banner-container" class="my-12 py-10 border-t border-gray-200/50 text-center overflow-hidden">
                            <span class="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-4 block">Halaman ini didukung oleh Iklan</span>
                            <div id="adsterra-banner-unit" class="flex justify-center">
                                <!-- Adsterra Script will be injected here -->
                            </div>
                        </div>
 
                        ${bottomRekomendasi}
                    </div>
                </div>
            `;

            // Inject Adsterra Banner
            const adContainer = document.getElementById('adsterra-banner-unit');
            if (adContainer) {
                const scriptOptions = document.createElement('script');
                scriptOptions.type = 'text/javascript';
                scriptOptions.text = `
                    atOptions = {
                        'key' : '70d4032d0634bd1a04e49f946a536c02',
                        'format' : 'iframe',
                        'height' : 90,
                        'width' : 728,
                        'params' : {}
                    };
                `;
                adContainer.appendChild(scriptOptions);
                const scriptInvoke = document.createElement('script');
                scriptInvoke.type = 'text/javascript';
                scriptInvoke.src = '//www.highperformanceformat.com/70d4032d0634bd1a04e49f946a536c02/invoke.js';
                adContainer.appendChild(scriptInvoke);
            }

            if (window.lucide) lucide.createIcons();
            initScrollAnimations();

        } else {
            container.innerHTML = `<div class="text-center py-24 text-slate-500">Artikel tidak ditemukan.</div>`;
        }
    } catch (e) { console.error("Content Error:", e); }
}

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

// EXECUTION
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-placeholder', 'include/header.html').then(() => {
        applyTranslations();
        updateLangUI();
    });
    loadComponent('footer-placeholder', 'include/footer.html');
    renderFullContent();
});
