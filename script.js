/**
 * IMUNITTÁ - script.js (Versão Hero Video + Tailwind)
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. CARREGAMENTO DE COMPONENTES
    // Se você não estiver usando arquivos separados para header/footer, pode remover essas linhas
    carregarHTML('header-placeholder', 'componenteshtml/header.html');
    carregarHTML('footer-placeholder', 'componenteshtml/footer.html');

    // 2. INICIALIZAÇÃO
    importarAvaliacoes();
    inicializarExpansaoServicos();
    configurarScrollSuave();

    // 3. RECARREGAR VÍDEO DO INSTAGRAM (Caso necessário em redimensionamento)
    window.addEventListener('resize', () => {
        // Otimização: evita que o vídeo quebre em mudanças bruscas de tela
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    });
});

/**
 * CONFIGURAÇÃO DE ROLAGEM SUAVE
 * Ajustado para compensar a altura do Header fixo do Tailwind
 */
function configurarScrollSuave() {
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a');
        
        if (anchor && anchor.hash && (anchor.pathname === window.location.pathname || anchor.pathname === '/')) {
            const target = document.querySelector(anchor.hash);
            
            if (target) {
                e.preventDefault();
                
                // Altura do seu header fixo (ajuste se mudar o tamanho do menu)
                const headerOffset = 80; 
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Fecha menu mobile se houver
                const menu = document.querySelector('.nav-menu');
                if (menu) menu.classList.remove('active');
                
                window.history.pushState(null, null, anchor.hash);
            }
        }
    });
}

// --- ROLAGEM AO CARREGAR PÁGINA (Vindo de links externos) ---
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }, 400); 
        }
    }
});

// --- FUNÇÃO PARA COMPONENTES ---
async function carregarHTML(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const res = await fetch(url);
        if (res.ok) {
            el.innerHTML = await res.text();
            // Re-processa embeds caso o header/footer tenha algo do tipo
            if (window.instgrm) window.instgrm.Embeds.process();
        }
    } catch (e) { console.error("Erro ao carregar componente:", url); }
}

// --- EXPANSÃO DOS CARDS DE SERVIÇO ---
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
                
                const headerOffset = 100;
                const offsetPosition = secaoPortal.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        };
    });

    if (btnFechar) {
        btnFechar.onclick = () => {
            secaoPortal.classList.remove('ativo');
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        };
    }
}

// --- IMPORTAR AVALIAÇÕES E SETUP CARROSSEL ---
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

function setupReviewsCarousel() {
    const container = document.querySelector('.review-slides-container');
    if (!container) return;
    const slides = document.querySelectorAll('.review-slide-item');
    const next = document.querySelector('.review-nav.next');
    const prev = document.querySelector('.review-nav.prev');
    const indicators = document.querySelectorAll('.review-indicator');

    let idx = 0;
    const update = () => {
        const visible = window.innerWidth <= 768 ? 1 : 3;
        const max = slides.length - visible;
        if (idx > max) idx = 0; 
        if (idx < 0) idx = max;
        container.style.transform = `translateX(-${idx * (100 / visible)}%)`;
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === idx));
    };

    if (next) next.onclick = () => { idx++; update(); };
    if (prev) prev.onclick = () => { idx--; update(); };
    indicators.forEach((ind, i) => ind.onclick = () => { idx = i; update(); });
}