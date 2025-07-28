window.UI_CONFIG = {
  /* classname - iframe */
  CLA_IFRAME: 'js-contentsFrame',
  /* classname - active */
  CLA_ON: 'on',
  CLA_OFF: 'off',
  CLA_HIDDEN: 'hidden',
  CLA_SHOWN: 'shown',
  CLA_ACTIVE: 'active',
  CLA_INACTIVE: 'inactive',
  /* navigation */
  CLA_NAVIGATION_LESSON: 'lesson',
  CLA_NAVIGATION_CHAPTER: 'chapter',
  CLA_NAVIGATION_CORNER: 'corner',
  CLA_NAVIGATION_STEP: 'step',
  CLA_NAVIGATION_TITLE: 'title',
  /* ebook */
  CLA_BOOK_PAGE: 'page',
  /* paging */
  CLA_PAGING_PREV: 'prev',
  CLA_PAGING_NEXT: 'next',
  CLA_PAGING_NUMBER: 'number',
  CLA_PAGING_CURRENT: 'current',
  CLA_PAGING_TOTAL: 'total',
  /* hide & show menu */
  CLA_SHOWMENU_BTN: 'showMenu',
  CLA_HIDEMENU_BTN: 'hideMenu',
  CLA_HIDEMENU_ON: 'hideMenu',
  CLA_SHOWMENU_ON: 'showMenu',
  /* cursor */
  CLA_CURSOR_BTN: 'cursor',
  /* home */
  CLA_HOME_BTN: 'home',
  /* index */
  CLA_INDEX_BTN: 'indexBtn',
  CLA_INDEX_POPUP: 'indexPopup',
  /* options */
  OPTIONS: {
    // JSON 파일 경로
    contentsDataSrc: `./include/contentsUI/data/`,
    // JSON 파일 이름
    contentsDataName: `contentsData`,
    // iframe 사용 여부
    importedContentsInIframe: false,
    // 타이틀 자동 입력 여부
    insertDataToNavigation: true,
    // 이동 가능한 페이지 범위 설정
    pagingScope: 'lesson',
    // 홈 버튼을 눌렀을 때 동작(close - 닫기, ebook - 교과서 이동, main - 메인 이동)
    returnPageToHome: 'close',
    // 활동도우미 메뉴 자동 닫힘 기능
    openViewerNewWindow: false,
    //
    returnPageToHome: 'openEbook',
    // 이펍뷰어 사용 여부
    usedEpubViewer: true,
    
    // 상단 메뉴 바
    TOPMENU: {
      active: true, // 상단 메뉴 사용 여부
      container: 'topMenu', // 컨테이너 클래스
      innerItems: [
        {
          name: 'navigation',
          type: 'navigation',
        },
        // {
        //   name: 'textbookpage',
        //   type: 'textbookpage',
        // },
        {
          type: "viewer",
          src: "textbook",
          name: "textbook",
          text: "쪽",
          target: '_self'
        },
      ]
    },
    // 하단 메뉴 바
    BOTTOMMENU: {
      active: true, // 하단 메뉴 사용 여부
      container: 'bottomMenu', // 컨테이너 클래스
      innerItems: [
        {
          type: 'paging',
          name: 'paging'
        }, 
        {
          type: 'index',
          name: 'index'
        } ,
        {
          type: 'button',
          name: 'introduction'
        },
        {
          type: 'button',
          name: 'deployment'
        },
        {
          type: 'button',
          name: 'organize'
        }
      ]
    },
    // 플로팅 메뉴 설정
    FLOATINGMENU: {
      active: false, // 플로팅 메뉴 사용 여부
      container: 'floatingMenu', // 컨테이너 클래스
      list: [
        {// 수업 도구
          name: 'learningTools',
          buttons: [
            {
              name: 'draw',
              type: 'draw'
            }, {
              name: 'memo',
              type: 'memo'
            }, {
              name: 'blackScreen',
              type: 'blackScreen'
            }, {
              name: 'attention',
              type: 'attention'
            }
          ]
        },
        {// 과목별 특화 콘텐츠
          name: 'specialContents',
          buttons: [
            {
              name: 'dictionary',
              type: 'link',
              src: 'binder/specialContents/dictionary.html'
            }, {
              name: 'games',
              type: 'link',
              src: 'binder/specialContents/games.html'
            }, {
              name: 'sings',
              type: 'link',
              src: 'binder/specialContents/sings.html'
            }
          ]
        }
      ]
    },
    CUSTOM: {
      openLink: [
        {
          name: 'dictionary',
          type: 'link',
          title: "용어 사전",
          src: '../resource/include/dictionary/index.html'
        }, {
          name: 'blankmap',
          type: 'link',
          title: "백지도",
          src: '../resource/include/map/map.html'
        }, {
          name: 'goldenbell',
          type: 'link',
          title: "골든벨",
          src: '../resource/include/game/goldenbell/index.html'
        }, {
          name: 'bingo',
          type: 'link',
          title: "빙고",
          src: '../resource/include/game/bingo/index.html'
        }, {
          name: 'board',
          type: 'link',
          title: "칠판",
          src: '../resource/include/activeHelper/board.html'
        }, {
          name: 'timer',
          type: 'link',
          title: "타이머",
          src: '../resource/include/activeHelper/timer.html'
        }, {
          name: 'stopwatch',
          type: 'link',
          title: "스톱워치",
          src: '../resource/include/activeHelper/stopwatch.html'
        }, {
          name: 'group',
          type: 'link',
          title: "활동 시킴이",
          src: '../resource/include/activeHelper/announcement.html'
        }, {
          name: 'sticker',
          type: 'link',
          title: "모둠 붙임딱지",
          src: '../resource/include/activeHelper/sticker.html'
        }
      ],
      functions: [
        {
          name: 'draw',
          type: 'draw'
        }, {
          name: 'memo',
          type: 'memo'
        }, {
          name: 'blackScreen',
          type: 'blackScreen'
        }, {
          name: 'attention',
          type: 'attention'
        }
      ]
    }
  }
}