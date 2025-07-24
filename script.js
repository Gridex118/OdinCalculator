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
