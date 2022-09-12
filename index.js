import { Calculator } from "./calculator.js";
import { isOperator } from "./utils.js";

const calculatorControls = document.querySelector(".calculator-controls");
const percentButton = document.querySelector("[data-percent]");
const equalsButton = document.querySelector("[data-result]");
const deleteButton = document.querySelector("[data-delete]");
const clearAllButton = document.querySelector("[data-clear-all]");
const historyDisplayTextElem = document.querySelector(
  ".calculator-display-history-wrapper"
);
const currDisplayTextElem = document.querySelector(
  ".calculator-display-current"
);

const calculator = new Calculator(historyDisplayTextElem, currDisplayTextElem);

calculatorControls.addEventListener("click", function (e) {
  if (e.target.closest("[data-number]")) {
    calculator.appendNumber(e.target.closest("[data-number]").innerText);
  }
  if (e.target.closest("[data-operation]")) {
    calculator.chooseOperation(e.target.closest("[data-operation]").innerText);
  }
});

clearAllButton.addEventListener("click", () => {
  calculator.clearAll();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
});

equalsButton.addEventListener("click", () => {
  calculator.equals();
});

percentButton.addEventListener("click", () => {
  calculator.percent();
});

document.addEventListener("keyup", (event) => {
  if (event.key.match(/(?<!\S)\d(?!\S)/) || event.key === ".") {
    calculator.appendNumber(event.key);
  }
  if (isOperator(event.key)) {
    calculator.chooseOperation(event.key);
  }
  if (event.key === "%") {
    calculator.percent();
  }
  if (event.key.match(/\=/) || event.key === "Enter") {
    calculator.equals();
  }
  if (event.key === "Backspace") {
    calculator.delete();
  }
});
