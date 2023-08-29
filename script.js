let currVal = "0";
let operator = null;
let xOperand = null;
let operandInput = false;
let resultShown = false;

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
                setOperator(userInput);
                break;
        }
    }
}

function numberInput(userInput) {
    if (resultShown) {
        clear();
        currVal = userInput;
    } else if (operandInput) {
        currVal = userInput;
        operandInput = false;
    } else if ((userInput === "0" && currVal === "0")
        || currVal.length >= 12) {
            return;
    } else if (currVal === "0") {
        currVal = userInput;
    } else {
        currVal += userInput;
    }
    updateScreen();
}

// checks if most recent array entry is number
// if so multiplies by -1
function negative() {
    currVal = (+currVal * -1).toString();
    updateScreen();
}

function clear() {
    currVal = "0";
    xOperand = null;
    operator = null;
    operandInput = false;
    resultShown = false;
    printOut(`\xa0`)
    updateScreen();
}

function del() {
    if (currVal.length >= 2) currVal = currVal.slice(0, -1);
    else currVal = "0";
    updateScreen();
}

function decimal() {
    if (operandInput) {
        currVal = "0.";
        operandInput = false;
    }
    if (resultShown) {
        clear();
        currVal = "0.";
    }
    if (!currVal.includes(".")) currVal += ".";
    updateScreen();
}

function setOperator(userInput) {
    if (operator && operandInput && userInput !== "eq") {
        operator = userInput;
        updateScreen(userInput);
        return;
    }

    // if (userInput !== "=") 
    updateScreen(userInput);
    // printOut(`${currVal} ${userInput}`);
    
    if (xOperand === null) xOperand = currVal;
    else if (operator) executeOperator();

    operandInput = true;
    if (userInput !== "eq") operator = userInput;
}

function executeOperator() {
    printOut(`${currVal} ${operator}=`);
    let resultVal = calculate(xOperand, currVal, operator);

    // checks if result is over max length of display
    resultVal = parseFloat(resultVal.toFixed(8));
    if (resultVal.toString().length >= 12) 
        resultVal = resultVal.toExponential(6);
    resultVal = resultVal.toString()

    xOperand = resultVal;
    resultShown = true;
    updateScreen(resultVal);
    setTimeout(() => {printOut(resultVal);}, 250);
}

function calculate(x, y, operator) {
    if (operator === "÷") return +x / +y;
    if (operator === "*") return +x * +y;
    if (operator === "-") return +x - +y;
    if (operator === "+") return +x + +y;
    if (operator === "eq") return +y;
}

const screen = document.getElementById('screen');
function updateScreen(displayText) {
    if (!displayText) screen.innerText = currVal;
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

