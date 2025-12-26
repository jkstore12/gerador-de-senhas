// Elementos do DOM
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const copyEl = document.getElementById('copy');
const strengthBarEl = document.getElementById('strength-bar');
const strengthTextEl = document.getElementById('strength-text');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Event Listeners
generateEl.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    const password = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    resultEl.innerText = password;
    updateStrengthMeter(password, hasLower, hasUpper, hasNumber, hasSymbol);
});

copyEl.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const password = resultEl.innerText;

    if (!password) { return; }

    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    alert('Senha copiada para a área de transferência!');
});

// Função para gerar a senha
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        return '';
    }

    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }

    const finalPassword = generatedPassword.slice(0, length)
        .split('').sort(() => Math.random() - 0.5).join(''); // Embaralha para mais segurança
    return finalPassword;
}

// --- NOVAS FUNÇÕES ---
function updateStrengthMeter(password, hasLower, hasUpper, hasNumber, hasSymbol) {
    const strength = calculateStrength(password, hasLower, hasUpper, hasNumber, hasSymbol);
    const strengthLabels = ['', 'Fraca', 'Média', 'Forte', 'Muito Forte'];

    strengthBarEl.className = 'strength-bar'; // Reseta a classe
    strengthBarEl.classList.add(`strength-${strength}`);
    strengthTextEl.innerText = strengthLabels[strength];
}

function calculateStrength(password, hasLower, hasUpper, hasNumber, hasSymbol) {
    let score = 0;
    if (!password) return 0;

    // Pontua pela variedade de caracteres
    const typesCount = hasLower + hasUpper + hasNumber + hasSymbol;
    if (typesCount >= 3) score++;
    if (typesCount === 4) score++;

    // Pontua pelo comprimento
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    // Garante que o score não passe de 4
    return Math.min(score, 4);
}
// --- FIM DAS NOVAS FUNÇÕES ---

// Funções geradoras de caracteres aleatórios
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}
