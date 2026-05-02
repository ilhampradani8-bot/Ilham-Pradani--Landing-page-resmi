// learning.js - Mengelola alur belajar ala Duolingo/Memrise
let allMateri = null;
let currentLesson = null;
let currentStep = 0;
let score = 0;

async function loadMateri() {
    const res = await fetch('materi.json');
    allMateri = await res.json();
    renderMap();
}

function renderMap() {
    const container = document.getElementById('learning-path');
    if (!container) return;
    
    let html = '';
    allMateri.units.forEach((unit, idx) => {
        html += `
            <div class="mb-12">
                <div class="flex items-center gap-4 mb-8">
                    <div class="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                        ${unit.id}
                    </div>
                    <div>
                        <h3 class="text-xl font-black text-slate-900">${unit.title}</h3>
                        <p class="text-slate-500 text-sm">${unit.desc}</p>
                    </div>
                </div>
                <div class="flex flex-col items-center gap-6">
        `;
        
        unit.lessons.forEach((lesson, lIdx) => {
            const isCompleted = isLessonCompleted(lesson.id);
            html += `
                <button onclick="startLesson('${lesson.id}')" 
                    class="relative group w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-xl
                    ${isCompleted ? 'bg-yellow-400 text-white' : 'bg-white border-4 border-slate-100 text-slate-400 hover:border-blue-400'}">
                    <i data-lucide="${lesson.type === 'vocab' ? 'book-open' : 'star'}" class="w-8 h-8"></i>
                    <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">
                        ${lesson.title}
                    </div>
                    ${isCompleted ? '<div class="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full"><i data-lucide="check" class="w-3 h-3"></i></div>' : ''}
                </button>
                ${lIdx < unit.lessons.length - 1 ? '<div class="w-1 h-8 bg-slate-100 rounded-full"></div>' : ''}
            `;
        });
        
        html += `
                </div>
            </div>
            ${idx < allMateri.units.length - 1 ? '<div class="h-16 flex justify-center"><div class="w-1 h-full bg-slate-50 border-x border-slate-100"></div></div>' : ''}
        `;
    });
    
    container.innerHTML = html;
    lucide.createIcons();
}

function isLessonCompleted(id) {
    const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    return completed.includes(id);
}

function startLesson(id) {
    // Cari lesson berdasarkan ID
    let lessonData = null;
    allMateri.units.forEach(u => {
        const found = u.lessons.find(l => l.id === id);
        if (found) lessonData = found;
    });

    if (!lessonData) return;

    currentLesson = lessonData;
    currentStep = 0;
    score = 0;
    
    // Switch UI
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('lesson-view').classList.remove('hidden');
    
    renderStep();
}

function renderStep() {
    const totalSteps = currentLesson.data.length * 2; // 1 teach, 1 quiz per item
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('lesson-progress').style.width = progress + '%';

    const itemIdx = Math.floor(currentStep / 2);
    const isQuiz = currentStep % 2 !== 0;
    const item = currentLesson.data[itemIdx];

    const container = document.getElementById('lesson-content');
    
    if (currentStep >= totalSteps) {
        finishLesson();
        return;
    }

    if (!isQuiz) {
        // Mode Belajar (Teaching)
        container.innerHTML = `
            <div class="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase">Pelajari Kata Ini</div>
                <div class="space-y-2">
                    <h2 class="text-6xl font-black text-slate-900">${item.en}</h2>
                    <p class="text-3xl font-bold text-blue-600">${item.id}</p>
                </div>
                <p class="text-slate-500 text-lg italic max-w-md mx-auto">"${item.desc}"</p>
                <button onclick="speak('${item.en}')" class="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto hover:bg-blue-100 transition-all">
                    <i data-lucide="volume-2" class="w-10 h-10"></i>
                </button>
                <div class="pt-12">
                    <button onclick="nextStep()" class="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest">Lanjut</button>
                </div>
            </div>
        `;
    } else {
        // Mode Kuis (Quiz)
        const options = [item.id, "Opsi Salah 1", "Opsi Salah 2"].sort(() => Math.random() - 0.5);
        container.innerHTML = `
            <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="text-center">
                    <h2 class="text-3xl font-black text-slate-900 mb-2">Apa arti dari "${item.en}"?</h2>
                    <p class="text-slate-500">Pilih jawaban yang benar.</p>
                </div>
                <div class="grid gap-4">
                    ${options.map(opt => `
                        <button onclick="checkAnswer(this, '${opt}', '${item.id}')" 
                            class="p-6 bg-white border-2 border-slate-100 rounded-2xl text-left font-bold text-slate-700 hover:border-blue-400 transition-all">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    lucide.createIcons();
}

function checkAnswer(btn, chosen, correct) {
    const allBtns = btn.parentElement.querySelectorAll('button');
    allBtns.forEach(b => b.disabled = true);

    if (chosen === correct) {
        btn.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
        score++;
        playSimpleSound('correct');
        setTimeout(nextStep, 1000);
    } else {
        btn.classList.add('bg-red-50', 'border-red-500', 'text-red-700');
        // Tunjukkan yang benar
        allBtns.forEach(b => {
            if (b.innerText.trim() === correct) b.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
        });
        playSimpleSound('wrong');
        setTimeout(nextStep, 2000);
    }
}

function nextStep() {
    currentStep++;
    renderStep();
}

function finishLesson() {
    const container = document.getElementById('lesson-content');
    container.innerHTML = `
        <div class="text-center space-y-8">
            <div class="w-32 h-32 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-lucide="trophy" class="w-16 h-16"></i>
            </div>
            <h2 class="text-4xl font-black text-slate-900">Pelajaran Selesai!</h2>
            <p class="text-slate-500">Hebat! Kamu telah menyelesaikan unit ini.</p>
            <div class="flex justify-center gap-8 py-6">
                <div class="text-center">
                    <div class="text-2xl font-black text-blue-600">+50</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase">XP Didapat</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-black text-green-600">100%</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase">Akurasi</div>
                </div>
            </div>
            <button onclick="closeLesson()" class="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest">Kembali ke Beranda</button>
        </div>
    `;
    
    // Simpan progres
    const completed = JSON.parse(localStorage.getItem('completed_lessons') || '[]');
    if (!completed.includes(currentLesson.id)) {
        completed.push(currentLesson.id);
        localStorage.setItem('completed_lessons', JSON.stringify(completed));
    }
    
    lucide.createIcons();
}

function closeLesson() {
    document.getElementById('lesson-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    renderMap();
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

function playSimpleSound(type) {
    // Simulasi suara (karena audio file mungkin tidak ada)
    console.log('Sound played: ' + type);
}

document.addEventListener('DOMContentLoaded', loadMateri);
