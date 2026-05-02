// auth.js - Mengelola login dan sesi pengguna
function checkSession() {
    const user = localStorage.getItem('learning_user');
    if (user) {
        window.userData = JSON.parse(user);
        document.getElementById('login-overlay').style.display = 'none';
        updateUserUI();
        return true;
    }
    return false;
}

async function login(username, password) {
    try {
        const response = await fetch('password.json');
        const data = await response.json();
        const user = data.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('learning_user', JSON.stringify(user));
            window.userData = user;
            document.getElementById('login-overlay').style.display = 'none';
            updateUserUI();
            alert('Selamat datang kembali, ' + user.name + '!');
            return true;
        } else {
            alert('Username atau Password salah!');
            return false;
        }
    } catch (e) {
        console.error(e);
        alert('Gagal memuat data akses.');
    }
}

function logout() {
    localStorage.removeItem('learning_user');
    location.reload();
}

function updateUserUI() {
    const userElements = document.querySelectorAll('.user-name-display');
    userElements.forEach(el => el.innerText = window.userData.name);
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});
