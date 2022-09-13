import { roundNum, isOperator, isOperatorStronger } from "./utils.js";

let currentValue = "";
let currentEquation = [];

export const isCurrentValueNotNull = () => {
  if (currentValue) return true;
  return false;
};

export const getEquation = () => {
  return currentEquation;
};

const getLatestElemOfEquation = () => {
  return currentEquation[currentEquation.length - 1];
};

const replaceLatestElemOfEquation = (elem) => {
  currentEquation[currentEquation.length - 1] = elem;
  return currentEquation;
};

export const reverseSign = () => {
  const reversed = (parseFloat(currentValue) * -1).toString();
  currentValue = reversed;
  return reversed;
};

export const calculatePercent = () => {
  currentValue = roundNum(parseFloat(currentValue) / 100, 8).toString();
  return currentValue;
};

const computeValues = (val1, val2, operation) => {
  let result = 0;

  switch (operation) {
    case "+":
      result = val1 + val2;
      break;
    case "-":
      result = val1 - val2;
      break;
    case "*":
      result = val1 * val2;
      break;
    case "/":
      if (val2 === 0) {
        return { error: true };
      }
      result = val1 / val2;
      break;
  }

  return { error: false, value: roundNum(result, 8).toString() };
};

export const computeEquation = () => {
  const arr = [...currentEquation];

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
};

export const appendNumberToCurrentValue = (value) => {
  if (currentValue.length > 14) return currentValue;
  if (value === "." && currentValue.includes(".")) return currentValue;
  if (value === "0" && currentValue === "0") return currentValue;
  if (currentValue === "0" && value !== "0" && value !== ".") currentValue = "";

  currentValue = currentValue + value;

  return currentValue;
};

export const addCurrentValueToEquation = () => {
  if (currentValue) {
    currentEquation.push(currentValue);
    return clearCurrentValue();
  } else {
    if (isOperator(getLatestElemOfEquation())) {
      currentEquation.pop();
    }
  }
};

export const resetEquation = () => {
  currentEquation = [];
  return [];
};

export const addOrReplaceLatestOperatorInEquation = (operator) => {
  if (isOperator(getLatestElemOfEquation())) {
    if (operator !== getLatestElemOfEquation()) {
      return replaceLatestElemOfEquation(operator);
    }
  } else {
    currentEquation.push(operator);
    return currentEquation;
  }

  return currentEquation;
};

export const clearCurrentValue = () => {
  currentValue = "";
  return "";
};

export const clearCurrentEquation = () => {
  currentEquation = [];
  return [];
};
