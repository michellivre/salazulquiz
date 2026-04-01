// QUIZ CLONE - TRUQUE DO SAL AZUL
const state = {
    step: 1,
    quiz1: {},
    quiz2: {},
    currentQuiz2Step: 1,
    userName: 'Maria' // Default
};

// Global audio context for performance
let audioCtx = null;

function playClick() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Resume if suspended (common in browsers)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        console.log('Audio error:', e);
    }
}




const QUIZ1_DATA = {
    1: {
        title: "Quantos quilos você deseja perder com a receita do Sal Azul?",
        options: [
            { text: "Até 5 kg", emoji: "🎯" },
            { text: "6 a 10 kg", emoji: "💪" },
            { text: "11 a 15 kg", emoji: "🔥" },
            { text: "16 a 20 kg", emoji: "⚡" },
            { text: "Mais de 20 kg", emoji: "🚀" }
        ]
    },
    2: {
        title: "Você tem corpo de homem ou de mulher?",
        options: [
            { text: "Homem", emoji: "👨" },
            { text: "Mulher", emoji: "👩" }
        ]
    },
    3: {
        title: "Qual é a sua idade?",
        options: [
            { text: "Menos de 25", emoji: "👧" },
            { text: "25 a 34", emoji: "👩" },
            { text: "35 a 44", emoji: "👩‍💼" },
            { text: "45 a 54", emoji: "🧕" },
            { text: "55+", emoji: "👵" }
        ]
    },
    4: {
        title: "Como você classificaria seu corpo hoje?",
        options: [
            { text: "Gordura Localizada (Pouco acima)", emoji: "🎯" },
            { text: "Flácida (Pouca firmeza)", emoji: "🪞" },
            { text: "Sobrepeso (Gordura visível)", emoji: "⚖️" }
        ]
    },
    5: {
        title: "Em qual área do seu corpo você gostaria de reduzir mais gordura?",
        options: [
            { text: "Barriga", emoji: "🔥" },
            { text: "Busto", emoji: "👚" },
            { text: "Pernas", emoji: "👖" },
            { text: "Braços", emoji: "🦾" }
        ]
    }
};

const QUIZ2_DATA = {
    1: { type: 'slider', title: "Qual é o seu peso atual? (kg)", min: 40, max: 150, unit: 'kg', subtitle: "Baseado nisso, ajustaremos a dosagem ideal para o seu metabolismo {gender}!" },
    2: { type: 'slider', title: "Qual é a sua altura? (cm)", min: 140, max: 210, unit: 'cm', subtitle: "Usaremos sua altura para calcular seu IMC e personalizar o protocolo." },
    3: { type: 'slider', title: "Qual é o seu objetivo de peso? (kg)", min: 40, max: 150, unit: 'kg', subtitle: "Baseado nisso, ajustaremos a dosagem ideal para o seu corpo!" },

    4: { 
        type: 'select', 
        title: "Como o seu peso impacta sua vida hoje?",
        options: [
            { text: "Evito tirar fotos por vergonha", emoji: "📸" },
            { text: "Meu parceiro não me olha mais com desejo", emoji: "💔" },
            { text: "Me sinto menos confiante", emoji: "😔" },
            { text: "Evito situações sociais", emoji: "🏠" },
            { text: "Afeta minha energia e disposição", emoji: "😴" }
        ]
    },
    5: { 
        type: 'select', 
        title: "Você está satisfeita com sua aparência?",
        options: [
            { text: "Não, me sinto acima do peso", emoji: "😢" },
            { text: "Mais ou menos", emoji: "😐" },
            { text: "Não, quero mudar meu corpo", emoji: "🚀" }
        ]
    },
    6: { 
        type: 'select', 
        title: "O que mais te impede de emagrecer hoje?",
        options: [
            { text: "Falta de tempo", emoji: "⏰" },
            { text: "Falta de autocontrole", emoji: "🍕" },
            { text: "Já tentei de tudo", emoji: "😤" },
            { text: "Hormônios", emoji: "🌙" }
        ]
    },
    7: { 
        type: 'select', 
        title: "Quantos litros de água você bebe por dia?",
        options: [
            { text: "Pouco café/água", emoji: "☕" },
            { text: "Até 2 litros", emoji: "💧" },
            { text: "Mais de 3 litros", emoji: "🌊" }
        ]
    },
    8: { 
        type: 'select', 
        title: "Quantas horas de sono você tem por noite?",
        options: [
            { text: "Menos de 5h", emoji: "😵" },
            { text: "Entre 5h e 7h", emoji: "😐" },
            { text: "Mais de 7h", emoji: "😴" }
        ]
    },
    9: { 
        type: 'select', 
        title: "Como é a sua rotina hoje?",
        options: [
            { text: "Trabalho muito e corrido", emoji: "💼" },
            { text: "Trabalho sentada", emoji: "🪑" },
            { text: "Cuido da casa", emoji: "🏠" }
        ]
    },
    10: { 
        type: 'select', 
        title: "Qual é o corpo que você quer conquistar?",
        options: [
            { text: "Em forma", emoji: "🏃‍♀️" },
            { text: "Tonificada", emoji: "🏋️‍♀️" },
            { text: "Sem barriga", emoji: "👙" }
        ]
    },
    11: { type: 'input', title: "Qual é o seu nome?", placeholder: "Digite seu nome" }
};

