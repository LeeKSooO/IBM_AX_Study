// 1. 필요한 모듈 불러오기
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 2. express 인스턴스 생성
const app = express();

// 3. 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. 라우팅 처리
app.post('/', (req, res) => {
  const { id, password } = req.body;
  console.log('클라이언트 요청:', req.body);

  const file = path.join(__dirname, 'users.json');

  fs.readFile(file, 'utf8', (err, json) => {
    if (err) {
      console.error('파일 읽기 오류:', err);
      return res.status(500).json({ success: false });
    }

    let users;
    try {
      users = JSON.parse(json);
    } catch (e) {
      console.error('JSON 파싱 오류:', e.message);
      return res.status(500).json({ success: false });
    }

    const match = users.find(u => u.id === id && u.password === password);
    res.json({ success: !!match });
  });
});

// 5. 서버 시작
app.listen(3000, () => {
  console.log('http://localhost:3000');
});
