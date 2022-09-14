const DISPLAY_MAX_NUMBERS = 14;

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
  const str = number < 0 ? number.toString().substring(1) : number.toString();

  if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
    return str.split("-")[1] || 0;
  } else if (str.indexOf(".") !== -1) {
    return str.split(".")[1].length || 0;
  }
  return str.split("-")[1] || 0;
};

export const countDigits = (number) => {
  const str = number < 0 ? number.toString().substring(1) : number.toString();

  if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
    return str.split("-")[1] || 0;
  } else if (str.indexOf(".") !== -1) {
    return str.split(".")[1].length + str.split(".")[0].length || 0;
  }
  return str.length || 0;
};

export const roundNum = (num, decimalPlaces = 0) => {
  if (num === 0) return 0;
  if (num.toString().includes("e")) {
    return num.toPrecision(2);
  }

  if (countDigits(num) > DISPLAY_MAX_NUMBERS && countDecimals(num) <= 8)
    num = num.toExponential(2);

  if (countDecimals(num) <= decimalPlaces) {
    return num;
  }

  return Number.isInteger(num) ? num : Number(num.toFixed(8)).toString();
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