const STORAGE_KEY = 'sal_azul_quiz_state';

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
        return true;
    }
    return false;
}

// Initial state
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isFinishTrigger = urlParams.get('finish') === 'true';

    if (isFinishTrigger && loadState()) {
        // Skip directly to final processing
        showProcessingAndFinish();
    } else {
        updateProgress(1, 5);
        renderQuiz1Step(1);
    }
});

function updateProgress(step, total) {
    const percent = Math.round((step / total) * 100);
    const stepTxt = document.getElementById('stepText');
    const percentTxt = document.getElementById('percentText');
    const bar = document.getElementById('progressBar');
    
    if (stepTxt) stepTxt.innerText = `Etapa ${step} de ${total}`;
    if (percentTxt) percentTxt.innerText = `${percent}%`;
    if (bar) bar.style.width = `${percent}%`;
}

function renderQuiz1Step(stepNum) {
    const data = QUIZ1_DATA[stepNum];
    if (!data) return;

    const titleEl = document.getElementById('qTitle');
    if (titleEl) titleEl.innerText = data.title;

    const optionsContainer = document.getElementById('qOptions');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    data.options.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.innerHTML = `
            <div class="emoji-circle">${opt.emoji}</div>
            <div class="option-text">${opt.text}</div>
            <div class="selection-circle"></div>
        `;
        card.onclick = () => {
            playClick();
            selectOption(card);
            setTimeout(() => {
                nextQuiz1Step(stepNum, opt.text);
            }, 300);
        };
        optionsContainer.appendChild(card);
    });
}

function selectOption(card) {
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
}

function nextQuiz1Step(currentStep, answer) {
    state.quiz1[currentStep] = answer;
    saveState(); // PERSIST STATE
    
    if (currentStep < 5) {
        state.step++;
        updateProgress(state.step, 5);
        renderQuiz1Step(state.step);
    } else {
        goToQuiz2();
    }
}

