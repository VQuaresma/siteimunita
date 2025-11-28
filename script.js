document.addEventListener('DOMContentLoaded', function () {
    // Lógica do Header:
    const headerUrl = 'componenteshtml/header.html';
    const placeholder = document.getElementById('header-placeholder');
    // ... fetch para o header ...
    fetch(headerUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Header file not found');
            }
            return response.text();
        })
        .then(data => {
            placeholder.innerHTML = data;
        })
        .catch(error => {
            console.error('Erro ao carregar o cabeçalho:', error);
        });
    // Lógica do Footer:
    const footerUrl = 'componenteshtml/footer.html';
    const footerPlaceholder = document.getElementById('footer-placeholder');
    fetch(footerUrl)
        .then(response => response.ok ? response.text() : Promise.reject('Footer file not found'))
        .then(data => { footerPlaceholder.innerHTML = data; })
        .catch(error => { console.error('Erro ao carregar o rodapé:', error); });

    // ... e o resto do seu DOMContentLoaded, incluindo updateBannerBackgrounds();
});


// --- VARIÁVEIS GLOBAIS ---
let currentSlide = 0;
const slides = document.querySelectorAll('.banner-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
const prevButton = document.querySelector('.banner-nav.prev');
const nextButton = document.querySelector('.banner-nav.next');

// --- 1. LÓGICA DO SLIDER ---
function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    currentSlide = (n + totalSlides) % totalSlides;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

function goToSlide(n) {
    showSlide(n);
}

// --- 2. LÓGICA DE IMAGEM RESPONSIVA ---
function updateBannerBackgrounds() {
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const isMobile = window.innerWidth <= 768;

    bannerSlides.forEach(slide => {
        let imageUrl;
        // Prioridade: Imagem Mobile se a tela for pequena
        if (isMobile) {
            imageUrl = slide.getAttribute('data-mobile-src');
        }

        // Se não for mobile ou a imagem mobile não existir, usa a desktop
        if (!imageUrl) {
            imageUrl = slide.getAttribute('data-desktop-src');
        }

        if (imageUrl) {
            slide.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${imageUrl}')`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
        }
    });

    // **IMPORTANTE:** Garante que o slider comece com a imagem correta.
    showSlide(currentSlide);
}

// --- 3. INICIALIZAÇÃO E EVENTOS ---

// Inicialização do Banner (DEVE ser a primeira coisa a rodar no DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    updateBannerBackgrounds();
});

// Ação ao redimensionar a janela
window.addEventListener('resize', updateBannerBackgrounds);

// Auto-play do banner
setInterval(() => {
    changeSlide(1);
}, 5000);

if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => changeSlide(-1));
    nextButton.addEventListener('click', () => changeSlide(1));
}

indicators.forEach(indicator => {
    indicator.addEventListener('click', function () {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        goToSlide(slideIndex);
    });
});

// Smooth scroll para os links internos (Seu código original)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

function setupReviewsCarousel() {
    const slidesContainer = document.querySelector('.review-slides-container');
    const slides = document.querySelectorAll('.review-slide-item');
    const prevButton = document.querySelector('.review-nav.prev');
    const nextButton = document.querySelector('.review-nav.next');
    
    // Configurações do Carrossel:
    const totalSlides = slides.length;
    const slidesPerView = window.innerWidth <= 768 ? 1 : 3; // 1 no mobile, 3 no desktop
    let currentPosition = 0; // Posição atual do carrossel

    function updateCarousel() {
        // Largura total necessária (ex: 3 slides no desktop, cada 33.33%, total 100%)
        const visibleWidth = slidesContainer.parentElement.clientWidth;
        
        // O offset é baseado na largura visível do contêiner
        const offset = -currentPosition * (visibleWidth / slidesPerView);
        
        slidesContainer.style.transform = `translateX(${offset}px)`;
    }

    function move(direction) {
        // Cálculo para limitar o movimento
        const maxPosition = totalSlides - slidesPerView;
        
        currentPosition += direction;

        if (currentPosition < 0) {
            currentPosition = 0; // Não pode ir além do primeiro slide
        } else if (currentPosition > maxPosition) {
            currentPosition = maxPosition; // Não pode ir além do último slide
        }

        updateCarousel();
    }

    // Eventos
    prevButton.addEventListener('click', () => move(-1));
    nextButton.addEventListener('click', () => move(1));
    window.addEventListener('resize', updateCarousel);

    // Inicialização
    updateCarousel();
}



function gtag_report_conversion(url) {
    // 1. DISPARA O PIXEL IMEDIATAMENTE
    gtag('event', 'conversion', {
        'send_to': 'AW-17626641447/igmiCIqO7ccbEKfohNVB',
        'value': 3.0,
        'currency': 'BRL'
    });
    
    // 2. ABRE O LINK EM UMA NOVA ABA/JANELA
    window.open(url, '_blank'); 
    
    // 3. Opcional: Para evitar que a aba atual tente carregar o link também.
    return false;
}