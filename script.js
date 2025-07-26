const calcInputPanel = document.getElementById("calc-input");


const OPERATORS = {
    "addition": {
        "display": "+",
        "internal": "+",
    },
    "subtraction": {
        "display": "-",
        "internal": "-",
    },
    "multiplication": {
        "display": "✕",
        "internal": "*",
    },
    "division": {
        "display": "÷",
        "internal": "/",
    },
}

let operatorsReverseMap = Object.keys(OPERATORS)
    .reduce((current, nextOp) => {
        current[OPERATORS[nextOp].display] = nextOp;
        return current;
    }, {})

const CLEAR_SYMS = {
    "all_clear": {
        "display": "AC",
    },
    "clear": {
        "display": "C",
    },
}

const SPECIAL_SYMS = {
    "dot": {
        "display": ".",
    },
    "solve": {
        "display": "=",
    },
}

function getSymbolClass(symbol) {
    if (symbol in OPERATORS) {
        return "operator";
    } else if (symbol in CLEAR_SYMS) {
        return "clear";
    } else if (symbol === "solve") {
        return "solve";
    } else {
        // We format the decimal dot as a number
        return "number";
    }
}

function getSymbolDisplay(symbol) {
    const allSymbols = Object.assign({}, OPERATORS, CLEAR_SYMS, SPECIAL_SYMS);
    // Numbers do not appear in allSymbols
    // We leverage this to just return the symbol for numbers, as required
    return allSymbols[symbol]? allSymbols[symbol].display : symbol;
}


function emplaceButtons(canvas) {
    const layout = [
        ["all_clear", "clear", "division"],
        [7, 8, 9, "addition"],
        [4, 5, 6, "subtraction"],
        [1, 2, 3, "multiplication"],
        [0, "dot", "solve"]
    ];
    const width = 0.8 * canvas.clientWidth / 4;
    const height = 0.8 * canvas.clientHeight / layout.length;
    layout.forEach(row => emplaceButtonsSingleRow(canvas, row, width, height));
}

function emplaceButtonsSingleRow(canvas, row, width, height) {
    const newRow = document.createElement("div");
    newRow.classList.add("calc-input-row");
    canvas.appendChild(newRow);
    let size = (width > height)? height : width;
    row.forEach(symbol => {
        newRow.appendChild(createNewCalcButton(symbol, size));
    })
}

function createNewCalcButton(symbol, size) {
    const newButton = document.createElement("button");
    newButton.innerText = getSymbolDisplay(symbol);
    newButton.style.cssText = `height: ${size}px; width: ${size}px;`;
    newButton.classList.add(getSymbolClass(symbol));
    newButton.addEventListener("click", () => buttonPressHandle(symbol));
    return newButton;
}

function buttonPressHandle(symbol) {
    const calcOperand1 = document.getElementById("operand1");
    const calcOperator = document.getElementById("operator");
    const calcOperand2 = document.getElementById("operand2");
    const calcPrettyOut = document.getElementById("pretty");
    const symbolClass = getSymbolClass(symbol);
    if (symbolClass === "number") {
        if (calcOperator.innerText === '') {
            calcOperand1.innerText += getSymbolDisplay(symbol);
        } else {
            calcOperand2.innerText += getSymbolDisplay(symbol);
        }
    } else if (symbolClass === "operator") {
        calcOperator.innerText = getSymbolDisplay(symbol);
    } else if (symbolClass === "solve") {
        let x = parseFloat(calcOperand1.innerText);
        let y = parseFloat(calcOperand2.innerText);
        let operator = operatorsReverseMap[calcOperator.innerText];
        performOperation(x, y, operator, calcPrettyOut);
    }
}

function performOperation(x, y, operation, display) {
    let result;
    switch (operation) {
        case "addition":
            result = x + y;
            break;
        case "subtraction":
            result = x - y;
            break;
        case "multiplication":
            result = x * y;
            break;
        case "division":
            result = x / y;
            break;
    }
    display.innerText = result.toFixed(2);
}

emplaceButtons(calcInputPanel);