function startAnalysis() {
    showStep('loader-step');
    document.getElementById('progressSection').style.visibility = 'hidden';
    
    let progress = 0;
    const bar = document.getElementById('loaderBarInner');
    const percentTxt = document.getElementById('loaderPercent');
    const tasks = [
        document.getElementById('task-1'),
        document.getElementById('task-2'),
        document.getElementById('task-3')
    ];

    const interval = setInterval(() => {
        progress += 1;
        bar.style.width = progress + '%';
        percentTxt.innerText = progress + '%';

        // Update tasks based on progress
        if (progress === 5) {
            tasks[0].classList.add('active');
        } else if (progress === 35) {
            tasks[0].classList.remove('active');
            tasks[0].classList.add('completed');
            tasks[0].querySelector('.icon').innerText = '✅';
            tasks[1].classList.add('active');
        } else if (progress === 65) {
            tasks[1].classList.remove('active');
            tasks[1].classList.add('completed');
            tasks[1].querySelector('.icon').innerText = '✅';
            tasks[2].classList.add('active');
        } else if (progress === 95) {
            tasks[2].classList.remove('active');
            tasks[2].classList.add('completed');
            tasks[2].querySelector('.icon').innerText = '✅';
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showStep('analysis');
            }, 500);
        }
    }, 40); // Total ~4 seconds
}

function loadVSL() {
    const container = document.getElementById('vslContainer');
    if (!container || container.innerHTML.trim() !== '<!-- O VIDEO SERÁ CARREGADO AQUI DINAMICAMENTE -->') return;

    // Inserir tag do player
    container.innerHTML = '<vturb-smartplayer id="ab-69cda19d27faeae80a046ccc" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>';

    // Inserir script do player
    const s = document.createElement("script");
    s.src = "https://scripts.converteai.net/98515d9f-9be7-468e-b2ab-5ca1ebe9d56c/ab-test/69cda19d27faeae80a046ccc/player.js";
    s.async = true;
    document.head.appendChild(s);
}

function showStep(id) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    // Carregar VSL apenas se for o passo de análise
    if (id === 'analysis') {
        loadVSL();
    }
    
    // Add class to body for page-specific styling
    document.body.className = `step-${id}-active`;
    
    window.scrollTo(0, 0);
}

function goToQuiz2() {
    state.currentQuiz2Step = 1;
    showStep('quiz2');
    document.getElementById('progressSection').style.visibility = 'visible';
    updateProgress(1, 11);
    renderQuiz2Step(1);
}

function renderQuiz2Step(stepNum) {
    const data = QUIZ2_DATA[stepNum];
    document.getElementById('q2Title').innerText = data.title;
    const container = document.getElementById('q2Container');
    const nextBtn = document.getElementById('q2NextBtn');
    container.innerHTML = '';
    updateProgress(stepNum, 11);

    if (data.type === 'slider') {
        const valDisp = document.createElement('h2');
        valDisp.innerText = `${data.min} ${data.unit}`;
        valDisp.style.textAlign = 'center';
        valDisp.style.fontSize = '32px';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = data.min;
        
        // Logical Rule: Goal weight (step 3) cannot be higher than current weight (step 1)
        if (stepNum === 3 && state.quiz2[1]) {
            slider.max = state.quiz2[1];
        } else {
            slider.max = data.max;
        }

        slider.value = (parseFloat(slider.max) + parseFloat(slider.min)) / 2;
        valDisp.innerText = `${slider.value} ${data.unit}`;
        
        slider.oninput = (e) => {
            valDisp.innerText = `${e.target.value} ${data.unit}`;
        }
        
        container.appendChild(valDisp);
        container.appendChild(slider);

        if (data.subtitle) {
            const sub = document.createElement('p');
            sub.className = 'quiz-subtitle';
            const genderText = state.quiz1[2] === 'Homem' ? 'masculino' : 'feminino';
            sub.innerText = data.subtitle.replace('{gender}', genderText);
            container.appendChild(sub);
        }
        
        nextBtn.style.display = 'block';
        nextBtn.onclick = () => {
            playClick();
            nextQuiz2Step(stepNum, slider.value);
        };
    } else if (data.type === 'select') {
        nextBtn.style.display = 'none';
        data.options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `
                <div class="emoji-circle">${opt.emoji}</div>
                <div class="option-text">${opt.text}</div>
                <div class="selection-circle"></div>
            `;
            card.onclick = () => {
                playClick();
                selectOption(card);
                setTimeout(() => nextQuiz2Step(stepNum, opt.text), 300);
            };
            container.appendChild(card);
        });
    } else if (data.type === 'input') {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = data.placeholder;
        input.className = 'option-card';
        input.style.width = '100%';
        input.style.textAlign = 'center';
        input.style.fontSize = '20px';
        container.appendChild(input);
        
        nextBtn.style.display = 'block';
        nextBtn.onclick = () => {
            if (input.value.trim().length < 2) return alert("Digite seu nome");
            playClick();
            state.userName = input.value;
            nextQuiz2Step(stepNum, input.value);
        };
    }
}

