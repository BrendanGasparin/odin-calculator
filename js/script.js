let currentNum = document.querySelector('input[type="text"]').value || 0;
let lastNum = 0;
let lastOperator = '';
let currentOperator = '';
let resetNum = false;

function add(a, b) {
    return a + b;
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
    } else if (operator === '/') {
        return divide(num1, num2);
    }

    lastOperator = '';
}

function handleButtons(e) {
    console.log(e.target.value);
    const input = document.querySelector('input[type="text"]');
    if (!isNaN(e.target.value)) {
        if(!resetNum) {
            input.value = `${input.value}${e.target.value}`;
        } else {
            input.value = e.target.value;
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
        cleanseInput();
    }
    if (e.target.value === '+' || e.target.value === '-' || e.target.value === 'x' || e.target.value === '/') {
        if (lastOperator === '') {
            lastOperator = e.target.value;
            lastNum = input.value;
            resetNum = true;
        } else {
            currentOperator = e.target.value;
            currentNum = operate(lastOperator, lastNum, currentNum);
            lastNum = 0;
            lastOperator = '';
            input.value = currentNum;
        }
    }
    currentNum = input.value;
}

function registerButtons(button) {
    button.addEventListener('click', handleButtons);
}

function cleanseInput() {
    const input = document.querySelector('input[type="text"]');
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