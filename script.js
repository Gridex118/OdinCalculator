const OPERATORS = {
    "addition": "+",
    "subtraction": "-",
    "multiplication": "✕",
    "division": "÷",
}

let operatorsReverseMap = Object.keys(OPERATORS)
    .reduce((current, nextOp) => {
        current[OPERATORS[nextOp]] = nextOp;
        return current;
    }, {})

const CLEAR_SYMS = {
    "all_clear": "AC",
    "clear": "C",
}

const SPECIAL_SYMS = {
    "dot": ".",
    "solve": "=",
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
    return allSymbols[symbol]? allSymbols[symbol] : symbol;
}


function emplaceButtons() {
    const calcInputPanel = document.getElementById("calc-input");
    const layout = [
        ["all_clear", "clear", "division"],
        [7, 8, 9, "addition"],
        [4, 5, 6, "subtraction"],
        [1, 2, 3, "multiplication"],
        [0, "dot", "solve"]
    ];
    const width = 0.8 * calcInputPanel.clientWidth / 4;
    const height = 0.8 * calcInputPanel.clientHeight / layout.length;
    layout.forEach(row => emplaceButtonsSingleRow(calcInputPanel, row, width, height));
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
    const symbolClass = getSymbolClass(symbol);
    const newButton = document.createElement("button");
    newButton.innerText = getSymbolDisplay(symbol);
    newButton.style.cssText = `height: ${size}px; width: ${size}px;`;
    newButton.classList.add(symbolClass);
    setButtonClickHandler(newButton, symbol, symbolClass);
    return newButton;
}

function setButtonClickHandler(button, symbol, symbolClass) {
    const calcOperand1 = document.getElementById("operand1");
    const calcOperator = document.getElementById("operator");
    const calcOperand2 = document.getElementById("operand2");
    const calcPrettyOut = document.getElementById("pretty");
    const calcOldExpression = document.getElementById("old-expression");
    if (symbolClass === "number") {
        button.addEventListener("click", () => handleNumberInput(symbol, calcOperand1, calcOperator, calcOperand2));
    } else if (symbolClass === "operator") {
        button.addEventListener("click", () => handleOperatorInput(symbol, calcOperand1, calcOperator, calcOperand2, calcPrettyOut));
    } else if (symbolClass === "clear") {
        button.addEventListener("click", () => handleClear(symbol, calcOperand1, calcOperator, calcOperand2, calcPrettyOut, calcOldExpression));
    } else if (symbolClass === "solve") {
        button.addEventListener("click", () => handleSolve(calcOperand1, calcOperator, calcOperand2, calcPrettyOut));
    }
}

function handleOperatorInput(symbol, xElement, opElement, yElement, prettyElement) {
    // If the second operand has been inserted, use the result of the old
    // expression as the new first operand by telling handleSolve to store
    // output in the xElement instead of the prettyElement
    if (yElement.innerText !== '')
        handleSolve(xElement, opElement, yElement, xElement);
    if (xElement.innerText === '' && prettyElement.innerText !== '') {
        xElement.innerText = prettyElement.innerText;
    }
    // The above does not guarantee that xElement received a value
    if (xElement.innerText !== '') {
        opElement.innerText = getSymbolDisplay(symbol);
    }
}

function handleNumberInput(symbol, xElement, opElement, yElement) {
    let cursorElement = (opElement.innerText === '')? xElement : yElement;
    let isIllegalDotInput = symbol === "dot" && cursorElement.innerText.includes('.');
    if (!isIllegalDotInput)
        cursorElement.innerText += getSymbolDisplay(symbol);
}

function handleClear(symbol, xElement, opElement, yElement, prettyElement, oldElement) {
    if (symbol === "all_clear") {
        [xElement, opElement, yElement, prettyElement, oldElement]
            .forEach((element) => element.innerText = '');
    } else {
        popFromExpression(xElement, opElement, yElement);
    }
}

function handleSolve(xElement, opElement, yElement, prettyElement) {
    let x = parseFloat(xElement.innerText);
    let y = parseFloat(yElement.innerText);
    let operator = operatorsReverseMap[opElement.innerText];
    if (!isNaN(x) && !isNaN(y)) {
        moveToOldExpression(xElement, opElement, yElement);
        performOperation(x, y, operator, prettyElement);
    }
}

function moveToOldExpression(xElement, opElement, yElement) {
    const oldElement = document.getElementById("old-expression");
    oldElement.innerText = `${xElement.innerText} ${opElement.innerText} ${yElement.innerText}<`;
    [xElement, opElement, yElement]
        .forEach(element => element.innerText = '');
}

function popFromExpression(xElement, opElement, yElement) {
    // The expression elements appear in this order; we assume that the
    // right most non empty element is where the cursor's at
    let toPop = [xElement, opElement, yElement]
        .findLast(element => element.innerText !== '');
    toPop.innerText = toPop.innerText.slice(0, -1);
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

emplaceButtons();
