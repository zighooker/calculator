let operator = null;
let numArray = ["0"];
let displayResult = false;

const inputButtons = Array.from(document.getElementsByClassName('inputButton'));
inputButtons.forEach(function (i) {
    i.addEventListener('click', () => inputRouting(i.id));
})

function inputRouting(userInput) {
    // if (!numSwitch) inputProcess(userInput, xNum);
    // else inputProcess(userInput, yNum);
    if (!isNaN(userInput)) numberInput(userInput);
    else {
        switch (userInput) {
            case "negative":
                negative();
                break;
            case "clear":
                clear();
                break;
            case "del":
                del();
                break;
            case "decimal":
                decimal();
                break;
            case "equals":
                operate();
                break;
            default:
                operator = userInput;
                updateScreen(operator);
                printOut(numArray[numArray.length - 1] +
                    " " + operator);
                numArray.push("0");
        }
    }
}

function numberInput(userInput) {
    if (displayResult) clear();
    let modNum = numArray.pop();
    // won't accept input if multiple 0s or too long for display
    if ((userInput === "0" && modNum === "0")
            || modNum.length >= 12) {
        numArray.push(modNum);
        return;
    }
    // replaces 0 if first digit of number
    if (modNum === "0") modNum = userInput;
    else modNum += userInput;
    numArray.push(modNum);
    updateScreen();
}

function negative() {
    let modNum = numArray.pop();
    modNum = (+modNum * -1).toString();
    numArray.push(modNum);
    updateScreen();
}

function clear() {
    numArray = ["0"];
    operator = null;
    displayResult = false;
    printOut(`\xa0`)
    updateScreen();
}

function del() {
    let modNum = numArray.pop();
    if (modNum.length >= 2) modNum = modNum.slice(0, -1);
    else modNum = "0";
    numArray.push(modNum);
    updateScreen();
}

function decimal() {
    let modNum = numArray.pop();
    if (!modNum.includes(".")) modNum += ".";
    numArray.push(modNum);
    updateScreen();
}

function operate() {
    xNum = numArray[numArray.length - 2];
    yNum = numArray[numArray.length - 1];
    printOut(yNum + " =");
    if (xNum === undefined || yNum === undefined 
            || operator === null) {
        updateScreen("ERROR");
        return;
    }
    let zNum;
    switch (operator) {
        case "÷":
            zNum = +xNum / +yNum;
            break;
        case "*":
            zNum = +xNum * +yNum;
            break;
        case "-":
            zNum = +xNum - +yNum;
            break;
        case "+":
            zNum = +xNum + +yNum;
            break;
    }
    if (zNum.length >= 12) zNum = parseFloat(zNum).toFixed(12);
    zNum = zNum.toString();
    numArray.splice(-1, 0, zNum);
    displayResult = true;
    updateScreen(zNum);
    setTimeout(() => {printOut(zNum);}, 250);
}

const screen = document.getElementById('screen');
function updateScreen(displayText) {
    if (!displayText) screen.innerText = numArray[numArray.length - 1];
    else screen.innerText = displayText;
}

const receiptPaper = document.querySelector('.receiptPaper');
function printOut(printText){
    const newLine = document.createElement('p');
    newLine.innerText = printText;
    receiptPaper.appendChild(newLine);
    let receiptHeight = receiptPaper.offsetHeight + 26;
    receiptPaper.setAttribute('style', `height: ${receiptHeight}px`);
};

