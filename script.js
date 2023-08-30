let currVal = "0";
let operator = null;
let xOperand = null;
let operandInput = false;
let secondInput = false;
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
                if (resultShown) clear();
                negative();
                break;
            case "decimal":
                if (resultShown) clear();
                decimal();
                break;
            case "del":
                if (resultShown) clear();
                del();
                break;
            case "clear":
                clear();
                break;
            case "eq":
                executeOperator();
                break;
            // all operator inputs are handled here
            default:
                setOperator(userInput);
                break;
        }
    }
}

function numberInput(userInput) {
    // clears if a previous calculation is still showing
    if (resultShown) {
        clear();
        currVal = userInput;
    // switches over to second operand
    } else if (operandInput) {
        currVal = userInput;
        secondInput = true;
        operandInput = false;
    // forbids multiple 0s at start or too many digits for display
    } else if ((userInput === "0" && currVal === "0")
        || currVal.length >= 10) {
            return;
    // replaces default 0 with user input
    } else if (currVal === "0") {
        currVal = userInput;
    // appends user input onto string
    } else {
        currVal += userInput;
    }
    updateScreen();
}

// multiplies current operand by -1
function negative() {
    currVal = (+currVal * -1).toString();
    updateScreen();
}

//  resets all variables and booleans
function clear() {
    currVal = "0";
    xOperand = null;
    operator = null;
    operandInput = false;
    secondInput = false;
    resultShown = false;
    printOut(`\xa0`)
    updateScreen();
}

function del() {
    // lets user delete operator input without affecting operand
    if (operator && !secondInput) {
        operator = null;
        operandInput = false;
        xOperand = null;
        updateScreen();
        return;
    }
    // cuts the last digit off current number
    if (currVal.length >= 2) currVal = currVal.slice(0, -1);
    else currVal = "0";
    updateScreen();
}

function decimal() {
    // lets users start an operand with .
    if (operandInput) {
        currVal = "0.";
        operandInput = false;
    }
    if (resultShown) {
        clear();
        currVal = "0.";
    }
    // forbids more than one . per operand
    if (!currVal.includes(".")) currVal += ".";
    updateScreen();
}

function setOperator(userInput) {
    // lets user change operator
    if (operator && operandInput) {
        operator = userInput;
        updateScreen(`${currVal}${userInput}`);
        return;
    }

    updateScreen(`${currVal}${userInput}`);
    
    // if no operand is set, assigns currVal to xOperand
    if (xOperand === null) {
        xOperand = currVal;
        printOut(xOperand);
    }
    else if (operator) executeOperator();

    // assigns input as operator
    operandInput = true;
    operator = userInput;
}

function executeOperator() {
    if (operator) printOut(`${currVal} ${operator}=`);
    else printOut(`${currVal} =`);

    let resultVal = calculate(xOperand, currVal, operator);

    // shortens result if over max display length
    resultVal = parseFloat(resultVal.toFixed(8));
    if (resultVal.toString().length >= 12) 
        resultVal = resultVal.toExponential(6);

    
    resultVal = resultVal.toString();
    xOperand = resultVal;
    resultShown = true;
    updateScreen(resultVal);
    printOut(resultVal);
}

function calculate(x, y, operator) {
    if (operator === "÷") return +x / +y;
    if (operator === "*") return +x * +y;
    if (operator === "-") return +x - +y;
    if (operator === "+") return +x + +y;
    if (operator === "eq" || !operator) return +y;
}

// updates display text html
const screen = document.getElementById('screen');
function updateScreen(displayText) {
    if (!displayText) screen.innerText = currVal;
    else screen.innerText = displayText;
}

// adds new p element to html and increments height of receipt element
const receiptPaper = document.querySelector('.receiptPaper');
function printOut(printText){
    const newLine = document.createElement('p');
    newLine.innerText = printText;
    receiptPaper.appendChild(newLine);
    let receiptHeight = receiptPaper.offsetHeight + 26;
    receiptPaper.setAttribute('style', `height: ${receiptHeight}px`);
};

// optional keyboard input listeners
window.addEventListener("keydown", function(e) {
    if (e.code === "Backspace") inputRouting("del");
    if (e.code === "KeyC") inputRouting("clear");
    if (e.code === "KeyN") inputRouting("negative");
    if (e.code === "Period") inputRouting("decimal");
    if (e.code === "Enter" || e.code == "Equal") inputRouting("eq");
    if (e.code === "Slash") inputRouting("÷");
    if (e.code === "KeyX") inputRouting("*");
    if ("1234567890*-+".includes(e.key)) inputRouting(e.key);
})
