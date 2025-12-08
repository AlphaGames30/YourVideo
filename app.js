const GITHUB_TOKEN = "TON_TOKEN"; 
const REPO = "AlphaGames30/YourVideo";

// Détection Admin
const params = new URLSearchParams(window.location.search);
if (params.get('user') === 'edonis') {
    document.querySelectorAll('.admin-panel').forEach(el => el.style.display = 'block');
    document.getElementById('admin-tools').style.display = 'block';
}

// Connexion Simulée
function loginGoogle() {
    const user = prompt("Entrez votre pseudo :");
    if(user) {
        localStorage.setItem('mytube_user', user);
        document.querySelector('.btn-login').innerText = user;
    }
}

// Affichage Vidéos
function renderVideo(v) {
    const grid = document.getElementById('video-grid');
    const card = document.createElement('div');
    card.className = "video-card";
    card.innerHTML = `
        <video src="${v.url}" controls></video>
        <div style="padding:10px;">
            <h4>${v.title}</h4>
            <button onclick="alert('Like ajouté')">👍 Like</button>
            <button onclick="alert('Abonné')">🔔 S'abonner</button>
        </div>
    `;
    grid.appendChild(card);
}

// Fonction Upload GitHub
async function autoUploadToGithub() {
    const title = document.getElementById('new-title').value;
    const url = document.getElementById('new-url').value;
    // ... (Code Token GitHub vu précédemment ici)
}

function toggleIncognito() {
    isIncognito = !isIncognito;
    document.getElementById('incognito-status').innerText = isIncognito ? "ON" : "OFF";
    if(isIncognito) alert("Mode navigation privée activé : l'historique est suspendu.");
}

renderVideos();
