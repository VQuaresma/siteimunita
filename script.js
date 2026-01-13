/**
 * IMUNITTÁ - script.js
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. CARREGAMENTO DE COMPONENTES (Header e Footer)
    carregarHTML('header-placeholder', 'componenteshtml/header.html');
    carregarHTML('footer-placeholder', 'componenteshtml/footer.html');

    // 2. INICIALIZAÇÃO DE ELEMENTOS DINÂMICOS
    updateBannerBackgrounds();
    importarAvaliacoes();
    inicializarExpansaoServicos();

    // 3. LÓGICA DE ROLAGEM SUAVE GLOBAL (Intercepta cliques no Header e Corpo)
    document.addEventListener('click', function (e) {
        // Busca o link (<a>) mais próximo do clique
        const anchor = e.target.closest('a');
        
        // Verifica se é um link interno (contém #)
        if (anchor && anchor.hash && (anchor.pathname === window.location.pathname || anchor.pathname === '/')) {
            const target = document.querySelector(anchor.hash);
            
            if (target) {
                e.preventDefault(); // Cancela o pulo seco do navegador
                
                const headerOffset = 90; // Espaço para o menu fixo não cobrir o título
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Executa a rolagem com suavidade via JS
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Fecha o menu mobile (caso exista essa classe no seu projeto)
                const menu = document.querySelector('.nav-menu');
                if (menu) menu.classList.remove('active');
                
                // Atualiza a URL sem dar o salto (opcional)
                window.history.pushState(null, null, anchor.hash);
            }
        }
    });
});

// --- ROLAGEM AO CARREGAR PÁGINA (Vindo de outro arquivo HTML) ---
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            // Pequeno delay para garantir que o CSS e Header carregaram totalmente
            setTimeout(() => {
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }, 400); 
        }
    }
});

// --- FUNÇÃO PARA COMPONENTES (HEADER/FOOTER) ---
async function carregarHTML(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const res = await fetch(url);
        if (res.ok) {
            el.innerHTML = await res.text();
        }
    } catch (e) { console.error("Erro ao carregar componente:", url); }
}

// --- FUNÇÃO PARA IMPORTAR Depoimentos ---
async function importarAvaliacoes() {
    const destino = document.getElementById('render-reviews');
    if (!destino) return;
    try {
        const response = await fetch('sobre.html');
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const conteudo = doc.getElementById('reviews-container');
        if (conteudo) {
            destino.innerHTML = conteudo.innerHTML;
            setupReviewsCarousel(); 
        }
    } catch (e) { console.error("Erro ao importar avaliações"); }
}

// --- EXPANSÃO DOS CARDS DE SERVIÇO (CONTEÚDO DINÂMICO) ---
function inicializarExpansaoServicos() {
    const botoes = document.querySelectorAll('.btn-expandir');
    const secaoPortal = document.getElementById('secao-detalhe-servico');
    const containerConteudo = document.getElementById('conteudo-dinamico-servico');
    const btnFechar = document.getElementById('btn-fechar-detalhe');

    const informacoes = {
        'vacinas': '<h2>Vacinas</h2><p>Cuidado completo do recém-nascido ao idoso com a segurança Imunittá.</p>',
        'ginecologia': '<h2>Ginecologia</h2><p>Atendimento preventivo e cuidadoso para a saúde da mulher.</p>',
        'obstetricia': '<h2>Obstetrícia</h2><p>Acompanhamento humanizado da gestação ao pós-parto.</p>',
        'ultrassonografia': '<h2>Ultrassonografia</h2><p>Exames de imagem com tecnologia avançada e laudos precisos.</p>',
        'psicologia': '<h2>Psicologia</h2><p>Apoio emocional para todas as idades com profissionais qualificados.</p>',
        'nutricao': '<h2>Nutrição</h2><p>Equilíbrio alimentar para saúde, bem-estar e performance.</p>'
    };

    botoes.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const tipo = this.getAttribute('data-servico');
            if (informacoes[tipo]) {
                containerConteudo.innerHTML = informacoes[tipo];
                secaoPortal.classList.add('ativo');
                
                // Rola suavemente para a seção que acabou de abrir
                const headerOffset = 100;
                const offsetPosition = secaoPortal.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        };
    });

    if (btnFechar) {
        btnFechar.onclick = () => {
            secaoPortal.classList.remove('ativo');
            // Volta para a seção de serviços ao fechar
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        };
    }
}

// --- CARROSSEL DE DEPOIMENTOS ---
function setupReviewsCarousel() {
    const container = document.querySelector('.review-slides-container');
    if (!container) return;
    const slides = document.querySelectorAll('.review-slide-item');
    const next = document.querySelector('.review-nav.next');
    const prev = document.querySelector('.review-nav.prev');
    const indicators = document.querySelectorAll('.review-indicator');

    let idx = 0;
    const visible = window.innerWidth <= 768 ? 1 : 3;
    const max = slides.length - visible;

    const update = () => {
        if (idx > max) idx = 0; 
        if (idx < 0) idx = max;
        container.style.transform = `translateX(-${idx * (100 / visible)}%)`;
        
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === idx));
    };

    if (next) next.onclick = () => { idx++; update(); };
    if (prev) prev.onclick = () => { idx--; update(); };
    indicators.forEach((ind, i) => ind.onclick = () => { idx = i; update(); });
}

// --- BACKGROUNDS DO BANNER ---
function updateBannerBackgrounds() {
    const slides = document.querySelectorAll('.banner-slide');
    const isMobile = window.innerWidth <= 768;
    slides.forEach(s => {
        const img = isMobile ? s.dataset.mobileSrc : s.dataset.desktopSrc;
        if (img) s.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${img}')`;
    });
}