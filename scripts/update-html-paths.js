const fs = require('fs');

// UTF-8 인코딩 유지하며 파일 읽기
const htmlPath = './index.html';
const content = fs.readFileSync(htmlPath, 'utf8');

// images/practical/practical-*.png를 .webp로 변경
const updatedContent = content.replace(
  /(images\/practical\/practical-[^"]+)\.png/g,
  '$1.webp'
);

// UTF-8 인코딩으로 저장
fs.writeFileSync(htmlPath, updatedContent, 'utf8');

console.log('✅ HTML 파일 업데이트 완료!');
console.log('경로 변경: images/practical/practical-*.png → *.webp');
