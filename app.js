let videos = JSON.parse(localStorage.getItem('mytube_videos')) || [];
let history = [];
let isIncognito = false;

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
