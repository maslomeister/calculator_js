import {
  isCurrentValueNotNull,
  getEquation,
  reverseSign,
  calculatePercent,
  computeEquation,
  appendNumberToCurrentValue,
  addCurrentValueToEquation,
  resetEquation,
  addOrReplaceLatestOperatorInEquation,
  clearCurrentValue,
  clearCurrentEquation,
} from "./calculator.js";

import { isOperator, createColoredNode } from "./utils.js";

const calculatorControls = document.querySelector(".calculator-controls");
const percentButton = document.querySelector("[data-percent]");
const equalsButton = document.querySelector("[data-result]");
const reverseSignButton = document.querySelector("[data-reverse-sign]");
const clearAllButton = document.querySelector("[data-clear-all]");
const historyDisplayElem = document.querySelector(
  ".calculator-display-history-wrapper"
);
const currDisplayElem = document.querySelector(
  ".calculator-display-current-value"
);

const currEquationDisplayElem = document.querySelector(
  ".calculator-display-current-equation"
);

const clearDisplay = () => {
  if (isCurrentValueNotNull()) {
    updateCurrentDisplayValue(clearCurrentValue());
  } else {
    updateCurrentDisplayEquation(clearCurrentEquation());
    updateCurrentDisplayValue("");
    resetDisplayHistory();
  }
};

const displayPercentage = () => {
  if (currDisplayElem.textContent && isCurrentValueNotNull()) {
    updateCurrentDisplayValue(calculatePercent());
  }
};

const displayNumber = (value) => {
  updateCurrentDisplayValue(appendNumberToCurrentValue(value));
};

const displayOperator = (value) => {
  updateCurrentDisplayValue(addCurrentValueToEquation());

  updateCurrentDisplayEquation(addOrReplaceLatestOperatorInEquation(value));

  updateCurrentDisplayValue(computeEquation(), true);
};

const displayEquals = () => {
  if (currDisplayElem.textContent) {
    let resultArray = getEquation();

    if (resultArray.length === 0) return;

    if (!isCurrentValueNotNull() && resultArray.length <= 2) return;

    updateCurrentDisplayValue(addCurrentValueToEquation());
    resultArray = getEquation();

    const result = computeEquation();

    resultArray.push("=", result, ";");
    addToDisplayHistory(resultArray);

    updateCurrentDisplayEquation(resetEquation());
  }
};

calculatorControls.addEventListener("click", function (e) {
  if (e.target.closest("[data-number]")) {
    displayNumber(e.target.closest("[data-number]").textContent);
  }
  if (e.target.closest("[data-operation]")) {
    displayOperator(e.target.closest("[data-operation]").textContent);
  }
});

clearAllButton.addEventListener("click", () => {
  clearDisplay();
});

reverseSignButton.addEventListener("click", () => {
  if (currDisplayElem.textContent && isCurrentValueNotNull()) {
    updateCurrentDisplayValue(reverseSign());
  }
});

equalsButton.addEventListener("click", () => {
  displayEquals();
});

percentButton.addEventListener("click", () => {
  displayPercentage();
});

document.addEventListener("keyup", (event) => {
  if (event.key.match(/(?<!\S)\d(?!\S)/) || event.key === ".") {
    displayNumber(event.key);
  }
  if (isOperator(event.key)) {
    displayOperator(event.key);
  }
  if (event.key === "%") {
    displayPercentage();
  }
  if (event.key.match(/\=/) || event.key === "Enter") {
    displayEquals();
  }
  if (event.key === "Backspace") {
    clearDisplay();
  }
});

function updateCurrentDisplayValue(str, preview = false) {
  if (preview) {
    currDisplayElem.style.color = "#e8e8e859";
  } else {
    currDisplayElem.style.color = "#e9e9e9";
  }
  currDisplayElem.textContent = str;
  clearAllButton.textContent = "C";

  if (!isCurrentValueNotNull()) {
    clearAllButton.textContent = "AC";
  }
}

function updateCurrentDisplayEquation(strArray) {
  currEquationDisplayElem.textContent = "";
  if (strArray) {
    currEquationDisplayElem.appendChild(createColoredNode(strArray));
  }
}

function addToDisplayHistory(strArray) {
  historyDisplayElem.appendChild(createColoredNode(strArray));
}

function resetDisplayHistory() {
  historyDisplayElem.textContent = "";
}
