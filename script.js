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
        "display": "·",
        "internal": ".",
    },
    "equality": {
        "display": "=",
    },
}

function getSymbolClass(symbol) {
    if (symbol in OPERATORS) {
        return "operator";
    } else if (symbol in CLEAR_SYMS) {
        return "clear";
    } else if (symbol === "equality") {
        return "equality";
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
        [0, "dot", "equality"]
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
    return newButton;
}

emplaceButtons(calcInputPanel);
