const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes confettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
}

@keyframes pulse-card {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 40px rgba(59, 240, 255, 0.18); }
  50% { box-shadow: 0 0 80px rgba(59, 240, 255, 0.3); }
}

@keyframes confettiExplode {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
`;
document.head.appendChild(styleSheet);

const PASSWORD_VALUE = '19/1/2026';
const passwordScreen = document.querySelector('.password-screen');
const passwordForm = document.querySelector('#password-form');
const passwordInput = document.querySelector('#password-input');
const passwordFeedback = document.querySelector('.password-feedback');

function showMainContent() {
    if (passwordScreen) passwordScreen.classList.add('hidden');
    document.body.classList.remove('password-locked');
    // Allow scrolling/interactions again
    unlockScroll();
    if (passwordInput) passwordInput.value = '';
    if (passwordFeedback) passwordFeedback.textContent = '';
}

function lockPage() {
    document.body.classList.add('password-locked');
    if (passwordScreen) passwordScreen.classList.remove('hidden');
    // Prevent scrolling/interactions while locked
    lockScroll();
    passwordInput?.focus();
}

// --- Scroll lock helpers to fully block scrolling before unlock ---
let _scrollLocked = false;
function _preventDefault(e) { e.preventDefault(); }
function _preventKeyScroll(e) {
    // keys: Space, PageUp, PageDown, End, Home, Left, Up, Right, Down
    const blocked = [32, 33, 34, 35, 36, 37, 38, 39, 40];
    if (blocked.includes(e.keyCode)) {
        e.preventDefault();
    }
}

function lockScroll() {
    if (_scrollLocked) return;
    _scrollLocked = true;
    document.addEventListener('wheel', _preventDefault, { passive: false });
    document.addEventListener('touchmove', _preventDefault, { passive: false });
    document.addEventListener('keydown', _preventKeyScroll, { passive: false });
}

function unlockScroll() {
    if (!_scrollLocked) return;
    _scrollLocked = false;
    document.removeEventListener('wheel', _preventDefault, { passive: false });
    document.removeEventListener('touchmove', _preventDefault, { passive: false });
    document.removeEventListener('keydown', _preventKeyScroll, { passive: false });
}

function initializePage() {
    setTimeout(() => { createConfetti(100); }, 650);

    const card = document.querySelector('.birthday-card');
    if (card) {
        card.style.animation = 'glow 3s infinite';
    }

    document.querySelector('.surprise-btn')?.addEventListener('click', triggerSurprise);
}

function handlePasswordSubmit(event) {
    event.preventDefault();
    const value = passwordInput?.value.trim().toLowerCase() || '';

    if (value === PASSWORD_VALUE) {
        showMainContent();
        initializePage();
    } else {
        if (passwordFeedback) passwordFeedback.textContent = 'كلمة المرور غير صحيحة. حاولي تاني.';
        passwordInput?.classList.add('input-error');
        setTimeout(() => {
            passwordInput?.classList.remove('input-error');
        }, 700);
    }
}

passwordForm?.addEventListener('submit', handlePasswordSubmit);

function createConfetti(amount = 120) {
    const container = document.querySelector('.confetti-container');
    const colors = ['#3bf0ff', '#ff4df0', '#8c5dff', '#f1d94c', '#70e0ff', '#ff92f7'];

    for (let i = 0; i < amount; i += 1) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const size = 6 + Math.random() * 10;
        const left = Math.random() * 100;
        const duration = 2.2 + Math.random() * 2.6;
        const delay = Math.random() * 0.9;
        const rotation = Math.random() * 360;
        const color = colors[Math.floor(Math.random() * colors.length)];

        confetti.style.left = `${left}%`;
        confetti.style.top = '-10px';
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.background = color;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.position = 'fixed';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '6';
        confetti.style.opacity = '0';
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.filter = 'drop-shadow(0 0 16px rgba(255,255,255,0.2))';
        confetti.style.animation = `confettiFall ${duration}s ${delay}s cubic-bezier(0.72, 0.01, 0.25, 1) forwards`;

        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), (duration + delay) * 1000 + 1200);
    }
}

function createBurst(x, y) {
    const container = document.querySelector('.confetti-container');
    const colors = ['#3bf0ff', '#ff4df0', '#8c5dff', '#f1d94c'];

    for (let i = 0; i < 20; i += 1) {
        const spark = document.createElement('div');
        spark.className = 'confetti';
        const size = 4 + Math.random() * 6;
        const angle = (Math.PI * 2 * i) / 20;
        const force = 80 + Math.random() * 30;
        const tx = Math.cos(angle) * force;
        const ty = Math.sin(angle) * force;

        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.background = colors[Math.floor(Math.random() * colors.length)];
        spark.style.borderRadius = '50%';
        spark.style.position = 'fixed';
        spark.style.pointerEvents = 'none';
        spark.style.zIndex = '7';
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        spark.style.animation = 'confettiExplode 0.75s ease-out forwards';
        spark.style.filter = 'drop-shadow(0 0 18px rgba(255,255,255,0.22))';

        container.appendChild(spark);
        setTimeout(() => spark.remove(), 900);
    }
}

function triggerSurprise(event) {
    createConfetti(140);

    const btn = event?.currentTarget || document.querySelector('.surprise-btn');
    if (btn) {
        btn.style.animation = 'pulse-card 0.45s';
        btn.addEventListener('animationend', () => { btn.style.animation = ''; }, { once: true });
    }

    const card = document.querySelector('.birthday-card');
    if (card) {
        card.style.animation = 'pulse-card 0.55s';
        card.addEventListener('animationend', () => { card.style.animation = 'glow 3s infinite'; }, { once: true });
    }

    if (navigator.vibrate) {
        navigator.vibrate([120, 80, 120]);
    }

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(640, audioContext.currentTime + 0.14);
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.16);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.18);
    } catch (error) {
        console.warn('Web Audio غير مدعوم في هذا المتصفح');
    }

    setTimeout(() => {
        alert('🎉كل سنه وانتي طيبه يا قمورتي رنا يحفظك و يباركلي فيكي و ميحرمنيش منك ابدا و يارب يارب يارب اشوفك انجح و اسعد واحده ف الدنيا كلها عشان انتي كداا كدا اشطر واحده ف الدنيا كلها بس عايزين نعلي ع نفسنا بقا و عقبال ما اشوفك اسعد واحده ف الدنيا كلها و هتبقي إن شاء الله اسعد واحده على ايدي بإذن الله والله يا نور عيني ربنا يباركلي فيكي و يحفظك من كل شر و يبعدك عن اي مخلوق يتمنالك الشر واللهى كل سنه وانتي طيبه يا حياتي يارب و عقبال مليون سنه يا نور عيني🎂✨');
    }, 300);
}

window.addEventListener('load', () => {
    if (isUnlocked()) {
        showMainContent();
        initializePage();
    } else {
        lockPage();
    }
});

const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.style.animation = 'fadeInLeft 0.8s ease-out';
            } else {
                entry.target.style.animation = 'slideUp 0.9s ease-out';
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item, .wish-card, .gallery-item').forEach((el) => {
    el.style.opacity = '0';
    observer.observe(el);
});

document.querySelectorAll('.wish-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
        card.style.boxShadow = '0 30px 70px rgba(59, 240, 255, 0.18)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 18px 50px rgba(59, 240, 255, 0.1)';
    });
});

document.querySelectorAll('.gallery-image').forEach((image) => {
    image.addEventListener('click', function () {
        this.style.animation = 'zoomIn 0.3s ease-out';
        const rect = this.getBoundingClientRect();
        createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
});

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (scrolled > 100) {
        navbar.style.boxShadow = '0 0 40px rgba(59, 240, 255, 0.16)';
        navbar.style.background = 'rgba(5, 10, 25, 0.95)';
    } else {
        navbar.style.boxShadow = '0 0 24px rgba(59, 240, 255, 0.08)';
        navbar.style.background = 'rgba(5, 10, 25, 0.78)';
    }
});

function typeMessage() {
    const messageEl = document.querySelector('.main-message');
    if (!messageEl) return;
    const text = messageEl.textContent || '';
    messageEl.textContent = '';
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            messageEl.textContent += text[index];
            index += 1;
        } else {
            clearInterval(typeInterval);
        }
    }, 30);
}

const messageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.typed) {
            entry.target.dataset.typed = 'true';
            typeMessage();
            messageObserver.unobserve(entry.target);
        }
    });
});

const messageCard = document.querySelector('.message-card');
if (messageCard) {
    messageObserver.observe(messageCard);
}
