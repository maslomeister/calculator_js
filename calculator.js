import {
  roundNum,
  colorOperators,
  computeValues,
  isOperator,
  isOperatorStronger,
} from "./utils.js";

/**
 * @constructor
 * @param {HTMLTextElement} displayHistoryTextElem - div element where history will be showed
 * @param {HTMLTextElement} currDisplayTextElem - div element where typed value will be showed
 */
export class Calculator {
  constructor(displayHistoryTextElem, currDisplayTextElem) {
    this.displayHistoryTextElem = displayHistoryTextElem;
    this.currDisplayTextElem = currDisplayTextElem;
    this.clearAll();
  }

  clearAll() {
    this.currValue = "";
    this.newOperation = false;
    this.resetOperations = false;
    this.computeQueue = [];
    this.previewCalculation = "";
    this.calcHistory = [];
    this.displayHistoryTextElem.textContent = "";
    this.currDisplayTextElem.textContent = "";
  }

  clearIfError() {
    if (
      (this.currValue[0] !== "." && isNaN(this.currValue)) ||
      (this.previewCalculation[0] !== "." && isNaN(this.previewCalculation))
    ) {
      this.clearAll();
    }
  }

  delete() {
    if (this.currValue !== "") {
      if (
        this.calcHistory.length > 0 &&
        this.calcHistory[this.calcHistory.length - 1] === "="
      ) {
        console.log(this.computeQueue);
        this.calcHistory.push(this.currValue);
        this.calcHistory.push(";");
      }

      this.currValue = this.currValue.toString().slice(0, -1);
    }

    this.renderDisplay();
  }

  appendNumber(number) {
    this.clearIfError();

    if (
      this.calcHistory.length > 0 &&
      this.currValue !== "" &&
      this.calcHistory[this.calcHistory.length - 1] === "="
    ) {
      this.calcHistory.push(this.currValue);
      this.calcHistory.push(";");
    }

    if (number === "." && this.currValue.includes(".")) return;
    this.currValue = this.currValue.toString() + number.toString();
    this.renderDisplay();
  }

  chooseOperation(operation) {
    this.clearIfError();

    if (this.currValue === "") {
      this.changeHistory(1, operation, true);
      this.renderHistory();
      return;
    }

    this.changeHistory(0, this.currValue, true);
    this.changeHistory(0, operation, true);
    this.renderHistory();

    this.previewCalculation = this.calculate(this.computeQueue);
    this.currValue = "";
    this.renderDisplay();
  }

  percent() {
    this.clearIfError();

    if (!this.currValue) return;

    this.currValue = roundNum(this.currValue / 100, 8);
    this.renderDisplay();
  }

  calculate(array) {
    const arr = [...array];

    let operationIndex = 0;
    let currentOperation = "";

    while (arr.length !== 1) {
      operationIndex = -1;

      arr.map((elem, i) => {
        if (isOperator(elem)) {
          if (!currentOperation) {
            operationIndex = i;
            currentOperation = elem;
          } else {
            if (isOperatorStronger(elem, currentOperation)) {
              operationIndex = i;
              currentOperation = elem;
            }
          }
        }
      });

      const val1 = parseFloat(arr[operationIndex - 1]);
      const val2 = parseFloat(arr[operationIndex + 1]);

      if (isNaN(val2)) {
        arr.splice(operationIndex - 1, 2);
        arr.splice(operationIndex - 1, 0, val1);
      } else {
        const result = computeValues(val1, val2, currentOperation);
        if (result.error) {
          return "Error";
        } else {
          operationIndex = operationIndex;
          arr.splice(operationIndex - 1, 3);
          arr.splice(operationIndex - 1, 0, result.value);
        }
      }

      currentOperation = "";
    }

    return arr.pop();
  }

  equals() {
    this.clearIfError();

    if (this.computeQueue.length === 0 || !this.currValue) return;

    this.changeHistory(0, this.currValue, true);
    this.calcHistory.push("=");
    this.renderHistory();
    this.currValue = this.calculate(this.computeQueue);
    this.computeQueue = [];
    this.previewCalculation = "";
    this.renderDisplay();
  }

  renderDisplay() {
    if (this.currValue) {
      this.currDisplayTextElem.setAttribute("style", "color: #e9e9e9");
      this.currDisplayTextElem.textContent = this.currValue;
    } else {
      if (this.previewCalculation) {
        this.currDisplayTextElem.setAttribute("style", "color: #e8e8e859");
        this.currDisplayTextElem.textContent = this.previewCalculation;
      } else {
        this.currDisplayTextElem.textContent = "";
      }
    }
  }

  /**
   * Render value to display history
   * @param {number} mode - 0 add value, 1 replace last operation
   * @param {string} value
   * @param {boolean} updateComputeQueue - if set to true it will also update computeQueue
   */
  changeHistory(mode, value, updateComputeQueue = false) {
    if (mode === undefined || value === undefined) {
      throw new Error("Parameters can't be undefined");
    }

    switch (mode) {
      case 0:
        this.calcHistory.push(value);
        if (updateComputeQueue) {
          this.computeQueue.push(value);
        }
        break;
      case 1:
        this.calcHistory[this.calcHistory.length - 1] = value;
        if (updateComputeQueue) {
          this.computeQueue[this.computeQueue.length - 1] = value;
        }
        break;
    }
  }

  renderHistory() {
    this.displayHistoryTextElem.innerHTML = colorOperators(this.calcHistory);
  }
}
