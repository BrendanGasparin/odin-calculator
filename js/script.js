let currentNum = document.querySelector('input[type="text"]').value || 0;   // the current number in the input
let lastNum = 0;        // the last number entered into the input

let lastOperator = '';  // second-to-last operator used
let currentOperator = '';   // last operator used

let operatorLastPressed = false;    // true if the last input was an operator
let resetNum = false;   // whether or not to reset the number on the next digit keypress

const MAX_INPUT = 16;    // the maximum length of the text field in characters
const DIV_BY_ZERO = 'NO DIV BY ZERO!';

// add two numbers
function add(a, b) {
    a = String(a);
    b = String(b);
    if(a.includes('.') || b.includes('.')) {
        console.log('Calculating magnitude...');
        let magnitude = 0;

        if(a.includes('.')) {
            const idx = a.indexOf('.');
            const length = a.substring(idx, a.length).length - 1;  // minus one to exclude decimal point
            console.log('Length of a is: ' + length);

            if(length > magnitude) magnitude = length;
        }
        if(b.includes('.')) {
            const idx = b.indexOf('.');
            const length = b.substring(idx, b.length).length - 1;  // minus one to exclude decimal point
            console.log('Length of b is: ' + length);

            if(length > magnitude) magnitude = length;
        }

        console.log('Magnitude: ' + magnitude);

        return ((Number(a) * 10 ** magnitude) + (Number(b) * 10 ** magnitude)) / (10 ** magnitude);
    }

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
            lastNum = 0;
            currentOperator = '';
            lastOperator = '';
            operatorLastPressed = false;
            resetNum = true;

            return DIV_BY_ZERO;
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
            if(currentNum !== DIV_BY_ZERO) {
                currentNum = formatNumber(currentNum);
                lastNum = currentNum;
                lastOperator = currentOperator;
                resetNum = true;
                operatorLastPressed = true;
            }
            input.value = currentNum;
        }
    }

    // handle equal button presses
    if (e.target.value === '=') {
        if (lastOperator !== '') {
            currentNum = operate(lastOperator, lastNum, currentNum);
            if(currentNum !== DIV_BY_ZERO) {
                currentNum = formatNumber(currentNum);
                lastNum = currentNum;
                lastOperator = '';
                resetNum = true;
            }
            input.value = currentNum;
        }
    }

    currentNum = input.value;

    if (currentNum === DIV_BY_ZERO) {
        currentNum = 0;
        lastNum = 0;    // Why does this need to be specified? It should have already been set to zero by operate()! :(
    }
}

// reformat the number to a certain number of digits
function formatNumber(num) {
    console.log('Number in: ' + num);
    if(num === DIV_BY_ZERO) return num;

    num = String(num);
    let length = num.length;
    console.log('Length in is: ' + length);

    if(num.includes('.')) {
        const idx = num.indexOf('.');
        const sstring = num.substring(0, idx + 1);
        const nonDecimalLength = sstring.length;
        length -= nonDecimalLength;
    }

    if(num.includes('e')) {
        let index = num.indexOf('e');
        let exp = num.substring(index, num.length);
        length -= exp.length;
    }

    if(num.includes('-')) {
        length--;
    }

    //num = Number(num).toPrecision(length);
    num = Number(num).toFixed(length);
    console.log('Length out is: ' + length);
    console.log('Number out: ' + num);
    return num;
}

// reformat the number in the input window to conform with a calculator's display
function cleanseInput() {
    const input = document.querySelector('input[type="text"]');
    if (input.value === DIV_BY_ZERO) return;
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

function registerButtons(button) {
    button.addEventListener('click', handleButtons);
}

const buttons = [...document.querySelectorAll('input[type="button"]')];

buttons.forEach(registerButtons);

const input = document.querySelector('input[type="text"]');
input.value = currentNum;
input.addEventListener('keydown', keydownCleanse);
input.addEventListener('keyup', cleanseInput);