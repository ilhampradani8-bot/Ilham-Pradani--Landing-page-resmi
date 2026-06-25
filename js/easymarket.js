        // Product Database
        const products = [
            { name: "Alight Motion", variant: "1 Tahun - 1 Pcs", price: 22500, category: "Creative", brand: "alight" },
            { name: "Apple Music", variant: "Head 1 Bulan", price: 21300, category: "Streaming", brand: "apple" },
            { name: "BStation", variant: "1 Bulan Sharing", price: 12500, category: "Streaming", brand: "bstation" },
            { name: "Canva", variant: "1 Bulan Pro (Invite)", price: 6300, category: "Creative", brand: "canva" },
            { name: "Canva", variant: "Lifetime Garansi 1 Tahun", price: 27500, category: "Creative", brand: "canva" },
            { name: "Canva", variant: "Head 1 Bulan", price: 10000, category: "Creative", brand: "canva" },
            { name: "Canva", variant: "Lifetime Garansi 6 Bulan", price: 25000, category: "Creative", brand: "canva" },
            { name: "Canva", variant: "6 Bulan Edu Garansi 3 Bulan", price: 10000, category: "Creative", brand: "canva" },
            { name: "Canva", variant: "1 Tahun Edu Garansi 6 Bulan", price: 18800, category: "Creative", brand: "canva" },
            { name: "Canva", variant: "Head Lifetime", price: 37500, category: "Creative", brand: "canva" },
            { name: "CapCut Private", variant: "30 Days", price: 52500, category: "Creative", brand: "capcut" },
            { name: "ChatGPT", variant: "Head 1 Bulan", price: 26300, category: "Productivity", brand: "chatgpt" },
            { name: "ChatGPT", variant: "Private Plus 1B", price: 50000, category: "Productivity", brand: "chatgpt" },
            { name: "Disney", variant: "1 Bulan Sharing 6 User", price: 43800, category: "Streaming", brand: "disney" },
            { name: "HBO Max Premium", variant: "Sharing Ultimate", price: 32300, category: "Streaming", brand: "hbo" },
            { name: "iQIYI", variant: "1 Bulan Premium", price: 16300, category: "Streaming", brand: "iqiyi" },
            { name: "iQIYI", variant: "3 Bulan Premium", price: 18800, category: "Streaming", brand: "iqiyi" },
            { name: "iQIYI", variant: "12 Bulan Premium", price: 25000, category: "Streaming", brand: "iqiyi" },
            { name: "Kiro AI", variant: "Pro+ - 2000 Credits", price: 37500, category: "Productivity", brand: "kiro" },
            { name: "Lisensi Windows", variant: "Office 2016 Professional Plus", price: 37500, category: "OS & Office", brand: "windows" },
            { name: "Lisensi Windows", variant: "Office 2019 Professional Plus", price: 37500, category: "OS & Office", brand: "windows" },
            { name: "Lisensi Windows", variant: "Office 2021 Professional Plus", price: 37500, category: "OS & Office", brand: "windows" },
            { name: "Lisensi Windows", variant: "Office 365 Random", price: 31300, category: "OS & Office", brand: "windows" },
            { name: "Lisensi Windows", variant: "Windows 10 Pro", price: 37500, category: "OS & Office", brand: "windows" },
            { name: "Lisensi Windows", variant: "Windows 11 Pro", price: 37500, category: "OS & Office", brand: "windows" },
            { name: "Netflix Premium", variant: "1 User 1 Profil", price: 51300, category: "Streaming", brand: "netflix" },
            { name: "Netflix Premium", variant: "1 Day", price: 7500, category: "Streaming", brand: "netflix" },
            { name: "Netflix Premium", variant: "3 Day", price: 10000, category: "Streaming", brand: "netflix" },
            { name: "Netflix Premium", variant: "7 Day", price: 17500, category: "Streaming", brand: "netflix" },
            { name: "Netflix Premium", variant: "2 User 1 Profil", price: 27500, category: "Streaming", brand: "netflix" },
            { name: "Picsart", variant: "Famhead 1 Bulan", price: 15000, category: "Creative", brand: "picsart" },
            { name: "Prime Video", variant: "Private 1 Bulan", price: 10000, category: "Streaming", brand: "prime" },
            { name: "Scribd", variant: "1 Bulan", price: 18800, category: "Productivity", brand: "scribd" },
            { name: "Spotify", variant: "Individual 3 Bulan", price: 23200, category: "Streaming", brand: "spotify" },
            { name: "Vidplat", variant: "All Device 1Pcs", price: 50000, category: "Streaming", brand: "vidplat" },
            { name: "Vidplat", variant: "Mobile Only 1Pcs", price: 40000, category: "Streaming", brand: "vidplat" },
            { name: "Viu Premium", variant: "1 Tahun", price: 12500, category: "Streaming", brand: "viu" },
            { name: "Viu Premium", variant: "Lifetime", price: 18800, category: "Streaming", brand: "viu" },
            { name: "VPN", variant: "Express 1 Bulan", price: 18800, category: "VPN & Security", brand: "vpn" },
            { name: "VPN", variant: "HMA 1 Bulan", price: 18800, category: "VPN & Security", brand: "vpn" },
            { name: "VPN", variant: "Surfshark 3B", price: 50000, category: "VPN & Security", brand: "vpn" },
            { name: "WeTV", variant: "Private", price: 41300, category: "Streaming", brand: "wetv" },
            { name: "WeTV", variant: "WeTV Sharing 1B", price: 15000, category: "Streaming", brand: "wetv" },
            { name: "YouTube", variant: "3 Bulan", price: 43800, category: "Streaming", brand: "youtube" },
            { name: "YouTube", variant: "Famhead", price: 25000, category: "Streaming", brand: "youtube" },
            { name: "YouTube", variant: "Individual 1 Bulan", price: 27500, category: "Streaming", brand: "youtube" },
            { name: "Zoom Pro", variant: "Zoom 14D", price: 10000, category: "Productivity", brand: "zoom" }
        ];

        let activeCategoryFilter = 'All';

        // Brand-specific Logo Badge Generator
        function getBrandLogoBadge(brand, category) {
            let bgColor = 'bg-[#0066cc]';

            switch (brand) {
                case 'netflix':
                    bgColor = 'bg-[#e50914]';
                    break;
                case 'spotify':
                    bgColor = 'bg-[#1db954]';
                    break;
                case 'canva':
                    bgColor = 'bg-[#7d2ae8]';
                    break;
                case 'windows':
                    bgColor = 'bg-[#0078d7]';
                    break;
                case 'apple':
                    bgColor = 'bg-[#fc3c44]';
                    break;
                case 'chatgpt':
                    bgColor = 'bg-[#10a37f]';
                    break;
                case 'youtube':
                    bgColor = 'bg-[#ff0000]';
                    break;
                case 'zoom':
                    bgColor = 'bg-[#2d8cff]';
                    break;
                case 'disney':
                    bgColor = 'bg-[#0063e5]';
                    break;
                case 'hbo':
                    bgColor = 'bg-[#5821a6]';
                    break;
                case 'capcut':
                    bgColor = 'bg-[#1c1c1e]';
                    break;
                case 'bstation':
                    bgColor = 'bg-[#ff69b4]';
                    break;
                case 'iqiyi':
                    bgColor = 'bg-[#00c900]';
                    break;
                case 'viu':
                    bgColor = 'bg-[#ffc107]';
                    break;
                case 'wetv':
                    bgColor = 'bg-[#ff5c00]';
                    break;
                case 'vpn':
                    bgColor = 'bg-[#4b5563]';
                    break;
                case 'alight':
                    bgColor = 'bg-[#00d856]';
                    break;
                default:
                    if (category === 'Streaming') {
                        bgColor = 'bg-[#0066cc]';
                    } else if (category === 'Creative') {
                        bgColor = 'bg-[#a855f7]';
                    } else {
                        bgColor = 'bg-[#64748b]';
                    }
                    break;
            }

            return `
                <div class="w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center shrink-0 select-none p-1.5 shadow-sm">
                    <img src="documents/Logo/easyfastlogotransaparan.webp" alt="Logo" class="w-full h-full object-contain brightness-0 invert">
                </div>
            `;
        }

        // Render List Layout (Brand Logo, Variant details, Price - flat only)
        function renderProducts(filteredList) {
            const container = document.getElementById('product-list-container');
            if (!container) return;
            
            if (filteredList.length === 0) {
                container.innerHTML = `
                    <div class="py-10 text-center text-gray-400 dark:text-gray-500">
                        <i data-lucide="package-x" class="w-10 h-10 mx-auto mb-2 opacity-40"></i>
                        <p class="font-bold text-xs">Produk tidak ditemukan</p>
                    </div>
                `;
                if (window.lucide) lucide.createIcons();
                return;
            }

            container.innerHTML = filteredList.map(prod => {
                const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(prod.price);
                const brandBadge = getBrandLogoBadge(prod.brand, prod.category);
                
                const waText = encodeURIComponent(`Halo Admin EasyMarket, saya ingin memesan:\n\nProduk: ${prod.name}\nVariasi: ${prod.variant}\nHarga: ${formattedPrice}`);
                const clickAction = `onclick="window.open('https://wa.me/6288971071138?text=${waText}', '_blank')"`

                return `
                    <div ${clickAction} class="grid grid-cols-12 gap-2 px-4 py-3.5 items-center product-item cursor-pointer transition">
                        <div class="col-span-8 flex items-center gap-3">
                            ${brandBadge}
                            <div class="space-y-0.5">
                                <div class="font-bold text-sm text-gray-800 dark:text-gray-100">${prod.name}</div>
                                <div class="text-[10px] text-gray-400">${prod.variant}</div>
                            </div>
                        </div>
                        <div class="col-span-4 text-right">
                            <span class="font-extrabold text-sm text-[#0066cc] dark:text-[#38bdf8]">${formattedPrice}</span>
                        </div>
                    </div>
                `;
            }).join('');

            if (window.lucide) lucide.createIcons();
        }

        // Apply Search, Category Filters, Sorting
        window.applyFilters = function() {
            const query = document.getElementById('product-search').value.toLowerCase().trim();
            const sortVal = document.getElementById('sort-select').value;

            let result = [...products];

            if (activeCategoryFilter !== 'All') {
                result = result.filter(p => p.category === activeCategoryFilter);
            }

            if (query !== '') {
                result = result.filter(p => p.name.toLowerCase().includes(query) || p.variant.toLowerCase().includes(query));
            }

            if (sortVal === 'price-asc') {
                result.sort((a, b) => a.price - b.price);
            } else if (sortVal === 'price-desc') {
                result.sort((a, b) => b.price - a.price);
            }

            renderProducts(result);
        };

        // Category click handler
        window.filterCategory = function(cat) {
            activeCategoryFilter = cat;
            
            const buttons = document.querySelectorAll('#category-filters button');
            buttons.forEach(btn => {
                if (btn.getAttribute('data-category') === cat) {
                    btn.className = "category-btn px-4 py-1.5 text-xs font-bold rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:bg-[#38bdf8]/10 dark:text-[#38bdf8] active";
                } else {
                    btn.className = "category-btn px-4 py-1.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-gray-500 dark:text-gray-300";
                }
            });

            applyFilters();
        };

        // Tab Switching Logic
        window.switchTab = function(tabId) {
            const tabs = ['pengenalan', 'produk', 'order', 'sk', 'oss', 'investor'];
            
            tabs.forEach(tab => {
                const content = document.getElementById(`content-${tab}`);
                const btn = document.getElementById(`tab-${tab}`);
                if (content) content.classList.add('hidden');
                if (btn) btn.classList.remove('active');
            });
            
            const activeContent = document.getElementById(`content-${tabId}`);
            const activeBtn = document.getElementById(`tab-${tabId}`);
            if (activeContent) activeContent.classList.remove('hidden');
            if (activeBtn) activeBtn.classList.add('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.switchSKSubTab = function(subTabId) {
            // Hide all S&K sub-tab contents
            const contents = document.querySelectorAll('.sk-sub-content');
            contents.forEach(content => {
                content.classList.add('hidden');
            });

            // Remove active styles from S&K tab buttons
            const tabs = ['deskripsi', 'pembelian', 'refund', 'privasi'];
            tabs.forEach(tab => {
                const btn = document.getElementById(`sk-tab-${tab}`);
                if (btn) {
                    btn.classList.remove('text-[#0066cc]', 'dark:text-[#38bdf8]', 'border-[#0066cc]', 'dark:border-[#38bdf8]');
                    btn.classList.add('text-gray-500', 'dark:text-gray-400', 'border-transparent');
                }
            });

            // Show active content
            const activeContent = document.getElementById(`sk-content-${subTabId.split('-')[1]}`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }

            // Set active button styles
            const activeBtn = document.getElementById(`sk-tab-${subTabId.split('-')[1]}`);
            if (activeBtn) {
                activeBtn.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-transparent');
                activeBtn.classList.add('text-[#0066cc]', 'dark:text-[#38bdf8]', 'border-[#0066cc]', 'dark:border-[#38bdf8]');
            }
        };



        // Initial setup on load
        const initPage = async () => {
            if (window.setLoadingProgress) window.setLoadingProgress(5);
            
            if (window.loadComponent) {
                await loadComponent('header-placeholder', 'include/header.html');
                if (window.setLoadingProgress) window.setLoadingProgress(40);
                await loadComponent('footer-placeholder', 'include/footer.html');
                if (window.setLoadingProgress) window.setLoadingProgress(70);
            }

            const topNav = document.getElementById('top-navbar');
            if (topNav) {
                topNav.style.setProperty('top', '0', 'important');
                topNav.style.setProperty('left', '0', 'important');
                topNav.style.setProperty('right', '0', 'important');
            }
            
            if (window.lucide) lucide.createIcons();

            const searchInput = document.getElementById('product-search');
            if (searchInput) {
                searchInput.addEventListener('input', applyFilters);
            }

            applyFilters();

            // Dark mode state management
            const body = document.body;
            const darkToggle = document.getElementById('dark-mode-toggle');
            const savedTheme = localStorage.getItem('proposal_theme');

            if (savedTheme === 'dark') {
                body.classList.add('dark-mode');
                updateDarkToggleIcon(true);
            }

            function updateDarkToggleIcon(isDark) {
                if (darkToggle) {
                    darkToggle.innerHTML = isDark 
                        ? `<i data-lucide="sun" class="w-4 h-4 text-yellow-400"></i>`
                        : `<i data-lucide="moon" class="w-4 h-4"></i>`;
                    if (window.lucide) lucide.createIcons();
                }
            }

            if (darkToggle) {
                darkToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isDark = body.classList.toggle('dark-mode');
                    localStorage.setItem('proposal_theme', isDark ? 'dark' : 'light');
                    updateDarkToggleIcon(isDark);
                });
            }

            // Language state management
            const langToggle = document.getElementById('lang-toggle');
            let currentLang = localStorage.getItem('preferred_lang') || 'id';

            function updateLanguageUI(lang) {
                currentLang = lang;
                localStorage.setItem('preferred_lang', lang);
                
                document.querySelectorAll('.lang-id').forEach(el => {
                    if (lang === 'id') el.classList.remove('hidden');
                    else el.classList.add('hidden');
                });
                document.querySelectorAll('.lang-en').forEach(el => {
                    if (lang === 'en') el.classList.remove('hidden');
                    else el.classList.add('hidden');
                });
                document.querySelectorAll('.lang-zh').forEach(el => {
                    if (lang === 'zh') el.classList.remove('hidden');
                    else el.classList.add('hidden');
                });

                if (langToggle) {
                    let label = '🇮🇩 Indo';
                    if (lang === 'en') label = '🇬🇧 Eng';
                    if (lang === 'zh') label = '🇨🇳 中文';
                    
                    langToggle.innerHTML = `
                        <i data-lucide="languages" class="w-3.5 h-3.5 text-[#0066cc]"></i>
                        <span>${label}</span>
                    `;
                    if (window.lucide) lucide.createIcons();
                }
            }

            if (langToggle) {
                langToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    let nextLang = 'id';
                    if (currentLang === 'id') nextLang = 'en';
                    else if (currentLang === 'en') nextLang = 'zh';
                    else if (currentLang === 'zh') nextLang = 'id';
                    updateLanguageUI(nextLang);
                });
            }

            updateLanguageUI(currentLang);

            if (window.setLoadingProgress) window.setLoadingProgress(100);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPage);
        } else {
            initPage();
        }
