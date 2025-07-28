document.addEventListener("DOMContentLoaded", () => {

  // active class
  const CLA_ON = 'on';


  // class
  const CAL_ACTIVE_BTN = 'particleBtn';
  const CLA_SURSOR = 'particleCursor';
  const CLA_DRAW_BOX = 'cursurDrawBox';
  const CLA_REDO_BTN = 'createRedoBtn';


  // Element
  const particleBtn = getEl(`.${CAL_ACTIVE_BTN}`)[0];
  const cursor = getEl(`.${CLA_SURSOR}`)[0];
  const drawBoxes = getEl(`.${CLA_DRAW_BOX}`);
  const createRedoBtn = getEl(`.${CLA_REDO_BTN}`)[0];
  const draws = pageManager.drawings;


  // 버튼 활성화 유무
  particleBtn.toggle(CLA_ON);
  particleBtn.onclick(() => {
    const inOn = particleBtn.matches(`.${CLA_ON}`);
    inOn ? cursor.addClass(CLA_ON) : cursor.removeClass(CLA_ON);
  })

  // 다시하기 버튼
  createRedoBtn?.onclick(() => {
    const isClones = getEl(`.isClone`);
    isClones.forEach(isClone => isClone.remove() );
    particleBtn.removeClass(CLA_ON);
    cursor.removeClass(CLA_ON);
    // 그리기 캔버스 삭제
    draws.forEach(draw => { draw.reset(); draw.close(); });
  })

  // 이동
  document.addEventListener('mousemove', (e) => cursorMove(e) );

  // isClone 생성
  drawBoxes.forEach(drawBox => {
    drawBox.addEvent('click', (e) => {
      if(particleBtn.matches('.on')){
        const addCursor = createEl({ tag: 'div', parent: drawBox.DOM, className: `${CLA_SURSOR} isClone` });
        const point = mousePosition(e, addCursor);
        const width = (addCursor.width/2)/point.zoom;
        const height = (addCursor.height/2)/point.zoom;
        addCursor.style({ top: `${point.y - height}px`, left: `${point.x - width}px` });
      }
    })
  })


  // 마우스 따라 다니는 item 함수
  function cursorMove (event) {
    const x = mousePosition (event, cursor).x;
    const y = mousePosition (event, cursor).y;
    const zoom = mousePosition (event, cursor).zoom;
    
    const cursorWidth = (cursor.width/2)/zoom;
    const cursorHeight = (cursor.height/2)/zoom;

    cursor.style({ top: `${y - cursorHeight}px`, left: `${x - cursorWidth}px` });
  }

  // 마우스 위치 리턴 함수
  function mousePosition (event, item) {
    let dragset = { x : 0, y : 0 };
    const zoom = getZoomRate();
    const cursorTop = item.top;
    const cursorLeft = item.left;

    const mousePos = getEventPosition(event);
    const itemPos = getBoundingData(item.DOM);
    const cssTop = (mousePos.y - itemPos.y) / zoom;
    const cssLeft = (mousePos.x - itemPos.x) / zoom;

    const lastX = cursorLeft - dragset.x + cssLeft;
    const lastY = cursorTop - dragset.y + cssTop;

    return { 
      x: lastX,
      y: lastY,
      zoom: zoom
    }
  }
  
})