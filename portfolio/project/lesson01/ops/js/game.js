document.addEventListener("DOMContentLoaded", () => {
  const CLA_ON = "on";
  const CLA_LOADING = "loading";
  const CLA_PLAYING = "playing";
  const CLA_MAIN = "main";

  const intro = getEl(".intro")[0];
  const main = getEl(".main")[0];
  const btnHelp = getEl(".btn_help")[0];
  const btnStart = getEl(".btn_start")[0];
  const helpPop = getEl(".help_pop")[0];
  const helpPopClose = getEl(".help_pop_close")[0];
  const quizNum = getEl(".quiz_num")[0];
  const quizText = getEl(".quiz_text")[0];
  const timer = getEl(".timer")[0];
  const timeText = getEl(".time_text")[0];
  const balloons = getEl(".balloon");
  const life = getEl(".life p");
  const endPop = getEl(".end_pop")[0];
  const gameClearStart = getEl(".gameclear_start")[0];
  const gameClearReplay = getEl(".gameover_replay")[0];
  const bgmBtn = getEl('.btn_bgm')[0];
  const bgmOnBtn = getEl('.btn_bgm .on')[0];
  const bgmOffBtn = getEl('.btn_bgm .off')[0];
  let balloonSets = [];
  let shuffledData = [];
  let currentIndex = 0;
  let currentQuiz;
  let playing = true;
  let time = 180;
  let timerInterval;
  let status;
  let bgmAudio = new Audio("include/media/game_bg.mp3");

  bgmAudio.setAttribute('volume', '0');
  bgmAudio.play();

  const colors = ["green", "orange", "pink", "purple", "red"];

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateBalloonSets();

  function generateBalloonSets() {
    for (let i = 0; i < 10; i++) {
      const trueColor = getRandomElement(colors);
      const falseColor = getRandomElement(colors.filter(color => color !== trueColor));
      const isTrueFirst = Math.random() < 0.5;

      balloonSets.push([
        isTrueFirst ? { answer: true, color: trueColor } : { answer: false, color: falseColor },
        isTrueFirst ? { answer: false, color: falseColor } : { answer: true, color: trueColor },
      ]);
    }
  }

  btnHelp.addEvent("click", function () {
    helpPop.addClass(CLA_ON);
  });
  helpPopClose.addEvent("click", function () {
    helpPop.removeClass(CLA_ON);
  });

  btnStart.addEvent("click", function () {
    intro.removeClass(CLA_ON);
    main.addClass(CLA_ON);
    bgmBtn.addClass(CLA_MAIN);
    start();
  });

  gameClearStart.addEvent("click", function () {
    reset();
    intro.addClass(CLA_ON);
    main.removeClass(CLA_ON);
    bgmBtn.removeClass(CLA_MAIN);
  });

  gameClearReplay.addEvent("click", function () {
    reset();
  });

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }


  // 시작
  function start() {
    // bgmAudio.loop = true;
    // bgmAudio.play();
    if (shuffledData.length === 0) shuffledData = shuffleArray([...DATA]);

    currentIndex = 0;
    time = 180;
    timeText.html = time;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    timer.addClass(CLA_LOADING);
    updateQuiz();
  }

  // 타이머
  function updateTimer() {
    if (time > 0) {
      time--;
      timeText.html = time;
    } else {
      status = false;
      quizFinish();
    }
  }

  function quizFinish() {
    balloons.forEach(item => (item.DOM.style.animationPlayState = "paused"));
    clearInterval(timerInterval);
    timer.removeClass(CLA_LOADING);
    const statusEnd = status ? "success" : "fail";
    endPop.attr("data-status", statusEnd);
    console.log("finish!");
  }

  // 퀴즈 생성
  function updateQuiz() {
    mouseCursorImg.src = "images/game/balloon/apng_game_ct_basic.png";

    balloons.forEach((item, index) => {
      item.removeClass("success", "fail");
      item.DOM.style.animation = "none";
      item.DOM.offsetHeight;
      item.DOM.style.animation = "";
      item.DOM.style.animationPlayState = "running";
    });

    // 퀴즈 생성
    if (currentIndex < shuffledData.length) {
      currentQuiz = shuffledData[currentIndex];
      quizText.html = currentQuiz.quiz;
      quizText.attr("data-type", "");
      if (currentQuiz.type) quizText.attr("data-type", currentQuiz.type);

      balloons.forEach((item, index) => {
        const balloonImg = item.getEl("img")[0];
        let quizAnswer = balloonSets[currentIndex][index].answer ? "o" : "x";
        balloonImg.DOM.src = `images/game/balloon/apng_balloon_${quizAnswer}_${balloonSets[currentIndex][index].color}.png`;
      });

      balloons[0].attr("data-color", balloonSets[currentIndex][0].color);
      balloons[1].attr("data-color", balloonSets[currentIndex][1].color);
      balloons[0].attr("data-answer", balloonSets[currentIndex][0].answer);
      balloons[1].attr("data-answer", balloonSets[currentIndex][1].answer);

      quizNum.DOM.src = `images/game/balloon/no_${currentIndex + 1}.png`;
      playing = true;
    }
  }

  const targetElement = document.querySelector("div");
  const scale = window.getZoomRate(targetElement);
  const mouseCursorElement = document.querySelector(".mouseCursor");
  const mouseCursorImg = document.querySelector(".mouseCursor img");

  //성공
  function success() {
    playEfSound && playEfSound("correct");
    mouseCursorImg.src = "images/game/balloon/apng_game_ct_answer.png";
    if (currentIndex == DATA.length) {
      setTimeout(() => {
        status = true;
        quizFinish();
      }, 1000);
    } else {
      setTimeout(() => {
        updateQuiz();
      }, 1000);
    }
  }

  //실패
  function fail() {
    playEfSound && playEfSound("fail");
    mouseCursorImg.src = "images/game/balloon/apng_game_ct_wrong.png";
    const lifeOns = life.filter(item => item.matches(`.${CLA_ON}`));
    const lastOn = lifeOns[lifeOns.length - 1];
    if (lastOn) lastOn.removeClass(CLA_ON);

    if (life.every(item => !item.matches(`.${CLA_ON}`))) {
      setTimeout(() => {
        status = false;
        quizFinish();
      }, 1000);
    } else {
      if (currentIndex == DATA.length) {
        setTimeout(() => {
          status = true;
          quizFinish();
        }, 1000);
      } else {
        setTimeout(() => {
          updateQuiz();
        }, 1000);
      }
    }
  }

  function reset() {
    life.forEach(item => item.addClass(CLA_ON));
    timer.removeClass(CLA_LOADING);
    shuffledData = [];
    balloonSets = [];
    currentIndex = 0;
    playing = true;
    time = 180;
    status = false;
    endPop.attr("data-status", "");
    generateBalloonSets();
    start();
  }

  // 마우스 커서
  document.addEventListener("mousemove", e => moveEvent(e));
  document.addEventListener("touchmove", e => moveEvent(e));

  function moveEvent(e) {
    const rect = targetElement.getBoundingClientRect();
    const cursorX = (getEventPosition(e).x - rect.left) / scale;
    const cursorY = (getEventPosition(e).y - rect.top) / scale;

    if (playing) {
      if (e.target.closest(".quizContainer")) {
        mouseCursorElement.style.left = cursorX + "px";
        mouseCursorElement.style.top = cursorY + "px";
      }
    }
  }

  document.addEventListener("click", e => clickEvent(e));
  document.addEventListener("touchstart", e => clickEvent(e));

  function clickEvent(e) {
    if (playing) {
      if (e.target.matches(".balloon")) {
        playing = false;
        currentIndex++;
        const answer = e.target.dataset.answer;
        const correctAnswer = currentQuiz.answer ? "true" : "false";
        const targetBalloon = e.target;
        const targetBalloonImg = e.target.querySelector("img");

        if (correctAnswer == answer) {
          targetBalloonImg.src = `images/game/balloon/apng_balloon_answer_${targetBalloon.dataset.color}.png`;
          success();
        } else {
          targetBalloonImg.src = `images/game/balloon/apng_balloon_wrong_${targetBalloon.dataset.color}.png`;
          fail();
        }

        balloons.forEach(item => (item.DOM.style.animationPlayState = "paused"));
        console.log(currentIndex);
      }
    }
  }

  // bgm 버튼 추가 24-09-20 DY 수정
  bgmOnBtn.addEvent('click',() => {
    bgmBtn.addClass(CLA_PLAYING);
    bgmAudio.loop = true;
    bgmAudio.play();
  })
  bgmBtn.addClass(CLA_PLAYING);
  bgmAudio.setAttribute('volume', '1');

  bgmOffBtn.addEvent('click',() => {
    bgmBtn.removeClass(CLA_PLAYING);
    bgmAudio.loop = false;
    bgmAudio.pause();
  })

}); // end
