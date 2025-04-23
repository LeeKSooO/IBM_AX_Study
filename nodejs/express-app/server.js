const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // password decryption
const app = express();
const PORT = 3000;

// public 폴더를 정적 파일 폴더로 설정
// 현재는 API 전용 서버로 작성하므로 주석처리
/* 
-- app.use(express.static('public'))의 목적 --
public/ 폴더를 웹에서 바로 접근 가능하게 함
웹사이트 화면을 보여주는 front-end 정적 파일이 있을 때 사용
현재는 백앤드 전용 API이므로 추후 정적 파일 제공시 활성화
*/
//app.use(express.static('public'));

// 기본 라우트 (GET /)
app.get('/', (req, res) => {
  res.send('Welcome to the Express API Server!');
});


// JSON 파싱 미들웨어
app.use(express.json());

// MongoDB Connect
mongoose.connect('mongodb://localhost:27017/myDB', {
  useNewUrlParser:true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connection Success!'))
.catch(err => console.error('MongoDB Connection Failed'))

// 사용자 스키마 & 모델
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Password Hashing When Post User(Add User)
app.post('/users', async(req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashed });
  await newUser.save();
  res.status(201).json(newUser);
})

// Log-in with jwt token
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if(!user) return res.status(401).json({ message: '유저 없음' });

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(401).json({ message: '비밀번호 오류' });

  // JWT TOKEN 생성
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: '로그인 성공', token });
});

// Middleware of Authentication
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  console.log(header);
  if(!header) return res.status(401).json({ message: '토큰 없음' });
  
  const token = header.split(' ')[1]; // 뒷 토큰
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err) {
    res.status(403).json({ message: '유효하지 않은 토큰' });
  }
};

// find user
app.get('/users', async(req, res) => {
  const users = await User.find();
  console.log(`users : ${users}`)
  res.json(users);
});

// update user
app.put('/users/:id', async(req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  updated ? res.json(updated) : res.status(404).json({message: '수정할 사용자 없음'
  });
});

// delete user
app.delete('/users/:username', async(req, res) => {
  const deleted = await User.findOneAndDelete({username: req.params.username});
  deleted ? res.json({message: '삭제됨'}) : res.status(404).json({message:'삭제할 사용자 없음'});
});

// 3000번 포트로 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});