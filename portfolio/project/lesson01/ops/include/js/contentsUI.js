window.addEventListener('DOMContentLoaded', () => {
  CONTENTS_UI.CUSTOM_API.loop(() => CONTENTS_UI.DATA).then(DATA => {
    if (!DATA) return;

    const api = CONTENTS_UI.CUSTOM_API;
    const FIRSTDIV = document.querySelector("div");

    const ATTR_LESSON = "data-lesson";
    const ATTR_CHAPTER = "data-chapter";
    const ATTR_CORNER = "data-corner";
    const ATTR_PAGE = "data-page";

    const CLA_ON = 'ON';
    const CLA_OPEN = 'OPEN';
    const ATTR_HTML = 'data-html';

    const wrap = api.getEl(".wrap")[0];
    let lesson = Number(wrap.attr(`${ATTR_LESSON}`));
    let chapter = Number(wrap.attr(`${ATTR_CHAPTER}`));
    let corner = Number(wrap.attr(`${ATTR_CORNER}`));
    let page = Number(wrap.attr(`${ATTR_PAGE}`));

    const indexBtn = api.getEl(".index")[0];

    const entireItems = {
      lessonTitBtns: [],
      lessonMapBtns: [],
      chapterBtns: [],
      cornerBtns: [],
    };

    // console.log(CONTENTS_UI.DATA)
    const lessonList = ['I. 과학과 인류의 지속가능한 삶', 'II. 생물의 구성과 다양성', 'III. 열', 'IV. 물질의 상태 변화', 'V. 힘의 작용', 'VI.기체의 성질', 'VIII. 태양계'];
    const chapterList = [
      {
        index: 1,
        title: '1. 태양계 구성과 태양 활동',
        inText: [
          {
            index: 1,
            title: '01. 태양계 구성원'
          },
          {
            index: 2,
            title: '02. 태양과 태양 활동'
          },
          {
            index: 3,
            title: '03. 천체 관측'
          },
        ]
      },
      {
        index: 2,
        title: '2. 지구와 달의 운동',
        inText: [
          {
            index: 1,
            title: '01. 지구 자전과 일주 운동'
          },
          {
            index: 2,
            title: '02. 지구 공전과 별자리 변화'
          },
          {
            index: 3,
            title: '03. 달의 위상 변화'
          },
          {
            index: 4,
            title: '04. 일식과 월식'
          },
        ]
      }
    ]
    const processList = [
      {
        index: 1,
        title: '도입',
        htmlList: [
          {
            index: 1,
            title: '목차',
            htmls: ''
          },
          {
            index: 2,
            title: '도입 게임',
            htmls: ''
          },
          {
            index: 3,
            title: '도입 영상',
            htmls: ''
          },
          {
            index: 4,
            title: '이 단원에서 나는',
            htmls: ''
          },
          {
            index: 5,
            title: '개념 영상',
            htmls: ''
          },

        ]
      },
      {
        index: 2,
        title: '전개',
        htmlList: [
          {
            index: 1,
            title: '중단원 도입 영상',
            htmls: ''
          },
          {
            index: 2,
            title: '궁금해',
            htmls: ''
          },
          {
            index: 3,
            title: '이전에 배웠어요',
            htmls: ''
          },
        ]
      },
      {
        index: 3,
        title: '소단원 도입 활동',
        htmlList: [
          {
            index: 1,
            title: '이 단원에서 나는',
            htmls: ''
          },
          {
            index: 2,
            title: '소단원 도입 애니메이션',
            htmls: ''
          },
          {
            index: 3,
            title: '소단원 개념 영상',
            htmls: ''
          },
        ]
      },
      {
        index: 4,
        title: '소단원 전개 활동',
        htmlList: [
          {
            index: 1,
            title: '학습 자료_태양계의 구성 천체',
            htmls: ''
          },
          {
            index: 2,
            title: 'Q1',
            htmls: ''
          },
          {
            index: 3,
            title: '탐구_태양계 천체 자료 수집 및 분석하기',
            htmls: ''
          },
          {
            index: 4,
            title: 'Q2',
            htmls: ''
          },
          {
            index: 5,
            title: '학습 자료_태양계 행성의 특징',
            htmls: ''
          },
        ]
      },
      {
        index: 5,
        title: '소단원 정리 활동',
        htmlList: [
          {
            index: 1,
            title: '스스로 확인하기',
            htmls: ''
          },
          {
            index: 2,
            title: '이것만은 꼭',
            htmls: ''
          },
          {
            index: 3,
            title: '핵심 정리',
            htmls: ''
          },
          {
            index: 4,
            title: '다음 시간에는',
            htmls: ''
          },
        ]
      },
    ]

    const unitMap = api.createEl({ parent: wrap.DOM, className: "unitMap" });
    const mapContainer = api.createEl({ parent: unitMap.DOM, className: "mapCont" });
    const mapCloseBtn = api.createEl({ tag: 'button', parent: unitMap.DOM, className: "mapCloseBtn" });
    const unitLessonist = api.createEl({ tag: 'ul', parent: mapContainer.DOM, className: "unitBigList" });

    lessonList.forEach((lessonitems) => {
      const lessonitem = api.createEl({ tag: 'li', parent: unitLessonist.DOM, className: "unitBigTit", html: `${lessonitems}` }).hover();
      entireItems.lessonTitBtns.push(lessonitem);
    });
    entireItems.lessonTitBtns[entireItems.lessonTitBtns.length - 1].addClass(CLA_ON);

    //임시 단원맵 작성
    CONTENTS_UI.DATA.contents.forEach((contents) => {
      // lesson.index = contents.index 
      const lessonTarget = api.createEl({ parent: mapContainer.DOM, className: "unitBigCont" }).attr(ATTR_LESSON, contents.index);
      const chapterBox = api.createEl({ parent: lessonTarget.DOM, className: "unitMidBox" });
      const chapterInList = api.createEl({ tag: 'ul', parent: chapterBox.DOM, className: "unitMidList" });
      const processContBox = api.createEl({ parent: lessonTarget.DOM, className: "processContBox" });
      lessonTarget.index = contents.index;

      // contents.chapters.forEach((chapters) => {
      //   chapters.corners[0].htmls.forEach((htmls) => {
      //     // console.log(htmls.step)
      //   })
      // });
      entireItems.lessonMapBtns.push(lessonTarget);
      lessonTarget.addClass(CLA_OPEN);
    });

    //임시 chapter inner 생성
    const chapterInner = {
      unitMidTitle: [],
      unitSmallTitle: [],
    };
    const unitMidListCont = getEl(`.unitMidList`)[0];
    chapterList.forEach((innerUnit) => {
      // console.log(innerUnit)
      const middlMap = api.createEl({ tag: 'li', parent: unitMidListCont.DOM, className: "unitMid" }).hover();
      const unitMidTit = api.createEl({ tag: 'span', parent: middlMap.DOM, className: "unitMidTit", html: `${innerUnit.title}` });
      const unitSmall = api.createEl({ tag: 'ul', parent: middlMap.DOM, className: "unitSmall" });

      innerUnit.inText.forEach((inText) => {
        const unitSmallTit = api.createEl({ tag: 'li', parent: unitSmall.DOM, className: "unitSmallTit", html: `${inText.title}` }).hover();
        chapterInner.unitSmallTitle.push(unitSmallTit);
      });
      chapterInner.unitMidTitle.push(middlMap);
    });
    chapterInner.unitMidTitle[0].addClass(CLA_ON);
    chapterInner.unitSmallTitle[0].addClass(CLA_ON);

    //임시 processList inner 생성
    const processInner = {
      unitMidTitle: [],
      unitSmallTitle: [],
    };

    const processBox = getEl(`.processContBox`)[0];
    const processCont = api.createEl({ parent: processBox.DOM, className: "processCont" }).addClass(CLA_ON);
    processList.forEach(processItem => {
      const process = api.createEl({ parent: processCont.DOM, className: "Process" });
      const processTit = api.createEl({ tag: 'span', parent: process.DOM, className: "processTit", html: `${processItem.title}` });
      const contDetail = api.createEl({ tag: 'ul', parent: process.DOM, className: "contDetail" });

      processItem.htmlList.forEach((htmlList) => {
        const contDetailTit = api.createEl({ tag: 'li', parent: contDetail.DOM, className: "contDetailTit" }).hover();
        const moveTitBox = api.createEl({ parent: contDetailTit.DOM, className: "moveTitBox", html: `<span>${htmlList.title}</span>` });
      });
    });


    indexBtn.onclick(() => unitMap.on());
    mapCloseBtn.onclick(() => unitMap.off());

    unitMap.on = () => unitMap.addClass(CLA_ON);
    unitMap.off = () => unitMap.removeClass(CLA_ON);

  })
})