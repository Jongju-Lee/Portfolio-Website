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
    updateNavBtnState(date);
  }

  /**
   * 네비게이션 버튼 상태 업데이트
   * @param {Date} date 현재 표시 중인 날짜
   */
  function updateNavBtnState(date) {
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1); // 3개월 후

    // 현재 월이면 prev 비활성화
    if (date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth()) {
      prevBtn.classList.add("btn--disabled");
    } else {
      prevBtn.classList.remove("btn--disabled");
    }

    // 3개월 후 월이면 next 비활성화
    if (date.getFullYear() === maxDate.getFullYear() &&
      date.getMonth() === maxDate.getMonth()) {
      nextBtn.classList.add("btn--disabled");
    } else {
      nextBtn.classList.remove("btn--disabled");
    }
  }

  // 이전 달 버튼 클릭
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const today = new Date();
      // 현재 월 이전으로는 이동 불가
      if (currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() === today.getMonth()) {
        return;
      }
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateCalendar(currentDate);
    });
  }

  // 다음 달 버튼 클릭
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const today = new Date();
      const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);
      // 3개월 후 이후로는 이동 불가
      if (currentDate.getFullYear() === maxDate.getFullYear() &&
        currentDate.getMonth() === maxDate.getMonth()) {
        return;
      }
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateCalendar(currentDate);
    });
  }

  // 초기 캘린더 렌더링
  updateCalendar(currentDate);

  // 오늘 날짜 자동 선택
  const todayBtn = datesContainer.querySelector(".appointment-form__item-calendar-date--current");
  if (todayBtn && !todayBtn.disabled) {
    todayBtn.click();
  }
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


  /* ---------- 폼 검증 ---------- */
  /**
   * 이름 검증
   * @param {string} value 이름 값
   * @returns {boolean} 검증 결과
   */
  function validateName(value) {
    return value.trim().length >= 2;
  }

  /**
   * 전화번호 검증
   * @param {string} front 앞자리
   * @param {string} center 중간자리
   * @param {string} back 뒷자리
   * @returns {boolean} 검증 결과
   */
  function validatePhone(front, center, back) {
    const phoneRegex = /^01[0-9][0-9]{3,4}[0-9]{4}$/;
    const fullPhone = front + center + back;
    return phoneRegex.test(fullPhone);
  }

  /**
   * 주민등록번호 검증 (형식만 체크)
   * @param {string} front 앞자리 6자리
   * @param {string} back 뒷자리 7자리
   * @returns {boolean} 검증 결과
   */
  function validateResident(front, back) {
    const frontRegex = /^[0-9]{6}$/;
    const backRegex = /^[1-4][0-9]{6}$/;
    return frontRegex.test(front) && backRegex.test(back);
  }

  /**
   * input-box에 상태 클래스 적용 (매번 애니메이션 재실행)
   * @param {HTMLElement} inputBox input-box 요소
   * @param {boolean} isValid 유효 여부
   */
  function setInputState(inputBox, isValid) {
    inputBox.classList.remove("input--error", "input--valid");
    if (isValid) {
      inputBox.classList.add("input--valid");
    } else {
      void inputBox.offsetWidth; // reflow 강제하여 애니메이션 재실행
      inputBox.classList.add("input--error");
    }
  }

  /**
   * 전체 폼 검증 (한 번에 모든 에러 표시)
   * @returns {boolean} 검증 결과
   */
  function validateForm() {
    let isValid = true;
    let firstErrorElement = null;

    // DOM 요소
    const nameInput = document.getElementById("name");
    const nameBox = nameInput.closest(".appointment-form__item-patient-input-box");
    const phoneF = document.getElementById("phone-front");
    const phoneC = document.getElementById("phone-center");
    const phoneB = document.getElementById("phone-back");
    const phoneBox = phoneF.closest(".appointment-form__item-patient-input-box");
    const residentF = document.getElementById("resident-num-front");
    const residentB = document.getElementById("resident-num-back");
    const residentBox = residentF.closest(".appointment-form__item-patient-input-box");
    const subjectSelect = document.querySelector(".appointment-form__item-subject-select");
    const agree1 = document.getElementById("agree-1");
    const agree2 = document.getElementById("agree-2");
    const agree1Check = agree1.closest(".appointment-form__terms-check");
    const agree2Check = agree2.closest(".appointment-form__terms-check");

    // 진료과목 선택 확인
    if (!subjectSelect.value) {
      subjectSelect.classList.remove("input--valid", "input--error");
      void subjectSelect.offsetWidth; // reflow 강제하여 애니메이션 재실행
      subjectSelect.classList.add("input--error");
      isValid = false;
      if (!firstErrorElement) firstErrorElement = subjectSelect;
    } else {
      subjectSelect.classList.remove("input--error");
      subjectSelect.classList.add("input--valid");
    }

    // 이름 검증
    if (!validateName(nameInput.value)) {
      setInputState(nameBox, false);
      isValid = false;
      if (!firstErrorElement) firstErrorElement = nameInput;
    } else {
      setInputState(nameBox, true);
    }

    // 주민등록번호 검증
    if (!validateResident(residentF.value, residentB.value)) {
      setInputState(residentBox, false);
      isValid = false;
      if (!firstErrorElement) firstErrorElement = residentF;
    } else {
      setInputState(residentBox, true);
    }

    // 전화번호 검증
    if (!validatePhone(phoneF.value, phoneC.value, phoneB.value)) {
      setInputState(phoneBox, false);
      isValid = false;
      if (!firstErrorElement) firstErrorElement = phoneF;
    } else {
      setInputState(phoneBox, true);
    }

    // 동의 체크박스 확인
    if (!agree1.checked) {
      agree1Check.classList.remove("terms-check--error");
      void agree1Check.offsetWidth; // reflow 강제하여 애니메이션 재실행
      agree1Check.classList.add("terms-check--error");
      isValid = false;
      if (!firstErrorElement) firstErrorElement = agree1;
    } else {
      agree1Check.classList.remove("terms-check--error");
    }

    if (!agree2.checked) {
      agree2Check.classList.remove("terms-check--error");
      void agree2Check.offsetWidth; // reflow 강제하여 애니메이션 재실행
      agree2Check.classList.add("terms-check--error");
      isValid = false;
      if (!firstErrorElement) firstErrorElement = agree2;
    } else {
      agree2Check.classList.remove("terms-check--error");
    }

    // 첫 번째 에러 위치로 스크롤
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      if (firstErrorElement.focus) firstErrorElement.focus();
    }

    return isValid;
  }
  /* ---------- END - 폼 검증 ---------- */


  /* ---------- Input 입력 시 상태 리셋 ---------- */
  const patientInputs = document.querySelectorAll(".appointment-form__item-patient input");
  patientInputs.forEach(input => {
    input.addEventListener("input", () => {
      const inputBox = input.closest(".appointment-form__item-patient-input-box");
      if (inputBox) {
        inputBox.classList.remove("input--error", "input--valid");
      }
    });
  });

  // 진료과목 Select - change 시 에러 상태 리셋 (사용자가 값을 선택할 때만)
  const subjectSelect = document.querySelector(".appointment-form__item-subject-select");
  if (subjectSelect) {
    subjectSelect.addEventListener("change", () => {
      subjectSelect.classList.remove("input--error", "input--valid");
    });
  }

  // 동의 체크박스 - change 시 에러 상태 리셋
  const agree1 = document.getElementById("agree-1");
  const agree2 = document.getElementById("agree-2");
  if (agree1) {
    agree1.addEventListener("change", () => {
      const checkBox = agree1.closest(".appointment-form__terms-check");
      if (checkBox) {
        checkBox.classList.remove("terms-check--error");
      }
    });
  }
  if (agree2) {
    agree2.addEventListener("change", () => {
      const checkBox = agree2.closest(".appointment-form__terms-check");
      if (checkBox) {
        checkBox.classList.remove("terms-check--error");
      }
    });
  }
  /* ---------- END - Input 입력 시 상태 리셋 ---------- */


  /* ---------- 폼 제출 ---------- */
  const form = document.querySelector(".appointment-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // 검증 실패 시 중단
      if (!validateForm()) return;

      // 검증 성공 시 완료 메시지 후 메인페이지로 이동
      alert("예약이 완료되었습니다.");
      window.location.href = "/portfolio/well-life/index.html";
    });
  }
  /* ---------- END - 폼 제출 ---------- */
});

