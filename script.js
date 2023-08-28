let xNum = "0";
let yNum = "0";
let zNum = "0";
let numSwitch = false;
let operator;
let result; 

const inputButtons = Array.from(document.getElementsByClassName('inputButton'));
inputButtons.forEach(function (i) {
    i.addEventListener('click', () => inputRouting(i.id));
});
const screen = document.getElementById('screen');
const receiptPaper = document.querySelector('.receiptPaper');

function inputRouting(userInput) {
    if (!numSwitch) inputProcess(userInput, xNum);
    else inputProcess(userInput, yNum);
};

function inputProcess(userInput, currNum) {
    if (userInput == 0 && currNum == 0) return;
    if (!isNaN(userInput)) {
        if (!zNum === "0") clear();
        if (currNum === "0") currNum = userInput; 
        else currNum += userInput;
    }
    switch (userInput) {
        case "negative":
            currNum = (+currNum * -1).toString();
            break;
        // case "delete":
        //     if (!numSwitch) xNum.slice(0, -1);
        //     else yNum.slice(0, -1);
        //     break;
        case "clear":
            currNum = "0";
            clear();
            break;
        case "decimal":
            if (!currNum.includes(".")) currNum += ".";
            break;
    }
    if (!numSwitch) {
        xNum = currNum
        screen.innerText = xNum;
    } else {
        yNum = currNum
        screen.innerText = yNum;
    };
    switch (userInput) {
        case "÷":
        case "x":
        case "-":
        case "+":
            operator = userInput;
            numSwitch = !numSwitch;
            screen.innerText = operator;
            break;
        case "equals":
            operate();
    }
}

function clear() {
    xNum = "0";
    yNum = "0";
    zNum = "0";
    operator = "";
}

function operate() {
    switch (operator) {
        case "÷":
            zNum = +xNum / +yNum;
            break;
        case "x":
            zNum = +xNum * +yNum;
            break;
        case "-":
            zNum = +xNum - +yNum;
            break;
        case "+":
            zNum = +xNum + +yNum;
            break;
    }
    numSwitch = !numSwitch;
    if (zNum.length >= 12) zNum = parseFloat(zNum).toFixed(12);
    zNum = zNum.toString();
    xNum = zNum;
    screen.innerText = zNum;
    printOut(yNum);
}


function printOut(printText){
    const newLine = document.createElement('p');
    newLine.innerText = printText;
    receiptPaper.appendChild(newLine);
    let receiptHeight = receiptPaper.offsetHeight + 26;
    receiptPaper.setAttribute('style', `height: ${receiptHeight}px`);
}
