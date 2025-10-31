document.addEventListener("DOMContentLoaded", () => {
  // header.html 불러오기
  fetch("/portfolio/website_publishing/well-life/includes/header.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector("header").innerHTML = data;
    });

  // sidebar.html 불러오기
  fetch("/portfolio/website_publishing/well-life/includes/sidebar.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector(".sidebar").innerHTML = data;
    });

  // footer.html 불러오기
  fetch("/portfolio/website_publishing/well-life/includes/footer.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector("footer").innerHTML = data;
    });
});
