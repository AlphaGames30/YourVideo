let videos = JSON.parse(localStorage.getItem('mytube_videos')) || [];
let history = [];
let isIncognito = false;

const GITHUB_TOKEN = "GIT_HUB-TOKEN"; // Mets ton token ici
const REPO_NAME = "edonis/mytube"; // Ex: edonis/mytube
const FILE_PATH = "videos.json";

async function autoUploadToGithub() {
    const title = document.getElementById('new-title').value;
    const url = document.getElementById('new-url').value;

    // 1. Récupérer le fichier actuel
    const getRes = await fetch(`https://api.github.com/repos/${REPO_NAME}/contents/${FILE_PATH}`);
    const fileData = await getRes.json();
    const currentVideos = JSON.parse(atob(fileData.content)); // Décode le JSON actuel

    // 2. Ajouter la nouvelle vidéo
    currentVideos.push({
        id: Date.now(),
        title: title,
        url: url,
        likes: 0
    });

    // 3. Renvoyer le fichier mis à jour vers GitHub
    const updateRes = await fetch(`https://api.github.com/repos/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Ajout auto d'une vidéo",
            content: btoa(JSON.stringify(currentVideos, null, 2)), // Encode en Base64
            sha: fileData.sha // Obligatoire pour modifier
        })
    });

    if (updateRes.ok) {
        alert("Vidéo ajoutée ! Render va mettre le site à jour dans 30 secondes.");
        location.reload();
    }
}

function uploadVideo() {
    const url = document.getElementById('video-url').value;
    const title = document.getElementById('video-title').value;

    const newVideo = {
        id: Date.now(),
        url: url,
        title: title,
        likes: 0,
        dislikes: 0,
        subscribers: 0
    };

    videos.push(newVideo);
    localStorage.setItem('mytube_videos', JSON.stringify(videos));
    renderVideos();
}

function renderVideos() {
    const feed = document.getElementById('video-feed');
    feed.innerHTML = '';
    
    videos.forEach(v => {
        feed.innerHTML += `
            <div class="video-card">
                <h4>${v.title}</h4>
                <video src="${v.url}" width="300" controls onplay="addToHistory('${v.title}')"></video>
                <div class="actions">
                    <button onclick="vote(${v.id}, 'like')">👍 ${v.likes}</button>
                    <button onclick="vote(${v.id}, 'dislike')">👎 ${v.dislikes}</button>
                    <button onclick="subscribe(${v.id})">S'abonner</button>
                </div>
            </div>
        `;
    });
}

function addToHistory(title) {
    if (!isIncognito) {
        history.push(title);
        const list = document.getElementById('history-list');
        const item = document.createElement('li');
        item.innerText = title;
        list.appendChild(item);
    }
}

function toggleIncognito() {
    isIncognito = !isIncognito;
    document.getElementById('incognito-status').innerText = isIncognito ? "ON" : "OFF";
    if(isIncognito) alert("Mode navigation privée activé : l'historique est suspendu.");
}

renderVideos();
