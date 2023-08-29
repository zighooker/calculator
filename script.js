let numArray = ["0"];
let displayResult = false;
let operator;

// sets up buttons with listeners
const inputButtons = Array.from(document.getElementsByClassName('inputButton'));
inputButtons.forEach(function (i) {
    i.addEventListener('click', () => inputRouting(i.id));
})

// calls appropriate function based on user button press
function inputRouting(userInput) {
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
            default:
                runOperator(userInput);
                break;
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
    updateScreen(modNum);
    // numArray.push(modNum);
    if (numArray.length >= 1) numArray[1] = modNum;
    else numArray[0] = modNum;
    console.log('array after mod ' + numArray);
}

// checks if most recent array entry is number
// if so multiplies by -1
function negative() {
    // if (!isNaN(numArray[numArray.length - 1])) {
        let modNum = numArray.pop();
        modNum = (+modNum * -1).toString();
        numArray.push(modNum);
        updateScreen();
    // }
}

function clear() {
    numArray = ["0"];
    operator = null;
    displayResult = false;
    printOut(`\xa0`)
    updateScreen();
}

function del() {
    // if (!isNaN(numArray[numArray.length - 1])) {
        let modNum = numArray.pop();
        if (modNum.length >= 2) modNum = modNum.slice(0, -1);
        else modNum = "0";
        numArray.push(modNum);
        updateScreen();
    // }
}

function decimal() {
    let modNum = numArray.pop();
    if (!modNum.includes(".")) modNum += ".";
    numArray.push(modNum);
    updateScreen();
}

function runOperator(userInput) {
    if (numArray.length >= 2 || userInput === "eq") {
        runMath();
    } else {
        updateScreen(userInput);
        printOut(numArray[numArray.length - 1] +
        " " + userInput);
    }
    if (userInput !== "eq") operator = userInput;
    if (numArray.length == 1) numArray.push("0");
}


function runMath() {
    console.log('before calc ' + operator + " " + numArray);
    xNum = numArray[numArray.length - 2];
    yNum = numArray[numArray.length - 1];
    if (xNum === undefined || yNum === undefined) {
        updateScreen("ERROR");
        return;
    }
    printOut(yNum + " " + operator + "=");
    let zNum = calculate(xNum, yNum, operator);

    // checks if result is over max length of display
    zNum = parseFloat(zNum.toFixed(8));
    if (zNum.toString().length >= 12) zNum = zNum.toExponential(6);
    zNum = zNum.toString()


    numArray[0] = zNum;
    numArray = numArray.slice(0, 2);
    console.log('after calc ' + numArray);
    // displayResult = true;
    updateScreen(zNum);
    setTimeout(() => {printOut(zNum);}, 250);
}

function calculate(x, y, operator) {
    if (operator === "÷") return +x / +y;
    if (operator === "*") return +x * +y;
    if (operator === "-") return +x - +y;
    if (operator === "+") return +x + +y;
}

const screen = document.getElementById('screen');
function updateScreen(displayText) {
    if (!displayText) screen.innerText = numArray[numArray.length - 1];
    else screen.innerText = displayText;
}

// increments height of receipt paper and adds new p element
const receiptPaper = document.querySelector('.receiptPaper');
function printOut(printText){
    const newLine = document.createElement('p');
    newLine.innerText = printText;
    receiptPaper.appendChild(newLine);
    let receiptHeight = receiptPaper.offsetHeight + 26;
    receiptPaper.setAttribute('style', `height: ${receiptHeight}px`);
};

