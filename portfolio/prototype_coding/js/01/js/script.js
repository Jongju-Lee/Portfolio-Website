let num1 = 0;
let num2;
let operator;
let equals = false;

const $result1 = document.querySelector("#result1");
const $result2 = document.querySelector("#result2");
const $ClearBtn = document.querySelector(".all_clear");
const $numberBtns = document.querySelectorAll(".number");
const $operatorBtns = document.querySelectorAll(".operator");
const $equalBtn = document.querySelector(".equals");

const initialize = () => {
  num1 = 0;
  num2 = null;
  operator = null;
  $result1.value = "";
  $result2.value = 0;
};
const calResult = () => {
  switch (operator) {
    case "+":
      $result2.value = Number(num1) + Number(num2);
      break;
    case "-":
      $result2.value = Number(num1) - Number(num2);
      break;
    case "x":
      $result2.value = Number(num1) * Number(num2);
      break;
    case "÷":
      $result2.value = Number(num1) / Number(num2);
      break;
    case "%":
      $result2.value = Number(num1) % Number(num2);
      break;
  }
  // 식의 결과값을 num1 변수에 덮어쓰기
  num1 = Number($result2.value);
};
function onClickNumBtn() {
  // 버튼 클릭 1 ~ 9
  let newValue = this.textContent;
  if (num1 === 0 || equals === true) {
    // 초기 상태에서는 num1에 버튼값이 그대로 들어가고 result1으로 출력
    num1 = newValue;
    $result2.value = num1;
    $result1.value = "";
    equals = false;
    return;
  }
  if (!operator) {
    // 연산자가 없으면
    num1 = num1 + newValue;
    $result2.value = num1;
    return;
  }
  if (!num2) {
    // num2가 값이 없으면
    num2 = newValue;
    $result2.value = num2;
    return;
  }
  num2 = num2 + newValue;
  $result2.value = num2;
}
function onClickOpBtn() {
  // 연산자 버튼 클릭
  equals = false;
  if (num2) {
    // num2가 있으면
    calResult();
    $result1.value = `${num1} ${this.textContent}`;
    operator = null;
    num2 = null;
  }
  operator = this.textContent;
  if (!num2) {
    // num2가 없으면
    $result1.value = `${num1} ${operator}`;
    return;
  }
}
const onClickClearBtn = () => {
  initialize();
};
function onClickEqualBtn() {
  if (!num2) {
    // num2가 없으면
    alert("식이 올바르지 않습니다.");
    initialize();
    return;
  }
  $result1.value = `${num1} ${operator} ${num2} =`;
  calResult();
  // 다음 식을 위해 operator, num2 초기화
  operator = null;
  num2 = null;
  equals = true;
}

$numberBtns.forEach((elm) => {
  elm.addEventListener("click", onClickNumBtn);
});
$operatorBtns.forEach((elm) => {
  elm.addEventListener("click", onClickOpBtn);
});
$ClearBtn.addEventListener("click", onClickClearBtn);
$equalBtn.addEventListener("click", onClickEqualBtn);
