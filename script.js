let currVal = "0";
let operator = null;
let xOperand = null;
let operandInput = false;
let secondInput = false;
let resultShown = false;
let queueNegative = false;

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
    // auto clears if a previous result is still showing
    if (resultShown) {
        clear();
        currVal = userInput;
    // switches over to second operand if operator submitted
    } else if (operandInput) {
        currVal = userInput;
        secondInput = true;
        operandInput = false;
    // forbids multiple 0s at start or too many digits for display
    } else if ((userInput === "0" && currVal === "0")
        || currVal.length >= 10) {
            return;
    // replaces default 0 with first digit
    } else if (currVal === "0") {
        currVal = userInput;
    // appends user input onto string
    } else {
        currVal += userInput;
    }

    // checks if user hit negative button before first digit
    if (queueNegative) {
        negative();
        queueNegative = false;
    }
    updateScreen();
}

function decimal() {
    // lets users start an operand with .
    if (operandInput) {
        currVal = "0.";
        operandInput = false;
    }
    // forbids more than one . per operand
    if (!currVal.includes(".")) currVal += ".";
    updateScreen();
}

function negative() {
    // lets users input negative directly after operator
    if (operandInput) {
        currVal = "0";
        operandInput = false;
    }
    // lets users make a number negative before entering it
    if (currVal === "0") queueNegative = true;
   
    // multiplies current operand by -1
    currVal = (+currVal * -1).toString();
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
    // cuts the last digit off current operand
    if (currVal.length >= 2) currVal = currVal.slice(0, -1);
    else currVal = "0";
    updateScreen();
}

// handles operator input
function setOperator(userInput) {
    // lets user change their mind when inputting operators
    if (operator && operandInput) {
        operator = userInput;
        updateScreen(`${currVal}${userInput}`);
        return;
    }

    // if no operand is set, assigns currVal to xOperand
    if (xOperand === null) {
        xOperand = currVal;
        printOut(xOperand);
        updateScreen(`${currVal}${userInput}`);
    // allows chaining operations
    } else if (resultShown) {
        resultShown = false;
        updateScreen(`${xOperand}${userInput}`);
    } else if (operator) {
        executeOperator();
        resultShown = false;
        updateScreen(`${xOperand}${userInput}`);
    }

    // assigns input as operator
    operandInput = true;
    operator = userInput;
}

function executeOperator() {
    // formatting check for receipt print
    if (operator) printOut(`${currVal} ${operator}=`);
    else printOut(`${currVal} =`);

    let resultVal = calculate(xOperand, currVal, operator);

    // shortens result if over max display length
    resultVal = parseFloat(resultVal.toFixed(8));
    if (resultVal.toString().length >= 12) 
        resultVal = resultVal.toExponential(6);

    xOperand = resultVal.toString();
    resultShown = true;
    updateScreen(xOperand);
    printOut(xOperand);
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

// creates new html elements for receipt print
const receiptPaper = document.querySelector('.receiptPaper');
function printOut(printText){
    const newLine = document.createElement('p');
    newLine.innerText = printText;
    receiptPaper.appendChild(newLine);
    let receiptHeight = receiptPaper.offsetHeight + 26;
    receiptPaper.setAttribute('style', `height: ${receiptHeight}px`);
};

//  resets all variables and booleans
function clear() {
    currVal = "0";
    xOperand = null;
    operator = null;
    operandInput = false;
    secondInput = false;
    resultShown = false;
    queueNegative = false;
    printOut(`\xa0`)
    updateScreen();
}

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
