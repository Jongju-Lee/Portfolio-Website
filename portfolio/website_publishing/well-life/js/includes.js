document.addEventListener("DOMContentLoaded", () => {
  // header.html 불러오기
  fetch("/portfolio/website_publishing/well-life/includes/header.html")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(data => {
      document.querySelector("header").innerHTML = data;
    })
    .catch(error => console.error("Header 로드 실패:", error));

  // sidebar.html 불러오기
  fetch("/portfolio/website_publishing/well-life/includes/sidebar.html")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(data => {
      document.querySelector(".sidebar").innerHTML = data;
    })
    .catch(error => console.error("Sidebar 로드 실패:", error));

  // footer.html 불러오기
  fetch("/portfolio/website_publishing/well-life/includes/footer.html")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(data => {
      document.querySelector("footer").innerHTML = data;
    })
    .catch(error => console.error("Footer 로드 실패:", error));
});
