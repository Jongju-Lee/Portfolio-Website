const $minutes = document.querySelector("#minutes");
const $seconds = document.querySelector("#seconds");
const $millis = document.querySelector("#millis");
const $btnStart = document.querySelector(".btn_start");
const $btnStop = document.querySelector(".btn_stop");
const $btnReset = document.querySelector(".btn_reset");
const $buttons = document.querySelectorAll("button");

let stopWatch;
let curMinutes = 0;
let curSeconds = 0;
let curMillis = 0;

const initialize = () => {
  // 스탑워치 중지시키고 변수, textContent 초기화
  clearInterval(stopWatch);
  curMinutes = 0;
  curSeconds = 0;
  curMillis = 0;
  $minutes.textContent = "00";
  $seconds.textContent = "00";
  $millis.textContent = "00";
  $btnStop.classList.remove("checked");
  $btnStart.classList.remove("checked");
};

const countStart = () => {
  curMillis++;
  $millis.textContent = curMillis > 9 ? curMillis : "0" + curMillis;
  // 밀리초 증가시키고 화면출력 - 9미만이면 ex) '01' ~ '09' 로 출력
  if (curMillis > 99) {
    // 밀리초 99 넘어가면
    curMillis = 0;
    $millis.textContent = "00";
    // 밀리초를 0으로 되돌림
    curSeconds++;
    $seconds.textContent = curSeconds > 9 ? curSeconds : "0" + curSeconds;
    // sec를 증가시키고 화면 출력 - 9미만이면 ex) '01' ~ '09' 로 출력
  }
  if (curSeconds > 59) {
    // 59초 넘어가면
    curSeconds = 0;
    $seconds.textContent = "00";
    // sec를 0으로 되돌림
    curMinutes++;
    $minutes.textContent = curMinutes > 9 ? curMinutes : "0" + curMinutes;
    // 분을 증가시키고 화면 출력 - 9미만이면 ex) '01' ~ '09' 로 출력
  }
  if (curMinutes > 99) {
    // 100분이 되면 스탑워치 중지
    clearInterval(stopWatch);
  }
};

const buttonToggleClass = (e) => {
  if (e.target.classList.contains("btn_start")) {
    // btn_start 를 눌렀을때
    $btnStop.classList.remove("checked");
  } else if (e.target.classList.contains("btn_stop")) {
    // btn_stop 을 눌렀을때
    $btnStart.classList.remove("checked");
  }
  e.target.classList.add("checked");
  console.log(e.target);
};

$btnStart.addEventListener("click", () => {
  clearInterval(stopWatch);
  stopWatch = setInterval(countStart, 10);
});
$btnStop.addEventListener("click", () => {
  clearInterval(stopWatch);
});
$btnReset.addEventListener("click", initialize);
$buttons.forEach((elm) => {
  elm.addEventListener("click", buttonToggleClass);
});
