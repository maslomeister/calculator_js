const ALLOWED_OPERATORS = ["/", "*", "+", "-"];

const OPERATOR_POWER = new Map([
  ["+", 0],
  ["-", 0],
  ["*", 1],
  ["/", 2],
]);

export const isOperatorStronger = (operation1, operation2) => {
  if (OPERATOR_POWER.get(operation1) > OPERATOR_POWER.get(operation2))
    return true;
  return false;
};

export const countDecimals = (number) => {
  if (Math.floor(number) === number) return 0;
  return number.toString().split(".")[1].length || 0;
};

export const roundNum = (num, decimalPlaces = 0) => {
  if (num.toString().includes("e")) {
    if (num < 1 && num > -1) {
      return num.toFixed(8);
    } else {
      return num.toPrecision(2);
    }
  }

  if (countDecimals(num) <= decimalPlaces) return num;

  var p = Math.pow(10, decimalPlaces);
  var n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
};

export const isOperator = (symbol) => {
  if (ALLOWED_OPERATORS.indexOf(symbol) !== -1) return true;
  return false;
};

const createColoredOperator = (operator) => {
  const span = document.createElement("span");
  span.style.color = "#9fdcf8";
  span.textContent = ` ${operator} `;
  return span;
};

const createColoredSeparator = () => {
  const span = document.createElement("span");
  span.style.color = "#ff8e8c";
  span.textContent = ";";
  return span;
};

export const createColoredNode = (strArray) => {
  const parent = document.createElement("p");
  strArray.map((current) => {
    if (isOperator(current) || current === "=") {
      parent.appendChild(createColoredOperator(current));
    } else if (current === ";") {
      parent.appendChild(createColoredSeparator());
    } else {
      parent.appendChild(document.createTextNode(current));
    }
  });
  return parent;
};
