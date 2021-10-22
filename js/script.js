let currentNum = document.querySelector('input[type="text"]').value || 0;
let lastNum = 0;
let lastOperator = '';
let currentOperator = '';
let resetNum = false;   // whether or not to reset the number on the next digit keypress

function add(a, b) {
    return Number(a) + Number(b);
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return (a / b);
}

function operate(operator, num1, num2) {
    if (operator === '+') {
        return add(num1, num2);
    } else if (operator === '-') {
        return subtract(num1, num2);
    } else if (operator === 'x') {
        return multiply(num1, num2);
    } else if (operator === '÷') {
        if (num2 === '0') {
            currentNum = 0;
            lastNum = 0;
            currentOperator = '';
            lastOperator = '';

            return 'NO DIVIDING BY ZERO';
        }
        return divide(num1, num2);
    }

    lastOperator = '';
}

function handleButtons(e) {
    console.log(e.target.value);
    const input = document.querySelector('input[type="text"]');
    if (!isNaN(e.target.value)) {
        if(!resetNum) { // if resetNum is false
            input.value = `${input.value}${e.target.value}`; // concatenate digit to the start of the current number
        } else {
            input.value = e.target.value;   // else make the current digit the current number
            resetNum = false;
        }
        cleanseInput();
    }
    if (e.target.value === '.') {
        input.value = `${input.value}${e.target.value}`;
        cleanseInput();
    }
    if (e.target.value === 'AC') {
        input.value = '0';
        currentNum = 0;
        lastNum = 0;
        currentOperator = '';
        lastOperator = '';
    }
    if (e.target.value === '+' || e.target.value === '-' || e.target.value === 'x' || e.target.value === '÷') {
        if (lastOperator === '') {
            lastOperator = e.target.value;
            lastNum = input.value;
            resetNum = true;
        } else {
            currentOperator = e.target.value;
            currentNum = operate(lastOperator, lastNum, currentNum);
            lastNum = currentNum;
            lastOperator = currentOperator;
            input.value = currentNum;
            resetNum = true;
        }
    }
    if (e.target.value === '=') {
        if (lastOperator !== '') {
            currentNum = operate(lastOperator, lastNum, currentNum);
            lastNum = currentNum;
            lastOperator = '';
            input.value = currentNum;
            resetNum = true;
        }
    }

    currentNum = input.value;
}

function registerButtons(button) {
    button.addEventListener('click', handleButtons);
}

function cleanseInput() {
    const input = document.querySelector('input[type="text"]');
    if (input.value === 'NO DIV ZERO') return;
    if (input.value === '0') return;

    // https://stackoverflow.com/questions/9343751/regex-replacing-multiple-periods-in-floating-number
    input.value = input.value.replace(/[^\d\.]/g, "")
    .replace(/\./, "x")
    .replace(/\./g, "")
    .replace(/x/, ".")
    .replace(/^0+/, '');    // https://masteringjs.io/tutorials/fundamentals/trim-leading-zeros
}

const buttons = [...document.querySelectorAll('input[type="button"]')];

buttons.forEach(registerButtons);

const input = document.querySelector('input[type="text"]');
input.value = currentNum;
input.addEventListener('keyup', cleanseInput);