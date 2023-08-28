let firstNumber;
let operator;
let secondNumber;
let result;

function operate(){
    firstNumber = prompt("First number");
    operator = prompt("Type operator");
    secondNumber = prompt("Second number");
    switch (operator) {
        case "+":
            result = +firstNumber + +secondNumber;
            break;
        case "-":
            result = +firstNumber - +secondNumber;
            break;
        case "*":
            result = +firstNumber * +secondNumber;
            break;
        case "/":
            result = +firstNumber / +secondNumber;
            break;
    }
    alert(result);
}
