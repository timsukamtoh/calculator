let num1,num2;
const screen = document.querySelector('#screen');
const operatorList = ['+', '-', '*', '/'];
let currentOperator;
let hasOperator;
let inputLock=true;

const numbuttons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const decimalButton = document.querySelector('#decimal');
const equalButton = document.querySelector('#equal');
const clearButton = document.querySelector('#clear');
const delButton = document.querySelector('#delete');
const allButtons = document.querySelectorAll('button');

allButtons.forEach(btn => {
    btn.addEventListener('click', ()=> btn.classList.add('clicked'));
    btn.addEventListener('transitionend',removeTransition);
});
numbuttons.forEach((numButton) => {
    numButton.addEventListener('click', () => inputNumber(numButton.textContent))
});
operatorButtons.forEach((operButton)=>{
    operButton.addEventListener('click', ()=> assignOperator(operButton.textContent));
})

decimalButton.addEventListener('click', inputDecimal)
equalButton.addEventListener('click', ()=> evaluate(num1,screen.textContent.slice(1)));  //evaluate sliced 1 char over in case first char is '-'
clearButton.addEventListener('click',clear)
delButton.addEventListener('click', deleteInput)
window.addEventListener('keydown', (e)=>{
    inputKeys(e);
})

function add(num1,num2){
    return num1+num2;
}
function subtract(num1,num2) {
    return num1-num2;
}
function multiply(num1,num2){
    return num1*num2;
}
function divide(num1,num2){
    if(num2==0){
        return 'L O L';
    }
    return Math.round((num1/num2) * 100) / 100;
}

function operate(operator,num1,num2){
    if(operator=='+') return add(num1,num2);
    if(operator=='-') return subtract(num1,num2);
    if(operator=='*') return multiply(num1,num2);
    return divide(num1,num2);
}

function inputNumber(num){
    if(inputLock){
        screen.textContent += num;
    } else {
        screen.textContent = num;
        inputLock=true;
    }
}

function assignOperator(operator) {
    if(!hasOperator){   //if already has an operator, will replace it
        if(screen.textContent==""){
            screen.textContent=0;
            num1=0;
        } else {num1=parseFloat(screen.textContent);}
        currentOperator = operator;
        screen.textContent += currentOperator;
        hasOperator = true;
    } else {
        evaluate(num1,screen.textContent.slice(1));
        num1=screen.textContent;
        screen.textContent += operator;
        hasOperator=true;
    }
    inputLock=true;
    decimalButton.disabled=false;
}

function evaluate(num1,string) {
    let strArr = string.split('');
    let operatorIndex = strArr.findIndex(char => operatorList.includes(char));
    currentOperator = strArr[operatorIndex];
    num2 = parseFloat(string.substring(operatorIndex+1,string.length));
    hasOperator = false;
    inputLock=false;
    decimalButton.disabled=false;
    screen.textContent = operate(currentOperator,num1,num2);
}

function inputDecimal (){
    if(inputLock){
        screen.textContent += decimalButton.textContent;
    } else {
        screen.textContent = decimalButton.textContent;
        inputLock=true;
    }
    decimalButton.disabled=true;
}

function clear(){
    screen.textContent='';
    num1,num2,currentOperator = '';
    inputLock=true;
    hasOperator=false;
    decimalButton.disabled=false;
}

function deleteInput(){
    let last = screen.textContent.slice(-1);
    if(operatorList.some(oper => oper==last)){
        hasOperator=false;
    }
    if(last=='.'){
        decimalButton.disabled=false;
    }
    screen.textContent = screen.textContent.slice(0,-1);
}

function removeTransition(e) { //remove button click effect
    if(e.propertyName !== 'transform') return;
    this.classList.remove('clicked');
};

function inputKeys(e){
    if (e.key >= 0 && e.key <= 9) {
        inputNumber(e.key);
    }
    if (operatorList.some(oper => oper==e.key)){
        assignOperator(e.key);
    }
    if (e.key === '=' || e.key === 'Enter') {
        evaluate(num1,screen.textContent.slice(1));
    }
    if (e.key === '.') inputDecimal();
    if (e.key === 'Backspace') deleteInput();
    if (e.key === 'Escape') clear();
}