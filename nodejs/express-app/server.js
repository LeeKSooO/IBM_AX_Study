const express = require('express');
const app = express();
const PORT = 3000;

// public 폴더를 정적 파일 폴더로 설정
app.use(express.static('public'));

// 기본 라우트(ex : localhost:3000 -> index.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 80번 포트로 서버 실행
app.listen(PORT, () => {
  console.log('✅ 서버 실행 중: http://localhost:${PORT}');
});