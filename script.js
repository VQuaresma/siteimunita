// --- Lógica do Carrossel (Troca automática a cada 5 segundos) ---
const slides = document.querySelectorAll('.banner-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.replace('opacity-0', 'opacity-100');
            slide.classList.add('z-20');
            slide.classList.remove('z-10');
            dots[i].classList.replace('bg-opacity-40', 'bg-opacity-100');
            dots[i].classList.replace('w-3', 'w-8');
        } else {
            slide.classList.replace('opacity-100', 'opacity-0');
            slide.classList.add('z-10');
            slide.classList.remove('z-20');
            dots[i].classList.replace('bg-opacity-100', 'bg-opacity-40');
            dots[i].classList.replace('w-8', 'w-3');
        }
    });
}

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 5000);

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { 
        currentSlide = i; 
        showSlide(i); 
    });
});

// --- Banco de Dados dos Serviços ---
const modalData = {
    vacinas: { 
        title: "Nossas Vacinas", 
        icon: "bi-shield-check",
        items: [
            { n: "BCG", d: "Protege contra formas graves da Tuberculose." },
            { n: "Hepatite B", d: "Previne infecções hepáticas crônicas." },
            { n: "Nirsevimabe", d: "Prevenção do VSR em bebês." },
            { n: "Rotavírus", d: "Protege contra diarreias graves." },
            { n: "Tríplice Bacteriana", d: "Difteria, Tétano e Coqueluche." },
            { n: "Poliomielite (VIP)", d: "Protege contra a paralisia infantil." },
            { n: "Pneumocócica", d: "Protege contra Pneumonia e Meningite." },
            { n: "Meningocócica (ACWY/B)", d: "Proteção contra tipos de Meningite." },
            { n: "Influenza (Gripe)", d: "Vacina anual essencial." },
            { n: "Febre Amarela", d: "Importante para áreas de risco." },
            { n: "HPV", d: "Previne cânceres e verrugas genitais." },
            { n: "Herpes Zóster", d: "Prevenção do 'Cobreiro'." },
            { n: "Dengue", d: "Prevenção da doença." },
            { n: "COVID-19", d: "Proteção contra o Coronavírus." },
            { n: "SCR", d: "Sarampo, Caxumba e Rubéola." }
        ]
    },
    ginecologia: { 
        title: "Saúde da Mulher", 
        text: "Oferecemos acompanhamento atencioso e preventivo, incluindo exames de rotina e orientações especializadas para todas as fases da vida.", 
        icon: "bi-heart-pulse" 
    },
    obstetricia: { 
        title: "Gestação e Pré-Natal", 
        text: "Cuidado completo para a mãe e o bebê, desde a concepção até o pós-parto, com monitoramento humanizado e tecnologia de ponta.", 
        icon: "bi-stars" 
    }
};

// --- Funções do Modal ---
window.openModal = function(service) {
    const data = modalData[service];
    const modal = document.getElementById('serviceModal');
    const content = document.getElementById('modalContent');
    const body = document.getElementById('modalBody');

    let innerContent = "";

    if (service === 'vacinas') {
        // Layout especial para Vacinas (Grid)
        innerContent = `
            <div class="text-[#2C5F8D] text-4xl mb-2 text-center"><i class="bi ${data.icon}"></i></div>
            <h2 class="text-2xl font-bold text-[#2C5F8D] mb-4 text-center">${data.title}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar text-left">
                ${data.items.map(item => `
                    <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 class="font-bold text-[#2C5F8D] text-sm">${item.n}</h4>
                        <p class="text-xs text-gray-500 leading-tight">${item.d}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        // Layout Padrão (Usado para Ginecologia e agora também para Obstetrícia)
        innerContent = `
            <div class="text-[#2C5F8D] text-5xl mb-4 text-center"><i class="bi ${data.icon}"></i></div>
            <h2 class="text-2xl font-bold text-[#2C5F8D] mb-4 text-center">${data.title}</h2>
            <p class="text-gray-600 mb-6 leading-relaxed text-center">${data.text}</p>
        `;
    }

    body.innerHTML = `
        ${innerContent}
        <div class="space-y-3">
            <a href="https://wa.me/5594992880636" class="block text-center bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-md">
                Agendar Atendimento
            </a>
            <a href="https://www.google.com/maps/dir//Imunitt%C3%A1+Vacina+e+Sa%C3%BAde,+Esquina+com+-+Avenida+Agenor+Gon%C3%A7alves+de+Paiva+10,+Rua+Itacaiunas,+Bairro+-+Qd+47,+Lt+10+-+Alto+Bonito+II,+Cana%C3%A3+dos+Caraj%C3%A1s+-+PA,+Brasil/data=!4m9!4m8!1m0!1m5!1m1!19sChIJs9_VbTid3ZIR7skgBn0wDcw!2m2!1d-49.844096199999996!2d-6.5234014!3e0" target="_blank" class="block text-center text-[#2C5F8D] text-sm font-semibold hover:underline">
                <i class="bi bi-geo-alt"></i> Traçar rota para a clínica
            </a>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
};

window.closeModal = function() {
    const modal = document.getElementById('serviceModal');
    const content = document.getElementById('modalContent');
    content.classList.replace('scale-100', 'scale-95');
    content.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
};

window.addEventListener('click', (e) => {
    const modal = document.getElementById('serviceModal');
    if (e.target === modal) closeModal();
});

// --- Rolagem Suave ---
const menuLinks = document.querySelectorAll('nav a[href^="#"]');
menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        const targetSection = document.querySelector(id);
        if (targetSection) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});


const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-20', 'translate-y-10');
                entry.target.classList.add('opacity-100', 'translate-y-0');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));