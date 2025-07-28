document.addEventListener("DOMContentLoaded", () => {
  window.runPageManager()
  /* active */
  const CLA_ON = "on";
  const CLA_SOLVE = "solve";
  const ACTV_CLICK = 'click';
  const CLA_ACTIVE = 'active';

  /* class */
  const CLA_KEY = "key";
  const CLA_KEY_BTN = "keyBtn";
  const CLA_KEYPAD = "js-keypad";
  const CLA_BACK_BTN = "backBtn";
  const CLA_KEYPAD_BTN = "js-keypadBtn";
  const CLA_INPUT_BOX = "inputBox";
  const CLA_CONTAINER = "js-container";
  const CLA_DRAG_TARGET = "js-dragTarget";

  /* attribute */
  const ATTR_DATA_KEY = "data-key";
  const ATTR_DATA_ID = "data-id";
  const ATTR_DATA_QUIZ_TRY = "data-quiz-try";
  const ATTR_DATA_QUIZ_OPTS = "data-quiz-opts";
  const ATTR_DATA_IDX = "data-idx";

  const QUIZ_TYPE_DRAGDROP = "dragdrop";
  const QUIZ_TYPE_DRAGLINE = "dragline";
  const QUIZ_TYPE_SELECT = "select";
  const QUIZ_TYPE_INPUT = "input";
  const QUIZ_TYPE_TOGGLE = "toggle";
  const QUIZ_TYPE_CHOICE = "choice";
  const QUIZ_OPTION_NO_ALERT = "noAlert";


  // 스스로 평가하기 clickItem 선택한 것만 on
  const clickItemBoxs = getEl('.clickItemBox');
  clickItemBoxs?.forEach(clickItemBox => {
    const clickItems = clickItemBox.children;

    clickItems.forEach(clickItem => {
      clickItem.addEvent(ACTV_CLICK, () => {
        clickItems.forEach(clickItem => clickItem.removeClass(`${CLA_ON}`));
        clickItem.addClass(`${CLA_ON}`);
        playEfSound('button');
      })
    })
  });

  // 그리기 버튼
  const drawBtn = getEl('.drawBtn')[0];
  const draw = pageManager.drawings;
  const drawContainer = draw[0]?.container;

  drawBtn?.addEvent(ACTV_CLICK, () =>  {
    if(drawContainer.classList.contains(CLA_ON)){ drawContainer.removeClass(`${CLA_ON}`) }
    else{ drawContainer.addClass(`${CLA_ON}`) };

    draw[0].optionContainer.tools.stroke.forEach(stroke => stroke.removeClass(CLA_ACTIVE));
    draw[0].changeToolOption({name: 'stroke', value: 2});
  })

  // 버튼 체인지
  const exAnsBtn = getEl('.exAnsBtn')[0];
  const redoBtn = getEl('.redoBtn')[0];
  const answerImg = getEl('.img_ans')[0];
  exAnsBtn?.addEvent(ACTV_CLICK, () => changeBtn(exAnsBtn, redoBtn, answerImg) )
  redoBtn?.addEvent(ACTV_CLICK, () =>  changeBtn(redoBtn, exAnsBtn, answerImg) )

  function changeBtn (nowBtn, other, changeEl) { 
    nowBtn?.removeClass(`${CLA_ON}`);
    other?.addClass(`${CLA_ON}`);
    if(changeEl){
      changeEl.classList.contains(CLA_ON) ? changeEl.removeClass(`${CLA_ON}`) : changeEl.addClass(`${CLA_ON}`);
    }
  }

  // input, textarea 예시정답 보여줄 때 readonly => true
  const inputQuizs = pageManager.quizzes.filter(quiz => quiz.type ==="essay" || quiz.type ==="input");
  inputQuizs?.forEach(inputQuiz => {
    inputQuiz.callback = { //data-quiz-name : inputQuiz에 콜백 설정
      finish: (QUIZ) => { QUIZ.items.forEach(item => item.attr('readonly', true)) },
      reset: (QUIZ) => { QUIZ.items.forEach(item => item.removeAttr('readonly')) },
    }
  })



})