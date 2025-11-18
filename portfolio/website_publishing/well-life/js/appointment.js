document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 캘린더 기능 ---------- */
  // 캘린더 관련 DOM 요소
  const calendarContainer = document.querySelector(".appointment-form__item-calendar");
  if (!calendarContainer) {
    // 캘린더가 없는 페이지면 종료
    return;
  }

  const yearElement = document.getElementById("cur-date__year");
  const monthElement = document.getElementById("cur-date__month");
  const prevBtn = calendarContainer.querySelector(".prev-btn");
  const nextBtn = calendarContainer.querySelector(".next-btn");
  const datesContainer = calendarContainer.querySelector(".appointment-form__item-calendar-dates");

  // 현재 선택된 날짜 저장
  let currentDate = new Date();
  let selectedDate = null;

  /**
   * 년/월 표시 업데이트
   * @param {Date} date 표시할 날짜
   */
  function updateYearMonth(date) {
    if (!yearElement || !monthElement) return;
    yearElement.textContent = date.getFullYear();
    monthElement.textContent = date.getMonth() + 1;
  }

  /**
   * 날짜 요소 생성
   * @param {number} day 날짜
   * @param {boolean} isCurrentMonth 현재 월인지 여부
   * @param {Date} dateObj Date 객체
   * @returns {HTMLElement} 날짜 요소
   */
  function createDateElement(day, isCurrentMonth, dateObj) {
    const dateBtn = document.createElement("button");
    dateBtn.className = "appointment-form__item-calendar-date";
    dateBtn.textContent = day;
    dateBtn.type = "button";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(dateObj);
    compareDate.setHours(0, 0, 0, 0);

    // 오늘 날짜 체크
    if (compareDate.getTime() === today.getTime()) {
      dateBtn.classList.add("appointment-form__item-calendar-date--current");
    }

    // 과거 날짜 체크
    if (compareDate < today) {
      dateBtn.classList.add("appointment-form__item-calendar-date--disabled");
      dateBtn.disabled = true;
    }

    // 현재 월이 아니면 비활성화
    if (!isCurrentMonth) {
      dateBtn.classList.add("appointment-form__item-calendar-date--disabled");
      dateBtn.disabled = true;
    }

    // 날짜 클릭 이벤트
    if (!dateBtn.disabled) {
      dateBtn.addEventListener("click", () => {
        // 기존 선택 제거
        const prevSelected = datesContainer.querySelector(".appointment-form__item-calendar-date--selected");
        if (prevSelected) {
          prevSelected.classList.remove("appointment-form__item-calendar-date--selected");
        }

        // 새 선택 추가
        dateBtn.classList.add("appointment-form__item-calendar-date--selected");
        selectedDate = new Date(dateObj);
      });
    }

    return dateBtn;
  }

  /**
   * 캘린더 날짜 렌더링
   * @param {Date} date 표시할 월의 날짜
   */
  function renderCalendar(date) {
    if (!datesContainer) return;

    // 기존 날짜 제거
    datesContainer.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    // 현재 월의 첫 번째 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 첫 번째 날의 요일 (0: 일요일, 6: 토요일)
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // 이전 달의 마지막 날들
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // 이전 달 날짜들 추가
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const dateObj = new Date(year, month - 1, day);
      const dateElement = createDateElement(day, false, dateObj);
      datesContainer.appendChild(dateElement);
    }

    // 현재 달 날짜들 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateElement = createDateElement(day, true, dateObj);
      datesContainer.appendChild(dateElement);
    }

    // 다음 달 날짜들 추가 (총 42개 셀을 채우기 위해)
    const totalCells = 42; // 6주 * 7일
    const currentCells = firstDayOfWeek + daysInMonth;
    const remainingCells = totalCells - currentCells;

    for (let day = 1; day <= remainingCells; day++) {
      const dateObj = new Date(year, month + 1, day);
      const dateElement = createDateElement(day, false, dateObj);
      datesContainer.appendChild(dateElement);
    }
  }

  /**
   * 캘린더 초기화 및 업데이트
   * @param {Date} date 표시할 날짜
   */
  function updateCalendar(date) {
    updateYearMonth(date);
    renderCalendar(date);
  }

  // 이전 달 버튼 클릭
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar(currentDate);
    });
  }

  // 다음 달 버튼 클릭
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar(currentDate);
    });
  }

  // 초기 캘린더 렌더링
  updateCalendar(currentDate);
  /* ---------- END - 캘린더 기능 ---------- */


  /* ---------- 시간 선택 기능 ---------- */
  // 시간 선택 관련 DOM 요소
  const timeBox = document.querySelector(".appointment-form__item-time-box");
  const timeItems = timeBox.querySelectorAll(".appointment-form__item-time-item");

  /**
   * 시간 버튼 선택 처리
   * @param {HTMLElement} targetBtn 선택할 버튼 요소
   */
  function selectTimeItem(targetBtn) {
    // 기존 선택 제거
    const prevSelected = timeBox.querySelector(".appointment-form__item-time-item--selected");
    if (prevSelected) {
      prevSelected.classList.remove("appointment-form__item-time-item--selected");
    }

    // 새 선택 추가
    targetBtn.classList.add("appointment-form__item-time-item--selected");
  }

  // 각 시간 버튼에 클릭 이벤트 추가 및 첫 번째 선택 가능한 시간 자동 선택
  for (const item of timeItems) {
    // --disabled가 없는 버튼만 처리
    if (!item.classList.contains("appointment-form__item-time-item--disabled")) {
      // 클릭 이벤트 추가
      item.addEventListener("click", () => {
        selectTimeItem(item);
      });

      // 첫 번째 선택 가능한 시간 자동 선택
      if (!timeBox.querySelector(".appointment-form__item-time-item--selected")) {
        selectTimeItem(item);
      }
    }
  }
  /* ---------- END - 시간 선택 기능 ---------- */


  /* ---------- 버튼클릭시 refresh 방지 ---------- */
  const form = document.querySelector(".appointment-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // 기본 제출 막기
    });
  }
  /* ---------- END - 버튼클릭시 refresh 방지 ---------- */
});

