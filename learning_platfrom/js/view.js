const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 'privacy';

        async function loadPage() {
            try {
                // Load Header & Footer
                const header = await fetch('include_learning/header.html').then(r => r.text());
                document.getElementById('header-placeholder').innerHTML = header;
                
                const footer = await fetch('include_learning/footer.html').then(r => r.text());
                document.getElementById('footer-placeholder').innerHTML = footer;

                // Load Content
                const content = await fetch(`include_learning/komponent_footer/${page}.html`).then(r => {
                    if(!r.ok) throw new Error('Halaman tidak ditemukan');
                    return r.text();
                });
                document.getElementById('content-area').innerHTML = content;
                
                lucide.createIcons();
            } catch (e) {
                document.getElementById('content-area').innerHTML = `
                    <div class="text-center py-20">
                        <h1 class="text-6xl font-black mb-4">404</h1>
                        <p class="text-slate-500">${e.message}</p>
                        <a href="index.html" class="inline-block mt-8 text-blue-500 font-bold uppercase tracking-widest">Kembali ke Beranda</a>
                    </div>
                `;
            }
        }
        loadPage();

        function toggleMobileMenu(show) {
            const menu = document.getElementById('mobile-menu');
            if (show) {
                menu.classList.remove('hidden');
                menu.classList.add('flex');
            } else {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
            }
        }