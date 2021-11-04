let currentNum = document.querySelector('input[type="text"]').value || 0;   // the current number in the input
let lastNum = 0;        // the last number entered into the input

let lastOperator = '';  // second-to-last operator used
let currentOperator = '';   // last operator used

let operatorLastPressed = false;    // true if the last input was an operator
let resetNum = false;   // whether or not to reset the number on the next digit keypress

const MAX_INPUT = 16;    // the maximum length of the text field in characters

// add two numbers
function add(a, b) {
    return Number(a) + Number(b);
}

// subtract b from a
function subtract(a, b) {
    return a - b;
}

// get the product of two numbers
function multiply(a, b) {
    return a * b;
}

// divide a by b
function divide(a, b) {
    return (a / b);
}

// perform an operation
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

            return 'NO DIV ZERO';
        }
        return divide(num1, num2);
    }

    lastOperator = '';
}

// handle button input
function handleButtons(e) {
    const input = document.querySelector('input[type="text"]');

    // handle backspace
    if(e.target.value === '⌫') {
        if (input.value === '0') return;
        if (input.value.length === 1 || (input.value.length === 2 && input.value[0] === '-')) {
            input.value = '0';
        } else {
            input.value = input.value.substring(0, input.value.length - 1);
        }
    }

    // handle number presses
    if (!isNaN(e.target.value) && input.value.length < MAX_INPUT) {    // if key is a number and input length is less than 16
        if(!resetNum) { // if resetNum is false
            input.value = `${input.value}${e.target.value}`; // concatenate digit to the start of the current number
        } else {
            input.value = e.target.value;   // else make the current digit the current number
            resetNum = false;
        }
        operatorLastPressed = false;
        cleanseInput();
    }

    // handle decimal button presses
    if (e.target.value === '.' && input.value.length < MAX_INPUT) {
        input.value = `${input.value}${e.target.value}`;
        operatorLastPressed = false;
        cleanseInput();
    }

    // handle clear button presses
    if (e.target.value === 'AC') {
        input.value = '0';
        currentNum = 0;
        lastNum = 0;
        currentOperator = '';
        lastOperator = '';
        operatorLastPressed = false;
    }

    // handle operator presses
    if (e.target.value === '+' || e.target.value === '-' || e.target.value === 'x' || e.target.value === '÷') {
        if (lastOperator === '') {
            lastOperator = e.target.value;
            lastNum = input.value;
            resetNum = true;
            operatorLastPressed = true;
        } else if (operatorLastPressed) {
            lastOperator = e.target.value;
            resetNum = true;
        } else {
            currentOperator = e.target.value;
            currentNum = operate(lastOperator, lastNum, currentNum);
            currentNum = formatNumber(currentNum);
            lastNum = currentNum;
            lastOperator = currentOperator;
            input.value = currentNum;
            resetNum = true;
            operatorLastPressed = true;
        }
    }

    // handle equal button presses
    if (e.target.value === '=') {
        if (lastOperator !== '') {
            currentNum = operate(lastOperator, lastNum, currentNum);
            currentNum = formatNumber(currentNum);
            lastNum = currentNum;
            lastOperator = '';
            input.value = currentNum;
            resetNum = true;
        }
    }

    currentNum = input.value;
}

// reformat the number to a certain number of digits
function formatNumber(num) {
    num = String(num);
    console.log(num);
    let length = num.length;

    if(num.includes('.')) {
        length--;
    }

    if(num.includes('e')) {
        let index = num.indexOf('e');
        let exp = num.substring(index, num.length);
        length -= exp.length;
    }

    if(num.includes('-')) {
        length--;
    }

    num = Number(num).toPrecision(length);
    return num;
}

function registerButtons(button) {
    button.addEventListener('click', handleButtons);
}

// reformat the number in the input window to conform with a calculator's display
function cleanseInput() {
    const input = document.querySelector('input[type="text"]');
    if (input.value === 'NO DIV ZERO') return;
    if (input.value === '0') return;
    if (input.value === '00') {
        input.value = '0';
        return;
    }

    // https://stackoverflow.com/questions/9343751/regex-replacing-multiple-periods-in-floating-number
    input.value = input.value.replace(/[^\d\.]/g, "")
    .replace(/\./, "x")
    .replace(/\./g, "")
    .replace(/x/, ".")

    .replace(/^0+/, '');    // https://masteringjs.io/tutorials/fundamentals/trim-leading-zeros

    if(input.value[0] === '.') {
        input.value = `0${input.value}`;
    }
}

// block key input if the input field is full
function keydownCleanse(e) {
    if(input.value.length >= 16) {
        e.preventDefault();
    }
}

const buttons = [...document.querySelectorAll('input[type="button"]')];

buttons.forEach(registerButtons);

const input = document.querySelector('input[type="text"]');
input.value = currentNum;
input.addEventListener('keydown', keydownCleanse);
input.addEventListener('keyup', cleanseInput);