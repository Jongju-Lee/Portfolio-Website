let player;
let computer;
let result;
let playerScore = 0;
let comScore = 0;

const $playerText = document.querySelector("#player_text");
const $comText = document.querySelector("#com_text");
const $resultText = document.querySelector("#result_text");
const $playerIndicator = document.querySelector("#indicator_player");
const $comIndicator = document.querySelector("#indicator_com");
const $playerIcon = document.querySelector(".player_icon");
const $choiceBtn = document.querySelectorAll(".choice_btns .btn");

const checkDistance = () => {
  // 점수차에 따른 이모티콘 변경
  const distance = playerScore - comScore;
  if (distance === 0) {
    $playerIcon.textContent = "😐";
  } else if (distance > 0) {
    if (distance > 1) {
      $playerIcon.textContent = "😎";
      return;
    }
    $playerIcon.textContent = "😉";
  } else if (distance < 0) {
    if (distance < -1) {
      $playerIcon.textContent = "😖";
      return;
    }
    $playerIcon.textContent = "😥";
  }
};

const replaceClass = (who, target) => {
  switch (who) {
    case 1:
      target.className = "one";
      break;
    case 2:
      target.className = "two";
      break;
    case 3:
      target.className = "three";
      break;
    case 4:
      target.className = "four";
      break;
    case 5:
      target.className = "five";
      break;
  }
};

const initialize = () => {
  playerScore = 0;
  comScore = 0;
  $playerIndicator.className = "";
  $comIndicator.className = "";
  $playerIcon.textContent = "😐";
  $resultText.textContent = "손가락 버튼을 눌러 시작하세요";
};

const checkResult = () => {
  // 점수에 따른 클래스 변경으로 인디케이터 조절
  replaceClass(playerScore, $playerIndicator);
  replaceClass(comScore, $comIndicator);
  checkDistance(); // 점수 차이 계산
  if (playerScore === 5) {
    setTimeout(() => {
      alert("승리 🏅");
      initialize();
    }, 300);
  } else if (comScore === 5) {
    setTimeout(() => {
      alert("패배 😱");
      initialize();
    }, 300);
  }
};

const computerChoice = () => {
  // 랜덤 숫자 생성해서 컴퓨터의 패를 정함
  const randomNum = Math.floor(Math.random() * 3);
  switch (randomNum) {
    case 0:
      computer = "가위";
      break;
    case 1:
      computer = "바위";
      break;
    case 2:
      computer = "보";
      break;
  }
  $comText.textContent = `COM : ${computer}`;
};

const checkWinner = () => {
  if (player === computer) {
    return "비겼네 ㅋㅋ";
  }
  if (computer === "가위") {
    if (player === "바위") {
      playerScore++;
      return "앗싸~!";
    } else {
      comScore++;
      return "힝...";
    }
  } else if (computer === "바위") {
    if (player === "보") {
      playerScore++;
      return "1점 획득!";
    } else {
      comScore++;
      return "이런?";
    }
  } else if (computer === "보") {
    if (player === "가위") {
      playerScore++;
      return "좋아 좋아~";
    } else {
      comScore++;
      return "윽 ㅜㅠ";
    }
  }
};

$choiceBtn.forEach((elm) => {
  elm.addEventListener("click", function () {
    player = this.getAttribute("data-value");
    $playerText.textContent = `나 : ${player}`;
    computerChoice();
    // 컴퓨터 숫자 뽑아서 변수 담음
    $resultText.textContent = checkWinner();
    checkResult();
  });
});
