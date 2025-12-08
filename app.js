// --- CONFIGURATION ---
const GITHUB_TOKEN = "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"; // <--- METS TON TOKEN LÀ !
const REPO = "AlphaGames30/YourVideo"; 
const FILE_PATH = "videos.json";

// --- ETAT DE L'APPLICATION ---
let currentUser = JSON.parse(localStorage.getItem('mytube_user')) || null;
let subscriptions = JSON.parse(localStorage.getItem('mytube_subs')) || [];
let videos = [];

// Données de test au cas où GitHub ne répond pas tout de suite
const dummyVideos = [
    { id: 1, title: "Minecraft mais je triche !", author: "Alpha_edo", thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", url: "#" },
    { id: 2, title: "Setup Tour 2025", author: "TechGuy", thumb: "https://via.placeholder.com/300x170", url: "#" }
];

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadVideos(); // Essaie de charger GitHub
});

// --- CHARGEMENT DES VIDEOS (GitHub) ---
async function loadVideos() {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`);
        if(response.ok) {
            const data = await response.json();
            // Décoder le contenu Base64 de GitHub
            const content = decodeURIComponent(escape(window.atob(data.content)));
            videos = JSON.parse(content);
        } else {
            console.warn("Fichier GitHub non trouvé, utilisation test.");
            videos = dummyVideos;
        }
    } catch (e) {
        console.error(e);
        videos = dummyVideos;
    }
    renderGrid(videos);
}

// --- AFFICHAGE (Rendu) ---
function renderGrid(list) {
    const grid = document.getElementById('videoGrid');
    grid.innerHTML = ""; // Vider

    if(list.length === 0) {
        grid.innerHTML = "<p>Aucune vidéo trouvée.</p>";
        return;
    }

    list.forEach(v => {
        const isSubbed = subscriptions.includes(v.author);
        const card = document.createElement('div');
        card.className = "video-card";
        card.innerHTML = `
            <img src="${v.thumb || 'https://via.placeholder.com/300x170'}" class="thumbnail">
            <div class="video-info">
                <div class="channel-icon"></div>
                <div class="details">
                    <div class="title">${v.title}</div>
                    <div class="author">${v.author}</div>
                    <button class="sub-btn-small ${isSubbed ? 'subscribed' : ''}" 
                            onclick="toggleSub(event, '${v.author}')">
                        ${isSubbed ? 'ABONNÉ' : "S'ABONNER"}
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- NAVIGATION ---
function loadPage(page) {
    const main = document.getElementById('mainContent');
    const grid = document.getElementById('videoGrid');
    
    // Remettre la grille par défaut
    main.innerHTML = '<div id="videoGrid" class="video-grid"></div>'; 
    
    if (page === 'home') {
        renderGrid(videos);
    } else if (page === 'subs') {
        if(subscriptions.length === 0) {
            document.getElementById('videoGrid').innerHTML = "<p>Abonnez-vous à des chaînes pour voir les vidéos ici.</p>";
        } else {
            const subVideos = videos.filter(v => subscriptions.includes(v.author));
            renderGrid(subVideos);
        }
    } else if (page === 'profile') {
        renderProfile();
    }
}

// --- PROFIL (PHOTO 1) ---
function renderProfile() {
    if (!currentUser) return alert("Connectez-vous pour voir votre chaîne !");

    const main = document.getElementById('mainContent');
    main.innerHTML = `
        <div class="profile-container">
            <div class="banner"></div>
            <div class="profile-header">
                <img src="${currentUser.avatar || 'https://via.placeholder.com/150'}" class="big-avatar">
                <div class="profile-texts">
                    <div class="profile-name">${currentUser.name}</div>
                    <div class="profile-meta">@${currentUser.name.toLowerCase().replace(' ', '_')} • ${currentUser.subCount || 0} abonnés</div>
                    <div class="profile-bio" id="bioDisplay">${currentUser.bio || "Pas de description."}</div>
                    <button class="btn-action" onclick="editBio()">PERSONNALISER LA BIO</button>
                    <button class="btn-action" style="background:#333;">GÉRER LES VIDÉOS</button>
                </div>
            </div>
            <hr style="border-color:#333; margin: 20px 0;">
            <h3>Vidéos</h3>
            <div id="profileGrid" class="video-grid"></div>
        </div>
    `;

    // Afficher les vidéos de l'utilisateur
    const myVideos = videos.filter(v => v.author === currentUser.name);
    const pGrid = document.getElementById('profileGrid');
    
    if(myVideos.length > 0) {
        myVideos.forEach(v => {
            pGrid.innerHTML += `
                <div class="video-card">
                    <img src="${v.thumb}" class="thumbnail">
                    <div class="video-info">
                        <div class="details">
                            <div class="title">${v.title}</div>
                            <div class="author">47 vues • il y a 2 heures</div>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        pGrid.innerHTML = "<p>Aucune vidéo publiée pour le moment.</p>";
    }
}

function editBio() {
    const newBio = prompt("Nouvelle description :");
    if(newBio) {
        currentUser.bio = newBio;
        localStorage.setItem('mytube_user', JSON.stringify(currentUser));
        document.getElementById('bioDisplay').innerText = newBio;
    }
}

// --- ABONNEMENTS ---
function toggleSub(e, author) {
    e.stopPropagation(); // Empêche de cliquer sur la vidéo
    if (subscriptions.includes(author)) {
        subscriptions = subscriptions.filter(s => s !== author);
        e.target.innerText = "S'ABONNER";
        e.target.classList.remove('subscribed');
    } else {
        subscriptions.push(author);
        e.target.innerText = "ABONNÉ";
        e.target.classList.add('subscribed');
    }
    localStorage.setItem('mytube_subs', JSON.stringify(subscriptions));
}

// --- RECHERCHE ---
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = videos.filter(v => v.title.toLowerCase().includes(query));
    
    // Remettre la vue accueil si on est ailleurs
    const main = document.getElementById('mainContent');
    if(!document.getElementById('videoGrid')) {
        main.innerHTML = '<div id="videoGrid" class="video-grid"></div>';
    }
    
    renderGrid(filtered);
}

// --- CONNEXION (SIMULATION) ---
let loginStepNum = 0;

function handleAuthClick() {
    if(currentUser) {
        // Déconnexion
        if(confirm("Se déconnecter ?")) {
            currentUser = null;
            localStorage.removeItem('mytube_user');
            updateAuthUI();
            location.reload();
        }
    } else {
        // Ouvrir modal
        document.getElementById('loginModal').style.display = 'flex';
        loginStepNum = 0;
        document.getElementById('passGroup').style.display = 'none';
        document.getElementById('nameGroup').style.display = 'none';
        document.getElementById('loginNextBtn').innerText = "Suivant";
    }
}

function loginStep() {
    const email = document.getElementById('loginEmail').value;
    if(!email) return alert("Email requis");

    if(loginStepNum === 0) {
        // Etape 1 -> Mot de passe
        document.getElementById('passGroup').style.display = 'block';
        loginStepNum++;
    } else if (loginStepNum === 1) {
        // Etape 2 -> Nom (si nouveau) ou Fin
        const pass = document.getElementById('loginPass').value;
        if(!pass) return alert("Mot de passe requis");
        document.getElementById('nameGroup').style.display = 'block';
        document.getElementById('loginNextBtn').innerText = "Se connecter";
        loginStepNum++;
    } else {
        // Fin -> Connexion réussie
        const name = document.getElementById('loginName').value || "Utilisateur";
        currentUser = { name: name, email: email, avatar: "https://i.pravatar.cc/150", subCount: 0 };
        localStorage.setItem('mytube_user', JSON.stringify(currentUser));
        closeModal('loginModal');
        updateAuthUI();
        alert("Connecté en tant que " + name);
    }
}

function updateAuthUI() {
    const btn = document.getElementById('authBtn');
    if(currentUser) {
        btn.innerHTML = `<span style="background:purple; width:24px; height:24px; border-radius:50%; display:inline-block; text-align:center; line-height:24px; color:white;">${currentUser.name[0]}</span>`;
        btn.style.border = "none";
    } else {
        btn.innerHTML = `👤 <span>Se connecter</span>`;
        btn.style.border = "1px solid #3ea6ff";
    }
}

// --- UPLOAD (+ VIDEO) ---
function openUploadModal() {
    if(!currentUser) return alert("Connectez-vous pour publier !");
    document.getElementById('uploadModal').style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

async function submitVideo() {
    const title = document.getElementById('upTitle').value;
    const url = document.getElementById('upUrl').value;
    const thumb = document.getElementById('upThumb').value;

    if(!title || !url) return alert("Titre et lien obligatoires");

    // Ajouter à la liste locale d'abord (pour effet immédiat)
    const newVid = {
        id: Date.now(),
        title: title,
        url: url,
        thumb: thumb || "https://via.placeholder.com/300x170",
        author: currentUser.name
    };

    // TENTATIVE D'ENVOI SUR GITHUB
    try {
        // 1. Récupérer le fichier actuel (pour avoir le SHA)
        const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`);
        let sha = null;
        let currentList = [];
        
        if(getRes.ok) {
            const data = await getRes.json();
            sha = data.sha;
            const content = decodeURIComponent(escape(window.atob(data.content)));
            currentList = JSON.parse(content);
        }

        // 2. Ajouter la nouvelle vidéo
        currentList.push(newVid);

        // 3. Encoder en Base64 proprement
        const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(currentList, null, 2))));

        // 4. Envoyer (PUT)
        const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Nouvelle vidéo par " + currentUser.name,
                content: newContent,
                sha: sha // Si null, ça créera le fichier
            })
        });

        if(putRes.ok) {
            alert("Vidéo publiée sur le serveur !");
        } else {
            alert("Erreur serveur (Token invalide ?), mais ajouté localement pour cette session.");
        }
    } catch(e) {
        console.error(e);
        alert("Erreur de connexion. Vérifiez votre Token.");
    }

    closeModal('uploadModal');
    loadVideos(); // Recharger
}
