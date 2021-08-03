/*jshint esversion: 9 */

let bufforOperand;
let score;
// ----------------- Number Buttons ------------------------------
const numberButtons = document.getElementsByClassName("calc-button");
const actionButtons = document.getElementsByClassName("calc-lower-button");
for (let i = 0; i < numberButtons.length; i++) {
  numberButtons[i].addEventListener("click", function () {
    document.getElementById("input").value += numberButtons[i].innerText;
    unselect();
  });
}

let input = document.getElementById("input");
let output = document.getElementById("output");

// ----------------- Functions -----------------------------------

function unselect() {
  for (let i = 0; i < actionButtons.length; i++) {
    actionButtons[i].classList.remove("selected");
  }
}

function isEqual(operand) {
  if (input.value == "") {
    if (output.value != "") {
      bufforOperand = operand.id;
      unselect();
      operand.classList.toggle("selected");
    }
  } else {
    bufforOperand = operand.id;
    unselect();
    operand.classList.toggle("selected");
    output.value = input.value;
    input.value = "";
  }
}

function equal() {
  inputInt = parseFloat(input.value);
  outputInt = parseFloat(output.value);
  switch (bufforOperand) {
    case "plus":
      score = outputInt + inputInt;
      break;
    case "minus":
      score = outputInt - inputInt;
      break;
    case "multiply":
      score = outputInt * inputInt;
      break;
    case "divide":
      score = outputInt / inputInt;
      break;
  }
  if (output.value == "" || input.value == "") {
  } else {
    output.value = score;
    input.value = "";
    bufforOperand = "";
  }
}
// ----------------- Action Buttons ------------------------------
const equals = document.getElementById("equals");
equals.addEventListener("click", function () {
  equal();
  unselect();
});
const clear = document.getElementById("clear");
clear.addEventListener("click", function () {
  output.value = "";
  input.value = "";
  bufforOperand = "";
  unselect();
});
const plus = document.getElementById("plus");
plus.addEventListener("click", function () {
  equal();
  isEqual(plus);
});
const minus = document.getElementById("minus");
minus.addEventListener("click", function () {
  equal();
  isEqual(minus);
});
const multiply = document.getElementById("multiply");
multiply.addEventListener("click", function () {
  equal();
  isEqual(multiply);
});
const divide = document.getElementById("divide");
divide.addEventListener("click", function () {
  equal();
  isEqual(divide);
});

// ----------------- Action Buttons ------------------------------

const allButtons = document.getElementsByClassName("click");
for (let i = 0; i < allButtons.length; i++) {
  allButtons[i].addEventListener("mousedown", function () {
    allButtons[i].classList.toggle("clicked");
  });
  allButtons[i].addEventListener("mouseup", function () {
    allButtons[i].classList.remove("clicked");
  });
}
