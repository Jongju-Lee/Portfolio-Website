const $days = document.querySelector(".countdown-page__unit--days");
const $hours = document.querySelector(".countdown-page__unit--hours");
const $minutes = document.querySelector(".countdown-page__unit--minutes");
const $seconds = document.querySelector(".countdown-page__unit--seconds");

const countDownDate = new Date("March 31, 2026 00:00:00").getTime();
const secondInterval = setInterval(() => {
  let now = new Date().getTime();
  let distance = countDownDate - now;
  // 날짜, 시간 구하는 공식
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  // 변수 값을 화면 출력(값이 9보다 작을시 앞에 0 붙여서 출력)
  $days.textContent = days;
  $hours.textContent = hours > 9 ? hours : "0" + hours;
  $minutes.textContent = minutes > 9 ? minutes : "0" + minutes;
  $seconds.textContent = seconds > 9 ? seconds : "0" + seconds;
}, 1000);
