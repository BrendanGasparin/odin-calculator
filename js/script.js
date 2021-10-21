let currentNum = document.querySelector('input[type="text"]').value || 0;

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
    } else if (operator === '*') {
        return multiply(num1, num2);
    } else if (operator === '/') {
        return divide(num1, num2);
    }
}

function handleButtons(e) {
    console.log(e.target.value);
    if (!isNaN(e.target.value)) {
        console.log('Is a number.');
    }
}

function registerButtons(button) {
    console.log('registering button');
    button.addEventListener('click', handleButtons);
}

function textInput() {
    console.log('Calling textInput()');
    const input = document.querySelector('input[type="text"]');
    input.value = input.value.replace(/[^0-9.]/, '');
}

const buttons = [...document.querySelectorAll('input[type="button"]')];

buttons.forEach(registerButtons);

const input = document.querySelector('input[type="text"]');
console.log(input);
input.addEventListener('keyup', textInput);