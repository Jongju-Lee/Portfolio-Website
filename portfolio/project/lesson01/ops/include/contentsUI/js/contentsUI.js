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
    const CLA_HIDE = 'HIDE';
    const ATTR_HTML = 'data-html';
    const ATTR_STEP = 'data-step';
    const ATTR_ON_CHAPTER = 'data-on-chapter';
    const ATTR_ON_CORNER = 'data-on-corner';

    const wrap = api.getEl('.wrap')[0];
    let lesson = Number(wrap.attr(`${ATTR_LESSON}`));
    let chapter = Number(wrap.attr(`${ATTR_CHAPTER}`));
    let corner = Number(wrap.attr(`${ATTR_CORNER}`));
    let page = Number(wrap.attr(`${ATTR_PAGE}`));

    const indexBtn = api.getEl('.index')[0];
    indexBtn.hover();

    const introduction = api.getEl('.introduction')[0];
    const deployment = api.getEl('.deployment')[0];
    const organize = api.getEl('.organize')[0];
    const stepButtons = [introduction, deployment, organize];
    const bottomMenu = CONTENTS_UI.bottomMenu;
    const botmenuStep = api.createEl({ parent: bottomMenu.DOM, className: "botmenuStepCont" })


    introduction.attr(ATTR_STEP, '도입');
    deployment.attr(ATTR_STEP, '전개');
    organize.attr(ATTR_STEP, '정리');

    const entireItems = {
      lessonTitBtns: [],
      lessonMapBtns: [],

      chapterBtns: [],
      chapterBoxes: [],

      cornerBtns: [],
      cornerBoxes: [],

      htmlBtns: [],
      htmlBoxes: [],
    };

    const unitMap = api.createEl({ parent: wrap.DOM, className: "unitMap" });
    const mapContainer = api.createEl({ parent: unitMap.DOM, className: "mapCont" });
    const mapCloseBtn = api.createEl({ tag: 'button', parent: unitMap.DOM, className: "mapCloseBtn" });
    const unitLessonist = api.createEl({ tag: 'ul', parent: mapContainer.DOM, className: "unitBigList" });

    //단원맵 작성
    CONTENTS_UI.DATA.contents.forEach((contents) => {
      
      const lessonTitles = contents.title;
      const lessonitem = api.createEl({ tag: 'li', parent: unitLessonist.DOM, className: "unitBigTit", html: `${lessonTitles}` }).hover();
      lessonitem.index = contents.index;
      entireItems.lessonTitBtns.push(lessonitem);

      
      lessonitem.onclick(() => {
        entireItems.lessonMapBtns.forEach(mapBtn =>{
          if(mapBtn.index == lessonitem.index){
            mapBtn.addClass(CLA_OPEN);
            unitMap.on();
          }else{
            mapBtn.removeClass(CLA_OPEN);
          }
        })
      })

      // lesson.index = contents.index 
      const lessonTarget = api.createEl({ parent: mapContainer.DOM, className: "unitBigCont" }).attr(ATTR_LESSON, contents.index);
      const chapterBox = api.createEl({ parent: lessonTarget.DOM, className: "unitMidBox" });
      const chapterInList = api.createEl({ tag: 'ul', parent: chapterBox.DOM, className: "unitMidList" }).attr(ATTR_ON_CHAPTER, chapter);
      lessonTarget.index = contents.index;
      

      contents.chapters.forEach((chapters) => {
        if (chapters.index === 1) {
          const processContBox = api.createEl({ parent: lessonTarget.DOM, className: "processContBox" }).attr(ATTR_CHAPTER, chapters.index);

          const middlMap = api.createEl({ tag: 'li', parent: chapterInList.DOM, className: "unitMid" }).hover();
          const unitMidTit = api.createEl({ tag: 'span', parent: middlMap.DOM, className: "unitMidTit", html: `${chapters.title}` }).attr(ATTR_CHAPTER, chapters.index);
          // const unitSmall = api.createEl({ tag: 'ul', parent: middlMap.DOM, className: "unitSmall" }).attr(ATTR_ON_CORNER, corner);
          unitMidTit.hover()

          processContBox.lesson = contents.index;
          processContBox.index = chapters.index;
          middlMap.lesson = contents.index;
          middlMap.index = chapters.index;

          const processCont = api.createEl({ parent: processContBox.DOM, className: "processCont" }).attr(ATTR_CORNER, chapter === 1 ? corner : 'none');
          processCont.index = Number(processCont.attr(ATTR_CORNER));
          processCont.chapterIndex = chapters.index;
          processCont.lesson = lessonTarget.index;

          entireItems.cornerBoxes.push(processCont);
          const processMidCont = api.createEl({ parent: processCont.DOM, className: "Process" });
          const contDetail = api.createEl({ tag: 'ul', parent: processMidCont.DOM, className: "contDetail" });

          unitMidTit.onclick(() => {
            entireItems.chapterBtns?.forEach((item) => item.off());
            entireItems.chapterBoxes?.forEach((item) => item.off());
            entireItems.cornerBtns?.forEach((item) => item.off());

            middlMap.on();
            processContBox.on();
            processCont.on();
            processMidCont.addClass(CLA_ON);
          })



          chapters.corners.forEach((corners) => {
            const contDetailTit = api.createEl({ tag: 'li', parent: contDetail.DOM, className: "contDetailTit" }).hover();
            const moveTitBox = api.createEl({ parent: contDetailTit.DOM, className: `moveTitBox`, html: `<span>${corners.title}</span>` });

            contDetailTit.pageData = { 'title': corners.title, lesson: contents.index, chapter: chapters.index, corner: corners.index };
            contDetailTit.index = 1;

            contDetailTit.onclick(() => {
              lesson = contents.index;
              chapter = chapters.index;
              corner = corners.index;
              const contentsHtml = api.getPageData({ lesson, chapter, corner, page: 1 });
              api.redirect(contentsHtml.page);
            });

            //html btn 내용 push
            entireItems.htmlBtns.push(contDetailTit);
            contDetailTit.on = () => contDetailTit.addClass(CLA_ON);
            contDetailTit.off = () => contDetailTit.removeClass(CLA_ON);
          });

          processCont.on = () => processCont.addClass(CLA_ON);
          processCont.off = () => processCont.removeClass(CLA_ON);

          entireItems.chapterBoxes.push(processContBox);
          entireItems.chapterBtns.push(middlMap);

          processContBox.on = () => processContBox.addClass(CLA_ON);
          processContBox.off = () => processContBox.removeClass(CLA_ON);
          middlMap.on = () => middlMap.addClass(CLA_ON);
          middlMap.off = () => middlMap.removeClass(CLA_ON);
        } else {
          const processContBox = api.createEl({ parent: lessonTarget.DOM, className: "processContBox" }).attr(ATTR_CHAPTER, chapters.index);

          const middlMap = api.createEl({ tag: 'li', parent: chapterInList.DOM, className: "unitMid" }).hover();
          const unitMidTit = api.createEl({ tag: 'span', parent: middlMap.DOM, className: "unitMidTit", html: `${chapters.title}` }).attr(ATTR_CHAPTER, chapters.index);
          const unitSmall = api.createEl({ tag: 'ul', parent: middlMap.DOM, className: "unitSmall" }).attr(ATTR_ON_CORNER, corner);

          processContBox.lesson = contents.index;
          processContBox.index = chapters.index;
          middlMap.lesson = contents.index;
          middlMap.index = chapters.index;

          chapters.corners.forEach((corners) => {
            const unitSmallTit = api.createEl({ tag: 'li', parent: unitSmall.DOM, className: "unitSmallTit", html: `${corners.title}` }).hover();

            unitSmallTit.attr(ATTR_CORNER, corners.index)
            unitSmallTit.chapterIndex = chapters.index;
            unitSmallTit.index = corners.index;
            unitSmallTit.lesson = lessonTarget.index;


            const processCont = api.createEl({ parent: processContBox.DOM, className: "processCont" }).attr(ATTR_CORNER, corners.index);
            processCont.index = corners.index;
            processCont.chapterIndex = chapters.index;
            processCont.lesson = lessonTarget.index

            const stepAgree = ['', '도입', '전개', '정리'].map((name, index) => {

              const processMidCont = api.createEl({ parent: processCont.DOM, className: "Process" });
              const processTit = api.createEl({ tag: 'span', parent: processMidCont.DOM, className: "processTit", html: `${name}` });
              const contDetail = api.createEl({ tag: 'ul', parent: processMidCont.DOM, className: "contDetail" });

              processMidCont.step = name;

              let titleAgree = [];
              const agreehtmlData = corners.htmls.filter((item) => item.step === name);
              agreehtmlData.forEach((agreeData) => {
                if (titleAgree.includes(agreeData.title)) return;
                titleAgree.push(agreeData.title);
                const contDetailTit = api.createEl({ tag: 'li', parent: contDetail.DOM, className: "contDetailTit" }).hover();
                const moveTitBox = api.createEl({ parent: contDetailTit.DOM, className: `moveTitBox`, html: `<span>${agreeData.subTitle ? agreeData.subTitle : agreeData.title}</span>` });

                // moveTitBox span 텍스트가 26개 이상이면 moveTit 클래스 추가
                moveTitBox.children[0].text.length > 26 && moveTitBox.children[0].addClass('moveTit');

                contDetailTit.pageData = { 'title': agreeData.title, lesson: contents.index, chapter: chapters.index, corner: corners.index };
                contDetailTit.index = agreeData.index;

                // agreeData step bottomMenu
                const contentsHtml = api.getPageData({ lesson, chapter, corner, page: page });
                const is_all_Corr = contentsHtml.corner.index === corners.index && contentsHtml.chapter.index === chapters.index;

                if (is_all_Corr && agreeData.step === contentsHtml.page.step) {                  
                  const botmenuHtmldata =
                    api.createEl({
                      tag: 'button',
                      parent: botmenuStep.DOM, className: "js-stepDataBtn",
                      html: `<span>${agreeData.title}</span>`
                    }).hover();

                  botmenuHtmldata.index = agreeData.index;
                  botmenuHtmldata.lesson = agreeData.lessonIndex

                  if(botmenuHtmldata.lesson !== lesson) botmenuHtmldata.addClass(CLA_HIDE);
                  if (contentsHtml.page.index == botmenuHtmldata.index || agreeData.title == contentsHtml.page.title) botmenuHtmldata.lesson == lesson && botmenuHtmldata.addClass(CLA_ON);

                  botmenuHtmldata.onclick(() => {
                    lesson = contents.index;
                    chapter = chapters.index;
                    corner = corners.index;
                    const redirectData = api.getPageData({ lesson, chapter, corner, page: agreeData.index });
                    api.redirect(redirectData.page);
                    
                  });
                }

                contDetailTit.onclick(() => {
                  lesson = contents.index;
                  chapter = chapters.index;
                  corner = corners.index;
                  const contentsHtml = api.getPageData({ lesson, chapter, corner, page: agreeData.index });
                  api.redirect(contentsHtml.page);
                });
                //html btn 내용 push
                entireItems.htmlBtns.push(contDetailTit);
                contDetailTit.on = () => contDetailTit.addClass(CLA_ON);
                contDetailTit.off = () => contDetailTit.removeClass(CLA_ON);
              });

              // 단원 마무리 도입 전개... 삭제
              contDetail.children.length == 0 && processMidCont.remove();

              unitSmallTit.onclick(() => {
                //chapter
                entireItems.chapterBtns.forEach((it) => it.off());
                entireItems.chapterBoxes.forEach((it) => it.off());
                middlMap.on();
                processContBox.on();
                //corner
                entireItems.cornerBtns.forEach((it) => it.off());
                entireItems.cornerBoxes.forEach((it) => it.off());
                unitSmallTit.on();
                processCont.on();
              })
              //html box 내용 push
              entireItems.htmlBoxes.push(processMidCont);
              processMidCont.on = () => processMidCont.addClass(CLA_ON);
              processMidCont.off = () => processMidCont.removeClass(CLA_ON);
            });

            //corner 내용 push
            entireItems.cornerBtns.push(unitSmallTit);
            entireItems.cornerBoxes.push(processCont);

            unitSmallTit.on = () => unitSmallTit.addClass(CLA_ON);
            unitSmallTit.off = () => unitSmallTit.removeClass(CLA_ON);
            processCont.on = () => processCont.addClass(CLA_ON);
            processCont.off = () => processCont.removeClass(CLA_ON);
          });

          //chapter 내용 push
          entireItems.chapterBoxes.push(processContBox);
          entireItems.chapterBtns.push(middlMap);

          processContBox.on = () => processContBox.addClass(CLA_ON);
          processContBox.off = () => processContBox.removeClass(CLA_ON);
          middlMap.on = () => middlMap.addClass(CLA_ON);
          middlMap.off = () => middlMap.removeClass(CLA_ON);
        }
      });

      entireItems.lessonMapBtns.push(lessonTarget);
      lessonTarget.attr(ATTR_LESSON) == FIRSTDIV.getAttribute(ATTR_LESSON) && lessonTarget.addClass(CLA_OPEN);

    });

    indexBtn.onclick(() => unitMap.on());
    mapCloseBtn.onclick(() => unitMap.off());

    unitMap.on = () => {
      unitMap.addClass(CLA_ON);
      openUnitMap();
    }
    unitMap.off = () => unitMap.removeClass(CLA_ON);

    function openUnitMap() {
      openMapChapter();
      openMapCorner();
      openMaphtml();
    }

    function openMapChapter() {
      //chapter
      findIndexOnOff(entireItems.chapterBtns, chapter);
      findIndexOnOff(entireItems.chapterBoxes, chapter);
    }
    function openMapCorner() {
      //corner
      entireItems.cornerBtns.forEach((btn) => btn.off());
      entireItems.cornerBtns.find((btn) =>
        btn.chapterIndex === chapter && btn.index === corner && btn.lesson === lesson)?.on();

      entireItems.cornerBoxes.forEach((box) => box.off());

      const findProcessCont = entireItems.cornerBoxes.find((box) =>
        box.chapterIndex === chapter && box.index === corner && box.lesson === lesson);
      findProcessCont?.on();
      findProcessCont.children[0].addClass(CLA_ON);
    }
    function openMaphtml() {
      const contentsHtml = api.getPageData({ lesson, chapter, corner, page: page });
      //html
      entireItems.htmlBtns.forEach((btn) => btn.off());
      const matchesPages = entireItems.htmlBtns.filter((btn) =>
        btn.pageData.lesson === contentsHtml.lesson.index
        && btn.pageData.chapter === contentsHtml.chapter.index
        && btn.pageData.corner === contentsHtml.corner.index
      );

      matchesPages.find((btn) => btn.pageData.title === contentsHtml.page.title)?.on();

      entireItems.htmlBoxes.forEach((box) => box.off());
      entireItems.htmlBoxes.find((box) => box.step === contentsHtml.page.step)?.on();
    }

    //basic 
    const contentsHtml = api.getPageData({ lesson, chapter, corner, page: page });
    if (contentsHtml.page.step === '') FIRSTDIV.classList.add('isNone');
    stepButtons.find((btn) => btn.attr(ATTR_STEP) === contentsHtml.page.step)?.addClass(CLA_ON);
    stepButtons.forEach((stepBtn) => {
      stepBtn.hover();
      stepBtn.onclick(() => {
        const clickStep = stepBtn.attr(ATTR_STEP);
        api.redirect(contentsHtml.corner.htmls.find((item) => item.step === clickStep));
      });
    });

    function findIndexOnOff(target, searchIndex) {
      target?.forEach((item) => item.off());
      target?.find((item) => item?.index === searchIndex && item?.lesson == lesson ).on();
    }

  })
})