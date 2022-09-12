const ALLOWED_OPERATORS = ["/", "*", "+", "-"];

function countDecimals(number) {
  if (Math.floor(number) === number) return 0;
  return number.toString().split(".")[1].length || 0;
}

export function roundNum(num, decimalPlaces = 0) {
  if (num.toString().includes("e")) {
    return num.toPrecision(2);
  }

  if (countDecimals(num) <= decimalPlaces) return num;

  var p = Math.pow(10, decimalPlaces);
  var n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
}

export function isOperator(symbol) {
  if (ALLOWED_OPERATORS.indexOf(symbol) !== -1) return true;
  return false;
}

export function colorOperators(history) {
  return history.reduce((acc, current) => {
    let curr = current;

    if (isOperator(current) || current === "=") {
      curr = `<span style="color:#9fdcf8">${current}</span>`;
    }

    if (curr === ";") {
      curr = `<span style="color:#ff8e8c">${current}</span>`;
    }

    return acc + " " + curr;
  }, "");
}

export const OPERATOR_POWER = new Map([
  ["+", 0],
  ["-", 0],
  ["*", 1],
  ["/", 2],
]);

export function isOperatorStronger(operation1, operation2) {
  if (OPERATOR_POWER.get(operation1) > OPERATOR_POWER.get(operation2))
    return true;
  return false;
}

export function computeValues(val1, val2, operation) {
  if (val2 === 0) {
    return { error: true };
  }

  let value = 0;

  switch (operation) {
    case "+":
      value = val1 + val2;
      break;
    case "-":
      value = val1 - val2;
      break;
    case "*":
      value = val1 * val2;
      break;
    case "/":
      value = val1 / val2;
      break;
  }

  return { error: false, value: roundNum(value, 8).toString() };
}
