const $todoInput = document.querySelector("#todo_input");
const $addBtn = document.querySelector("#btn_add_task");
const $listField = document.querySelector("#list_field");

const saveData = () => {
  localStorage.setItem("data", $listField.innerHTML);
};

const showTask = () => {
  $listField.innerHTML = localStorage.getItem("data");
};

const addTask = () => {
  if ($todoInput.value === "") {
    // 인풋이 비었을때
    alert("할 일을 입력 한 후 '추가' 를 눌러주세요");
    return;
  }
  let li = document.createElement("li");
  li.textContent = $todoInput.value;
  $listField.append(li); // input의 value를 ul > li에 추가
  let span = document.createElement("span");
  span.innerHTML = '<i class="bi bi-x"></i>';
  li.append(span); // li 에 닫기 버튼 추가
  $todoInput.value = "";
  saveData(); // localStorage 에 저장
};

const pressEnter = (e) => {
  if (e.keyCode === 27) {
    // esc 누르면 input을 비움
    $todoInput.value = "";
  }
  if (e.keyCode === 13) {
    // 엔터키 누르면 '추가' 버튼 눌림
    addTask();
  }
};

const onClickLiTag = (e) => {
  if (e.target.tagName === "LI") {
    // li를 클릭하면
    e.target.classList.toggle("checked"); // li에 checked 클래스 추가
  } else if (e.target.tagName === "I") {
    // li의 닫기버튼을 클릭하면
    e.target.parentNode.parentNode.remove(); // 할 일 삭제
  }
  saveData(); // localStorage 에 저장
};

$todoInput.addEventListener("keyup", pressEnter);
$addBtn.addEventListener("click", addTask);
$listField.addEventListener("click", onClickLiTag);

showTask();
