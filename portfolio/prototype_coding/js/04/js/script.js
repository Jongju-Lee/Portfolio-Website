const $lists = document.querySelectorAll(".list");
const $leftBox = document.querySelector(".left_box");
const $rightBox = document.querySelector(".right_box");

for (let list of $lists) {
  list.addEventListener("dragstart", (e) => {
    let selected = e.target;

    $rightBox.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    $rightBox.addEventListener("drop", (e) => {
      $rightBox.appendChild(selected);
      selected.classList.add("dnd-board__item--drop");
      selected = null;
    });
    $leftBox.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    $leftBox.addEventListener("drop", (e) => {
      $leftBox.appendChild(selected);
      selected.classList.add("dnd-board__item--drop");
      selected = null;
    });
  });
}
