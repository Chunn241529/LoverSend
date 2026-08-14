const audio = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const popupOverlay = document.getElementById('popup-overlay');
const popupBox = document.getElementById('popup-box');
const btnNo = document.getElementById('btn-no');
const heart = document.getElementById('heart');

function toggleMusic() {
    if (audio.paused) {
        audio.play().catch(() => {});
    } else {
        audio.pause();
    }
}

audio.addEventListener('pause', () => {
    playPauseBtn.textContent = '▶';
    playPauseBtn.setAttribute('aria-label', 'Phát nhạc');
});
audio.addEventListener('play', () => {
    playPauseBtn.textContent = '⏸';
    playPauseBtn.setAttribute('aria-label', 'Tạm dừng nhạc');
});

const petalsContainer = document.getElementById('petals-container');
for (let i = 0; i < 28; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = '♥';
    petal.style.setProperty('--size', `${Math.random() * 12 + 9}px`);
    petal.style.setProperty('--drift', `${Math.random() * 80 - 40}px`);
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${Math.random() * 6 + 7}s`;
    petal.style.animationDelay = `${Math.random() * 7}s`;
    petalsContainer.appendChild(petal);
}

function showPopup() {
    popupOverlay.classList.add('show');
    document.getElementById('btn-yes').focus();
}

function closePopup() {
    popupOverlay.classList.remove('show');
    document.getElementById('gift-icon').focus();
}

let noAttempts = 0;
function teaseNoButton() {
    noAttempts++;
    if (noAttempts >= 3 || Math.random() < 0.25) {
        btnNo.textContent = 'Xem thui :3';
        btnNo.style.position = '';
        btnNo.style.left = '';
        btnNo.style.top = '';
        btnNo.onclick = confirmOpenGift;
        btnNo.onpointerenter = null;
        return;
    }

    btnNo.style.position = 'absolute';
    const maxX = Math.max(0, popupBox.clientWidth - btnNo.offsetWidth - 20);
    const minY = Math.min(90, popupBox.clientHeight - btnNo.offsetHeight - 10);
    const maxY = Math.max(minY, popupBox.clientHeight - btnNo.offsetHeight - 10);
    btnNo.style.left = `${10 + Math.random() * maxX}px`;
    btnNo.style.top = `${minY + Math.random() * (maxY - minY)}px`;
}

btnNo.addEventListener('pointerenter', teaseNoButton);
btnNo.addEventListener('click', (event) => {
    event.preventDefault();
    teaseNoButton();
});

function confirmOpenGift() {
    popupOverlay.classList.remove('show');
    audio.play().catch(() => {});

    const coverScreen = document.getElementById('cover-screen');
    coverScreen.style.opacity = '0';
    setTimeout(() => {
        coverScreen.style.display = 'none';
        const mainContent = document.getElementById('main-content');
        mainContent.style.display = 'block';
        requestAnimationFrame(() => {
            mainContent.style.opacity = '1';
            if (!heart.hasChildNodes()) makeHeart();
            heart.classList.add('show');
        });
    }, 1000);
}

function nextSection(button) {
    const next = button.closest('section').nextElementSibling;
    if (next?.tagName === 'SECTION') next.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const words = ['Moce', 'bình yên', 'cùng nhau', 'anh ở đây', 'mỉm cười'];
const points = [];
for (let y = 1.35; y >= -1.25; y -= 0.105) {
    for (let x = -1.45; x <= 1.45; x += 0.105) {
        const value = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3);
        if (value <= 0) {
            points.push({
                x: 50 + x * 31,
                y: 53 - y * 35,
                boost: 1 - Math.min(1, Math.hypot(x, y) / 1.55)
            });
        }
    }
}

function makeHeart() {
    const fragment = document.createDocumentFragment();
    points.forEach((point, index) => {
        const word = document.createElement('span');
        word.className = 'heart-word';
        word.textContent = words[(index + Math.floor(point.x)) % words.length];
        word.style.setProperty('--x', point.x.toFixed(3));
        word.style.setProperty('--y', point.y.toFixed(3));
        word.style.setProperty('--delay', (Math.random() * 900 + point.y * 4).toFixed(0));
        word.style.setProperty('--hue', (220 + Math.random() * 45).toFixed(1));
        word.style.setProperty('--light', `${(50 + point.boost * 34 + Math.random() * 8).toFixed(1)}%`);
        word.style.setProperty('--opacity', (0.56 + point.boost * 0.42).toFixed(2));
        word.style.setProperty('--rot', `${(Math.random() * 10 - 5).toFixed(2)}deg`);
        fragment.appendChild(word);
    });

    const center = document.createElement('div');
    center.className = 'center-text';
    center.textContent = 'Gửi Moce';
    fragment.appendChild(center);
    heart.replaceChildren(fragment);
}

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting));
}, { threshold: 0.2 });
document.querySelectorAll('#main-content section').forEach((section) => sectionObserver.observe(section));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popupOverlay.classList.contains('show')) closePopup();
});
