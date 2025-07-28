window.CONFIG = {
  AUDIO_SRC: './include/media/',
  FULLSCREEN_POP_MODE: false, // 비디오 풀스크린 팝업으로 띄우기

  /* sound */
  SND_CLICK: 'click',
  SND_BUTTON_1: 'button',
  SND_BUTTON_2: 'button2',
  SND_CORRECT: 'correct',
  SND_INCORRECT: 'incorrect',
  SND_SUCCESS: 'success',
  SND_FAIL: 'fail',
  SND_MUTE: 'mute',

  SND_MAGNIFY_CLICK: 'click',
  SND_POPUP_OPEN: 'button',
  SND_POPUP_CLOSE: 'button',
  SND_SELF_CHECK: 'success',  
  SND_SLIDE_TAB: 'click',
  SND_SLIDE_DOT: 'click',
  SND_SLIDE_ARROW: 'click',

  /* quiz sound */
  SND_QUIZ_ANS: 'button', // 정답확인 
  SND_QUIZ_REDO: 'button2', // 다시하기
  SND_QUIZ_SHOW: 'button', // 정답 보여주기
  SND_QUIZ_HIDE: 'button2', // 정답 숨기기
  SND_QUIZ_CORRECT: 'success', // 정답시
  SND_QUIZ_INCORRECT: 'button', // 오답시
  SND_QUIZ_CHOICE_CLICK: 'click', // 선택형 클릭시
  SND_QUIZ_DRAG_CORRECT: 'button', // 드래그유형 정답시
  SND_QUIZ_DRAG_INCORRECT: 'button', // 드래그유형 오답시
  SND_QUIZ_LINE_NOANSWER: 'click', // 선긋기유형 정답이 없는 유형시
  SND_QUIZ_LINE_CORRECT: 'success', // 선긋기유형 정답시
  SND_QUIZ_LINE_INCORRECT: 'button', // 선긋기유형 오답시
  SND_QUIZ_ALL_ANS: 'click', // 전체정답확인
  SND_QUIZ_ALL_REDO: 'click', // 전체다시하기
  SND_QUIZ_TOGGLE_CLICK: 'button', // 토글클릭

  SND_QUIZ_EACH_SHOW_ANSWER: 'click', // 개별정답 정답보이기
  SND_QUIZ_EACH_HIDE_ANSWER: 'click', // 개별정답 정답숨기기
  SND_QUIZ_EACH_CORRECT: 'success', // 개별정답 정답확인
  SND_QUIZ_EACH_INCORRECT: 'button', // 개별정답 정답확인
  SND_QUIZ_EACH_REDO: 'click', // 개별정답 다시하기

  /* drawing */
  DRAWING_OPTIONS: {
    line: [
      { name: 'straight', value: 'straight' },
      { name: 'curve', value: 'curve' }
    ],
    brush: [
      { name: 'pen', value: 'pen', title: 'pen config' },
      { name: 'highlighter', value: 'highlighter', title: 'highlighter config' },
      { name: 'fill', value: 'fill', title: 'fill config' },
    ],
    eraser: [
      { name: 'eraser', value: 'eraser' },
      { name: 'removeline', value: 'removeline' },
      { name: 'remove', value: 'remove' }
    ],
    color: [
      { name: 'red', value: '#ea0000' },
      { name: 'orange', value: '#f47025' },
      { name: 'yellow', value: '#ffd400' },
      { name: 'green', value: '#00a651' },
      { name: 'sky', value: '#018dc2' },
      { name: 'blue', value: '#0018fb' },
      { name: 'deepPurple', value: '#4e01c2' },
      { name: 'purple', value: '#914afc' },
      { name: 'pink', value: '#f364e1' },
      { name: 'black', value: '#000000' },
      { name: 'white', value: '#ffffff' },
    ],
    stroke: [
      { name: `size_2`, value: 2 },
      { name: `size_5`, value: 5 },
      { name: `size_10`, value: 10 },
      { name: `size_15`, value: 15 },
      { name: `size_20`, value: 20, default: true }
    ]
  },

  PLAYER_TITLE: {
    video: {
      play: '영상 재생',
      pause: '영상 일시정지',
      stop: '영상 정지',
      volume: '음량 조절',
      zoom: '확대/축소',
      script: '자막',
      speed: '속도 조절'
    },
    audio: {
      play: '소리 재생',
      pause: '소리 일시정지',
      stop: '소리 정지',
      volume: '음량 조절',
    },
    language: {
      play: '소리 재생',
      pause: '소리 일시정지',
      stop: '소리 정지',
      volume: '음량 조절',
    }
  }
};