function nextQuiz2Step(currentStep, answer) {
    state.quiz2[currentStep] = answer;
    saveState(); // PERSIST STATE
    
    if (state.currentQuiz2Step < 11) {
        state.currentQuiz2Step++;
        
        // Small transition effect
        const container = document.getElementById('q2Container');
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            renderQuiz2Step(state.currentQuiz2Step);
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 200);
    } else {
        startAnalysis();
    }
}

function showProcessingAndFinish() {
    showStep('processing');
    document.getElementById('progressSection').style.visibility = 'hidden';
    
    // Personalization
    const name = state.userName || 'Você';
    document.getElementById('procName').innerText = name;
    
    const gender = state.quiz1[2] === 'Homem' ? 'homens' : 'mulheres';
    document.getElementById('pGenderTask').innerText = `Identificando padrões hormonais comuns em ${gender}...`;

    // Image rotation
    const images = [
        'before-after.webp',
        'testimonial_1_transformation_1774726119464.webp',
        'testimonial_2_transformation_1774726155484.webp',
        'testimonial_3_transformation_1774726170330.webp',
        'testimonial_4_transformation_1774726206584.webp',
        'testimonial_5_transformation_1774726249229.webp'
    ];
    let currentImgIdx = 0;
    const rotatingImg = document.getElementById('rotatingImage');

    let progress = 0;
    const bar = document.getElementById('pBarInner');
    const percentTxt = document.getElementById('pPercent');
    const tasks = [
        document.getElementById('p-task-1'),
        document.getElementById('p-task-2'),
        document.getElementById('p-task-3'),
        document.getElementById('p-task-4')
    ];

    const interval = setInterval(() => {
        progress += 1;
        bar.style.width = progress + '%';
        percentTxt.innerText = progress + '% concluído';

        // Rotate image every 800ms
        if (progress % 16 === 0 && currentImgIdx < images.length - 1) {
            currentImgIdx++;
            rotatingImg.style.opacity = '0';
            setTimeout(() => {
                rotatingImg.src = images[currentImgIdx];
                rotatingImg.style.opacity = '1';
            }, 100);
        }

        // Update tasks based on progress
        if (progress === 5) {
            tasks[0].classList.add('active');
        } else if (progress === 25) {
            tasks[0].classList.remove('active');
            tasks[0].classList.add('completed');
            tasks[0].querySelector('.p-icon').innerText = '✓';
            tasks[1].classList.add('active');
        } else if (progress === 50) {
            tasks[1].classList.remove('active');
            tasks[1].classList.add('completed');
            tasks[1].querySelector('.p-icon').innerText = '✓';
            tasks[2].classList.add('active');
        } else if (progress === 75) {
            tasks[2].classList.remove('active');
            tasks[2].classList.add('completed');
            tasks[2].querySelector('.p-icon').innerText = '✓';
            tasks[3].classList.add('active');
        } else if (progress === 98) {
            tasks[3].classList.remove('active');
            tasks[3].classList.add('completed');
            tasks[3].querySelector('.p-icon').innerText = '✓';
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showOffer();
            }, 800);
        }
    }, 50); // Total ~5 seconds
}

function showOffer() {
    showStep('offer');
    document.getElementById('progressSection').style.visibility = 'hidden';
    document.getElementById('userName').innerText = state.userName;
    document.getElementById('resWeight').innerText = state.quiz1[1];
    document.getElementById('resFocus').innerText = state.quiz1[5];
}
